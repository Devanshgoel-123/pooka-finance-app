import { http, createConfig } from 'wagmi'
import { avalancheFuji, sepolia } from 'wagmi/chains'

export const config = createConfig({
    chains: [avalancheFuji, sepolia],
    transports: {
      [avalancheFuji.id]: http(),
      [sepolia.id]: http(),
    },
  })
  