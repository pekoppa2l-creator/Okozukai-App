"use client";

import { useEffect } from "react";
import { logUsage } from "@/lib/log-usage";

type Props = {
  appId: string;
};

export function UsageTracker({ appId }: Props) {
  useEffect(() => {
    void logUsage(appId);
  }, [appId]);

  return null;
}
