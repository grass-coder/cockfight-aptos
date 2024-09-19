import React, { useEffect, useState } from "react"
import { Button, Container, Image, Title, Group, BackgroundImage, Text, Modal } from "@mantine/core"
import RoundButton from "../../../components/RoundButton"
import axios from 'axios';

import background from "../../../images/game/race/background.png"
import cockie1_1 from "../../../images/game/race/chick_racing_1_1.png"
import cockie1_2 from "../../../images/game/race/chick_racing_1_2.png"
import cockie1_3 from "../../../images/game/race/chick_racing_1_3.png"
import cockie2_1 from "../../../images/game/race/chick_racing_2_1.png"
import cockie2_2 from "../../../images/game/race/chick_racing_2_2.png"
import cockie2_3 from "../../../images/game/race/chick_racing_2_3.png"
import cockie3_1 from "../../../images/game/race/chick_racing_3_1.png"
import cockie3_2 from "../../../images/game/race/chick_racing_3_2.png"
import cockie3_3 from "../../../images/game/race/chick_racing_3_3.png"
import cockie4_1 from "../../../images/game/race/chick_racing_4_1.png"
import cockie4_2 from "../../../images/game/race/chick_racing_4_2.png"
import cockie4_3 from "../../../images/game/race/chick_racing_4_3.png"
import racer1Img from "../../../images/game/race/cockieSelection/cockie1.png" // Import racer selection images
import racer2Img from "../../../images/game/race/cockieSelection/cockie2.png"
import racer3Img from "../../../images/game/race/cockieSelection/cockie3.png"
import racer4Img from "../../../images/game/race/cockieSelection/cockie4.png"
import egg100Img from "../../../images/game/race/eggSelection/egg100.png" // Import egg selection images
import egg1000Img from "../../../images/game/race/eggSelection/egg1000.png"
import egg10000Img from "../../../images/game/race/eggSelection/egg10000.png"
import egg50000Img from "../../../images/game/race/eggSelection/egg50000.png"
import WinModal from "./WinModal"
import LoseModal from "./LoseModal"
import { useAddress } from "@initia/react-wallet-widget"
import { API_URL } from "../../../lib/consts";

const racerImg1 = [cockie1_1, cockie1_2, cockie1_3]
const racerImg2 = [cockie2_1, cockie2_2, cockie2_3]
const racerImg3 = [cockie3_1, cockie3_2, cockie3_3]
const racerImg4 = [cockie4_1, cockie4_2, cockie4_3]

const horseImages = [racerImg1, racerImg2, racerImg3, racerImg4]
const finishLine = 800 // Finish line position (pixels)

