import { createPublicClient, http } from "viem"
import { base, mainnet} from "viem/chains"



export const publicClient = createPublicClient({
  chain: base,
  transport: http(`https://api.developer.coinbase.com/rpc/v1/base/${process.env.NEXT_PUBLIC_BASE_NODE_API_KEY}`),
})


export const publicClientMainnet = createPublicClient({
  chain: mainnet,
  transport: http(),
})