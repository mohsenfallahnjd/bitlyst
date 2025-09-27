export type CryptoAddress = {
  name: string;
  symbol: string;
  address: string;
  recommended?: boolean;
};

export const BTC_ADDRESS = "bc1q8st6p7h6rrdg3qzsvxnwjl4mggwd4rcr4cq0qn";
export const ETH_ADDRESS = "0x041241A967A7f35f575451fB15652357Fa15171c";
export const USDC_ADDRESS = "0x041241A967A7f35f575451fB15652357Fa15171c";
export const LTC_ADDRESS = "ltc1qhld85x6w0n3dkjl6e5333uzxs43memfhych77j";
export const SOL_ADDRESS = "Bv8Wcon6xjkfrtg4LhCKpuNPyjKqukb29tnQxRVj4RAn";
export const DOGE_ADDRESS = "DMUy7Hu7u5c1F8tUVCJMdQYWHGhCgXyW8m";
export const XRP_ADDRESS = "rLFJv2NTiKXsz7quyR55PJpNd32Qhr6cB3";
export const BNB_ADDRESS = "0x041241A967A7f35f575451fB15652357Fa15171c";
export const TRON_ADDRESS = "TMENErUuaajAmJoenppG4qohhqzXuu7fgp";

export const cryptoAddresses: CryptoAddress[] = [
  { name: "Bitcoin", symbol: "BTC", address: BTC_ADDRESS, recommended: true },
  { name: "Ethereum", symbol: "ETH", address: ETH_ADDRESS, recommended: true },
  { name: "USD Coin", symbol: "USDC", address: USDC_ADDRESS, recommended: true },
  { name: "Litecoin", symbol: "LTC", address: LTC_ADDRESS },
  { name: "Solana", symbol: "SOL", address: SOL_ADDRESS },
  { name: "Dogecoin", symbol: "DOGE", address: DOGE_ADDRESS },
  { name: "Tron", symbol: "TRON", address: TRON_ADDRESS },
  { name: "BNB", symbol: "BNB", address: BNB_ADDRESS },
  { name: "XRP", symbol: "XRP", address: XRP_ADDRESS },
];
