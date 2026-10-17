import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LabRoom from "./LabRoom";

afterEach(cleanup);

describe("direct station interaction", () => {
  it.each([
    ["Chemical Bench", "chemical"],
    ["Microscope", "microscope"],
    ["Computer", "computer"],
    ["Bookshelf", "lounge"],
  ])("opens %s directly without character proximity", (label, id) => {
    const interact = vi.fn();
    render(<LabRoom visitedStations={new Set()} allVisited={false} onStationInteract={interact} />);
    fireEvent.click(screen.getByRole("button", { name: `Open ${label}` }));
    expect(interact).toHaveBeenCalledExactlyOnceWith(id);
  });

  it("does not open another station while interaction is disabled", () => {
    const interact = vi.fn();
    render(<LabRoom visitedStations={new Set()} allVisited={false} onStationInteract={interact} interactionDisabled />);
    fireEvent.click(screen.getByRole("button", { name: "Open Computer" }));
    expect(interact).not.toHaveBeenCalled();
  });
});