import { Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Notifications feature - placeholder until notifications table is added
export default function NotificationsCenter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </CardTitle>
        <CardDescription>
          Stay updated on activity related to your posts, messages, and community interactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <Bell className="mx-auto mb-4 h-12 w-12 text-muted" />
          <p className="text-muted-foreground">
            Notifications will appear here when other users interact with your content.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
