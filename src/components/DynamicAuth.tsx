"use client";

import {
  DynamicContextProvider,
  DynamicWidget,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function AuthWrapper() {
  const router = useRouter();
  const { primaryWallet } = useDynamicContext();
  const pathname = usePathname();

  useEffect(() => {
    if (primaryWallet && pathname === "/") {
      router.push("/dashboard");
    }
  }, [primaryWallet, pathname, router]);

  return <DynamicWidget />;
}

export default function DynamicAuth() {
  return <AuthWrapper />;
}
