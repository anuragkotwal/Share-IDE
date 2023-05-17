import React from 'react';
import { Link } from 'react-router-dom';
import "../TailwindCSS/output.css";
import shareIDE from "../../src/shareIDE.svg";

const Home = () => {
    return (
        <div className="landingPageWrapper flex flex-col relative">
            <div className=' justify-start text-white font-medium text-2xl pl-4 pt-3'>
                <img className='h-6 inline-block -mt-2' src={shareIDE} alt="" /> ShareIDE</div>
            <div className='mt-28 text-center font-light text-4xl text-white'>Share Code in Real-time with Developers</div>
            <div className='mt-6 text-center font-light text-lg text-[#d9dadb]'>An online code editor for interview, troubleshooting, teaching & more…</div>

            <Link to={"/access"} className="flex">
                <button className='text-white bg-[#ec3360] hover:bg-[#c31944] transition-all duration-300 h-12 w-36 mx-auto rounded-md mt-14 '>Access Now</button>
            </Link>

            <div className=' m-auto text-white font-medium text-4xl pt-8'>
                <img className='h-10 inline-block -mt-2' src={shareIDE} alt="" /> ShareIDE</div>

            <div className='bg-[#30353ed3] h-14 w-full absolute bottom-0 flex'>
                <div className='text-[#9ea1a7] text-center flex m-auto justify-center'>Made With &#x2764;</div>
            </div>
        </div>
    );
};

export default Home;
