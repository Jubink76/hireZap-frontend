import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, User, Mail, Phone, Save } from 'lucide-react';

const ScheduleInterviewModal = ({ 
  isOpen, 
  onClose, 
  candidate, 
  onSchedule,
  existingSchedule = null 
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 30,
    timezone: 'America/New_York',
    notes: '',
    sendNotification: true,
    sendEmail: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingSchedule) {
      const scheduledDate = new Date(existingSchedule.scheduled_at);
      setFormData({
        date: scheduledDate.toISOString().split('T')[0],
        time: scheduledDate.toTimeString().slice(0, 5),
        duration: existingSchedule.duration || 30,
        timezone: existingSchedule.timezone || 'America/New_York',
        notes: existingSchedule.notes || '',
        sendNotification: true,
        sendEmail: true
      });
    } else {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData(prev => ({
        ...prev,
        date: tomorrow.toISOString().split('T')[0],
        time: '10:00'
      }));
    }
  }, [existingSchedule, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (formData.duration < 15 || formData.duration > 120) {
      newErrors.duration = 'Duration must be between 15 and 120 minutes';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Combine date and time
      const scheduledDateTime = new Date(`${formData.date}T${formData.time}`);
      
      const scheduleData = {
        candidate_id: candidate.id,
        scheduled_at: scheduledDateTime.toISOString(),
        duration: formData.duration,
        timezone: formData.timezone,
        notes: formData.notes,
        send_notification: formData.sendNotification,
        send_email: formData.sendEmail
      };
      
      await onSchedule(scheduleData);
      onClose();
    } catch (error) {
      console.error('Failed to schedule interview:', error);
      alert('Failed to schedule interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {existingSchedule ? 'Reschedule Interview' : 'Schedule Telephonic Interview'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {existingSchedule ? 'Update interview schedule' : 'Set up a telephonic round interview'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Candidate Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Candidate Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-900">{candidate.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{candidate.phone}</span>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.date && (
                <p className="text-xs text-red-600 mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.time && (
                <p className="text-xs text-red-600 mt-1">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Duration and Timezone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleChange('duration', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
              {errors.duration && (
                <p className="text-xs text-red-600 mt-1">{errors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Australia/Sydney">Sydney (AEDT)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any special instructions or notes for the interview..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              These notes will be visible to both you and the candidate
            </p>
          </div>

          {/* Notification Options */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Notification Settings
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendNotification}
                  onChange={(e) => handleChange('sendNotification', e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Send In-App Notification</span>
                  <p className="text-xs text-gray-600">Candidate will receive a notification in their dashboard</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendEmail}
                  onChange={(e) => handleChange('sendEmail', e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Send Email Notification</span>
                  <p className="text-xs text-gray-600">Candidate will receive an email with interview details</p>
                </div>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Schedule Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium text-gray-900">
                  {formData.date && formData.time 
                    ? new Date(`${formData.date}T${formData.time}`).toLocaleString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">{formData.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timezone:</span>
                <span className="font-medium text-gray-900">
                  {formData.timezone.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {existingSchedule ? 'Update Schedule' : 'Schedule Interview'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;