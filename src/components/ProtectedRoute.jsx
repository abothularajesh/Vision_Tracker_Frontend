import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

    const token = localStorage.getItem("jwtToken");

    //console.log("Protected Route: Checking for JWT token:", token);

    if (!token || token === "undefined" || token === "null") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;