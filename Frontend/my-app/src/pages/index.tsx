import ButtonLink from '@/components/ButtonLink'
import React from 'react'
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] })

const App = () => {


  return (
    <>
      {/* <div>BUS-BOS</div> */}
      <div className='flex flex-col flex-wrap sm:flex-col gap-2 items-center justify-center bg-gradient-to-t from-[#170B94] via-[#330FBD] via-[#F0B7D2] via-[#330FBD] to-[#170B94] w-screen h-screen'>

        <div className='flex flex-col items-center'>
          <h2 className='font-bold text-6xl sm:text-8xl'>BUS-BOS</h2>
          <h3 className='font-semibold text-xl'>Buslebew</h3>
        </div>


        <div className='flex flex-row flex-wrap justify-center'>
          <ButtonLink link='Find' title="Cari Bus" />
          <ButtonLink link='About' title="Tentang Kami" />
        </div>

      </div>
    </>
  )
}

export default App