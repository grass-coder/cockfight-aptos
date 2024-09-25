import React, { useEffect, useState } from "react";
import { Stack, Text, Title, Space } from "@mantine/core";

interface EggRewardSectionProps {
  egg: number;
  eggValue: number;
}

const EggRewardSection: React.FC<EggRewardSectionProps> = ({ egg, eggValue }) => {
  const assetSectionHeight = 350;
  const [timeUntilNextDistribution, setTimeUntilNextDistribution] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nextMinute = new Date(now.getTime());
      nextMinute.setSeconds(60, 0);
      
      const diff = nextMinute.getTime() - now.getTime();

      const seconds = Math.ceil(diff / 1000);

      setTimeUntilNextDistribution(`${seconds} seconds`);
    };

    updateTimer();

    const timer = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Stack
      p={24}
      bg="dark-grey.0"
      h={assetSectionHeight}
      align="start"
      spacing={8}
      style={{ display: "flex", borderRadius: "24px", flex: "1 1 0" }}
    >
      <Text c="custom-orange.1" weight={600}>
        TOTAL<br></br>EGG REWARDS
      </Text>
      <Title c="white.0" order={3}>
        {egg}
      </Title>
      <Text c="grey.0">$ {eggValue.toFixed(2)}</Text>
      <Text c="grey.0">Next distribution in: {timeUntilNextDistribution}</Text>
      <Space style={{ flex: "1 0 0" }}></Space>
    </Stack>
  );
}

export default EggRewardSection;