"use client";

import { useEffect } from "react";
import { registerVisit } from "@/lib/reader";

/** Updates streak + last-visit once per page load. Renders nothing. */
export default function VisitTracker() {
  useEffect(() => {
    registerVisit();
  }, []);
  return null;
}
