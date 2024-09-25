import { Flex, Group, Title } from "@mantine/core";
import GameCard from "../../components/GameCard";
import * as React from "react";
import { useStyles } from "../../styles/style";

import raceThum from "../../images/game/race_thum.png";
import lotteryThum from "../../images/game/lottery_thum.png";
import comingsoonThum from "../../images/game/comingsoon_thum.png";
import { Outlet, useParams } from "react-router-dom";

const gameData = [
  {
    title: "RACE",
    text: "Try Your Speed",
    src: raceThum,
    gameKey: "1",
  },
  {
    title: "LOTTERY",
    text: "Try Your Luck",
    src: lotteryThum,
    gameKey: "2",
  },
  {
    title: "PRICE PREDICTION",
    text: "Coming Soon!",
    src: comingsoonThum,
    gameKey: "0",
  },
];

const GamePage = () => {
  const { classes } = useStyles();
  const { id } = useParams<{ id?: string }>();


  return (
    <Flex className={classes.frameFlex} align="flex-start">
      {id ? (<Outlet />)
        :(
          <>
        <Title mt={40} mb={40} order={2} c={"white.0"}>
          GAMES
        </Title>
        <Flex direction="row" wrap="wrap" gap={16} justify="space-around">
          {gameData.map((game) => (
            <GameCard
              key={game.gameKey}
              title={game.title}
              text={game.text}
              src={game.src}
              gameKey={game.gameKey}
            />
          ))}
        </Flex>
        <Group
          w="100%"
          style={{
            justifyContent: "center",
          }}
        >
        </Group>
      </>
      )}
    </Flex>
  );
};

export default GamePage;
