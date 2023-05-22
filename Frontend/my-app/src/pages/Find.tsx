import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import Map from '../components/Map';

export interface FindValues {
    origin: string,
    destination: string
}

type Coordinate = {
    latitude: number;
    longitude: number;
}

type Option = {
    value: string;
    label: string;
    coordinate: Coordinate;
}

const Find = () => {

    const [options, setOptions] = useState<Array<Option>>([]);
    const [selectedOriOption, setSelectedOriOption] = useState<Option>();
    const [selectedDestOption, setSelectedDestOption] = useState<Option>();
    const [submittedOriOption, setSubmittedOriOption] = useState<string>();
    const [submittedDestOption, setSubmittedDestOption] = useState<string>();

    useEffect(() => {
        fetch('http://localhost:5000/option')
            .then((response) => response.json())
            .then((data) => {
                setOptions(data.options);
                console.log(data.options);
            })
            .catch((error) => {
                console.error('Error fetching options:', error);
            });

    }, []);

    const [answer1, setAnswer1] = useState<Array<[string, string, number, string, [number, number], [number, number]]>>([]);
    const [answer2, setAnswer2] = useState<Array<[string, string, number, string, [number, number], [number, number]]>>([]);
    const [totalCost1, setTotalCost1] = useState<number>();
    const [totalCost2, setTotalCost2] = useState<number>();
    const [isAnswered, setIsAnswered] = useState(false);
    const [isToggled, setIsToggled] = useState(false);

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

        if (!response.ok)
            console.log("Response Not OK");

        console.log(result);

        setAnswer1(result.data.answer.data_rute1);
        setAnswer2(result.data.answer.data_rute2);
        setSubmittedOriOption(result.data.origin);
        setSubmittedDestOption(result.data.destination);
        setTotalCost1(result.data.answer.total_cost1);
        setTotalCost2(result.data.answer.total_cost2);
        setIsAnswered(true);
        reset();
    }

    const emptyOption: Option = {
        value: "",
        label: "",
        coordinate: {
            latitude: 0,
            longitude: 0,
        },
    };

    const validateSameValue = (value: string, selectedOption: Option | undefined) => {
        if (selectedOption && value === selectedOption.value) {
            return "Kota asal dan tujuan tidak boleh sama";
        }
        return true;
    };

    register("origin", {
        required: 'Kota asal harus dipilih',
        validate: (value) =>
            validateSameValue(value, selectedDestOption),
    });

    register("destination", {
        required: 'Kota tujuan harus dipilih',
        validate: (value) =>
            validateSameValue(value, selectedOriOption),
    });


    return (
        <main className=''>
            <section className='bg-gradient-to-t from-[#170B94] via-[#330FBD] via-[#F0B7D2] via-[#330FBD] to-[#170B94] flex flex-col justify-center min-h-screen w-screen items-center'>

                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full items-center h-full'>
                    <div className='bg-gradient-to-br from-[#7109B6] via-[#4BC9F1] to-[#7109B6] h-3/4 w-11/12 flex flex-col gap-5 rounded-3xl items-center py-5 my-5'>

                        <div className='bg-[#122C5A] rounded-3xl flex flex-col p-5 w-11/12'>
                            <div className='flex flex-col gap-2'>

                                <div className='sm:flex justify-between gap-10'>

                                    <div className='basis-1/2 flex flex-col'>
                                        <label htmlFor='origin' className='text-white text-lg'>Kota Asal</label>
                                        <select
                                            id="origin"
                                            className="bg-gradient-to-t from-[#82ACF5] to-[#4460EF] p-2 rounded-full"
                                            {...register("origin")}
                                            onChange={(e) => {
                                                const selectedValue = e.target.value;
                                                const selectedOriOption = options.find(
                                                    (option) => option.value === selectedValue
                                                );
                                                setSelectedOriOption(selectedOriOption);
                                            }}
                                        >
                                            <option value="">Pilih Kota Asal</option>
                                            {options.map((option) => (
                                                <option
                                                    className="bg-[#4460EF] text-white"
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.origin && (
                                            <p className="text-red-500 text-xs mt-1">{errors.origin.message}</p>
                                        )}
                                    </div>

                                    <div className='basis-1/2 flex flex-col'>
                                        <label htmlFor='destination' className='text-white text-lg'>Kota Tujuan</label>

                                        <select
                                            id="destination"
                                            className="bg-gradient-to-t from-[#82ACF5] to-[#4460EF] p-2 rounded-full"
                                            {...register("destination")}
                                            onChange={(e) => {
                                                const selectedValue = e.target.value;
                                                const selectedDestOption = options.find(
                                                    (option) => option.value === selectedValue
                                                );
                                                setSelectedDestOption(selectedDestOption);
                                            }}
                                        >
                                            <option value="">Pilih Kota Tujuan</option>
                                            {options.map((option) => (
                                                <option
                                                    className="bg-[#4460EF] text-white"
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.destination && (
                                            <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isAnswered && (
                            <div className='flex flex-col md:flex-row text-semibold gap-5 justify-around'>

                                <div className="flex items-center bg-gradient-to-t from-[#F0B7D1] to-[#D73B83] p-2 rounded-full shadow-md">
                                    <input
                                        id="default-radio-1"
                                        type="radio"
                                        value=""
                                        name="default-radio"
                                        checked={!isToggled}
                                        onChange={() => setIsToggled(!isToggled)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium text-white">
                                        Harga Termurah
                                    </label>
                                </div>

                                <div className="flex items-center bg-gradient-to-t from-[#F0B7D1] to-[#D73B83] p-2 rounded-full shadow-md">
                                    <input
                                        id="default-radio-2"
                                        type="radio"
                                        value=""
                                        name="default-radio"
                                        checked={isToggled}
                                        onChange={() => setIsToggled(!isToggled)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="default-radio-2" className="ml-2 text-sm font-medium text-white">
                                        Waktu Tercepat
                                    </label>
                                </div>

                            </div>

                        )
                        }

                        <div className='w-full h-full flex flex-col md:flex-row items-center md:items-start justify-around gap-5 md:px-5'>

                            <div className="md:basis-1/2 bg-blue-500 w-11/12 h-96 md:w-1/2 md:h-52 border-2">

                                <Map
                                    ori={selectedOriOption || emptyOption}
                                    dest={selectedDestOption || emptyOption}
                                    path1={answer1.map(([, , , , point1, point2]) => [point1, point2])}
                                    path2={answer2.map(([, , , , point1, point2]) => [point1, point2])}
                                    toggle={{
                                        isToggled: isToggled,
                                        setIsToggled: setIsToggled,
                                    }}
                                />
                            </div>

                            {isAnswered && !isToggled && (
                                <>
                                    <div className='md:basis-1/2 text-white bg-gradient-to-t from-[#7109B6] to-[#3A0CA3] p-5 rounded-3xl mx-5 md:mx-0'>
                                        <h2 className="text-2xl font-semibold"> {submittedOriOption && submittedDestOption ? `Rute Bus ${submittedOriOption} -> ${submittedDestOption} Termurah` : null}</h2>
                                        <ul className=''>
                                            {answer1.map(([start, end, cost, busName], i) => (
                                                <li className="p-2 bg-[#7109B6]/60 rounded-3xl my-1" key={start}>
                                                    {i + 1}. {start} -&gt; {end} : Rp{cost}.000 by {busName}
                                                </li>
                                            ))}
                                        </ul>
                                        {totalCost1 ? <h2>Total Waktu Tempuh Rp{totalCost1.toLocaleString()}.000 </h2> : <h2> Bus Tidak Ditemukan</h2>}
                                    </div>
                                </>
                            )}

                            {isAnswered && isToggled && (
                                <>
                                    <div className='md:basis-1/2 text-white bg-gradient-to-t from-[#7109B6] to-[#3A0CA3] p-5 rounded-3xl mx-5 md:mx-0'>
                                        <h2 className="text-2xl font-semibold"> {submittedOriOption && submittedDestOption ? `Rute Bus ${submittedOriOption} -> ${submittedDestOption} Tercepat` : null}</h2>
                                        <ul>
                                            {answer2.map(([start, end, cost, busName]) => (
                                                <li className="p-2 bg-[#7109B6]/60 rounded-3xl my-1" key={start}>
                                                    {start} -&gt; {end} : {cost > 60 ? `${Math.floor(cost / 60)} jam ${cost % 60} menit` : cost} by {busName}
                                                </li>
                                            ))}
                                        </ul>
                                        {totalCost2 ? <h2>Total Waktu Tempuh : {totalCost2 > 60 ? `${Math.floor(totalCost2 / 60)} jam ${totalCost2 % 60} menit` : totalCost2} </h2> : <h2> Bus Tidak Ditemukan</h2>}

                                    </div>
                                </>
                            )}
                        </div>


                    </div>

                    <div>
                        <input type="submit" className='font-semibold px-5 py-2 cursor-pointer w-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl shadow-lg' />
                    </div>
                </form>
            </section>
        </main>
    )
}

export default Find
