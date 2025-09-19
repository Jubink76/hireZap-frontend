import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { githubLogin } from "../../redux/slices/authSlice";
import { notify } from "../../utils/toast";

export default function GithubCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    const code = searchParams.get("code");
    const role = searchParams.get("state");

    if (!code || !role) {
      notify.error("Missing GitHub code or role");
      return;
    }

    const doLogin = async () => {
      try {
        const result = await dispatch(githubLogin({ code, role })).unwrap();
        if (!cancelled) {
          if (role === "candidate") navigate("/candidate/dashboard");
          else if (role === "recruiter") navigate("/recruiter/dashboard");
          else navigate("/");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("GitHub login failed", err);
          notify.error(err?.message || "GitHub login failed");
          navigate('/')
        }
      }
    };

    doLogin();

    return () => { cancelled = true; };
  }, [dispatch, navigate, searchParams]);

  return <p>Signing you in with GitHub…</p>;
}
