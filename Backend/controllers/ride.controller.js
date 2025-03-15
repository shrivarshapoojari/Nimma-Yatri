// const rideService = require('../services/ride.service');
// const { validationResult } = require('express-validator');
// const mapService = require('../services/maps.service');
// const { sendMessageToSocketId } = require('../socket');
// const rideModel = require('../models/ride.model');


// module.exports.createRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, pickup, destination, vehicleType } = req.body;

//     try {
//         const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
//         res.status(201).json(ride);

//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);



//         const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

//         ride.otp = ""

//         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

//         captainsInRadius.map(captain => {

//             sendMessageToSocketId(captain.socketId, {
//                 event: 'new-ride',
//                 data: rideWithUser
//             })

//         })

//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }

// };

// module.exports.getFare = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { pickup, destination } = req.query;

//     try {
//         const fare = await rideService.getFare(pickup, destination);
//         return res.status(200).json(fare);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.confirmRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId } = req.body;

//     try {
//         const ride = await rideService.confirmRide({ rideId, captain: req.captain });

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-confirmed',
//             data: ride
//         })

//         return res.status(200).json(ride);
//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.startRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId, otp } = req.query;

//     try {
//         const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

//         console.log(ride);

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-started',
//             data: ride
//         })

//         return res.status(200).json(ride);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.endRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId } = req.body;

//     try {
//         const ride = await rideService.endRide({ rideId, captain: req.captain });

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-ended',
//             data: ride
//         })



//         return res.status(200).json(ride);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     } s
// }








 










const RideQueue = {}; 
 
 const captainModel = require('../models/captain.model');

const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const axios = require('axios');
const rides=[];
module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    const newRide = { pickup, destination, vehicleType };
    rides.push(newRide);

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

        ride.otp = ""; // Hide OTP before sending

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        // captainsInRadius.forEach(captain => {
        //     sendMessageToSocketId(captain.socketId, {
        //         event: 'new-ride',
        //         data: rideWithUser
        //     });
        // });







        const distanceTimeForRide = await mapService.getDistanceTime(pickup, destination);
        const rideDistance = distanceTimeForRide.distance;
        const rideDuration = parseInt(distanceTimeForRide.duration);


        const predictionData = {
            "Distance (km)": rideDistance/1000,
            "Fare (INR)": ride.fare,
            "Time Duration (minutes)": rideDuration/60,
            "Day of the Week": "Tuesday",
            "Destination Booking Density": "Medium"
        };
        
        
      
 
         
        const mlResponse = await axios.post("http://127.0.0.1:5000/predict", predictionData);
        console.log("mlResponse")
        console.log(mlResponse.data)
        const difficultyScore = mlResponse.data.predicted_difficulty_score;
        console.log("Difficulty score:", difficultyScore);
        
        if(!difficultyScore) {
            difficultyScore = 0;
        }
        let normalizedScore = ((difficultyScore - 5) / (10 - 5)) * 10;
        console.log("Normalized score",normalizedScore)

        normalizedScore  = parseFloat(normalizedScore.toFixed(2));
      




        const highAuraCaptains = captainsInRadius.filter(captain => captain.aura >= 50); // Adjust threshold as needed
        const lowAuraCaptains = captainsInRadius.filter(captain => captain.aura < 50);

        highAuraCaptains.forEach(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: {
                    ride: rideWithUser,
                    aura: normalizedScore 
                }
            });
        });

      
        // Delay sending ride request to low aura captains by 5 seconds
        setTimeout(() => {
            lowAuraCaptains.forEach(captain => {
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: {
                        ride: rideWithUser,
                        aura: normalizedScore 
                    }
                });
            });
        }, 10000);


    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

// module.exports.getAllRides =async (req, res) => {
//     // console.log("rides")
//     // console.log(rides)
//     // res.status(200).json(rides);
//     console.log(rides);
//     const longestPath = await rideService.findLongestNavigablePathByVehicle(rides,"auto");
//     // console.log(paths);

//     if (longestPath.length < 2) {
//         console.log("No valid path found");
//         return 0; // No travel, no fare
//     }

//     let totalFare = 0;

//     // Step 2: Compute fare for each segment in the path
//     for (let i = 0; i < longestPath.length - 1; i++) {
//         const pickup = longestPath[i];
//         const destination = longestPath[i + 1];

