import React, { useEffect, useState } from "react"
import {
  Button,
  Container,
  Title,
  Group,
  Text,
  Box,
  Grid,
  useMantineTheme,
  NumberInput,
  Divider,
  Tooltip,
} from "@mantine/core"
import LotteryModal from "./LotteryModal"

const LotteryDraw = () => {
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const theme = useMantineTheme()
  const customOrange = theme.colors["custom-orange"]

  const [prizePoolEggs, setPrizePoolEggs] = useState<number>(4928300)
  const [prizePoolUsd, setPrizePoolUsd] = useState<number>(0)
  const [userTicketNum, setUserTicketNum] = useState<number>(0)
  const [totalTicketNum, setTotalTicketNum] = useState<number>(49283)
  const [userBuyingTickets, setUserBuyingTickets] = useState<number>(0)
  const [userPayingEggs, setUserPayingEggs] = useState<number>(0)
  const [costEgg, setCostEgg] = useState<number>(0) // New state for cost
  const [modalOpened, setModalOpened] = useState<boolean>(true) // State for modal

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

  useEffect(() => {
    setPrizePoolUsd(prizePoolEggs * 0.1)
  }, [prizePoolEggs])

  const handleTicketChange = (value: number) => {
    setUserBuyingTickets(value)
    setCostEgg(value * 100) // Update cost based on the number of tickets
  }

  return (
    <Container
      ref={containerRef}
      style={{ backgroundColor: "#1e1e1e", padding: "20px", borderRadius: "8px", color: "#ffffff" }}
    >
      <Group position="apart" align="flex-end" style={{ marginBottom: "20px" }}>
        <Title order={3} style={{ color: customOrange[1] }}>
          Weekly Draw
        </Title>
        <Text style={{ color: "#888888" }}>#82 | Draw: at June 9, 2024, 9:00 PM</Text>
      </Group>
      <Grid style={{ marginTop: "20px" }}>
        <Grid.Col span={6}>
          <Box style={{ textAlign: "center", backgroundColor: "#2b2b2b", padding: "10px", borderRadius: "8px" }}>
            <Text style={{ color: customOrange[0], fontSize: "24px" }}>Prize Pool (Eggs)</Text>
            <Text style={{ fontSize: "32px" }}>{prizePoolEggs}</Text>
            <Text style={{ color: "#888888" }}>${prizePoolUsd}</Text>
          </Box>
        </Grid.Col>
        <Grid.Col span={6}>
          <Box style={{ textAlign: "center", backgroundColor: "#2b2b2b", padding: "10px", borderRadius: "8px" }}>
            <Text style={{ color: customOrange[0], fontSize: "24px" }}>Your tickets</Text>
            <Text style={{ fontSize: "32px" }}>{userTicketNum}</Text>
            <Text style={{ color: "#888888" }}>Total tickets: {totalTicketNum}</Text>
          </Box>
        </Grid.Col>
      </Grid>

      <Container
        style={{
          backgroundColor: "#2b2b2b",
          padding: "20px",
          borderRadius: "8px",
          color: "#ffffff",
          marginTop: "20px",
        }}
      >
        <Group position="apart" style={{ marginBottom: "20px" }}>
          <Text size="xl" weight={700} style={{ color: customOrange[0] }}>
            Buy your Tickets 🎟️
          </Text>
        </Group>

        <NumberInput
          hideControls
          value={userBuyingTickets}
          min={0}
          step={1}
          onChange={handleTicketChange} // Update value on change
          styles={{
            input: { backgroundColor: "#1e1e1e", textAlign: "right", color: "#ffffff" },
            rightSection: { pointerEvents: "none" },
          }}
          formatter={(value) => value!.replace(/\D/g, "")} // Remove non-digit characters
          parser={(value) => value!.replace(/\D/g, "")} // Remove non-digit characters
        />

        <Divider my="sm" style={{ borderColor: "#444444" }} />

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Cost (EGG)
          </Text>
          <Text size="sm">{costEgg} EGG</Text>
        </Group>

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Bulk discount
            <Tooltip label="Discount applies to bulk purchases" withArrow>
              <span style={{ marginLeft: "5px", cursor: "pointer" }}>?</span>
            </Tooltip>
          </Text>
          <Text size="sm">~0 EGG</Text>
        </Group>

        <Divider my="sm" style={{ borderColor: "#444444" }} />

        <Group position="apart">
          <Text weight={500}>You pay</Text>
          <Text weight={700} style={{ color: customOrange[0] }}>
            ~{costEgg} EGG
          </Text>
        </Group>

        <Button
          fullWidth
          style={{ backgroundColor: customOrange[0], color: "#000000", marginTop: "20px" }}
          onClick={() => setModalOpened(true)}
        >
          Buy Now
        </Button>
      </Container>

      <LotteryModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        customOrange={customOrange}
        ticketCount={userBuyingTickets}
      />
    </Container>
  )
}

export default LotteryDraw
