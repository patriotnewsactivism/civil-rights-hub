import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, Upload, User, Shield, CheckCircle, Clock } from "lucide-react";

interface Profile {
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  role: string;
  location: string | null;
}

interface PrivacySettings {
  is_public: boolean;
  show_location: boolean;
  show_email: boolean;
}

interface VerificationStatus {
  pending: boolean;
  verified: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  journalist: "Journalist / Reporter",
  attorney: "Civil Rights Attorney",
  activist: "Activist / Organizer",
  user: "Community Member",
};

export function UserProfile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    is_public: true,
    show_location: false,
    show_email: false,
  });
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Role verification
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({ pending: false, verified: false });
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [verifyRole, setVerifyRole] = useState("journalist");
  const [verifyOrg, setVerifyOrg] = useState("");
  const [verifyDetail, setVerifyDetail] = useState("");
  const [submittingVerify, setSubmittingVerify] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      return;
    }

    if (data) {
      setProfile(data);
      setDisplayName(data.display_name || "");
      setBio(data.bio || "");
      setLocation(data.location || "");
    }

    // Fetch privacy settings from user_profiles
    const { data: upData } = await supabase
      .from("user_profiles")
      .select("is_public, show_location, show_email, is_verified")
      .eq("user_id", user.id)
      .single();

    if (upData) {
      setPrivacy({
        is_public: upData.is_public ?? true,
        show_location: upData.show_location ?? false,
        show_email: upData.show_email ?? false,
      });
      setVerificationStatus((prev) => ({ ...prev, verified: upData.is_verified ?? false }));
    }

    // Check if verification request pending
    const { data: verData } = await supabase
      .from("user_verification")
      .select("id, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (verData) {
      setVerificationStatus((prev) => ({ ...prev, pending: verData.status === "pending" }));
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      void fetchProfile();
    }
  }, [user, fetchProfile]);

  const updateProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio, location })
      .eq("id", user?.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      setEditing(false);
      await fetchProfile();
    }
  };

  const updatePrivacy = async (updates: Partial<PrivacySettings>) => {
    const next = { ...privacy, ...updates };
    setPrivacy(next);
    setSavingPrivacy(true);
    const { error } = await supabase
      .from("user_profiles")
      .update({
        is_public: next.is_public,
        show_location: next.show_location,
        show_email: next.show_email,
      })
      .eq("user_id", user?.id);
    setSavingPrivacy(false);
    if (error) {
      toast.error("Failed to save privacy settings");
      setPrivacy(privacy); // revert
    } else {
      toast.success("Privacy settings saved");
    }
  };

  const submitVerification = async () => {
    if (!verifyOrg.trim()) {
      toast.error("Please provide your organization or credential details");
      return;
    }
    setSubmittingVerify(true);
    const { error } = await supabase.from("user_verification").insert({
      user_id: user?.id,
      role: verifyRole,
      organization: verifyOrg,
      credential_detail: verifyDetail,
      status: "pending",
    });
    setSubmittingVerify(false);
    if (error) {
      toast.error("Failed to submit verification request");
    } else {
      toast.success("Verification request submitted! We'll review it shortly.");
      setShowVerifyForm(false);
      setVerificationStatus((prev) => ({ ...prev, pending: true }));
    }
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user?.id);

    if (updateError) {
      toast.error("Failed to update avatar");
    } else {
      toast.success("Avatar updated!");
      await fetchProfile();
    }
    setUploading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Main Profile Card */}
      <Card>
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
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.display_name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {profile.role && profile.role !== "user" && (
                    <Badge variant="secondary" className="capitalize">{profile.role}</Badge>
                  )}
                  {verificationStatus.verified && (
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {verificationStatus.pending && !verificationStatus.verified && (
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                      <Clock className="h-3 w-3 mr-1" />
                      Verification Pending
                    </Badge>
                  )}
                </div>
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
                <Input id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
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
              {privacy.show_location && profile.location && (
                <p className="text-sm text-muted-foreground">📍 {profile.location}</p>
              )}
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Privacy Shield */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Privacy Shield
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Control what information is visible to others. For journalists, attorneys, and activists we recommend keeping location and email hidden.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Public Profile</div>
                <div className="text-xs text-muted-foreground">Allow others to view your profile</div>
              </div>
              <Switch
                checked={privacy.is_public}
                onCheckedChange={(checked) => updatePrivacy({ is_public: checked })}
                disabled={savingPrivacy}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Show Location</div>
                <div className="text-xs text-muted-foreground">Display your city/state on your profile</div>
              </div>
              <Switch
                checked={privacy.show_location}
                onCheckedChange={(checked) => updatePrivacy({ show_location: checked })}
                disabled={savingPrivacy}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Show Email</div>
                <div className="text-xs text-muted-foreground">Display your email address publicly</div>
              </div>
              <Switch
                checked={privacy.show_email}
                onCheckedChange={(checked) => updatePrivacy({ show_email: checked })}
                disabled={savingPrivacy}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Verification */}
      {!verificationStatus.verified && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Get Verified
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {verificationStatus.pending ? (
              <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-400/10 rounded-lg p-3">
                <Clock className="h-4 w-4 shrink-0" />
                Your verification request is under review. We'll notify you when it's processed.
              </div>
            ) : showVerifyForm ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Verified members get a badge on their posts and appear in "People to Follow" suggestions. We verify journalists, attorneys, and activist organizers.
                </p>
                <div className="space-y-2">
                  <Label>Your Role</Label>
                  <Select value={verifyRole} onValueChange={setVerifyRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS)
                        .filter(([k]) => k !== "user")
                        .map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    {verifyRole === "attorney" ? "Bar Number & State Bar" :
                     verifyRole === "journalist" ? "Publication / Outlet Name" :
                     "Organization Name"}
                  </Label>
                  <Input
                    value={verifyOrg}
                    onChange={(e) => setVerifyOrg(e.target.value)}
                    placeholder={
                      verifyRole === "attorney" ? "e.g. 123456, California State Bar" :
                      verifyRole === "journalist" ? "e.g. The Guardian, ProPublica" :
                      "e.g. ACLU, BLM Local Chapter"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Additional Details (optional)</Label>
                  <Input
                    value={verifyDetail}
                    onChange={(e) => setVerifyDetail(e.target.value)}
                    placeholder="Website, LinkedIn, or other verification link"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={submitVerification} disabled={submittingVerify}>
                    {submittingVerify ? "Submitting..." : "Submit for Verification"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowVerifyForm(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Are you a journalist, attorney, or activist organizer? Get a verified badge to build trust with the community.
                </p>
                <Button variant="outline" onClick={() => setShowVerifyForm(true)}>
                  Request Verification
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
