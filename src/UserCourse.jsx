import { useEffect, useState } from 'react';
import Button from './Button.jsx'
import EmailProtectedCard from './EmailProtectedCard.jsx'
import { IExecDataProtector } from "@iexec/dataprotector";
import { useCookies } from 'react-cookie';

const web3Provider = window.ethereum;
// instantiate
const dataProtector = new IExecDataProtector(web3Provider);


export default function UserCourse(companyAddress) {
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });
  const [pending, setPending] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [selectedData, setSelectedData] = useState('');
  const [selectedDataSharedAccess, setSelectedDataSharedAccess] = useState([]);
  const [courseState, setCourseState] = useState(1);
  const [errors, setErrors] = useState({});
  const [protectedDatas, setProtectedDatas] = useState([]);
  const [cookies, setCookie] = useCookies(['userAddress']);

  useEffect(() => {
    if (cookies['userAddress']) {
      setUserAddress(cookies['userAddress']);
      updateProtectedData(cookies['userAddress'])
      setCourseState(2);
    } else {
      setCourseState(1);
    }
  }, [cookies]);

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
      updateProtectedData(address)
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
      setCourseState(2);
    } catch (e) {
      setPending(false);
      setErrors({ message: `Error: ${e.message}` });
      console.error(`Error: ${e.message}`);
    }
  };
  
  const protectAddress = async (event) => {
    event.preventDefault();
    setPending(true);
    if (!formData.email || !formData.name) {
      setErrors({ message: "Email and name are required." });
      setPending(false);
      return;
    }
    try {
      const protectedData = await dataProtector.protectData({
        data: {
            email: formData.email
        },
        name: formData.name
      });
      if (protectedData) {
        setProtectedDatas([...protectedDatas, protectedData]);
        setPending(false);
        setCourseState(2);
        setFormData({ email: '', name: '' });
      }
    } catch (error) {
      console.error("Une erreur est survenue :", error);
      setPending(false);
      setErrors({ message: "Une erreur est survenue lors de la protection des données." });
    }
  };

  const updateProtectedData = async (address) => {
    const listProtectedData = await dataProtector.fetchProtectedData({
      owner: address,
    });
    if (listProtectedData.length) {
      setProtectedDatas(listProtectedData)
    }
  }
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newErrors = { ...errors };
    if (name === 'email') {
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(value)) {
        newErrors.email = "Invalid email address";
      } else {
        delete newErrors.email;
      }
    }
    if (name === 'name') {
      if (value.trim() === '') {
        newErrors.name = "Name is required";
      } else {
        delete newErrors.name;
      }
    }
    setErrors(newErrors);
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    });
  };

  const shareAccess = async () => {
    if (!selectedData.address || !companyAddress) {
      console.error('shareAccess error need selectedData.address or companyAddress');
    }
    const grantedAccess = await dataProtector.grantAccess({
      protectedData: selectedData.address,
      authorizedApp: 0x00000000000000000000000000000000000000,
      authorizedUser: companyAddress,
    });
  }

  const fetchSharedAcces = async (selected) => {
    const listGrantedAccess = await dataProtector.fetchGrantedAccess({
      protectedData: selected.address,
      authorizedUser: userAddress,
      page: 1,
      pageSize: 100,
    });
    if (listGrantedAccess)
      setSelectedDataSharedAccess(listGrantedAccess)
  }

  const revokeSharedAccess = async (grantedAccess) => {
    const revokeAccess = await dataProtector.revokeOneAccess(grantedAccess);
  }

  return (
    <>
      {courseState === 1 && (
        <>
          {errors.message && <p className="text-super-red">{errors.message}</p>}
          <p>Connect your wallet to continue.</p>
          <Button type="primary" pending={pending} onClick={connectWallet}>
            Connect Wallet
          </Button>
        </>
      )}
      {courseState === 2 && (
        <div className='grid gap-8'>
          {!protectedDatas.length ? (
            <>
              <p>You have no protected address yet.</p>
              <Button type="primary" onClick={() => setCourseState(3)} pending={pending}>
                Protect my Address
              </Button>
            </>
          ) : (
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                {protectedDatas.map((protectedData, index) => (
                  <EmailProtectedCard 
                    key={index} 
                    name={protectedData.name} 
                    onClick={() => { setSelectedData(protectedData); setCourseState(4); fetchSharedAcces(protectedData)}} 
                  />
                ))}
              </div>
              <button onClick={() => setCourseState(3)} className='text-primary underline flex gap-1 items-center text-xs'>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#FCD15A" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 4V8" stroke="#FCD15A" />
                  <path d="M4 6H8" stroke="#FCD15A" />
                </svg>
                Add new
              </button>
            </div>
          )}
        </div>
      )}
      {courseState === 3 && (
        <>
          <p>Protect your address with iExec. Your email address stays secret, only your name will be shared with the organization.</p>
          {errors.message && <p className="text-super-red">{errors.message}</p>}
          <form className='grid gap-4' onSubmit={protectAddress}>
            <div className='grid gap-1'>
              <label htmlFor="email">Email Address (secret)</label>
              <input type="email" placeholder='johndoe@gmail.com' name="email" id="email" value={formData.email} onChange={handleInputChange} required />
              {errors.email && <p className="text-super-red">{errors.email}</p>}
            </div>
            <div className='grid gap-1'>
              <label htmlFor="name">Name (public)</label>
              <input type="text" placeholder='John Doe' name="name" id="name" value={formData.name} onChange={handleInputChange} required />
              {errors.name && <p className="text-super-red">{errors.name}</p>}
            </div>
            {errors.value}
            <Button type="primary" pending={pending} disabled={Boolean(errors.name) || Boolean(errors.email)}>
              Protect my Address
            </Button>
            <Button type="secondary" onClick={() => setCourseState(2)} pending={pending}>
              Back
            </Button>
          </form>
        </>
      )}
      {selectedData && courseState === 4 && (
        <div className='grid gap-8'>
          <div className='grid gap-4'>
            <EmailProtectedCard name={selectedData.name} />
          </div>
          
          <div className='grid gap-4'>
            Shared access
            {!selectedDataSharedAccess.length ? (
              <>
                <p>You have no shared access yet.</p>
              </>
            ) : (
              <>
                {selectedDataSharedAccess.map((sharedAccess, index) => (
                  <div key={index} >
                    {sharedAccess.apprestrict}
                    <Button type="secondary" onClick={() => revokeSharedAccess(sharedAccess.grantedAccess)} >Revoke Access</Button>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Button type="secondary" onClick={() => setCourseState(2)}>
              Cancel
            </Button>
            <Button type="primary" onClick={shareAccess}>
              Share Access
            </Button>
          </div>
        </div>
      )}
    </>
  );
}