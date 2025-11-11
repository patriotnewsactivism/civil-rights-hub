import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Send, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  read: boolean;
  sender: {
    display_name: string;
    avatar_url: string | null;
  };
  recipient: {
    display_name: string;
    avatar_url: string | null;
  };
}

interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  role: string;
}

export function DirectMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
      if (data.user?.id) {
        fetchUsers();
        fetchMessages();
      }
    });

    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchMessages)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, role')
      .neq('id', currentUserId);
    
    if (data) setUsers(data);
  };

  const fetchMessages = async () => {
    if (!currentUserId) return;

    const { data } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        sender_id,
        recipient_id,
        read,
        sender:profiles!sender_id (display_name, avatar_url),
        recipient:profiles!recipient_id (display_name, avatar_url)
      `)
      .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
      .order('created_at', { ascending: true });

    if (data) setMessages(data as any);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUserId) return;

    const { error } = await supabase.from('messages').insert({
      content: newMessage,
      sender_id: currentUserId,
      recipient_id: selectedUser.id,
    });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
    }
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)
      .eq('recipient_id', currentUserId);
  };

  const conversationMessages = messages.filter(
    (m) =>
      (m.sender_id === currentUserId && m.recipient_id === selectedUser?.id) ||
      (m.sender_id === selectedUser?.id && m.recipient_id === currentUserId)
  );

  useEffect(() => {
    conversationMessages.forEach((msg) => {
      if (!msg.read && msg.recipient_id === currentUserId) {
        markAsRead(msg.id);
      }
    });
  }, [conversationMessages, currentUserId]);

  return (
    <div className="grid md:grid-cols-3 gap-4 h-[600px]">
      <Card className="md:col-span-1">
        <CardHeader>
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contacts
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {users.map((user) => {
              const unreadCount = messages.filter(
                (m) => m.sender_id === user.id && m.recipient_id === currentUserId && !m.read
              ).length;

              return (
                <div
                  key={user.id}
                  className={`p-4 cursor-pointer hover:bg-accent transition-colors border-b ${
                    selectedUser?.id === user.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback>{user.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.display_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        {selectedUser ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar_url || ""} />
                  <AvatarFallback>{selectedUser.display_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedUser.display_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{selectedUser.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {conversationMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender_id === currentUserId
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="h-full flex items-center justify-center text-muted-foreground">
            <p>Select a contact to start messaging</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
