export const MARKET_SYMBOLS=["BTC/USD","ETH/USD"];

//SEPOLIA Address
export const CONTRACT_ADDRESS_PRICE_FEED_SEPOLIA='0xe2CA0aAe17dc4B4D20FCEFA0bF59b5bdf2dE6600';
export const USDC_TOKEN_SEPOLIA ="0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
export const NATIVE_TOKEN_SEPOLIA="0x0000000000000000000000000000000000000000"
export const CROSS_CHAIN_MANAGER_SEPOLIA="0x8843cf257b0ade94cf2e9f3343e9a895a6d97ea1";

//AVAX Address
export const CONTRACT_ADDRESS_AVAX="0x4885110e5109b0f0fb753c8e104e1483575527bb";
export const CONTRACT_ADDRESS_PRICE_FEED_AVAX="0x3de7b2f341ecca59cf3127fa227f898b9d5f3e19";
export const CONTRACT_ADDRESS_POOL_MANAGER="0xd73ff8cd492dc854010fdabc4558860093271740";
export const USDC_TOKEN_AVAX= "0x5425890298aed601595a70AB815c96711a31Bc65";
export const NATIVE_TOKEN_AVAX="0x0000000000000000000000000000000000000000"
export const LINK_TOKEN_AVAX = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";

export const FEE_PERCENTAGE=0.0001;
export const enum PERP_MM {
    BTC = 5,
    ETH = 6.67,
}

export const enum PRICE_MM_TOKEN{
    NATIVE_TOKEN_AVAX = 'AVAX/USD',
    NATIVE_TOKEN_SEPOLIA = 'ETH/USD',
    LINK_TOKEN_AVAX='LINK/USD'
}

export const DOCS_LINK="https://pookafinance.gitbook.io/pookafinance-docs/";

export const BNB_TOKEN="/assets/bnb.svg";
export const BTC_TOKEN="/assets/btc.svg";
export const ETH_TOKEN="/assets/eth.svg";
export const SOL_TOKEN="/assets/solana.svg";
export const DOGE_TOKEN="/assets/doge.svg";
export const USDC_TOKEN="/assets/usdc.svg";
export const AVAX_TOKEN="/assets/avax.svg";
export const LINK_TOKEN="/assets/link.svg";
export const POOKA_LOGO="/assets/pookaLogo.svg";

export const markets = [
    { symbol: 'ETH/USD', name: 'Ethereum Perpetual', logo:"/assets/eth.svg"},
    { symbol: 'BTC/USD', name: 'Bitcoin Perpetual', logo:"/assets/btc.svg"},
  ];
  
// Hardcoded fallback values
export const FALLBACK_VALUES = {
    ETH: {
      symbol: "ETH/USD",
      price: 2439.2335,
      timestamp: Date.now(),
      high24h: 2490.234,
      low24h: 2380.583,
      dataSource: "fallback_hardcoded" as const,
    },
    BTC: {
      symbol: "BTC/USD",
      price: 109012.1923,
      timestamp: Date.now(),
      high24h: 111000.2033,
      low24h: 107000.4596,
      dataSource: "fallback_hardcoded" as const,
    },
  };
  