//         const fare = await rideService.getFare(pickup, destination);
//         totalFare += fare["auto"]; // Ensure correct vehicle type fare is summed
//     }

//     console.log(`Total expected fare: ${totalFare}`);
    

//     const responseData = {
//         path: longestPath, // Assuming rides is an array
//         expectedEarning: totalFare,
//         message: "Successfully fetched path"
//     };

//     res.status(200).json(responseData);
// };

module.exports.getAllRides =async (req, res) => {
    // console.log("rides")
    // console.log(rides)
    // res.status(200).json(rides);
    console.log(rides);
    const longestPath = await rideService.findLongestNavigablePathByVehicle(rides,"auto");
    // console.log(paths);

    if (longestPath.length < 2) {
        console.log("No valid path found");
        return 0; // No travel, no fare
    }

    let totalFare = 0;

    // Step 2: Compute fare for each segment in the path
    for (let i = 0; i < longestPath.length - 1; i++) {
        const pickup = longestPath[i];
        const destination = longestPath[i + 1];

        const fare = await rideService.getFare(pickup, destination);
        totalFare += fare["auto"];  
    }

    console.log(`Total expected fare: ${totalFare}`);
    

    const responseData = {
        path: longestPath, // Assuming rides is an array
        expectedEarning: totalFare,
        message: "Successfully fetched path"
    };

    res.status(200).json(responseData);
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

















// module.exports.confirmRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId } = req.body;
//         const rideDetails= await rideModel.findOne({ _id: rideId})
//          const pickupCoordinates = await mapService.getAddressCoordinate(rideDetails.pickup);
//     try {
//         Object.keys(RideQueue).forEach((queueRideId) => {
//             RideQueue[queueRideId] = RideQueue[queueRideId].filter(entry => entry.captainId.toString() !== captain._id.toString());
//         });
//         const ride = await rideService.confirmRide({ rideId, captain: req.captain });

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-confirmed',
//             data: ride
//         });
      
//         const captain =  req.captain;

//       const activeCaptains=  await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

//         activeCaptains.forEach(capt => {
//             if (capt._id.toString() !== captain._id.toString()) {
//                 sendMessageToSocketId(capt.socketId, {
//                     event: 'ride-taken',
//                     data: { rideId: ride._id, message: 'Another captain has taken this ride.' }
//                 });
//             }
//         });







        
//         return res.status(200).json(ride);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }
//

// module.exports.waitForRide = async (req, res) => {
//     try {
//         const { rideId, captainId } = req.body;

//         // Validate ride and captain
//         const ride = await rideModel.findById(rideId);
//         const captain = await captainModel.findById(captainId);

//         if (!ride) return res.status(404).json({ message: 'Ride not found' });
//         if (!captain) return res.status(404).json({ message: 'Captain not found' });

//         // Initialize queue for this ride if it doesn't exist
//         if (!RideQueue[rideId]) {
//             RideQueue[rideId] = [];
//         }

//         // Add captain to the queue with timestamp
//         RideQueue[rideId].push({ captainId, timestamp: Date.now() });

//         res.status(200).json({ message: 'Captain added to waiting queue', queuePosition: RideQueue[rideId].length });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };



// module.exports.cancelRide = async (req, res) => {
//     const errors = validationResult(req);
//     console.log("in cancel ride")
//     console.log(req.body)
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId } = req.body;

//     console.log("rideId",rideId)
//     console.log("req.captain",req.captain)
      
//     try {
        
//         const ride=await rideModel.findOne({ _id: rideId });
        
 
       

        
//         if (RideQueue[rideId] && RideQueue[rideId].length > 0) {
//             const nextCaptain = RideQueue[rideId].shift(); // Get the first captain in queue

//             // Assign the ride to the new captain
//             ride.captain = nextCaptain.captainId;
//             const newCaptain=await captainModel.findById(nextCaptain.captainId)
//             await ride.save();

           
//             sendMessageToSocketId(newCaptain.socketId, {
//                 event: 'que',
//                 data: ride
//             });
//             console.log("new driver assigned")
//         }
//         else
//         {
//             sendMessageToSocketId(ride.user.socketId, {
//                 event: 'ride-cancelled',
//                 data: ride
//             });

//         }

//         return res.status(200).json(ride);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }
// };



////////////////////////////////////////////////////

const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

  // Stores priority queues for each ride

