// <<<<<<< greedyFrontend
// import React, { useState } from 'react';
// import GreedyPopup from './GreedyPopup';

// const RidePopUp = (props) => {
//     const [isGreedyPopupOpen, setIsGreedyPopupOpen] = useState(false); // State for GreedyPopup

// =======
// import React from 'react'
// import { useState, useEffect } from 'react'
// import axios from 'axios'
// const RidePopUp = (props) => 
// {
//     const [isWaiting, setIsWaiting] = useState(false);
//         const [addedtoQueue, setAddedtoQueue] = useState(false);

//         const [animatedAura, setAnimatedAura] = useState(props.gain);

//         useEffect(() => {
//             // Smooth animation effect for aura points
//             let interval = setInterval(() => {
//                 // setAnimatedAura((prev) => prev + Math.random() * 0.2 - 0.1);
//             }, 500);
    
//             return () => clearInterval(interval);
//         }, []);
    


// const handleWait=async()=>{
//     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/wait`, {
//         rideId: props.ride._id,
//         captainId: props.captain._id
//     }, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//     })
//     console.log(response)
//     if(response.status===200){
//         setAddedtoQueue(true)
//         props.setRidePopupPanel(false)
//     }
    

// }

//     useEffect(() => {
//         // Listen for the 'ride-taken' event
//         props.socket.on('ride-taken', () => {
//             setIsWaiting(true);
//         });

//         // return () => {
//         //     props.socket.off('ride-taken');
//         // };
//     }, [props.socket]);
// >>>>>>> main
//     return (
//         <div>
//             <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
//                 props.setRidePopupPanel(false);
//             }}>
//                 <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
//             </h5>
//             <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>
// <<<<<<< greedyFrontend

//             <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
// =======
//             {/* <h2 className='text-green-500 font-bold text-5xl '>Expected Aura:{props.gain}</h2> */}

//             <div className="absolute top-5 right-5 flex flex-col items-center">
//                 <div className="relative w-16 h-16 bg-yellow-500 text-white font-bold text-lg flex items-center justify-center rounded-full shadow-lg border-4 border-yellow-300 animate-pulse">
//                     {props.gain}
//                     <div className="absolute inset-0 animate-spin-slow">
//                         🪙 {/* Coin emoji to simulate a spinning effect */}
//                     </div>
//                 </div>
//                 <p className="text-md font-medium text-yellow-700 mb-12 ">Expected Aura Points</p>
//             </div>
//             <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-8'>
// >>>>>>> main
//                 <div className='flex items-center gap-3 '>
//                     <img className='h-12 rounded-full object-cover w-12' 
//                         src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" 
//                     />
//                     <h2 className='text-lg font-medium'>
//                         {props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}
//                     </h2>
//                 </div>
//                 <h5 className='text-lg font-semibold'>2.2 KM</h5>
//             </div>

//             <div className='flex gap-2 justify-between flex-col items-center'>
//                 <div className='w-full mt-5'>
//                     <div className='flex items-center gap-5 p-3 border-b-2'>
//                         <i className="ri-map-pin-user-fill"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>562/11-A</h3>
//                             <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
//                         </div>
//                     </div>
//                     <div className='flex items-center gap-5 p-3 border-b-2'>
//                         <i className="text-lg ri-map-pin-2-fill"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>562/11-A</h3>
//                             <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
//                         </div>
//                     </div>
//                     <div className='flex items-center gap-5 p-3'>
//                         <i className="ri-currency-line"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
//                             <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className='mt-5 w-full '>
// <<<<<<< greedyFrontend
//                     {/* Expect Gain Button */}
//                     <button 
//                         onClick={() => setIsGreedyPopupOpen(true)}
//                         // className='ml-auto mt-5 text-lg flex justify-center bg-blue-600 text-white font-semibold p-3 rounded-lg w-fit'  
//                         className="mt-3 ml-auto mb-5 text-lg flex justify-center bg-blue-600 text-white font-semibold p-3 rounded-lg w-fit relative"

// =======
//                  { !isWaiting  ?<button onClick={() => {
//                         props.setConfirmRidePopupPanel(true)
//                         props.confirmRide()
// >>>>>>> main


// <<<<<<< greedyFrontend
// =======
//                     : <button className='  bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg'
//                       onClick={handleWait}
//                       disabled={addedtoQueue}
//                     >{!addedtoQueue?"Wait":"Added to queue"}</button>
//                 }
                  
//                   {   !addedtoQueue && <button onClick={() => {
//                         props.setRidePopupPanel(false)
// >>>>>>> main

