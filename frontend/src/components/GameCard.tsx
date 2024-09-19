import React from "react"
import { Card, Text, Image, Title, useMantineTheme, Space } from "@mantine/core"
import RoundButton from "./RoundButton"

const GameCard = (props) => {
  // when time is not null, remain time displayed
  const { title, src, text, time, gameKey } = props
  const imageWidth = 364
  const imageHeight = time ? 216 : 250
  const theme = useMantineTheme()
  const customOrange = theme.colors["custom-orange"]
  const lightOrange = theme.colors["light-orange"]

  return (
    <Card
      radius={24}
      withBorder={false}
      shadow="xs"
      padding="md"
      w={imageWidth}
      bg="dark-grey.0"
      mih={500}
      style={{
        flexDirection: "column",
        display: "flex",
      }}
    >
      <Card.Section mt="sm" style={{}}>
        <Image width={imageWidth} height={imageHeight} src={src}></Image>
      </Card.Section>
      <Card.Section
        mt="0"
        p={20}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 0 auto",
        }}
      >
        <Text size="sm" c="grey.0" fw="normal" pb="4px">
          {time}
        </Text>
        <Title
          p="0 0 10px"
          order={3}
          c={"white.0"}
          style={{
            textAlign: "start",
          }}
        >
          {title}
        </Title>
        <Text size="md" c="grey.0">
          {text}
        </Text>
        <Space
          style={{
            flex: "1 0 auto",
          }}
        ></Space>
        {gameKey == 0 ? (
          <RoundButton
            text="WAIT"
            size="lg"
            mt={20}
            variant="filled"
            bgColor="black.0"
            textColor={lightOrange}
            fullWidth
          ></RoundButton>
        ) : (
          <RoundButton
            to={"/game/" + gameKey}
            text="PLAY"
            size="lg"
            mt={20}
            variant="filled"
            bgColor="black.0"
            textColor={customOrange[1]}
            fullWidth
          ></RoundButton>
        )}
      </Card.Section>
    </Card>
  )
}

export default GameCard
