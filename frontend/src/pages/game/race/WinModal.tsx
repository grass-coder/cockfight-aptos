import React, { useState } from "react"
import { Modal, Image, Group } from "@mantine/core"
import { createStyles } from "@mantine/core"
import winnerImg from "../../../images/game/modal/winModal.png"
import RoundButton from "../../../components/RoundButton"

const useStyles = createStyles((theme) => ({
  modalContent: {
    backgroundColor: "#000", // Set the modal background to black
    color: "#fff", // Set the text color to white for better contrast
  },
  modalTitle: {
    backgroundColor: "#000", // Set the modal background to black
    color: "#000", // Set the title color to white
  },
}))

interface propsType {
  isOpened: boolean
  reset: any
}

const WinModal = (props: propsType) => {
  const { classes } = useStyles()

  return (
    <Modal
      opened={props.isOpened}
      centered
      overlayColor="rgba(0, 0, 0, 0.85)" // Adjust the overlay color to make the background dark
      withCloseButton={false}
      radius={20}
      styles={{
        content: classes.modalContent,
      }}
    >
      <Image src={winnerImg} alt="Winner" />

      <Group position="center" style={{ margin: 1 }}>
        <RoundButton
          text="Check My EGGS"
          size="lg"
          mt={20}
          variant="filled"
          bgColor="custom-orange.1"
          textColor={"black"}
          onClick={props.reset}
        ></RoundButton>
      </Group>
    </Modal>
  )
}

export default WinModal
