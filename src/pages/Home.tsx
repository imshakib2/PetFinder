import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, MapPin, Heart, ArrowRight } from 'lucide-react';
import { usePets } from '../context/PetContext';
import PetCard from '../components/PetCard';

const Home = () => {
  const { recentPets } = usePets();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Lost your pet? <br />
              <span className="text-yellow-300">Let the community help!</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Report lost or found pets and reunite with them faster using AI-powered detection and community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/report"
                className="inline-flex items-center bg-yellow-400 text-blue-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
              >
                <PlusCircle className="h-6 w-6 mr-2" />
                Report Pet
              </Link>
              <Link
                to="/lost-pets"
                className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <Search className="h-6 w-6 mr-2" />
                Search Pets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How PetFinder Works</h2>
            <p className="text-xl text-gray-600">Simple steps to reunite pets with their families</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">View Lost Pets</h3>
              <p className="text-gray-600 mb-6">Browse recently reported missing pets in your area and help reunite them with their owners.</p>
              <Link
                to="/lost-pets"
                className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                Browse Lost Pets
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <PlusCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Report a Lost Pet</h3>
              <p className="text-gray-600 mb-6">Post details about your missing pet and alert nearby users instantly.</p>
              <Link
                to="/report"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Report Lost Pet
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Report a Found Pet</h3>
              <p className="text-gray-600 mb-6">Found an animal? Submit the details and help them get back home quickly.</p>
              <Link
                to="/report"
                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Report Found Pet
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Reported */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recently Reported</h2>
            <p className="text-xl text-gray-600">Help these pets find their way home</p>
          </div>
          
          {recentPets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No pets reported yet. Be the first to help!</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/lost-pets"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              View All Pets
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-xl opacity-90">Pets Reunited</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-xl opacity-90">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-xl opacity-90">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;