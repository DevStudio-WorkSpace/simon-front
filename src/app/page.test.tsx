import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Página base", () => {
  it("muestra la identificación de SIMON", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "SIMON" })).toBeInTheDocument();
  });
});
