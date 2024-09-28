import React, { useState, useEffect } from "react"
import { Modal, Text, Button, Box, useMantineTheme } from "@mantine/core"

interface LotteryModalProps {
  opened: boolean
  onClose: () => void
  customOrange: string[]
  ticketCount: number
}

const LotteryModal: React.FC<LotteryModalProps> = ({ opened, onClose, customOrange, ticketCount }) => {
  const theme = useMantineTheme()
  const [randomList, setRandomList] = useState<string[]>([])

  useEffect(() => {
    makeRandom()
  }, [ticketCount])

  const makeRandom = () => {
    const randoms: string[] = []
    for (let i = 1; i <= ticketCount; i++) {
      let randomNum = Math.floor(Math.random() * 100000).toString()
      randomNum = randomNum.padStart(5, "0") // 앞에 0을 채워 5글자로 만들기
      randoms.push(randomNum)
    }

    setRandomList(randoms)
  }

  const renderTickets = () => {
    return randomList.map((randomNum, i) => (
      <Box key={i} style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <Text style={{ marginRight: "10px", color: "#888888" }}>#{String(i + 1).padStart(3, "0")}</Text>
        <Box
          style={{
            display: "flex",
            gap: "10px",
            border: `2px solid ${customOrange[0]}`,
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {[...randomNum].map((num, idx) => (
            <Text key={idx} style={{ color: "#000000" }}>
              {num}
            </Text>
          ))}
        </Box>
      </Box>
    ))
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Lottery Ticket"
      centered
      sx={{
        ".mantine-Modal-modal": {
          backgroundColor: "#1e1e1e",
          color: "#ffffff",
          borderRadius: "8px",
        },
        ".mantine-Modal-title": {
          color: customOrange[1],
        },
        ".mantine-Modal-body": {
          textAlign: "center",
        },
      }}
    >
      {renderTickets()}
      {/* <Button
        fullWidth
        style={{
          backgroundColor: customOrange[0],
          color: "#000000",
          marginBottom: "10px",
        }}
      >
        Confirm and buy
      </Button>
      <Button
        fullWidth
        variant="outline"
        style={{
          color: customOrange[0],
          borderColor: customOrange[0],
          marginBottom: "20px",
        }}
        onClick={makeRandom} // 랜덤화 버튼 클릭 시 makeRandom 함수 호출
      >
        Randomize
      </Button> */}
      <Text>
        This will be released soon! <br></br> Please wait for the next update.
      </Text>
      <Button variant="subtle" fullWidth style={{ color: customOrange[0] }} onClick={onClose}>
        Go back
      </Button>
    </Modal>
  )
}

export default LotteryModal
