import { type MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface RecorderSupportState {
  supported: boolean;
  reason: string | null;
}

export interface RecorderLink {
  label: string;
  url: string;
  external?: boolean;
}

export interface EmergencyRecorderState {
  recording: boolean;
  dualCameraActive: boolean;
  supportsDualCamera: boolean | null;
  frontRecordingUrl: string | null;
  backRecordingUrl: string | null;
  frontMimeType: string;
  backMimeType: string;
  recordingStartedAt: Date | null;
  error: string | null;
  support: RecorderSupportState;
  permissionsSupported: boolean;
  permissions: RecorderPermissions;
  refreshPermissions: () => Promise<RecorderPermissions>;
  startRecording: () => Promise<boolean>;
  stopRecording: () => void;
  clearRecordings: () => void;
  frontVideoRef: MutableRefObject<HTMLVideoElement | null>;
  backVideoRef: MutableRefObject<HTMLVideoElement | null>;
}

export interface RecorderPermissions {
  camera: PermissionState | null;
  microphone: PermissionState | null;
}

const MIME_TYPE_PREFERENCE = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
  "video/mp4",
];

export const getRecorderMimeType = (): string => {
  if (typeof window === "undefined" || typeof window.MediaRecorder === "undefined") {
    return "video/webm";
  }

  const supportedType = MIME_TYPE_PREFERENCE.find((type) => {
    try {
      return typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(type);
    } catch {
      return false;
    }
  });

  return supportedType ?? "video/webm";
};

const getInitialSupportState = (): RecorderSupportState => {
  if (typeof window === "undefined") {
    return { supported: false, reason: "Recording is unavailable during server-side rendering." };
  }

  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return {
      supported: false,
      reason: "Your browser does not expose camera and microphone controls required for recording.",
    };
  }

  if (typeof window.MediaRecorder === "undefined") {
    return {
      supported: false,
      reason: "MediaRecorder API is not supported by this browser. Use the mobile apps linked below instead.",
    };
  }

  return { supported: true, reason: null };
};

