import React from 'react'
import { ArrowLeft, Shield, Clock } from "lucide-react";
import verifyOtpImg from '../../assets/verify-otp.png';
const VerifyOtp = () => {
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
                                        01:00
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
                                test@gmail.com
                            </p>
                        </div>

                        {/* OTP Input Fields */}
                        <div className='space-y-4'>
                            <div className='text-center'>
                                <label className='text-slate-700 font-medium text-sm block mb-3'>
                                    Enter Verification Code
                                </label>
                                <div className='flex gap-2 justify-center'>
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        maxLength={1}
                                        className='w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors'
                                        readOnly
                                    />
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        maxLength={1}
                                        className='w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors'
                                        readOnly
                                    />
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        maxLength={1}
                                        className='w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors'
                                        readOnly
                                    />
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        maxLength={1}
                                        className='w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors'
                                        readOnly
                                    />
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        maxLength={1}
                                        className='w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors'
                                        readOnly
                                    />
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        maxLength={1}
                                        className='w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors'
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Verify Button */}
                            <button className='w-full h-10 rounded-lg font-semibold bg-slate-200 text-slate-500 cursor-not-allowed transition-colors'>
                                Verify Code
                            </button>

                            {/* Resend Code */}
                            <div className='text-center text-sm'>
                                <span className='text-slate-600'>Didn't receive the code? </span>
                                <button className='text-teal-700 hover:text-teal-800 font-semibold underline'>
                                    Resend Code
                                </button>
                            </div>

                            {/* Change Email */}
                            <div className='text-center'>
                                <button className='inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm font-medium'>
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