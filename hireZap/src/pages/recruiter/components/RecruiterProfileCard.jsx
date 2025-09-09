"use client"
import React from "react"
import { MapPin, Calendar } from "lucide-react"

export default function RecruiterProfileCard() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg rounded-xl mb-6">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="h-24 w-24 mx-auto sm:mx-0 rounded-full overflow-hidden bg-cyan-100 flex items-center justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-man-oeWONwTZBy5Zy36DN3TqchWC4Xo6BO.png"
              alt="Michael Chen"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Text info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-1">
              Michael Chen
            </h2>
            <p className="text-lg text-slate-600 mb-2">
              Senior Talent Acquisition Manager
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-slate-500 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                New York, NY
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined January 2024
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div
                  className="bg-cyan-600 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
              <span className="text-sm font-medium text-slate-600">
                92% Profile Complete
              </span>
            </div>
          </div>

          {/* Summary stats inline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:w-auto w-full">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">12</div>
              <div className="text-xs text-slate-500">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">156</div>
              <div className="text-xs text-slate-500">Total Applicants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">8</div>
              <div className="text-xs text-slate-500">Interviews Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-xs text-slate-500">Hires This Month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
