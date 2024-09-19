declare module "*.svg" {
  import type { FC, SVGProps } from "react"
  export const ReactComponent: FC<SVGProps<SVGElement>>
  const src: string
  export default src
}
