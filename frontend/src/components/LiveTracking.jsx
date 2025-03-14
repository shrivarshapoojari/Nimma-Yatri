import React, { useState, useEffect, useRef } from 'react'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '500px', // Set full height for better visibility
};

const defaultCenter = {
    lat: 12.9716, 
    lng: 77.5946 
};

const LiveTracking = () => {
    const [location, setLocation] = useState(defaultCenter);
    const mapRef = useRef(null);

    useEffect(() => {
        const updatePosition = (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({
                lat: latitude,
                lng: longitude
            });

            if (mapRef.current) {
                mapRef.current.panTo({ lat: latitude, lng: longitude }); // Pan map to new location
            }
        };

        navigator.geolocation.getCurrentPosition(updatePosition);
        const watchId = navigator.geolocation.watchPosition(updatePosition);

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={location} // Update map center dynamically
                zoom={15}
                onLoad={(map) => (mapRef.current = map)}
                options={{
                    zoomControl: true,
                    fullscreenControl: true,
                    streetViewControl: true,
                    mapTypeControl: false,
                }}
            >
                <Marker position={location} />
            </GoogleMap>
        </LoadScript>
    )
}

export default LiveTracking
