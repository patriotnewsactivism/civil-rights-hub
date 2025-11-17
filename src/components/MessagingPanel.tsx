import { useState, useEffect } from 'react';
import { Mail, Send, Inbox, Star, Trash2, Search, User, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function MessagingPanel() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [view, setView] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [composeForm, setComposeForm] = useState({
    recipient_username: '',
    subject: '',
    content: '',
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadMessages();
    }
  }, [view, currentUser]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadMessages = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      let query = supabase
        .from('direct_messages')
        .select(`
          *,
          sender:sender_id(id, username, display_name),
          recipient:recipient_id(id, username, display_name)
        `)
        .order('created_at', { ascending: false });

      if (view === 'inbox') {
        query = query.eq('recipient_id', currentUser.id).eq('is_deleted_by_recipient', false);
      } else if (view === 'sent') {
        query = query.eq('sender_id', currentUser.id).eq('is_deleted_by_sender', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);

      // Update unread count
      if (view === 'inbox') {
        const unread = data?.filter(m => !m.is_read).length || 0;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      // Find recipient by username
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('username', composeForm.recipient_username.toLowerCase())
        .single();

      if (!profileData) {
        toast.error('User not found');
        return;
      }

      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: currentUser.id,
          recipient_id: profileData.user_id,
          subject: composeForm.subject || null,
          content: composeForm.content,
        });

      if (error) throw error;

      toast.success('Message sent!');
      setComposeForm({ recipient_username: '', subject: '', content: '' });
      setView('sent');
      loadMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('direct_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId);

      loadMessages();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const toggleStar = async (message: any) => {
    try {
      const isSender = message.sender_id === currentUser?.id;
      const field = isSender ? 'is_starred_by_sender' : 'is_starred_by_recipient';
      const currentValue = isSender ? message.is_starred_by_sender : message.is_starred_by_recipient;

      await supabase
        .from('direct_messages')
        .update({ [field]: !currentValue })
        .eq('id', message.id);

      loadMessages();
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const isSender = message.sender_id === currentUser?.id;
      const field = isSender ? 'is_deleted_by_sender' : 'is_deleted_by_recipient';

      await supabase
        .from('direct_messages')
        .update({ [field]: true })
        .eq('id', messageId);

      toast.success('Message deleted');
      setSelectedMessage(null);
      loadMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      msg.subject?.toLowerCase().includes(search) ||
      msg.content?.toLowerCase().includes(search) ||
      msg.sender?.username?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-4">
          <button
            onClick={() => setView('compose')}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>New Message</span>
          </button>
        </div>

        <nav className="px-2">
          <button
            onClick={() => setView('inbox')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
              view === 'inbox' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
            }`}
          >
            <Inbox className="h-5 w-5" />
            <span className="flex-1 text-left">Inbox</span>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setView('sent')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              view === 'sent' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
            }`}
          >
            <Send className="h-5 w-5" />
            <span>Sent</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {view === 'compose' ? (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">New Message</h2>
            <form onSubmit={sendMessage} className="max-w-2xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  To (username)
                </label>
                <input
                  type="text"
                  value={composeForm.recipient_username}
                  onChange={(e) => setComposeForm({ ...composeForm, recipient_username: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Subject (optional)
                </label>
                <input
                  type="text"
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Message
                </label>
                <textarea
                  value={composeForm.content}
                  onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Write your message..."
                  required
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComposeForm({ recipient_username: '', subject: '', content: '' });
                    setView('inbox');
                  }}
                  className="border border-input text-foreground hover:bg-muted py-2 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="p-4 bg-card border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Search messages..."
                />
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-hidden flex">
              <div className="w-96 bg-card border-r border-border overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center p-12">
                    <Mail className="h-12 w-12 text-muted mx-auto mb-4" />
                    <p className="text-muted-foreground">No messages</p>
                  </div>
                ) : (
                  <div>
                    {filteredMessages.map((message) => {
                      const isSender = message.sender_id === currentUser?.id;
                      const isStarred = isSender ? message.is_starred_by_sender : message.is_starred_by_recipient;

                      return (
                        <div
                          key={message.id}
                          onClick={() => {
                            setSelectedMessage(message);
                            if (!message.is_read && view === 'inbox') {
                              markAsRead(message.id);
                            }
                          }}
                          className={`p-4 border-b border-border cursor-pointer hover:bg-muted transition-colors ${
                            selectedMessage?.id === message.id ? 'bg-primary/10' : ''
                          } ${!message.is_read && view === 'inbox' ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">
                                {view === 'inbox'
                                  ? message.sender?.display_name || message.sender?.username
                                  : message.recipient?.display_name || message.recipient?.username}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              {!message.is_read && view === 'inbox' && (
                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">
                            {message.subject || '(No subject)'}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {new Date(message.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Message Detail */}
              <div className="flex-1 bg-card overflow-y-auto">
                {selectedMessage ? (
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                          {selectedMessage.subject || '(No subject)'}
                        </h2>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>
                            {view === 'inbox' ? 'From: ' : 'To: '}
                            {view === 'inbox'
                              ? selectedMessage.sender?.display_name || selectedMessage.sender?.username
                              : selectedMessage.recipient?.display_name || selectedMessage.recipient?.username}
                          </span>
                          <span>•</span>
                          <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleStar(selectedMessage)}
                          className={`p-2 hover:bg-muted rounded-lg transition-colors ${
                            (selectedMessage.sender_id === currentUser?.id ? selectedMessage.is_starred_by_sender : selectedMessage.is_starred_by_recipient)
                              ? 'text-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                          title="Star"
                        >
                          <Star className={`h-5 w-5 ${
                            (selectedMessage.sender_id === currentUser?.id ? selectedMessage.is_starred_by_sender : selectedMessage.is_starred_by_recipient)
                              ? 'fill-current'
                              : ''
                          }`} />
                        </button>
                        {view === 'inbox' && (
                          <button
                            onClick={() => {
                              setComposeForm({
                                recipient_username: selectedMessage.sender?.username || '',
                                subject: `Re: ${selectedMessage.subject || ''}`,
                                content: `\n\n--- Original Message ---\n${selectedMessage.content}`,
                              });
                              setView('compose');
                            }}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Reply"
                          >
                            <Mail className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(selectedMessage.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap text-foreground">{selectedMessage.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Mail className="h-16 w-16 text-muted mx-auto mb-4" />
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
  );
}
