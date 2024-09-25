import * as React from "react"
import { Box, Flex, Stack, Title, BackgroundImage, Image } from "@mantine/core"
import { useRecoilState } from "recoil"
import { StyleState } from "../../states/atoms"
import RoundButton from "../../components/RoundButton"
import ExplainCard from "../../components/ExplainCard"
import { useStyles } from "../../styles/style"

import titleImg from "../../images/app/title.png"
import bodyImg from "../../images/app/body.png"

import featureImg1 from "../../images/cockie/cockie1.png"
import featureImg2 from "../../images/cockie/cockie2.png"
import featureImg3 from "../../images/cockie/cockie3.png"

const MainPage = () => {
  const { classes } = useStyles()

  const [headerHeight, setheaderHeight] = useRecoilState(StyleState)
  return (
    <Flex
      direction="column"
      style={{
        backgroundColor: "black",
      }}
    >
      <BackgroundImage
        mt={-headerHeight}
        mb={headerHeight}
        w="100vw"
        h="100vh"
        src={titleImg}
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Flex className={classes.frameFlex} h="100%" justify={"center"}>
          <RoundButton
            to="/cockie"
            text="GO TO BUY CHICKEN"
            size="lg"
            bgColor="orange"
            textColor="white"
            variant="gradient"
            onclick={() => {}}
            mt={60}
          />
        </Flex>
      </BackgroundImage>
      <BackgroundImage mt={-headerHeight} w="100vw" className="linearGradientBg" bg={""} src="">
        <Flex
          className={classes.frameFlex}
          h="100%"
          style={{
            color: "white",
            padding: "80px",
            position: "relative",
            zIndex: 0,
          }}
        >
          <Title mt={80} order={2}>
            HOW IT WORKS
          </Title>
          <Flex className={classes.frameFlex} justify="space-around" direction={"row"}>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "1 0 0",
              }}
            >
              <Stack align="start">
                <Title order={3}>1. BUY COCKIES</Title>
                <Title order={4}>BUY AND COLLECT YOUR OWN COCKIES</Title>

                <Title mt={30} order={3}>
                  2. GET EGGS
                </Title>
                <Title order={4}>YOU WILL GET EGGS THAT ARE LAID FROM YOUR COCKIES</Title>

                <Title mt={30} order={3}>
                  3. PLAY GAMES
                </Title>
                <Title order={4}>BET OR USE THE EGGS TO WIN GAMES, GET MORE EGGS!</Title>

                <Title mt={30} order={3}>
                  4. EARN MONEY
                </Title>
                <Title order={4}>EXCHANGE YOUT EGGS OR COCKIES TO CASH</Title>
              </Stack>
            </Box>

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "1 0 0",
              }}
            >
              <Image src={bodyImg} width={"40vw"}></Image>
            </Box>
          </Flex>
        </Flex>
      </BackgroundImage>
      <Flex className={classes.frameFlex} pb={100}>
        <Title mt={80} mb={20} order={2} color={"white.0"}>
          OUR FEATURE
        </Title>
        <Title mb={40} order={3} color={"white.0"}>
          USERS ARE OUR FIRST PRIORITY
        </Title>
        <Flex
          w="100%"
          direction="row"
          justify="center"
          gap="20px"
          style={{
            flexWrap: "wrap",
          }}
        >
          <ExplainCard
            title="TRANSPARENCY"
            text="Don't believe team, belive the system"
            src={featureImg1}
          ></ExplainCard>
          <ExplainCard
            title="INSTANCY"
            text="Get yield instantly and just enjoy the game!"
            src={featureImg2}
          ></ExplainCard>
          <ExplainCard
            title="SIMPLICITY"
            text="What the hell is DeFi and staking? No more stress and headache"
            src={featureImg3}
          ></ExplainCard>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default MainPage
