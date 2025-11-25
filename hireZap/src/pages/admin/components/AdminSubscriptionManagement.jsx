
import React, { useState } from 'react';
import { Plus, Edit2, Save, X, CheckCircle2, Lock, Zap, Award, Users, Crown, Briefcase, Trash2 } from 'lucide-react';
import AddSubscriptionPlanModal from '../../../modals/AddSubscriptionPlanModal';

const AdminSubscriptionManagement = () => {
  const [selectedUserType, setSelectedUserType] = useState('candidate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Initial data structure for candidate plans
  const [candidatePlans, setCandidatePlans] = useState([
    {
      id: 'free',
      name: 'Free',
      price: '0',
      period: 'month',
      description: 'Get started with basic features',
      features: [
        { icon: 'Lock', text: 'Browse unlimited job listings', available: true },
        { icon: 'CheckCircle2', text: 'Apply to jobs', available: true },
        { icon: 'CheckCircle2', text: 'Basic profile creation', available: true },
        { icon: 'CheckCircle2', text: '5 free AI generations', available: true },
        { icon: 'CheckCircle2', text: 'Limited resume edits', available: true }
      ],
      buttonText: 'Current plan',
      cardColor: 'gray',
      badge: null,
      isDefault: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '1499',
      period: '3 months',
      description: 'Accelerate your career growth',
      features: [
        { icon: 'Award', text: 'Unlimited mock interviews', available: true },
        { icon: 'Zap', text: 'Unlimited AI generations', available: true },
        { icon: 'CheckCircle2', text: 'Unlimited AI resume edits', available: true },
        { icon: 'CheckCircle2', text: 'ATS resume optimization', available: true },
        { icon: 'CheckCircle2', text: 'Advanced skill assessments', available: true },
        { icon: 'CheckCircle2', text: 'Priority application status', available: true },
        { icon: 'CheckCircle2', text: 'Cancel anytime', available: true }
      ],
      buttonText: 'Start 3-day free trial',
      cardColor: 'cyan',
      badge: 'Most Popular',
      isDefault: false
    },
    {
      id: 'premium-plus',
      name: 'Premium Plus',
      price: '2499',
      period: '6 months',
      description: 'Maximum career acceleration',
      features: [
        { icon: 'Crown', text: 'Everything in Premium', available: true },
        { icon: 'Users', text: '1-on-1 career mentoring', available: true },
        { icon: 'CheckCircle2', text: 'LinkedIn profile optimization', available: true },
        { icon: 'CheckCircle2', text: 'Personal branding workshop', available: true },
        { icon: 'CheckCircle2', text: 'Job referral network access', available: true },
        { icon: 'CheckCircle2', text: 'Salary negotiation guidance', available: true },
        { icon: 'CheckCircle2', text: 'Soon: Shared projects', available: false, tag: 'Soon' }
      ],
      buttonText: 'Subscribe',
      cardColor: 'emerald',
      badge: 'Save ₹499',
      isDefault: false
    }
  ]);

  // Initial data structure for recruiter plans
  const [recruiterPlans, setRecruiterPlans] = useState([
    {
      id: 'free',
      name: 'Free',
      price: '0',
      period: 'month',
      description: 'Get started with basic recruitment',
      features: [
        { icon: 'Lock', text: '1 job posting allowed', available: true },
        { icon: 'CheckCircle2', text: 'Resume validation stage', available: true },
        { icon: 'CheckCircle2', text: 'Telephonic round interviews', available: true },
        { icon: 'CheckCircle2', text: 'HR round interviews', available: true },
        { icon: 'CheckCircle2', text: 'Basic candidate management', available: true }
      ],
      buttonText: 'Current plan',
      cardColor: 'gray',
      badge: null,
      isDefault: true
    },
    {
      id: 'per-post',
      name: 'Per Job Post',
      price: '999',
      period: 'per post',
      description: 'Pay as you go for additional jobs',
      features: [
        { icon: 'Briefcase', text: '1 additional job posting', available: true },
        { icon: 'Zap', text: 'All interview stages included', available: true },
        { icon: 'CheckCircle2', text: 'Technical round access', available: true },
        { icon: 'CheckCircle2', text: 'CEO round interviews', available: true },
        { icon: 'CheckCircle2', text: 'Advanced candidate screening', available: true },
        { icon: 'CheckCircle2', text: 'Interview scheduling tools', available: true }
      ],
      buttonText: 'Add Job Post',
      cardColor: 'cyan',
      badge: null,
      isDefault: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '2999',
      period: '3 months',
      description: 'Comprehensive recruitment solution',
      features: [
        { icon: 'Award', text: 'Unlimited job postings', available: true },
        { icon: 'Zap', text: 'Unlimited AI generations', available: true },
        { icon: 'CheckCircle2', text: 'All interview stages', available: true },
        { icon: 'CheckCircle2', text: 'Advanced screening analytics', available: true },
        { icon: 'CheckCircle2', text: 'Custom interview workflows', available: true },
        { icon: 'CheckCircle2', text: 'ATS integration', available: true },
        { icon: 'CheckCircle2', text: 'Cancel anytime', available: true }
      ],
      buttonText: 'Start 3-day free trial',
      cardColor: 'cyan',
      badge: 'Most Popular',
      isDefault: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '5999',
      period: '6 months',
      description: 'Maximum recruitment power',
      features: [
        { icon: 'Crown', text: 'Everything in Professional', available: true },
        { icon: 'Users', text: 'Dedicated account manager', available: true },
        { icon: 'CheckCircle2', text: 'Custom branding options', available: true },
        { icon: 'CheckCircle2', text: 'API access for integrations', available: true },
        { icon: 'CheckCircle2', text: 'Multi-location support', available: true },
        { icon: 'CheckCircle2', text: 'White-label solutions', available: true },
        { icon: 'CheckCircle2', text: 'Soon: Shared team workspace', available: false, tag: 'Soon' }
      ],
      buttonText: 'Subscribe',
      cardColor: 'emerald',
      badge: 'Save ₹999',
      isDefault: false
    }
  ]);

  const currentPlans = selectedUserType === 'candidate' ? candidatePlans : recruiterPlans;
  const setCurrentPlans = selectedUserType === 'candidate' ? setCandidatePlans : setRecruiterPlans;

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

  const handleSave = (planData) => {
    if (isCreating) {
      setCurrentPlans([...currentPlans, planData]);
    } else {
      setCurrentPlans(currentPlans.map(p => p.id === planData.id ? planData : p));
    }
  };

  const handleDelete = (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setCurrentPlans(currentPlans.filter(p => p.id !== planId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div> 
            <h3 className="text-sm font-medium text-gray-600 mb-2">Configure premium plans for candidates and recruiters</h3>
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
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Plan
          </button>
        </div>
      </div>

      {/* User Type Selector */}
      <div className="px-6 py-6">
        
      </div>

      {/* Plans Grid */}
      <div className="px-6 pb-8">
        <div className={`grid gap-6 ${currentPlans.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {currentPlans.map((plan) => {
            const Icon = iconMap[plan.features[0]?.icon] || CheckCircle2;

            return (
              <div
                key={plan.id}
                className={`${getCardColorClass(plan.cardColor)} rounded-2xl p-6 border-2 border-gray-200 relative`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`${getBadgeColorClass(plan.badge, plan.cardColor)} text-white text-xs font-bold px-4 py-1 rounded-full`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                {!plan.isDefault && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
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

      {/* Plan Modal */}
      <AddSubscriptionPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingPlan={editingPlan}
        isCreating={isCreating}
        userType={selectedUserType}
      />
    </div>
  );
};

export default AdminSubscriptionManagement;