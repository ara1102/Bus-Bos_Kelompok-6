import React, { useState } from "react";
import Select from "react-select";

interface OptionType {
  value: string;
  label: string;
}

function App() {

  const [origin, setOrigin] = useState<OptionType | null>(null);
  const [destination, setDestination] = useState<OptionType | null>(null);
  const [answer, setAnswer] = useState<Array<[string, string, number]>>([]);
const [totalCost, setTotalCost] = useState<number>();
const [isAnswered, setIsAnswered] = useState(false);

    const options = [
        { value: 'DKI Jakarta', label: 'DKI Jakarta' },
        { value: 'Banten', label: 'Banten' },
        { value: 'Jawa Barat', label: 'Jawa Barat' },
        { value: 'Jawa Tengah', label: 'Jawa Tengah' },
        { value: 'Yogyakarta', label: 'Yogyakarta' },
        { value: 'Jawa Timur', label: 'Jawa Timur' }
    ]

  const handleOriginChange = (selectedOption: OptionType | null) => {
    setOrigin(selectedOption);
  };

  const handleDestinationChange = (selectedOption: OptionType | null) => {
    setDestination(selectedOption);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const data = {
      origin: origin?.value,
      destination: destination?.value
    };
  
    fetch("http://localhost:5000/members", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Response Not OK");
          }
          return response.json();
        })
        .then(data => {
          console.log("Success:", data);
          setAnswer(data.answer.data_rute);
          setTotalCost(data.answer.total_cost);
          setIsAnswered(true);
        //   reset();
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }
      

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="origin">Origin</label>
        <Select
          id="origin"
          options={options}
          value={origin}
          onChange={handleOriginChange}
        />
      </div>
      <div>
        <label htmlFor="destination">Destination</label>
        <Select
          id="destination"
          options={options}
          value={destination}
          onChange={handleDestinationChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default App;



// import { useForm, useController, Controller } from 'react-hook-form'
// import React, { useEffect, useState } from 'react'
// import Select, { components, SingleValue } from 'react-select';
// import { FaEnvelope as Icon } from 'react-icons/fa';

// interface FormData {
//     origin: string,
//     destination: string,
// }

// const Kota = () => {

//     const {
//         register,
//         reset,
//         handleSubmit,
//         control,
//         formState: { errors },
//     } = useForm<FormData>({ mode: "onChange" });

//     const options = [
//         { value: 'DKI Jakarta', label: 'DKI Jakarta' },
//         { value: 'Banten', label: 'Banten' },
//         { value: 'Jawa Barat', label: 'Jawa Barat' },
//         { value: 'Jawa Tengah', label: 'Jawa Tengah' },
//         { value: 'Yogyakarta', label: 'Yogyakarta' },
//         { value: 'Jawa Timur', label: 'Jawa Timur' }
//     ]

//     const [answer, setAnswer] = useState<string>("");
//     const [isAnswered, setIsAnswered] = useState(false);
//     const [selectedOrigin, setSelectedOrigin] = useState<SingleValue<{ value: string; label: string; }>>(null);
//     const [selectedDestination, setSelectedDestination] = useState<SingleValue<{ value: string; label: string; }>>(null);
    
//   const { field: { value: originValue, onChange: originOnChange, ...restOriginField } } = useController({ name: 'origin', control });
//   const { field: { value: destValue, onChange: destOnChange, ...restDestField } } = useController({ name: 'destination', control });

//     const onSubmit = (data: FormData) => console.log(data);

//     return (
//         <main className=''>
//             <section className='bg-gradient-to-r from-sky-500 to-indigo-500 flex flex-col justify-center min-h-screen items-center'>
//                 <div className='bg-white rounded-lg flex flex-col p-5 my-10 mx-10 sm:w-[35rem]'>
//                     <form onSubmit={handleSubmit(onSubmit)} className=''>

//                         <div className='flex flex-col gap-2'>

//                             <div className='flex flex-col justify-center'>
//                                 <p className='text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500 font-bold text-2xl sm:text-5xl md:text-3xl self-center sm:p-3'>Welcome to Phlog!</p>
//                                 <p className='text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500 font-bold text-lg sm:text-2xl self-center'>Fill out this form to sign up</p>
//                             </div>

//                             <div className='basis-1/2'>

//                                 <div style={{ width: '200px' }}>

//                                     {/* <div>
//                                         <label>Origin</label>
//                                         <Select
//                                             className='select-input'
//                                             placeholder="Select Origin"
//                                             isClearable
//                                             options={options}
//                                             value={originValue ? options.find(x => x.value === originValue) : originValue}
//                                             onChange={option => originOnChange(option ? option.value : option)}
//                                             {...restOriginField}
//                                         />
//                                         {errors.origin && <p>Please select origin</p>}
//                                     </div>
//                                     <div>
//                                         <label>Destination</label>
//                                         <Select
//                                             className='select-input'
//                                             placeholder="Select Destination"
//                                             isClearable
//                                             options={options}
//                                             value={destValue ? options.find(x => x.value === destValue) : destValue}
//                                             onChange={option => destOnChange(option ? option.value : option)}
//                                             {...restDestField}
//                                         />
//                                         {errors.destination && <p>Please select destination</p>}
//                                     </div> */}
//                                     {/* <Controller
//                                         control={control}
//                                         name="origin"
//                                         rules={{ required: true }}
//                                         render={({ field }) => (
//                                             <>
//                                                 <label htmlFor="origin-select" className='text-black'>Origin</label>
//                                                 <Select
//                                                     {...field}
//                                                     options={options}
//                                                     value={selectedOrigin}
//                                                     onChange={(selectedOption) => setSelectedOrigin(selectedOption)}
//                                                     id="origin-select"
//                                                     instanceId="origin-select"
//                                                 />
//                                             </>
//                                         )}
//                                     />

//                                     <Controller
//                                         control={control}
//                                         name="destination"
//                                         rules={{ required: true }}
//                                         render={({ field }) => (
//                                             <>
//                                                 <label htmlFor="destination-select" className='text-black'>Destination</label>
//                                                 <Select
//                                                     {...field}
//                                                     options={options}
//                                                     value={selectedDestination}
//                                                     onChange={(selectedOption) => setSelectedDestination(selectedOption)}
//                                                     id="destination-select"
//                                                     instanceId="destination-select"
//                                                 />
//                                             </>
//                                         )}
//                                     /> */}

//                                 </div>

//                             </div>

//                             <div>
//                                 <input type="submit" className='font-semibold p-2 cursor-pointer w-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl shadow-lg' />
//                             </div>

//                         </div>

//                     </form>

//                     {isAnswered && (
//                         <>
//                             <h1 className='text-red-500'>{answer}</h1>
//                         </>
//                     )}

//                 </div>
//             </section>
//         </main>
//     )
// }

// export default Kota


// import { useForm, useController, Controller } from 'react-hook-form'
// import React, { useEffect, useState } from 'react'
// import Select, { components, SingleValue } from 'react-select';
// import { FaEnvelope as Icon } from 'react-icons/fa';
// // import { useController } from 'react-hook-form';

// const DropdownIndicator = (props: any) => {
//     return (
//         <components.DropdownIndicator {...props}>
//             <Icon />
//         </components.DropdownIndicator>
//     );
// };

// export interface KotaValues {
//     origin: string,
//     destination: string,
//     kotajatim: string
// }

// interface City {
//     id: number;
//     id_provinsi: string;
//     name: string;
// }

// interface FormData {
//     origin: string,
//     destination: string,
// }

// interface ResponseData {
//     data: City[];
// }

// const Kota = () => {

//     const {
//         register,
//         reset,
//         handleSubmit,
//         control,
//         formState: { errors },
//     } = useForm<FormData>({ mode: "onChange" });

//     const options = [
//         { value: 'DKI Jakarta', label: 'DKI Jakarta' },
//         { value: 'Banten', label: 'Banten' },
//         { value: 'Jawa Barat', label: 'Jawa Barat' },
//         { value: 'Jawa Tengah', label: 'Jawa Tengah' },
//         { value: 'Yogyakarta', label: 'Yogyakarta' },
//         { value: 'Jawa Timur', label: 'Jawa Timur' }
//     ]


//     const customStyles = {
//         // container: (provided:any, state:any) => ({
//         //   ...provided,
//         //   background: 'linear-gradient(to right, #ff9966, #ff5e62)',
//         //   borderRadius: '20px',
//         //   display: 'flex',
//         //   alignItems: 'center',
//         // }),
//         // control: (provided:any, state:any) => ({
//         //   ...provided,
//         //   background: 'transparent',
//         //   border: 'none',
//         //   boxShadow: 'none',
//         // }),
//         // menu: (provided:any, state:any) => ({
//         //   ...provided,
//         //   borderRadius: '20px',
//         //   background: 'linear-gradient(to right, #ff9966, #ff5e62)',
//         // }),
//     };

//     const [answer, setAnswer] = useState<string>("");
//     const [isAnswered, setIsAnswered] = useState(false);
//     const [selectedOrigin, setSelectedOrigin] = useState<SingleValue<{ value: string; label: string; }>>(null);
//     const [selectedDestination, setSelectedDestination] = useState<SingleValue<{ value: string; label: string; }>>(null);

//     // const { field: originField } = useController({
//     //     name: 'origin',
//     //     control /* your form control object */
//     // });

//     // const { field: destinationField } = useController({
//     //     name: 'destination',
//     //     control /* your form control object */
//     // });
//     // const [cities, setCities] = useState<City[]>([]);

//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         const response = await fetch('http://localhost:5000/get_cities');
//     //         console.log(response);
//     //         const responseData: ResponseData = await response.json();
//     //         console.log(responseData);
//     //         setCities(responseData.data);
//     //     };

//     //     fetchData();
//     // }, []);

//     const onSubmit = (data: FormData) => console.log(data);

//     // const onSubmit = async (data: KotaValues) => {
//     //     const response = await fetch('http://localhost:5000/members', {
//     //         method: 'POST',
//     //         headers: {
//     //             'Content-Type': 'application/json'
//     //         },
//     //         body: JSON.stringify(data)
//     //     });
//     //     const result = await response.json();

//     //     if (response.ok) {
//     //         console.log("OKE");
//     //     } else {
//     //         console.log("NOT OK");
//     //     }

//     //     console.log(result);
//     //     // console.log(data);

//     //     setAnswer(result.data.answer);
//     //     setIsAnswered(true);
//     //     reset();
//     // }

//     return (
//         <main className=''>
//             <section className='bg-gradient-to-r from-sky-500 to-indigo-500 flex flex-col justify-center min-h-screen items-center'>
//                 <div className='bg-white rounded-lg flex flex-col p-5 my-10 mx-10 sm:w-[35rem]'>
//                     <form onSubmit={handleSubmit(onSubmit)} className=''>

//                         <div className='flex flex-col gap-2'>

//                             <div className='flex flex-col justify-center'>
//                                 <p className='text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500 font-bold text-2xl sm:text-5xl md:text-3xl self-center sm:p-3'>Welcome to Phlog!</p>
//                                 <p className='text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500 font-bold text-lg sm:text-2xl self-center'>Fill out this form to sign up</p>
//                             </div>

//                             <div className='sm:flex justify-between md:gap-2'>

//                                 {/* <div className='basis-1/2'>
//                                     <TextInput label="Kota Asal" name="origin" register={register} type="text" errors={errors} />
//                                 </div>

//                                 <div className='basis-1/2'>
//                                     <TextInput label="Kota Tujuan" name="destination" register={register} type="text" errors={errors} />
//                                 </div> */}

//                             </div>

//                             <div className='basis-1/2'>
//                                 <label htmlFor="Province" className='text-black font-semibold'>
//                                     Province:
//                                 </label>
//                                 {/* <Select
//                                     options={cities.map(city => ({ value: city.name, label: city.name }))}
//                                     placeholder="Select a city"
//                                     styles={customStyles}
//                                 /> */}
//                                 {/* <select
//                                     id='City'
//                                     {...register('kotajatim')}
//                                     className='w-full shadow-sm rounded-md p-1 border-2 border-grey-500 bg-white text-black font-normal'>
//                                     <option className="text-red-500" value="">Select a city</option>
//                                     {cities && cities.map((city) => (
//                                         <option key={city.name} value={city.name}>{city.name}</option>
//                                     ))}
//                                 </select> */}
//                                 <p className='text-red-500'> {errors.origin?.message}</p>

//                                 <div style={{ width: '200px' }}>

//                                     <Controller
//                                         control={control}
//                                         name="origin"
//                                         rules={{ required: true }}
//                                         render={({ field }) => (
//                                             <>
//                                                 <label htmlFor="origin-select" className='text-black'>Origin</label>
//                                                 <Select
//                                                     {...field}
//                                                     options={options}
//                                                     value={selectedOrigin}
//                                                     onChange={(selectedOption) => setSelectedOrigin(selectedOption)}
//                                                     id="origin-select"
//                                                     instanceId="origin-select"
//                                                 />
//                                             </>
//                                         )}
//                                     />

//                                     <Controller
//                                         control={control}
//                                         name="destination"
//                                         rules={{ required: true }}
//                                         render={({ field }) => (
//                                             <>
//                                                 <label htmlFor="destination-select" className='text-black'>Destination</label>
//                                                 <Select
//                                                     {...field}
//                                                     options={options}
//                                                     value={selectedDestination}
//                                                     onChange={(selectedOption) => setSelectedDestination(selectedOption)}
//                                                     id="destination-select"
//                                                     instanceId="destination-select"
//                                                 />
//                                             </>
//                                         )}
//                                     />


//                                     {/* <Controller
//                                         control={control}
//                                         name="origin"
//                                         render={({ field: { onChange } }) => (
//                                             <Select
//                                                 options={options}
//                                                 onChange={(selectedOption) => {
//                                                     setSelectedOrigin(selectedOption);
//                                                     // onChange(selectedOption.value);
//                                                 }}
//                                             />
//                                         )}
//                                     /> */}
//                                     {/* <Select
//                                         styles={customStyles}
//                                         options={options}
//                                         inputRef={register}
//                                     />
//                                     <Icon style={{ position: 'absolute', left: '10px', top: '10px', width: '32px', height: '32px' }} /> */}
//                                 </div>

//                             </div>

//                             <div>
//                                 <input type="submit" className='font-semibold p-2 cursor-pointer w-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl shadow-lg' />
//                             </div>

//                         </div>

//                     </form>

//                     {isAnswered && (
//                         <>
//                             <h1 className='text-red-500'>{answer}</h1>
//                         </>
//                     )}

//                 </div>
//             </section>
//         </main>
//     )
// }

// export default Kota
