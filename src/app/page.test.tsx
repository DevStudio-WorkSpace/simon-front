import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { redirect } from "next/navigation";
import Home from "./page";

describe("Página base", () => {
  it("redirige a la pantalla principal", () => {
    Home();
    expect(redirect).toHaveBeenCalledWith("/pantalla/sala");
  });
});
