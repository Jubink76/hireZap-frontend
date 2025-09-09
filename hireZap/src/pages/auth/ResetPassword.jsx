import React from 'react'
import { Lock,Eye,EyeOff } from 'lucide-react';
import resetPasswordImg from '../../assets/reset-password.png'
import { useState } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../redux/slices/authSlice';
import { notify } from '../../utils/toast';
const ResetPassword = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email;

    const [password, setPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const passwordRegex =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSubmit = async(e) =>{
        e.preventDefault()
        if(!passwordRegex.test(password)){
            notify.error("Password must be at least 8 chars, contain a letter, number and special char");
            return
        }
        if(password !== confirm_password){
            notify.error("password do not match");
            return;
        }
        try{
            await dispatch(resetPassword({email, password})).unwrap();
            notify.success("Password reset successful, Please login")
            navigate("/")
        }catch(err){
            notify.error(err || "Could not reset password");
        }
    };

  return (
    <div className='h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 flex overflow-hidden'>
        <div  className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800'>
            <div className='absolute inset-0'>
                <img    
                    src={resetPasswordImg}
                    alt='forgot-password'
                    className='h-full w-full object-cover opacity-70'
                />
                <div className='absolute inset-0 bg-gradient-to-br from-teal-700/80 to-teal-900/90' />

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
        <div className='w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 bg-gray-50 overflow-y-auto'>
                <div className='w-full max-w-md space-y-4 lg:space-y-6 my-auto'>
                    {/* Mobile hero - condensed */}
                    <div className='lg:hidden text-center mb-4'>
                        <h1 className='font-serif text-2xl font-bold text-teal-800 mb-2'>Your Career Journey Starts Here</h1>
                        <p className='text-slate-600 text-sm'>Transform your hiring process with AI-powered interviews</p>
                    </div>

                    <div className='shadow-lg border-0 bg-white rounded-xl p-6 lg:p-8'>
                        {/* card header */}
                        <div className='space-y-1 text-center mb-6'>
                            <h2 className='font-serif text-xl lg:text-2xl text-teal-800 font-semibold'>
                                Reset Password!
                            </h2>
                            <p className='text-slate-600 text-sm'>
                                Please enter your new secret
                            </p>
                        </div>

                        {/* card content */}
                        <div className='space-y-4 lg:space-y-6'>

                            {/* form */}
                            <form onSubmit={handleSubmit} className='space-y-3 lg:space-y-4'>
                                <div className="space-y-1 lg:space-y-2">
                                    <label htmlFor="password" className="text-slate-700 font-medium text-sm block">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 lg:w-5 lg:h-5" />
                                        <input
                                            id="password"
                                            type={showPassword? "text":"password"}
                                            placeholder="Enter your new pasword"
                                            value={password}
                                            onChange={(e)=>setPassword(e.target.value)}
                                            className="pl-8 lg:pl-10 h-10 lg:h-12 w-full rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 text-sm lg:text-base"
                                        />

                                        <button
                                            type="button"
                                            onClick={()=> setShowPassword((pre)=>!pre)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" />
                                                ):(
                                                    <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                                                )}
                                            </button>
                                    </div>
                                    <label htmlFor="confirm_password" className="text-slate-700 font-medium text-sm block">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        {/* Left lock icon */}
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 lg:w-5 lg:h-5" />

                                        {/* Input field */}
                                        <input
                                            id="confirm_password"
                                            type={showConfirmPassword ? "text" : "password"}  // toggle type
                                            placeholder="Enter your password"
                                            value={confirm_password}
                                            onChange={(e)=>setConfirmPassword(e.target.value)}
                                            className="pl-8 lg:pl-10 pr-8 lg:pr-10 h-10 lg:h-12 w-full rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 text-sm lg:text-base"
                                        />

                                        {/* Eye icon button */}
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" />
                                            ) : (
                                            <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                                            )}
                                        </button>
                                    </div>

                                </div>
                                <button 
                                    type="submit"
                                    className="w-full h-10 lg:h-12 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors text-sm lg:text-base cursor-pointer">
                                    Submit
                                </button>
                                <div className="text-center text-xs text-slate-600">
                                    <button
                                        onClick={()=>navigate("/")}
                                        type="button"
                                        className="text-teal-700 hover:text-teal-800 font-semibold underline cursor-pointer">
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <p className="text-xs text-center text-slate-500 leading-relaxed">
                        By continuing, you agree to our{" "}
                        <button className="text-teal-700 hover:text-teal-800 underline font-medium">
                            Terms of Service
                        </button>{" "}
                        and{" "}
                        <button className="text-teal-700 hover:text-teal-800 underline font-medium">
                            Privacy Policy
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword