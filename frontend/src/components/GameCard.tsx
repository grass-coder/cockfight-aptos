import React from "react";
import { Card, Text, Image, Title, useMantineTheme, Space } from "@mantine/core";
import RoundButton from "./RoundButton";

const GameCard = ({ title, src, text, time, gameKey }: any) => {
  const imageWidth = 364;
  const imageHeight = time ? 216 : 250;
  const theme = useMantineTheme();
  const buttonText = gameKey === 0 ? "WAIT" : "PLAY";
  const buttonLink = gameKey !== 0 ? `/game/${gameKey}` : undefined;
  const buttonColor = gameKey === 0 ? theme.colors["light-orange"] : theme.colors["custom-orange"][1];
  
  return (
    <Card
      radius={24}
      withBorder={false}
      shadow="xs"
      padding="md"
      w={imageWidth}
      bg="dark-grey.0"
      mih={500}
      style={{ flexDirection: "column", display: "flex" }}
    >
      <Card.Section mt="sm">
        <Image width={imageWidth} height={imageHeight} src={src} />
      </Card.Section>
      <Card.Section
        mt={0}
        p={20}
        style={{ display: "flex", flexDirection: "column", flex: "1 0 auto" }}
      >
        {time && (
          <Text size="sm" c="grey.0" fw="normal" pb="4px">
            {time}
          </Text>
        )}
        <Title
          order={3}
          c="white.0"
          style={{ textAlign: "start", paddingBottom: "10px" }}
        >
          {title}
        </Title>
        <Text size="md" c="grey.0">
          {text}
        </Text>
        <Space style={{ flex: "1 0 auto" }} />
        <RoundButton
          text={buttonText}
          size="lg"
          mt={20}
          variant="filled"
          bgColor="black.0"
          textColor={buttonColor}
          fullWidth
          to={buttonLink}
        />
      </Card.Section>
    </Card>
  );
};

export default GameCard;
