import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Image,
  Title,
  Group,
  BackgroundImage,
  Text,
  Modal,
} from "@mantine/core";
import RoundButton from "../../../components/RoundButton";

import background from "../../../images/game/race/background.png";
import cockie1_1 from "../../../images/game/race/chick_racing_1_1.png";
import cockie1_2 from "../../../images/game/race/chick_racing_1_2.png";
import cockie1_3 from "../../../images/game/race/chick_racing_1_3.png";
import cockie2_1 from "../../../images/game/race/chick_racing_2_1.png";
import cockie2_2 from "../../../images/game/race/chick_racing_2_2.png";
import cockie2_3 from "../../../images/game/race/chick_racing_2_3.png";
import cockie3_1 from "../../../images/game/race/chick_racing_3_1.png";
import cockie3_2 from "../../../images/game/race/chick_racing_3_2.png";
import cockie3_3 from "../../../images/game/race/chick_racing_3_3.png";
import cockie4_1 from "../../../images/game/race/chick_racing_4_1.png";
import cockie4_2 from "../../../images/game/race/chick_racing_4_2.png";
import cockie4_3 from "../../../images/game/race/chick_racing_4_3.png";
import racer1Img from "../../../images/game/race/cockieSelection/cockie1.png";
import racer2Img from "../../../images/game/race/cockieSelection/cockie2.png";
import racer3Img from "../../../images/game/race/cockieSelection/cockie3.png";
import racer4Img from "../../../images/game/race/cockieSelection/cockie4.png";
import egg100Img from "../../../images/game/race/eggSelection/egg100.png";
import egg1000Img from "../../../images/game/race/eggSelection/egg1000.png";
import egg10000Img from "../../../images/game/race/eggSelection/egg10000.png";
import egg50000Img from "../../../images/game/race/eggSelection/egg50000.png";
import WinModal from "./WinModal";
import LoseModal from "./LoseModal";
import { COCKFIGHT_MODULE_ADDRESS } from "../../../lib/consts";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getCockieOwnerInfo, GetCockieOwnerInfoResponse, getGameResult } from "../../../data/query";
import { executeTx } from "../../../data/tx";

const racerImages = [
  [cockie1_1, cockie1_2, cockie1_3],
  [cockie2_1, cockie2_2, cockie2_3],
  [cockie3_1, cockie3_2, cockie3_3],
  [cockie4_1, cockie4_2, cockie4_3],
];

const finishLine = 800; // Finish line position (pixels)

