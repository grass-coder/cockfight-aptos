// index.tsx 또는 main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { RecoilRoot } from 'recoil';
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { OKXWallet } from '@okwallet/aptos-wallet-adapter';
import { Network } from '@aptos-labs/ts-sdk';

import theme from './styles/theme';
import { createBrowserRouter } from 'react-router-dom';
import routes from './app/routes';

const queryClient = new QueryClient();
const wallets = [new OKXWallet()];
const router = createBrowserRouter(routes);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <AptosWalletAdapterProvider
            plugins={wallets}
            autoConnect={true}
            dappConfig={{ network: Network.TESTNET }}
          >
            <RouterProvider router={router} />
          </AptosWalletAdapterProvider>
        </MantineProvider>
      </QueryClientProvider>
    </RecoilRoot>
  </StrictMode>
);
