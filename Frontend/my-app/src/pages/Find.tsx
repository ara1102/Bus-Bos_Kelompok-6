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

    return (
        <main className=''>
            <section className='bg-gradient-to-t from-[#3A0CA3] via-[#19195B] via-[#232268] to-[#3A0CA3] flex flex-col justify-center min-h-screen w-screen items-center'>

                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full items-center h-full'>
                    <div className='bg-gradient-to-br from-[#7109B6] via-[#4BC9F1] to-[#7109B6] h-3/4 w-full flex flex-col gap-5 rounded-3xl items-center py-5'>



                        <div className='bg-[#122C5A] rounded-3xl flex flex-col p-5 w-11/12'>
                            <div className='flex flex-col gap-2'>

                                <div className='sm:flex justify-between md:gap-2'>

                                    <div className='basis-1/2 flex flex-col'>
                                        <label htmlFor='origin' className='text-white text-lg'>Provinsi Asal</label>
                                        <select
                                            id="origin"
                                            className="bg-gradient-to-t from-[#82ACF5] to-[#4460EF] p-2 rounded-full"
                                            {...register("origin", { required: 'Provinsi Asal harus dipilih' })}
                                            onChange={(e) => {
                                                const selectedValue = e.target.value;
                                                const selectedOriOption = options.find(
                                                    (option) => option.value === selectedValue
                                                );
                                                setSelectedOriOption(selectedOriOption);
                                            }}
                                        >
                                            <option value="">Pilih Provinsi Asal</option>
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
                                        <label htmlFor='destination' className='text-white text-lg'>Provinsi Tujuan</label>

                                        <select
                                            id="destination"
                                            className="bg-gradient-to-t from-[#82ACF5] to-[#4460EF] p-2 rounded-full"
                                            {...register("destination", { required: 'Provinsi tujuan harus dipilih' })}
                                            onChange={(e) => {
                                                const selectedValue = e.target.value;
                                                const selectedDestOption = options.find(
                                                    (option) => option.value === selectedValue
                                                );
                                                setSelectedDestOption(selectedDestOption);
                                            }}
                                        >
                                            <option value="">Pilih Provinsi Tujuan</option>
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
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={isToggled} onChange={() => setIsToggled(!isToggled)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#766FF9]"></div>
                                <span className="ml-3 text-sm font-medium text-black dark:text-black"> Waktu Tempuh</span>
                            </label>)
                        }

                        <div className='w-full h-full flex flex-col md:flex-row items-center justify-around'>

                            <div className="bg-red-500 w-11/12 h-96 md:w-1/2 md:h-52 border-2">

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
                                    <div className='text-black bg-blue-500'>
                                        <h2 className="text-2xl mt-6">Rute dan biaya tempuh:</h2>
                                        <ul>
                                            {answer1.map(([start, end, cost, busName]) => (
                                                <li key={start}>
                                                    {start} -&gt; {end} : {cost} by {busName}
                                                </li>
                                            ))}
                                        </ul>
                                        <h2>Total Biaya Tempuh : {totalCost1} </h2>
                                    </div>
                                </>
                            )}

                            {isAnswered && isToggled && (
                                <>
                                    <div className='text-black bg-blue-500'>
                                        <h2 className="text-2xl mt-6">Rute dan waktu tempuh:</h2>
                                        <ul>
                                            {answer2.map(([start, end, cost, busName]) => (
                                                <li key={start}>
                                                    {start} -&gt; {end} : {cost} by {busName}
                                                </li>
                                            ))}
                                        </ul>
                                        <h2>Total Waktu Tempuh : {totalCost2} </h2>
                                    </div>
                                </>
                            )}
                        </div>


                    </div>

                    <div>
                        <input type="submit" className='font-semibold p-2 cursor-pointer w-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl shadow-lg' />
                    </div>
                </form>
            </section>
        </main>
    )
}

export default Find
