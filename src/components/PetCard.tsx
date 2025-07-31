import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Pet {
  _id: string;
  name: string;
  type: string;
  breed: string;
  color: string;
  status: string;
  location: {
    area: string;
    city: string;
  };
  dateReported: string;
  images: Array<{
    data: string;
    contentType: string;
  }>;
  reward: number;
}

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
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

  // Get the first image or use a default placeholder
  const getImageSrc = () => {
    if (pet.images && pet.images.length > 0 && pet.images[0].data) {
      return pet.images[0].data;
    }
    return `https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={getImageSrc()}
          alt={pet.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback to placeholder if Base64 image fails to load
            e.currentTarget.src = `https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80`;
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pet.status)}`}>
            {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
          </span>
        </div>
        {pet.reward > 0 && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Award className="h-3 w-3" />
            <span>${pet.reward}</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {pet.type}
          </span>
        </div>
        
        <p className="text-gray-600 mb-3">{pet.breed} • {pet.color}</p>
        
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{pet.location.area}, {pet.location.city}</span>
        </div>
        
        <div className="flex items-center text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {formatDistanceToNow(new Date(pet.dateReported), { addSuffix: true })}
          </span>
        </div>
        
        <Link
          to={`/pet/${pet._id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PetCard;