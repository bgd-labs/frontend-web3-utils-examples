import { Web3Provider as Web3BaseProvider } from '../../packages/src/web3/providers/Web3Provider';
import { useStore } from '../../store';
import { CHAINS } from '../../utils/chains';

export default function Web3Provider() {
  return (
    <Web3BaseProvider
      connectorsInitProps={{
        appName: 'AAVEGovernanceV3',
        chains: CHAINS,
        desiredChainId: 1,
      }}
      useStore={useStore}
    />
  );
}
