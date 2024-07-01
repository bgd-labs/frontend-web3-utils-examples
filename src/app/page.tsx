import type { NextPage } from 'next';

import { Counter } from '../components/counter';
import { WalletList } from '../components/web3/WalletList';

const Home: NextPage = () => {
  return (
    <div>
      <WalletList />
      <Counter />
    </div>
  );
};

export default Home;
