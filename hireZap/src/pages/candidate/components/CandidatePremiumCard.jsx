import { Crown } from "lucide-react";
const CandidatePremiumCard = ({ onUpgrade }) => {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-lg p-4 mb-4 shadow-sm border">
      <div className="flex items-center space-x-2 mb-2">
        <div className="bg-white/20 rounded-full p-2">
          <Crown className="w-6 h-6 text-yellow-300" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Go Premium</h3>
          <p className="text-purple-100 text-xs">Unlock all features</p>
        </div>
      </div>
      
      <button 
        onClick={onUpgrade}
        className="w-full bg-white text-purple-600 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors text-sm"
      >
        Upgrade Now
      </button>
    </div>
  );
};
export default CandidatePremiumCard;