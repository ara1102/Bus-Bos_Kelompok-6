import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import TextInput from '@/components/TextInput';

export interface FindValues {
    origin: string,
    destination: string
}

const Find = () => {

    const [answer, setAnswer] = useState<string>("");
    const [isAnswered, setIsAnswered] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<FindValues>({ mode: "onChange" });

    const onSubmit = async (data: FindValues) => {
        const response = await fetch('http://localhost:5000/members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (response.ok) {
            console.log("OKE");
          } else {
            console.log("NOT OK");
          }

        console.log(result);
        // console.log(data);

        setAnswer(result.data.answer);
        setIsAnswered(true);
        reset();
    }

    return (
        <main className=''>
            <section className='bg-gradient-to-r from-sky-500 to-indigo-500 flex flex-col justify-center min-h-screen items-center'>
                <div className='bg-white rounded-lg flex flex-col p-5 my-10 mx-10 sm:w-[35rem]'>
                    <form onSubmit={handleSubmit(onSubmit)} className=''>

                        <div className='flex flex-col gap-2'>

                            <div className='flex flex-col justify-center'>
                                <p className='text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500 font-bold text-2xl sm:text-5xl md:text-3xl self-center sm:p-3'>Welcome to Phlog!</p>
                                <p className='text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500 font-bold text-lg sm:text-2xl self-center'>Fill out this form to sign up</p>
                            </div>

                            <div className='sm:flex justify-between md:gap-2'>

                                <div className='basis-1/2'>
                                    <TextInput label="Kota Asal" name="origin" register={register} type="text" errors={errors} />
                                </div>

                                <div className='basis-1/2'>
                                    <TextInput label="Kota Tujuan" name="destination" register={register} type="text" errors={errors} />
                                </div>

                            </div>

                            <div>
                                <input type="submit" className='font-semibold p-2 cursor-pointer w-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl shadow-lg' />
                            </div>

                        </div>

                    </form>

                    {isAnswered && ( 
                        <>
                        <h1 className='text-red-500'>{answer}</h1>
                        </>
                    )}

                </div>
            </section>
        </main>
    )
}

export default Find

// interface City {
//     id: number;
//     id_provinsi: string;
//     name: string;
// }

// interface FormData {
//     city: string;
// }

// interface ResponseData {
//     cities: City[];
// }

// const [cities, setCities] = useState<City[]>([]);
//     const { setValue } = useForm<FormData>();

//     useEffect(() => {
//         const fetchData = async () => {
//             const response = await fetch("https://api.binderbyte.com/wilayah/kabupaten?api_key=8e49f28e0f2f2cf56393c352613eec358e85fb7077ce6f7f453ebb826a7b1f6d&id_provinsi=36");
//             console.log(response);
//             const responseData: ResponseData = await response.json();
//             setCities(responseData.cities);
//         };

//         fetchData();
//     }, []);

//     useEffect(() => {
//         console.log(cities); // This will show the updated value of `cities`
//       }, [cities]);

//     register('origin', {
//         required: {
//             value: true,
//             message: "City is required!"
//         }
//     });


{/* <div className='basis-1/2'>
                                <label htmlFor="City" className='text-black font-semibold'>
                                    City:
                                </label>
                                <select
                                    id='City'
                                    {...register('origin')}
                                    className='w-full shadow-sm rounded-md p-1 border-2 border-grey-500 bg-white text-black font-normal'>
                                    <option className="text-red-500" value="">Select a city</option>
                                    {cities && cities.map((city) => (
                                        <option key={city.name} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                                <p className='text-red-500'> {errors.origin?.message}</p>
                            </div> */}