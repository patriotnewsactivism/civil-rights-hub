import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Send, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

interface ProfileSummary {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: ProfileRow["role"];
}

type Message = MessageRow;

export function DirectMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          toast.error("Unable to load your messages. Try signing in again.");
          return;
        }
        setCurrentUserId(data.user?.id ?? null);
      })
      .catch((error) => {
        if (!isMounted) return;
        toast.error(error instanceof Error ? error.message : "Unable to determine user session.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleMessages = useMemo(() => {
    if (!currentUserId) {
      return [] as Message[];
    }

    return messages.filter((message) => {
      // Messages table doesn't have soft delete columns, show all messages
      return true;
    });
  }, [currentUserId, messages]);

  const contacts = useMemo(() => {
    if (!currentUserId) {
      return [] as ProfileSummary[];
    }

    return profiles
      .filter((profile) => profile.id !== currentUserId)
      .sort((left, right) => (left.display_name ?? "").localeCompare(right.display_name ?? ""));
  }, [currentUserId, profiles]);

  const fetchProfiles = useCallback(async (participantIds: string[]) => {
    if (participantIds.length === 0) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, role")
      .in("id", participantIds);

    if (error) {
      toast.error("Failed to load contacts");
      return;
    }

    setProfiles((current) => {
      const map = new Map(current.map((profile) => [profile.id, profile] as const));
      for (const profile of data ?? []) {
        map.set(profile.id, profile);
      }
      return Array.from(map.values());
    });
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, role")
      .neq("id", currentUserId);

    if (error) {
      toast.error("Failed to load contacts");
      return;
    }

    setProfiles((current) => {
      const map = new Map(current.map((profile) => [profile.id, profile] as const));
      for (const profile of data ?? []) {
        map.set(profile.id, profile);
      }
      return Array.from(map.values());
    });
  }, [currentUserId]);

  const fetchMessages = useCallback(async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load messages");
      return;
    }

    const nextMessages = (data ?? []) as Message[];
    setMessages(nextMessages);

    const participantIds = Array.from(
      new Set(
        nextMessages.flatMap((message) => [message.sender_id, message.recipient_id])
      )
    );

    if (!participantIds.includes(currentUserId)) {
      participantIds.push(currentUserId);
    }

    await fetchProfiles(participantIds);
  }, [currentUserId, fetchProfiles]);

  const markAsRead = useCallback(
    async (message: Message) => {
      if (!currentUserId || message.is_read || message.recipient_id !== currentUserId) {
        return;
      }

      const { error } = await supabase
        .from("direct_messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", message.id)
        .eq("recipient_id", currentUserId);

      if (error) {
        toast.error("Unable to mark message as read");
        return;
      }

      setMessages((current) =>
        current.map((item) => (item.id === message.id ? { ...item, is_read: true, read_at: new Date().toISOString() } : item))
      );
    },
    [currentUserId]
  );

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedUserId || !currentUserId) {
      return;
    }

    const { error } = await supabase.from("direct_messages").insert({
      content: newMessage,
      sender_id: currentUserId,
      recipient_id: selectedUserId,
    });

    if (error) {
      toast.error("Failed to send message");
      return;
    }

    setNewMessage("");
    await fetchMessages();
  }, [currentUserId, fetchMessages, newMessage, selectedUserId]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    void fetchUsers();
    void fetchMessages();

    const channel = supabase
      .channel("direct-messages-stream")
      .on("postgres_changes", { event: "*", schema: "public", table: "direct_messages" }, () => {
        void fetchMessages();
        void fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, fetchMessages, fetchUsers]);

  const currentContact = useMemo(() => {
    if (!selectedUserId) return null;
    return profiles.find((profile) => profile.id === selectedUserId) ?? null;
  }, [profiles, selectedUserId]);

  const conversationMessages = useMemo(() => {
    if (!currentUserId || !selectedUserId) {
      return [] as Message[];
    }

    return visibleMessages.filter(
      (message) =>
        (message.sender_id === currentUserId && message.recipient_id === selectedUserId) ||
        (message.sender_id === selectedUserId && message.recipient_id === currentUserId)
    );
  }, [currentUserId, selectedUserId, visibleMessages]);

  useEffect(() => {
    if (!currentUserId) return;

    const unread = conversationMessages.filter(
      (message) => !message.is_read && message.recipient_id === currentUserId
    );

    if (unread.length === 0) {
      return;
    }

    unread.forEach((message) => {
      void markAsRead(message);
    });
  }, [conversationMessages, currentUserId, markAsRead]);

  return (
    <div className="grid gap-4 md:grid-cols-3 h-[600px]">
      <Card className="md:col-span-1">
        <CardHeader>
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contacts
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {contacts.map((user) => {
              const unreadCount = visibleMessages.filter(
                (message) =>
                  message.sender_id === user.id &&
                  message.recipient_id === currentUserId &&
                  !message.is_read &&
                  !message.is_deleted_by_recipient
              ).length;

              return (
                <button
                  key={user.id}
                  type="button"
                  className={`flex w-full cursor-pointer items-center gap-3 border-b p-4 text-left transition-colors hover:bg-accent ${
                    selectedUserId === user.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <Avatar>
                    <AvatarImage src={user.avatar_url ?? ""} />
                    <AvatarFallback>
                      {(user.display_name ?? "").charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{user.display_name ?? "Community member"}</p>
                    <p className="text-xs capitalize text-muted-foreground">{user.role ?? "user"}</p>
                  </div>
                  {unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
            {contacts.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">
                Start a new conversation by visiting a community member's profile.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        {currentContact ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentContact.avatar_url ?? ""} />
                  <AvatarFallback>
                    {(currentContact.display_name ?? "").charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{currentContact.display_name ?? "Community member"}</p>
                  <p className="text-xs capitalize text-muted-foreground">{currentContact.role ?? "user"}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender_id === currentUserId
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {conversationMessages.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                      No messages yet. Start the conversation below.
                    </p>
                  )}
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                  />
                  <Button onClick={() => void sendMessage()} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex h-full items-center justify-center text-muted-foreground">
            <p>Select a contact to start messaging</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
