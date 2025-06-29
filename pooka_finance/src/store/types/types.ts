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

export interface PositionData {
  perpName:string;
  size: bigint;
  collateral: bigint;
  entryPrice: bigint;
  leverage: bigint;
  isLong: boolean;
  isOpen: boolean;
  openTime:bigint;
  lastFeeTime:bigint;
}



export type PositionParams = {
  perpName?: string;
  leverage?: number;
  collateral?: number;
  positionType?: "long" | "short";
};

export interface ClosePositionParams{
    perpName:string | undefined;
}

export interface WithdrawPositionParams{
  withdrawAmount:string | undefined;
}

export interface Message {
  id: string;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
  action:"query" | "response" | "trade" | "deposit" | "close" | "withdraw";
  params?: DepositParams | PositionParams | WithdrawPositionParams | ClosePositionParams | generalQueryProps;
}

export interface generalQueryProps{
  message:string | undefined;
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


export interface PriceData {
  symbol: string;
  price: number;
  timestamp: string | number;
  high24h: number;
  low24h: number;
}


export interface PerpPriceInfo{
  price: number ;
  time: string | number;
  high:number;
  low:number;
}


export interface UserDeposit{
  amount:number;
  time:number;
}