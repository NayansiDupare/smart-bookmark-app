"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="navbar fixed top-0 w-full z-50 bg-card/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full">

          <h1 className="text-xl font-bold">
            Smart Bookmark
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/#home" className="hover:text-primary transition">
              Home
            </Link>
            <Link href="/#features" className="hover:text-primary transition">
              Features
            </Link>
            <Link href="/#about" className="hover:text-primary transition">
              About
            </Link>
            <Link href="/#contact" className="hover:text-primary transition">
              Contact
            </Link>
            <Link href="/login">
              <button className="btn-primary">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Icon */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col p-8">

          {/* Top Bar */}
          <div className="flex justify-between items-center mb-16">
            <h1 className="text-xl font-bold">
              Smart Bookmark
            </h1>

            <button onClick={() => setIsOpen(false)}>
              <X size={28} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col items-center gap-8 text-lg">

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="hover:text-primary transition"
            >
              Home
            </Link>

            <Link
              href="/#features"
              onClick={() => setIsOpen(false)}
              className="hover:text-primary transition"
            >
              Features
            </Link>

            <Link
              href="/#about"
              onClick={() => setIsOpen(false)}
              className="hover:text-primary transition"
            >
              About
            </Link>

            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className="hover:text-primary transition"
            >
              Contact
            </Link>

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-xs"
            >
              <button className="btn-primary w-full mt-6">
                Login
              </button>
            </Link>

          </div>
        </div>
      )}
    </>
  );
}
