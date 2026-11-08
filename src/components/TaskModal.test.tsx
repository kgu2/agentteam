import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskModal } from "./TaskModal";

describe("TaskModal", () => {
  it("shows a validation error and does not submit when title is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskModal onClose={vi.fn()} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Create task" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Title is required.");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the entered values when the title is provided", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskModal onClose={vi.fn()} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Title/), "Write release notes");
    await user.type(screen.getByLabelText("Description"), "Summarize the release");
    await user.selectOptions(screen.getByLabelText("Priority"), "high");
    await user.type(screen.getByLabelText("Due date"), "2026-12-01");
    await user.click(screen.getByRole("button", { name: "Create task" }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Write release notes",
      description: "Summarize the release",
      priority: "high",
      dueDate: "2026-12-01",
    });
  });

  it("calls onClose when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TaskModal onClose={onClose} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("clears the validation error once the user starts typing a title", async () => {
    const user = userEvent.setup();
    render(<TaskModal onClose={vi.fn()} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Create task" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Title/), "A");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
