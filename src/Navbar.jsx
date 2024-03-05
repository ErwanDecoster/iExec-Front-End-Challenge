import Button from './Button.jsx'
import iExeclogo from '/logo.svg'
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export default function Navbar() {
  const [userAddress, setUserAddress] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['userAddress']);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setUserAddress(cookies['userAddress']);
  }, [cookies]);

  const disconnect = async () => {
    removeCookie('userAddress');
  }

  const formatAddress = (address) => {
    if (typeof address !== 'string') {
      return "Adresse invalide";
    }
    if (address > 10) {
      const prefix = address.slice(0, 6);
      const suffix = address.slice(-4);
      return `${prefix}...${suffix}`;
    }
    return address
  }

  const connectWallet = async () => {
    setPending(true);
    try {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw Error(
          "Please install MetaMask plugin first, visit https://metamask.io/download"
        );
      }
      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts"
      })
      setUserAddress(address)
      setCookie('userAddress', address);
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x86",
            chainName: "iExec Sidechain",
            nativeCurrency: {
              name: "xRLC",
              symbol: "xRLC",
              decimals: 18
            },
            rpcUrls: ["https://bellecour.iex.ec"],
            blockExplorerUrls: ["https://blockscout-bellecour.iex.ec"]
          }
        ]
      });
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0x86"
          }
        ]
      });
      setPending(false);
    } catch (e) {
      setPending(false);
      console.error(`Error: ${e.message}`);
    }
  };

  const identicon = () => {
    return (
      <img src="/identicon.svg" alt="user icon" />
    )
  }

  return (
    <>
      <div className='px-8 bg-[#0D0D12] bg-opacity-50 border-b border-[#303038] border-opacity-40 h-16'>
        <div className='mx-auto py-4 h-full flex justify-between items-center max-w-screen-xl'>
          <a href="/" className='flex items-center gap-3 font-bold text-white text-base'>
            <img src={iExeclogo} className="logo" alt="iExec logo" />
            <p className='font-mono'>Secret Email</p>
          </a>
          <div className='flex items-center gap-3'>
            <Button type="primary" size="small" pending={pending} onClick={connectWallet}>
              {userAddress ? <span className='flex gap-2'>{formatAddress(userAddress)} {identicon()}</span> : 'Connect Wallet'}
            </Button>
            {userAddress && (
              <svg onClick={disconnect} className='cursor-pointer' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3335 14.1667L17.5002 10L13.3335 5.83334" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 10H7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
