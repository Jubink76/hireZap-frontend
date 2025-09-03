import React from 'react'
import { Mail } from 'lucide-react';
import forgotImage from '../../assets/forget-password.jpeg';
const ForgotPassword = () => {
  return (
    <div className='h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 flex overflow-hidden'>
        <div  className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800'>
            <div className='absolute inset-0'>
                <img    
                    src={forgotImage}
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
                                Forgot Password?
                            </h2>
                            <p className='text-slate-600 text-sm'>
                                Please enter your valid email ID
                            </p>
                        </div>

                        {/* card content */}
                        <div className='space-y-4 lg:space-y-6'>

                            {/* form */}
                            <div className='space-y-3 lg:space-y-4'>
                                <div className="space-y-1 lg:space-y-2">
                                    <label htmlFor="email" className="text-slate-700 font-medium text-sm block">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 lg:w-5 lg:h-5" />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="pl-8 lg:pl-10 h-10 lg:h-12 w-full rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 text-sm lg:text-base"
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full h-10 lg:h-12 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors text-sm lg:text-base">
                                    Submit
                                </button>
                                <div className="text-center text-xs text-slate-600">
                                    <button
                                        type="button"
                                        className="text-teal-700 hover:text-teal-800 font-semibold underline">
                                        Back to Login
                                    </button>
                                </div>
                            </div>
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

export default ForgotPassword