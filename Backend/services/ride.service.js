// const rideModel = require('../models/ride.model');
// const mapService = require('./maps.service');
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');

// async function getFare(pickup, destination) {
            

//     console.log(pickup, destination);
//     if (!pickup || !destination) {
//         throw new Error('Pickup and destination are required');
//     }

//     const distanceTime = await mapService.getDistanceTime(pickup, destination);
            
//     console.log("distanceTime is ",distanceTime);
    
//     console.log("distanceTime.distance is ",distanceTime.distance);
//     console.log("distanceTime.duration is ",distanceTime.duration);
//     const distance = distanceTime.distance; // Already a number
// const duration = parseInt(distanceTime.duration); // Extract numeric part

//     const baseFare = {
//         auto: 30,
//         car: 50,
//         moto: 20
//     };

//     const perKmRate = {
//         auto: 10,
//         car: 15,
//         moto: 8
//     };

//     const perMinuteRate = {
//         auto: 2,
//         car: 3,
//         moto: 1.5
//     };



//     const fare = {
//         auto: Math.round(baseFare.auto + ((distance/ 1000) * perKmRate.auto) + ((duration / 60) * perMinuteRate.auto)),
//         car: Math.round(baseFare.car + ((distance / 1000) * perKmRate.car) + ((duration / 60) * perMinuteRate.car)),
//         moto: Math.round(baseFare.moto + ((distance / 1000) * perKmRate.moto) + ((duration/ 60) * perMinuteRate.moto))
//     };
//   console.log("fare is ",fare);
//     return fare;


// }

// module.exports.getFare = getFare;


// function getOtp(num) {
//     function generateOtp(num) {
//         const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
//         return otp;
//     }
//     return generateOtp(num);
// }


// module.exports.createRide = async ({
//     user, pickup, destination, vehicleType
// }) => {
//     if (!user || !pickup || !destination || !vehicleType) {
//         throw new Error('All fields are required');
//     }

//     const fare = await getFare(pickup, destination);



//     const ride = rideModel.create({
//         user,
//         pickup,
//         destination,
//         otp: getOtp(6),
//         fare: fare[ vehicleType ]
//     })

//     return ride;
// }

// module.exports.confirmRide = async ({
//     rideId, captain
// }) => {
//     if (!rideId) {
//         throw new Error('Ride id is required');
//     }

//     await rideModel.findOneAndUpdate({
//         _id: rideId
//     }, {
//         status: 'accepted',
//         captain: captain._id
//     })

//     const ride = await rideModel.findOne({
//         _id: rideId
//     }).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     return ride;

// }

// module.exports.startRide = async ({ rideId, otp, captain }) => {
//     if (!rideId || !otp) {
//         throw new Error('Ride id and OTP are required');
//     }

//     const ride = await rideModel.findOne({
//         _id: rideId
//     }).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     if (ride.status !== 'accepted') {
//         throw new Error('Ride not accepted');
//     }

//     if (ride.otp !== otp) {
//         throw new Error('Invalid OTP');
//     }

//     await rideModel.findOneAndUpdate({
//         _id: rideId
//     }, {
//         status: 'ongoing'
//     })

//     return ride;
// }

// module.exports.endRide = async ({ rideId, captain }) => {
//     if (!rideId) {
//         throw new Error('Ride id is required');
//     }

//     const ride = await rideModel.findOne({
//         _id: rideId,
//         captain: captain._id
//     }).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     if (ride.status !== 'ongoing') {
//         throw new Error('Ride not ongoing');
//     }

//     await rideModel.findOneAndUpdate({
//         _id: rideId
//     }, {
//         status: 'completed'
//     })

//     return ride;
// }





const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');

const rideQueues = new Map(); // Stores captains in a queue for each ride

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    const distance = distanceTime.distance;
    const duration = parseInt(distanceTime.duration);

    const baseFare = { auto: 30, car: 50, moto: 20 };
    const perKmRate = { auto: 10, car: 15, moto: 8 };
    const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

    return {
        auto: Math.round(baseFare.auto + ((distance / 1000) * perKmRate.auto) + ((duration / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distance / 1000) * perKmRate.car) + ((duration / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distance / 1000) * perKmRate.moto) + ((duration / 60) * perMinuteRate.moto))
    };
}

