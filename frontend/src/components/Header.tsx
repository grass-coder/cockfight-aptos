import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Flex, Header, Modal } from "@mantine/core";
import RoundButton from "../components/RoundButton";
import { AccountInfo, useWallet, WalletName } from "@aptos-labs/wallet-adapter-react";
import NavigationTabs from "../app/navigationTabs";
import { aptos } from "../lib/aptosClient";

interface WalletButtonProps {
  account: AccountInfo | null;
  connect: (wallet: WalletName<"Petra">) => void;
  disconnect: () => void;
}

interface FaucetButtonProps {
  account: AccountInfo | null;
  requestFaucet: () => void;
}

interface CustomHeaderProps {
  height: number;
}


// Helper functions
const useActiveTab = () => {
  const location = useLocation();
  const parsedPath = location.pathname.split("/").filter((path) => path !== "");
  return parsedPath[0] ? parsedPath[0] : "Main"; 
};

const parseAddress = (address: string | undefined) => {
  if (address && address.length > 8) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }
  return address;
};

// FaucetButton Component
const FaucetButton: React.FC<FaucetButtonProps> = ({ account, requestFaucet }) => (
  <Container style={styles.walletContainer}>
    {!account?.address ? (
      <></>
    ) : (
      <RoundButton
        text="Faucet"
        size="lg"
        variant="outline"
        textColor="white.0"
        onClick={requestFaucet}
      />
    )}
  </Container>
);

// WalletButton Component
const WalletButton: React.FC<WalletButtonProps> = ({ account, connect, disconnect }) => (
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
        onClick={disconnect}
      />
    )}
  </Container>
);

// CustomHeader Component
const CustomHeader: React.FC<CustomHeaderProps> = ({ height }) => {
  const activeTab = useActiveTab();
  const { connect, disconnect, account } = useWallet();
  const navigate = useNavigate();

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const requestFaucet = async () => {
    if (!account?.address) return;
    try {
      await aptos.fundAccount({ accountAddress: account.address, amount: 100_000_000 });
      setSuccessModalOpen(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Faucet request failed.');
      setErrorModalOpen(true);
    }
  };

  return (
    <>
      <Header height={height} style={styles.header}>
        <Flex justify="space-between" w="100%">
          <NavigationTabs height={height} activeTab={activeTab} onTabChange={(page: any) => navigate(`/${page}`)} />
          <FaucetButton account={account} requestFaucet={requestFaucet} />
          <WalletButton account={account} connect={connect} disconnect={disconnect} />
        </Flex>
      </Header>

      <Modal
        opened={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Success"
      >
        <p>Faucet Funding was successful!</p>
      </Modal>

      <Modal
        opened={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="Error"
      >
        <p>{errorMessage}</p>
      </Modal>
    </>
  );
};

// Styles object for consistent styling
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

export default CustomHeader;
