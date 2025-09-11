import { useState } from 'react';

const FilterSection = ({ 
  selectedJobTypes = [],
  setSelectedJobTypes,
  selectedLocations = [],
  setSelectedLocations,
  selectedSkills = [],
  setSelectedSkills,
  selectedSalaryRange = '',
  setSelectedSalaryRange
}) => {
  const [localJobTypes, setLocalJobTypes] = useState(selectedJobTypes);
  const [localLocations, setLocalLocations] = useState(selectedLocations);
  const [localSkills, setLocalSkills] = useState(selectedSkills);
  const [localSalaryRange, setLocalSalaryRange] = useState(selectedSalaryRange);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const locations = ['Remote', 'On-site', 'Hybrid'];
  const skills = ['React', 'Node.js', 'Python', 'UI/UX'];
  const salaryRanges = ['Any', '$50k - $70k', '$70k - $90k', '$90k - $110k', '$110k+'];

  const toggleFilter = (item, list, setList, externalSetList) => {
    const newList = list.includes(item) 
      ? list.filter(i => i !== item)
      : [...list, item];
    
    setList(newList);
    if (externalSetList) {
      externalSetList(newList);
    }
  };

  const handleSalaryChange = (value) => {
    setLocalSalaryRange(value);
    if (setSelectedSalaryRange) {
      setSelectedSalaryRange(value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-400/50 transition-shadow hover:shadow-md p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Refine Your Search</h3>
      
      {/* Job Type */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={(setSelectedJobTypes ? selectedJobTypes : localJobTypes).includes(type)}
                onChange={() => toggleFilter(type, 
                  setSelectedJobTypes ? selectedJobTypes : localJobTypes, 
                  setSelectedJobTypes ? setSelectedJobTypes : setLocalJobTypes,
                  setSelectedJobTypes
                )}
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Location</h4>
        <div className="space-y-2">
          {locations.map((location) => (
            <label key={location} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={(setSelectedLocations ? selectedLocations : localLocations).includes(location)}
                onChange={() => toggleFilter(location,
                  setSelectedLocations ? selectedLocations : localLocations,
                  setSelectedLocations ? setSelectedLocations : setLocalLocations,
                  setSelectedLocations
                )}
              />
              <span className="ml-2 text-sm text-gray-700">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
        <div className="space-y-2">
          {skills.map((skill) => (
            <label key={skill} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={(setSelectedSkills ? selectedSkills : localSkills).includes(skill)}
                onChange={() => toggleFilter(skill,
                  setSelectedSkills ? selectedSkills : localSkills,
                  setSelectedSkills ? setSelectedSkills : setLocalSkills,
                  setSelectedSkills
                )}
              />
              <span className="ml-2 text-sm text-gray-700">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Salary Range</h4>
        <select 
          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          value={setSelectedSalaryRange ? selectedSalaryRange : localSalaryRange}
          onChange={(e) => handleSalaryChange(e.target.value)}
        >
          {salaryRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterSection;
