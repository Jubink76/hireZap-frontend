import { MapPin, DollarSign, Clock, Bookmark } from "lucide-react"

const JobCard = ({ job, onSave, isSaved, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border border-slate-200 overflow-hidden group cursor-pointer"
      onClick={() => onClick && onClick(job)}
    >
      {/* Cover Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={job.coverImage}
          alt={`${job.company} office`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Company Logo */}
        <div className="absolute bottom-3 left-4">
          <img
            src={job.logo || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop"}
            alt={`${job.company} logo`}
            className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-lg"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSave(job.id)
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-cyan-600 text-cyan-600" : "text-slate-600"}`} />
        </button>
      </div>

      {/* Job Details */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-cyan-700 transition-colors mb-1">
              {job.title}
            </h3>
            <p className="text-base text-slate-700 font-medium">{job.company}</p>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">
            {job.type}
          </span>
        </div>

        <div className="flex items-center space-x-4 mb-3 text-sm text-slate-600 flex-wrap gap-y-1">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{job.posted}</span>
          </div>
        </div>

        <p className="text-slate-600 mb-4 line-clamp-2 text-sm leading-relaxed">{job.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm">
          Quick Apply
        </button>
      </div>
    </div>
  )
}

export default JobCard