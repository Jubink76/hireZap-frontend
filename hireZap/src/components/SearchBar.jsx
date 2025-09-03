import { Search } from "lucide-react"

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  placeholder = "Search for jobs, companies, or keywords...",
  onSearch 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 h-12 text-lg border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 rounded-lg outline-none transition-all"
        />
      </div>
    </form>
  )
}

export default SearchBar