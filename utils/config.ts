import { createConfig, http, cookieStorage, createStorage } from "wagmi"
import { base, baseSepolia } from "wagmi/chains"

//export const chains=
export const config = createConfig({
  chains: [ base, baseSepolia ],
  ssr: true,
  storage: createStorage({  
    storage: cookieStorage, 
  }),
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    [baseSepolia.id]: http()
  },
})

