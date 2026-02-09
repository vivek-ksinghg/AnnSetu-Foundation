// src/component/Footer.jsx
import React from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
} from 'lucide-react';
import { assets } from '../assets/assets';

const Footer1 = () => {
  return (
    
    <footer className="w-full bg-green-100 text-green-900 pt-12 pb-6 mt-10 px-6 ">
  {/* Full width container with padding */}

  <div className="flex flex-wrap justify-between items-start gap-10 w-full">
    {/* No max width, full width flex container */}

    {/* About + Logo */}
    <div className="flex-1 min-w-[250px] mb-6">
      <img
        src={assets.logo}
        alt="Food Share Logo"
        className="h-16 mb-4 w-auto"
      />
      <p className="text-sm">
        🌱 A community-powered platform connecting food donors with NGOs to reduce waste and feed the hungry.
      </p>
    </div>

    {/* Quick Links */}
    <div className="flex-1 min-w-[150px] mb-6">
      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>🔗</span> Quick Links
      </h4>
      <ul className="space-y-2 text-sm">
        <li>
          <a href="/home" className="hover:text-green-600 flex items-center gap-2">
            <span>🏠</span> Home
          </a>
        </li>
        <li>
          <a href="/role" className="hover:text-green-600 flex items-center gap-2">
            <span>👥</span> Join Now
          </a>
        </li>
        <li>
          <a href="/about/faq" className="hover:text-green-600 flex items-center gap-2">
            <span>❓</span> FAQs
          </a>
        </li>
      </ul>
    </div>

    {/* Contact Info */}
    <div className="flex-1 min-w-[200px] mb-6">
      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>📞</span> Contact
      </h4>
      <div className="flex items-center gap-2 mb-2">
        <Mail className="text-green-700" size={18} />
        <span className="text-sm">support@foodshare.org</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="text-green-700" size={18} />
        <span className="text-sm">+91 98765 43210</span>
      </div>
    </div>

    {/* Social Media */}
    <div className="flex-1 min-w-[150px] mb-6">
      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>📣</span> Follow Us
      </h4>
      <div className="flex flex-col space-y-3 text-sm">
        <a href="https://www.facebook.com/" className="flex items-center gap-2 hover:text-green-600">
          <Facebook size={18} /> Facebook
        </a>
        <a href="https://www.instagram.com/" className="flex items-center gap-2 hover:text-green-600">
          <Instagram size={18} /> Instagram
        </a>
        <a href="https://x.com/" className="flex items-center gap-2 hover:text-green-600">
          <Twitter size={18} /> Twitter
        </a>
      </div>
    </div>
  </div>

  {/* Bottom line with logo */}
  <div className="mt-12 border-t border-green-400 pt-6 px-6 text-center w-full">
    <img
      src={assets.logo}
      alt="Footer Logo"
      className="h-10 mx-auto mb-2 w-auto"
    />
    <p className="text-sm text-green-800">
      © 2025 🥗 Food Share. All Rights Reserved.
    </p>
  </div>
</footer>

  );
};

export default Footer1;