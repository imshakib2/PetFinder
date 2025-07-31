import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Heart, Edit, Save, X, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePets } from '../context/PetContext';
import { formatDistanceToNow } from 'date-fns';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { fetchUserPets } = usePets();
  const [userPets, setUserPets] = useState([]);
  const [userStats, setUserStats] = useState({
    totalReported: 0,
    reunitedPets: 0,
    activePets: 0,
    lostPets: 0,
    foundPets: 0
  });
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: {
      area: user?.location?.area || '',
      city: user?.location?.city || ''
    }
  });
  const [errors, setErrors] = useState({});

  // Fetch user's pets when component mounts
  useEffect(() => {
    if (user) {
      loadUserPets();
    }
  }, [user]);

  const loadUserPets = async () => {
    setIsLoadingPets(true);
    try {
      const data = await fetchUserPets();
      setUserPets(data.pets);
      setUserStats(data.statistics);
    } catch (error) {
      console.error('Error fetching user pets:', error);
      setUserPets([]);
      setUserStats({
        totalReported: 0,
        reunitedPets: 0,
        activePets: 0,
        lostPets: 0,
        foundPets: 0
      });
    } finally {
      setIsLoadingPets(false);
    }
  };
  
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.location.area.trim()) {
      newErrors.area = 'Area is required';
    }
    
    if (!formData.location.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
    // Reset form data to current user data
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      location: {
        area: user?.location?.area || '',
        city: user?.location?.city || ''
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      location: {
        area: user?.location?.area || '',
        city: user?.location?.city || ''
      }
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        location: formData.location
      });
      
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
      // Refresh user pets in case contact info changed
      loadUserPets();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-full p-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <div className="flex items-center text-blue-100 mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined {formatMemberSince(user.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium flex items-center space-x-2"
                >
                  <Edit className="h-5 w-5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    <span>{isLoading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                  >
                    <X className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          {message.text && (
            <div className={`mx-8 mt-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                
                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Area
                        </label>
                        <input
                          type="text"
                          name="location.area"
                          value={formData.location.area}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.area ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Area"
                        />
                        {errors.area && <p className="text-red-600 text-sm mt-1">{errors.area}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="location.city"
                          value={formData.location.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.city ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="City"
                        />
                        {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <User className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900 text-lg">{user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Mail className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                        <div className="flex items-center mt-1">
                          {user.isVerified ? (
                            <span className="text-green-600 text-sm flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Verified
                            </span>
                          ) : (
                            <span className="text-yellow-600 text-sm flex items-center">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Phone className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">
                          {user.location?.area && user.location?.city 
                            ? `${user.location.area}, ${user.location.city}` 
                            : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Summary */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity Summary</h2>
                {isLoadingPets ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading activity...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Pets Reported</p>
                          <p className="text-3xl font-bold text-blue-900">{userStats.totalReported}</p>
                        </div>
                        <Heart className="h-10 w-10 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Pets Reunited</p>
                          <p className="text-3xl font-bold text-green-900">{userStats.reunitedPets}</p>
                        </div>
                        <Heart className="h-10 w-10 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600 font-medium">Active Reports</p>
                          <p className="text-3xl font-bold text-yellow-900">{userStats.activePets}</p>
                        </div>
                        <Heart className="h-10 w-10 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              {isLoadingPets ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading recent activity...</p>
                </div>
              ) : userPets && userPets.length > 0 ? (
                <div className="space-y-4">
                  {userPets.slice(0, 5).map((pet) => (
                    <div key={pet._id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        {pet.images && pet.images.length > 0 ? (
                          <img
                            src={pet.images[0].data}
                            alt={pet.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=100&q=80';
                            }}
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            pet.status === 'lost' ? 'bg-red-100' : 
                            pet.status === 'found' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <Heart className={`h-6 w-6 ${
                              pet.status === 'lost' ? 'text-red-600' : 
                              pet.status === 'found' ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {pet.name} ({pet.breed})
                          </p>
                          <p className="text-sm text-gray-500">
                            {pet.status === 'lost' ? 'Reported Lost' : 
                             pet.status === 'found' ? 'Reported Found' : 
                             pet.status === 'reunited' ? 'Reunited' : 'Reported'} • {formatDistanceToNow(new Date(pet.dateReported), { addSuffix: true })}
                          </p>
                          <p className="text-sm text-gray-400">
                            {pet.location.area}, {pet.location.city}
                          </p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        pet.status === 'lost' ? 'bg-red-100 text-red-800' :
                        pet.status === 'found' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                      </span>
                    </div>
                  ))}
                  {userPets.length > 5 && (
                    <div className="text-center pt-4">
                      <p className="text-gray-500 text-sm">
                        Showing 5 of {userPets.length} reports
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pet reports yet. Start by reporting a lost or found pet!</p>
                  <Link
                    to="/report"
                    className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Report a Pet
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;