import { useParams } from "react-router-dom"
import React from "react"

import HorseRace from "./race/HorseRace"
import Lottery from "./Lottery/Lottery"

const GameDetailsPage:React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id)
  return (
    <>
      {id === "1" && <HorseRace />}
      {id === "2" && <Lottery />}
    </>
  )
}

export default GameDetailsPage
