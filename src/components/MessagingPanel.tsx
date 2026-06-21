import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  Mail, Send, Inbox, Trash2, Search, User as UserIcon, X,
  MessageSquare, Users, Plus, ChevronLeft, Check, CheckCheck, Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

interface Conversation {
  id: string;
  name: string | null;
  is_group: boolean;
  last_message_at: string;
  last_message_preview: string | null;
  members?: ConvMember[];
  unreadCount?: number;
}

interface ConvMember {
  user_id: string;
  is_admin: boolean;
  last_read_at: string | null;
  profile?: UserProfile | null;
}

interface ConvMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  is_deleted: boolean;
  reply_to_id: string | null;
  created_at: string;
  edited_at: string | null;
  sender?: UserProfile | null;
}

type PanelView = "list" | "chat" | "new";

const ROLE_COLORS: Record<string, string> = {
  attorney: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  journalist: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  activist: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export default function MessagingPanel() {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConvMessage[]>([]);
  const [view, setView] = useState<PanelView>("list");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [draft, setDraft] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    supabase.from("user_profiles").select("*").eq("user_id", currentUser.id).single()
      .then(({ data }) => setCurrentProfile(data as UserProfile | null));
    loadConversations();
    loadAllUsers();
  }, [currentUser]);

  // Realtime: new messages in active conversation
  useEffect(() => {
    if (!activeConv || !currentUser) return;
    const ch = supabase.channel(`conv:${activeConv.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "conversation_messages",
        filter: `conversation_id=eq.${activeConv.id}`,
      }, async (payload) => {
        const msg = payload.new as ConvMessage;
        if (msg.sender_id === currentUser.id) return; // already added optimistically
        const { data: profile } = await supabase
          .from("user_profiles").select("*").eq("user_id", msg.sender_id).single();
        setMessages((prev) => [...prev, { ...msg, sender: profile as UserProfile }]);
        scrollToBottom();
        markConvRead(activeConv.id);
      })
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "typing_indicators",
        filter: `conversation_id=eq.${activeConv.id}`,
      }, async (payload) => {
        const ti = payload.new as { user_id: string };
        if (ti.user_id === currentUser.id) return;
        const { data: p } = await supabase.from("user_profiles").select("display_name").eq("user_id", ti.user_id).single();
        const name = (p as any)?.display_name || "Someone";
        setTypingUsers((prev) => prev.includes(name) ? prev : [...prev, name]);
        setTimeout(() => setTypingUsers((prev) => prev.filter((n) => n !== name)), 3000);
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [activeConv?.id, currentUser]);

  async function loadConversations() {
    if (!currentUser) return;
    setLoading(true);

    const { data: memberships } = await supabase
      .from("conversation_members")
      .select("conversation_id, last_read_at")
      .eq("user_id", currentUser.id);

    if (!memberships?.length) { setLoading(false); return; }

    const convIds = memberships.map((m) => m.conversation_id);
    const { data: convs } = await supabase
      .from("conversations")
      .select("*")
      .in("id", convIds)
      .order("last_message_at", { ascending: false });

    if (!convs?.length) { setLoading(false); return; }

    // Load members for each conversation
    const { data: allMembers } = await supabase
      .from("conversation_members")
      .select("*")
      .in("conversation_id", convIds);

    const memberUserIds = [...new Set((allMembers || []).map((m) => m.user_id))];
    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("*")
      .in("user_id", memberUserIds);

    const profileMap = new Map((profiles || []).map((p) => [(p as UserProfile).user_id, p as UserProfile]));
    const myReadMap = new Map(memberships.map((m) => [m.conversation_id, m.last_read_at]));

    const enriched: Conversation[] = (convs || []).map((c) => {
      const cMembers: ConvMember[] = (allMembers || [])
        .filter((m) => m.conversation_id === c.id)
        .map((m) => ({ ...m, profile: profileMap.get(m.user_id) || null }));

      const myLastRead = myReadMap.get(c.id);
      const unreadCount = myLastRead
        ? 0 // would need message count query — simplified here
        : 0;

      return { ...c, members: cMembers, unreadCount };
    });

    setConversations(enriched);
    setLoading(false);
  }

  async function loadAllUsers() {
    if (!currentUser) return;
    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .neq("user_id", currentUser.id)
      .order("display_name");
    setAllUsers((data || []) as UserProfile[]);
  }

  async function openConversation(conv: Conversation) {
    setActiveConv(conv);
    setView("chat");
    setMsgLoading(true);
    setMessages([]);

    const { data: msgs } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true });

    if (msgs?.length) {
      const senderIds = [...new Set(msgs.map((m) => m.sender_id))];
      const { data: profiles } = await supabase
        .from("user_profiles").select("*").in("user_id", senderIds);
      const pm = new Map((profiles || []).map((p) => [(p as UserProfile).user_id, p as UserProfile]));
      setMessages(msgs.map((m) => ({ ...m, sender: pm.get(m.sender_id) || null })));
    }

    setMsgLoading(false);
    scrollToBottom();
    markConvRead(conv.id);
  }

  async function markConvRead(convId: string) {
    if (!currentUser) return;
    await supabase.from("conversation_members")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", convId)
      .eq("user_id", currentUser.id);
  }

  function scrollToBottom() {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  async function handleTyping() {
    if (!currentUser || !activeConv) return;
    await supabase.from("typing_indicators").upsert({
      conversation_id: activeConv.id,
      user_id: currentUser.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "conversation_id,user_id" });
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(async () => {
      await supabase.from("typing_indicators")
        .delete().eq("conversation_id", activeConv.id).eq("user_id", currentUser.id);
    }, 3000);
  }

  async function sendMessage(e?: FormEvent) {
    e?.preventDefault();
    if (!currentUser || !activeConv || !draft.trim()) return;
    const content = draft.trim();
    setDraft("");

    // Optimistic insert
    const optimistic: ConvMessage = {
      id: crypto.randomUUID(),
      conversation_id: activeConv.id,
      sender_id: currentUser.id,
      content,
      media_url: null,
      media_type: null,
      is_deleted: false,
      reply_to_id: null,
      created_at: new Date().toISOString(),
      edited_at: null,
      sender: currentProfile,
    };
    setMessages((prev) => [...prev, optimistic]);
    scrollToBottom();

    const { error } = await supabase.from("conversation_messages").insert({
      conversation_id: activeConv.id,
      sender_id: currentUser.id,
      content,
    });

    if (error) {
      toast.error("Failed to send message");
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setDraft(content);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
    void handleTyping();
  }

  async function startDirectMessage(userId: string) {
    if (!currentUser) return;

    // Check if a 1:1 conversation already exists
    const { data: existing } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", currentUser.id);

    if (existing?.length) {
      const myConvIds = existing.map((m) => m.conversation_id);
      const { data: theirMemberships } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq("user_id", userId)
        .in("conversation_id", myConvIds);

      if (theirMemberships?.length) {
        // Find 1:1 conversation (not group)
        const sharedId = theirMemberships[0].conversation_id;
        const existing = conversations.find((c) => c.id === sharedId);
        if (existing) { await openConversation(existing); setNewDialogOpen(false); return; }
      }
    }

    // Create new 1:1 conversation
    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({ is_group: false, created_by: currentUser.id })
      .select("id")
      .single();

    if (error || !conv) { toast.error("Failed to start conversation"); return; }

    await supabase.from("conversation_members").insert([
      { conversation_id: conv.id, user_id: currentUser.id, is_admin: true },
      { conversation_id: conv.id, user_id: userId, is_admin: false },
    ]);

    await loadConversations();
    setNewDialogOpen(false);
    const { data: newConv } = await supabase.from("conversations").select("*").eq("id", conv.id).single();
    if (newConv) await openConversation(newConv as Conversation);
  }

  async function createGroupConversation() {
    if (!currentUser || selectedUsers.length < 1) return;
    const name = groupName.trim() || "Group Chat";

    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({ is_group: true, name, created_by: currentUser.id })
      .select("id")
      .single();

    if (error || !conv) { toast.error("Failed to create group"); return; }

    const members = [
      { conversation_id: conv.id, user_id: currentUser.id, is_admin: true },
      ...selectedUsers.map((uid) => ({ conversation_id: conv.id, user_id: uid, is_admin: false })),
    ];
    await supabase.from("conversation_members").insert(members);

    setNewDialogOpen(false);
    setSelectedUsers([]);
    setGroupName("");
    await loadConversations();
    const { data: newConv } = await supabase.from("conversations").select("*").eq("id", conv.id).single();
    if (newConv) await openConversation(newConv as Conversation);
  }

  function getConvName(conv: Conversation): string {
    if (conv.name) return conv.name;
    if (!currentUser) return "Conversation";
    const others = (conv.members || []).filter((m) => m.user_id !== currentUser.id);
    return others.map((m) => m.profile?.display_name || "Member").join(", ") || "Conversation";
  }

  function getConvAvatar(conv: Conversation): string {
    if (!currentUser) return "?";
    const others = (conv.members || []).filter((m) => m.user_id !== currentUser.id);
    return (others[0]?.profile?.display_name || "?").charAt(0).toUpperCase();
  }

  const filteredConvs = conversations.filter((c) => {
    if (!searchTerm) return true;
    const name = getConvName(c).toLowerCase();
    const preview = (c.last_message_preview || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || preview.includes(searchTerm.toLowerCase());
  });

  const filteredUsers = allUsers.filter((u) =>
    !userSearch || (u.display_name || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-lg" style={{ minHeight: "600px" }}>
      <div className="flex h-[600px] lg:h-[700px]">

        {/* Sidebar — conversation list */}
        <div className={`flex flex-col border-r border-border bg-background w-full lg:w-72 xl:w-80 ${view !== "list" ? "hidden lg:flex" : "flex"}`}>
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-bold text-lg flex-1">Messages</h2>
              <Button size="sm" variant="outline" onClick={() => setNewDialogOpen(true)} className="gap-1 h-8">
                <Plus className="h-4 w-4" /> New
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-input bg-background"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="mx-auto mb-3 h-10 w-10 text-muted" />
                <p className="text-sm text-muted-foreground">No conversations yet.</p>
                <Button size="sm" variant="outline" className="mt-3 gap-1" onClick={() => setNewDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> Start one
                </Button>
              </div>
            ) : (
              filteredConvs.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className={`w-full flex items-start gap-3 px-3 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 ${activeConv?.id === conv.id ? "bg-primary/8" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {conv.is_group ? <Users className="h-4 w-4" /> : getConvAvatar(conv)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-medium text-sm truncate">{getConvName(conv)}</span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {conv.last_message_at && formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.last_message_preview || "No messages yet"}
                    </p>
                    {conv.is_group && <Badge variant="secondary" className="mt-1 text-[10px] h-4">Group</Badge>}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className={`flex flex-col flex-1 bg-background ${view !== "chat" ? "hidden lg:flex" : "flex"}`}>
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-muted-foreground">
              <MessageSquare className="h-14 w-14 text-muted" />
              <p className="text-sm">Select a conversation or start a new one</p>
              <Button size="sm" variant="outline" onClick={() => setNewDialogOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" /> New Message
              </Button>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
                <button onClick={() => setView("list")} className="lg:hidden p-1">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                  {activeConv.is_group ? <Users className="h-4 w-4" /> : getConvAvatar(activeConv)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{getConvName(activeConv)}</p>
                  {activeConv.is_group && (
                    <p className="text-xs text-muted-foreground">
                      {activeConv.members?.length || 0} members
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {msgLoading ? (
                  <div className="flex justify-center pt-10">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center pt-10 text-sm text-muted-foreground">
                    No messages yet. Say hello!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.sender_id === currentUser?.id;
                    const senderName = msg.sender?.display_name || "Member";
                    const role = msg.sender?.role;

                    return (
                      <div key={msg.id} className={`flex gap-2 items-end ${isOwn ? "flex-row-reverse" : ""}`}>
                        {!isOwn && (
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            {senderName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                          {!isOwn && activeConv.is_group && (
                            <div className="flex items-center gap-1 mb-0.5 px-1">
                              <span className="text-xs font-medium text-foreground/80">{senderName}</span>
                              {role && ROLE_COLORS[role] && (
                                <span className={`text-[9px] px-1 py-0.5 rounded-full font-medium ${ROLE_COLORS[role]}`}>
                                  {role}
                                </span>
                              )}
                            </div>
                          )}
                          <div className={`rounded-2xl px-3 py-2 text-sm ${
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted text-foreground rounded-bl-sm"
                          }`}>
                            {msg.is_deleted ? (
                              <em className="text-muted-foreground text-xs">Message deleted</em>
                            ) : (
                              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            )}
                          </div>
                          <div className={`flex items-center gap-1 mt-0.5 px-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isOwn && (
                              <CheckCheck className="h-3 w-3 text-primary" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pl-9">
                    <span className="flex gap-0.5">
                      {[0,1,2].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                    {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose bar */}
              <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t border-border bg-card">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  style={{ maxHeight: "120px" }}
                />
                <Button type="submit" size="icon" disabled={!draft.trim()} className="h-9 w-9 flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* New message / group dialog */}
      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search community members..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background"
              />
            </div>

            {selectedUsers.length > 1 && (
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name (optional)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background"
              />
            )}

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedUsers.map((uid) => {
                  const u = allUsers.find((x) => x.user_id === uid);
                  return (
                    <Badge key={uid} variant="secondary" className="gap-1">
                      {u?.display_name || "Member"}
                      <button onClick={() => setSelectedUsers((p) => p.filter((id) => id !== uid))}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            <div className="max-h-52 overflow-y-auto space-y-1">
              {filteredUsers.map((u) => {
                const selected = selectedUsers.includes(u.user_id);
                return (
                  <button
                    key={u.user_id}
                    onClick={() => {
                      if (selectedUsers.length === 0) {
                        // Direct message
                        startDirectMessage(u.user_id);
                      } else {
                        setSelectedUsers((p) =>
                          selected ? p.filter((id) => id !== u.user_id) : [...p, u.user_id]
                        );
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors ${selected ? "bg-primary/10" : ""}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs flex-shrink-0">
                      {(u.display_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.display_name || "Community Member"}</p>
                      {u.role && ROLE_COLORS[u.role] && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${ROLE_COLORS[u.role]}`}>
                          {u.role}
                        </span>
                      )}
                    </div>
                    {selected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {selectedUsers.length > 1 && (
              <Button onClick={createGroupConversation} className="w-full gap-1">
                <Users className="h-4 w-4" />
                Create Group ({selectedUsers.length + 1} people)
              </Button>
            )}

            {selectedUsers.length === 1 && (
              <p className="text-xs text-muted-foreground text-center">
                Click another name to create a group, or click the selected name to start a direct message.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