module.exports.waitForRide = async (req, res) => {
    try {
        const { rideId, captainId } = req.body;

        // Validate ride and captain
        const ride = await rideModel.findById(rideId);
        const captain = await captainModel.findById(captainId);

        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        if (!captain) return res.status(404).json({ message: 'Captain not found' });

        // Initialize a priority queue for this ride if it doesn't exist
        if (!RideQueue[rideId]) {
            RideQueue[rideId] = new MinPriorityQueue((a, b) => b.aura - a.aura); // Higher aura = Higher priority
        }
        // Add captain to the priority queue (automatically sorted by timestamp)
        RideQueue[rideId].enqueue({ captainId, aura: captain.aura });

        res.status(200).json({ message: 'Captain added to waiting queue', queueSize: RideQueue[rideId].size() });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.cancelRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    
    try {
        const ride = await rideModel.findOne({ _id: rideId });
           const cancelledCaptain= await captainModel.findById(ride.captain);
           console.log("cancelledCaptain",cancelledCaptain)
           if (cancelledCaptain) {
            cancelledCaptain.aura -= 10; // Reduce aura by 10
            await cancelledCaptain.save(); // Save updated aura
            console.log("Updated aura:", cancelledCaptain.aura);
        }
        if (RideQueue[rideId] && !RideQueue[rideId].isEmpty()) {
            // Pick the captain with the highest priority (earliest timestamp)
            const nextCaptain = RideQueue[rideId].dequeue();
            ride.captain = nextCaptain.captainId;
            await ride.save();

            const newCaptain = await captainModel.findById(nextCaptain.captainId);
            sendMessageToSocketId(newCaptain.socketId, {
                event: 'que',
                data: ride
            });
            console.log("New captain assigned from queue");
        } else {
            // Notify user that no captain is available
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-cancelled',
                data: ride
            });
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    try {
        const captain = req.captain;
        const rideDetails= await rideModel.findOne({ _id: rideId})
                 const pickupCoordinates = await mapService.getAddressCoordinate(rideDetails.pickup);
        // Remove captain from all queues
        Object.keys(RideQueue).forEach(queueRideId => {
            const tempQueue = new MinPriorityQueue((entry) => entry.timestamp);
            while (!RideQueue[queueRideId].isEmpty()) {
                const entry = RideQueue[queueRideId].dequeue();
                if (entry.captainId.toString() !== captain._id.toString()) {
                    tempQueue.enqueue(entry);
                }
            }
            RideQueue[queueRideId] = tempQueue;
        });

        const ride = await rideService.confirmRide({ rideId, captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });
        
      const activeCaptains=  await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

        activeCaptains.forEach(capt => {
            if (capt._id.toString() !== captain._id.toString()) {
                sendMessageToSocketId(capt.socketId, {
                    event: 'ride-taken',
                    data: { rideId: ride._id, message: 'Another captain has taken this ride.' }
                });
            }
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};






module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });


        const pickup=ride?.pickup;
        const destination=ride?.destination;
         const distanceTimeForRide = await mapService.getDistanceTime(pickup, destination);
            const rideDistance = distanceTimeForRide.distance;
            const rideDuration = parseInt(distanceTimeForRide.duration);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });




 
console.log("rideDistance",rideDistance/1000)
console.log("rideDuration",rideDuration/60)


        const predictionData = {
            "Distance (km)": rideDistance/1000,
            "Fare (INR)": ride.fare,
            "Time Duration (minutes)": rideDuration/60,
            "Day of the Week": "Tuesday",
            "Destination Booking Density": "Medium"
        };

 
        
        // Call ML model API
        const mlResponse = await axios.post("http://127.0.0.1:5000/predict", predictionData);
        console.log("mlResponse")
        console.log(mlResponse.data)
        const difficultyScore = mlResponse.data.predicted_difficulty_score;
        console.log("Difficulty score:", difficultyScore);
        // Adjust aura based on difficulty score
        if(!difficultyScore) {
            difficultyScore = 0;
        }
        let normalizedScore = ((difficultyScore - 5) / (10 - 5)) * 10;
        console.log("Normalized score",normalizedScore)
        console.log("Aura Before",req.captain.aura)
         // You can modify the factor
        req.captain.aura += normalizedScore;

        // Save the updated captain
        await req.captain.save();


           






        return res.status(200).json(ride);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
 