import React from 'react'
import { useDispatch } from 'react-redux';
import { ChevronRight, LogOut } from 'lucide-react';
import { notify } from '../../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../redux/slices/authSlice';

const AccountSettings = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = async()=>{
        try{
          await dispatch(logoutUser()).unwrap();
          notify.success("Logout successful")
          navigate('/login')
        }catch(err){
          notify.error(err)
        }
      }

    return (
            <div className="rounded-lg shadow-lg border border-slate-200 bg-white/80 backdrop-blur-sm">
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900">Personal Information</h4>
                                <p className="text-sm text-slate-600">Update your profile details</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900">Professional Information</h4>
                                <p className="text-sm text-slate-600">
                                    Manage your career details and experience
                                </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900">Notification Preferences</h4>
                                <p className="text-sm text-slate-600">Control your job alert notifications</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900">Privacy & Security</h4>
                                <p className="text-sm text-slate-600">Manage your account security settings</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900">Premium Subscription</h4>
                                <p className="text-sm text-slate-600">Manage your premium plan benefits</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
                        </div>

                        <div className="h-px bg-slate-200 my-6"></div>

                        <button 
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 w-full text-red-600 border border-red-200 hover:bg-red-50 bg-transparent transition-colors cursor-pointer">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
    )
}

export default AccountSettings