import { Flex, Title, Text, Tabs, Group } from "@mantine/core"
import EggCard from "../../components/EggCard"
import * as React from "react"
import { useStyles } from "../../styles/style"
import { useNavigate, Link } from "react-router-dom"
import RoundButton from "../../components/RoundButton"

import usdt from "../../images/token/USDT.png"
import usdc from "../../images/token/USDC.png"
import eth from "../../images/token/ETH.png"
import tia from "../../images/token/TIA.png"
import aptos from "../../images/token/APTOS.png"
import { CockieType } from "../../lib/consts"


const eggData = [
  { eggStr: "APTOS", eggIconSrc: aptos, eggKey: "APTOS", eggDiff: "19.5", tv: "$9892.19", hp: "$8.23", lp: "$5.32" },
  { eggStr: "USDC", eggIconSrc: usdc, eggKey: "USDC", eggDiff: "10.2", tv: "$5922.49", hp: "$0.15", lp: "$0.13" },
  { eggStr: "ETH", eggIconSrc: eth, eggKey: "ETH", eggDiff: "12.5", tv: "$1294.62", hp: "$4.13", lp: "$2.13" },
  { eggStr: "USDT", eggIconSrc: usdt, eggKey: "USDT", eggDiff: "15.5", tv: "$6322.23", hp: "$0.16", lp: "$0.13" },
  // { eggStr: "TIA", eggIconSrc: tia, eggKey: "TIA", eggDiff: "14.2", tv: "$3021.59", hp: "$2.14", lp: "$1.23" }
];

const MarketPage = () => {
  const { classes } = useStyles();
  const height = 60;
  const defaultTabValue = "egg";
  const navigate = useNavigate();
  
  return (
    <Flex className={classes.frameFlex} align="flex-start">
      <Tabs
        defaultValue={defaultTabValue}
        styles={(theme) => ({
          tab: {
            padding: "0 12px",
            lineHeight: `${height}px`,
            fontWeight: "bold",
            color: theme.colors["white"][0],
            border: "none",
            "&[data-active]": {
              color: theme.colors["custom-orange"][1],
            },
            "&:hover": {
              background: "none",
            },
          },
          tabsList: {
            borderBottom: "none",
          },
        })}
      >
        <Tabs.List position="left" grow={true}>
          <Tabs.Tab value="chicken">CHICKEN</Tabs.Tab>
          <Tabs.Tab value="egg">EGG</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      
      <Title mt={40} mb={40} order={2} color="white.0" style={{ textAlign: "start" }}>
        EGG MARKET
      </Title>

      <Text size={20} weight={600} color="white.0" mb={20}>
        Select the type of egg you want to buy
      </Text>

      <Group mb={80}>
        <RoundButton text={CockieType.STABLE} size="lg" variant="outline" textColor="white.0" />
        <RoundButton
          text={CockieType.VOLATILE}
          size="lg"
          variant="outline"
          textColor="white.0"
          disabled={true} 
        />
      </Group>

      <Flex direction="row" wrap="wrap" gap={16} w="100%">
        {eggData.map((egg) => (
          <EggCard
            key={egg.eggKey}
            eggStr={egg.eggStr}
            eggIconSrc={egg.eggIconSrc}
            eggDiff={egg.eggDiff}
            tv={egg.tv}
            hp={egg.hp}
            lp={egg.lp}
          />
        ))}
      </Flex>
    </Flex>
  );
};



export default MarketPage


