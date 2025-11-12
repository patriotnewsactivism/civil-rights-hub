import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";

import { type RecorderPermissions, useEmergencyRecorder } from "./useEmergencyRecorder";

type MockPermissionStatus = PermissionStatus & { update: (next: PermissionState) => void };

const createMockPermissionStatus = (initial: PermissionState): MockPermissionStatus => {
  let current = initial;
  const status: Partial<MockPermissionStatus> = {
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    update: (next: PermissionState) => {
      current = next;
      status.onchange?.call(status as PermissionStatus, new Event("change"));
    },
  };

  Object.defineProperty(status, "state", {
    get: () => current,
    configurable: true,
  });

  return status as MockPermissionStatus;
};

const setNavigatorPermissions = (value: Navigator["permissions"]) => {
  Object.defineProperty(navigator, "permissions", {
    value,
    configurable: true,
    writable: true,
  });
};

describe("useEmergencyRecorder permissions", () => {
  const originalPermissions = navigator.permissions;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    setNavigatorPermissions(originalPermissions ?? undefined);
  });

  it("flags permissions API as unsupported when missing", () => {
    setNavigatorPermissions(undefined as unknown as Navigator["permissions"]);

    const { result } = renderHook(() => useEmergencyRecorder());

    expect(result.current.permissionsSupported).toBe(false);
    expect(result.current.permissions).toEqual<RecorderPermissions>({ camera: null, microphone: null });
  });

  it("preloads permission states and reacts to changes", async () => {
    const cameraStatus = createMockPermissionStatus("granted");
    const microphoneStatus = createMockPermissionStatus("prompt");

    setNavigatorPermissions({
      query: vi.fn(({ name }: PermissionDescriptor) => {
        if (name === "camera") {
          return Promise.resolve(cameraStatus);
        }
        if (name === "microphone") {
          return Promise.resolve(microphoneStatus);
        }
        throw new Error(`Unsupported permission: ${String(name)}`);
      }),
    } as Navigator["permissions"]);

    const { result } = renderHook(() => useEmergencyRecorder());

    await waitFor(() => {
      expect(result.current.permissionsSupported).toBe(true);
      expect(result.current.permissions).toEqual<RecorderPermissions>({
        camera: "granted",
        microphone: "prompt",
      });
    });

    await act(async () => {
      cameraStatus.update("denied");
      microphoneStatus.update("granted");
    });

    await waitFor(() => {
      expect(result.current.permissions).toEqual<RecorderPermissions>({
        camera: "denied",
        microphone: "granted",
      });
    });
  });
});
