import { Crown, Zap, Users, TrendingUp, ArrowRight } from "lucide-react"

const PremiumCard = ({ onUpgrade }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-200 rounded-xl p-6 shadow-lg">
      <div className="flex items-start space-x-3 mb-4">
        <div className="bg-amber-400 p-2 rounded-lg">
          <Crown className="h-5 w-5 text-amber-800" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">Try Premium for free</h3>
          <p className="text-sm text-slate-600 mt-1">Unlock exclusive opportunities</p>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center space-x-2 text-sm text-slate-700">
          <Zap className="h-4 w-4 text-amber-600" />
          <span>See who viewed your profile</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-700">
          <Users className="h-4 w-4 text-amber-600" />
          <span>Direct message any recruiter</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-700">
          <TrendingUp className="h-4 w-4 text-amber-600" />
          <span>Premium insights on companies</span>
        </div>
      </div>

      <button 
        onClick={onUpgrade}
        className="w-full bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <span>Try for free</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-xs text-slate-500 text-center mt-2">1 month free trial</p>
    </div>
  )
}

export default PremiumCard