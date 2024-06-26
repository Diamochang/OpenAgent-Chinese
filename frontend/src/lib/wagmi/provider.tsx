"use client";

import { WagmiProvider as WagmiProvider_ } from "wagmi";

import { config } from "./config";

/**
 * Should be placed outside tanstack query provider
 */
export function WagmiProvider({ children }: { children: React.ReactNode }) {
	// @ts-expect-error TODO: fix this
	return <WagmiProvider_ config={config}>{children}</WagmiProvider_>;
}

import "@rainbow-me/rainbowkit/styles.css";
export { RainbowKitProvider } from "@rainbow-me/rainbowkit";
