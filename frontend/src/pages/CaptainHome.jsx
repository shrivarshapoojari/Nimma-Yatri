import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const containerStyle = {
    width: "100%",
    height: "500px",
  };
  
const defaultCenter = { lat: 12.9716, lng: 77.5946 };
const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)
    const [prob,setProb]=useState(0)
    const[gain,setGain]=useState(0)
    const [location, setLocation] = useState(defaultCenter);
    const mapRef = useRef(null);
    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)
    
    const key = import.meta.env.VITE_GOOGLE_MAPS_API

    const [ridePopupOpen, setRidePopupOpen] = useState(false);
   
    

   



    useEffect(() => {
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {

                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        // return () => clearInterval(locationInterval)
    }, [])

    socket.on('new-ride', (data) => {
           
        console.log("New ride:", data);
        console.log("Aura:",data.aura);
        setRide(data.ride)
        setGain(data.aura)
        setRidePopupPanel(true)

    })

    socket.on('ride-taken', (data) => {
        console.log("Another captain took the ride:", data);
       
    });

    socket.on('que', (data) => {
        console.log("Ride assigned to captain:", data);
        setConfirmRidePopupPanel(true)
        alert("Ride assigned from queue");
    })

    

    const getProbabilities = async()=>{
        const response=await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/probability`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(response)
        setProb(response.data)
    }

    async function confirmRide() {

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {

            rideId: ride._id,
            captainId: captain._id,


        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)

    }


    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ ridePopupPanel ])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePopupPanel ])

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src=" " alt="" />
                <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className="h-3/5">
             
        <LoadScript googleMapsApiKey = {key}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={15}
            onLoad={(map) => (mapRef.current = map)}
            options={{
              zoomControl: true,
              fullscreenControl: true,
              streetViewControl: false,
              mapTypeControl: false,
        }}
          >
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                    socket={socket}
                    captain={captain}
                    gain={gain}
                    
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>

            <div>
            
        </div>
        </div>
    )
}

export default CaptainHome