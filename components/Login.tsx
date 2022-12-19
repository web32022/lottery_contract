import { useMetamask } from '@thirdweb-dev/react'
import React from 'react'
import ReactConfetti from 'react-confetti'

function Login() {
    const connectwithMetamask = useMetamask()
  return (
    
    <div className='bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center'>
        <div className='flex flex-col items-center mb-10'>
            <img
             className='rounded-full h-56 w-56 mb-10'
             src="https://i.imgur.com/4h7mAu7.png"/>
             <h1 className='text-2xl text-white font-bold'>The WealthGainers</h1>
             <h2 className='text-white text-1xl'>Africa's First Decentralized Lucky Wheel Platform </h2>
             <p className='text-white text-xs text-center mt-3 font-extrabold'>Our Platform Is Totally Free From Human Interaction And Runs Decentralized On The Ethereum Blockchain & Smart Contracts</p>
             <button onClick={connectwithMetamask} 
             className='bg-white px-8 py-5 mt-10 rounded-lg font-bold shadow-lg'>Login With Metamask</button>
              <p className='text-white text-center text-large font-extrabold mt-6 animate-pulse'>Powered By ASpaceLife Technologies</p>
      
              <ReactConfetti height={window.innerHeight} width={window.innerWidth}></ReactConfetti>
        </div>
    </div>
  )
}

export default Login