import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@mantine/core"

/**
 * @param props
 *     @param text context
 *     @param size xl/lg type
 *     @param bgColor orange/black/grey/white
 *     @param textColor orange/black/white
 *     @param variant gradient/outline/filled
 *     @param onclick function
 * @returns
 */
const RoundButton = (props:any) => {
  const { to, text, size, bgColor, textColor, variant, onClick, mt, mb, fullWidth, w, disabled } = props
  const returnButton = () => {
    return (
      <Button
        onClick={onClick || null}
        w={w}
        fullWidth={fullWidth}
        mb={mb}
        mt={mt}
        color={textColor}
        bg={variant === "gradient" ? "" : variant === "filled" ? bgColor : "transparent"}
        variant={variant}
        radius={"32px"}
        size={size}
        m={fullWidth ? 0 : "unset"}
        styles={(theme) => ({
          root: {
            height: "unset",
            "&": theme.fn.hover({
              opacity: 0.8,
              backgroundColor: bgColor,
            }),
          },
          inner: {
            color: `${textColor}`,
          },
        })}
        disabled={disabled}
      >
        {text}
      </Button>
    )
  }
  return to ? <Link to={to}>{returnButton()}</Link> : returnButton()
}

export default RoundButton
