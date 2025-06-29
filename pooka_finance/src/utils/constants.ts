export const MARKET_SYMBOLS=["BTC/USD","ETH/USD"];

//SEPOLIA Address
export const USDC_TOKEN_SEPOLIA ="0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
export const NATIVE_TOKEN_SEPOLIA="0x0000000000000000000000000000000000000000"
export const CROSS_CHAIN_MANAGER_SEPOLIA="0x0bb4543671f72a41efcaa6f089f421446264cc49";

//AVAX Address
export const CONTRACT_ADDRESS_AVAX="0x9d2b2005ec13fb8a7191b0df208dfbd541827c19";
export const CONTRACT_ADDRESS_PRICE_FEED_AVAX="0x9f2b180d135c46012c97f5beb02307cc7dc32cbd";
export const CONTRACT_ADDRESS_POOL_MANAGER="0xb5abc3e5d2d3b243974f0a323c4f6514f70598cf";
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
export const ONE_CLICK='/assets/oneClick.svg';

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
  