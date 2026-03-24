import React from 'react'

function PrimaryButton(props) {
  return (
    <a href={props.url} className='bg-[#14B8A6] h-[44px] px-4 flex items-center text-[#F2F4F8] rounded-2xl'>{props.text}</a>
  )
}

export default PrimaryButton