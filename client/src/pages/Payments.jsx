// import React from 'react'
// import { useStateContext } from '../context'
// import { useState, useEffect } from 'react'
// import { DisplayCampaigns } from '../components'
// import { daysLeft } from '../utils'

// const Payments = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [campaigns, setCampaigns] = useState([]);

//   const { contract, getCampaigns } = useStateContext();

//   const paidCampaigns = campaigns.map(campaign => {
//     const { pId } = campaign;
    
//   })

//   const fetchCampaigns = async () => {
//     setIsLoading(true);
//     const res = await getCampaigns();
//     setCampaigns(res);
//     setIsLoading(false)
//   }

//   useEffect(() => {
//     if(contract){
//       fetchCampaigns();
//     }
//   }, [contract])

//   return (
//       <DisplayCampaigns
//         title="Current Campaigns"
//         isLoading={isLoading}
//         campaigns={paidCampaigns}
//         />
      
//     )
// }

// export default Payments