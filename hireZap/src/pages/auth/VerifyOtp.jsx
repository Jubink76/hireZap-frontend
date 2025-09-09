import React, { useEffect, useState } from 'react'
import { ArrowLeft, Shield, Clock } from "lucide-react";
import verifyOtpImg from '../../assets/verify-otp.png';
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { notify } from '../../utils/toast';
import { completeRegistration, resendOtp, verifyOtp } from '../../redux/slices/authSlice';

const VerifyOtp = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const {user, loading} = useSelector((state)=>state.auth)
    const [code,setCode] = useState(new Array(6).fill(""))
    const [second, setSecond] = useState(() => {
        const expiry = localStorage.getItem("otpExpiryTime");
        if (expiry) {
            const remaining = Math.floor((expiry - new Date().getTime()) / 1000);
            return remaining > 0 ? remaining : 0;
        }
        return 60;
    });

    const {email, role, action_type} = location.state || {};

    // countdown timer for otp
    useEffect(()=>{
        if (!second){
            notify.error("OTP expired, Please resend the OTP")
            return;
        }
        const timer = setInterval(()=>setSecond((s)=>s-1),1000)
        return ()=>clearInterval(timer)
    },[second])

    // timer fomat
    const formatTime = ()=>{
        const m = String(Math.floor(second / 60)).padStart(2,'0')
        const s = String(second % 60).padStart(2,'0')
        return `${m}:${s}`
    };

    // otp input
    const handleChange = (val,idx)=>{
        const newCode = [...code];
        if (/^\d?$/.test(val)){
            const newCode = [...code];
            newCode[idx] = val;
            setCode(newCode);

            if (val && idx < 5){
                document.getElementById(`otp-${idx+1}`).focus();
            }else if(!val && idx > 0){
                document.getElementById(`otp-${idx-1}`).focus();
            }
        }
    }

    // verify code
    const handleVerify = async()=>{
        const otp = code.join("")

        if (otp.length !== 6 ){
            notify.error("please enter full code");
            return 
        }
        try{
            if (action_type === "registration"){
                try {
                    const userData = await dispatch(completeRegistration({ email, role, code: otp, action_type })).unwrap();
                    // success path (no need to check meta)
                    if (role === "recruiter") {
                        navigate("/recruiter_dashboard");
                    } else {
                        navigate("/candidate_dashboard");
                    }
                } catch (err) {
                    console.error("OTP verification failed", err);
                    notify.error(err);
                }
            }else if(action_type === "forgot_password"){
                try{
                    const res = await dispatch(verifyOtp({email, code:otp, action_type})).unwrap()
                    console.log(res)
                    navigate("/reset_password",{
                        state:{email,role}
                    })
                }catch(err){
                    console.error("OTP verification failed", err);
                    notify.error(err);
                }
            }
        }catch(err){
            console.error("Otp verification error",err)
        }
    }
    // handle resend otp
    const handleResendOtp = async () => {
        if (!email || !action_type) {
            notify.error("Missing email or action type");
            return;
        }

        try {
            const res = await dispatch(resendOtp({ email, action_type })).unwrap();
            notify.success(res?.message || "OTP resent successfully");

            const otpExpiryTime = new Date().getTime() + 60 * 1000; // 60 seconds
            localStorage.setItem("otpExpiryTime", otpExpiryTime);
            setSecond(60);
            setCode(new Array(6).fill(""));
        } catch (err) {
            console.error("Unexpected error", err);
            notify.error(err || "Failed to resend OTP");
        }
    };

  return (
    <div className='h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 flex overflow-hidden'>
        <div  className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800'>
            <div className='absolute inset-0'>
                <img    
                    src={verifyOtpImg}
                    alt='forgot-password'
                    className='h-full w-full object-cover opacity-80'
                />
                <div className='absolute inset-0 bg-gradient-to-br from-teal-700/60 to-teal-900/80' />

            </div>
            <div className='relative z-10 flex flex-col justify-center px-8 xl:px-12 text-white'>
                <h1 className='font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-tight mb-4 xl:mb-6'>
                    Unlock Your Future With AI Powered Interviews
                </h1>
                <div className='flex flex-raw gap-2 xl:gap-3 text-teal-200'>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-base xl:text-lg">AI-Powered Matching</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-base xl:text-lg">Smart Interviews</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-base xl:text-lg">Real-time Analytics</span>
                    </div>
                </div>
            </div>
        </div>
        <div className='w-full lg:w-1/2 flex items-center justify-center p-3 lg:p-4 bg-gray-50 overflow-y-auto'>
                <div className='w-full max-w-sm space-y-6 my-auto'>
                    
                    <div className='shadow-lg border-0 bg-white rounded-lg p-6'>
                        {/* Header */}
                        <div className='text-center mb-6'>
                            <div className='inline-flex flex-col items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4'>
                                <Clock className='w-6 h-6 text-teal-600 mb-1' />
                                <div className='flex items-center gap-1'>   
                                    <span className='text-xs font-medium text-teal-600'>
                                        {formatTime()}
                                    </span>
                                </div>
                            </div>
                            <h2 className='font-serif text-xl text-teal-800 font-semibold mb-2'>
                                Verify Your Email!
                            </h2>
                            <p className='text-slate-600 text-sm mb-1'>
                                We've sent a 6-digit verification code to
                            </p>
                            <p className='text-teal-700 font-medium text-sm'>
                                {email}
                            </p>
                        </div>

                        {/* OTP Input Fields */}
                        <div className='space-y-4'>
                            <div className='text-center'>
                                <label className='text-slate-700 font-medium text-sm block mb-3'>
                                    Enter Verification Code
                                </label>
                                <div className='flex gap-2 justify-center'>
                                    {code.map((c,idx)=>(
                                        <input 
                                        key={idx}
                                        id={`otp-${idx}`} 
                                        type='text'
                                        inputMode='numeric'  
                                        maxLength={1} 
                                        value={c}
                                        onChange={(e)=>handleChange(e.target.value,idx)}
                                        className='w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors '
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Verify Button */}
                            <button
                                onClick={handleVerify}
                                disabled={loading || second === 0}
                                className={`w-full h-10 rounded-lg font-semibold cursor-pointer ${loading ? 'bg-slate-200' : 'bg-teal-800 text-white'}`}>
                                {loading ? "Verifying..." : "Verify Code"}
                                </button>

                            {/* Resend Code */}
                            <div 
                                onClick={handleResendOtp}
                                className='text-center text-sm'>
                                <span className='text-slate-600'>Didn't receive the code? </span>
                                <button className='text-teal-700 hover:text-teal-800 font-semibold underline cursor-pointer'>
                                    Resend Code
                                </button>
                            </div>

                            {/* Change Email */}
                            <div className='text-center'>
                                <button 
                                    onClick={()=>navigate("/login")}
                                    className='inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm font-medium cursor-pointer'>
                                    <ArrowLeft className='w-4 h-4' />
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security Note */}
                    <p className="text-xs text-center text-slate-500 leading-relaxed">
                        For your security, this code will expire in 01:00. 
                        <br />
                        Never share this code with anyone.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp