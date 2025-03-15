
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GreedyPopup = ({ isOpen, onClose }) => {
    const [rideData, setRideData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) return; // Prevent API call if popup is closed

        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/getrides`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(response);
                setRideData(response.data);
                setLoading(false);
            } catch (err) {
                console.log(err)
                setError('Failed to fetch ride data');
                setLoading(false);
            }
        };

        fetchData();
    },[isOpen]); 

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button 
                    className="absolute top-2 right-2 text-gray-500 text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="text-center text-lg font-semibold">
                    {loading ? "Loading..." : "Ride Details"}
                </div>
                
                {error && <p className="text-red-500 text-center">{error}</p>}

                {rideData && (
                    <div className="mt-4 text-center">
                        <p className="text-lg font-medium">Total Rides: {rideData.path}</p>
                        <p className="text-lg font-medium">Earnings: ₹{rideData.expectedEarning}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GreedyPopup;
