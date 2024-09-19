import type { AnchorHTMLAttributes } from "react"
import ArrowOutwardSharpIcon from "@mui/icons-material/ArrowOutwardSharp"
import { Group } from "@mantine/core"

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: boolean
}

const ExternalLink = ({ children, icon, ...attrs }: Props) => {
  return (
    <a {...attrs} target="_blank" rel="noreferrer">
      <Group spacing="xs">
        {children}
        {icon && <ArrowOutwardSharpIcon sx={{ fontSize: 14 }} />}
      </Group>
    </a>
  )
}

export default ExternalLink
