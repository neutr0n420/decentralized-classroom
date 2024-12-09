import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import Navbar from "../components/Navbar";
import "./globals.css";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DynamicContextProvider
          settings={{
            environmentId: "08b7fb83-b9c8-4800-babe-a0d59e4d37d9",
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          {" "}
          <Navbar />
          {children}
        </DynamicContextProvider>
      </body>
    </html>
  );
}
