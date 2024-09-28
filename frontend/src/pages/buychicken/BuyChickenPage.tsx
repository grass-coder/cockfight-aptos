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
    priceText: "0.001 APT",
    text: "APY 19.2% | Defi protocol",
    src: stable_chicken_thum,
    type: CockieType.STABLE,
    isFaded: false,
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
