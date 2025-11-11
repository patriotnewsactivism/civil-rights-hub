import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Upload, User } from "lucide-react";

interface Profile {
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  role: string;
  location: string | null;
}

export function UserProfile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (data) {
      setProfile(data);
      setDisplayName(data.display_name || "");
      setBio(data.bio || "");
      setLocation(data.location || "");
    }
  };

  const updateProfile = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        bio,
        location,
      })
      .eq('id', user?.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      setEditing(false);
      fetchProfile();
    }
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user?.id);

    if (updateError) {
      toast.error("Failed to update avatar");
    } else {
      toast.success("Avatar updated!");
      fetchProfile();
    }

    setUploading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  if (!profile) return null;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
              </Avatar>
              {editing && (
                <>
                  <Input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    onChange={uploadAvatar}
                    accept="image/*"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.display_name}</h2>
              {profile.role && profile.role !== 'user' && (
                <Badge variant="secondary" className="mt-1 capitalize">{profile.role}</Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={updateProfile}>Save Changes</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            {profile.bio && <p className="text-muted-foreground">{profile.bio}</p>}
            {profile.location && (
              <p className="text-sm text-muted-foreground">📍 {profile.location}</p>
            )}
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