const HorseRace: React.FC = () => {
  const { account, signAndSubmitTransaction } = useWallet()

  const [positions, setPositions] = useState<number[]>([0, 0, 0, 0]);
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [imageIndices, setImageIndices] = useState<number[]>([0, 0, 0, 0]);
  const [direction, setDirection] = useState<number[]>([1, 1, 1, 1]); // 1 for forward, -1 for backward
  const [winner, setWinner] = useState<number | null>(null);
  const [selectedRacer, setSelectedRacer] = useState<number>(0);
  const [selectedEgg, setSelectedEgg] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [winModalOpened, setWinModalOpened] = useState<boolean>(false);
  const [loseModalOpened, setLoseModalOpened] = useState<boolean>(false);
  const [eggModalOpened, setEggModalOpened] = useState<boolean>(false); // Modal for egg count warning
  const [cockieOwnerInfo, setCockieOwnerInfo] = useState<GetCockieOwnerInfoResponse>();
  const [gameResult, setGameResult] = useState<boolean | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleBetting = async () => {
    if (selectedRacer && selectedEgg) {
      // step 1. betting
      await executeTx(
        account,
        signAndSubmitTransaction,
        {
          sender: account?.address,
          data: {
            function: `${COCKFIGHT_MODULE_ADDRESS}::game::make_random_betting`,
            functionArguments: [selectedEgg],
          },
        }
      )

      // step 2. fetch winner
      await fetchData();
      setIsRacing(true);
    } else {
      // Optionally, show a message to select both a cockie and an egg amount
      setEggModalOpened(true);
    }
  };

  const fetchData = async () => {
    try {
      setError(null);

      if (account == null) {
        throw new Error("Unable to find account to sign transaction");
      }
      const cockieOwnerInfo = await getCockieOwnerInfo(account.address);
      setCockieOwnerInfo(cockieOwnerInfo);

      if (!cockieOwnerInfo) throw new Error("Unable to fetch cockie owner info");
      const gameResult = await getGameResult(Number(cockieOwnerInfo.last_game_id));
      setGameResult(gameResult ? gameResult : false);

      if (gameResult) {
        setWinner(Number(gameResult));
      } else {
        const otherRacers = [1, 2, 3, 4].filter(racer => racer !== selectedRacer);
        const randomIndex = Math.floor(Math.random() * otherRacers.length);
        setWinner(otherRacers[randomIndex]);
      }

      setLoading(false);
    } catch (err) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  // Handle window resize to update container width
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // You might want to set container width if needed
      }
    };

    window.addEventListener("resize", updateSize);
    updateSize(); // Initialize size on mount

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Racing logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRacing && winner !== null) {
      interval = setInterval(() => {
        setPositions((prevPositions) => {
          const newPositions = prevPositions.map((position, index) => {
            let increment;
            if (index === winner - 1) {
              increment = Math.floor(Math.random() * 10) + 10;
            } else {
              increment = Math.floor(Math.random() * 10);
            }
            const newPosition = position + increment;
            if (newPosition >= finishLine) {
              if (winner === null) {
                setWinner(index);
              }
              if ( selectedRacer === winner) {
                setWinModalOpened(true);
              } else {
                setLoseModalOpened(true);
              }
              return finishLine; // Racer stops at the finish line
            }
            
            return newPosition;
          });

          return newPositions;
        });

        // Update animation frames
        setImageIndices((prevIndices) =>
          prevIndices.map((index, i) => {
            if (direction[i] === 1) {
              if (index === 2) {
                setDirection((prevDirection) => {
                  const newDirection = [...prevDirection];
                  newDirection[i] = -1;
                  return newDirection;
                });
                return index - 1;
              }
              return index + 1;
            } else {
              if (index === 0) {
                setDirection((prevDirection) => {
                  const newDirection = [...prevDirection];
                  newDirection[i] = 1;
                  return newDirection;
                });
                return index + 1;
              }
              return index - 1;
            }
          })
        );
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRacing, direction, winner]);
  
  const resetRace = () => {
    setPositions([0, 0, 0, 0]);
    setImageIndices([0, 0, 0, 0]);
    setDirection([1, 1, 1, 1]);
    setIsRacing(false);
    setSelectedRacer(0);
    setSelectedEgg(null);
    setWinner(null);
    setWinModalOpened(false);
    setLoseModalOpened(false);
    setGameResult(null);
  };

  const selectCockie = (cockieNum: number) => {
    if (!isRacing) {
      setSelectedRacer(cockieNum);
    }
  };

  const selectEggs = (eggAmount: number) => {
    if (!isRacing) {
      setSelectedEgg(eggAmount);
    }
  };

  return (
    <Container ref={containerRef}>
      {loading && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Text>Loading...</Text>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>
          <Text>{error}</Text>
        </div>
      )}
      <Title
        order={5}
        style={{
          textAlign: "start",
        }}
      >
        <br />
      </Title>
      <Group position="center" style={{ marginBottom: 20 }}>
        <BackgroundImage
          src={background}
          style={{ width: "100%", height: "600px", position: "relative" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              height: "100%",
            }}
          >
            {positions.map((position, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  top: `${index * 100 + 100}px`,
                  left: `${position}px`,
                  width: "200px",
                  height: "50px",
                  display: "block"
                }}
              >
                <Image
                  src={racerImages[index][imageIndices[index]]}
                  alt={`Horse ${index + 1}`}
                  style={{
                    transition: "margin-left 0.5s",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            ))}
          </div>
        </BackgroundImage>
      </Group>

      {/* Cockie and Egg Selection */}
      <Group position="center" style={{ marginTop: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {/* Cockie selection */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[racer1Img, racer2Img, racer3Img, racer4Img].map(
              (imgSrc, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border:
                      selectedRacer === idx + 1
                        ? "4px solid orange"
                        : "2px solid gray",
                    cursor: "pointer",
                  }}
                  onClick={() => selectCockie(idx + 1)}
                >
                  <Image
                    src={imgSrc}
                    alt={`Racer ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )
            )}
          </div>

          {/* Separator line */}
          <div
            style={{
              borderLeft: "2px solid #ccc",
              height: "100px",
              margin: "0 20px",
            }}
          ></div>

          {/* Egg selection */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[100, 1000, 10000, 50000].map((eggAmount, idx) => {
              const eggImages = [
                egg100Img,
                egg1000Img,
                egg10000Img,
                egg50000Img,
              ];
              return (
                <div
                  key={eggAmount}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border:
                      selectedEgg === eggAmount
                        ? "4px solid orange"
                        : "2px solid gray",
                    cursor: "pointer",
                  }}
                  onClick={() => selectEggs(eggAmount)}
                >
                  <Image
                    src={eggImages[idx]}
                    alt={`${eggAmount} Eggs`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Group>

      {/* Betting Button */}
      <Group position="center" style={{ margin: 20 }}>
        {/* {!isRacing ? (
          selectedRacer && selectedEgg ? ( */}
            <RoundButton
              text="BETTING NOW"
              size="lg"
              mt={20}
              variant="filled"
              bgColor="custom-orange.1"
              textColor={"black"}
              onClick={handleBetting}
            />
          {/* ) : (
            <RoundButton
              text="SELECT YOUR COCKIE AND EGG"
              size="lg"
              mt={20}
              variant="filled"
              bgColor="gray"
              textColor={"black"}
              disabled
            />
          )
        ) : null} */}
      </Group>

      {/* Race Status */}
      <Group position="center" style={{ marginTop: 20 }}>
        <div>
          {winner !== null && (
            <Text align="center" size="xl" color="green" mt="md">
              {`Winner: Racer ${winner + 1}`}
            </Text>
          )}
        </div>
      </Group>

      {/* Modals */}
      <Modal
        opened={eggModalOpened}
        onClose={() => setEggModalOpened(false)}
        title="Eggs Insufficient"
      >
        <Text>Not enough eggs to place this bet.</Text>
      </Modal>
      <WinModal isOpened={winModalOpened} reset={resetRace} />
      <LoseModal isOpened={loseModalOpened} reset={resetRace} />
    </Container>
  );
};

export default HorseRace;
