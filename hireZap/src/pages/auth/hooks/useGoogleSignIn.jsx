import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../../redux/slices/authSlice";
import { notify } from "../../../utils/toast";

const useGoogleSignIn = (role) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const handleGoogleResponse = async (response) => {
        const id_token = response.credential;
        try {
                await dispatch(googleLogin({ id_token, role })).unwrap();
            } catch (err) {
                notify.error(err)
                console.error(err, "Google login failed");
            }
        };

  // Redirect after user is set in Redux
    useEffect(() => {
        if (!user) return;
        if (user.role === "candidate") navigate("/candidate/dashboard");
        else if (user.role === "recruiter") navigate("/recruiter/dashboard");
        else navigate("/");
    }, [user, navigate]);

    return { handleGoogleResponse };
    };

export default useGoogleSignIn;
