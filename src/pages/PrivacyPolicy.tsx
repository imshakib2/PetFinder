import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            </div>
          </div>

          <div className="p-8 prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: January 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                report a lost or found pet, or contact us for support.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Name and contact information (email, phone number)</li>
                <li>Location information (city, area)</li>
                <li>Pet information (photos, descriptions, location data)</li>
                <li>Account credentials and preferences</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Automatically Collected Information:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Device information and IP address</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Help reunite lost pets with their families</li>
                <li>Send you notifications about potential pet matches</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Communicate with you about products, services, and events</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We may share information about you as follows:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>With other users when you post information about lost or found pets</li>
                <li>With service providers who perform services on our behalf</li>
                <li>In response to legal requests or to protect rights and safety</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
                <li>With your consent or at your direction</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We take reasonable measures to help protect information about you from loss, theft, 
                misuse, unauthorized access, disclosure, alteration, and destruction. However, no 
                internet or electronic storage system is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We store the information we collect about you for as long as is necessary for the 
                purpose(s) for which we originally collected it. We may retain certain information 
                for legitimate business purposes or as required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Access, update, or delete your personal information</li>
                <li>Opt out of certain communications from us</li>
                <li>Request a copy of your personal data</li>
                <li>Object to processing of your personal information</li>
                <li>Request restriction of processing your personal information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our service is not directed to children under 13. We do not knowingly collect 
                personal information from children under 13. If we learn that we have collected 
                personal information from a child under 13, we will delete that information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may change this privacy policy from time to time. If we make changes, we will 
                notify you by revising the date at the top of the policy and, in some cases, 
                provide additional notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Email: privacy@petfinder.com<br />
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

export default PrivacyPolicy;