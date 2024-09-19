import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    gameCard: {
        backgroundColor: theme.colors["dark-grey-0"],
    },
    chickenCard: {

    },
    eggCard: {

    },
    tabs: {
        tab: {
            padding: `0 12px`,
            lineHeight: '60px',
            fontWeight: 'bold',
            color: theme.colors["white"][0],
            border: 'none',
            '&[data-active]': {
            color: theme.colors["custom-orange"][1],
            },
            '&:hover': {
            background: 'none',
            }
        },
        tabsList: {
            borderBottom: 'none'
        },
        borderBottom: 'none',
        flexGrow: 1,
        width: "100%"
    },

    frameFlex: {
        padding: "80px",
        flexDirection: "column",
        // justifyContent: "center",
        width: "100%",
        alignItems: "center",
    }
}));

export { useStyles };