import React from 'react';
import { Card, Text, Image, Title, Space, Flex, Stack} from '@mantine/core';


const HistoryComponent = (props: {title: String, dayDiff: String, betAmount: String, resultAmount: String, isWin: boolean}) => {
  // when time is not null, remain time displayed
  const { title, dayDiff, betAmount, resultAmount, isWin } = props;
  return (
    <Flex w="100%" align="center" direction="row" m="0 16px" p="16px" style={{
      borderTop: "1px solid #aaaaaa"
    }}>
      <Stack spacing={0} >
        <Title order={3} c={"white.0"}>{title}</Title>
        <Text c={"grey.0"} weight="600">
          { dayDiff } days ago | 
          Bet amount: { betAmount }
        </Text>
      </Stack>
      <Space style={{
        flex: "1 0 auto"
      }}></Space>
      <Title order={3} mr={24} c={isWin ? "custom-orange.1" : "grey.0"}>{isWin ? "+" : "-"}{resultAmount}</Title>
      <Title order={3} c="white.0"> {isWin ? "WON" : "LOSE"}</Title>
    </Flex>
  );
};

export default HistoryComponent;