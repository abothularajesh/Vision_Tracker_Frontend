import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    // baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});
//console.log("Base URL is:", import.meta.env.VITE_API_BASE_URL);

// Automatically attach JWT to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle unauthorized requests
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("email");
            localStorage.removeItem("loginStreak");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;