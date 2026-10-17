import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import LabGame, { shouldShowKeyboardHint } from "./LabGame";

vi.mock("./LabCharacter", () => ({
  default: ({ walkToStation, onStationInteract }: { walkToStation?: { id: string }; onStationInteract: (id: string) => void }) =>
    <button onClick={() => { if (walkToStation) onStationInteract(walkToStation.id); }}>Arrive</button>,
}));
vi.mock("./StationOverlay", () => ({ default: ({ onClose }: { onClose: () => void }) => <button onClick={onClose}>Close station</button> }));
vi.mock("./HorseExitAnimation", () => ({ default: () => <div data-testid="exit-animation" /> }));

afterEach(cleanup);

it("hides keyboard hints on touch devices even with a mouse attached", () => {
  expect(shouldShowKeyboardHint(true, 5)).toBe(false);
  expect(shouldShowKeyboardHint(true, 1)).toBe(false);
});

it("hides keyboard hints outside desktop-sized mouse viewports", () => {
  expect(shouldShowKeyboardHint(false, 0)).toBe(false);
  expect(shouldShowKeyboardHint(true, 0)).toBe(true);
});

it("keeps portal exit locked until all four distinct stations are visited", () => {
  render(<LabGame onExit={vi.fn()} />);
  const attemptExit = () => {
    fireEvent.click(screen.getByRole("button", { name: "Exit portal" }));
    fireEvent.click(screen.getByRole("button", { name: "Arrive" }));
  };
  attemptExit();
  expect(screen.queryByTestId("exit-animation")).not.toBeInTheDocument();
  for (const label of ["Chemical Bench", "Microscope", "Computer", "Bookshelf"]) {
    fireEvent.click(screen.getByRole("button", { name: `Open ${label}` }));
    fireEvent.click(screen.getByRole("button", { name: "Arrive" }));
    fireEvent.click(screen.getByRole("button", { name: "Close station" }));
    if (label !== "Bookshelf") {
      attemptExit();
      expect(screen.queryByTestId("exit-animation")).not.toBeInTheDocument();
    }
  }
  fireEvent.click(screen.getByRole("button", { name: "Exit portal" }));
  expect(screen.queryByTestId("exit-animation")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Arrive" }));
  expect(screen.getByTestId("exit-animation")).toBeInTheDocument();
});