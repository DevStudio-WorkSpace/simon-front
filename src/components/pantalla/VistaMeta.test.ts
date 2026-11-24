import { describe, expect, it } from "vitest";
import { claseHito } from "./VistaMeta";

describe("Vista Meta", () => {
  it("determina hitos por porcentaje", () => {
    expect(claseHito(24)).toBe("Inicio");
    expect(claseHito(25)).toBe("Bronce");
    expect(claseHito(50)).toBe("Plata");
    expect(claseHito(75)).toBe("Oro");
    expect(claseHito(100)).toBe("Meta");
  });
});
