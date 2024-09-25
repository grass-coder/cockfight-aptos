import React, { useState } from "react"
import {
  Card,
  Text,
  Image,
  Title,
  Space,
  Flex,
  Stack,
  Modal,
  Button,
  NumberInput,
} from "@mantine/core"
import RoundButton from "./RoundButton"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { COCKFIGHT_MODULE_ADDRESS } from "../lib/consts"
import { executeTx } from "../data/tx"

const EggCard = (props: any) => {
  const { eggStr, eggIconSrc, eggDiff, tv, hp, lp } = props
  const { account, signAndSubmitTransaction } = useWallet()

  const [modalOpen, setModalOpen] = useState(false)
  const [buyAmount, setBuyAmount] = useState<number>(10)

  const handleClick = () => {
    setModalOpen(true)
  }

  const handleConfirmBuy = () => {
    executeTx(account, signAndSubmitTransaction, {
      sender: account?.address,
      data: {
        function: `${COCKFIGHT_MODULE_ADDRESS}::game::buy_eggs`,
        functionArguments: [buyAmount],
      },
    })
    setModalOpen(false)
  }

  return (
    <>
      <Card
        p={40}
        radius={24}
        withBorder={false}
        shadow="xs"
        miw={300}
        padding="md"
        w="calc(33% - 16px)"
        bg="dark-grey.0"
        style={{
          flexDirection: "column",
          display: "flex",
        }}
      >
        <Card.Section
          withBorder={true}
          pb={20}
          style={{
            borderColor: "gray",
          }}
        >
          <Flex align="center" direction="row">
            <Image mr={20} width={100} height={100} src={eggIconSrc}></Image>
            <Stack spacing={4}>
              <Title order={3} c={"white.0"}>
                {eggStr}
              </Title>
              <Text order={3} c={"grey.0"}>
                {eggDiff}%
              </Text>
            </Stack>
          </Flex>
        </Card.Section>
        <Card.Section
          mt={20}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 0 auto",
          }}
        >
          <Text size="md" c="grey.0">
            Trading Volume {tv}
            <br />
            Highest Price {hp}
            <br />
            Lowest Price {lp}
            <br />
          </Text>
          <Space
            style={{
              flex: "1 0 auto",
            }}
          ></Space>
          <RoundButton
            text="BUY NOW"
            size="lg"
            mt={20}
            variant="filled"
            bgColor="custom-orange.1"
            textColor={"black"}
            fullWidth
            onClick={handleClick}
          ></RoundButton>
        </Card.Section>
      </Card>

      {/* 모달 추가 */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Enter Buy Amount"
      >
        <NumberInput
          label="Amount"
          value={buyAmount}
          onChange={(value) => setBuyAmount(value || 1)}
          min={1}
        />
        <Button mt={20} fullWidth onClick={handleConfirmBuy}>
          Confirm
        </Button>
      </Modal>
    </>
  )
}

export default EggCard
