import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Mail, Send, Inbox, Star, Trash2, Search, User as UserIcon, X, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type DirectMessageRow = Database["public"]["Tables"]["direct_messages"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type MessageProfile =
  | (Pick<ProfileRow, "display_name"> & { id?: string | null })
  | null;

type MessageWithProfiles = DirectMessageRow & {
  sender: MessageProfile;
  recipient: MessageProfile;
};

type ComposeFormState = {
  recipient_id: string;
  content: string;
};

type MailboxView = "inbox" | "sent" | "compose";

const INITIAL_FORM_STATE: ComposeFormState = {
  recipient_id: "",
  content: "",
};

export default function MessagingPanel() {
  const [messages, setMessages] = useState<MessageWithProfiles[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithProfiles | null>(null);
  const [view, setView] = useState<MailboxView>("inbox");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [composeForm, setComposeForm] = useState<ComposeFormState>(INITIAL_FORM_STATE);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [availableUsers, setAvailableUsers] = useState<ProfileRow[]>([]);

  const loadCurrentUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data.user ?? null);
  }, []);

  useEffect(() => {
    void loadCurrentUser();
  }, [loadCurrentUser]);

  const loadAvailableUsers = useCallback(async () => {
    if (!currentUser) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", currentUser.id)
      .order("display_name");

    setAvailableUsers(data ?? []);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      void loadAvailableUsers();
    }
  }, [currentUser, loadAvailableUsers]);

  const loadMessages = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      let query = supabase
        .from("direct_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (view === "inbox") {
        query = query.eq("recipient_id", currentUser.id).eq("is_deleted_by_recipient", false);
      } else if (view === "sent") {
        query = query.eq("sender_id", currentUser.id).eq("is_deleted_by_sender", false);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch profiles for senders and recipients
      const userIds = new Set<string>();
      data?.forEach((msg) => {
        userIds.add(msg.sender_id);
        userIds.add(msg.recipient_id);
      });

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", Array.from(userIds));

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

      const messagesWithProfiles: MessageWithProfiles[] = (data ?? []).map((msg) => ({
        ...msg,
        sender: profileMap.get(msg.sender_id) ?? null,
        recipient: profileMap.get(msg.recipient_id) ?? null,
      }));

      setMessages(messagesWithProfiles);

      if (view === "inbox") {
        const unread = messagesWithProfiles.filter((message) => !message.is_read).length;
        setUnreadCount(unread);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [currentUser, view]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser || !composeForm.recipient_id) return;

    try {
      const { error } = await supabase.from("direct_messages").insert({
        sender_id: currentUser.id,
        recipient_id: composeForm.recipient_id,
        content: composeForm.content,
      });

      if (error) throw error;

      toast.success("Message sent!");
      setComposeForm(INITIAL_FORM_STATE);
      setView("sent");
      void loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      const message = error instanceof Error ? error.message : "Failed to send message";
      toast.error(message);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from("direct_messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", messageId);

      void loadMessages();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!currentUser) return;

    try {
      const message = messages.find((item) => item.id === messageId);
      if (!message) return;

      const isSender = message.sender_id === currentUser.id;
      const updates: Partial<DirectMessageRow> = isSender
        ? { is_deleted_by_sender: true }
        : { is_deleted_by_recipient: true };

      await supabase.from("direct_messages").update(updates).eq("id", messageId);
      toast.success("Message deleted");
      setSelectedMessage(null);
      void loadMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const filteredMessages = useMemo(() => {
    if (!searchTerm) return messages;
    const search = searchTerm.toLowerCase();

    return messages.filter((message) => {
      const content = message.content?.toLowerCase() ?? "";
      const senderName = message.sender?.display_name?.toLowerCase() ?? "";
      return content.includes(search) || senderName.includes(search);
    });
  }, [messages, searchTerm]);

  const handleViewChange = (newView: MailboxView) => {
    setView(newView);
    if (newView !== "compose") {
      setSelectedMessage(null);
    }
  };

  return (
    <div className="rounded-3xl border bg-card p-4 shadow-lg">
      <div className="flex min-h-[700px] flex-col gap-4 lg:flex-row">
        <div className="flex flex-col rounded-2xl border bg-background lg:w-64">
          <div className="p-4">
            <button
              onClick={() => handleViewChange("compose")}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-primary py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
              <span>New Message</span>
            </button>
          </div>

          <nav className="space-y-1 px-2 pb-4">
            <button
              onClick={() => handleViewChange("inbox")}
              className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                view === "inbox" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              <Inbox className="h-5 w-5" />
              <span className="flex-1 text-left">Inbox</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleViewChange("sent")}
              className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                view === "sent" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              <Send className="h-5 w-5" />
              <span>Sent</span>
            </button>
          </nav>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border bg-background">
          {view === "compose" ? (
            <div className="space-y-6 p-6">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">New Message</h2>
              </div>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">To</label>
                  <select
                    value={composeForm.recipient_id}
                    onChange={(event) =>
                      setComposeForm((previous) => ({ ...previous, recipient_id: event.target.value }))
                    }
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select a recipient...</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.display_name || user.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Message</label>
                  <textarea
                    value={composeForm.content}
                    onChange={(event) => setComposeForm((previous) => ({ ...previous, content: event.target.value }))}
                    rows={10}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-ring"
                    placeholder="Write your message..."
                    required
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComposeForm(INITIAL_FORM_STATE);
                      handleViewChange("inbox");
                    }}
                    className="rounded-lg border border-input px-6 py-2 text-foreground transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="border-b border-border bg-card p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-ring"
                    placeholder="Search messages..."
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                <div className="w-full border-r border-border bg-card lg:w-96">
                  {loading ? (
                    <div className="flex items-center justify-center p-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="p-12 text-center">
                      <Mail className="mx-auto mb-4 h-12 w-12 text-muted" />
                      <p className="text-muted-foreground">No messages</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border overflow-y-auto">
                      {filteredMessages.map((message) => (
                        <button
                          key={message.id}
                          onClick={() => {
                            setSelectedMessage(message);
                            if (!message.is_read && view === "inbox") {
                              void markAsRead(message.id);
                            }
                          }}
                          className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors ${
                            selectedMessage?.id === message.id ? "bg-primary/10" : "hover:bg-muted"
                          } ${!message.is_read && view === "inbox" ? "bg-primary/5" : ""}`}
                        >
                          <div className="flex w-full items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">
                                {view === "inbox"
                                  ? message.sender?.display_name || "Unknown"
                                  : message.recipient?.display_name || "Unknown"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {!message.is_read && view === "inbox" && <span className="h-2 w-2 rounded-full bg-primary" />}
                            </div>
                          </div>
                          <p className="line-clamp-2 text-sm text-muted-foreground">{message.content}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {message.created_at && new Date(message.created_at).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden flex-1 overflow-y-auto bg-card lg:block">
                  {selectedMessage ? (
                    <div className="space-y-4 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">Message</h2>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <UserIcon className="h-4 w-4" />
                            <span>
                              {view === "inbox" ? "From:" : "To:"}{" "}
                              {view === "inbox"
                                ? selectedMessage.sender?.display_name
                                : selectedMessage.recipient?.display_name}
                            </span>
                            <span>•</span>
                            <span>{selectedMessage.created_at && new Date(selectedMessage.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => deleteMessage(selectedMessage.id)}
                            className="rounded-lg p-2 text-destructive transition-colors hover:bg-muted"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-background/50 p-6">
                        <p className="whitespace-pre-wrap text-foreground">{selectedMessage.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <Mail className="mx-auto mb-4 h-16 w-16 text-muted" />
                        <p className="text-muted-foreground">Select a message to read</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
