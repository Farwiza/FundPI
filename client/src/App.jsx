import React from 'react';
import { Route, Routes } from 'react-router-dom'

import { Home, Profile, CampaignDetails, CreateCampaign, PastCampaigns, UpdateCampaign} from './pages';
import { Navbar, Sidebar} from './components';



const App = () => {
  return (
    <div className="relative sm:p-8 p-4 px-7 bg-[#13131a] min-h-screen flex flex-row ">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>
      <div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:searchParam' element={<Home />} />
          <Route path='/past-campaigns' element={<PastCampaigns />} />
          <Route path='/profile' element={<Profile />} />
          {/* <Route path='/payments' element={<Payments />} /> */}
          <Route path='/create-campaign' element={<CreateCampaign/>} />
          <Route path="/update-campaign/:id" element={<UpdateCampaign />} />
          <Route path='/campaign-details/:id' element={<CampaignDetails/>}/>
        </Routes>
      </div>
      {/* <div className="fixed bottom-4 right-4 z-50">
      <Chatbot />
      </div> */}
    </div>

    
  )
}

export default App