import { CheckCircle, Lock, X,} from 'lucide-react';

// Premium Required Modal
const PremiumRequiredModal = ({ isOpen, onClose, requiredTier, stageName }) => {
  if (!isOpen) return null;

  const tierInfo = {
    'per-post': {
      title: 'Per Post Payment Required',
      description: 'This stage requires purchasing an additional job post.',
      price: '₹999',
      features: ['Access to this stage', 'All interview stages', 'Advanced screening']
    },
    'professional': {
      title: 'Professional Plan Required',
      description: 'Upgrade to Professional plan to unlock this stage.',
      price: '₹2,999 / 3 months',
      features: ['Unlimited job postings', 'All stages access', 'Advanced analytics']
    },
    'enterprise': {
      title: 'Enterprise Plan Required',
      description: 'Upgrade to Enterprise plan to unlock this stage.',
      price: '₹5,999 / 6 months',
      features: ['Everything in Professional', 'Dedicated support', 'Custom branding']
    }
  };

  const info = tierInfo[requiredTier] || tierInfo['professional'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{info.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{stageName}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-900">{info.description}</p>
          </div>

          <div className="mb-6">
            <div className="text-2xl font-bold text-gray-900 mb-4">{info.price}</div>
            <div className="space-y-2">
              {info.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PremiumRequiredModal;