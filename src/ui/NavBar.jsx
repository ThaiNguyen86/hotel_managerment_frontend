import NavBarItem from '../feature/NavBar/NavBarItem';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hook/useAuth';


const NavBar = ({ isOpen }) => {
    const navigate = useNavigate();
    const {user } = useAuth();
    const [navState, setNavState] = useState([
        {
            title: 'Dashboard',
            icon: '/home.svg',
            redirect: '/dashboard',
            subItems: [],
        },
        {
            title: 'Hotel',
            icon: '/hotel.svg',
            redirect: '/hotels',
            subItems: []
        },
        {
            title: 'Transaction',
            icon: '/transaction.svg',
            redirect: '/transactions',
            subItems: []
        },
        {
            title: 'Room',
            icon: '/room.svg',
            subItems: [
                {
                    id: 1,
                    title: 'Room List',
                    ref: '/rooms'
                },
                {
                    id: 2,
                    title: 'Booking List',
                    ref: '/bookings'
                },
                {
                    id: 3,
                    title: 'Room Checkout',
                    ref: '/room-checkout'
                },
                {
                    id: 4,
                    title: 'Room Status',
                    ref: '/room-status'
                }
            ]
        },
        {
            title: 'Settings',
            icon: '/room-setting.svg',
            subItems: [
                {
                    id: 1,
                    title: 'Room Type',
                    ref: '/roomtypes'
                },
                {
                    id: 2,
                    title: 'Customer Type',
                    ref: '/customertypes'
                }
            ]
        },
        {
            title: 'Users',
            icon: '/user.svg',
            redirect: '/users',
            subItems: []
        }  

    ]);

    const [selectedItem, setSelectedItem] = useState(null);

    const handleClick = (index) => {
        if (selectedItem === index) return setSelectedItem(null);
        
        setSelectedItem(index);
        if ('redirect' in navState[index]) {
            navigate(navState[index].redirect ? navState[index].redirect : '/');
        }
    };

    return (
        <div
            className={`pl-4 pt-4 pr-4 fixed h-screen ${isOpen ? 'translate-x-0 w-70' : '-translate-x-full w-16'} 
                transition-transform duration-300 ease-in-out z-50`}
        >
            <div className="flex flex-col justify-center">
                <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16">
                        <img
                            className="rounded-full"
                            src="https://hotelair-react.pixelwibes.in/static/media/profile_av.387360c31abf06d6cc50.png"
                            alt="avatar"
                        />
                    </div>
                    {isOpen && (
                        <div className="flex flex-col">
                            <div className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-pink-800">
                            {user && user.userInfo ? user.userInfo.fullName : 'Guest'}
                            </div>
                            
                            <span className="text-base text-gray-500"> {user && user.userInfo ? user.userInfo.username : 'Guest'}</span>
                        </div>
                    )}
                </div>
                <hr className="border-t-2 border-gray-300 my-4" />

                <div className="flex flex-col gap-1">
                    {navState?.map((item, index) => {
                        return (
                            <div key={index} onClick={() => handleClick(index)}>
                                <NavBarItem
                                    isOpen={isOpen && selectedItem === index}
                                    title={navState[index].title}
                                    imgSrc={navState[index].icon}
                                    subItems={navState[index].subItems}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NavBar;