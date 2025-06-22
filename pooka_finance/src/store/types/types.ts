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

export interface Message {
  id: string;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
  action:"query" | "response" | "trade" | "deposit";
  params?: DepositParams | PositionParams;
}

export interface AgentChatProps {
  onSendMessage?: (message: string) => void
  onClearChat?: () => void
  isConnected?: boolean
}


export interface Market {
  symbol: string;
  name: string;
  logo: string;
}
