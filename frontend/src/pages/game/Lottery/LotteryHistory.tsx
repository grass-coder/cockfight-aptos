import React from "react"
import { Button, Box, Group, Text, Table, Switch, createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => ({
  tableContainer: {
    color: "#ffffff",
    "& th": {
      color: "#ffffff",
    },
    "& td": {
      color: "#ffffff",
    },
    "& tr:hover td": {
      color: "#000000",
      backgroundColor: "#FFE7D5", // Optional: Add background color change on hover
    },
  },
  switchLabel: {
    color: "#FF9D2B",
  },
}))

const LotteryHistory = () => {
  const { classes } = useStyles()

  const lotteryHistoryData = [
    { id: 81, prizePool: "3.7644", players: "620", entries: "280K", date: "21:00 26/05/2024" },
    { id: 80, prizePool: "13.5968", players: "2132", entries: "1.3M", date: "21:00 19/05/2024" },
    { id: 79, prizePool: "3.4815", players: "636", entries: "260K", date: "21:00 12/05/2024" },
    { id: 78, prizePool: "4.0885", players: "804", entries: "360K", date: "21:00 05/05/2024" },
    { id: 77, prizePool: "4.17", players: "874", entries: "350K", date: "21:00 28/04/2024" },
    { id: 76, prizePool: "3.9382", players: "1042", entries: "410K", date: "21:00 21/04/2024" },
    { id: 75, prizePool: "4.1402", players: "1147", entries: "350K", date: "21:00 14/04/2024" },
    { id: 74, prizePool: "3.9956", players: "2482", entries: "320K", date: "21:00 07/04/2024" },
    { id: 73, prizePool: "3.2225", players: "374", entries: "380K", date: "21:00 31/03/2024" },
    { id: 72, prizePool: "20.8491", players: "773", entries: "1.9M", date: "21:00 24/03/2024" },
  ]

  return (
    <Box style={{ marginTop: "40px" }}>
      <Group position="apart">
        <Text size="xl" weight={700} style={{ color: "#FF4802" }}>
          Lottery History
        </Text>
        <Group>
          <Switch label="Only My Entries" classNames={{ label: classes.switchLabel }} />
        </Group>
      </Group>
      <Table highlightOnHover verticalSpacing="md" className={classes.tableContainer} style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Prize Pool</th>
            <th>Your Winnings</th>
            <th>Your Entries</th>
            <th>Players</th>
            <th>Entries</th>
            <th>Date</th>
            <th>Verify</th>
          </tr>
        </thead>
        <tbody>
          {lotteryHistoryData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {item.prizePool}{" "}
                <span role="img" aria-label="ETH">
                  💰
                </span>
              </td>
              <td>-</td>
              <td>-</td>
              <td>{item.players}</td>
              <td>{item.entries}</td>
              <td>{item.date}</td>
              <td>...</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Group position="center" style={{ marginTop: "20px" }}>
        <Button variant="outline" color="yellow">
          Load More
        </Button>
      </Group>
    </Box>
  )
}

export default LotteryHistory
