import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Mail, Send, Inbox, Star, Trash2, Search, User, X, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import type { User } from "@supabase/supabase-js";

type DirectMessageRow = Database["public"]["Tables"]["direct_messages"]["Row"];
type UserProfileRow = Database["public"]["Tables"]["user_profiles"]["Row"];

type MessageProfile =
  | (Pick<UserProfileRow, "username" | "display_name"> & { id?: string | null; user_id?: string | null })
  | null;

type MessageWithProfiles = DirectMessageRow & {
  sender: MessageProfile;
  recipient: MessageProfile;
};

type ComposeFormState = {
  recipient_username: string;
  subject: string;
  content: string;
};

type MailboxView = "inbox" | "sent" | "compose";

const INITIAL_FORM_STATE: ComposeFormState = {
  recipient_username: "",
  subject: "",
  content: "",
};

export default function MessagingPanel() {
  const [messages, setMessages] = useState<MessageWithProfiles[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithProfiles | null>(null);
  const [view, setView] = useState<MailboxView>("inbox");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [composeForm, setComposeForm] = useState<ComposeFormState>(INITIAL_FORM_STATE);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadCurrentUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data.user ?? null);
  }, []);

  useEffect(() => {
    void loadCurrentUser();
  }, [loadCurrentUser]);

  const loadMessages = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      let query = supabase
        .from("direct_messages")
        .select(
          `
          *,
          sender:sender_id(username, display_name),
          recipient:recipient_id(username, display_name)
        `
        )
        .order("created_at", { ascending: false });

      if (view === "inbox") {
        query = query.eq("recipient_id", currentUser.id).eq("is_deleted_by_recipient", false);
      } else if (view === "sent") {
        query = query.eq("sender_id", currentUser.id).eq("is_deleted_by_sender", false);
      }

      const { data, error } = await query.returns<MessageWithProfiles[]>();

      if (error) throw error;
      setMessages(data ?? []);

      if (view === "inbox") {
        const unread = data?.filter((message) => !message.is_read).length ?? 0;
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
    if (!currentUser) return;

    try {
      const normalizedUsername = composeForm.recipient_username.trim().toLowerCase();
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("username", normalizedUsername)
        .single()
        .returns<Pick<UserProfileRow, "user_id">>();

      if (profileError || !profileData) {
        toast.error("User not found");
        return;
      }

      const { error } = await supabase.from("direct_messages").insert({
        sender_id: currentUser.id,
        recipient_id: profileData.user_id,
        subject: composeForm.subject || null,
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

  const toggleStar = async (message: MessageWithProfiles) => {
    if (!currentUser) return;

    try {
      const isSender = message.sender_id === currentUser.id;
      const updates: Partial<DirectMessageRow> = isSender
        ? { is_starred_by_sender: !message.is_starred_by_sender }
        : { is_starred_by_recipient: !message.is_starred_by_recipient };

      await supabase.from("direct_messages").update(updates).eq("id", message.id);
      void loadMessages();
    } catch (error) {
      console.error("Error toggling star:", error);
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
      const subject = message.subject?.toLowerCase() ?? "";
      const content = message.content?.toLowerCase() ?? "";
      const senderUsername = message.sender?.username?.toLowerCase() ?? "";
      return subject.includes(search) || content.includes(search) || senderUsername.includes(search);
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
                  <label className="mb-1 block text-sm font-medium text-foreground">To (username)</label>
                  <input
                    type="text"
                    value={composeForm.recipient_username}
                    onChange={(event) =>
                      setComposeForm((previous) => ({ ...previous, recipient_username: event.target.value }))
                    }
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-ring"
                    placeholder="username"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Subject (optional)</label>
                  <input
                    type="text"
                    value={composeForm.subject}
                    onChange={(event) => setComposeForm((previous) => ({ ...previous, subject: event.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-ring"
                    placeholder="Message subject"
                  />
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
                      {filteredMessages.map((message) => {
                        const isSender = message.sender_id === currentUser?.id;
                        const isStarred = isSender
                          ? Boolean(message.is_starred_by_sender)
                          : Boolean(message.is_starred_by_recipient);

                        return (
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
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold text-foreground">
                                  {view === "inbox"
                                    ? message.sender?.display_name || message.sender?.username || "Unknown"
                                    : message.recipient?.display_name || message.recipient?.username || "Unknown"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {isStarred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />}
                                {!message.is_read && view === "inbox" && <span className="h-2 w-2 rounded-full bg-primary" />}
                              </div>
                            </div>
                            <p className="text-sm font-medium text-foreground">{message.subject || "(No subject)"}</p>
                            <p className="line-clamp-2 text-sm text-muted-foreground">{message.content}</p>
                            <p className="text-xs text-muted-foreground/70">
                              {new Date(message.created_at).toLocaleDateString()}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="hidden flex-1 overflow-y-auto bg-card lg:block">
                  {selectedMessage ? (
                    <div className="space-y-4 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {selectedMessage.subject || "(No subject)"}
                          </h2>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>
                              {view === "inbox" ? "From:" : "To:"}{" "}
                              {view === "inbox"
                                ? selectedMessage.sender?.display_name || selectedMessage.sender?.username
                                : selectedMessage.recipient?.display_name || selectedMessage.recipient?.username}
                            </span>
                            <span>•</span>
                            <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleStar(selectedMessage)}
                            className={`rounded-lg p-2 transition-colors hover:bg-muted ${
                              (selectedMessage.sender_id === currentUser?.id
                              ? selectedMessage.is_starred_by_sender
                              : selectedMessage.is_starred_by_recipient)
                                ? "text-yellow-500"
                                : "text-muted-foreground"
                            }`}
                            title="Star"
                          >
                            <Star
                              className={`h-5 w-5 ${
                                (selectedMessage.sender_id === currentUser?.id
                                ? selectedMessage.is_starred_by_sender
                                : selectedMessage.is_starred_by_recipient)
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                          </button>
                          {view === "inbox" && (
                            <button
                              onClick={() => {
                                setComposeForm({
                                  recipient_username: selectedMessage.sender?.username ?? "",
                                  subject: `Re: ${selectedMessage.subject || ""}`,
                                  content: `\n\n--- Original Message ---\n${selectedMessage.content}`,
                                });
                                handleViewChange("compose");
                              }}
                              className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
                              title="Reply"
                            >
                              <Mail className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteMessage(selectedMessage.id)}
                            className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="rounded-xl border bg-background p-4">
                        <p className="whitespace-pre-wrap text-foreground">{selectedMessage.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-12 text-center">
                      <Mail className="mb-4 h-16 w-16 text-muted" />
                      <p className="text-muted-foreground">Select a message to read</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-card p-6 lg:hidden">
                  {selectedMessage ? (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold text-foreground">
                          {selectedMessage.subject || "(No subject)"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedMessage.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-background p-4">
                        <p className="whitespace-pre-wrap text-foreground">{selectedMessage.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">Select a message to read</div>
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
