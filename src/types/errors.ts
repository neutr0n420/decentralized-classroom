export interface Web3Error extends Error {
  code: number;
  data?: unknown;
}
