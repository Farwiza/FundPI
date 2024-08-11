import React from 'react'
import { daysLeft } from '../utils'

const FundCard = ({ owner, name, category, title,description, target, deadline, amountCollected, image, handleClick}) => {
    const remainingDays = daysLeft(deadline);
    const isFinished = amountCollected >= target;
    const isExpired = remainingDays <= 0;

    return (
        <div className='sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer' onClick={handleClick}>
            <img src={image} alt="fund" className='w-[100%] h-[288px] object-hover rounded-[15px]'/>

            <div className='flex flex-col p-4'>
                <div className='flex flex-row items-center mb-[18px]'>
                    {/* <img src={tagTyp} alt="tagtype" className='w-[17px] h-[17px] object-contain'/> */}
                    <p className='mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]'>{category}</p>
                </div>

                <div className='block'>
                    <h3 className='font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate'>{title}</h3>
                    <p className='mt-[5px] font-epilogue font-normal text-[12px] text-[#808191] text-left leading-[18px] truncate'>{description}</p>
                </div>

                <div className='flex justify-between flex-wrap mt-[15px] gap-2'>
                    <div className='flex flex-col'>
                        <h4 className='font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>{amountCollected}</h4>
                        <p className='mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate'>Raised of {target}</p>
                    </div>
                    <div className='flex flex-col'>
                        <h4 className='font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>
                            {isFinished ? 'Finished' : (isExpired ? '0' : remainingDays)}
                        </h4>
                        <p className='mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate'>
                            {isFinished ? '' : (isExpired ? 'Days left' : 'Days left')}
                        </p>
                    </div>
                </div>

                <div className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
                    {" "}
                    by{" "}
                    <span className="font-epilogue leading-[22px] text-[#b2b3bd]">
                        {name}
                    </span>
                    <div className="flex flex-col">
                        <span className=" font-epilogue font-normal text-[12px] text-[#b2b3bd] leading-[18px] sm:max-w-[120px] truncate ">
                            {owner}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FundCard