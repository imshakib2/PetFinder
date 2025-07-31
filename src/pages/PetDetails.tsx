import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Phone, Mail, Award, ArrowLeft, Share2 } from 'lucide-react';
import { usePets } from '../context/PetContext';
import { formatDistanceToNow } from 'date-fns';

const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getPetById } = usePets();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      
      try {
        const petData = await getPetById(id);
        setPet(petData);
      } catch (err) {
        setError('Pet not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, getPetById]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pet.status === 'lost' ? 'Lost' : 'Found'} Pet: ${pet.name}`,
          text: `Help find ${pet.name} - ${pet.breed}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'found':
        return 'bg-green-100 text-green-800';
      case 'reunited':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImageSrc = (index: number = 0) => {
    if (pet.images && pet.images.length > index && pet.images[index].data) {
      return pet.images[index].data;
    }
    return `https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet Not Found</h2>
          <p className="text-gray-600 mb-6">The pet you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <button
            onClick={handleShare}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={getImageSrc(currentImageIndex)}
                  alt={pet.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if Base64 image fails to load
                    e.currentTarget.src = `https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80`;
                  }}
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(pet.status)}`}>
                    {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                  </span>
                </div>

                {/* Reward Badge */}
                {pet.reward > 0 && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>Reward: ${pet.reward}</span>
                  </div>
                )}
              </div>

              {/* Image Navigation */}
              {pet.images && pet.images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto">
                    {pet.images.map((image: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.data}
                          alt={`${pet.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if Base64 image fails to load
                            e.currentTarget.src = `https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=80&q=80`;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pet Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{pet.name}</h1>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{pet.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Breed:</span>
                  <span className="font-medium">{pet.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-medium">{pet.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{pet.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{pet.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium">{pet.gender}</span>
                </div>
              </div>
            </div>

            {/* Location & Date */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location & Date</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{pet.location.area}</p>
                    <p className="text-gray-600">{pet.location.city}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {pet.status === 'lost' ? 'Lost' : 'Found'} {formatDistanceToNow(new Date(pet.dateLostOrFound), { addSuffix: true })}
                    </p>
                    <p className="text-gray-600">
                      Reported {formatDistanceToNow(new Date(pet.dateReported), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900 mb-2">{pet.contactInfo.name}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <a
                    href={`tel:${pet.contactInfo.phone}`}
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    {pet.contactInfo.phone}
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <a
                    href={`mailto:${pet.contactInfo.email}`}
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    {pet.contactInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{pet.description}</p>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            {pet.status === 'lost' ? 'Have you seen this pet?' : 'Is this your pet?'}
          </h2>
          <p className="text-lg mb-6 opacity-90">
            {pet.status === 'lost'
              ? 'If you have any information about this pet, please contact the owner immediately.'
              : 'If this is your pet, please contact the finder as soon as possible.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${pet.contactInfo.phone}`}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Call Now
            </a>
            <a
              href={`mailto:${pet.contactInfo.email}`}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;