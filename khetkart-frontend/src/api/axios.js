import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5000",
});

// Automatically attach JWT token to every request if logged in
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("khetkart_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default instance;