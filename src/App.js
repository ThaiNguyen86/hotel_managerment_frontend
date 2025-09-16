// <<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import DashBoard from "./page/dashboard/DashBoard";
import AppLayout from "./ui/AppLayout";
import { NavBarItemProvider } from "./context/NavBarItemContext";
import Hotel from "./page/hotel/Hotel";
import Transaction from "./page/transaction/Transaction";
import RoomList from "./page/roomBook/RoomList";
import BookingList from "./page/roomBook/BookingList";
import RoomCheckout from "./page/roomBook/RoomCheckout";
import RoomStatus from "./page/roomBook/RoomStatus";
import RoomType from "./page/roomSetting/RoomType";
import CustomerType from "./page/roomSetting/CustomerType";
import LogIn from "./page/auth/logIn";
import SignUp from "./page/auth/SignUp";
import User from "./page/user/UserManagement";
import RoomBookingForm from "./ui/BookingForm";
import { AuthProvider } from "./hook/useAuth";

// import SignUp from './page/auth/SignUp';
// import ForgotPass from './page/auth/ForgotPass';

function App() {
  // =======
  // import { BrowserRouter, Routes, Route } from 'react-router-dom';
  // import React from 'react';
  // import DashBoard from './page/Dashboard/DashBoard';
  // import AppLayout from './ui/AppLayout';
  // import { NavBarItemProvider } from './context/NavBarItemContext';
  // import Hotel from './page/hotel/Hotel';
  // import Transaction from './page/transaction/Transaction';
  // import RoomList from './page/roomBook/RoomList';
  // import BookingList from './page/roomBook/BookingList';
  // import RoomCheckout from './page/roomBook/RoomCheckout';
  // import RoomStatus from './page/roomBook/RoomStatus';
  // import RoomType from './page/roomSetting/RoomType';
  // import CustomerType from './page/roomSetting/CustomerType';
  // // Import thêm RoomBookingForm
  // import RoomBookingForm from './page/roomBook/RoomBookingForm';

  // const useViewport = () => {
  //   const [width, setWidth] = React.useState(window.innerWidth);

  //   React.useEffect(() => {
  //     const handleWindowResize = () => setWidth(window.innerWidth);
  //     window.addEventListener('resize', handleWindowResize);
  //     return () => window.removeEventListener('resize', handleWindowResize);
  //   }, []);

  //   return { width };
  // };

  // function App() {
  //   const viewPort = useViewport();
  //   const isMobile = viewPort.width <= 1024;

  //   if (isMobile) {
  //     return (
  //       <>
  //         <NavBarItemProvider>
  //           <BrowserRouter>
  //             <Routes>
  //               <Route path="/" element={<AppLayout />}>
  //                 <Route index element={<DashBoard />} />
  //                 <Route path="/hotels" element={<Hotel />} />
  //                 <Route path="/transactions" element={<Transaction />} />
  //                 <Route path="/rooms" element={<RoomList />} />
  //                 <Route path="/bookings" element={<BookingList />} />
  //                 <Route path="/room-checkout" element={<RoomCheckout />} />
  //                 <Route path="/room-status" element={<RoomStatus />} />
  //                 <Route path="/roomtypes" element={<RoomType />} />
  //                 <Route path="/customertypes" element={<CustomerType />} />
  //                 {/* Thêm tuyến đường cho RoomBookingForm */}
  //                 <Route path="/room-book" element={<RoomBookingForm />} />
  //               </Route>
  //             </Routes>
  //           </BrowserRouter>
  //         </NavBarItemProvider>
  //       </>
  //     );
  //   }

  // >>>>>>> 86a83126c1f22df9b1930512a525127ecaf35ea3
  return (
    <AuthProvider>
      <BrowserRouter>

        <NavBarItemProvider>
          <Routes>
            {/* Trang login không có NavBar */}
            <Route path="/" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            {/* <Route path="/forgot-password" element={<ForgotPass/>} />
          <Route path="/signup" element={<SignUp />} /> */}

            {/* Các route có AppLayout và NavBar */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/hotels" element={<Hotel />} />
              <Route path="/transactions" element={<Transaction />} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/bookings" element={<BookingList />} />
              <Route path="/room-book" element={<RoomBookingForm />} />
              <Route path="/room-checkout" element={<RoomCheckout />} />
              <Route path="/room-status" element={<RoomStatus />} />
              <Route path="/roomtypes" element={<RoomType />} />
              <Route path="/customertypes" element={<CustomerType />} />
              <Route path="/users" element={<User/>} />
             
            </Route>
          </Routes>
        </NavBarItemProvider>
      </BrowserRouter>
    </AuthProvider>
    // =======
    //           <Routes>
    //             <Route path="/" element={<AppLayout />}>
    //               <Route index element={<DashBoard />} />
    //               <Route path="/hotels" element={<Hotel />} />
    //               <Route path="/transactions" element={<Transaction />} />
    //               <Route path="/rooms" element={<RoomList />} />
    //               <Route path="/bookings" element={<BookingList />} />
    //               <Route path="/room-checkout" element={<RoomCheckout />} />
    //               <Route path="/room-status" element={<RoomStatus />} />
    //               <Route path="/roomtypes" element={<RoomType />} />
    //               <Route path="/customertypes" element={<CustomerType />} />
    //               {/* Thêm tuyến đường cho RoomBookingForm */}
    //               <Route path="/room-book" element={<RoomBookingForm />} />
    //             </Route>
    //           </Routes>
    //         </BrowserRouter>
    //       </NavBarItemProvider>
    //     </>
    // >>>>>>> 86a83126c1f22df9b1930512a525127ecaf35ea3
  );
}

export default App;