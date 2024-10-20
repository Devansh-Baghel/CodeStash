"use client";

import formbricks from "@formbricks/js";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function FormbricksProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    formbricks.init({
      environmentId: "cm29bfc8s0002r5vrwh5oyfjk",
      apiHost: "https://app.formbricks.com",
    });
  }, []);

  useEffect(() => {
    formbricks?.registerRouteChange();
  }, [pathname, searchParams]);

  return null;
}
