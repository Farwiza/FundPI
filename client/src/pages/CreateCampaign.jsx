import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'

import { money } from '../assets'
import { checkIfImage } from '../utils'
import { FormField, Loader, CustomButton, WarningCreate } from '../components'
import { useAddress } from '@thirdweb-dev/react';
import { useStateContext } from '../context';


const CreateCampaign = () => {
  const address  = useAddress();
  const navigate = useNavigate();
  const [activeCampaign, setActiveCampaign] = useState(null); // Define activeCampaign state
  // console.log(CreateCampaign);
  const [showModal, setShowModal] = useState(false);
  
  
  useEffect(() => {
    if(address === undefined) {
      navigate('/')
    }
  }, [address])

  useEffect(() => {
    const fetchActiveCampaign = async () => {
      const userCampaigns = await getUserCampaigns();
      const currentTime = Date.now();
      const activeCampaign = userCampaigns.find(campaign => 
        campaign.deadline > currentTime && 
        campaign.amountCollected < campaign.target
      );
  
      console.log("Active Campaign:", activeCampaign); // Untuk debugging
      setActiveCampaign(activeCampaign);
    };
  
    fetchActiveCampaign();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign, getUserCampaigns } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    category: '',
    description: '',
    target: '',
    deadline: '',
    image: '',
  });
  console.log("Active Campaign:", activeCampaign);

  const handleFormFieldChange = (fieldName, e) => {
   setForm({
      ...form, [fieldName]: e.target.value
   })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Buka modal
  };

  const handleConfirmModal = async () => {
    setShowModal(false); // Tutup modal
  
    console.log("Submitting campaign...");
  
    checkIfImage(form.image, async (res) => {
      if (res) {
        setIsLoading(true);
        if (activeCampaign) {
          console.log('Checking active campaign:', activeCampaign);
          alert('You already have an active campaign. Please wait until it completes.');
          setIsLoading(false);
          return;
        }
        await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) });
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Image URL is not valid');
        setForm({ ...form, image: '' });
      }
    });
  };

  return (
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      <WarningCreate
        isOpen={showModal}
        onConfirm={handleConfirmModal}
        onCancel={() => setShowModal(false)}
      />

      {isLoading && <Loader />}
      <div className='flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]'>
        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>Start your Campaign !</h1>
      </div>
      {activeCampaign ? (
      <div className="mt-[65px] text-center">
        <p className="text-white text-center mb-4">You already have an active campaign. Please wait until it completes.</p>
      </div>
    ) : (

      <form onSubmit={handleSubmit} className='w-full mt-[65px] flex flex-col gap-[30px]'>
        <div className='flex flex-wrap gap-[40px]'>
          <FormField 
            LabelName="Your Name *"
            placeholder="Write your Name here"
            inputType="text"
            value={form.name}
            handleChange={(e) => {
              handleFormFieldChange('name', e)
            } }
            />
          <FormField 
            LabelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => {
              handleFormFieldChange('title', e)
            } }
            />

          <FormField 
            LabelName="Select Category *"
            placeholder="What is your Category Campaign?"
            inputType="text"
            value={form.category}
            handleChange={(e) => {
              handleFormFieldChange('category', e)
            } }
            />
        </div>
        <FormField 
            LabelName="Story *"
            placeholder="Write the story"
            isTextArea
            value={form.description}
            handleChange={(e) => {
              handleFormFieldChange('description', e)
            } }
            />

        {/* <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[12px]">
          <img src={money} alt="money" className='w-[40px] h-[40px] object-contain' />
          <h4 className='font-epilogue font-bold text-[25px] text-white ml-[20px]'>You will get 100% of the raised amount no fee platform</h4>
        </div> */}

        <div className='flex flex-wrap gap-[40px]'>
          <FormField 
            LabelName="Goal *"
            placeholder="ETH 0.5"
            inputType="text"
            value={form.target}
            handleChange={(e) => {
              handleFormFieldChange('target', e)
            } }
            />
          <FormField 
            LabelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => {
              handleFormFieldChange('deadline', e)
            } }
            />

        </div>

        <FormField 
          LabelName="Campaign Image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => {
            handleFormFieldChange('image', e)
          } }
        />
        <div className="flex justify-center items-center mt-[40px]">
          {activeCampaign ? (
          <p>Anda mempunyai campaign yang aktif</p>
          ) : (
            <CustomButton
              btnType="submit"
              title="Submit Campaign"
              styles="bg-[#1dc071]"
            />
          )}
        </div>
      </form>
    )}
    </div>
  )
}

export default CreateCampaign