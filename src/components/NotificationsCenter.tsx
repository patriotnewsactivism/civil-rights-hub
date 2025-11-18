import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Heart, MessageCircle, Share2, UserPlus, AtSign, CheckCheck, Trash2, Reply, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { User } from "@supabase/supabase-js";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
type UserProfileRow = Database["public"]["Tables"]["user_profiles"]["Row"];

type NotificationWithProfile = NotificationRow & {
  from_user:
    | (Pick<UserProfileRow, "username" | "display_name" | "role"> & { id?: string | null; user_id?: string | null })
    | null;
};

type NotificationFilter = "all" | "unread";

type NotificationIconConfig = {
  icon: LucideIcon;
  color: string;
  bg: string;
};

const NOTIFICATION_ICON_MAP: Record<NotificationRow["type"], NotificationIconConfig> & {
  default: NotificationIconConfig;
} = {
  like: { icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  comment: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-50" },
  share: { icon: Share2, color: "text-green-500", bg: "bg-green-50" },
  follow: { icon: UserPlus, color: "text-purple-500", bg: "bg-purple-50" },
  mention: { icon: AtSign, color: "text-amber-500", bg: "bg-amber-50" },
  reply: { icon: Reply, color: "text-indigo-500", bg: "bg-indigo-50" },
  message: { icon: MessageCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  violation_comment: { icon: MessageCircle, color: "text-rose-500", bg: "bg-rose-50" },
  thread_reply: { icon: Reply, color: "text-sky-500", bg: "bg-sky-50" },
  badge_earned: { icon: Award, color: "text-yellow-500", bg: "bg-yellow-50" },
  default: { icon: Bell, color: "text-muted-foreground", bg: "bg-muted" },
};

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<NotificationWithProfile[]>([]);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const loadCurrentUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data.user ?? null);
  }, []);

  useEffect(() => {
    void loadCurrentUser();
  }, [loadCurrentUser]);

  const loadNotifications = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      let query = supabase
        .from("notifications")
        .select(
          `
          *,
          from_user:from_user_id(username, display_name, role)
        `
        )
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (filter === "unread") {
        query = query.eq("is_read", false);
      }

      const { data, error } = await query.returns<NotificationWithProfile[]>();
      if (error) throw error;
      setNotifications(data ?? []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, filter]);

  useEffect(() => {
    if (!currentUser) return;
    void loadNotifications();
  }, [currentUser, filter, loadNotifications]);

  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel(`notifications-${currentUser.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${currentUser.id}` },
        () => {
          void loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, loadNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId);
      setNotifications((previous) => previous.map((notification) => (notification.id === notificationId ? { ...notification, is_read: true } : notification)));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", currentUser.id)
        .eq("is_read", false);
      setNotifications((previous) => previous.map((notification) => ({ ...notification, is_read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await supabase.from("notifications").delete().eq("id", notificationId);
      setNotifications((previous) => previous.filter((notification) => notification.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationText = (notification: NotificationWithProfile) => {
    const fromUser = notification.from_user?.display_name || notification.from_user?.username || "Someone";

    switch (notification.type) {
      case "like":
        return `${fromUser} liked your post`;
      case "comment":
        return `${fromUser} commented on your post`;
      case "share":
        return `${fromUser} shared your post`;
      case "follow":
        return `${fromUser} started following you`;
      case "mention":
        return `${fromUser} mentioned you`;
      case "reply":
        return `${fromUser} replied to your comment`;
      case "message":
        return `${fromUser} sent you a message`;
      case "violation_comment":
        return `${fromUser} commented on your violation report`;
      case "thread_reply":
        return `${fromUser} replied to your thread`;
      case "badge_earned":
        return `${fromUser} earned a badge`;
      default:
        return notification.content || "New notification";
    }
  };

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.is_read).length, [notifications]);

  const getIconConfig = (type: NotificationRow["type"]) => NOTIFICATION_ICON_MAP[type] ?? NOTIFICATION_ICON_MAP.default;

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-lg">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center text-3xl font-bold text-foreground">
              <Bell className="mr-3 h-8 w-8 text-primary" /> Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-muted-foreground">You have {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 rounded-lg border border-input px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <CheckCheck className="h-5 w-5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === "unread" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <Bell className="mx-auto mb-4 h-12 w-12 text-muted" />
            <p className="text-muted-foreground">
              {filter === "unread" ? "No unread notifications" : "You're all caught up"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const iconConfig = getIconConfig(notification.type);
              const Icon = iconConfig.icon;

              return (
                <div
                  key={notification.id}
                  className={`rounded-2xl border bg-background p-4 shadow-sm transition-all hover:shadow-md ${
                    !notification.is_read ? "border-l-4 border-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconConfig.bg}`}>
                      <Icon className={`h-6 w-6 ${iconConfig.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-foreground">{getNotificationText(notification)}</p>
                      {notification.content && (
                        <p className="text-sm text-muted-foreground">{notification.content}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.created_at ?? new Date().toISOString()).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
                          title="Mark as read"
                        >
                          <CheckCheck className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
