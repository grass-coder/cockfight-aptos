import { Flex, Title, Text, Tabs, Group, Stack, Center, Card, Space, Popover, Checkbox } from "@mantine/core"
import EggCard from "../../components/EggCard"
import * as React from "react"
import { useStyles } from "../../styles/style"
import RoundButton from "../../components/RoundButton"
import FilterCheckbox from "../../components/FilterCheckbox"
import GameCard from "../../components/GameCard"
import HistoryComponent from "./HistoryComponent"

import raceThum from "../../images/game/race/cockieSelection/cockie1.png"
import lotteryThum from "../../images/game/lottery_thum.png"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { TEST_APT_ADDRESS } from "../../lib/aptosClient"
import EggRewardSection from "./EggRewardSection"
import { getBalance } from "../../data/query"
import AssetSection from "./AssetSection"

const assetSectionHeight = 350


const MyPage = () => {
  const { classes } = useStyles()
  const [eggRewardDetailDisplayed, setEggRewardDetailDisplayed] = React.useState(false)
  const [myBalance, setMyBalance] = React.useState<number | undefined>(0)

  const [egg, setEgg] = React.useState(0)
  const [stableChicken, setStableChicken] = React.useState(0)
  const [volatileChicken, setVolatileChicken] = React.useState(0)
  
  const [totalAssetValue, setTotalAssetValue] = React.useState(0)
  const [eggValue, setEggValue] = React.useState(0)
  const [stableChickenValue, setStableChickenValue] = React.useState(0)
  const [volatileChickenValue, setVolatileChickenValue] = React.useState(0)

  const { account } = useWallet()


  const fetchData = async () => {
    try {
      if (account?.address) {
        const balance = await getBalance(TEST_APT_ADDRESS, "0x1::aptos_coin::AptosCoin") ?? 0
        console.log(balance)
        setMyBalance(balance)
        
        // const accountRes = await axios.get(
        //   `${API_URL}/user?address=${address}`,
        // );
        // const user: User = accountRes.data;
        // let stable = 0;
        // let volatile = 0;
        // for (const cockie of user.cockies) {
        //   if (cockie.owner !== address) continue
        //   if (cockie.type === CockieType.STABLE) {
        //     stable += 1;
        //   } else if (cockie.type === CockieType.VOLATILE) {
        //     volatile += 1;
        //   }
        // }
        // setEgg(user.egg);
        // setStableChicken(stable);
        // setVolatileChicken(volatile);
        
        // const eggValue = user.egg * DUMMY_EGG_PRICE;
        // const stableChickenValue = stable * DUMMY_STABLE_COCKIE_PRICE ;
        // const volatileChickenValue = volatile * DUMMY_VOLATILE_COCKIE_PRICE * (1 + Math.random() * 0.1 - 0.05);
        // const totalAssetValue = eggValue + stableChickenValue + volatileChickenValue + balance / 10 ** 6;


        // setEggValue(eggValue);
        // setStableChickenValue(stableChickenValue);
        // setVolatileChickenValue(volatileChickenValue);
        // setTotalAssetValue(totalAssetValue);
      }
    } catch (error) {
      console.error('Failed to fetch egg balance:', error);
    }
  };

  React.useEffect(() => {
    fetchData()
  }, [])

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
          {/* {account && (
            <div>
              <button onClick={faucet}>Faucet</button>
            </div>
          )} */}
          <Title c="black.0" order={3} mb={10}>
            YOUR TOTAL ASSET
          </Title>
          <Title c="black.0" order={2}>
            $ {totalAssetValue.toFixed(2)}
          </Title>
        </Center>
        <EggRewardSection
          eggRewardDetailDisplayed={eggRewardDetailDisplayed}
          setEggRewardDetailDisplayed={setEggRewardDetailDisplayed}
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
          time="1H 25M 34S"
          title="RACE"
          text={
            <span>
              Bet amount: 100 eggs<br></br> Winning amount: 2500 eggs
            </span>
          }
          src={raceThum}
          gameKey="1"
        ></GameCard>
        <GameCard
          time="1H 25M 34S"
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
