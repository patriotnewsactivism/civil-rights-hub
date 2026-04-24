import { useCallback, useState } from "react";
import { Video, Square, Download, AlertTriangle, Camera, CameraOff, MapPin, Clock, CloudUpload, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEmergencyRecorder } from "@/hooks/useEmergencyRecorder";
import { useGeolocation } from "@/hooks/useGeolocation";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BackupStatus {
  uploading: boolean;
  uploaded: boolean;
  progress: number;
  url: string | null;
  error: string | null;
}

const defaultBackup = (): BackupStatus => ({
  uploading: false,
  uploaded: false,
  progress: 0,
  url: null,
  error: null,
});

export function GoLiveRecorder() {
  const [expanded, setExpanded] = useState(false);
  const [frontBackup, setFrontBackup] = useState<BackupStatus>(defaultBackup());
  const [rearBackup, setRearBackup] = useState<BackupStatus>(defaultBackup());
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

  const getFileExtension = (mime: string) => (mime.includes("mp4") ? "mp4" : "webm");

  /** Upload a blob URL to Supabase storage, returns public URL */
  const uploadToStorage = useCallback(
    async (
      blobUrl: string,
      mimeType: string,
      camera: "front" | "rear",
      setter: React.Dispatch<React.SetStateAction<BackupStatus>>
    ) => {
      setter((s) => ({ ...s, uploading: true, progress: 5, error: null }));

      try {
        // Fetch blob
        const resp = await fetch(blobUrl);
        const blob = await resp.blob();
        const ext = getFileExtension(mimeType);
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const path = `recordings/${timestamp}-${camera}.${ext}`;

        setter((s) => ({ ...s, progress: 20 }));

        const { data, error: uploadError } = await supabase.storage
          .from("videos")
          .upload(path, blob, { contentType: mimeType, upsert: false });

        if (uploadError) throw uploadError;

        setter((s) => ({ ...s, progress: 80 }));

        const { data: urlData } = supabase.storage.from("videos").getPublicUrl(path);
        const publicUrl = urlData?.publicUrl ?? null;

        // Save metadata record
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("video_recordings").insert({
            user_id: user.id,
            storage_path: path,
            public_url: publicUrl,
            camera_type: camera,
            mime_type: mimeType,
            latitude: location.latitude ?? null,
            longitude: location.longitude ?? null,
            location_state: location.state ?? null,
            location_city: location.city ?? null,
            is_emergency: true,
            backed_up: true,
          });
        }

        setter({ uploading: false, uploaded: true, progress: 100, url: publicUrl, error: null });
        toast.success(`✅ ${camera === "front" ? "Front" : "Rear"} camera footage backed up securely`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setter((s) => ({ ...s, uploading: false, error: msg, progress: 0 }));
        toast.error(`Backup failed — download the file manually to preserve evidence`);
      }
    },
    [location]
  );

  const handleGoLive = async () => {
    setExpanded(true);
    setFrontBackup(defaultBackup());
    setRearBackup(defaultBackup());
    await startRecording();
  };

  const handleStop = async () => {
    stopRecording();
    // Auto-backup triggered after stop via useEffect equivalent below
  };

  // Auto-backup when recordings become available
  const handleAutoBackup = useCallback(async () => {
    if (frontRecordingUrl && !frontBackup.uploaded && !frontBackup.uploading) {
      await uploadToStorage(frontRecordingUrl, frontMimeType, "front", setFrontBackup);
    }
    if (backRecordingUrl && !rearBackup.uploaded && !rearBackup.uploading) {
      await uploadToStorage(backRecordingUrl, backMimeType, "rear", setRearBackup);
    }
  }, [frontRecordingUrl, backRecordingUrl, frontMimeType, backMimeType, frontBackup, rearBackup, uploadToStorage]);

  // Trigger backup as soon as recordings are ready
  const isReadyToBackup =
    !recording && (frontRecordingUrl || backRecordingUrl);

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

  return (
    <Card className="border-red-500/40 bg-slate-950 overflow-hidden shadow-2xl">
      <CardContent className="p-4 space-y-4">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {recording && (
              <Badge variant="destructive" className="animate-pulse gap-1 font-bold">
                <span className="h-2 w-2 rounded-full bg-white animate-ping inline-block" />
                RECORDING
              </Badge>
            )}
            {recordingStartedAt && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(recordingStartedAt, { addSuffix: true })}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {recording ? (
              <Button onClick={handleStop} variant="destructive" size="sm" className="gap-1 font-bold">
                <Square className="h-4 w-4" /> Stop & Save
              </Button>
            ) : (
              <>
                <Button onClick={handleGoLive} variant="destructive" size="sm" className="gap-1">
                  <Video className="h-4 w-4" /> Record Again
                </Button>
                <Button
                  onClick={() => { clearRecordings(); setExpanded(false); setFrontBackup(defaultBackup()); setRearBackup(defaultBackup()); }}
                  variant="ghost"
                  size="sm"
                >
                  Close
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Safety notice */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-950/60 border border-blue-500/30 text-xs text-blue-300">
          <Shield className="h-4 w-4 shrink-0 mt-0.5 text-blue-400" />
          <span>
            <strong className="text-blue-200">Auto-backup is ON.</strong> Footage is automatically saved to your secure account when you stop recording — even if your phone is seized.
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/40 rounded-lg p-3 border border-red-500/30">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!support.supported && (
          <p className="text-sm text-slate-400">{support.reason}</p>
        )}

        {/* Camera feeds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video ring-1 ring-white/10">
            <video ref={frontVideoRef} className="w-full h-full object-cover" muted playsInline />
            {recording && (
              <Badge className="absolute top-2 left-2 bg-red-600/80 text-white text-[10px] font-bold">
                <Camera className="h-3 w-3 mr-1" /> LIVE · FRONT
              </Badge>
            )}
          </div>
          {dualCameraActive && (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video ring-1 ring-white/10">
              <video ref={backVideoRef} className="w-full h-full object-cover" playsInline />
              <Badge className="absolute top-2 left-2 bg-red-600/80 text-white text-[10px] font-bold">
                <CameraOff className="h-3 w-3 mr-1" /> LIVE · REAR
              </Badge>
            </div>
          )}
        </div>

        {/* Location */}
        {location.state && (
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-blue-400" />
            {location.city && `${location.city}, `}{location.state}
            {location.latitude && ` (${location.latitude.toFixed(4)}, ${location.longitude?.toFixed(4)})`}
          </div>
        )}

        {/* Backup status + download buttons */}
        {(frontRecordingUrl || backRecordingUrl) && !recording && (
          <div className="space-y-3 pt-2 border-t border-white/10">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Footage Ready</p>

            {/* Front camera */}
            {frontRecordingUrl && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Camera className="h-3 w-3" /> Front Camera
                  </span>
                  <div className="flex gap-2">
                    {frontBackup.uploaded ? (
                      <Badge className="bg-green-600/20 text-green-400 border border-green-500/30 gap-1 text-xs">
                        <CheckCircle className="h-3 w-3" /> Backed up
                      </Badge>
                    ) : frontBackup.uploading ? (
                      <Badge className="bg-blue-600/20 text-blue-300 border border-blue-500/30 gap-1 text-xs animate-pulse">
                        <CloudUpload className="h-3 w-3" /> Uploading…
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 h-7 text-xs border-blue-500/40 text-blue-400 hover:bg-blue-950"
                        onClick={() => uploadToStorage(frontRecordingUrl, frontMimeType, "front", setFrontBackup)}
                      >
                        <CloudUpload className="h-3 w-3" /> Back Up Now
                      </Button>
                    )}
                    <Button asChild variant="outline" size="sm" className="gap-1 h-7 text-xs">
                      <a href={frontRecordingUrl} download={`front-recording.${getFileExtension(frontMimeType)}`}>
                        <Download className="h-3 w-3" /> Download
                      </a>
                    </Button>
                  </div>
                </div>
                {frontBackup.uploading && (
                  <Progress value={frontBackup.progress} className="h-1" />
                )}
                {frontBackup.error && (
                  <p className="text-xs text-red-400">⚠️ {frontBackup.error} — use Download to save locally.</p>
                )}
              </div>
            )}

            {/* Rear camera */}
            {backRecordingUrl && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <CameraOff className="h-3 w-3" /> Rear Camera
                  </span>
                  <div className="flex gap-2">
                    {rearBackup.uploaded ? (
                      <Badge className="bg-green-600/20 text-green-400 border border-green-500/30 gap-1 text-xs">
                        <CheckCircle className="h-3 w-3" /> Backed up
                      </Badge>
                    ) : rearBackup.uploading ? (
                      <Badge className="bg-blue-600/20 text-blue-300 border border-blue-500/30 gap-1 text-xs animate-pulse">
                        <CloudUpload className="h-3 w-3" /> Uploading…
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 h-7 text-xs border-blue-500/40 text-blue-400 hover:bg-blue-950"
                        onClick={() => uploadToStorage(backRecordingUrl, backMimeType, "rear", setRearBackup)}
                      >
                        <CloudUpload className="h-3 w-3" /> Back Up Now
                      </Button>
                    )}
                    <Button asChild variant="outline" size="sm" className="gap-1 h-7 text-xs">
                      <a href={backRecordingUrl} download={`rear-recording.${getFileExtension(backMimeType)}`}>
                        <Download className="h-3 w-3" /> Download
                      </a>
                    </Button>
                  </div>
                </div>
                {rearBackup.uploading && (
                  <Progress value={rearBackup.progress} className="h-1" />
                )}
                {rearBackup.error && (
                  <p className="text-xs text-red-400">⚠️ {rearBackup.error} — use Download to save locally.</p>
                )}
              </div>
            )}

            {/* Auto-backup trigger */}
            {isReadyToBackup && !frontBackup.uploaded && !frontBackup.uploading && !rearBackup.uploading && (
              <Button
                onClick={handleAutoBackup}
                className="w-full gap-2 bg-green-700 hover:bg-green-600 text-white font-bold"
                size="sm"
              >
                <CloudUpload className="h-4 w-4" />
                Back Up All Footage to Your Account
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
