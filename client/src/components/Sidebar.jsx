import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStateContext } from '../context'
import { logo3 } from '../assets';
import { Tooltip } from "antd";
import { navlinks, nonUserNavlinks } from '../constants'

export const Icon = ({styles, name, imgUrl, isActive, disabled, handleClick}) => (
    <div  className={`w-[48px] h-[48px] rounded-[10px] ${ isActive && isActive === name && "bg-[#2c2f32] hover:bg-[#2c2f32]" } flex justify-center items-center ${ !disabled && "cursor-pointer"} hover:bg-[#2c2f32] transition duration-200 ease-in ${styles}`}  onClick={handleClick}>
        {!isActive ? (
            <img src={imgUrl} alt={name} className='w-1/2 h-1/2'/>
        ) : (
            <img src={imgUrl} alt={name} className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}` }/>
        )}

        {/* <p
            className={` font-epilogue font-semibold text-[14px] ${
                isActive === name ? "text-[#b6049f]" : "text-[#808191]"
            }`}
                >
            {name}
        </p> */}
    </div>
)

const Sidebar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState('dashboard');
    const { address } = useStateContext();

    useEffect(() => {
        navlinks.forEach((link) => {
          if(location.pathname === link.link) {
            setIsActive(link.name);
          }
        })
    
      }
      , [location.pathname])

  return (
    <div className='flex justify-between items-center flex-col sticky top-5 h-[93vh]'>
        <Link to="/">
            <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]"  imgUrl={logo3}/>
        </Link>

        <div className='flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12'>
            <div className='flex flex-col justify-center items-center gap-3'>
                {address !== undefined && navlinks.map((Link) => (
                <Tooltip
                    key={Link.name}
                    placement="right"
                    title={Link.name.replace(/^[a-z]/, (char) => char.toUpperCase())}
                    color={"#4acd8d"}
                    overlayInnerStyle={{
                    color: "white",
                    fontWeight: "bold",
                    textShadow: "0 0 5px black",
                    }}>
                <div
                    key={Link.name} className="rounded-[10px] transition duration-200 ease-in">
                <Icon
                    key={Link.name}
                    {...Link}
                    isActive={isActive}
                    handleClick={() => {
                    if (!Link.disabled) {
                        setIsActive(Link.name);
                        navigate(Link.link);}
                    }}/>
                </div>
            </Tooltip>
                ))}
                {
                    address === undefined && nonUserNavlinks.map((Link) => (
                        <Tooltip
                        key={Link.name}
                        placement="right"
                        title={Link.name.replace(/^[a-z]/, (char) => char.toUpperCase())}
                        color={"#4acd8d"}
                        overlayInnerStyle={{
                        color: "white",
                        fontWeight: "bold",
                        textShadow: "0 0 5px black",
                        }}>
                    <div
                        key={Link.name} className="rounded-[10px] transition duration-200 ease-in">
                    <Icon
                        key={Link.name}
                        {...Link}
                        isActive={isActive}
                        handleClick={() => {
                        if (!Link.disabled) {
                            setIsActive(Link.name);
                            navigate(Link.link);}
                        }}/>
                    </div>
                </Tooltip>
                    ))}
            </div>

        </div>
    </div>
  )
}

export default Sidebar