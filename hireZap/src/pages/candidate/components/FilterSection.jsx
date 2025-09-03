import { Filter } from "lucide-react"

const FilterSection = ({ 
  selectedJobTypes, 
  setSelectedJobTypes, 
  selectedLocations, 
  setSelectedLocations, 
  selectedSkills, 
  setSelectedSkills,
  selectedSalaryRange,
  setSelectedSalaryRange,
  filterOptions
}) => {
  
  const defaultFilterOptions = {
    jobTypes: ["Full-time", "Part-time", "Contract", "Internship"],
    locations: ["Remote", "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Los Angeles, CA"],
    skills: ["React", "TypeScript", "Python", "UI/UX", "Machine Learning", "AWS", "Docker", "Figma"],
    salaryRanges: [
      { value: "0-50k", label: "$0 - $50,000" },
      { value: "50k-75k", label: "$50,000 - $75,000" },
      { value: "75k-100k", label: "$75,000 - $100,000" },
      { value: "100k-150k", label: "$100,000 - $150,000" },
      { value: "150k+", label: "$150,000+" }
    ]
  }

  const options = { ...defaultFilterOptions, ...filterOptions }

  const handleCheckboxChange = (value, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(value)) {
      setSelectedArray(selectedArray.filter((item) => item !== value))
    } else {
      setSelectedArray([...selectedArray, value])
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="h-5 w-5 text-cyan-600" />
        <h2 className="text-lg font-serif font-semibold text-slate-900">Refine Your Search</h2>
      </div>

      <div className="space-y-6">
        {/* Job Type Filter */}
        <div>
          <h3 className="font-medium text-slate-900 mb-3">Job Type</h3>
          <div className="space-y-2">
            {options.jobTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={type}
                  checked={selectedJobTypes.includes(type)}
                  onChange={() => handleCheckboxChange(type, selectedJobTypes, setSelectedJobTypes)}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor={type} className="text-sm text-slate-700 cursor-pointer">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Location Filter */}
        <div>
          <h3 className="font-medium text-slate-900 mb-3">Location</h3>
          <div className="space-y-2">
            {options.locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={location}
                  checked={selectedLocations.includes(location)}
                  onChange={() => handleCheckboxChange(location, selectedLocations, setSelectedLocations)}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor={location} className="text-sm text-slate-700 cursor-pointer">
                  {location}
                </label>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Skills Filter */}
        <div>
          <h3 className="font-medium text-slate-900 mb-3">Skills</h3>
          <div className="space-y-2">
            {options.skills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={skill}
                  checked={selectedSkills.includes(skill)}
                  onChange={() => handleCheckboxChange(skill, selectedSkills, setSelectedSkills)}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor={skill} className="text-sm text-slate-700 cursor-pointer">
                  {skill}
                </label>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Salary Range */}
        <div>
          <h3 className="font-medium text-slate-900 mb-3">Salary Range</h3>
          <select 
            value={selectedSalaryRange || ""}
            onChange={(e) => setSelectedSalaryRange && setSelectedSalaryRange(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="">Select range</option>
            {options.salaryRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <button 
          onClick={() => {
            setSelectedJobTypes([])
            setSelectedLocations([])
            setSelectedSkills([])
            setSelectedSalaryRange && setSelectedSalaryRange("")
          }}
          className="w-full mt-4 text-slate-600 hover:text-slate-800 py-2 text-sm font-medium transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}

export default FilterSection