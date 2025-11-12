import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getRecorderMimeType, useEmergencyRecorder } from "../useEmergencyRecorder";

describe("getRecorderMimeType", () => {
  const originalMediaRecorder = globalThis.MediaRecorder;

  afterEach(() => {
    if (originalMediaRecorder) {
      globalThis.MediaRecorder = originalMediaRecorder;
    } else {
      // @ts-expect-error allow cleanup when MediaRecorder was undefined originally
      delete globalThis.MediaRecorder;
    }
  });

  it("falls back to webm when MediaRecorder is unavailable", () => {
    // @ts-expect-error intentionally removing MediaRecorder for the test
    delete globalThis.MediaRecorder;
    expect(getRecorderMimeType()).toBe("video/webm");
  });

  it("respects supported mime types", () => {
    class MockMediaRecorder {
      static isTypeSupported = vi.fn((type: string) => type.includes("vp9"));
    }

    globalThis.MediaRecorder = MockMediaRecorder as unknown as typeof MediaRecorder;
    expect(getRecorderMimeType()).toBe("video/webm;codecs=vp9,opus");
  });
});

describe("useEmergencyRecorder", () => {
  const originalMediaRecorder = globalThis.MediaRecorder;
  const originalMediaDevices = Object.getOwnPropertyDescriptor(navigator, "mediaDevices");

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalMediaRecorder) {
      globalThis.MediaRecorder = originalMediaRecorder;
    } else {
      // @ts-expect-error cleanup when MediaRecorder was undefined originally
      delete globalThis.MediaRecorder;
    }

    if (originalMediaDevices) {
      Object.defineProperty(navigator, "mediaDevices", originalMediaDevices);
    } else {
      Object.defineProperty(navigator, "mediaDevices", {
        configurable: true,
        value: undefined,
      });
    }
  });

  it("marks recording support as false when APIs are missing", () => {
    // @ts-expect-error removing MediaRecorder for unsupported scenario
    delete globalThis.MediaRecorder;
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useEmergencyRecorder());
    expect(result.current.support.supported).toBe(false);
    expect(result.current.support.reason).toMatch(/browser/i);
  });

  it("confirms support when MediaRecorder and mediaDevices exist", () => {
    class MockMediaRecorder {
      static isTypeSupported = vi.fn().mockReturnValue(true);
      state: MediaRecorderState = "inactive";
      ondataavailable: ((event: BlobEvent) => void) | null = null;
      onstop: (() => void) | null = null;
      onerror: ((event: MediaRecorderErrorEvent) => void) | null = null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      constructor(_stream: MediaStream, _options?: MediaRecorderOptions) {}
      start() {
        this.state = "recording";
      }
      stop() {
        this.state = "inactive";
        this.onstop?.();
      }
    }

    const mockStream = {
      getTracks: vi.fn().mockReturnValue([]),
    } as unknown as MediaStream;

    const mockMediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue(mockStream),
      enumerateDevices: vi.fn().mockResolvedValue([{ kind: "videoinput" }]),
    } satisfies Partial<MediaDevices>;

    globalThis.MediaRecorder = MockMediaRecorder as unknown as typeof MediaRecorder;
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: mockMediaDevices,
    });

    const { result } = renderHook(() => useEmergencyRecorder());
    expect(result.current.support.supported).toBe(true);
    expect(result.current.support.reason).toBeNull();
  });
});
