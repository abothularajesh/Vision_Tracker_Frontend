import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuth2Success() {

    const navigate = useNavigate();

    useEffect(() => {

        const params = new URLSearchParams(
            window.location.search
        );

        const token = params.get("token");
        const name = params.get("name");
        const role = params.get("role");

        console.log("Google OAuth Success");
        console.log("Token:", token);
        console.log("Name:", name);
        console.log("Role:", role);

        // Already logged in
        if (!token) {

            const existingToken =
                localStorage.getItem("jwtToken");

            if (existingToken) {
                navigate("/dashboard", { replace: true });
                return;
            }

            console.error("Google login failed: JWT not found");
            navigate("/", { replace: true });
            return;
        }

        const emailName=name?name.split("@")[0]:"";

        // Store Google authentication data
        localStorage.setItem(
            "jwtToken",
            token
        );
    

        localStorage.setItem(
            "username",
            emailName || ""
        );

        localStorage.setItem(
            "role",
            role || ""
        );

        console.log("Google authentication stored successfully");

        navigate("/dashboard", { replace: true });

    }, [navigate]);

    return (
        <div>
            <h2>Signing you in...</h2>
        </div>
    );
}

export default OAuth2Success;