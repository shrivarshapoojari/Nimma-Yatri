

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import GreedyPopup from './greedyPopUp.jsx'; // Import the popup

// const ConfirmRidePopUp = (props) => {
 
     
//     const [isGreedyPopupOpen, setIsGreedyPopupOpen] = useState(false); // State for popup
    

 
//     console.log(props.ride)
//     const [ otp, setOtp ] = useState('')
//     const navigate = useNavigate()
  
//     const handleCancelRide = async () => {
      
//         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/cancel`, {
//             rideId: props.ride._id
//         }, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         })
        
//         console.log(response)
//         props.setConfirmRidePopupPanel(false)
//         props.setRidePopupPanel(false)
//     }
 
//     const submitHander = async (e) => {
//         e.preventDefault();

//         const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
//             params: {
//                 rideId: props.ride._id,
//                 otp: otp
//             },
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
 
//         });
 
//         })
 
 

       
//         if (response.status === 200) {
//             props.setConfirmRidePopupPanel(false);
//             props.setRidePopupPanel(false);
//             navigate('/captain-riding', { state: { ride: props.ride } });
//         }
//     };

//     return (
//         <div>
//             <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
//                 props.setRidePopupPanel(false);
//             }}>
//                 <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
//             </h5>
//             <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to Start</h3>
//             <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4'>
//                 <div className='flex items-center gap-3 '>
//                     <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
//                     <h2 className='text-lg font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
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

//                 <div className='mt-6 w-full'>
//                     <div>
//                         <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3' placeholder='Enter OTP' />
//                         <div></div>
//                         {/* <button 
//                             className='ml-auto mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg w-fit'
//                             onClick={() => setIsGreedyPopupOpen(true)} // Open the popup
//                         >
//                             Expect Gain
//                         </button> */}
//                         <button 
//                             className='w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'
//                             onClick={(e) => submitHander(e)}
//                         >
//                             Confirm
//                         </button>
//                         <button onClick={() => {
 
//                             props.setConfirmRidePopupPanel(false);
//                             props.setRidePopupPanel(false);
//                         }} className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg'>
//                             Cancel
//                         </button>
//                     </div>
 

//                             handleCancelRide()
                           

//                         }} className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg'>Cancel</button>

//                     </form>
 
//                 </div>
//             </div>

//             {/* Render GreedyPopup when isGreedyPopupOpen is true */}
//             {/* <GreedyPopup isOpen={isGreedyPopupOpen} onClose={() => setIsGreedyPopupOpen(false)} /> */}
//         </div>
//     );
// }

// export default ConfirmRidePopUp;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const handleCancelRide = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/cancel`,
                {
                    rideId: props.ride._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log(response);
            props.setConfirmRidePopupPanel(false);
            props.setRidePopupPanel(false);
        } catch (error) {
            console.error("Error canceling ride:", error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
                {
                    params: {
                        rideId: props.ride._id,
                        otp: otp,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
                navigate("/captain-riding", { state: { ride: props.ride } });
            }
        } catch (error) {
            console.error("Error starting ride:", error);
        }
    };

    return (
        <div>
            <h5
                className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => props.setRidePopupPanel(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className="text-2xl font-semibold mb-5">Confirm this ride to Start</h3>

            <div className="flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4">
                <div className="flex items-center gap-3">
                    <img
                        className="h-12 rounded-full object-cover w-12"
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                        alt=""
                    />
                    <h2 className="text-lg font-medium capitalize">
                        {props.ride?.user.fullname.firstname}
                    </h2>
                </div>
                <h5 className="text-lg font-semibold">2.2 KM</h5>
            </div>

            <div className="flex gap-2 justify-between flex-col items-center">
                <div className="w-full mt-5">
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">562/11-A</h3>
                            <p className="text-sm -mt-1 text-gray-600">{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">562/11-A</h3>
                            <p className="text-sm -mt-1 text-gray-600">{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-3">
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className="text-lg font-medium">₹{props.ride?.fare} </h3>
                            <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 w-full">
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="text"
                        className="bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3"
                        placeholder="Enter OTP"
                    />
                    <button
                        className="w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
                        onClick={submitHandler}
                    >
                        Confirm
                    </button>

                    {/* <button
                        className="w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
                        onClick={navigate("/earn")}
                    >
                        Expected gain */}
                    {/* </button> */}
                    <button
                        onClick={handleCancelRide}
                        className="w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmRidePopUp;

