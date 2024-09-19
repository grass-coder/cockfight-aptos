import { Container } from "@mantine/core"
import { useParams } from "react-router-dom"
import React from "react"

import HorseRace from "./race/HorseRace"
import Lottery from "./Lottery/Lottery"

const GameDetailsPage = () => {
  const { gameId } = useParams()

  return (
    <>
      {gameId === "1" && <HorseRace />}
      {gameId === "2" && <Lottery />}
    </>
  )
}

export default GameDetailsPage
