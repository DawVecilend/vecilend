function PrimaryButton(props) {
  return (
    <a href={props.url} 
    style={{ width: props.width }} 
    className='bg-[#14B8A6] text-white h-[44px] px-4 flex items-center justify-center rounded-2xl'>{props.text}</a>
  )
}

export default PrimaryButton