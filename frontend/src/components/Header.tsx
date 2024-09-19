import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Container, Flex, Header, } from "@mantine/core"
import RoundButton from "../components/RoundButton"
import { AccountInfo, useWallet, WalletName } from "@aptos-labs/wallet-adapter-react"
import { NavigationTabs } from "../app/routes"

interface WalletButtonProps {
  account: AccountInfo | null;
  connect: (walletName: WalletName) => void;
  disconnect: () => void;
}

interface CustomHeaderProps {
  height: number;
}

const TABS = [
  { path: "/", label: "HOME", value: "home", pathPattern: /^\/$/ },
  { path: "/buychicken", label: "BUY CHICKEN", value: "buychicken", pathPattern: /^\/buychicken/ },
  { path: "/game", label: "GAME", value: "game", pathPattern: /^\/game/ },
  { path: "/market", label: "MARKET", value: "market", pathPattern: /^\/market/ },
  { path: "/my", label: "MYPAGE", value: "my", pathPattern: /^\/my/ },
];

const useActiveTab = () => {
  const location = useLocation();
  const activeTab = TABS.find((tab) => tab.pathPattern.test(location.pathname));
  return activeTab ? activeTab.value : "home";
};

const parseAddress = (address: string | undefined) => {
  if (address && address.length > 8) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }
  return address
}


const WalletButton: React.FC<WalletButtonProps> = ({ account, connect, disconnect }) => {
  return (
    <Container style={styles.walletContainer}>
      {!account?.address ? (
        <RoundButton
          to="/"
          text="CONNECT"
          size="lg"
          variant="filled"
          bgColor="custom-orange.1"
          textColor="black"
          onClick={() => connect("Petra" as WalletName<"Petra">)}
        />
      ) : (
        <RoundButton
          to="/"
          text={parseAddress(account.address)}
          size="lg"
          variant="outline"
          textColor="white.0"
          onClick={() => disconnect()}
        />
      )}
    </Container>
  );
};

function CustomHeader(props: CustomHeaderProps) {
  const activeTab = useActiveTab();
  const { connect, disconnect, account } = useWallet();

  const { height } = props
  const navigate = useNavigate()
  
  return (
    <Header
      height={height}
      style={{
        borderBottom: "none",
        background: "transparent",
      }}
    >
      <Flex justify="space-between" w="100%">
      <NavigationTabs height={height} activeTab={activeTab} onTabChange={(page: string) => navigate(`/${page}`)} />
      <WalletButton account={account} connect={connect} disconnect={disconnect} />
      </Flex>
    </Header>
  )
}

const styles = {
  header: {
    borderBottom: "none",
    background: "transparent",
  },
  walletContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default CustomHeader
