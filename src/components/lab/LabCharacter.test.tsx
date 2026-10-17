import { act, cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import LabCharacter from "./LabCharacter";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it.each(["chemical", "microscope", "computer", "lounge", "portal"])("walks before opening %s and opens on arrival", (id) => {
  vi.useFakeTimers();
  let frame: FrameRequestCallback | undefined;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frame = callback; return 1; });
  vi.stubGlobal("cancelAnimationFrame", () => {});
  const interact = vi.fn();
  render(<LabCharacter roomRef={{ current: null }} walkToStation={{ id, nonce: 1 }} onStationInteract={interact} />);
  expect(interact).not.toHaveBeenCalled();
  act(() => { frame?.(0); vi.runOnlyPendingTimers(); });
  expect(interact).not.toHaveBeenCalled();
  for (let i = 0; i < 400; i++) {
    act(() => { frame?.(i * 16); vi.runOnlyPendingTimers(); });
  }
  expect(interact).toHaveBeenCalledExactlyOnceWith(id);
});