module.exports.getFare = getFare;
function getOtp(num) {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);
    const ride = await rideModel.create({
        user, pickup, destination, otp: getOtp(6), fare: fare[vehicleType], status: 'waiting'
    });

    rideQueues.set(ride._id.toString(), []); // Initialize queue for this ride
    return ride;
};

// module.exports.confirmRide = async ({ rideId, captain }) => {
//     if (!rideId) {
//         throw new Error('Ride ID is required');
//     }

//     let ride = await rideModel.findOne({ _id: rideId });
//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     if (ride.status !== 'waiting') {
//         const queue = rideQueues.get(rideId.toString());
//         if (queue) queue.push(captain._id);
//         return ride;
//     }

//     await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'accepted', captain: captain._id });
//     return await rideModel.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');
// };









module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}


// module.exports.cancelRide = async ({ rideId, captain }) => {
//     if (!rideId) {
//         throw new Error('Ride ID is required');
//     }

//     const queue = rideQueues.get(rideId.toString());
//     if (queue && queue.length > 0) {
//         const nextCaptainId = queue.shift();
//         await rideModel.findOneAndUpdate({ _id: rideId }, { captain: nextCaptainId });
//     } else {
//         await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'waiting', captain: null });
//     }
// };











// module.exports.cancelRide = async ({ rideId, captain }) => {
//     if (!rideId) {
//         throw new Error('Ride ID is required');
//     }

//     let ride = await rideModel.findOne({ _id: rideId });
    
//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     if (ride.status === 'completed' || ride.status === 'cancelled') {
//         throw new Error('Cannot cancel a completed or already cancelled ride');
//     }

//     if (ride.captain && ride.captain.toString() === captain._id.toString()) {
//         const queue = rideQueues.get(rideId.toString());
//         if (queue && queue.length > 0) {
//             const nextCaptainId = queue.shift();
//             await rideModel.findOneAndUpdate({ _id: rideId }, { captain: nextCaptainId });
//         } else {
//             await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'waiting', captain: null });
//         }
//     } else {
//         await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'cancelled' });
//         rideQueues.delete(rideId.toString());
//     }
//     return ride;
// };

module.exports.startRide = async ({ rideId, otp, captain }) => {
 
    const ride = await rideModel.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');
 
    if (!ride) throw new Error('Ride not found');
    if (ride.status !== 'accepted') throw new Error('Ride not accepted');
    if (ride.otp !== otp) throw new Error('Invalid OTP');

    await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'ongoing' });
    return ride;
};

module.exports.endRide = async ({ rideId, captain }) => {
    const ride = await rideModel.findOne({ _id: rideId, captain: captain._id }).populate('user').populate('captain').select('+otp');
    if (!ride) throw new Error('Ride not found');
    if (ride.status !== 'ongoing') throw new Error('Ride not ongoing');

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
};



async function findLongestNavigablePathByVehicle(pairs, vehicleType) {
    if (!Array.isArray(pairs)) {
        throw new Error("Invalid input: 'pairs' should be an array.");
    }

    let graph = new Map();
    let inDegree = new Map();
    let startingPoints = new Set();

    for (let { pickup, destination, vehicleType: type } of pairs) {
        if (type !== vehicleType) continue; // Ignore different vehicle types

        if (!graph.has(pickup)) graph.set(pickup, []);
        graph.get(pickup).push(destination);

        inDegree.set(destination, (inDegree.get(destination) || 0) + 1);
        if (!inDegree.has(pickup)) inDegree.set(pickup, 0);
    }

    let longestPath = [];

    function dfs(node, path) {
        if (!graph.has(node)) {
            if (path.length > longestPath.length) longestPath = [...path];
            return;
        }
        for (let nextNode of graph.get(node)) {
            dfs(nextNode, [...path, nextNode]);
        }
    }

    for (let pickup of inDegree.keys()) {
        if (inDegree.get(pickup) === 0) dfs(pickup, [pickup]);
    }

    return longestPath;
}


module.exports.findLongestNavigablePathByVehicle = findLongestNavigablePathByVehicle;