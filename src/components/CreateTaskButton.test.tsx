import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateTaskButton } from "./CreateTaskButton";

describe("CreateTaskButton", () => {
  it("opens the modal when clicked", async () => {
    const user = userEvent.setup();
    render(<CreateTaskButton onCreateTask={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create task" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onCreateTask and closes the modal on successful submission", async () => {
    const user = userEvent.setup();
    const onCreateTask = vi.fn();
    render(<CreateTaskButton onCreateTask={onCreateTask} />);

    await user.click(screen.getByRole("button", { name: "Create task" }));
    const dialog = screen.getByRole("dialog");
    await user.type(within(dialog).getByLabelText(/Title/), "Ship feature");
    await user.click(within(dialog).getByRole("button", { name: "Create task" }));

    expect(onCreateTask).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Ship feature" })
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the modal without calling onCreateTask when cancelled", async () => {
    const user = userEvent.setup();
    const onCreateTask = vi.fn();
    render(<CreateTaskButton onCreateTask={onCreateTask} />);

    await user.click(screen.getByRole("button", { name: "Create task" }));
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(onCreateTask).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
