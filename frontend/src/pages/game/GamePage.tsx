import { useState } from "react"
import { Box, Flex, Group, Pagination, Title } from "@mantine/core"
import GameCard from "../../components/GameCard"
import * as React from "react"
import { useStyles } from "../../styles/style"
import RoundButton from "../../components/RoundButton"

import raceThum from "../../images/game/race_thum.png"
import lotteryThum from "../../images/game/lottery_thum.png"
import comingsoonThum from "../../images/game/comingsoon_thum.png"

const GamePage = () => {
  const { classes } = useStyles()
  return (
    <Flex className={classes.frameFlex} align="flex-start">
      <Title mt={40} mb={40} order={2} c={"white.0"}>
        GAMES
      </Title>
      <Flex direction="row" wrap="wrap" gap={16} justify="space-around">
        <GameCard
          title="RACE"
          text="Guess which 'Cockie' hits the jackpot and wins!"
          src={raceThum}
          gameKey="1"
        ></GameCard>
        <GameCard
          title="LOTTERY"
          text="Get an Lottery Ticket with your Eggs. Every week, someone wins big!"
          src={lotteryThum}
          gameKey="2"
        ></GameCard>
        <GameCard title="PRICE PREDICTION" text="Comming Soon!" src={comingsoonThum} gameKey="0"></GameCard>
      </Flex>
      <Group
        w="100%"
        style={{
          justifyContent: "center",
        }}
      >
        {/* <RoundButton mt={40} w="350px" text="VIEW MORE" size="lg" variant="outline" textColor="white.0"></RoundButton> */}
      </Group>
    </Flex>
  )
}

export default GamePage
