export interface OHLC_DATA{
    open: number,
    close: number,
    high: number,
    low: number,
    time: number,
  }

export interface TimeFrame {
  label: string;
  value:"minute" | "day" | "month" | "week" | "hour" | "quarter";
}
export type DepositParams = {
  collateral?: number;
  payToken?: string;
  chainName?: string;
};


export type PositionParams = {
  perpName?: string;
  leverage?: number;
  collateral?: number;
  payToken?: "USDC" | "ETH";
  positionType?: "long" | "short";
  chainName?: string;
};