import React from 'react';
import { Link } from 'react-router-dom';
// <<<<<<< HEAD

const Hotel = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hotel Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/bookings" // Đường dẫn đến BookingList
          className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
        >
          <h2 className="font-semibold">Booking List</h2>
          <p>Manage your bookings here</p>
        </Link>
        <Link
          to="/rooms" // Đường dẫn đến RoomList
          className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
        >
          <h2 className="font-semibold">Room List</h2>
          <p>View and manage your rooms</p>
        </Link>
        <Link
          to="/room-status" // Đường dẫn đến RoomStatus
          className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
        >
          <h2 className="font-semibold">Room Status</h2>
          <p>Check the status of rooms</p>
        </Link>
        <Link
          to="/room-checkout" // Đường dẫn đến RoomCheckout
          className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
        >
          <h2 className="font-semibold">Room Checkout</h2>
          <p>Process room checkouts</p>
        </Link>
        <Link
          to="/roomtypes" // Đường dẫn đến RoomType
          className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
        >
          <h2 className="font-semibold">Room Types</h2>
          <p>Manage room types available</p>
        </Link>
        <Link
          to="/customertypes" // Đường dẫn đến CustomerType
          className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
        >
          <h2 className="font-semibold">Customer Types</h2>
          <p>Manage customer types available</p>
        </Link>
        <Link
          to="/users" // Đường dẫn đến CustomerType
          className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
        >
          <h2 className="font-semibold">User Management</h2>
          <p>Manage user account</p>
        </Link>
      </div>
    </div>
  );
};

export default Hotel;
// =======

// const Hotel = () => {
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Hotel Management</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Link
//           to="/bookings" // Đường dẫn đến BookingList
//           className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
//         >
//           <h2 className="font-semibold">Booking List</h2>
//           <p>Manage your bookings here</p>
//         </Link>
//         <Link
//           to="/rooms" // Đường dẫn đến RoomList
//           className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
//         >
//           <h2 className="font-semibold">Room List</h2>
//           <p>View and manage your rooms</p>
//         </Link>
//         <Link
//           to="/room-status" // Đường dẫn đến RoomStatus
//           className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
//         >
//           <h2 className="font-semibold">Room Status</h2>
//           <p>Check the status of rooms</p>
//         </Link>
//         <Link
//           to="/room-checkout" // Đường dẫn đến RoomCheckout
//           className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
//         >
//           <h2 className="font-semibold">Room Checkout</h2>
//           <p>Process room checkouts</p>
//         </Link>
//         <Link
//           to="/roomtypes" // Đường dẫn đến RoomType
//           className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
//         >
//           <h2 className="font-semibold">Room Types</h2>
//           <p>Manage room types available</p>
//         </Link>
//         <Link
//           to="/customertypes" // Đường dẫn đến CustomerType
//           className="bg-white shadow-md rounded-lg p-6 hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
//         >
//           <h2 className="font-semibold">Customer Types</h2>
//           <p>Manage customer types available</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Hotel;
// >>>>>>> 86a83126c1f22df9b1930512a525127ecaf35ea3
