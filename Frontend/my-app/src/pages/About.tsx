import React from 'react'
import Image from 'next/image';

const About = () => {
    return (
        <div className='flex flex-col flex-wrap sm:flex-col gap-2 items-center justify-center bg-gradient-to-t from-[#170B94] via-[#330FBD] via-[#F0B7D2] via-[#330FBD] to-[#170B94] w-screen h-screen' >
        
            
                <Image
                    src="/DSC_7789.JPG" // Replace with the actual path to your background image
                    width={800}
                    height={600}
                    alt="About Background"
                    quality={100}
                />
            
            <div className="relative z-20">
                    Kelompok 6
            </div>
        </div>
        
    );
}

export default About