const HorseRace = () => {
  const address = useAddress()

  const [positions, setPositions] = useState([0, 0, 0, 0])
  const [isRacing, setIsRacing] = useState(false)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [imageIndices, setImageIndices] = useState([0, 0, 0, 0])
  const [direction, setDirection] = useState([1, 1, 1, 1]) // 1 for forward, -1 for backward
  const [fastestRacer, setFastestRacer] = useState<number | null>(null)
  const [winner, setWinner] = useState<number | null>(null)
  const [selectedRacer, setSelectedRacer] = useState<number | null>(null)
  const [selectedEgg, setSelectedEgg] = useState<number | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [winModalOpened, setWinModalOpened] = useState(false)
  const [loseModalOpened, setLoseModalOpened] = useState(false)

  const [userEggs, setUserEggs] = useState<number>(0); // Track the user's egg count
  const [eggModalOpened, setEggModalOpened] = useState(false); // Modal for egg count warning

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    window.addEventListener("resize", updateSize)
    updateSize() // Initialize size on mount

    return () => window.removeEventListener("resize", updateSize)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRacing) {
      interval = setInterval(() => {
        setPositions((prevPositions) => {
          const newPositions = prevPositions.map((position, index) => {
            const increment = Math.floor(Math.random() * 10)
            const newPosition = position + increment
            if (newPosition >= finishLine) {
              if (winner === null) {
                setWinner(index)
              }
              return finishLine // Racer stops at the finish line
            }
            return newPosition
          })
          const leadingPosition = Math.max(...newPositions)
          const leadingRacer = newPositions.indexOf(leadingPosition)
          setFastestRacer(leadingRacer)
          return newPositions
        })

        setImageIndices((prevIndices) =>
          prevIndices.map((index, i) => {
            if (direction[i] === 1) {
              if (index === 2) {
                setDirection((prevDirection) => {
                  const newDirection = [...prevDirection]
                  newDirection[i] = -1
                  return newDirection
                })
                return index - 1
              }
              return index + 1
            } else {
              if (index === 0) {
                setDirection((prevDirection) => {
                  const newDirection = [...prevDirection]
                  newDirection[i] = 1
                  return newDirection
                })
                return index + 1
              }
              return index - 1
            }
          })
        )
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isRacing, containerWidth, direction, winner, selectedRacer])

  useEffect(() => {
    if (winner !== null && fastestRacer !== null) {
      if (fastestRacer + 1 == selectedRacer) {
        console.log("WIN \n", "winner; ", fastestRacer + 1, "yours; ", selectedRacer)
        setWinModalOpened(true)
        setLoseModalOpened(false)

        const body = {
          address,
          betting: selectedEgg,
          is_win: true

        }
        axios
          .post(`${API_URL}/game/egg`, body)
          .then((response) => {
            console.log('win: ', response, API_URL);
          })
          .catch((error) => {
            console.error('win error: ', error);
          })

      } else {
        setLoseModalOpened(true)
        setWinModalOpened(false)

        const body = {
          address,
          betting: selectedEgg,
          is_win: false

        }
        axios
          .post(`${API_URL}/game/egg`, body)
          .then((response) => {
            console.log('lose response: ', response, API_URL);
          })
          .catch((error) => {
            console.error('lose error: ', error);
          })
      }
    }
  }, [winner])

  const resetRace = () => {
    setPositions([0, 0, 0, 0])
    setImageIndices([0, 0, 0, 0])
    setDirection([1, 1, 1, 1])
    setIsRacing(false)
    setFastestRacer(null)
    setSelectedRacer(null)
    setSelectedEgg(null)
    setWinner(null)
    setWinModalOpened(false)
    setLoseModalOpened(false)
  }

  const selectCockie = (cockieNum: number) => {
    if (!isRacing) {
      setSelectedRacer(cockieNum)
    }
  }

  const selectEggs = (eggAmount: number) => {
    if (!isRacing) {
      axios.get(`${API_URL}/user?address=${address}`)
        .then(response => {
          setUserEggs(response.data.eggs);
          if (response.data.egg < eggAmount) {
            setEggModalOpened(true); // Open modal if eggs are insufficient
          } else {
            setSelectedEgg(eggAmount);
          }
        })
        .catch(error => {
          console.error('Error fetching egg data:', error);
        });
    }
  }

  return (
    <Container ref={containerRef}>
      
      <Title
        order={5}
        style={{
          textAlign: "start",
        }}
      >
        <br></br>
      </Title>
      <Group position="center" style={{ marginBottom: 20 }}>
        <BackgroundImage src={background} style={{ width: "100%", height: "600px", position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", position: "relative", height: "100%" }}>
            {positions.map((position, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  top: `${index * 100 + 100}px`,
                  left: `${position}px`,
                  width: "200px",
                  height: "50px",
                  display: winner === null ? "block" : "none",
                }}
              >
                <Image
                  src={horseImages[index][imageIndices[index]]}
                  alt={`Horse ${index + 1}`}
                  style={{ transition: "margin-left 0.5s", width: "100%", height: "100%" }}
                />
              </div>
            ))}
          </div>
        </BackgroundImage>
      </Group>
      <Group position="center" style={{ marginTop: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px", // 간격 조정
            marginTop: "20px",
          }}
        >
          {/* Cockie selection */}
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: selectedRacer === 1 ? "4px solid orange" : "none",
                cursor: "pointer",
              }}
              onClick={() => selectCockie(1)}
            >
              <Image
                src={racer1Img}
                alt="Racer 1"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: selectedRacer === 2 ? "4px solid orange" : "none",
                cursor: "pointer",
              }}
              onClick={() => selectCockie(2)}
            >
              <Image
                src={racer2Img}
                alt="Racer 2"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: selectedRacer === 3 ? "4px solid orange" : "none",
                cursor: "pointer",
              }}
              onClick={() => selectCockie(3)}
            >
              <Image
                src={racer3Img}
                alt="Racer 3"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: selectedRacer === 4 ? "4px solid orange" : "none",
                cursor: "pointer",
              }}
              onClick={() => selectCockie(4)}
            >
              <Image
                src={racer4Img}
                alt="Racer 4"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Separator line */}
          <div style={{ borderLeft: "2px solid #ccc", height: "100px", margin: "0 20px" }}></div>

          {/* Egg selection */}
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: selectedEgg === 100 ? "4px solid orange" : "none",
                cursor: "pointer",
              }}
              onClick={() => selectEggs(100)}
            >
              <Image
                src={egg100Img}
                alt="100 Eggs"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: selectedEgg === 1000 ? "4px solid orange" : "none",
                cursor: "pointer",
              }}
              onClick={() => selectEggs(1000)}
            >
              <Image
                src={egg1000Img}
                alt="1000 Eggs"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: selectedEgg === 10000 ? "4px solid orange" : "none",
                cursor: "pointer",
              }}
              onClick={() => selectEggs(10000)}
            >
              <Image
                src={egg10000Img}
                alt="10000 Eggs"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: selectedEgg === 50000 ? "4px solid orange" : "none",
                cursor: "pointer",
              }}
              onClick={() => selectEggs(50000)}
            >
              <Image
                src={egg50000Img}
                alt="50000 Eggs"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>
      </Group>

      <Group position="center" style={{ margin: 20 }}>
        {!isRacing ? (
          selectedEgg && selectedEgg ? (
            <RoundButton
              text="BETTING NOW"
              size="lg"
              mt={20}
              variant="filled"
              bgColor="custom-orange.1"
              textColor={"black"}
              onClick={() => setIsRacing(!isRacing)}
            ></RoundButton>
          ) : (
            <RoundButton
              text="SELECT YOUR COCKIE"
              size="lg"
              mt={20}
              variant="filled"
              bgColor="gray"
              textColor={"black"}
            ></RoundButton>
          )
        ) : (
          ""
        )}
      </Group>

      <Group position="center" style={{ marginTop: 20 }}>
        <div>
          {fastestRacer !== null && winner === null && (
            <Text align="center" size="lg" color="blue">
              Fastest Racer: {`Racer ${fastestRacer + 1}`}
            </Text>
          )}

          {winner !== null && (
            <Text align="center" size="xl" color="green" mt="md">{`Winner: Racer ${winner + 1}`}</Text>
          )}
        </div>
      </Group>
      <Modal opened={eggModalOpened} onClose={() => setEggModalOpened(false)} title="Eggs Insufficient">
        <Text>Not enough eggs to place this bet.</Text>
      </Modal>
      <WinModal isOpened={winModalOpened} />
      <LoseModal isOpened={loseModalOpened} reset={resetRace} />
    </Container>
  )
}

export default HorseRace
