import React from 'react'
import {StarIcon,CurrencyDollarIcon,ArrowPathIcon,ArrowUturnDownIcon} from '@heroicons/react/24/solid'
import {useContract,useContractRead,useContractWrite} from '@thirdweb-dev/react'
import { ethers } from 'ethers';
import toast from 'react-hot-toast'




function AdminControls() {
    const {contract, isLoading} = useContract('0x7dc4BD1EAD10D6371dC76AB81dF33a299554AFE7');
    const {data:totalCommission} = useContractRead(contract,'operatorTotalCommission')

    const { mutateAsync: DrawWinnerTicket} = useContractWrite(contract, "DrawWinnerTicket")
    const { mutateAsync: WithdrawCommission} = useContractWrite(contract, "WithdrawCommission")
    const { mutateAsync: RefundAll} = useContractWrite(contract, "RefundAll")
    const { mutateAsync: restartDraw} = useContractWrite(contract, "restartDraw")

    const drawWinner = async() => {
      const notification = toast.loading("Picking  A Lucky Winner....");
      try
      {
        const data = await DrawWinnerTicket([{}]);
        toast.success("A Winner Has Been Selected",{
            id:notification
        });

      }
      catch(err){
        toast.error("Something went wrong",{
            id:notification
        })
        console.log("contract call error",err);
      }
    }

   
    const onWithdrawCommission = async() => {
        const notification = toast.loading("Withdrawing....");
        try
        {
          const data = await WithdrawCommission([{}]);
          toast.success("Commission Withdrawn",{
              id:notification
          });
  
        }
        catch(err){
          toast.error("Something went wrong",{
              id:notification
          })
          console.log("contract call error",err);
        }
      }
  
    const onRestartDraw = async() => {
        const notification = toast.loading("Restarting Lottery");
        try
        {
          const data = await restartDraw([{}]);
          toast.success("Lottery Restarted",{
              id:notification
          });
  
        }
        catch(err){
          toast.error("Something went wrong",{
              id:notification
          })
          console.log("contract call error",err);
        }
      }


      const onRefundAll = async() => {
        const notification = toast.loading("Refunding All Wallets");
        try
        {
          const data = await RefundAll([{}]);
          toast.success("Successfully Refunded All Wallets",{
              id:notification
          });
  
        }
        catch(err){
          toast.error("Something went wrong",{
              id:notification
          })
          console.log("contract call error",err);
        }
      }
  
  



  return (
    <div className='text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border'>
      <h2 className='font-bold'>Admin Controls</h2>
      <p className='mb-5'>Total Commisson to be withdrawn: 
       {totalCommission && ethers.utils.formatEther(totalCommission?.toString())}
       USDT
      </p>
      <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
            <button
            onClick={drawWinner} 
            className='admin-button'>
                <StarIcon className='h6 mx-auto mb-2'/>
                Draw Winner
            </button>
            <button onClick={onWithdrawCommission} className='admin-button'>
                <CurrencyDollarIcon className='h6 mx-auto mb-2'/>
                Withdraw Commission
            </button>
            <button onClick={onRestartDraw} className='admin-button'>
            <ArrowPathIcon className='h6 mx-auto mb-2'/>    
                Restart Lottery
            </button>
            
            <button onClick={onRefundAll} className='admin-button'> 
            <ArrowUturnDownIcon className='h6 mx-auto mb-2'/>
                Refund All

            </button>
      </div>
    </div>
  )
}

export default AdminControls
