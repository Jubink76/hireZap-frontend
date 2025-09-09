import React, { useState } from 'react';
import { Mail, Lock, User, Github, Chrome, Linkedin, Eye, EyeOff } from "lucide-react";
import candidateBgimage from '../../assets/office-interview-image.png';
import recruiterBgimage from '../../assets/recruiter-bg-image.jpg';
import adminBgimage from '../../assets/admin-bg-image.png'
import appLogo from '../../assets/app-logo.png'
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate, Link} from 'react-router-dom'
import { notify } from '../../utils/toast';
import { loginUser, registerUser } from '../../redux/slices/authSlice';

const RegLog = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name : '',
        email : '',
        password : '',
        rememberMe : false
    })

    const [formErrors,setFormErrors] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {error, loading} = useSelector((state)=> state.auth)

    // Role-specific configurations
    const roleConfig = {
        candidate: {
            image: candidateBgimage,
            title: "Unlock Your Future with AI-Powered Interviews",
            subtitle: "Join a community of candidates transforming the hiring process with intelligent matching and seamless interview experiences.",
            features: ["AI-Powered Matching", "Smart Interviews", "Real-time Analytics"],
            gradient: "from-teal-600 to-teal-800",
            overlayGradient: "from-teal-700/80 to-teal-900/90"
        },
        recruiter: {
            image: recruiterBgimage,
            title: "Transform Your Hiring Process",
            subtitle: "Empower your recruitment with AI-driven candidate matching and streamlined interview workflows.",
            features: ["Candidate Screening", "Interview Scheduling", "Performance Analytics"],
            gradient: "from-blue-600 to-indigo-800",
            overlayGradient: "from-teal-700/80 to-teal-900/90"
        },
        admin: {
            image: adminBgimage,
            title: "Administrative Control Center",
            subtitle: "Manage users, monitor system performance, and configure platform settings with comprehensive admin tools.",
            features: ["User Management", "System Analytics", "Configuration Control"],
            gradient: "from-purple-600 to-violet-800",
            overlayGradient: "from-teal-700/80 to-teal-900/90"
        }
    };

    const currentConfig = role ? roleConfig[role] : roleConfig.candidate;

    const validateForm = () =>{
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!formData.name.trim()){
            errors.name = 'full name is required';
        }
        if(!formData.email || !emailRegex.test(formData.email)){
            errors.email = "valid email is required";
        }
        if(!formData.password){
            errors.password = "Password is required";
        }else if(!passwordRegex.test(formData.password)){
            errors.password = "Password must contain,letters,digits,special character and atleast 8 characters"
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(pre=> ({
            ...pre,
            [name]: type === 'checkbox' ? checked : value
        }));
    }
    const handleRoleToggle = (newRole) => {
        setRole(newRole);
        setIsLogin(true);
        setFormData({
            name: '',
            email: '',
            password: '',
            rememberMe: false
        });
        setFormErrors({})
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            notify.error("Please fix form errors");
            return;
        }

        try {
            if (isLogin) {
                const loginData = {
                    email: formData.email,
                    password: formData.password,
                    role: role,
                };

                const result = await dispatch(loginUser(loginData)).unwrap();
                console.log("logged in user:",result)
                notify.success("Login successful");
                switch (role) {
                    case "candidate":
                        navigate("/candidate_dashboard");
                        break;
                    case "recruiter":
                        navigate("/recruiter_dashboard");
                        break;
                    case "admin":
                        navigate("/admin_dashboard");
                        break;
                    default:
                        navigate("/dashboard");
                }
            } else {
            const registerData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role:role,
                rememberMe: false,
            };

            const resultAction = await dispatch(registerUser(registerData)).unwrap();
            notify.success(" Please check your email for OTP");

            // Redirect to OTP verification page
            navigate("/verify_otp", {
                state: {
                    email: formData.email, // pass email so OTP API knows which user
                    role: role,           // optional: for redirect after OTP
                    action_type:"registration",
                    },
                });
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            notify.error(err || "Something went wrong");
        }
    };

    const handleForgotPassword = ()=>{
        navigate("/forgot_password",{
            state :{
                role, action_type:"forgot_password"
            },
        })
    }
    const canRegister = role !== 'admin';
    const showRegistration = !isLogin && canRegister;

    return (
        <div className='h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 flex overflow-hidden'>
            {/* left side - image */}
            <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br ${currentConfig.gradient}`}>
                <div className='absolute inset-0'>
                    <img 
                        src={currentConfig.image}
                        alt='office interview'
                        className='w-full h-full object-cover opacity-80'
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentConfig.overlayGradient}`} />
                </div>

                <div className='relative z-10 flex flex-col justify-center px-8 xl:px-12 text-white'>
                    <h1 className='font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-tight mb-4 xl:mb-6'>
                        {currentConfig.title}
                    </h1>
                    <p className='text-base xl:text-xl text-teal-100 mb-6 xl:mb-8 leading-relaxed'>
                        {currentConfig.subtitle}
                    </p>
                    <div className='flex flex-raw gap-2 xl:gap-3 text-teal-200'>
                        {currentConfig.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-base xl:text-lg">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* right side - form */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-3 lg:p-4 bg-gray-50 overflow-y-auto'>
                <div className='w-full max-w-sm space-y-3 my-auto'>
                    {/* Mobile hero - condensed */}
                    <div className='lg:hidden text-center mb-3'>
                        <h1 className='font-serif text-xl font-bold text-teal-800 mb-1'>Your Career Journey Starts Here</h1>
                        <p className='text-slate-600 text-xs'>Transform your hiring process with AI-powered interviews</p>
                    </div>

                    <div className='shadow-lg border-0 bg-white rounded-lg p-4 lg:p-6'>
                        {!role && (
                            <div className="text-center mb-6">
                                <img 
                                    src={appLogo} 
                                    alt="HireZap Logo" 
                                    className="h-18 lg:h-36 mx-auto mb-3"
                                />
                                <h2 className="font-serif text-lg lg:text-xl text-teal-800 font-semibold mb-1">
                                    Welcome to HireZap
                                </h2>
                                <p className="text-slate-600 text-xs lg:text-sm">
                                    Choose your role to get started
                                </p>
                            </div>
                        )}
                        {/* Role Selection - Always visible */}
                        <div className="space-y-1 mb-4">
                            <label htmlFor="role" className="text-slate-700 font-medium text-xs block ">
                                Select Your Role
                            </label>
                            <div className="relative ">
                                <select
                                    value={role}
                                    onChange={(e) => handleRoleToggle(e.target.value)}
                                    className="h-8 lg:h-10 w-full rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 bg-white appearance-none text-xs lg:text-sm cursor-pointer">
                                    <option value="">Choose your role</option>
                                    <option value="candidate">Candidate</option>
                                    <option value="recruiter">Recruiter</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Show form only when role is selected */}
                        {role && (
                            <>
                                {/* card header */}
                                <div className='space-y-1 text-center mb-4'>
                                    <h2 className='font-serif text-lg lg:text-xl text-teal-800 font-semibold'>
                                        {isLogin ? "Welcome Back" : "Create Your Account"}
                                    </h2>
                                    <p className='text-slate-600 text-xs lg:text-sm'>
                                        {isLogin 
                                            ? `Please enter your ${role} credentials to access your dashboard`
                                            : `Join us as a ${role} to streamline your hiring process`}
                                    </p>
                                </div>

                                {/* card content */}

                                <form onSubmit={handleSubmit}>
                                    <div className='space-y-3 lg:space-y-4'>
                                        {/* Social buttons - only for non-admin */}
                                        {role !== 'admin' && (
                                            <>
                                                <div className='space-y-2'>
                                                    <button 
                                                        type='button'
                                                        className="w-full h-9 lg:h-10 text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors bg-white rounded-md flex items-center justify-center font-medium text-xs lg:text-sm cursor-pointer">
                                                        <Chrome className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                                                        Continue with Google
                                                    </button>
                                                    <button 
                                                        type='button'
                                                        className="w-full h-9 lg:h-10 text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors bg-white rounded-md flex items-center justify-center font-medium text-xs lg:text-sm cursor-pointer">
                                                        <Linkedin className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                                                        Continue with LinkedIn
                                                    </button>
                                                    <button
                                                        type='button' 
                                                        className="w-full h-9 lg:h-10 text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors bg-white rounded-md flex items-center justify-center font-medium text-xs lg:text-sm cursor-pointer">
                                                        <Github className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                                                        Continue with GitHub
                                                    </button>
                                                </div>

                                                {/* separator */}
                                                <div className='relative my-3'>
                                                    <div className='absolute inset-0 flex items-center'>
                                                        <div className='w-full border-t border-slate-200'/>
                                                    </div>
                                                    <div className='relative flex justify-center text-xs uppercase'>
                                                        <span className='bg-white px-2 text-slate-500 font-medium'>Or continue with email</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* form */}
                                        <div className='space-y-2 lg:space-y-3'>
                                            {/* Full Name - only for registration and non-admin */}
                                            {showRegistration && (
                                                <div className="space-y-1">
                                                    <label htmlFor="name" className="text-slate-700 font-medium text-xs block">
                                                        Full Name
                                                    </label>
                                                    <div className="relative">
                                                        <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3 lg:w-4 lg:h-4" />
                                                        <input
                                                            id="name"
                                                            name='name'
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            placeholder="Enter your full name"
                                                            className="pl-7 lg:pl-8 h-8 lg:h-10 w-full rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 text-xs lg:text-sm"
                                                            required
                                                        />
                                                    </div>
                                                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <label htmlFor="email" className="text-slate-700 font-medium text-xs block">
                                                    {role === 'admin' ? 'Admin Email' : 'Email Address'}
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3 lg:w-4 lg:h-4" />
                                                    <input
                                                        id="email"
                                                        name='email'
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder={role === 'admin' ? 'Enter admin email' : 'Enter your email'}
                                                        className="pl-7 lg:pl-8 h-8 lg:h-10 w-full rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 text-xs lg:text-sm"
                                                        required
                                                    />
                                                </div>
                                                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                                            </div>

                                            <div className="space-y-1">
                                                <label htmlFor="password" className="text-slate-700 font-medium text-xs block">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3 lg:w-4 lg:h-4" />
                                                    <input
                                                        id="password"
                                                        name='password'
                                                        type={showPassword?"text":"password"}
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Enter your password"
                                                        className="pl-7 lg:pl-8 h-8 lg:h-10 w-full rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 text-xs lg:text-sm"
                                                        required
                                                    />
                                                    <button
                                                        type='button'
                                                        onClick={()=>setShowPassword((pre)=>!pre)}
                                                        className='absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400'>
                                                            {showPassword?(<EyeOff className='w-3 h-3 lg:w-4 lg:h-4'/>):(<Eye className='w-3 h-3 lg:w-4 lg:h-4'/>)}
                                                        </button>
                                                </div>
                                                {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                                            </div>

                                            {isLogin && (
                                                <div className="flex items-center justify-between text-xs">
                                                    <label className="flex items-center space-x-2 text-slate-600">
                                                        <input 
                                                            type="checkbox" 
                                                            name='rememberMe'
                                                            checked = {formData.rememberMe}
                                                            onChange={handleChange}
                                                            className="rounded border-slate-300 w-3 h-3" />
                                                        <span>Remember me</span>
                                                    </label>
                                                    <button onClick={handleForgotPassword} type="button" className="text-teal-700 hover:text-teal-800 underline font-medium  cursor-pointer">
                                                        Forgot password?
                                                    </button>
                                                </div>
                                            )}

                                            {error && <p className="text-red-500 text-xs">{error}</p>}

                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="w-full h-8 lg:h-10 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors text-xs lg:text-sm  cursor-pointer">
                                                {loading 
                                                    ? (isLogin ? "Signing In..." : "Creating Account...") 
                                                    : (isLogin ? "Sign In" : "Create Account")}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Toggle between login/register - only for non-admin */}
                                {canRegister && (
                                    <div className="text-center text-xs text-slate-600 ">
                                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                                        <button
                                            type="button"
                                            className="text-teal-700 hover:text-teal-800 font-semibold underline  cursor-pointer"
                                            onClick={() => setIsLogin(!isLogin)}>
                                            {isLogin ? "Sign up" : "Sign in"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {role && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegLog;