import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { linkedinLogin } from "../../../redux/slices/authSlice";
import { notify } from "../../../utils/toast";

const LinkedinCallback = () => {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get("code");
    const role = params.get("state");
    if (!code) {
      notify.error("No code received from LinkedIn");
      return;
    }

    (async () => {
      try {
        await dispatch(linkedinLogin({ code, role })).unwrap();
        if (role === "candidate") navigate("/candidate/dashboard");
        else if (role === "recruiter") navigate("/recruiter/dashboard");
      } catch (err) {
        notify.error(err);
      }
    })();
  }, [params, dispatch, navigate]);

  return <div>Connecting with LinkedIn...</div>;
};

export default LinkedinCallback;
