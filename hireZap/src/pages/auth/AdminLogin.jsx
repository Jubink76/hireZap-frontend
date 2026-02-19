import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff} from 'lucide-react'
import appLogo from '../../assets/app-logo.png'
import adminBgimage from '../../assets/admin-bg-image.png'
import { notify } from '../../utils/toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../redux/slices/authSlice'
const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false  
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const validateForm = () =>{
        const errors = {}
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!formData.email || !emailRegex.test(formData.email)){
            errors.email = "Valid email is Required"
        }
        if (!formData.password){
            errors.password = "Password required"
        }else if(!passwordRegex.test(formData.password)){
            errors.password = "Password must contain,letters,digits,special character and atleast 8 characters"
        }

        setFormErrors(errors)
        return errors
    }


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        const errors = validateForm()

        if(Object.keys(errors).length > 0){
            notify.error("Please fix form errors")
            return
        }
        const loginData = {
            email: formData.email,
            password : formData.password,
            remember_me : formData.rememberMe,
        }
        try{
            const user = await dispatch(loginUser(loginData)).unwrap();
            notify.success("Login successful")
            if(user.is_admin || user.role === 'admin' || user.staff){
                navigate("/admin/dashboard")
            }
        }catch(err){
            notify.error(err)
        }
    }

    const handleForgotPassword = ()=>{
        navigate("/forgot_password",{
            state :{
                role:"admin", action_type:"forgot_password"
            },
        })
    }

    return (
        <div className='h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 flex overflow-hidden'>
            {/* Left side */}
            <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-violet-600 to-violet-800'>
                <div className='absolute inset-0'>
                    <img 
                        src={adminBgimage}
                        alt='office interview'
                        className='w-full h-full object-cover opacity-80'
                    />
                    <div className='w-full h-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center'>
                        <div className='text-6xl text-white opacity-20'>🏢</div>
                    </div>
                    <div className='absolute inset-0 bg-gradient-to-br from-teal-700/80 to-teal-900/90'></div>
                </div>
                <div className='font-serif relative z-10 flex flex-col justify-center px-8 xl:px-12 text-white h-full'>
                    <h1 className=' text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-tight mb-4 xl:mb-6'>
                        Admin Control Panel
                    </h1>
                    <p className='text-base xl:text-xl text-teal-100 mb-6 xl:mb-8 leading-relaxed'>
                        Manage users, monitor system performance, and configure platform settings with comprehensive admin tools.
                    </p>
                    <div className='flex flex-raw gap-2 xl:gap-3 text-teal-200'>
                        <div className='flex items-center gap-3'>
                            <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse'/>
                            <span className='text-base xl:text-lg'>User management</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse'/>
                            <span className='text-base xl:text-lg'>System analytics</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse'/>
                            <span className='text-base xl:text-lg'>Configuration control</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - div */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-3 lg:p-4 bg-gray-50 overflow-y-auto'>
                <div className='w-full max-w-sm space-y-3 my-auto'>
                    <div className='shadow-lg border-0 bg-white rounded-lg p-4 lg:p-6'>
                        <div className='space-y-1 text-center mb-4'>
                            <img 
                                src={appLogo} 
                                alt="HireZap Logo" 
                                className="h-18 lg:h-36 mx-auto mb-3"
                            />
                            <p className='text-slate-600 text-xs lg:text-sm'>
                                Please enter your admin credentials to access your dashboard
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className='space-y-3 lg:space-y-4'>
                                <div className='space-y-2 lg:space-y-3'>
                                    <div className='space-y-1'>
                                        <label htmlFor='email' className='text-slate-700 font-medium text-xs block'>
                                            Email Address
                                        </label>
                                        <div className='relative'>
                                            <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3 lg:w-4 lg:h-4"/>
                                            <input
                                                id='email'
                                                name='email'
                                                type='email'
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder='Enter admin email'
                                                className='pl-7 lg:pl-8 h-8 lg:h-10 w-full rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 text-xs lg:text-sm'
                                                required
                                            />
                                        </div>
                                        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                                    </div>
                                    <div className='space-y-1'>
                                        <label htmlFor='password' className='text-slate-700 font-medium text-xs block'>
                                            Password
                                        </label>
                                        <div className='relative'>
                                            <Lock className='absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3 lg:w-4 lg:h-4'/>
                                            <input
                                                id="password"
                                                name='password'
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter your password"
                                                className="pl-7 lg:pl-8 h-8 lg:h-10 w-full rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 text-xs lg:text-sm"
                                                required
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowPassword(prev => !prev)}
                                                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600'>
                                                {showPassword ? 
                                                    <EyeOff className='w-3 h-3 lg:w-4 lg:h-4'/> : 
                                                    <Eye className='w-3 h-3 lg:w-4 lg:h-4'/>
                                                }
                                            </button>
                                        </div>
                                        {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <label className="flex items-center space-x-2 text-slate-600">
                                            <input 
                                                type="checkbox" 
                                                name='rememberMe'
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                className="rounded border-slate-300 w-3 h-3" 
                                            />
                                            <span>Remember me</span>
                                        </label>
                                        <button 
                                            onClick={handleForgotPassword} 
                                            type="button" 
                                            className="text-teal-700 hover:text-teal-800 underline font-medium cursor-pointer">
                                            Forgot password?
                                        </button>
                                    </div>
                                    <button 
                                        type='submit'
                                        className="w-full h-8 lg:h-10 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors text-xs lg:text-sm cursor-pointer">
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin