import React from 'react'

// Mendefinisikan tipe data dari props
type ButtonLinkType = {
    link?: string;
    title: string;
}

// ButtonLink merupakan komponen yang menghandle tombol yang akan me-redirect ke page lain 
const ButtonLink = ({link,title}: ButtonLinkType) => {
  return (
    <button className='m-2 shadow-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 rounded-3xl hover:bg-gradient-to-r hover:from-sky-700 hover:to-indigo-700'>
    <a href={link} className="font-semibold hover:text-gray-100 transition ease-in-out delay-100">
        {title}
    </a>  
    </button>
  )
}

export default ButtonLink