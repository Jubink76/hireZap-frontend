import React, { useState } from 'react';
import { X, Briefcase, Users, TrendingUp, CheckCircle2, XCircle, Star, Shield } from 'lucide-react';

export default function RecruiterPremiumModal({isOpen, isClose}) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Recruiter Subscription Plans</h1>
            <p className="text-gray-600 mt-2">Scale your hiring process with advanced recruitment tools and comprehensive interview management</p>
          </div>
          <button 
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
                <Briefcase className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Job Postings</h3>
              <p className="text-gray-600 text-sm">Create and manage multiple job postings with ease</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Stages</h3>
              <p className="text-gray-600 text-sm">Complete interview pipeline from resume to CEO rounds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
              <p className="text-gray-600 text-sm">Detailed hiring insights and candidate performance metrics</p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {/* Free Plan */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">₹0</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">Get started with basic recruitment features</p>
              
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">What's included:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">1 job posting allowed</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Resume validation stage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Telephonic round interviews</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">HR round interviews</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Basic candidate management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Email notifications</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">Not included:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">No technical round access</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">No CEO round access</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">Limited to 1 job post</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">No advanced analytics</span>
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

            {/* Per Job Post Plan */}
            <div className="bg-white rounded-xl border-2 border-cyan-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-lg mb-4">
                <Briefcase className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Per Job Post</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">₹999</span>
                <span className="text-gray-600 text-sm ml-2">/ per additional post</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">Pay as you go for additional job postings</p>
              
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">What's included:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">1 additional job posting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">All interview stages included</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Technical round access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">CEO round interviews</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Advanced candidate screening</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Interview scheduling tools</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Performance analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                </ul>
              </div>

              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Add Job Post →
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-xl border-2 border-cyan-400 p-6 shadow-lg relative transform md:scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </span>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-lg mb-4">
                <Star className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">₹2,999</span>
                <span className="text-gray-600 text-sm ml-2">/ 3 months</span>
              </div>
              <p className="text-gray-700 text-sm mb-6 font-medium">Comprehensive recruitment solution for growing teams</p>
              
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">What's included:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Unlimited job postings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">All interview stages (Resume, Telephonic, HR, Technical, CEO)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Advanced screening analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Interview question banks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Automated screening tools</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Team collaboration features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Custom interview workflows</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Detailed hiring reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority customer support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">ATS integration</span>
                  </li>
                </ul>
              </div>

              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md">
                Start 3-Month Plan →
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border-2 border-emerald-400 p-6 shadow-lg relative">
              <div className="absolute -top-3 right-4">
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Save ₹999
                </span>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">₹5,999</span>
                <span className="text-gray-600 text-sm ml-2">/ 6 months</span>
              </div>
              <p className="text-gray-700 text-sm mb-6 font-medium">Maximum value for serious recruitment operations</p>
              
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">What's included:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">Everything in Professional</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Extended 6-month access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Advanced AI-powered screening</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Custom branding options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Bulk candidate management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Advanced reporting dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">API access for integrations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Custom interview templates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Multi-location support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">White-label solutions</span>
                  </li>
                </ul>
              </div>

              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md">
                Start 6-Month Plan →
              </button>
            </div>
          </div>

          {/* Interview Stages Comparison Table */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Interview Stages Access</h2>
            <p className="text-gray-600 text-center mb-8">Compare what interview stages are available in each plan</p>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Interview Stage</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Per Post</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Professional</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Resume Validation</td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
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
                    <td className="py-4 px-4 text-gray-700">Telephonic Round</td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
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
                    <td className="py-4 px-4 text-gray-700">HR Round</td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
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
                    <td className="py-4 px-4 text-gray-700">Technical Round</td>
                    <td className="text-center py-4 px-4">
                      <XCircle className="w-6 h-6 text-gray-300 mx-auto" />
                    </td>
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
                    <td className="py-4 px-4 text-gray-700">CEO Round</td>
                    <td className="text-center py-4 px-4">
                      <XCircle className="w-6 h-6 text-gray-300 mx-auto" />
                    </td>
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
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How many job posts can I create?</h3>
                <p className="text-gray-600 text-sm">Free plan allows 1 job post. Per-post plan adds 1 more. Professional and Enterprise plans offer unlimited job postings.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What interview stages are included?</h3>
                <p className="text-gray-600 text-sm">Free includes Resume, Telephonic, and HR rounds. Paid plans add Technical and CEO rounds for comprehensive screening.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade my plan anytime?</h3>
                <p className="text-gray-600 text-sm">Yes, you can upgrade from any plan to a higher tier. The remaining time will be prorated for your convenience.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do I get candidate analytics?</h3>
                <p className="text-gray-600 text-sm">Basic analytics in Free plan. Advanced analytics, performance reports, and hiring insights in paid plans.</p>
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
              <span>5,000+ Recruiters</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}