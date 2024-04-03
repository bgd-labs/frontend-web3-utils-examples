import type { NextPage } from 'next';

import { Counter } from '../src/counter/components/counter';
import { WalletList } from '../src/web3/components/WalletList';

const Home: NextPage = () => {
  return (
    <div>
      <WalletList />
      <Counter />
    </div>
  );
};

export default Home;
