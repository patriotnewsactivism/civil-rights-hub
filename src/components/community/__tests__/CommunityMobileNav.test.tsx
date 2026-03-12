import { render, screen, fireEvent } from "@testing-library/react";
import { CommunityMobileNav } from "../CommunityMobileNav";
import { describe, it, expect, vi } from "vitest";

describe("CommunityMobileNav", () => {
  it("renders all navigation items", () => {
    const onTabChange = vi.fn();
    render(<CommunityMobileNav activeTab="feed" onTabChange={onTabChange} />);

    expect(screen.getByText("Feed")).toBeInTheDocument();
    expect(screen.getByText("Discuss")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("Network")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("calls onTabChange when an item is clicked", () => {
    const onTabChange = vi.fn();
    render(<CommunityMobileNav activeTab="feed" onTabChange={onTabChange} />);

    fireEvent.click(screen.getByText("Discuss"));
    expect(onTabChange).toHaveBeenCalledWith("discuss");
  });

  it("highlights the active tab", () => {
    const onTabChange = vi.fn();
    const { rerender } = render(<CommunityMobileNav activeTab="feed" onTabChange={onTabChange} />);

    // In a real test we'd check for classes, but since we use 'cn' we can check for text-primary
    // or just assume if it renders correctly it works.
    const feedBtn = screen.getByRole('button', { name: /Feed/i });
    expect(feedBtn.className).toContain("text-primary");

    rerender(<CommunityMobileNav activeTab="discuss" onTabChange={onTabChange} />);
    const discussBtn = screen.getByRole('button', { name: /Discuss/i });
    expect(discussBtn.className).toContain("text-primary");
  });
});
