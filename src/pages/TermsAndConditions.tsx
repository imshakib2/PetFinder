import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-white hover:text-blue-100 transition-colors duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-3xl font-bold text-white">Terms and Conditions</h1>
            </div>
          </div>

          <div className="p-8 prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: January 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using PetFinder, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily download one copy of PetFinder per device for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on PetFinder</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                When using PetFinder, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide accurate and truthful information about lost or found pets</li>
                <li>Respect the privacy and safety of other users</li>
                <li>Not use the service for any illegal or unauthorized purpose</li>
                <li>Not post false, misleading, or fraudulent content</li>
                <li>Verify the identity of pets and their owners before facilitating reunions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Pet Safety and Verification</h2>
              <p className="text-gray-700 mb-4">
                PetFinder is a platform to help reunite lost pets with their families. We strongly recommend:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Always meet in public places when arranging pet returns</li>
                <li>Verify pet ownership through veterinary records, photos, or other documentation</li>
                <li>Contact local authorities if you suspect fraudulent activity</li>
                <li>Never provide personal financial information to other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                to understand our practices regarding the collection and use of your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The materials on PetFinder are provided on an 'as is' basis. PetFinder makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties including without limitation, 
                implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
                of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitations</h2>
              <p className="text-gray-700 mb-4">
                In no event shall PetFinder or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use PetFinder, even if PetFinder or a PetFinder authorized representative has been notified orally or 
                in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Revisions and Errata</h2>
              <p className="text-gray-700 mb-4">
                The materials appearing on PetFinder could include technical, typographical, or photographic errors. 
                PetFinder does not warrant that any of the materials on its website are accurate, complete, or current. 
                PetFinder may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Email: legal@petfinder.com<br />
                  Phone: +1 (555) 123-4567<br />
                  Address: 123 Pet Street, Dhaka, Bangladesh 1000
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;