// Daily Dilemmas — index module.
// All content is static, bundled at build time. No AI or external API calls.
// Data is split per-course for maintainability.

import { IFRS_DILEMMAS } from "@/lib/dilemmas/ifrsDilemmas";
import { OPENFINANCE_DILEMMAS } from "@/lib/dilemmas/openFinanceDilemmas";
import { COURSES } from "@/lib/courses";

export const DILEMMAS = {
  "ifrs-commodities": { dilemmas: IFRS_DILEMMAS },
  openfinance: { dilemmas: OPENFINANCE_DILEMMAS },
};

export function getDilemmasForCourse(courseId) {
  // Check static dilemmas first (built-in courses)
  if (DILEMMAS[courseId]) return DILEMMAS[courseId].dilemmas;
  // Fall back to custom courses (uploaded via admin)
  const course = COURSES.find((c) => c.id === courseId);
  return course?.dilemmas || [];
}

export function getDilemmasForModule(courseId, moduleNum) {
  return getDilemmasForCourse(courseId).filter((d) => d.module === moduleNum);
}

export function getDilemma(courseId, dilemmaId) {
  return getDilemmasForCourse(courseId).find((d) => d.id === dilemmaId);
}

export const DILEMMA_TYPE_LABELS = {
  compliance_redflag: "Compliance Red Flag",
  accounting_judgment: "Judgment Call",
  commercial_tradeoff: "Commercial Trade-off",
  documentation_process: "Documentation & Process",
  stakeholder_pressure: "Stakeholder Pressure",
};