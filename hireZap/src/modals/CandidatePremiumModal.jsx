import React, { useState } from 'react';
import { X, CheckCircle2, Lock, Zap, Award, Users, Crown } from 'lucide-react';

export default function CandidatePremiumModal({ isOpen, onClose }) {

    const [selectedPlan, setSelectedPlan] = useState(null);

    if (!isOpen) return null;

    const plans = [
        {
        id: 'free',
        name: 'Free',
        price: '₹0',
        period: '/month',
        description: 'Get started with basic features',
        features: [
            { icon: Lock, text: 'Browse unlimited job listings', available: true },
            { icon: CheckCircle2, text: 'Apply to jobs', available: true },
            { icon: CheckCircle2, text: 'Basic profile creation', available: true },
            { icon: CheckCircle2, text: '5 free AI generations', available: true },
            { icon: CheckCircle2, text: 'Limited resume edits', available: true }
        ],
        buttonText: 'Current plan',
        buttonColor: 'bg-gray-400 cursor-not-allowed',
        cardColor: 'bg-gray-50',
        badge: null
        },
        {
        id: 'premium',
        name: 'Premium',
        price: '₹1,499',
        period: '/ 3 months',
        description: 'Accelerate your career growth',
        features: [
            { icon: Award, text: 'Unlimited mock interviews', available: true },
            { icon: Zap, text: 'Unlimited AI generations', available: true },
            { icon: CheckCircle2, text: 'Unlimited AI resume edits', available: true },
            { icon: CheckCircle2, text: 'ATS resume optimization', available: true },
            { icon: CheckCircle2, text: 'Advanced skill assessments', available: true },
            { icon: CheckCircle2, text: 'Priority application status', available: true },
            { icon: CheckCircle2, text: 'Cancel anytime', available: true }
        ],
        buttonText: 'Start 3-day free trial',
        buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
        cardColor: 'bg-cyan-50',
        badge: 'Most Popular'
        },
        {
        id: 'premium-plus',
        name: 'Premium Plus',
        price: '₹2,499',
        period: '/ 6 months',
        description: 'Maximum career acceleration',
        features: [
            { icon: Crown, text: 'Everything in Premium', available: true },
            { icon: Users, text: '1-on-1 career mentoring', available: true },
            { icon: CheckCircle2, text: 'LinkedIn profile optimization', available: true },
            { icon: CheckCircle2, text: 'Personal branding workshop', available: true },
            { icon: CheckCircle2, text: 'Job referral network access', available: true },
            { icon: CheckCircle2, text: 'Salary negotiation guidance', available: true },
            { icon: CheckCircle2, text: 'Soon: Shared projects', available: false, tag: 'Soon' }
        ],
        buttonText: 'Subscribe',
        buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
        cardColor: 'bg-emerald-50',
        badge: 'Save ₹499'
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
            <div className="flex-1">
                <button 
                onClick={onClose}
                className="text-grey-400 hover:text-red-700 transition-colors border border-1 cursor-pointer"
                >
                <X className="w-6 h-6" />
                </button>
            </div>
            <div className="text-center flex-1">
                <h1 className="text-2xl font-bold text-gray-900">Explore with no limits.</h1>
                <p className="text-lg text-gray-900 mt-1">Unlock unlimited generations and exports.</p>
            </div>
            <div className="flex-1"></div>
            </div>

            {/* Pricing Cards */}
            <div className="px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {plans.map((plan) => (
                <button
                    key={plan.id}
                    onClick={() => plan.id !== 'free' && setSelectedPlan(plan.id)}
                    className={`${plan.cardColor} rounded-2xl p-5 text-left transition-all duration-200 relative ${
                    plan.id !== 'free' ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : ''
                    } ${selectedPlan === plan.id ? 'ring-1 ring-teal-700 shadow-xl' : ''} border-1 ${
                    selectedPlan === plan.id ? 'border-teal-400' : 'border-gray-200'
                    }`}
                    disabled={plan.id === 'free'}
                >
                    {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className={`${
                        plan.id === 'premium' ? 'bg-cyan-500' : 'bg-emerald-600'
                        } text-white text-xs font-bold px-4 py-1 rounded-full`}>
                        {plan.badge}
                        </span>
                    </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-2">
                        <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600 text-xs">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 text-xs">{plan.description}</p>
                    </div>

                    {/* Action Button */}
                    <div className="mb-5">
                    <div className={`w-full ${plan.buttonColor} text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-center text-sm`}>
                        {plan.buttonText}
                    </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2.5">
                    {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                        <feature.icon className={`w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5 ${
                            feature.available ? 'text-gray-700' : 'text-gray-400'
                        }`} />
                        <span className={`text-xs ${
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