//                     >
//                         Expect Gain
//                     </button>

// <<<<<<< greedyFrontend
//                     {/* Accept Ride Button */}
//                     <button 
//                         onClick={() => {
//                             props.setConfirmRidePopupPanel(true);
//                             props.confirmRide();
//                         }} 
//                         className='bg-green-600 w-full text-white font-semibold p-2 rounded-lg'
//                     >
//                         Accept
//                     </button>

//                     {/* Ignore Ride Button */}
//                     <button 
//                         onClick={() => {
//                             props.setRidePopupPanel(false);
//                         }} 
//                         className='mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 rounded-lg'
//                     >
//                         Ignore
//                     </button>
// =======
//                 }
// >>>>>>> main
//                 </div>
//             </div>

//             {/* Render GreedyPopup when isGreedyPopupOpen is true */}
//             <GreedyPopup isOpen={isGreedyPopupOpen} onClose={() => setIsGreedyPopupOpen(false)} />
//         </div>
//     );
// };

// export default RidePopUp;
























import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GreedyPopup from './GreedyPopup';
import { useNavigate } from 'react-router-dom';

const RidePopUp = (props) => {
    const [isGreedyPopupOpen, setIsGreedyPopupOpen] = useState(false); 
    const [isWaiting, setIsWaiting] = useState(false);
    const [addedtoQueue, setAddedtoQueue] = useState(false);
    const [animatedAura, setAnimatedAura] = useState(props.gain);
const navigate=useNavigate();
    useEffect(() => {
        // Smooth animation effect for aura points
        let interval = setInterval(() => {
            // setAnimatedAura((prev) => prev + Math.random() * 0.2 - 0.1);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleWait = async () => {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/wait`, {
            rideId: props.ride._id,
            captainId: props.captain._id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 200) {
            setAddedtoQueue(true);
            props.setRidePopupPanel(false);
        }
    };

    useEffect(() => {
        props.socket.on('ride-taken', () => {
            setIsWaiting(true);
        });
    }, [props.socket]);

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => props.setRidePopupPanel(false)}>
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>

            {/* Aura Points Display */}
            <div className="absolute top-5 right-5 flex flex-col items-center">
                <div className="relative w-16 h-16 bg-yellow-500 text-white font-bold text-lg flex items-center justify-center rounded-full shadow-lg border-4 border-yellow-300 animate-pulse">
                    {props.gain}
                    <div className="absolute inset-0 animate-spin-slow">🪙</div>
                </div>
                <p className="text-md font-medium text-yellow-700 mb-12">Expected Aura Points</p>
            </div>

            {/* Ride Details */}
            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3'>
                    <img className='h-12 rounded-full object-cover w-12' 
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" 
                    />
                    <h2 className='text-lg font-medium'>
                        {props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}
                    </h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>

            {/* Route Details */}
            <div className='w-full mt-5'>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="ri-map-pin-user-fill"></i>
                    <div>
                        <h3 className='text-lg font-medium'>562/11-A</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="text-lg ri-map-pin-2-fill"></i>
                    <div>
                        <h3 className='text-lg font-medium'>562/11-A</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className="ri-currency-line"></i>
                    <div>
                        <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className='mt-5 w-full'>
                {/* Expect Gain Button */}
                <button 
                    onClick={()=>navigate("/earn")}
                    className="mt-3 ml-auto mb-5 text-lg flex justify-center bg-blue-600 text-white font-semibold p-3 rounded-lg w-fit relative"
                >
                    Expect Gain
                </button>

                {/* Accept Ride Button */}
                {!isWaiting ? (
                    <button 
                        onClick={() => {
                            props.setConfirmRidePopupPanel(true);
                            props.confirmRide();
                        }} 
                        className='bg-green-600 w-full text-white font-semibold p-2 rounded-lg'
                    >
                        Accept
                    </button>
                ) : (
                    <button 
                        className='bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg'
                        onClick={handleWait}
                        disabled={addedtoQueue}
                    >
                        {!addedtoQueue ? "Wait" : "Added to queue"}
                    </button>
                )}

                {/* Ignore Ride Button */}
                {!addedtoQueue && (
                    <button 
                        onClick={() => props.setRidePopupPanel(false)}
                        className='mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 rounded-lg'
                    >
                        Ignore
                    </button>
                )}
            </div>

            {/* GreedyPopup */}
            <GreedyPopup isOpen={isGreedyPopupOpen} onClose={() => setIsGreedyPopupOpen(false)} />
        </div>
    );
};

export default RidePopUp;

