import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
        <div className="md:max-w-96">
          <div className="logo-container">
            <span className='logo-text'>Movie<span>Swift</span></span>
          </div>
          <p className="mt-6 text-sm">
            Experience the latest blockbusters with the fastest booking system. Your premium gateway to a world of cinema and entertainment.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <img
              src={assets.googlePlay}
              alt="google play"
              className="h-9 w-auto"
            />
            <img src={assets.appStore} alt="app store" className="h-9 w-auto" />
          </div>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5 uppercase tracking-wider text-white">Company</h2>
            <ul className="text-sm space-y-3">
              <li><a href="#" className="hover:text-primary transition">Home</a></li>
              <li><a href="#" className="hover:text-primary transition">About us</a></li>
              <li><a href="#" className="hover:text-primary transition">Contact us</a></li>
              <li><a href="#" className="hover:text-primary transition">Privacy policy</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5 uppercase tracking-wider text-white">Get in touch</h2>
            <div className="text-sm space-y-3">
              <p className="hover:text-primary transition">
                <a href="tel:+916352674940">+91 6352674940</a>
              </p>
              <p className="hover:text-primary transition">
                <a href="mailto:harshhh.p21@gmail.com">harshhh.p21@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © Movieswift. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
