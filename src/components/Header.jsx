import { ethers } from "ethers";
import { useContext, useEffect } from "react";
// import Web3Modal from 'web3modal';
import { GlobalContext } from "../context/GlobalContext";
import logo from './../assets/logo.jpg';
import CONFIG from '../abi/config.json';
import tokenABI from '../abi/token.json';
import icoAbi from '../abi/abi.json';
import { getTokenBalance, getNativeBalance, getICORate} from './functions'

  
const HeaderComponent = ({setError, setErrMsg}) => {

    const { account, addAccount, delAccount, updateTokenBalance, updateBNBBalance, updateRate, updateProvider } = useContext(GlobalContext);
    
    // const getTokenBalance = async(signer, address) => {
    //     const tokenContract = new ethers.Contract(CONFIG.TOKEN_CONTRACT, tokenABI, signer)
    //     const balanceOf = await tokenContract.balanceOf(address) 
    //     updateTokenBalance(ethers.utils.formatUnits(balanceOf, CONFIG.TOKEN_DECIMAL))
    //     console.log(ethers.utils.formatUnits(balanceOf, CONFIG.TOKEN_DECIMAL));
    // }

    // const getICORate = async(signer) => {
    //     const contract = new ethers.Contract(CONFIG.ICO_CONTRACT_ADDRESS, icoAbi, signer)
    //     const rate = await contract.rate() 
    //     updateRate(rate.toString())
    //     console.log(rate.toString());
    // }

    // const getNativeBalance = async (signer, address) => {
    //     const tokenContract = new ethers.Contract(CONFIG.USDT_ADDRESS, tokenABI, signer)
    //     const balanceOf = await tokenContract.balanceOf(address) 
    //     updateBNBBalance(parseFloat(ethers.utils.formatUnits(balanceOf, 6)).toFixed(4))
    //     console.log(parseFloat(ethers.utils.formatUnits(balanceOf, 6)).toFixed(4))
    // }
    // const connectWallet = async () => {
    //     const web3modal = new Web3Modal({
    //         providerOptions
    //     });
    //     const instance = await web3modal.connect();
    //     const provider = new ethers.providers.Web3Provider(instance);
    //     console.log(provider)
    //     updateProvider(provider)
    //     const signer = provider.getSigner();
    //     const address = await signer.getAddress();
    //     addAccount({ id: address });
    //     const network = await provider.getNetwork();
    //     console.log(network)
    //     if(network.chainId !== CONFIG.NETWORK_ID ) {
    //         setError(true) 
    //         setErrMsg('Contract is not deployed on current network. please choose Avalanche Mainnet')
    //     } else {
    //         setError(false) 
    //         setErrMsg('')
    //         getTokenBalance(signer, address, updateTokenBalance)
    //         getNativeBalance(signer, address, updateBNBBalance)
    //         getICORate(signer, updateRate)
    //     }
        
    // }
    // useEffect(()=>{
    //     if(window.ethereum) {
    //         window.ethereum.on('accountsChanged', accounts => {
    //             // addAccount({ id: accounts[0] })
    //             connectWallet()
    //         })
    //         window.ethereum.on('chainChanged', chainId => {
    //             window.location.reload();
    //         })
    //     }
    // }, [account]);
    return (
        <div className="w-full flex items-center flex-col">
            <div className="max-w-[250px]  w-48 my-8 rounded-full bg-white shadow-[0_0_70px_0.2em_rgba(255,255,255,0.35)]">
                <img src={logo} alt="logo" />
            </div>
            <div className="mt-4 sm:mt-0">
                <w3m-button />
            </div>

        </div>
    );
};

export default HeaderComponent;
