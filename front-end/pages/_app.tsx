import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Web3Provider from '../src/web3/components/Web3Provider';
import { Fragment } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return <Fragment>
    <Web3Provider />
    <Component {...pageProps} />
  </Fragment>;
}

export default MyApp;
