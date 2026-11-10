"use client";

import { useEffect } from "react";
import { registerVisit } from "@/lib/reader";
import { startSync } from "@/lib/readerSync";

/** Updates streak + last-visit once per page load and keeps cross-device sync running. Renders nothing. */
export default function VisitTracker() {
  useEffect(() => {
    registerVisit();
    return startSync();
  }, []);
  return null;
}
