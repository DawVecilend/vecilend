function SecondaryButton(props) {
  return (
    <a href={props.url} className='border-2 border-[#14B8A6] h-[44px] px-4 flex items-center text-[#F2F4F8] rounded-2xl'>{props.text}</a>
  )
}

export default SecondaryButton