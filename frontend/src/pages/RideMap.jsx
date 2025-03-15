// import React from "react";
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";



// const RideMap = () => {
//   return (
//     <MapContainer center={[12.95, 77.6]} zoom={12} style={{ height: "400px", width: "100%" }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
//       {/* Draw the path */}
//       <Polyline positions={locations.map(loc => loc.coords)} color="blue" weight={4} />

//       {/* Markers for each location */}
//       {locations.map((loc, index) => (
//         <Marker key={index} position={loc.coords}>
//           <Popup>{loc.name}</Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default RideMap;





// import React from "react";
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-ant-path";

// // const locations = [
// //   { name: "Pattanagere", coords: [12.9249, 77.5284] },
// //   { name: "Majestic", coords: [12.9784, 77.5753] },
// //   { name: "JP Nagar", coords: [12.9081, 77.5854] },
// //   { name: "Whitefield", coords: [12.9698, 77.7499] },
// // ];

// const RideMap = () => {
//   return (
//     <MapContainer center={[12.95, 77.6]} zoom={12} style={{ height: "400px", width: "100%" }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//       {/* Animated Path */}
//       <Polyline
//         positions={locations.map(loc => loc.coords)}
//         pathOptions={{ color: "blue", dashArray: "5, 10", weight: 4 }}
//       />

//       {/* Markers with Popups */}
//       {locations.map((loc, index) => (
//         <Marker key={index} position={loc.coords}>
//           <Popup>{loc.name}</Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default RideMap;
 



// import React, { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import "leaflet-routing-machine";

// const locations = [
//   { name: "Pattanagere", coords: [12.9249, 77.5284] },
//   { name: "Majestic", coords: [12.9784, 77.5753] },
//   { name: "JP Nagar", coords: [12.9081, 77.5854] },
//   { name: "Whitefield", coords: [12.9698, 77.7499] },
// ];

// const RoutingComponent = () => {
//   const map = useMap();

//   useEffect(() => {
//     if (!map) return;

//     const routingControl = L.Routing.control({
//       waypoints: locations.map((loc) => L.latLng(loc.coords)),
//       routeWhileDragging: true,
//       createMarker: (i, waypoint) => L.marker(waypoint.latLng).bindPopup(locations[i].name),
//     }).addTo(map);

//     return () => {
//       map.removeControl(routingControl);
//     };
//   }, [map]);

//   return null;
// };

// const RideMap = () => {
//   return (
//     <MapContainer center={[12.95, 77.6]} zoom={12} style={{ height: "900px", width: "100%" }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <RoutingComponent />

//       {/* Markers */}
//       {locations.map((loc, index) => (
//         <Marker key={index} position={loc.coords}>
//           <Popup>{loc.name}</Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default RideMap;


 
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-ant-path";

// Custom Icons
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3103/3103446.png",
  iconSize: [40, 40],
});

const getNumberedIcon = (number) =>
  new L.DivIcon({
    className: "custom-marker",
    html: `<div style="background-color:blue;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:bold;">${number}</div>`,
  });

// Route Data
const locations = [
  { name: "Pattanagere", coords: [12.9249, 77.5284] },
  { name: "Majestic", coords: [12.9784, 77.5753] },
  { name: "JP Nagar", coords: [12.9081, 77.5854]},
  { name: "Whitefield", coords: [12.9698, 77.7499] },
];

// Component to Draw Animated Route
const AnimatedRoute = ({ positions, setHoveredDirection }) => {
  const map = useMap();

  useEffect(() => {
    const antPath = L.polyline.antPath(positions, {
      delay: 400, // Speed of animation
      dashArray: [10, 20], // Dashed effect
      weight: 4,
      color: "red",
      pulseColor: "yellow",
    });

    antPath.on("mouseover", (e) => {
      const latlng = e.latlng;
      const closestPoint = positions.find((pos) => pos[0] === latlng.lat && pos[1] === latlng.lng);
      if (closestPoint) {
        const index = positions.indexOf(closestPoint);
        setHoveredDirection(locations[index]?.direction || "");
      }
    });

    antPath.on("mouseout", () => setHoveredDirection(""));

    map.addLayer(antPath);
    return () => {
      map.removeLayer(antPath);
    };
  }, [positions, map, setHoveredDirection]);

  return null;
};

const RideMap = () => {
  const [vehiclePos, setVehiclePos] = useState(locations[0].coords);
  const [index, setIndex] = useState(0);
  const [hoveredDirection, setHoveredDirection] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < locations.length - 1) {
        setIndex((prevIndex) => prevIndex + 1);
        setVehiclePos(locations[index + 1].coords);
      }
    }, 3000); // Move every 3 seconds

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div>
      <MapContainer center={[12.95, 77.6]} zoom={12} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Animated Route */}
        <AnimatedRoute positions={locations.map((loc) => loc.coords)} setHoveredDirection={setHoveredDirection} />

        {/* Numbered Markers */}
        {locations.map((loc, i) => (
          <Marker key={i} position={loc.coords} icon={getNumberedIcon(i + 1)}>
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}

        {/* Moving Vehicle */}
        <Marker position={vehiclePos} icon={carIcon}>
          <Popup>🚗 Moving Vehicle</Popup>
        </Marker>
      </MapContainer>

      {/* Display Directions on Hover */}
      {hoveredDirection && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          {hoveredDirection}
        </div>
      )}
    </div>
  );
};

export default RideMap;
