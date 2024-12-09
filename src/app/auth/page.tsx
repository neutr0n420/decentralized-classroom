import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export default function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "08b7fb83-b9c8-4800-babe-a0d59e4d37d9",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <DynamicWidget />
    </DynamicContextProvider>
  );
}
