import React, { useEffect, useState } from 'react'

const LoadingSpinner = ({isLoading = true, message="Loading...", minDuration=2000}) => {
    const [showSpinner, setShowSpinner] = useState(false)

    useEffect(()=>{
        let timeout;
        if(isLoading){
            setShowSpinner(true)
        }else{
            timeout = setTimeout(()=>setShowSpinner(false),minDuration)
        }
        return () => clearTimeout(timeout)
    },[isLoading, minDuration])
    
    if (!showSpinner) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/40 via-teal-900/20 to-slate-900/40 backdrop-blur-md z-50">
            <div className="relative">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-teal-700/30 rounded-3xl blur-2xl animate-pulse"></div>
                
                {/* Main card */}
                <div className="relative bg-white rounded-3xl shadow-2xl border border-teal-100 p-10 max-w-sm mx-4">
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-700/10 to-transparent rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-700/10 to-transparent rounded-tr-full"></div>
                    
                    {/* Spinner container */}
                    <div className="relative w-20 h-20 mx-auto">
                        {/* Outer rotating ring with gradient */}
                        <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-tr from-teal-700 via-teal-500 to-teal-300 animate-spin" style={{
                            maskImage: 'linear-gradient(to bottom, transparent 50%, black 50%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 50%, black 50%)'
                        }}></div>
                        
                        {/* Second layer - counter rotation */}
                        <div className="absolute inset-1 rounded-full border-4 border-transparent bg-gradient-to-bl from-teal-600 via-teal-400 to-teal-200" style={{
                            animation: 'spin 1.5s linear infinite reverse',
                            maskImage: 'linear-gradient(to top, transparent 50%, black 50%)',
                            WebkitMaskImage: 'linear-gradient(to top, transparent 50%, black 50%)'
                        }}></div>
                        
                        {/* Center circle with pulse */}
                        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-teal-700 to-teal-500 animate-pulse shadow-lg shadow-teal-700/50"></div>
                        
                        {/* Inner white circle */}
                        <div className="absolute inset-5 rounded-full bg-white"></div>
                        
                        {/* Center dot */}
                        <div className="absolute inset-7 rounded-full bg-gradient-to-br from-teal-700 to-teal-600 animate-pulse"></div>
                        
                        {/* Orbiting dots */}
                        <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s'}}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-teal-700 rounded-full shadow-lg shadow-teal-700/50"></div>
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s', animationDelay: '1s'}}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-teal-600 rounded-full shadow-lg shadow-teal-600/50"></div>
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s', animationDelay: '2s'}}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-teal-500 rounded-full shadow-lg shadow-teal-500/50"></div>
                        </div>
                    </div>
                    
                    {/* Message with animation */}
                    <div className="mt-8 text-center space-y-2">
                        <p className="text-teal-900 font-semibold text-lg tracking-wide">{message}</p>
                        <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-teal-700 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-6 w-full h-1 bg-teal-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-700 via-teal-500 to-teal-700 animate-pulse" style={{
                            animation: 'shimmer 2s ease-in-out infinite',
                            backgroundSize: '200% 100%'
                        }}></div>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner