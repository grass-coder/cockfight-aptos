import React from "react";
import { Stack, Text, Title } from "@mantine/core";

interface AssetSectionProps {
  title: string;
  value: number;
  color?: string;
  bgColor?: string;
}

const AssetSection = ({ title, value, color, bgColor }: AssetSectionProps) => (
  <Stack
    p={24}
    bg={bgColor || "dark-grey.0"}
    align="start"
    spacing={8}
    style={{
      display: "flex",
      borderRadius: "24px",
      flex: "1 1 0",
    }}
  >
    <Text c={color || "custom-orange.1"} weight={600}>
      {title}
    </Text>
    <Title c="white.0" order={3}>
      {value}
    </Title>
    <Text c="grey.0">$ {value.toFixed(2)}</Text>
  </Stack>
);

export default AssetSection;