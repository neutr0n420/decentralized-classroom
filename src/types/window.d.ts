export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (params: unknown) => void) => void;
  removeListener: (event: string, callback: (params: unknown) => void) => void;
  isMetaMask?: boolean;
  providers?: EthereumProvider[];
  selectedAddress?: string;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};
