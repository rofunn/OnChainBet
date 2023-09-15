import Web3, { Web3BaseProvider, providers } from 'web3';
import abi from '../constants/abi';
import contractAddress from '../constants/address';

const web3 = new Web3(
  'wss://eth-sepolia.g.alchemy.com/v2/ET7Rh8pt9Djc9dEaYvVcxhWd5EtIn3PK'
);

const ethToWei = (eth: number) => Web3.utils.toWei(eth.toString(), 'ether');
const onChainBet = new web3.eth.Contract(abi, contractAddress);

const placeBet = async (
  contractAddress: string,
  address: string,
  multiplier: number,
  amount: number
) => {
  const transactionParameters = {
    from: address,
    to: contractAddress,
    data: onChainBet.methods
      .placeBet(Number(multiplier).toString(16))
      .encodeABI(),
    value: amount.toString(16),
  };
  try {
    const txHash = await (window as any).ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    return {
      status: 'Success! Transaction hash: ' + txHash,
    };
  } catch (error) {
    return {
      status: 'Something went wrong',
    };
  }
};

const getContractBalance = async () => {
  return web3.eth.getBalance(contractAddress);
};

const connectWallet = async () => {
  if ((window as any).ethereum) {
    try {
      const addressArray = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });
      const obj = {
        connected: true,
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: '',
        connected: false,
      };
    }
  } else {
    return {
      address: '',
      connected: false,
    };
  }
};

export { placeBet, connectWallet, getContractBalance, ethToWei };