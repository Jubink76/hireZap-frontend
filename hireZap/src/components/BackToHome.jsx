import React from 'react'
import { ArrowBigLeftIcon } from 'lucide-react'
const BackToHome = ({onClick}) => {
  return (
    <button 
        onClick={onClick}
        className='px-4 py-2 flex items-center font-medium gap-2 text-slate-700 hover:text hover:bg-slate-100 slate-900 cursor-pointer border border-slate-400 rounded-lg'>
        <ArrowBigLeftIcon className='w-5 h-5' />
        <span>Dashboard</span>
    </button>
  )
}

export default BackToHome