const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        console.log("Recieved address:", address);
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        }  
        
        console.log("Response:", response.data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// module.exports.getDistanceTime = async (origin, destination) => {
//     if (!origin || !destination) {
//         throw new Error('Origin and destination are required');
//     }

//     const apiKey = process.env.GOOGLE_MAPS_API;

//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

//     try {


//         const response = await axios.get(url);
//         if (response.data.status === 'OK') {

//             if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
//                 throw new Error('No routes found');
//             }

//             return response.data.rows[ 0 ].elements[ 0 ];
//         } else {
//             console.log(response.data);
//             throw new Error('Unable to fetch distance and time');
//         }

//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }


module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }
   
    
   

      const source= await this.getAddressCoordinate(origin);
      const dest= await this.getAddressCoordinate(destination);
    
      const sourcelat=source.ltd;
        const sourcelng=source.lng;
        const destlat=dest.ltd;
        const destlng=dest.lng;
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix";

    // Google Routes API expects "origins" and "destinations" as objects with lat/lng
    const requestBody = {
        origins: [
            {
                waypoint: {
                    location: { latLng: { latitude: sourcelat, longitude:sourcelng } }
                },
                routeModifiers: { avoid_ferries: true }
            }
        ],
        destinations: [
            {
                waypoint: {
                    location: { latLng: { latitude: destlat, longitude:destlng  } }
                }
            }
        ],
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE"
    };
 

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "originIndex,destinationIndex,duration,distanceMeters,status,condition"
            }
        });

 

        if (response.data.length > 0) {
            // console.log("Response:", response.data);
            return {
                duration: response.data[0].duration,
                distance: response.data[0].distanceMeters
            };
        } else {
            throw new Error("No routes found");
        }
    } catch (err) {
        console.error("API Error:", err.response ? err.response.data : err.message);
        throw new Error("Unable to fetch distance and time");
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            console.error(response.data);
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km


    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}