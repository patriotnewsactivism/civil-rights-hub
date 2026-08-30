import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ChevronLeft, Loader2, MessageSquare, Plus, Search, Send, ShieldBan, Users, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  createGroupConversation,
  getConversationMessages,
  getOrCreateDirectConversation,
  listMyConversations,
  markConversationRead,
  sendConversationMessage,
  type ConversationMessage,
  type ConversationSummary,
} from "@/services/communityMessaging";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

interface ConversationMember {
  user_id: string;
  is_admin: boolean;
  last_read_at: string | null;
  profile: UserProfile | null;
}

interface ConversationView extends ConversationSummary {
  members: ConversationMember[];
}

interface MessageView extends ConversationMessage {
  sender: UserProfile | null;
}

type PanelView = "list" | "chat";

const PROFILE_FIELDS = "id,user_id,display_name,avatar_url,role" as const;
const MESSAGE_PAGE_SIZE = 50;

const ROLE_LABELS: Record<string, string> = {
  attorney: "Attorney",
  journalist: "Journalist",
  activist: "Activist",
  moderator: "Moderator",
  admin: "Administrator",
};

export default function MessagingPanel() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationView[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationView | null>(null);
  const [messages, setMessages] = useState<MessageView[]>([]);
  const [directory, setDirectory] = useState<UserProfile[]>([]);
  const [view, setView] = useState<PanelView>("list");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [draft, setDraft] = useState("");
  const [conversationSearch, setConversationSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }));
  }, []);

  const hydrateConversationMembers = useCallback(async (summaries: ConversationSummary[]): Promise<ConversationView[]> => {
    if (!summaries.length) return [];
    const ids = summaries.map((conversation) => conversation.id);

    const { data: members, error: memberError } = await supabase
      .from("conversation_members")
      .select("conversation_id,user_id,is_admin,last_read_at")
      .in("conversation_id", ids);
    if (memberError) throw memberError;

    const userIds = [...new Set((members ?? []).map((member) => member.user_id))];
    let profiles: UserProfile[] = [];
    if (userIds.length) {
      const { data, error } = await supabase.from("user_profiles").select(PROFILE_FIELDS).in("user_id", userIds);
      if (error) throw error;
      profiles = (data ?? []) as UserProfile[];
    }

    const profileMap = new Map(profiles.map((profile) => [profile.user_id, profile]));
    return summaries.map((summary) => ({
      ...summary,
      unread_count: Number(summary.unread_count ?? 0),
      members: (members ?? [])
        .filter((member) => member.conversation_id === summary.id)
        .map((member) => ({
          user_id: member.user_id,
          is_admin: member.is_admin,
          last_read_at: member.last_read_at,
          profile: profileMap.get(member.user_id) ?? null,
        })),
    }));
  }, []);

  const refreshConversations = useCallback(async (): Promise<ConversationView[]> => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return [];
    }

    try {
      const summaries = await listMyConversations(75);
      const hydrated = await hydrateConversationMembers(summaries);
      setConversations(hydrated);
      setActiveConversation((current) => current ? hydrated.find((item) => item.id === current.id) ?? current : null);
      return hydrated;
    } catch (error) {
      console.error("Failed to load conversations", error);
      toast.error(error instanceof Error ? error.message : "Failed to load conversations");
      return [];
    } finally {
      setLoading(false);
    }
  }, [hydrateConversationMembers, user]);

  const loadDirectory = useCallback(async () => {
    if (!user) {
      setDirectory([]);
      return;
    }
    const { data, error } = await supabase
      .from("user_profiles")
      .select(PROFILE_FIELDS)
      .neq("user_id", user.id)
      .order("display_name", { ascending: true });
    if (error) {
      console.error("Failed to load message directory", error);
      return;
    }
    setDirectory((data ?? []) as UserProfile[]);
  }, [user]);

  const hydrateMessages = useCallback(async (rawMessages: ConversationMessage[]): Promise<MessageView[]> => {
    const senderIds = [...new Set(rawMessages.map((message) => message.sender_id))];
    let profiles: UserProfile[] = [];
    if (senderIds.length) {
      const { data, error } = await supabase.from("user_profiles").select(PROFILE_FIELDS).in("user_id", senderIds);
      if (error) throw error;
      profiles = (data ?? []) as UserProfile[];
    }
    const profileMap = new Map(profiles.map((profile) => [profile.user_id, profile]));
    return rawMessages.map((message) => ({ ...message, sender: profileMap.get(message.sender_id) ?? null }));
  }, []);

  const loadMessages = useCallback(async (conversationId: string, reset = true) => {
    try {
      if (reset) setMessageLoading(true);
      const before = reset || !messages.length ? null : messages[0];
      const page = await getConversationMessages(conversationId, {
        limit: MESSAGE_PAGE_SIZE,
        beforeCreatedAt: before?.created_at ?? null,
        beforeId: before?.id ?? null,
      });
      const chronological = [...page].reverse();
      const hydrated = await hydrateMessages(chronological);
      setHasOlderMessages(page.length === MESSAGE_PAGE_SIZE);
      setMessages((current) => reset ? hydrated : [...hydrated, ...current]);
      if (reset) scrollToBottom();
    } catch (error) {
      console.error("Failed to load messages", error);
      toast.error(error instanceof Error ? error.message : "Failed to load messages");
    } finally {
      if (reset) setMessageLoading(false);
    }
  }, [hydrateMessages, messages, scrollToBottom]);

  const openConversation = useCallback(async (conversation: ConversationView) => {
    setActiveConversation(conversation);
    setView("chat");
    setMessages([]);
    await loadMessages(conversation.id, true);
    try {
      await markConversationRead(conversation.id);
      await refreshConversations();
    } catch (error) {
      console.error("Failed to update read state", error);
    }
  }, [loadMessages, refreshConversations]);

  useEffect(() => {
    setLoading(true);
    void Promise.all([refreshConversations(), loadDirectory()]);
  }, [refreshConversations, loadDirectory]);

  useEffect(() => {
    if (!user) return;
    const membershipChannel = supabase
      .channel(`conversation-memberships:${user.id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "conversation_members",
        filter: `user_id=eq.${user.id}`,
      }, () => void refreshConversations())
      .subscribe();

    return () => { void supabase.removeChannel(membershipChannel); };
  }, [refreshConversations, user]);

  useEffect(() => {
    if (!user || !activeConversation) return;
    const conversationId = activeConversation.id;
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "conversation_messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, () => {
        void loadMessages(conversationId, true);
        void markConversationRead(conversationId).catch(() => undefined);
        void refreshConversations();
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "typing_indicators",
        filter: `conversation_id=eq.${conversationId}`,
      }, async () => {
        const { data } = await supabase
          .from("typing_indicators")
          .select("user_id")
          .eq("conversation_id", conversationId)
          .neq("user_id", user.id);
        const typingIds = (data ?? []).map((entry) => entry.user_id);
        const names = activeConversation.members
          .filter((member) => typingIds.includes(member.user_id))
          .map((member) => member.profile?.display_name || "Someone");
        setTypingUsers(names);
      })
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [activeConversation, loadMessages, refreshConversations, user]);

  useEffect(() => () => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
  }, []);

  const handleTyping = useCallback(async () => {
    if (!user || !activeConversation) return;
    await supabase.from("typing_indicators").upsert({
      conversation_id: activeConversation.id,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "conversation_id,user_id" });

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      void supabase.from("typing_indicators")
        .delete()
        .eq("conversation_id", activeConversation.id)
        .eq("user_id", user.id);
    }, 2500);
  }, [activeConversation, user]);

  const sendMessage = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!activeConversation || !draft.trim() || sending) return;
    const content = draft.trim();
    setSending(true);
    try {
      await sendConversationMessage(activeConversation.id, content);
      setDraft("");
      await loadMessages(activeConversation.id, true);
      await markConversationRead(activeConversation.id);
      await refreshConversations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
      return;
    }
    void handleTyping();
  };

  const startDirectMessage = async (otherUserId: string) => {
    try {
      const conversationId = await getOrCreateDirectConversation(otherUserId);
      const refreshed = await refreshConversations();
      const conversation = refreshed.find((item) => item.id === conversationId);
      if (!conversation) throw new Error("Conversation was created but could not be loaded.");
      setNewDialogOpen(false);
      setSelectedUsers([]);
      await openConversation(conversation);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start conversation");
    }
  };

  const createGroup = async () => {
    if (!selectedUsers.length) return;
    try {
      const conversationId = await createGroupConversation(groupName.trim(), selectedUsers);
      const refreshed = await refreshConversations();
      const conversation = refreshed.find((item) => item.id === conversationId);
      if (!conversation) throw new Error("Group was created but could not be loaded.");
      setNewDialogOpen(false);
      setSelectedUsers([]);
      setGroupName("");
      await openConversation(conversation);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create group");
    }
  };

  const leaveConversation = async () => {
    if (!user || !activeConversation) return;
    const { error } = await supabase
      .from("conversation_members")
      .delete()
      .eq("conversation_id", activeConversation.id)
      .eq("user_id", user.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setActiveConversation(null);
    setMessages([]);
    setView("list");
    await refreshConversations();
  };

  const conversationName = useCallback((conversation: ConversationView) => {
    if (conversation.name) return conversation.name;
    if (!user) return "Conversation";
    const others = conversation.members.filter((member) => member.user_id !== user.id);
    return others.map((member) => member.profile?.display_name || "Member").join(", ") || "Conversation";
  }, [user]);

  const filteredConversations = useMemo(() => {
    const needle = conversationSearch.trim().toLowerCase();
    if (!needle) return conversations;
    return conversations.filter((conversation) =>
      conversationName(conversation).toLowerCase().includes(needle)
      || (conversation.last_message_preview ?? "").toLowerCase().includes(needle),
    );
  }, [conversationName, conversationSearch, conversations]);

  const filteredUsers = useMemo(() => {
    const needle = userSearch.trim().toLowerCase();
    if (!needle) return directory;
    return directory.filter((profile) => (profile.display_name ?? "").toLowerCase().includes(needle));
  }, [directory, userSearch]);

  if (!user) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <MessageSquare className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
        <h3 className="font-semibold">Sign in to use community messages</h3>
        <p className="mt-2 text-sm text-muted-foreground">Messages are visible only to conversation members.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-lg">
      <div className="flex h-[650px] lg:h-[720px]">
        <aside className={`${view === "chat" ? "hidden lg:flex" : "flex"} w-full flex-col border-r bg-background lg:w-80`}>
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="font-semibold">Messages</h2>
              <p className="text-xs text-muted-foreground">Private community conversations</p>
            </div>
            <Button size="icon" variant="outline" onClick={() => setNewDialogOpen(true)} aria-label="Start conversation">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="border-b p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm" placeholder="Search conversations" value={conversationSearch} onChange={(event) => setConversationSearch(event.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No conversations yet. Start one with the + button.</div>
            ) : filteredConversations.map((conversation) => (
              <button key={conversation.id} onClick={() => void openConversation(conversation)} className={`w-full border-b p-4 text-left hover:bg-muted/50 ${activeConversation?.id === conversation.id ? "bg-muted" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {conversation.is_group ? <Users className="h-4 w-4" /> : conversationName(conversation).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">{conversationName(conversation)}</span>
                      {conversation.unread_count > 0 && <Badge>{conversation.unread_count}</Badge>}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{conversation.last_message_preview || "No messages yet"}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className={`${view === "list" ? "hidden lg:flex" : "flex"} min-w-0 flex-1 flex-col`}>
          {!activeConversation ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div><MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" /><p className="font-medium">Select a conversation</p><p className="text-sm text-muted-foreground">Messages use server-side membership, block, and rate-limit checks.</p></div>
            </div>
          ) : (
            <>
              <header className="flex items-center justify-between border-b p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setView("list")}><ChevronLeft className="h-5 w-5" /></Button>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{conversationName(activeConversation)}</h3>
                    <p className="text-xs text-muted-foreground">{activeConversation.members.length} member{activeConversation.members.length === 1 ? "" : "s"}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => void leaveConversation()}><X className="mr-1 h-4 w-4" /> Leave</Button>
              </header>

              <div className="flex-1 overflow-y-auto p-4">
                {hasOlderMessages && (
                  <div className="mb-4 text-center"><Button variant="outline" size="sm" onClick={() => void loadMessages(activeConversation.id, false)}>Load older messages</Button></div>
                )}
                {messageLoading ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading messages</div>
                ) : messages.length === 0 ? (
                  <div className="py-16 text-center text-sm text-muted-foreground">No messages yet. Start the conversation.</div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const mine = message.sender_id === user.id;
                      return (
                        <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            {!mine && <p className="mb-1 text-[11px] font-medium opacity-70">{message.sender?.display_name || "Community member"}</p>}
                            <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
                            <p className="mt-1 text-[10px] opacity-60">{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {typingUsers.length > 0 && <div className="px-4 pb-1 text-xs text-muted-foreground">{typingUsers.join(", ")} typing…</div>}
              <form onSubmit={sendMessage} className="border-t p-3">
                <div className="flex items-end gap-2">
                  <textarea className="min-h-[44px] max-h-32 flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm" placeholder="Write a message" value={draft} maxLength={4000} onChange={(event) => { setDraft(event.target.value); void handleTyping(); }} onKeyDown={handleKeyDown} />
                  <Button type="submit" size="icon" disabled={sending || !draft.trim()} aria-label="Send message">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-1 text-right text-[10px] text-muted-foreground">{draft.length}/4000</div>
              </form>
            </>
          )}
        </main>
      </div>

      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Start a conversation</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm" placeholder="Find a community member" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} />
            </div>
            <div className="max-h-64 overflow-y-auto rounded-md border">
              {filteredUsers.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground"><ShieldBan className="mx-auto mb-2 h-5 w-5" />No available members match this search.</div>
              ) : filteredUsers.map((profile) => {
                const selected = selectedUsers.includes(profile.user_id);
                return (
                  <div key={profile.user_id} className="flex items-center gap-3 border-b p-3 last:border-b-0">
                    <button className="min-w-0 flex-1 text-left" onClick={() => void startDirectMessage(profile.user_id)}>
                      <p className="truncate font-medium">{profile.display_name || "Community member"}</p>
                      {profile.role && ROLE_LABELS[profile.role] && <p className="text-xs text-muted-foreground">{ROLE_LABELS[profile.role]}</p>}
                    </button>
                    <Button type="button" size="sm" variant={selected ? "default" : "outline"} onClick={() => setSelectedUsers((current) => selected ? current.filter((id) => id !== profile.user_id) : [...current, profile.user_id])}>
                      {selected ? "Selected" : "Add to group"}
                    </Button>
                  </div>
                );
              })}
            </div>
            {selectedUsers.length > 0 && (
              <div className="space-y-3 rounded-md border p-3">
                <input className="w-full rounded-md border bg-background px-3 py-2 text-sm" maxLength={120} placeholder="Group name (optional)" value={groupName} onChange={(event) => setGroupName(event.target.value)} />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">{selectedUsers.length + 1} members including you</span>
                  <Button onClick={() => void createGroup()}><Users className="mr-2 h-4 w-4" />Create group</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
