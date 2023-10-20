import "../styles/globals.css";
import type { AppProps } from "next/app";
import WagmiConfigProviderWrapper from "../src/web3/components/Web3Provider";


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfigProviderWrapper />

      <Component {...pageProps}/>
    </>
  );
}

export default MyApp;
