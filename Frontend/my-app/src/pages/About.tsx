import React from 'react';
import Image from 'next/image';

// App merupakan komponen yang menghandle laman tentang kami
const About = () => {
    return (
        <div className='flex flex-row flex-wrap md:flex-col gap-5 items-center justify-center bg-gradient-to-t from-[#170B94] via-[#330FBD] via-[#F0B7D2] via-[#330FBD] to-[#170B94] w-screen h-full md:h-screen'>

            <div className='flex flex-row flex-wrap md:flex-col items-center justify-center gap-5 mx-5 my-10'> 
                <div className='flex flex-col items-center gap-2'>
                    <h2 className='text-md md:text-7xl font-bold'>Kelompok 6</h2>
                    <h2 className='text-sm md:text-xl font-semibold'>Kecerdasan Buatan B</h2>
                </div>

                <div className='flex flex-col md:flex-row gap-2'>
                    <div className='basis-1/3 border-2'>
                        <Image
                            src='/dhira.png'
                            alt='Adhira Kelompok 6'
                            width={200}
                            height={300}
                        />
                    </div>

                    <div className='basis-1/3 border-2'>
                        <Image
                            src="/ulima.jpg"
                            alt='Ulima Kelompok 6'
                            width={200}
                            height={300}
                        />
                    </div>

                    <div className='basis-1/3 border-2'>
                        <Image
                            src='/naya.jpg'
                            alt='Naya kelompok 6'
                            width={200}
                            height={300}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;