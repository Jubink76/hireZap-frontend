import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Save, X, CheckCircle2, Lock, Zap, Award, Users, Crown, Briefcase, Trash2, AlertCircle, RotateCcw} from 'lucide-react';
import AddSubscriptionPlanModal from '../../../modals/AddSubscriptionPlanModal';
import { clearPlanError, clearSuccessMessage, deletePlan, fetchAllPlans, fetchInactivePlans, reactivatePlan } from '../../../redux/slices/subscriptionPlanSlice';
import { useDispatch, useSelector } from 'react-redux';

const AdminSubscriptionManagement = () => {

  const dispatch = useDispatch()
  const {
    recruiterPlans,
    candidatePlans,
    inactivePlans,
    loading,
    error,
    successMessage
  } = useSelector((state)=>state.subscriptionPlan)

  const [selectedUserType, setSelectedUserType] = useState('candidate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [showInactive, setShowInactive] = useState(false);

  useEffect(()=>{
    console.log("fetching all plans")
    dispatch(fetchAllPlans());
  },[dispatch])

  useEffect(()=>{
    if(showInactive){
      dispatch(fetchInactivePlans(selectedUserType))
    }
  },[showInactive,selectedUserType,dispatch])

  useEffect(()=>{
    let timer;
    if(successMessage){
      timer = setTimeout(()=>{
        dispatch(clearSuccessMessage())
      },3000)
    }
    return ()=> clearTimeout(timer)
  },[successMessage, dispatch])

  useEffect(()=>{
    let timer;
    if(error){
      timer = setTimeout(()=>{
        dispatch(clearPlanError());
      },5000)
    }
    return ()=> clearTimeout(timer)
  }, [error, dispatch])

  const currentPlans = selectedUserType === 'candidate' ? candidatePlans : recruiterPlans;
  
  // Filter inactive plans by selected user type
  const currentInactivePlans = inactivePlans.filter(plan => plan.userType === selectedUserType);

  const iconMap = {
    Lock, CheckCircle2, Zap, Award, Users, Crown, Briefcase
  };

  const getCardColorClass = (color) => {
    const colorMap = {
      gray: 'bg-gray-50',
      cyan: 'bg-cyan-50',
      emerald: 'bg-emerald-50'
    };
    return colorMap[color] || 'bg-white';
  };

  const getBadgeColorClass = (badge, cardColor) => {
    if (!badge) return '';
    if (badge.includes('Most Popular') || cardColor === 'cyan') return 'bg-cyan-500';
    return 'bg-emerald-600';
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const handleDelete = (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      console.log("deleting plan..")
      dispatch(deletePlan(planId))
    }
  };

  const handleReactivate = (planId) => {
    if (window.confirm('Are you sure you want to reactivate this plan?')) {
      dispatch(reactivatePlan(planId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
  
          {/* LEFT SIDE */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Configure premium plans for candidates and recruiters
            </h3>

            <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex">
              <button
                onClick={() => setSelectedUserType('candidate')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedUserType === 'candidate'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Candidate Plans
              </button>

              <button
                onClick={() => setSelectedUserType('recruiter')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedUserType === 'recruiter'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Recruiter Plans
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showInactive 
                  ? 'bg-gray-100 border-gray-300 text-gray-700' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              {showInactive ? 'Hide' : 'Show'} Inactive Plans
              {currentInactivePlans.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                  {currentInactivePlans.length}
                </span>
              )}
            </button>

            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Plan
            </button>
          </div>

        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Active Plans Grid */}
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Plans</h2>
        <div className={`grid gap-6 ${currentPlans.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {currentPlans.map((plan) => {
            return (
              <div
                key={plan.id}
                className={`${getCardColorClass(plan.cardColor)} rounded-2xl p-6 border-2 ${
                  plan.isFree ? 'border-gray-300' : 'border-gray-200'
                } relative hover:shadow-lg transition-shadow`}
              >
                {/* Show "FREE" badge for free plans */}
                {plan.isFree && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                      FREE PLAN
                    </span>
                  </div>
                )}
                
                {plan.badge && !plan.isFree && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`${getBadgeColorClass(plan.badge, plan.cardColor)} text-white text-xs font-bold px-4 py-1 rounded-full`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Action Buttons - Only for non-default plans */}
                {!plan.isDefault && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit Plan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-600 text-sm">/ {plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className={`w-full ${plan.isDefault ? 'bg-gray-400' : 'bg-teal-600'} text-white font-semibold py-3 px-4 rounded-lg text-center`}>
                    {plan.buttonText}
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => {
                    const FeatureIcon = iconMap[feature.icon];
                    return (
                      <div key={idx} className="flex items-start">
                        <FeatureIcon className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                          feature.available ? 'text-gray-700' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm ${
                          feature.available ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {feature.text}
                          {feature.tag && (
                            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              {feature.tag}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inactive Plans Section */}
      {showInactive && (
        <div className="px-6 pb-8">
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Inactive Plans</h2>
              {currentInactivePlans.length > 0 && (
                <span className="text-sm text-gray-600">
                  {currentInactivePlans.length} inactive {currentInactivePlans.length === 1 ? 'plan' : 'plans'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : currentInactivePlans.length === 0 ? (
              <div className="text-center py-12 bg-gray-100 rounded-xl">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No inactive plans found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Deleted plans will appear here
                </p>
              </div>
            ) : (
              <div className={`grid gap-6 ${currentInactivePlans.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {currentInactivePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-gray-100 rounded-2xl p-6 border-2 border-gray-300 relative opacity-60 hover:opacity-80 transition-opacity"
                  >
                    {/* Inactive Badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                        INACTIVE
                      </span>
                    </div>

                    {/* Reactivate Button */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleReactivate(plan.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        title="Reactivate Plan"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reactivate
                      </button>
                    </div>

                    <div className="mb-6 mt-2">
                      <h3 className="text-xl font-bold text-gray-700 mb-2">{plan.name}</h3>
                      <div className="mb-2">
                        <span className="text-3xl font-bold text-gray-700">₹{plan.price}</span>
                        <span className="text-gray-500 text-sm">/ {plan.period}</span>
                      </div>
                      <p className="text-gray-500 text-sm">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                      <div className="w-full bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg text-center">
                        {plan.buttonText}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => {
                        const FeatureIcon = iconMap[feature.icon];
                        return (
                          <div key={idx} className="flex items-start">
                            <FeatureIcon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {feature.text}
                              {feature.tag && (
                                <span className="ml-2 text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full">
                                  {feature.tag}
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan Modal */}
      <AddSubscriptionPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingPlan={editingPlan}
        isCreating={isCreating}
        userType={selectedUserType}
      />
    </div>
  );
};

export default AdminSubscriptionManagement;