import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite, useSigner } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0x04704BB4362867028A90377a86d6255125Aae279');
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    const { mutateAsync: withdrawFunds } = useContractWrite(contract, 'withdrawFunds');

    const connect = useMetamask();
    const address = useAddress();
    const signer = useSigner();

    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign(
                {
                    args: [
                        
                            address, //owner
                            form.name,
                            form.title,
                            form.category,
                            form.description,
                            form.target,
                            new Date(form.deadline).getTime(),
                            form.image
                        
                    ],
                }
            );


            toast.success("Campaign created successfully.");
            console.log("contract call success", data);
            
        } catch (error) {
            toast.error("error while creating donation, please try again")
            console.log("contract call error", error);
        }
    }

    const updateCampaign = async (form) => {
        try {
          const data = await contract.call("updateCampaign", [
            form.id, // campaign id
            form.name, // campaign name
            form.title, // title
            form.category, // category
            form.description, // description
            form.target,
            new Date(form.deadline).getTime(), // deadline,
            form.image,
          ]);
          toast.success("Campaign updated successfully.");
          console.log("contract call success", data);
        } catch (error) {
          toast.error("Error while updating Campaign, please try again");
          console.log("contract call failure", error);
        }
      };

      const deleteCampaign = async (pId) => {
        try {
          const data = await contract.call("deleteCampaign", [pId]);
    
          toast.success("Campaign deleted successfully.");
          console.log("contract call success", data);
          return data;
        } catch (error) {
          toast.error("Error while deleting Campaign, please try again");
          console.log("contract call failure", error);
        }
      };

    const getCampaigns = async () => {
        const campaigns = await contract.call("getCampaigns");
        
        const parsedCampaign = campaigns.map((campaign, idx) => ({
            owner: campaign.owner,
            name : campaign.name,
            title: campaign.title,
            category : campaign.category,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: idx
        }))

        return parsedCampaign
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();
        const filteredCampaigns = allCampaigns.filter((campaign) => (
            campaign.owner === address
        ));

        return filteredCampaigns;
    }

    const getSingleCampaign = async (pId) => {
        const allCampaigns = await getCampaigns();
    
        const filteredCampaign = allCampaigns.filter(
          (campaign) => campaign.pId === pId
        );
    
        return filteredCampaign;
      };

    const donate = async (pId, amount, donateName, donateMessage) => {
        try {
          const data = await contract.call("donateToCampaign", [pId, donateName, donateMessage], {
            value: ethers.utils.parseEther(amount),
          });
          toast.success(
            "Campaign funded successfully. Thanks for your collaboration view "
          );
          return data;
        } catch (err) {
          toast("Donation failed");
          console.log("Error occurred while making donation", err);
        }
    };
    
    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', [pId]);

        const numberOfDonations = donations[0].length

        const parsedDonations = [];

        for(let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator:donations[0][i],
                donation:ethers.utils.formatEther(donations[1][i].toString()),
                donateName: donations[2][i], // Add donateName
                donateMessage: donations[3][i] // Add donateMessage
    
            })
        }

        return parsedDonations;
    }

    const refundDonation = async (pId) => {
      try {
          const data = await contract.call('refundDonation', [pId]);
          console.log('Refund donation success:', data);
          return data;
      } catch (error) {
          console.error('Error refunding donation:', error);
          throw error;  // Rethrow to handle it in the UI layer
      }
  };

    const getRefundedDonations = async (pId, donatorAddress) => {
      const refundedDonations = await contract.call('refundedDonations', [pId, donatorAddress]);
      return refundedDonations;
    }

    const updateAmountCollected = async (pId, amount) => {
      try {
        const data = await contract.call("updateAmountCollected", [pId, amount]);
        toast.success("Amount collected updated successfully.");
        console.log("contract call success", data);
      } catch (error) {
        toast.error("Error while updating amount collected, please try again");
        console.log("contract call failure", error);
      }
    }

    return (
        <StateContext.Provider 
            value={{ 
                address, 
                connect,
                contract,
                createCampaign: publishCampaign, 
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                updateCampaign,
                deleteCampaign,
                refundDonation,
                getRefundedDonations,
                updateAmountCollected,
                withdrawFunds,
                signer,
            }}
        >   
            <ToastContainer />
            {children}
            
        </StateContext.Provider>
    )
};

export const useStateContext = () => useContext(StateContext); 
