import type { NotificationProps } from "@mantine/notifications"
import { showNotification } from "@mantine/notifications"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import CallMadeSharpIcon from "@mui/icons-material/CallMadeSharp"
import InfoSharp from "@mui/icons-material/InfoSharp"
import { Box } from "@mantine/core"
import ExplorerLink from "./ExplorerLink"

interface Props extends Partial<NotificationProps> {
  type: "success" | "failed" | "notification"
  txHash?: string
  error?: Error
}

const showTxNotification = ({ type, txHash, error, ...rest }: Props) => {
  showNotification({
    icon:
      type === "notification" ? (
        <InfoSharp sx={{ fontSize: 18 }} />
      ) : type === "success" ? (
        <CheckCircleIcon sx={{ fontSize: 18 }} />
      ) : (
        <ErrorIcon sx={{ fontSize: 18 }} />
      ),
    title: rest.title
      ? rest.title
      : type === "notification"
        ? "Notification"
        : type === "success"
          ? "Success"
          : "Failed",
    message:
      rest.message ?? type === "success" ? (
        <Box c="brand">
          <ExplorerLink tx value={txHash ?? ""}>
            View on Initia Scan
            <CallMadeSharpIcon sx={{ fontSize: "14px" }} />
          </ExplorerLink>
        </Box>
      ) : (
        error?.message ?? ""
      ),
    sx: {
      padding: "16px !important",
      borderRadius: 8,
      width: 320,
      marginLeft: "auto",
      marginRight: 20,
    },
    styles: ({ fn }) => ({
      root: {
        maxHeight: "none !important",
        alignItems: "flex-start",
      },
      icon: {
        backgroundColor: "transparent !important",
        width: 18,
        height: 18,
        svg: {
          color:
            type === "notification"
              ? fn.themeColor("warning")
              : type === "success"
                ? fn.themeColor("success")
                : fn.themeColor("danger"),
        },
      },
      closeButton: {
        svg: { color: fn.themeColor("mono.1") },
        ":hover": {
          backgroundColor: "transparent",
          svg: { color: fn.themeColor("mono.3") },
        },
      },
      description: {
        wordBreak: "break-word",
      },
    }),
    ...rest,
  })
}

export default showTxNotification
