import { useStateContext } from '../context';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CustomButton } from '../components';
import { logo2, menu, search, profile } from '../assets';
import { navlinks, nonUserNavlinks } from '../constants';
import { Icon } from './Sidebar';
import { useLocation } from 'react-router-dom';
import { ConnectWallet } from '@thirdweb-dev/react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('Dashboard');
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [toggleDrawer, setToggleDrawer] = useState(false)
  const { connect, address } = useStateContext();
  const location = useLocation(); 
  const [searchParams] = useSearchParams()

  useEffect(() => {
    navlinks.forEach((link) => {
      if(location.pathname === link.link) {
        setIsActive(link.name);
      }
    })
    setSearchValue(searchParams.get('search') || '')
  }
  , [location.pathname, searchParams])

  const handleSearch = () => {
    navigate(`/?search=${searchValue}`)
  }

  const showSearchBar = location.pathname !== '/past-campaigns'

  return (
    <div className='flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6'>
      {showSearchBar && (
        <form
          className='lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]'
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            type="text"
            placeholder='Search for campaigns'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none'
          />

          <button
            type='submit'
            className='w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer'
            onClick={() => {
              handleSearch();
            }}
          >
            <img
              src={search}
              alt="search"
              className='w-[15px] h-[15px] object-contain'
            />
          </button>
        </form>
      )}

      <div className='sm:flex hidden flex-row justify-end gap-4'>
        {address && (
          <CustomButton 
          btnType="button" 
          title="Create a campaign" 
          styles="bg-[#1dc071]"
          isLoading={isLoading}
          handleClick={() => {
            if (address) {
              navigate('create-campaign');
            } else {
              setIsLoading(true);
              connect();
              setIsLoading(false);
            }
          }}
          />
        )}
        <ConnectWallet switchToActiveChain={true}/>
      </div>

      <div className='sm:hidden flex justify-between items-center relative'>
          <Link to={'/'} className='w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer'>
            <img src={logo2} alt="user" className='w-[60%] h-[60%] object-contain' />
          </Link>

          <ConnectWallet switchToActiveChain={true} />

          <img src={menu} alt="menu" className='w-[34px] h-[34px] object-contain cursor-pointer' onClick={() => setToggleDrawer(!toggleDrawer)} />
      </div>

      <div className={`sm:hidden absolute top-[70px] right-0 left-0 bg-[#1c1c24] z-0 shadow-secondary pb-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0' } transition-all duration-700`}>
          <ul className='mb-1'>
            {address !== undefined && navlinks.map((Link) => (
              <li
                key={Link.name}
                className={`flex p-4 ${isActive === Link.name && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setToggleDrawer(false);
                  navigate(Link.link);
                }}>

                  <img src={Link.imgUrl} alt={Link.name} className={`w-[24px] h-[24px] object-contain ${isActive === Link.name ? 'grayscale-0' : 'grayscale'}`}/>
                  <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === Link.name ? 'text-[#1dc071]' : 'text-[#808191]' }`}>
                    {Link.name}
                  </p>

              </li>
            ))}
            {
              address === undefined && nonUserNavlinks.map((Link) => (
                <li
                  key={Link.name}
                  className={`flex p-4 ${isActive === Link.name && 'bg-[#3a3a43]'}`}
                  onClick={() => {
                    setToggleDrawer(false);
                    navigate(Link.link);
                  }}>

                    <img src={Link.imgUrl} alt={Link.name} className={`w-[24px] h-[24px] object-contain ${isActive === Link.name ? 'grayscale-0' : 'grayscale'}`}/>
                    <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === Link.name ? 'text-[#1dc071]' : 'text-[#808191]' }`}>
                      {Link.name}
                    </p>

                </li>
              ))
            }
    
          </ul>

      </div>

      
    </div>
  )
}

export default Navbar