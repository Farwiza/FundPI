import React from 'react'
import { loader } from '../assets'

const CustomButton = ({ btnType, title, handleClick, styles, isLoading}) => {
  return (
    <>
      {!isLoading && (
        <button 
        type={btnType}
        className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
        onClick={handleClick}>
            {title}
      </button>
      )}  
      {isLoading && (
        <img src={loader} alt="loader" className='w-[70px] h-[70px] object-contain' />
        )}
    </>
  )
}

export default CustomButton