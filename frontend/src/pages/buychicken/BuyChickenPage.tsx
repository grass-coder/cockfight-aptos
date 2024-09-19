import { Flex, Title } from "@mantine/core"
import ChickenCard from "../../components/ChickenCard"
import * as React from "react"
import { useStyles } from "../../styles/style"

import stable_chicken_thum from "../../images/market_temp/stable_chicken.png"
import volatile_chicken_thum from "../../images/market_temp/volatile_chicken.png"
import { CockieType } from "../../lib/consts"

const BuyChickenPage = () => {
  const { classes } = useStyles()

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
        BUY CHICKEN<br></br>
        AND GET THE YIELD EGGS<br></br>
        PERIODICALLY
      </Title>
      <Flex direction="row" wrap="wrap" gap={16} justify="space-around">
        <ChickenCard
          title="STABLE CHICKEN"
          priceText="1000 USDC"
          text="APY 6% | Defi prococol | Base layer"
          src={stable_chicken_thum}
          type={CockieType.STABLE}
        ></ChickenCard>
        <ChickenCard
          title="VOLATILE CHICKEN"
          priceText="0.1 ETH"
          text="APY 7.3% | Defi prococol | Base layer"
          src={volatile_chicken_thum}
          type={CockieType.VOLATILE}
        ></ChickenCard>
      </Flex>
      <Title mt={40} mb={40} order={3} c={"white.0"}>
        WE’LL BRING MORE DIVERSE CHICKENS WITH DIFFERENT PRICE OPTIONS AND DEFI PROTOCOLS IN THE NEAR FUTURE!
      </Title>
    </Flex>
  )
}

export default BuyChickenPage
