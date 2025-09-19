import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SlSocialLinkedin } from "react-icons/sl";
import React from "react";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

const Footer = () => {
  const kitchenLogo = "/images/kitchen/kitchen-logo.png";
  const tilottoma = "/images/kitchen/tilottoma.png";
  const nextBook = "/images/kitchen/nextbook.png";
  const footerImage = "/images/kitchen/footer.png";

  const currentYear = new Date().getFullYear();
  return (
    <div
      className="w-full bg-black bg-cover bg-center print:hidden"
      style={{ backgroundImage: `url(${footerImage})` }}
    >
      {/* Main Footer Section */}
      <div className="container mx-auto py-10 lg:py-20 px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-16">
        {/* Logo and Concerns */}
        <div className="col-span-2 w-full flex flex-col items-center lg:items-start">
          <Image
            src={kitchenLogo}
            width={291}
            height={59}
            alt="logo"
            priority
          />
          <p className="text-base font-bold mt-8 text-white text-center">
            Our Concerns
          </p>
          <div className="w-full flex justify-center lg:justify-start items-center  gap-4 mt-4">
            <Image src={tilottoma} width={143} height={32} alt="Tilottoma" />
            <Image src={nextBook} width={124} height={31} alt="NextBook" />
          </div>
        </div>

        {/* Social Links */}
        <div className="col-span-1">
          <h2 className="text-base font-bold text-white">Social Links</h2>
          <div className="flex flex-col mt-6 gap-4 text-gray-200">
            <Link
              href="https://www.facebook.com/mykitchenTBG"
              className="flex items-center gap-2 hover:text-red-800"
            >
              <FaFacebookF />
              <span>Facebook</span>
            </Link>

            {/* <Link
							href="#"
							target="_blank"
							className="flex items-center gap-2 hover:text-red-800"
						>
							<FaInstagram />
							<span>Instagram</span>
						</Link> */}
            <Link
              href="https://bd.linkedin.com/company/mykitchenofficial"
              target="_blank"
              className="flex items-center gap-2 hover:text-red-800"
            >
              <SlSocialLinkedin />
              <span>LinkedIn</span>
            </Link>
          </div>
        </div>

        {/* Useful Links */}
        <div className="col-span-1">
          <h2 className="text-base font-bold text-white">Useful Links</h2>
          <div className="flex flex-col mt-6 gap-4 text-gray-200">
            <Link href="/privacy-policy" className="hover:text-red-800">
              Privacy Policy
            </Link>
            <Link href="/terms-&-conditions" className="hover:text-red-800">
              Terms & Conditions
            </Link>
          </div>
        </div>

        {/* Products */}
        <div className="col-span-1">
          <h2 className="text-base font-bold text-white">Products</h2>
          <div className="flex flex-col mt-6 gap-4 text-gray-200">
            <Link href="/expertise/kitchen-area" className="hover:text-red-800">
              Kitchen
            </Link>
            <Link href="" className="hover:text-red-800">
              Counter Top
            </Link>
            <Link href="/expertise/wardrobes" className="hover:text-red-800">
              Wardrobes
            </Link>
            <Link
              href="/expertise/walk-in-closets"
              className="hover:text-red-800"
            >
              Walk-in Closets
            </Link>
            <Link href="/expertise/vanities" className="hover:text-red-800">
              Vanities
            </Link>
            <Link href="/expertise/accessories" className="hover:text-red-800">
              Accessories
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="col-span-1">
          <h2 className="text-base font-bold text-white">Talk To Us</h2>
          <div className="flex flex-col mt-6 gap-4 text-gray-200">
            <Link href="/feedback" className="hover:text-red-800">
              Feedback
            </Link>
            <Link href="/contact" className="hover:text-red-800">
              Contacts
            </Link>
          </div>
        </div>

        {/* Newsletter */}
        {/* <div className="col-span-2 md:col-span-3 lg:col-span-2 md:flex flex-col justify-center  items-start lg:justify-start lg:items-start">
					<h2 className="text-base font-bold text-white">
						Subscribe to our newsletter
					</h2>
					<form className="mt-6">
						<input
							type="email"
							placeholder="Email address"
							className="w-full bg-transparent border-b-2 border-white text-lg font-medium text-white px-1 outline-none placeholder-gray-500"
						/>
						<button
							type="submit"
							className="mt-4 w-40 py-3 bg-white text-black text-center rounded-md hover:scale-95 transition-transform"
						>
							Subscribe
						</button>
					</form>
				</div> */}
      </div>

      {/* Footer Bottom */}
      <div className="w-full bg-brandColorLs py-2 px-2 flex justify-center items-center text-gray-300 text-xs text-center md:text-sm md:text-start">
        <p>
          Copyright © {currentYear} | All rights reserved by Tilottoma Bangla
          Group | Crafted & Developed by{" "}
          <Link
            href={"https://www.creativematter.agency/"}
            target="_blank"
            className="hover:text-brandColor"
          >
            {" "}
            {`Creative Matter`}
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Footer;
