export default function EmailProtectedCard({ name, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className='rounded-3xl relative overflow-hidden bg-black'
    >
      <div className='gradient' />
      <div className='transparent-blur relative z-10 p-6 rounded-[23px]'>
        <p className='text-left font-bold'>{name}</p>
        <p className='text-left italic'>**email protected**</p>
      </div>
    </button>
  )
}
