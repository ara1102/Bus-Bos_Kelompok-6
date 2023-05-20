import ButtonLink from '@/components/ButtonLink'
import React from 'react'

const App = () => {

  return (
    <>
      <div>BUS-BOS</div>
      <div className='flex flex-col flex-wrap sm:flex-row gap-2 items-center justify-center'>
              <ButtonLink link='Find' title="Cari Bus"/>
              <ButtonLink link= 'About' title="Tentang Kami"/>
              <ButtonLink link= 'TestLeaflet' title="Leaflet"/>
              {/* <ButtonLink link= "Kota" title="Kota di Jawa Timur"/> */}
      </div>
    </>
  )
}

export default App