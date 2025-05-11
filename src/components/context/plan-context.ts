import { createContext } from "@lit/context";

export type PlanData = string;

export const planContext = createContext<PlanData>("plan-context");