export const useEmergencyRecorder = (): EmergencyRecorderState => {
  const support = useMemo(() => getInitialSupportState(), []);

  const frontVideoRef = useRef<HTMLVideoElement | null>(null);
  const backVideoRef = useRef<HTMLVideoElement | null>(null);

  const frontRecorderRef = useRef<MediaRecorder | null>(null);
  const backRecorderRef = useRef<MediaRecorder | null>(null);
  const frontStreamRef = useRef<MediaStream | null>(null);
  const backStreamRef = useRef<MediaStream | null>(null);
  const permissionStatusRefs = useRef<Partial<Record<"camera" | "microphone", PermissionStatus>>>({});
  const frontChunksRef = useRef<Blob[]>([]);
  const backChunksRef = useRef<Blob[]>([]);
  const frontUrlRef = useRef<string | null>(null);
  const backUrlRef = useRef<string | null>(null);
  const recordingStartRef = useRef<Date | null>(null);

  const [recording, setRecording] = useState(false);
  const [frontRecordingUrl, setFrontRecordingUrl] = useState<string | null>(null);
  const [backRecordingUrl, setBackRecordingUrl] = useState<string | null>(null);
  const [frontMimeType, setFrontMimeType] = useState<string>("video/webm");
  const [backMimeType, setBackMimeType] = useState<string>("video/webm");
  const [recordingStartedAt, setRecordingStartedAt] = useState<Date | null>(null);
  const [supportsDualCamera, setSupportsDualCamera] = useState<boolean | null>(null);
  const [dualCameraActive, setDualCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionsSupported, setPermissionsSupported] = useState<boolean>(
    typeof navigator !== "undefined" && Boolean(navigator.permissions?.query)
  );
  const [permissions, setPermissions] = useState<RecorderPermissions>({ camera: null, microphone: null });

  const refreshPermissions = useCallback(async (): Promise<RecorderPermissions> => {
    if (typeof navigator === "undefined" || !navigator.permissions?.query) {
      setPermissionsSupported(false);
      setPermissions({ camera: null, microphone: null });
      return { camera: null, microphone: null };
    }

    setPermissionsSupported(true);

    const permissionNames: Array<"camera" | "microphone"> = ["camera", "microphone"];
    const results = await Promise.all(
      permissionNames.map(async (name) => {
        try {
          const status = await navigator.permissions.query({ name } as PermissionDescriptor);
          permissionStatusRefs.current[name] = status;
          status.onchange = () => {
            setPermissions((current) => ({
              ...current,
              [name]: status.state,
            }));
          };
          return { name, state: status.state } as const;
        } catch {
          permissionStatusRefs.current[name] = undefined;
          return { name, state: null } as const;
        }
      })
    );

    const nextPermissions = results.reduce<RecorderPermissions>((accumulator, { name, state }) => {
      accumulator[name] = state;
      return accumulator;
    }, { camera: null, microphone: null });

    setPermissions(nextPermissions);
    return nextPermissions;
  }, []);

  const clearRecordings = useCallback(() => {
    if (frontUrlRef.current) {
      URL.revokeObjectURL(frontUrlRef.current);
      frontUrlRef.current = null;
    }
    if (backUrlRef.current) {
      URL.revokeObjectURL(backUrlRef.current);
      backUrlRef.current = null;
    }
    setFrontRecordingUrl(null);
    setBackRecordingUrl(null);
    setRecordingStartedAt(null);
  }, []);

  const stopRecording = useCallback(() => {
    if (frontRecorderRef.current && frontRecorderRef.current.state !== "inactive") {
      frontRecorderRef.current.stop();
    }
    if (backRecorderRef.current && backRecorderRef.current.state !== "inactive") {
      backRecorderRef.current.stop();
    }

    frontStreamRef.current?.getTracks().forEach((track) => track.stop());
    backStreamRef.current?.getTracks().forEach((track) => track.stop());
    frontStreamRef.current = null;
    backStreamRef.current = null;

    if (frontVideoRef.current) {
      frontVideoRef.current.srcObject = null;
    }
    if (backVideoRef.current) {
      backVideoRef.current.srcObject = null;
    }

    setRecording(false);
    setDualCameraActive(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (!support.supported) {
      setError(support.reason ?? "Recording is not supported on this device.");
      return false;
    }

    if (recording) {
      return true;
    }

    try {
      setError(null);
      clearRecordings();

      const currentPermissions = await refreshPermissions();
      if (permissionsSupported) {
        if (currentPermissions.camera === "denied" && currentPermissions.microphone === "denied") {
          setError("Camera and microphone access are blocked. Update your browser permissions to record.");
          return false;
        }
        if (currentPermissions.camera === "denied") {
          setError("Camera access is blocked. Allow camera permissions to start an emergency recording.");
          return false;
        }
        if (currentPermissions.microphone === "denied") {
          setError("Microphone access is blocked. Enable microphone permissions to capture audio during recording.");
          return false;
        }
      }

      const frontStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      frontStreamRef.current = frontStream;
      if (frontVideoRef.current) {
        frontVideoRef.current.srcObject = frontStream;
        frontVideoRef.current.muted = true;
        frontVideoRef.current.playsInline = true;
        void frontVideoRef.current.play().catch(() => undefined);
      }

      frontChunksRef.current = [];
      const selectedFrontMime = getRecorderMimeType();
      setFrontMimeType(selectedFrontMime);
      const frontRecorder = new MediaRecorder(frontStream, { mimeType: selectedFrontMime });
      frontRecorderRef.current = frontRecorder;

      frontRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          frontChunksRef.current.push(event.data);
        }
      };

      frontRecorder.onstop = () => {
        if (frontChunksRef.current.length > 0) {
          const blob = new Blob(frontChunksRef.current, { type: selectedFrontMime });
          const url = URL.createObjectURL(blob);
          frontUrlRef.current = url;
          setFrontRecordingUrl(url);
        }
        frontChunksRef.current = [];
      };

      frontRecorder.onerror = (event: Event) => {
        const recorderEvent = event as Event & { error?: DOMException };
        setError(recorderEvent.error?.message ?? "A recording error occurred.");
      };

      frontRecorder.start(1000);

      let canUseDualCamera = false;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        canUseDualCamera = devices.filter((device) => device.kind === "videoinput").length > 1;
        setSupportsDualCamera(canUseDualCamera);
      } catch {
        setSupportsDualCamera(null);
      }

      if (canUseDualCamera) {
        try {
          const backStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
            audio: false,
          });

          backStreamRef.current = backStream;
          if (backVideoRef.current) {
            backVideoRef.current.srcObject = backStream;
            backVideoRef.current.playsInline = true;
            void backVideoRef.current.play().catch(() => undefined);
          }

          backChunksRef.current = [];
          const selectedBackMime = getRecorderMimeType();
          setBackMimeType(selectedBackMime);
          const backRecorder = new MediaRecorder(backStream, { mimeType: selectedBackMime });
          backRecorderRef.current = backRecorder;

          backRecorder.ondataavailable = (event: BlobEvent) => {
            if (event.data && event.data.size > 0) {
              backChunksRef.current.push(event.data);
            }
          };

          backRecorder.onstop = () => {
            if (backChunksRef.current.length > 0) {
              const blob = new Blob(backChunksRef.current, { type: selectedBackMime });
              const url = URL.createObjectURL(blob);
              backUrlRef.current = url;
              setBackRecordingUrl(url);
            }
            backChunksRef.current = [];
          };

          backRecorder.onerror = (event: Event) => {
            const recorderEvent = event as Event & { error?: DOMException };
            setError(recorderEvent.error?.message ?? "Background camera recording failed.");
          };

          backRecorder.start(1000);
          setDualCameraActive(true);
        } catch {
          setDualCameraActive(false);
          setSupportsDualCamera(false);
        }
      } else {
        setDualCameraActive(false);
      }

      const startedAt = new Date();
      recordingStartRef.current = startedAt;
      setRecordingStartedAt(startedAt);
      setRecording(true);
      return true;
    } catch (captureError) {
      stopRecording();
      const errorMessage =
        captureError instanceof Error
          ? captureError.message
          : "Unable to access camera or microphone.";
      setError(errorMessage);
      return false;
    }
  }, [clearRecordings, permissionsSupported, recording, refreshPermissions, stopRecording, support]);

  useEffect(() => () => {
    stopRecording();
    clearRecordings();
  }, [clearRecordings, stopRecording]);

  useEffect(() => {
    void refreshPermissions();
  }, [refreshPermissions]);

  useEffect(
    () => () => {
      Object.values(permissionStatusRefs.current).forEach((status) => {
        if (status) {
          status.onchange = null;
        }
      });
      permissionStatusRefs.current = {};
    },
    []
  );

  return {
    recording,
    dualCameraActive,
    supportsDualCamera,
    frontRecordingUrl,
    backRecordingUrl,
    frontMimeType,
    backMimeType,
    recordingStartedAt,
    error,
    support,
    permissionsSupported,
    permissions,
    refreshPermissions,
    startRecording,
    stopRecording,
    clearRecordings,
    frontVideoRef,
    backVideoRef,
  };
};

