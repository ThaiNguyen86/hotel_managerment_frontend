import React, { useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {signUp} from '../../service/apiServices';
import { useAuth } from '../../hook/useAuth';

const SignUp = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [cfpassword, setCfPassword] = useState('');
    const [showCfPassword, setShowCfPassword] = useState(false);

    const navigate = useNavigate();


    const handleSignUp = async (event) => {
        event.preventDefault();
    
        // Dữ liệu đầu vào
        const userData = {
            username,
            password,
            fullName,
            phone,
            address,
        };
    
        // Kiểm tra trước khi gửi
     
        if (password !== cfpassword) {
            toast.error('Password does not match confirm password!');
            return;
        }
        try {
            const result = await signUp(userData);
            if (result.data) {
                toast.success(result.data.message,{ autoClose: 2000 });
                setTimeout(() => {
                    navigate('/'); // Redirect to dashboard or another page after a delay
                  }, 1500);
            }
            else {
                toast.error(result.error.message,{ autoClose: 2000 });
            }
          
            
        } catch (error) {
            toast.error(error.message || 'Signup failed!');
        }
    };
    

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center font-dm-sans font-medium bg-gradient-to-r from-violet-300 to-pink-300 ">
            <ToastContainer />
            <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '650px' }}>
                <h3 className="text-center focus:outline-dashed focus:outline-2 focus:outline-violet-500 font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-pink-700 mb-3 font-bold">
                    Welcome to HotelAir
                </h3>
                <form onSubmit={handleSignUp}>
                    {/* Ô nhập Username */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700">Username <span style={{ color: 'red' }}>*</span></label>
                        <FormControl
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your username"
                            className="shadow-sm"
                        />
                    </div>

                    {/* Ô nhập Password */}
                    <div className="mb-3 flex justify-between gap-2">
                        <div className="w-50">
                            <label htmlFor="password" className="form-label text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700">Password <span style={{ color: 'red' }}>*</span></label>
                            <InputGroup>
                                <FormControl
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="shadow-sm "
                                  
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="border border-transparent outline-none hover:bg-gray-100 shadow-sm"
                                >
                                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} ${showPassword ? 'text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700' : 'text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700'}`}></i>
                                </Button>
                            </InputGroup>
                        </div>
                        <div className="w-50">
                            <label htmlFor="cfpassword" className="form-label text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700">Confirm Password <span style={{ color: 'red' }}>*</span></label>
                            <InputGroup>
                                <FormControl
                                    type={showCfPassword ? 'text' : 'password'}
                                    id="password"
                                    value={cfpassword}
                                    onChange={(e) => setCfPassword(e.target.value)}
                                    placeholder="Enter your password again"
                                    className="shadow-sm"
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowCfPassword((prev) => !prev)}
                                    className="border border-transparent outline-none hover:bg-gray-100 shadow-sm"
                                >
                                    <i className={`bi ${showCfPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} ${showCfPassword ? 'text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700' : 'text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700'}`}></i>
                                </Button>
                            </InputGroup>
                        </div>
                    </div>

                    <div className="mb-3 mt-3">
                        <label htmlFor="fullName" className="form-label text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700">Full Name <span style={{ color: 'red' }}>*</span></label>
                        <InputGroup>
                            <FormControl
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="shadow-sm"
                            />
                        </InputGroup>
                        {/* Checkbox Remember Me */}

                        {/* Checkbox Remember Me */}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700">Phone</label>
                        <InputGroup>
                            <FormControl
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your phone"
                                className="shadow-sm"
                            />
                        </InputGroup>
                        {/* Checkbox Remember Me */}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700">Address</label>
                        <InputGroup>
                            <FormControl
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your address"
                                className="shadow-sm"
                            />
                        </InputGroup>
                        {/* Checkbox Remember Me */}
                    </div>
                    {/* Nút SIGN UP */}
                    <button
                        type="submit"
                        className="w-100 py-2 text-white font-semibold bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-700 hover:to-pink-700 rounded-md mt-4"
                    >
                        SIGN UP
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-3 small">
                    <span>Do you already have an account? </span>
                    <a href="/" className="text-decoration-none text-transparent bg-clip-text bg-gradient-to-b from-violet-700 to-pink-700">
                        Login here
                    </a>
                </div>
                <div className="text-center text-muted small mt-3 ">
                    © 2024 <strong className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-pink-700">HotelAir</strong>. All Rights Reserved.
                </div>
            </div>
        </div>
    );
};
export default SignUp;