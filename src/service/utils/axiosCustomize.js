import axios from 'axios';

const baseURL = window._env_.REACT_APP_BASE_URL;
const instance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",

    },
});

instance.interceptors.request.use((config) => {
    let token = null
    const data = localStorage.getItem('user')
    
    if (data) {
        const user = JSON.parse(data)
        if (user) {
            token = user.token
        }
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default instance

