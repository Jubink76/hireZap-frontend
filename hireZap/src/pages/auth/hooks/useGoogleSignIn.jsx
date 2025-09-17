import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../../redux/slices/authSlice";

const useGoogleSignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleGoogleResponse = async (response) => {
    const token = response.credential;
    try {
      await dispatch(googleLogin(token)).unwrap();
    } catch (err) {
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
