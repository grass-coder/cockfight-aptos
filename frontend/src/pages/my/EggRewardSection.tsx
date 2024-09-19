import { Stack, Text, Title, Space } from "@mantine/core";
import RoundButton from "../../components/RoundButton";

interface EggRewardSectionProps {
  eggRewardDetailDisplayed: boolean;
  setEggRewardDetailDisplayed: (value: boolean) => void;
  egg: number;
  eggValue: number;
}

const EggRewardSection: React.FC<EggRewardSectionProps> = ({ eggRewardDetailDisplayed, setEggRewardDetailDisplayed, egg, eggValue }) => {
  const assetSectionHeight = 350;

  if (!eggRewardDetailDisplayed) {
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
        <Space style={{ flex: "1 0 0" }}></Space>
        <RoundButton
          fullWidth={true}
          size="lg"
          variant="outline"
          text="VIEW DETAILS"
          textColor={"white.0"}
          onClick={() => setEggRewardDetailDisplayed(true)}
        />
      </Stack>
    );
  }

  return (
    <Stack
      p={24}
      bg="light-orange.0"
      h={assetSectionHeight}
      align="start"
      spacing={8}
      style={{ display: "flex", borderRadius: "24px", flex: "1 1 0" }}
    >
      <Stack spacing={8}>
        <Text c="custom-orange.1" weight={600}>
          STACKING REWARDS
        </Text>
        <Title c="black.0" order={3}>
          $ LLLL.LLL
        </Title>
        <Text c="black.0">$ NNN.NNNN</Text>
      </Stack>
      <hr color="#aaaaaa" style={{ width: "100%", height: "0.5px", margin: 0 }}></hr>
      <Stack spacing={8}>
        <Text c="custom-orange.1" weight={600}>
          WINNING REWARDS
        </Text>
        <Title c="black.0" order={3}>
          $ LLLL.LLL
        </Title>
        <Text c="black.0">$ NNN.NNNN</Text>
      </Stack>
      <Space style={{ flex: "1 0 0" }}></Space>
      <RoundButton
        fullWidth={true}
        size="lg"
        variant="outline"
        text="BACK TO TOTAL"
        textColor={"black.0"}
        onClick={() => setEggRewardDetailDisplayed(false)}
      />
    </Stack>
  );
};

export default EggRewardSection;