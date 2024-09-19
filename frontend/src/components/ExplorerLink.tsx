import type { HTMLAttributes, PropsWithChildren } from "react"
import ExternalLink from "./ExternalLink"
// import { network } from "../shared"

interface Props extends HTMLAttributes<HTMLAnchorElement> {
  value: string
  block?: boolean
  tx?: boolean
}

const ExplorerLink = ({ value, children, block, tx, ...attrs }: PropsWithChildren<Props>) => {
  // const isExplorer = network.chainId.includes("stone")

  // const scanPath = tx ? "txs" : block ? "blocks" : ValAddress.validate(value) ? "validator" : "accounts"
  // const explorerPath = tx ? "tx" : block ? "block" : ValAddress.validate(value) ? "validator" : "address"

  // const explorerHref = new URL(`${explorerPath}/${value}`, network.explorer)
  // const scanHref = new URL(`${network.chainId}/${scanPath}/${value}`, network.explorer)

  return (
    <>
    </>
    // <ExternalLink {...attrs} href={(isExplorer ? explorerHref : scanHref).toString()}>
    //   {children || (block ? value : truncate(value))}
    // </ExternalLink>
  )
}

export default ExplorerLink
