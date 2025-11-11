import { useState } from "react";
export const CompanySearchModal = ({ isOpen, onClose, companies, onSelectCompany, selectedCompany }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Company</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            autoFocus
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          <button
            onClick={() => {
              onSelectCompany(null);
              onClose();
            }}
            className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
              !selectedCompany ? 'bg-teal-50 border border-teal-200' : 'border border-gray-200'
            }`}
          >
            <div className="font-medium text-gray-900">All Companies</div>
            <div className="text-xs text-gray-500">Show all job posts</div>
          </button>

          {filteredCompanies.map((company) => (
            <button
              key={company.id}
              onClick={() => {
                onSelectCompany(company);
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
                selectedCompany?.id === company.id ? 'bg-teal-50 border border-teal-200' : 'border border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {company.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{company.name}</div>
                  <div className="text-xs text-gray-500">{company.industry || 'Company'}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};