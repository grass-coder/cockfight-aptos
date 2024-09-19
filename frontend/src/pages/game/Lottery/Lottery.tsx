import React, { useEffect, useState } from "react"
import {
  Button,
  Container,
  Title,
  Group,
  Text,
  Box,
  Grid,
  SegmentedControl,
  Table,
  Switch,
  useMantineTheme,
} from "@mantine/core"

import LotteryHistory from "./LotteryHistory"
import LotteryDraw from "./LotteryDraw"

const Lottery = () => {
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const theme = useMantineTheme()
  const customOrange = theme.colors["custom-orange"]

  // Adjust image positions on resize to ensure they fit within the container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    window.addEventListener("resize", updateSize)
    updateSize() // Initialize size on mount

    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <>
      <Container ref={containerRef} style={{ padding: "20px", borderRadius: "8px", color: "#ffffff" }}>
        <Title order={2} style={{ marginBottom: "30px", textAlign: "left", color: "#000000" }}>
          Lottery
        </Title>

        <LotteryDraw />
        <LotteryHistory />
      </Container>
    </>
  )
}

export default Lottery
