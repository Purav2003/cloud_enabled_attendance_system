import React from 'react';
import { motion } from 'framer-motion'; // For animations
import Link from 'next/link'; // For navigation links
import { BsEnvelope, FiPhone, CiLocationOn } from 'react-icons/fi'; // Replace with desired icons


export default function Footer()  {
    return (
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }} // Subtle fade-in animation
        className="fixed-bottom bg-gradient-to-r from-pink-500 to-orange-500" // Replace with desired background
        style={{
          // Add additional styling based on preferences (e.g., font family, text color, padding)
        }}
      >
        <div className="mx-auto w-full max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-20 py-6 lg:py-8">
            {/* Contact Section */}
            <div>
              <h2 className="mb-6 text-sm font-bold text-white uppercase">
                Contact Us
              </h2>
              <ul className="text-white font-medium">
                <li className="mb-4 flex items-center">
                  <FiPhone className="text-[17px] text-white" />
                  <label className="pl-2 text-white">+91-223321221</label>
                </li>
                <li className="mb-4 flex items-center">
                  <BsEnvelope className="text-[17px] text-white" />
                  <label className="pl-2 text-white">aaaaa@aaaa.com</label>
                </li>
                {/* Add interactive elements, social media icons, etc. based on preferences */}
              </ul>
            </div>
  
            {/* Address Section */}
            <div>
              <h2 className="mb-6 text-sm font-bold text-white uppercase">
                Address
              </h2>
              <ul className="text-white font-medium">
                <li className="mb-4 flex items-center">
                  <CiLocationOn className="text-[17px] text-white" />
                  <label className="pl-2 text-white">Lorem ipsum dolor...</label>
                </li>
                {/* Add map illustration or interactive elements based on preferences */}
              </ul>
            </div>
  
            {/* Additional sections (e.g., About Us, Links) based on requirements */}
            {/* ... */}
  
            {/* Copyright Section */}
            <div className="px-4 py-6 bg-rgba-0-0-0-0.2 items-center text-center">
              <span className="text-sm text-center text-white">
                © 2024 <Link href="/"><a className="text-white font-semibold">Attendance System</a></Link>. All Rights Reserved.
              </span>
            </div>
          </div>
        </div>
      </motion.footer>
    );
  };