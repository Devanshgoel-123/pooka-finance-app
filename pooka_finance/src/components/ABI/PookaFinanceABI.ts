export const PERPS_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_priceOracle",
        type: "address",
      },
      {
        internalType: "address",
        name: "_feeManager",
        type: "address",
      },
      {
        internalType: "address",
        name: "_calculator",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxLeverage",
        type: "uint256",
      },
    ],
    name: "MarketAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "pnl",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "holdingFees",
        type: "uint256",
      },
    ],
    name: "PositionClosed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isLong",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "leverage",
        type: "uint256",
      },
    ],
    name: "PositionOpened",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawal",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "calculator",
    outputs: [
      {
        internalType: "contract PerpsCalculations",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "closePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "feeManager",
    outputs: [
      {
        internalType: "contract PerpsFeeManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMarketSymbols",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "getPosition",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "size",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "entryPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "leverage",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isLong",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "currentPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidationPrice",
            type: "uint256",
          },
          {
            internalType: "int256",
            name: "unrealizedPnL",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "accruedFees",
            type: "uint256",
          },
          {
            internalType: "int256",
            name: "netPnL",
            type: "int256",
          },
          {
            internalType: "bool",
            name: "canBeLiquidated",
            type: "bool",
          },
        ],
        internalType: "struct PerpsStructs.PositionInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "marketSymbols",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "markets",
    outputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "maxLeverage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maintenanceMargin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalLongSize",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalShortSize",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "collateralAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "leverage",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isLong",
        type: "bool",
      },
    ],
    name: "openPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "positions",
    outputs: [
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "leverage",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isLong",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isOpen",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "openTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastFeeTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "priceOracle",
    outputs: [
      {
        internalType: "contract PriceOracle",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
