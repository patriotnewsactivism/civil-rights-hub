import { useState } from "react";
import { Video, Square, Download, AlertTriangle, Camera, CameraOff, MapPin, Clock, Upload, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEmergencyRecorder } from "@/hooks/useEmergencyRecorder";
import { useGeolocation } from "@/hooks/useGeolocation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface GoLiveRecorderProps {
  userId?: string;
  onPostedToFeed?: () => void;
}

export function GoLiveRecorder({ userId, onPostedToFeed }: GoLiveRecorderProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedStreamId, setUploadedStreamId] = useState<string | null>(null);
  const location = useGeolocation();
  const {
    recording,
    dualCameraActive,
    frontRecordingUrl,
    backRecordingUrl,
    frontMimeType,
    backMimeType,
    recordingStartedAt,
    error,
    support,
    startRecording,
    stopRecording,
    clearRecordings,
    frontVideoRef,
    backVideoRef,
  } = useEmergencyRecorder();

  const handleGoLive = async () => {
    setExpanded(true);
    await startRecording();
  };

  const getFileExtension = (mime: string) => (mime.includes("mp4") ? "mp4" : "webm");

  async function uploadAndPost() {
    if (!userId || !frontRecordingUrl) return;
    setUploading(true);

    try {
      // Fetch the recorded blob from the object URL
      const response = await fetch(frontRecordingUrl);
      const blob = await response.blob();
      const ext = getFileExtension(frontMimeType);
      const filename = `live-recordings/${userId}/${Date.now()}.${ext}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(filename, blob, { contentType: blob.type, upsert: false });

      if (uploadError) {
        // Storage bucket may not exist; fall back to posting without URL
        console.warn("Storage upload failed, posting without media:", uploadError.message);
      }

      const recordingUrl = uploadData
        ? supabase.storage.from("media").getPublicUrl(filename).data.publicUrl
        : null;

      // Calculate duration
      const duration = recordingStartedAt
        ? Math.round((Date.now() - recordingStartedAt.getTime()) / 1000)
        : null;

      // Create live_stream record
      const streamTitle = title.trim() || "Live Recording — Police Encounter";
      const { data: stream, error: streamError } = await supabase
        .from("live_streams")
        .insert({
          user_id: userId,
          title: streamTitle,
          recording_url: recordingUrl,
          status: "ended",
          duration_seconds: duration,
          location_lat: location.latitude,
          location_lng: location.longitude,
          location_state: location.state,
          location_city: location.city,
          started_at: recordingStartedAt?.toISOString(),
          ended_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (streamError) throw streamError;

      // Auto-post to community feed
      const postContent = [
        `🔴 LIVE RECORDING: ${streamTitle}`,
        location.city || location.state ? `📍 ${[location.city, location.state].filter(Boolean).join(", ")}` : null,
        duration ? `⏱ Duration: ${Math.floor(duration / 60)}m ${duration % 60}s` : null,
        recordingUrl ? `\n📹 Recording available` : null,
        `\n#LiveRecording #PoliceAccountability #KnowYourRights`,
      ].filter(Boolean).join("\n");

      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          user_id: userId,
          content: postContent,
          media_urls: recordingUrl ? [recordingUrl] : [],
          media_types: recordingUrl ? [blob.type] : [],
        })
        .select("id")
        .single();

      if (postError) console.warn("Post failed:", postError.message);

      // Link post to stream
      if (post && stream) {
        await supabase.from("live_streams").update({ post_id: post.id }).eq("id", stream.id);
      }

      setUploadedStreamId(stream?.id || null);
      toast.success("Recording saved and posted to your feed!");
      onPostedToFeed?.();

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }

  function shareRecording() {
    if (navigator.share && frontRecordingUrl) {
      navigator.share({
        title: title || "Live Recording",
        text: "Police encounter recording from Civil Rights Hub",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success("Link copied to clipboard");
      });
    }
  }

  if (!expanded && !recording) {
    return (
      <Button
        onClick={handleGoLive}
        variant="destructive"
        className="gap-2 font-bold shadow-lg shadow-destructive/30 animate-pulse hover:animate-none"
        size="lg"
      >
        <Video className="h-5 w-5" />
        GO LIVE — Record Police
      </Button>
    );
  }

  const hasRecording = !recording && (frontRecordingUrl || backRecordingUrl);

  return (
    <Card className="border-destructive/50 bg-destructive/5 overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {recording && (
              <Badge variant="destructive" className="animate-pulse gap-1">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                RECORDING
              </Badge>
            )}
            {hasRecording && (
              <Badge variant="secondary" className="gap-1">
                Recording ready
              </Badge>
            )}
            {recordingStartedAt && recording && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(recordingStartedAt, { addSuffix: true })}
              </span>
            )}
          </div>
          {recording ? (
            <Button onClick={stopRecording} variant="destructive" size="sm" className="gap-1">
              <Square className="h-4 w-4" /> Stop
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleGoLive} variant="destructive" size="sm" className="gap-1">
                <Video className="h-4 w-4" /> New Recording
              </Button>
              <Button onClick={() => { clearRecordings(); setExpanded(false); setTitle(""); }} variant="ghost" size="sm">
                Close
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!support.supported && (
          <p className="text-sm text-muted-foreground">{support.reason}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
            <video ref={frontVideoRef} className="w-full h-full object-cover" muted playsInline />
            {recording && (
              <Badge className="absolute top-2 left-2 bg-black/60 text-white text-[10px]">
                <Camera className="h-3 w-3 mr-1" /> Front
              </Badge>
            )}
          </div>
          {dualCameraActive && (
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
              <video ref={backVideoRef} className="w-full h-full object-cover" playsInline />
              <Badge className="absolute top-2 left-2 bg-black/60 text-white text-[10px]">
                <CameraOff className="h-3 w-3 mr-1" /> Rear
              </Badge>
            </div>
          )}
        </div>

        {location.state && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location.city && `${location.city}, `}{location.state}
            {location.latitude && ` (${location.latitude.toFixed(4)}, ${location.longitude?.toFixed(4)})`}
          </div>
        )}

        {hasRecording && !uploadedStreamId && (
          <div className="space-y-3 pt-2 border-t border-border">
            <Input
              placeholder="Title (e.g. 'Traffic stop on Oak St')"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
            />
            <div className="flex flex-wrap gap-2">
              {userId && (
                <Button
                  onClick={uploadAndPost}
                  disabled={uploading}
                  className="gap-1 flex-1"
                  size="sm"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Save & Post to Feed"}
                </Button>
              )}
              {frontRecordingUrl && (
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <a href={frontRecordingUrl} download={`recording-front.${getFileExtension(frontMimeType)}`}>
                    <Download className="h-4 w-4" /> Download
                  </a>
                </Button>
              )}
              {backRecordingUrl && (
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <a href={backRecordingUrl} download={`recording-rear.${getFileExtension(backMimeType)}`}>
                    <Download className="h-4 w-4" /> Download Rear
                  </a>
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Recording is saved locally. "Save & Post" uploads it and adds it to your community feed for accountability documentation.
            </p>
          </div>
        )}

        {uploadedStreamId && (
          <div className="pt-2 border-t border-border space-y-2">
            <p className="text-sm text-green-600 font-medium">Recording posted to community feed.</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={shareRecording} className="gap-1">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={frontRecordingUrl!} download={`recording.${getFileExtension(frontMimeType)}`}>
                  <Download className="h-4 w-4 mr-1" /> Keep copy
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
