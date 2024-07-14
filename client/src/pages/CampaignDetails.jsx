import { useStateContext } from '../context'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CountBox, CustomButton, WarningModal, WarningDelete, WarningUpdate } from '../components'
import { calculateBarPercentage, daysLeft, countAddressCampaigns } from '../utils'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CampaignDetails = () => {
  const navigate = useNavigate();
  const { signer } = useStateContext();
  const { state } = useLocation();
  if( state === undefined) {
    navigate('/');
  }
  const { donate, getDonations, contract, getCampaigns, address, deleteCampaign, updateAmountCollected, getRefundedDonations, refundDonation, withdrawFunds} = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  // const [successDonate, setSuccessDonate] = useState(false)
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [campaigns, setCampaigns] = useState([])
  const remainingDays = daysLeft(state.deadline);
  const [donateName, setDonateName] = useState('');
  const [donateMessage, setDonateMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fundsWithdrawn, setFundsWithdrawn] = useState(false);
  

  const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    const refundedData = await Promise.all(
      data.map(async (donor) => {
        const refunded = await getRefundedDonations(state.pId, donor.donator);
        return refunded;
      })
    );
  
    const donators = data.map((donor, index) => ({
      ...donor,
      refunded: refundedData[index],
    }));
  
    setDonators(donators);
  }
  
  

  const id = state.pId;
  const name = state.name;
  const title = state.title;
  const category = state.category;
  const description = state.description;
  const target = state.target;
  const deadline = state.deadline;
  const image = state.image;

  const handleUpdate = () => {
    navigate(`/update-campaign/${state.pId}`, {
      state: {
        id,
        name,
        title,
        category,
        description,
        target,
        deadline,
        image,
      },
    });
  };

  const handleRefund = async (campaignId, donatorAddress) => {
    try {
      const fundsWithdrawnByDonator = await contract.call('fundsWithdrawnByDonator', [campaignId, donatorAddress]);
      if (fundsWithdrawnByDonator) {
        // Dana sudah ditarik oleh donator, tampilkan pesan error
        toast.error('Owner Campaign sudah melakukan penarikan dana untuk campaign ini, refund tidak dapat dilakukan.');
        return;
      }
  
      setIsLoading(true);
      const refundTx = await refundDonation(campaignId);
      await refundTx.wait(); // Ensure transaction is mined
      fetchDonators(); // Refresh data donators after refund
  
      // Update amountCollected after refund
      const campaign = campaigns.find(c => c.pId === campaignId);
      if (campaign) {
        const refundAmount = donators.find(d => d.donator === donatorAddress).donation;
        const newAmountCollected = ethers.utils.formatEther(campaign.amountCollected) - refundAmount;
        await updateAmountCollected(campaignId, newAmountCollected);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error refunding donation:', error);
      setIsLoading(false);
    }
  };


  const fetchCampaigns = async () => {
    const res = await getCampaigns();
    setCampaigns(res);
  }

  useEffect(() => {
    if (contract) {
      fetchDonators();
      fetchCampaigns();
      getFundsWithdrawnStatus();
    }
  }, [contract, address]);
  
  const getFundsWithdrawnStatus = async () => {
    const withdrawnStatus = await contract.call('fundsWithdrawn', [state.pId]);
    setFundsWithdrawn(withdrawnStatus);
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!(amount > 0 && amount !== '')) {
      alert('Please input the correct amount');
      return;
    }
  
    // Open the modal
    setIsModalOpen(true);
  }

  const handleConfirmDonate = async () => {
    // Close the modal
    setIsModalOpen(false);
  
    setIsLoading(true);
  
    const res = await donate(state.pId, amount, donateName, donateMessage);
    // TODO handle error
  
    navigate('/');
    setIsLoading(false);
  }
  
  const handleCancelDonate = () => {
    // Close the modal
    setIsModalOpen(false);
  }

  const handleDelete = async () => {
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    setIsLoading(true);
  
    const res = await deleteCampaign(state.pId);
  
    navigate("/");
    setIsLoading(false);
    setIsDeleteModalOpen(false);
  };
  
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleWithdraw = async (pId) => {
    try {
      setIsLoading(true);
      const withdrawTx = await withdrawFunds({ args: [pId] });
      console.log('Transaction result:', withdrawTx); // Log transaction for debugging
      navigate("/");
  
      // Assume the transaction is successful if it reaches here
      setIsLoading(false);
      toast.success("Dana berhasil ditarik!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      setIsLoading(false);
      toast.error("Error withdrawing funds. Please try again.");
    }
  };

  const checkFundsWithdrawnByDonator = async (pId, donatorAddress) => {
    const fundsWithdrawn = await contract.call('fundsWithdrawnByDonator', [pId, donatorAddress]);
    return fundsWithdrawn;
  };

  return (
    <div>
        <WarningModal 
          isOpen={isModalOpen} 
          onConfirm={handleConfirmDonate} 
          onCancel={handleCancelDonate} 
        />

        <WarningDelete
          isOpen={isDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

    {/* {successDonate && (
    //   <div 
    //     className='fixed ml-[8%] mt-[5%] backdrop-blur-md w-[70%] h-[40%] flex justify-center items-center rounded-[40px]'
    //     onClick={() => setSuccessDonate(false)}
    //     >
    //     <div className='bg-[#8c6dfd] p-5 rounded-md font-bold'>
    //       Donation success!
    //     </div> */}
    {/* </div>)} */}


      <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px]'>
        <div className='flex-1 flex-col'>
          <img src={state.image} alt="campaign_image" className='w-full h-[410px] object-cover rounded-xl' />
          <div className='relative w-full h-[5px] bg-[#3a3a43] mt-2'>
            <div className='absolute h-full bg-[#4acd8d]' style={{width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>

        <div className='flex md:w-[150px] w-full flex-wrap sm:flex justify-between md:gap-[30px] gap-[5px]'>
          <CountBox title={remainingDays > 0 ? 'Days left' : 'Days ago'} value={Math.abs(remainingDays)}/>
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected}/>
          <CountBox title="Total Donators" value={donators.length}/>
        </div>
      </div>

      <div className='mt-[60px] flex lg:flex-row flex-col gap-5 '>
        <div className='flex-[2] flex flex-col gap-[40px]'>
          <div className=''>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>
              {state.title}
            </h4>
            <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px] ' >
              {/* <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#fb2778]' >
                <div className='w-[60%] h-[60%] object-contain' />
              </div> */}

              <div>
                <h4 className='font-epilogue font-semibold text-[14px] text-white break-all hover:cursor-pointer hover:text-[#808191] transition duration-300' onClick={() => openInNewTab(`https://sepolia.etherscan.io/address/${state.owner}`)}>{state.name}</h4>
                <p className='mt-[4px] font-epilogue font-normal text-[12px] text-white'>{state.category}</p>
                <p className='mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]'>{countAddressCampaigns(campaigns,state.owner)} Campaigns</p>
              </div>
            </div>
          </div>

          <div className=''>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>
              Story
            </h4>
            <div className='mt-[20px]'>
              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>{state.description}</p>
            </div>
          </div>

          <div className=''>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase text-center mb-[15px]'>
              Donators
            </h4>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-white">No</th>
                    <th className="py-2 px-4 text-white">Name</th>
                    <th className="py-2 px-4 text-white">Amount</th>
                    <th className="py-2 px-4 text-white">Message</th>
                    <th className="py-2 px-4 text-white">Address</th>
                    <th className="py-2 px-4 text-white">Refund</th>
                  </tr>
                </thead>
                <tbody>
                  {donators.length > 0 ? (
                    donators.map((item, idx) => (
                      <tr key={`${item.donator}-${idx}`}>
                        <td className="py-2 px-4 text-gray-300">{idx + 1}</td>
                        <td className="py-2 px-4 text-gray-300">{item.donateName}</td>
                        <td className="py-2 px-4 text-gray-300">{item.donation} ETH</td>
                        <td className="py-2 px-4 text-gray-300">{item.donateMessage}</td>
                        <td className="py-2 px-4 text-gray-300">{item.donator}</td>
                        <td className="py-2 px-4 text-gray-300">
                          {address === item.donator ? (
                            item.refunded ? (
                              <p>Already refunded</p>
                            ) : (
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => handleRefund(state.pId, item.donator)}
                                disabled={fundsWithdrawn}
                              >
                                Refund
                              </button>
                            )
                          ) : (
                            <p>Not your donation</p>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-2 px-4 text-gray-300 text-center">
                        No donators yet, be the first!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='flex-1'>
          <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase text-center'>
            DONATE
          </h4>
          <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]'>
            <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>
              {(remainingDays > 0 && parseFloat(state.amountCollected) < parseFloat(state.target)) ? 'Fund the campaign': 'Funding has ended'}
            </p>
            <div className='mt-[30px]'>
                <input 
                  type="number"
                  placeholder='ETH 0.1'
                  step='0.01'
                  className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]'
                  value={amount}
                  onChange={(e) => {setAmount(e.target.value)}}
                  disabled={remainingDays <= 0 || parseFloat(state.amountCollected) >= parseFloat(state.target) }
                   />

                <input
                        type="text"
                        placeholder='Enter your name'
                        className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] mt-[9px] placeholder:text-[#4b5264] rounded-[10px]'
                        value={donateName}
                        onChange={(e) => setDonateName(e.target.value)}
                />
                <textarea
                        type="text"
                        placeholder='Enter your message'
                        className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px] mt-[20px]'
                        value={donateMessage}
                        onChange={(e) => setDonateMessage(e.target.value)}
                />
                  <div className='my-[20px] p-4 bg-[#13131a] rounded-[10px]'>
                    <h4 className='font-epilogue font-bold text-[20px] leading-[22px] text-white text-center'>Warning</h4>
                    <p className='mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]'>Be careful, this campaign could be a scam, we FundPI will not be responsible if there is a problem, so be careful when donating a campaign.</p>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    {(remainingDays > 0 && parseFloat(state.amountCollected) < parseFloat(state.target) && address !== undefined) ? (
                      <CustomButton
                        btnType='submit'
                        title='Donate'
                        styles='w-full bg-[#8c6dfd]'
                        handleClick={(e) => handleDonate(e)}
                        isLoading={isLoading}
                      />
                    ) : (
                      <CustomButton
                        title="Finished Campaign"
                        styles='w-full bg-[#8c6dfd] cursor-not-allowed opacity-50'
                        disabled
                      />
                    )}

                    <div className="mt-[40px] mb-[30px]">
                      {(remainingDays > 0 && parseFloat(state.amountCollected) < parseFloat(state.target) && address !== undefined) ? (
                        address == state.owner && (
                          <div className="flex flex-wrap gap-[40px]">
                            <CustomButton
                              btnType="button"
                              id={state.pId}
                              title="Update Campaign"
                              styles="w-full bg-[#ac73ff]"
                              handleClick={handleUpdate}
                            />

                            <CustomButton
                              btnType="button"
                              title="Delete Campaign"
                              styles="w-full bg-[#FF0000]"
                              handleClick={handleDelete}
                            />

                            <CustomButton
                                btnType="button"
                                title="Withdraw Funds"
                                styles="w-full bg-[#4acd8d]"
                                handleClick={() => handleWithdraw(state.pId)}
                                />
                          </div>
                        )
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                  
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CampaignDetails