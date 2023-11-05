import { ethers } from 'ethers';
import { useContext, useRef, useState } from 'react';

import { useWeb3ModalAccount, useWeb3ModalSigner, useWeb3Modal  } from '@web3modal/ethers5/react'


import CONFIG from '../abi/config.json';

import CROWDSALE_ABI from '../abi/abi.json';
import tokenAbi from '../abi/token.json';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


const crowdsaleAddress = CONFIG.ICO_CONTRACT_ADDRESS;

function Presale() {
    const [loading, setLoading] = useState(false);
    const ethPrice = useRef(null);
    const { open, close } = useWeb3Modal()

    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { signer } = useWeb3ModalSigner()



    const addToken = async () => {
        const tokenAddress = CONFIG.TOKEN_CONTRACT;
        const tokenSymbol = CONFIG.TOKEN_SYMBOL;
        const tokenDecimals = CONFIG.TOKEN_DECIMAL;
        const tokenImage = '';

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage, // A string url of the token logo
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const approveUSDT = async (e) => {
        e.preventDefault();
        try {
            if (!isConnected) {
                open()
                return;
            }
        
            setLoading(true);
            const usdtContract = new ethers.Contract(CONFIG.USDT_ADDRESS, tokenAbi, signer);
            const price = ethers.utils.parseEther(ethPrice.current.value);
            const transaction = await usdtContract.approve(CONFIG.ICO_CONTRACT_ADDRESS, price, { from: address });
            await transaction.wait();
            buyToken(price);
        } catch (e) {
            setLoading(false);
        }

    }

    const buyToken = async (price) => {
        try {
            const contract = new ethers.Contract(crowdsaleAddress, CROWDSALE_ABI, signer);
            
            const transaction = await contract.buyTokens(address, price.toString());
            await transaction.wait();
            setLoading(false);
            Swal.fire({
                icon: '',
                title: 'Congratulations!',
                text: 'Your Token purchase has been completed successfully',
                confirmButtonColor: '#E1C260'
              })
        } catch (e) {
            setLoading(false);
        }
    }

    let timeout;

    const resetIcons = () => {
        document.querySelector('#copyIcon').classList.remove('hidden')
        document.querySelector('#successIcon').classList.add('hidden')
        clearTimeout(timeout)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(CONFIG.TOKEN_CONTRACT);
        document.querySelector('#copyIcon').classList.add('hidden')
        document.querySelector('#successIcon').classList.remove('hidden')
        timeout = setTimeout(resetIcons, 1000)
    }


    return (
        <div className="my-11 p-7 flex items-center flex-col md:flex-row justify-between border border-white border-opacity-20 rounded-3xl shadow-xl md:space-x-10 ">
            <div className="md:pl-8 text-center md:text-left md:mr-2 w-full md:w-1/2">
                <h1 className="text-base sm:text-xl font-bold uppercase text-white" >Public Sale</h1>
                <h1 className="text-2xl sm:text-4xl font-bold uppercase text-[#E1C260]" style={{textShadow: '0 0 16em #fff, 0 0 0.15em #E1C260, 0 0 1.2em #fff, 0 0 10em #E1C260'}}>Global Standard Token</h1>
                <div className='mt-5'>
                    <label htmlFor="">Token Address</label>
                    <div className='flex items-center justify-between bg-[#E1C260] px-2 py-2 text-black rounded'>
                        <p className='truncate'>{`${CONFIG.TOKEN_CONTRACT}`}</p>
                        <button className='p-2 border border-black rounded transition-all duration-75 ease-in-out hover:scale-110 active:scale-75' onClick={copyToClipboard}>
                            <span id="copyIcon">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                    <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/>
                                </svg>
                            </span>
                            <span id="successIcon" className='hidden'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>

            </div>
            <div className="my-10 border p-10 rounded-xl border-white border-opacity-30 w-full md:w-1/2">
                <form onSubmit={approveUSDT}>
                    <div className="my-3">
                        <label className="text-base font-bold text-[#E1C260]">Amount USDC</label>
                        <input ref={ethPrice} type="text" className="w-full h-12 rounded-lg p-2 text-xl focus:outline-none mt-1 bg-white bg-opacity-30" required />
                    </div>
                    <div className="my-3">
                        <label className="text-base font-bold text-[#E1C260]">Rate</label>
                        <input className="w-full h-12 rounded-lg p-2 text-xl focus:outline-none mt-1" type="text" value="USDC 0.5 =  1 GST " disabled />
                    </div>

                    <div className="mt-10">
                        <button disabled={loading} className="w-full py-2 px-6 uppercase bg-[#E1C260] hover:bg-[#E1C260] rounded  font-bold text-black">{loading ? 'Busy' : 'Buy'}</button>

                    </div>
                </form>
            </div>
            <div className="before:fixed before:top-0 before:left-0 before:w-full page__bg -z-30"></div>
        </div>
    );
}

export default Presale;
