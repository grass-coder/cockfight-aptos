import { Flex, Title } from "@mantine/core"
import ChickenCard from "../../components/ChickenCard"
import * as React from "react"
import { useStyles } from "../../styles/style"

import stable_chicken_thum from "../../images/market_temp/stable_chicken.png"
import volatile_chicken_thum from "../../images/market_temp/volatile_chicken.png"
import { CockieType } from "../../lib/consts"

const chickenData = [
  {
    title: "STABLE COCKIE",
    priceText: "1000 USDC",
    text: "APY 6% | Defi protocol",
    src: stable_chicken_thum,
    type: CockieType.STABLE,
    isFaded: false,
  },
  {
    title: "VOLATILE COCKIE",
    priceText: "0.1 ETH",
    text: "APY 7.3% | Defi protocol",
    src: volatile_chicken_thum,
    type: CockieType.VOLATILE,
    isFaded: true, 
  },
];

const BuyChickenPage = () => {
  const { classes } = useStyles()

  const renderChickenCards = () => {
    return chickenData.map((chicken, index) => (
      <ChickenCard
        key={index}
        title={chicken.title}
        priceText={chicken.priceText}
        text={chicken.text}
        src={chicken.src}
        type={chicken.type}
        isFaded={chicken.isFaded} 
      />
    ));
  };

  return (
    <Flex className={classes.frameFlex} align="flex-start">
      <Title
        mt={40}
        mb={40}
        order={2}
        c={"white.0"}
        style={{
          textAlign: "start",
        }}
      >
        BUY COCKIE<br></br>
        EARN EGG<br></br>
      </Title>
      <Flex direction="row" wrap="wrap" gap={16} justify="space-around">
        {renderChickenCards()}
      </Flex>
    </Flex>
  )
}

export default BuyChickenPage
