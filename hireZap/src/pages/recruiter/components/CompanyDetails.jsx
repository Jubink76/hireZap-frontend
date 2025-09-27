import React, { useEffect, useRef } from 'react';
import { MapPin, Globe, Users, Calendar, Verified, Edit } from 'lucide-react';

const CompanyDetails = ({ companyData, onEdit }) => {
  const mapRef = useRef(null);

  // Sample company data structure
  const defaultCompanyData = {
    name: "TechCorp Solutions",
    industry: "Technology",
    size: "500-1000 employees",
    website: "www.techcorp.com",
    description: "Leading technology solutions provider specializing in AI and cloud computing.",
    founded: "2015",
    headquarters: "San Francisco, CA",
    isVerified: true,
    logo: null,
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    }
  };

  const company = { ...defaultCompanyData, ...companyData };

  // Initialize map when component mounts
  useEffect(() => {
    if (mapRef.current && company.coordinates) {
      // Create a simple map visualization
      const mapContainer = mapRef.current;
      mapContainer.innerHTML = `
        <div style="
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ef4444;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          "></div>
          <div style="
            position: absolute;
            bottom: 8px;
            left: 8px;
            background: rgba(255,255,255,0.9);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: #64748b;
          ">
            ${company.coordinates.lat.toFixed(4)}, ${company.coordinates.lng.toFixed(4)}
          </div>
        </div>
      `;
    }
  }, [company.coordinates]);

  return (
    <div className="ml-64 pt-20 min-h-screen bg-slate-50">
      <div className="p-6 w-full">
        <div className="w-full max-w-none">
          <div className="rounded-lg shadow-lg border border-slate-200 bg-white/80 backdrop-blur-sm">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Company Logo */}
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={company.name}
                        className="w-12 h-12 rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">
                        {company.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h2 className="text-xl font-semibold text-slate-900">{company.name}</h2>
                      {company.isVerified && (
                        <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                          <Verified className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-slate-600">
                      <p><span className="font-medium">Industry:</span> {company.industry}</p>
                      <p><span className="font-medium">Company Size:</span> {company.size}</p>
                      {company.website && (
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <a 
                            href={`https://${company.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {company.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm text-teal-600 hover:text-teal-700 border border-teal-200 hover:border-teal-300 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Details</span>
                  </button>
                )}
              </div>
            </div>

            {/* Company Description */}
            {company.description && (
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-sm font-medium text-slate-900 mb-2">About Company</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{company.description}</p>
              </div>
            )}

            {/* Additional Details */}
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.founded && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Founded in {company.founded}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{company.size}</span>
                </div>

                {company.headquarters && (
                  <div className="flex items-center space-x-2 text-sm md:col-span-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Headquarters: {company.headquarters}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            {company.coordinates && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-900">Location</h3>
                  <span className="text-xs text-slate-500">
                    Interactive map coming soon
                  </span>
                </div>
                <div ref={mapRef} className="w-full">
                  {/* Map will be rendered here by useEffect */}
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  <p>📍 {company.headquarters}</p>
                  <p>Coordinates: {company.coordinates.lat}, {company.coordinates.lng}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;