import { Flex, Title, Text, Tabs, Stack, Center, Card, Space, Popover, Checkbox } from "@mantine/core"
import React, { useState } from "react";
import { useStyles } from "../../styles/style"
import RoundButton from "../../components/RoundButton"
import FilterCheckbox from "../../components/FilterCheckbox"
import GameCard from "../../components/GameCard"
import HistoryComponent from "./HistoryComponent"

import raceThum from "../../images/game/race_thum.png"
import lotteryThum from "../../images/game/lottery_thum.png"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import EggRewardSection from "./EggRewardSection"
import { getBalance, getCockieOwnerInfo, GetCockieOwnerInfoResponse } from "../../data/query"
import AssetSection from "./AssetSection"
import { MoveValue } from "@aptos-labs/ts-sdk";
import { aptos } from "../../lib/aptosClient";

const assetSectionHeight = 350


const MyPage = () => {
  const { classes } = useStyles()
  const [myBalance, setMyBalance] = React.useState<number>(0)

  const [egg, setEgg] = React.useState(0)
  const [stableChicken, setStableChicken] = React.useState(0)
  const [volatileChicken, setVolatileChicken] = React.useState(0)
  
  const [eggValue, setEggValue] = React.useState(0)
  const [stableChickenValue, setStableChickenValue] = React.useState(0)

  const [cockieOwnerInfo, setCockieOwnerInfo] = useState<GetCockieOwnerInfoResponse>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

  const { account } = useWallet()

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (account == null) {
        throw new Error("Unable to find account to sign transaction");
      }
      const balance = await getBalance(account.address, "0x1::aptos_coin::AptosCoin");
      setMyBalance(balance ?? 0);
      
      const cockieOwnerInfo = await getCockieOwnerInfo(account.address);
      setCockieOwnerInfo(cockieOwnerInfo);

      const cockieNums = cockieOwnerInfo?.cockie_addresses ? (cockieOwnerInfo.cockie_addresses as MoveValue[] ).length : 0;
      setStableChicken(cockieNums);
      setStableChickenValue(cockieNums * 100);
      
      setEgg(Number(cockieOwnerInfo?.eggs) || 0);
      setEggValue(Number(cockieOwnerInfo?.eggs) || 0);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setTimeUntilMidnight(`${hours}H ${minutes}M ${seconds}S`);
  };

  React.useEffect(() => {
    if (account) fetchData()

    calculateTimeUntilMidnight();
    const timer = setInterval(() => {
      calculateTimeUntilMidnight();
    }, 1000); 

    return () => clearInterval(timer);
  }, [account])

  return (
    <Stack className={classes.frameFlex} spacing={80}>
      <Flex direction="row" gap={20} w={"100%"}>
        <Center
          p={24}
          h={assetSectionHeight}
          bg="custom-orange.1"
          style={{
            flex: "2 1 0",
            flexDirection: "column",
            borderRadius: "24px",
            alignItems: "start",
          }}
        >
          <Title c="black.0" order={3} mb={10}>
            YOUR TOTAL ASSET
          </Title>
          <Title c="black.0" order={2}>
            {myBalance ? (myBalance / 10**8) : 0} APT
          </Title>
        </Center>
        <EggRewardSection
          egg={egg}
          eggValue={eggValue}
        />
        <Stack h={350} style={{ flex: "1 1 0" }}>
          <AssetSection title="VOLATILE CHICKEN" value={volatileChicken} color={"red"} bgColor={""} />
          <AssetSection title="STABLE CHICKEN" value={stableChicken} />
        </Stack>
      </Flex>
      <Flex direction="row" justify="space-between" w="100%">
        <Tabs
          defaultValue="menu1"
          w="100%"
          styles={(theme) => ({
            tab: {
              fontSize: "24px",
              padding: `0 12px`,
              lineHeight: 60 + "px",
              fontWeight: "bold",
              color: theme.colors["grey"][0],
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
            borderBottom: "none",
          })}
        >
          <Tabs.List>
            <Tabs.Tab value="menu1" c="">
              MENU1
            </Tabs.Tab>
            <Tabs.Tab value="menu2">MENU2</Tabs.Tab>
            <Tabs.Tab value="menu3">MENU3</Tabs.Tab>
            <Tabs.Tab value="menu4">MENU4</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Space
          style={{
            flex: "1 0 auto",
          }}
        ></Space>
        <Popover>
          <Popover.Target>
            <Text c="white.0" lh="60px" weight={600} size={20}>
              FILTER
            </Text>
          </Popover.Target>
          <Popover.Dropdown
            p={24}
            bg="custom-orange.1"
            style={{
              border: "none",
              borderRadius: "20px",
            }}
          >
            <Stack w="220px">
              <FilterCheckbox label="SEE ALL"></FilterCheckbox>
              <FilterCheckbox label="GAME 1"></FilterCheckbox>
              <FilterCheckbox label="GAME 2"></FilterCheckbox>
              <FilterCheckbox label="GAME 3"></FilterCheckbox>
              <FilterCheckbox label="GAME 4"></FilterCheckbox>
              <RoundButton size="lg" variant="outline" textColor="black.0" bgColor="" text="VIEW MORE"></RoundButton>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Flex>
      <Flex direction="row" wrap="wrap" gap={16} justify="space-around">
        <GameCard
          time={timeUntilMidnight}
          title="RACE"
          text={
            <span>
              Bet amount: 100 ~ 50000 eggs<br></br> Winning amount: 400 ~ 200000 eggs
            </span>
          }
          src={raceThum}
          gameKey="1"
        ></GameCard>
        <GameCard
          time={timeUntilMidnight}
          title="LOTTERY"
          text={
            <span>
              Bet amount: 100 eggs<br></br> Winning amount: 2500 eggs
            </span>
          }
          src={lotteryThum}
          gameKey="2"
        ></GameCard>
      </Flex>
      <Stack w="100%" p="16px" spacing={0}>
        <Text c="custom-orange.1" mb={20}>
          HISTORY
        </Text>
        <HistoryComponent title="PRICE PREDICTION" dayDiff="2" betAmount="400" isWin resultAmount="1600" />
        <HistoryComponent title="PRICE PREDICTION" dayDiff="2" betAmount="100" isWin={false} resultAmount="100" />
        <HistoryComponent title="PRICE PREDICTION" dayDiff="2" betAmount="500" isWin resultAmount="3000" />
        <HistoryComponent title="PRICE PREDICTION" dayDiff="2" betAmount="700" isWin resultAmount="3000" />
      </Stack>
    </Stack>
  )
}

export default MyPage
