import { useState } from "react";
import { Video, Square, Download, AlertTriangle, Camera, CameraOff, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEmergencyRecorder } from "@/hooks/useEmergencyRecorder";
import { useGeolocation } from "@/hooks/useGeolocation";
import { formatDistanceToNow } from "date-fns";

export function GoLiveRecorder() {
  const [expanded, setExpanded] = useState(false);
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

  const handleStop = () => {
    stopRecording();
  };

  const getFileExtension = (mime: string) => (mime.includes("mp4") ? "mp4" : "webm");

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
            {recordingStartedAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Started {formatDistanceToNow(recordingStartedAt, { addSuffix: true })}
              </span>
            )}
          </div>
          {recording ? (
            <Button onClick={handleStop} variant="destructive" size="sm" className="gap-1">
              <Square className="h-4 w-4" /> Stop
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleGoLive} variant="destructive" size="sm" className="gap-1">
                <Video className="h-4 w-4" /> Start Recording
              </Button>
              <Button onClick={() => { clearRecordings(); setExpanded(false); }} variant="ghost" size="sm">
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

        {(frontRecordingUrl || backRecordingUrl) && !recording && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {frontRecordingUrl && (
              <Button asChild variant="outline" size="sm" className="gap-1">
                <a href={frontRecordingUrl} download={`front-recording.${getFileExtension(frontMimeType)}`}>
                  <Download className="h-4 w-4" /> Download Front
                </a>
              </Button>
            )}
            {backRecordingUrl && (
              <Button asChild variant="outline" size="sm" className="gap-1">
                <a href={backRecordingUrl} download={`rear-recording.${getFileExtension(backMimeType)}`}>
                  <Download className="h-4 w-4" /> Download Rear
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
