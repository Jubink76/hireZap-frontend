
import React, { useState } from 'react';
import { X, CheckCircle2, Lock, Briefcase, Award, Users, Crown, Zap } from 'lucide-react';

export default function RecruiterPremiumModal({isOpen, onClose}) {

    const [selectedPlan, setSelectedPlan] = useState(null);

    if (!isOpen) return null;

    const plans = [
        {
        id: 'free',
        name: 'Free',
        price: '₹0',
        period: '/month',
        description: 'Get started with basic recruitment',
        features: [
            { icon: Lock, text: '1 job posting allowed', available: true },
            { icon: CheckCircle2, text: 'Resume validation stage', available: true },
            { icon: CheckCircle2, text: 'Telephonic round interviews', available: true },
            { icon: CheckCircle2, text: 'HR round interviews', available: true },
            { icon: CheckCircle2, text: 'Basic candidate management', available: true }
        ],
        buttonText: 'Current plan',
        buttonColor: 'bg-gray-400 cursor-not-allowed',
        cardColor: 'bg-gray-50',
        badge: null
        },
        {
        id: 'per-post',
        name: 'Per Job Post',
        price: '₹999',
        period: '/ per post',
        description: 'Pay as you go for additional jobs',
        features: [
            { icon: Briefcase, text: '1 additional job posting', available: true },
            { icon: Zap, text: 'All interview stages included', available: true },
            { icon: CheckCircle2, text: 'Technical round access', available: true },
            { icon: CheckCircle2, text: 'CEO round interviews', available: true },
            { icon: CheckCircle2, text: 'Advanced candidate screening', available: true },
            { icon: CheckCircle2, text: 'Interview scheduling tools', available: true }
        ],
        buttonText: 'Add Job Post',
        buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
        cardColor: 'bg-white',
        badge: null
        },
        {
        id: 'professional',
        name: 'Professional',
        price: '₹2,999',
        period: '/ 3 months',
        description: 'Comprehensive recruitment solution',
        features: [
            { icon: Award, text: 'Unlimited job postings', available: true },
            { icon: Zap, text: 'Unlimited AI generations', available: true },
            { icon: CheckCircle2, text: 'All interview stages', available: true },
            { icon: CheckCircle2, text: 'Advanced screening analytics', available: true },
            { icon: CheckCircle2, text: 'Custom interview workflows', available: true },
            { icon: CheckCircle2, text: 'ATS integration', available: true },
            { icon: CheckCircle2, text: 'Cancel anytime', available: true }
        ],
        buttonText: 'Start 3-day free trial',
        buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
        cardColor: 'bg-cyan-50',
        badge: 'Most Popular'
        },
        {
        id: 'enterprise',
        name: 'Enterprise',
        price: '₹5,999',
        period: '/ 6 months',
        description: 'Maximum recruitment power',
        features: [
            { icon: Crown, text: 'Everything in Professional', available: true },
            { icon: Users, text: 'Dedicated account manager', available: true },
            { icon: CheckCircle2, text: 'Custom branding options', available: true },
            { icon: CheckCircle2, text: 'API access for integrations', available: true },
            { icon: CheckCircle2, text: 'Multi-location support', available: true },
            { icon: CheckCircle2, text: 'White-label solutions', available: true },
            { icon: CheckCircle2, text: 'Soon: Shared team workspace', available: false, tag: 'Soon' }
        ],
        buttonText: 'Subscribe',
        buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
        cardColor: 'bg-emerald-50',
        badge: 'Save ₹999'
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
            <div className="flex-1">
                <button 
                onClick={onClose}
                className="text-grey-400 hover:text-red-700 transition-colors border border-1 cursor-pointer"
                >
                <X className="w-6 h-6" />
                </button>
            </div>
            <div className="text-center flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Scale hiring with no limits.</h1>
                <p className="text-xl text-gray-900 mt-1">Unlock unlimited job postings and advanced tools.</p>
            </div>
            <div className="flex-1"></div>
            </div>

            {/* Pricing Cards */}
            <div className="px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {plans.map((plan) => (
                <button
                    key={plan.id}
                    onClick={() => plan.id !== 'free' && setSelectedPlan(plan.id)}
                    className={`${plan.cardColor} rounded-2xl p-6 text-left transition-all duration-200 relative ${
                    plan.id !== 'free' ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : ''
                    } ${selectedPlan === plan.id ? 'ring-4 ring-cyan-400 shadow-xl' : ''} border-2 ${
                    selectedPlan === plan.id ? 'border-cyan-400' : 'border-gray-200'
                    }`}
                    disabled={plan.id === 'free'}
                >
                    {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className={`${
                        plan.id === 'professional' ? 'bg-cyan-500' : 'bg-emerald-600'
                        } text-white text-xs font-bold px-4 py-1 rounded-full`}>
                        {plan.badge}
                        </span>
                    </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-2">
                        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600 text-sm">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>

                    {/* Action Button */}
                    <div className="mb-6">
                    <div className={`w-full ${plan.buttonColor} text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center`}>
                        {plan.buttonText}
                    </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                        <feature.icon className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
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
                    ))}
                    </div>
                </button>
                ))}
            </div>
            </div>
        </div>
        </div>
    );
}