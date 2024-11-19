// components/Footer.js

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted text-gray-800  pt-12 border-t border-gray-200">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-0">
        {/* About Us */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Lobodent Dental Clinic</h2>
          <p className="text-sm text-gray-600">
            At Lobodent Dental Clinic, we are committed to providing you with
            the highest quality dental care in a comfortable and friendly
            environment.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul>
            <li className="mb-2">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                About Us
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/#services"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Our Services
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/#feedback"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Feedbacks
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/appointment"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Book Appointment
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <ul>
            <li className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm text-gray-600">
                Brgy 1, R Building, Jose P Laurel Highway Marawoy Lipa City
              </span>
            </li>
            <li className="flex items-center mb-2">
              <Phone className="w-5 h-5 text-gray-600 mr-2" />
              <Link
                href="tel:+1234567890"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                0912 032 2767
              </Link>
            </li>
            <li className="flex items-center mb-2">
              <Mail className="w-5 h-5 text-gray-600 mr-2" />
              <Link
                href="mailto:info@lobodent.com"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Erica1997lobo@gmail.com
              </Link>
            </li>
          </ul>

          {/* Social Media */}
          <div className="flex mt-4 space-x-4">
            <Link
              href="https://www.facebook.com/Lobodental1127"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors duration-200" />
              Lobodent Dental Clinic
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-300 pt-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Lobodent Dental Clinic. All rights
        reserved.
      </div>
    </footer>
  );
}
