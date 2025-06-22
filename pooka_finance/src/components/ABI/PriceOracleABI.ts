export const PRICE_ORACLE_ABI=[
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "high",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "low",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "change",
        "type": "uint256"
      }
    ],
    "name": "DailyDataUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "feedAddress",
        "type": "address"
      }
    ],
    "name": "PriceFeedUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "UPDATE_INTERVAL",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "dailyData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "price24hAgo",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "high24h",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "low24h",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdateTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "get24hData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "currentPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "high24h",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "low24h",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "priceChange",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "changePercent",
        "type": "int256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "getPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "normalizedPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "lastDailyUpdate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "lastUpdated",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "priceFeeds",
    "outputs": [
      {
        "internalType": "contract AggregatorV3Interface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "feedAddress",
        "type": "address"
      }
    ],
    "name": "setPriceFeed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "update24hData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "view24hDataWithoutUpdate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "currentPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "high24h",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "low24h",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "priceChange",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "changePercent",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]