import React, { useState } from 'react';
import { X, Target, BookOpen, TrendingUp, Users, CheckCircle2, XCircle, Star, Shield, Award } from 'lucide-react';

export default function CandidatePremiumModal({ isOpen, onClose }) {

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Candidate Subscription Plans</h1>
                <p className="text-gray-600 mt-2">Supercharge your job search with AI-powered tools, mock interviews, and career guidance</p>
            </div>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-8 h-8" />
            </button>
            </div>

            {/* Features Overview */}
            <div className="px-8 py-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mock Interviews</h3>
                <p className="text-gray-600 text-sm">Practice with AI-powered mock interviews and get instant feedback</p>
                </div>
                <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Resume Builder</h3>
                <p className="text-gray-600 text-sm">Create ATS-optimized resumes with professional templates</p>
                </div>
                <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Skill Assessment</h3>
                <p className="text-gray-600 text-sm">Test your skills and get certified to stand out to employers</p>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Free Plan */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
                    <Users className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">₹0</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">Start your job search journey with basic features</p>
                
                <div className="mb-6">
                    <p className="font-semibold text-gray-900 mb-3">What's included:</p>
                    <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Browse unlimited job listings</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Apply to jobs</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Basic profile creation</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Job alerts via email</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Application tracking</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Company research</span>
                    </li>
                    </ul>
                </div>

                <div className="mb-6">
                    <p className="font-semibold text-gray-900 mb-3">Not included:</p>
                    <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                        <XCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500">No mock interview access</span>
                    </li>
                    <li className="flex items-start">
                        <XCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500">No resume builder tools</span>
                    </li>
                    <li className="flex items-start">
                        <XCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500">No skill assessments</span>
                    </li>
                    <li className="flex items-start">
                        <XCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500">No interview preparation</span>
                    </li>
                    <li className="flex items-start">
                        <XCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500">Basic support only</span>
                    </li>
                    </ul>
                </div>

                <button className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Start Free →
                </button>
                </div>

                {/* Premium Plan */}
                <div className="bg-gradient-to-br from-cyan-50 to-white rounded-xl border-2 border-cyan-400 p-6 shadow-lg relative transform md:scale-105">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                    </span>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-lg mb-4">
                    <Award className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">₹1,499</span>
                    <span className="text-gray-600 text-sm ml-2">/ 3 months</span>
                </div>
                <p className="text-gray-700 text-sm mb-6 font-medium">Accelerate your career with comprehensive tools</p>
                
                <div className="mb-6">
                    <p className="font-semibold text-gray-900 mb-3">What's included:</p>
                    <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">Everything in Free plan</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">AI-powered mock interviews</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Advanced resume builder</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Skill assessment tests</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Interview preparation guides</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">ATS resume optimization</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Career coaching sessions</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Priority application status</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Detailed performance analytics</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Industry-specific tips</span>
                    </li>
                    </ul>
                </div>

                <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md">
                    Start 3-Month Plan →
                </button>
                </div>

                {/* Premium Plus Plan */}
                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border-2 border-emerald-400 p-6 shadow-lg relative">
                <div className="absolute -top-3 right-4">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Save ₹499
                    </span>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-4">
                    <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plus</h3>
                <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">₹2,499</span>
                    <span className="text-gray-600 text-sm ml-2">/ 6 months</span>
                </div>
                <p className="text-gray-700 text-sm mb-6 font-medium">Maximum career growth with extended access</p>
                
                <div className="mb-6">
                    <p className="font-semibold text-gray-900 mb-3">What's included:</p>
                    <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">Everything in Premium plan</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Extended 6-month access</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Unlimited mock interviews</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Advanced skill certifications</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">1-on-1 career mentoring</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Salary negotiation guidance</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">LinkedIn profile optimization</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Personal branding workshop</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Job referral network access</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Interview guarantee program</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Custom career roadmap</span>
                    </li>
                    </ul>
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md">
                    Start 6-Month Plan →
                </button>
                </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Feature Comparison</h2>
                <p className="text-gray-600 text-center mb-8">Compare what features are available in each plan</p>
                
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-900">Premium</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-900">Premium Plus</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-700">Job Applications</td>
                        <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-700">Mock Interviews</td>
                        <td className="text-center py-4 px-4">
                        <XCircle className="w-6 h-6 text-gray-300 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-700">Resume Builder</td>
                        <td className="text-center py-4 px-4">
                        <XCircle className="w-6 h-6 text-gray-300 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-700">Skill Assessments</td>
                        <td className="text-center py-4 px-4">
                        <XCircle className="w-6 h-6 text-gray-300 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-700">Career Mentoring</td>
                        <td className="text-center py-4 px-4">
                        <XCircle className="w-6 h-6 text-gray-300 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                        <XCircle className="w-6 h-6 text-gray-300 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">How many mock interviews can I take?</h3>
                    <p className="text-gray-600 text-sm">Premium plan includes 10 mock interviews per month. Premium Plus offers unlimited mock interviews with advanced AI feedback.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Can I download my resume?</h3>
                    <p className="text-gray-600 text-sm">Yes, with Premium plans you can download your ATS-optimized resume in multiple formats (PDF, Word, etc.).</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Do I get interview preparation materials?</h3>
                    <p className="text-gray-600 text-sm">Premium plans include comprehensive interview guides, common questions, and industry-specific preparation materials.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Is there a money-back guarantee?</h3>
                    <p className="text-gray-600 text-sm">Yes, we offer a 7-day money-back guarantee if you're not satisfied with your Premium subscription.</p>
                </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-gray-600 text-sm">
                <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span>Secure Payment</span>
                </div>
                <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>50,000+ Job Seekers</span>
                </div>
                <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 fill-yellow-400 text-yellow-400" />
                <span>4.8/5 Rating</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}