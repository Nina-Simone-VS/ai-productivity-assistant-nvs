import { describe, expect, it } from "vitest";
import { classifyPriority, planTasks } from "./mock-ai";

describe("task planner", () => {
  it("sorts the plan strictly High → Medium → Low", () => {
    const plan = planTasks("clean inbox, review code PR, urgent client fix", "Daily", "09:00", "17:00");
    expect(plan.map((t) => t.priority)).toEqual(["High", "Medium", "Low"]);
  });

  it("pins tasks with an explicit time to that slot", () => {
    const plan = planTasks("team sync at 10am", "Daily", "09:00", "17:00");
    expect(plan[0]?.start).toBe("10:00");
  });

  it("classifies client work as high priority", () => {
    expect(classifyPriority("reply to client email")).toBe("High");
  });
});

import { generateEmail } from "./mock-ai";
describe("email audience", () => {
  it("leads with the bottom line for executives", () => {
    const r = generateEmail({ recipient: "Ann", points: "Budget ready", tone: "Formal", length: "Concise", audience: "Manager/Executive" });
    expect(r.body).toContain("Bottom line up front");
  });
});
