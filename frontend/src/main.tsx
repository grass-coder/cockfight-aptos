import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { RecoilRoot } from 'recoil';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Tuple, DefaultMantineColor, MantineProvider } from '@mantine/core';
import routes from './app/routes';  // Assuming this is the correct path to your routes file
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter"
import { Network } from "@aptos-labs/ts-sdk"

import theme from './styles/theme';

const queryClient = new QueryClient();

const router = createBrowserRouter(routes)

type ExtendedCustomColors = 'custom-orange' | 'light-orange' | 'dark-grey' | 'grey' | 'black' | 'white' | DefaultMantineColor;
  declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

const renderInitialApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const router = createBrowserRouter(routes);
  const wallets = [
    new OKXWallet()
  ]
  createRoot(rootElement).render(
    <StrictMode>
      <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <AptosWalletAdapterProvider
            plugins={wallets}
            autoConnect={true}
            dappConfig={{ network: Network.TESTNET}}
          >
            <RouterProvider router={router}/>
          </AptosWalletAdapterProvider>
        </MantineProvider>
      </QueryClientProvider>
      </RecoilRoot>
    </StrictMode>
  );
};

renderInitialApp();
