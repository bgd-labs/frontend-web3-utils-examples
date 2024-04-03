import '../styles/globals.css';

import type { AppProps } from 'next/app';

import { ZustandStoreProvider } from '../src/store/ZustandStoreProvider';
import WagmiConfigProviderWrapper from '../src/web3/components/WagmiProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ZustandStoreProvider>
      <WagmiConfigProviderWrapper />
      <Component {...pageProps} />
    </ZustandStoreProvider>
  );
}

export default MyApp;
