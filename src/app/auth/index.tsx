"use client";
import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { mainnet, sepolia, defineChain } from "@reown/appkit/networks";

const projectId = "baf8428698c7cddf0e212bcff8ffabdf";

// const metaData = {

// }

const eduChain = defineChain({
  id: 656476,
  name: "edu-chain testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Edu-chain",
    symbol: "EDU",
  },
  rpcUrls: {
    default: {
      http: ["https://open-campus-codex-sepolia.drpc.org"],
      webSocket: ["wss://open-campus-codex-sepolia.drpc.org"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "BLOCK_EXPLORER_URL" },
  },
  chainNamespace: "eip155",
  caipNetworkId: "eip155:656476",
});

// 3. Create the AppKit instance
createAppKit({
  adapters: [new Ethers5Adapter()],
  networks: [mainnet, eduChain, sepolia],
  defaultNetwork: sepolia,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: ["google", "github"],
    emailShowWallets: true,
  },
});
function AppKit({ children, }: { children: React.ReactNode; }) {
  return <>{children}</>;
}

export default AppKit;
