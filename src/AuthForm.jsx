import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import api from "./src/api/api.js";

function AuthForm() {

    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Show / Hide Password
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            if (isRegister) {
                await handleRegister();
            } else {
                await handleLogin();
            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Something went wrong. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {

        try {

            await api.post(
                "/auth/register",
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }
            );

            setMessage("Registration successful!");

            setFormData({
                username: "",
                email: "",
                password: ""
            });

            setShowPassword(false);

            // Switch back to login after registration
            setTimeout(() => {

                setIsRegister(false);
                setMessage("");

            }, 1500);

        } catch (error) {

            console.error("Registration error:", error);

            throw new Error(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    const handleLogin = async () => {

        try {

            const response = await api.post(
                "/auth/login",
                {
                    username: formData.username,
                    password: formData.password
                }
            );

            const data = response.data;

            // --------------------------------
            // Store authentication data
            // --------------------------------

            localStorage.setItem(
                "jwtToken",
                data.token
            );

            localStorage.setItem(
                "username",
                data.name || data.username
            );

            localStorage.setItem(
                "email",
                data.email || ""
            );

            if (data.role) {

                localStorage.setItem(
                    "role",
                    data.role
                );

            }

            if (
                data.loginStreak !== undefined &&
                data.loginStreak !== null
            ) {

                localStorage.setItem(
                    "loginStreak",
                    data.loginStreak
                );

            } else {

                console.warn(
                    "loginStreak was not returned by backend"
                );

            }

            // --------------------------------
            // Navigate to Dashboard
            // --------------------------------

            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

            throw new Error(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Invalid username or password"
            );
        }
    };

    const handleGoogleLogin = () => {

        localStorage.setItem(
            "email",
            formData.username
        );

        const API_BASE_URL =
            import.meta.env.VITE_API_BASE_URL;

        window.location.href =
            `${API_BASE_URL}/oauth2/authorization/google`;
    };

    const logout = () => {

        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("email");

        navigate("/login");
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Logo / Heading */}
                <div className="auth-header">

                    <div className="logo-circle">
                        VT
                    </div>

                    <h1>
                        Welcome to Vision Tracker
                    </h1>

                    <p>
                        {isRegister
                            ? "Create your account and start tracking your vision."
                            : "Welcome back. Let's continue your journey."}
                    </p>

                </div>

                {/* Success Message */}
                {message && (
                    <div className="success-message">
                        ✓ {message}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        ✕ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Username */}
                    <div className="input-group">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Email - Registration only */}
                    {isRegister && (
                        <div className="input-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>
                    )}

                    {/* Password */}
                    <div className="input-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className={`password-toggle ${
                                    showPassword
                                        ? "is-crossed"
                                        : ""
                                }`}
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 512 512"
                                    fill="currentColor"
                                >

                                    <path d="M256 128C132 128 29.4 208 0 256c29.4 48 132.4 128 256 128s226.6-80 256-128c-29.6-48-132.6-128-256-128zm0 224c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96zm0-144c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z" />

                                    <line
                                        className="eye-slash"
                                        x1="90"
                                        y1="256"
                                        x2="422"
                                        y2="256"
                                        stroke="currentColor"
                                        strokeWidth="36"
                                        strokeLinecap="round"
                                    />

                                </svg>

                            </button>

                        </div>

                    </div>

                    {/* Main Button */}
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isRegister
                                ? "Register"
                                : "Login"}
                    </button>

                </form>

                {/* Switch Login/Register */}
                <div className="switch-auth">

                    {isRegister
                        ? "Already have an account?"
                        : "Don't have an account?"}

                    <button
                        type="button"
                        onClick={() => {

                            setIsRegister(!isRegister);
                            setMessage("");
                            setError("");
                            setShowPassword(false);

                        }}
                    >
                        {isRegister
                            ? "Login"
                            : "Register"}
                    </button>

                </div>

                {/* Divider */}
                <div className="divider">
                    <span>OR</span>
                </div>

                {/* Google */}
                <button
                    type="button"
                    className="google-button"
                    onClick={handleGoogleLogin}
                >

                    <span className="google-icon">
                        G
                    </span>

                    Continue with Google

                </button>

                <p className="footer-text">
                    Secure authentication for your Vision Tracker account.
                </p>

            </div>

        </div>
    );
}

export default AuthForm;