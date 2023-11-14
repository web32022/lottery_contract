import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Login from '../components/Login'


import{
  useContract,
  useMetamask,
  useAddress,
  useContractRead,
  useContractWrite,
  
} from '@thirdweb-dev/react'
import Loading from '../components/Loading'
import { useEffect, useState } from 'react'
import {ethers} from 'ethers'
import CountdownTimer from '../components/CountdownTimer'
import toast from 'react-hot-toast'
import ReactConfetti from 'react-confetti'
import Marquee from 'react-fast-marquee'
import AdminControls from '../components/AdminControls'







const Home: NextPage = () => {
  
  const [quantity ,setQuantity] = useState<number>(1);
  const[userTickets,setUserTickets] = useState(0)
  const address = useAddress();
  const {contract, isLoading} = useContract('0x7dc4BD1EAD10D6371dC76AB81dF33a299554AFE7');

  const {data:remainingTickets} = useContractRead(
    contract,"RemainingTickets");

  const {data:reward} = useContractRead(contract, "CurrentWinningReward")
  const {data:TicketPrice} = useContractRead(contract, "ticketPrice")
  const { data:TicketCommission} = useContractRead(contract, "ticketCommission")
  const {data:time_expiration} = useContractRead(contract,"expiration")

  const { mutateAsync: BuyTickets} = useContractWrite(contract, "BuyTickets")
  const {data:tickets} = useContractRead(contract,"getTickets")


  const {data:winnings} = useContractRead(contract,"getWinningsForAddress",address);

  const { mutateAsync: WithdrawWinnings} = useContractWrite(contract, "WithdrawWinnings")

  const {data:LastWinner} = useContractRead(contract, "lastWinner");
  const{data:LastWinnerAmount} = useContractRead(contract,"lastWinnerAmount");

  const{data:isLotteryOperator} = useContractRead(contract,"lotteryOperator")



  useEffect(()=>{
    if(!tickets)return;

    const totalTickets:string[]=tickets;
    const noOfUserTickets = totalTickets.reduce((total,ticketAddress)=>(
      ticketAddress === address ? total+1 :total),0);

    setUserTickets(noOfUserTickets);
  },[tickets,address])

  console.log(userTickets);

  const handleClick = async() => {
    if(!TicketPrice)return;
    const notification = toast.loading("Buying your tickets...")
    try{

        const data = await BuyTickets([
          {
            value:ethers.utils.parseEther(
              
              (
                Number(ethers.utils.formatEther(TicketPrice))* quantity
              ).toString()

            ),
          },
        ]);

        toast.success("tickes purchased sucessfully",{
          id:notification
        })


    }catch(error){
      toast.error("something is wrong",{
        id:notification
      });
      console.log("contract call error", error);
    }
    
  }

  const onWithdrawWinnings = async()=>{
  
  const notification = toast.loading("withdrawing winnings....");
  try
  {
      const data = await WithdrawWinnings([{}])
      
      toast.success("Winnings withdraw sucessfully",{
        id:notification
      })
  }
  catch(err)
  {
    toast.error("something went wrong",{
      id:notification
    });
  }


  }
 
  if(isLoading){
    return(
      <Loading/>
    )
  }
  if(!address) return(<Login/>)
 



  return (
    <div className="bg-[#091818] min-h-screen flex flex-col">
      <Head>
        <title>WealthBuilders Lottery Draw</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header/>
      <Marquee className='bg-[#0A1F1C] p-5 mb-5' gradient={false} speed={100}>

        <div className='flex space-x-2 mx-10'>
          <h4 className='text-white font-bold'>Last Winner:{LastWinner?.toString()}</h4>
          <h4 className='text-white font-bold'>Previous winnings: {LastWinnerAmount && ethers.utils.formatEther(LastWinnerAmount?.toString())}USDT</h4>
        </div>

      </Marquee>
      {isLotteryOperator === address &&
          (
            <div className='flex justify-center'>
                <AdminControls/>
            </div> 
          
       )}
      
      {
        winnings > 0 && (
           
            <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
            
              <button
              onClick={onWithdrawWinnings} 
              className='p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full'>
                <p className='font-bold'>Congratulations Your Are The Winner Of This Lucky Draw </p>
                <p>Total Winnings: {ethers.utils.formatEther(winnings.toString())} USDT</p>
                <br/>
                <p className='font-semibold'>Click Here To Withdraw</p>
              </button>
              <ReactConfetti
              width={window.innerWidth}
              height={window.innerHeight}
              />
            
            </div>
        )
      }

      <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center
      md:space-x-5'>
        <div className='stats-container'>
          <h1 className='text-3xl text-white font-semibold text-center'>
              Next Lucky Spin
          </h1>
           <div className='flex justify-between p-2 space-x-2'>
            <div className='stats'>
              <h2 className='text-sm text-white'>Total Pool</h2>
              <p  className='text-xl'>{reward?.toString() && ethers.utils.formatEther(reward.toString())} USDT</p>
          </div>
          <div className="stats">
            <h2 className='text-sm'>Tickets Remaining</h2>
            <p className='text-xl'>{remainingTickets?.toNumber()}</p>
          </div>
          </div>
              <div className='mt-5 mb-3'>

                  <CountdownTimer/>
              </div>
          
          </div>

          <div className='stats-container space-y-2'>
              <div className='stats-container'>
                  <div className='flex justify-between items-center text-white pb-2'>
                    <h2>Price / Ticket</h2>
                    <p>{TicketPrice && ethers.utils.formatEther(TicketPrice.toString())} USDT</p>
                  </div>
                  <div className='flex text-white items-center space-x-2
                  bg-[#091B18] border-[#004337] border p-4'>
                    <p>Tickets</p>
                    <input className='flex w-full bg-transparent text-right outline-none' type="text" 
                    min={1} max={10} value={quantity}
                    onChange={e=>setQuantity(Number(e.target.value))}/>
                  </div>
                  <div className='space-y-2 mt-5'>
                    <div className='flex items-center justify-between text-emerald-300
                    text-sm font-extrabold'>
                      <p>Total cost of tickets</p>
                      <p>
                        {
                          TicketPrice  && Number(ethers.utils.formatEther(TicketPrice.toString())) * quantity
                        }
                        USDT
                      </p>
                    </div>
                    <div className='flex items-center justify-between text-emerald-300
                    text-xs italic'>
                      <p>Service fees</p>
                      <p>{TicketCommission && ethers.utils.formatEther(TicketCommission.toString())} USDT</p>
                    </div>

                  <div className='flex items-center justify-between text-emerald-300
                    text-xs italic'>
                     <p>+Network Fees</p>
                     <p>TBC</p>
                  </div>
                  </div>

                  <button
                  onClick={handleClick} 
                  disabled ={time_expiration?.toString()<Date.now().toString()}  
                  className='mt-f w-full bg-gradient-to-br from-orange-500 to-emerald-600
                  px-10 py-5 rounded-md text-white shadow-xl mt-5 disabled:from-gray-600 disabled:to-gray-100 disabled:cursor-not-allowed'>
                  Buy Wealth Gainers Ticket
                  </button>
              </div>

               {
                userTickets > 0 &&(
                <div className='stats'>
                  <p
                  className='text-lg mb-2'
                  >You have {userTickets} ticket(s) in this lucky draw</p>

                  <div className='flex max-w-xs flex-wrap gap-x-2 gap-y-2'>
                    {
                      Array(userTickets).fill("").map((_,index)=>(
                        <p
                         className='text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg
                         flex flex-shrink-0 items-center justify-center text-xs italic'
                         key={index}>{index+1}</p>
                      ))
                    }
                  </div>
                </div>
               
               )}


          </div>

        </div>



      <div></div>
      
    </div>
  )
}

export default Home
