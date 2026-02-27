"use client";
 

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Search, Folder } from "lucide-react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";




export default function Home() {

  const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [message, setMessage] = useState("");

      const handleSubmit = async () => {
  if (!name || !email || !message) {
    return toast.error("Please fill all fields");
  }

  const { error } = await supabase
    .from("contact_messages")
    .insert([{ name, email, message }]);

  if (error) {
    toast.error("Failed to send message");
  } else {
    toast.success("Message sent successfully!");
    setName("");
    setEmail("");
    setMessage("");
  }
};

  
  return (
    <div className="bg-background text-foreground">

      <Navbar />

      {/* HERO */}
      <section
        id="home"
        className="pt-32 pb-24 px-10"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-6">
              Powerful. Organized. Effortless.
            </h2>

            <p className="text-primary mb-8 text-lg">
              Save, organize, search and manage
              your bookmarks in one clean system.
            </p>

            <Link href="/login">
              <button className="btn-primary">
                Get Started Free
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/images/hero.png"
              alt="Hero"
              width={600}
              height={500}
              className="w-full"
            />
          </motion.div>

        </div>
      </section>

      {/* FEATURES */}
<section
  id="features"
  className="py-24 px-10 bg-soft"
>
  <h2 className="text-4xl font-bold text-center mb-16">
    Organize your bookmarks.
  </h2>

  <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

    {[
      {
        title: "Smart Dashboard",
        desc: "Manage all bookmarks in one clean and powerful interface.",
        Icon: LayoutDashboard,
      },
      {
        title: "Search & Filter",
        desc: "Quickly find bookmarks with intelligent search and filtering.",
        Icon: Search,
      },
      {
        title: "Folder Structure",
        desc: "Organize links into folders and keep everything structured.",
        Icon: Folder,
      },
    ].map((feature, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="
          relative card text-center
          border border-transparent
          hover:border-primary
          hover:scale-105 hover:-translate-y-2
          hover:shadow-[0_0_25px_rgba(135,134,114,0.4)]
          transition duration-300
          cursor-pointer
        "
      >
        {/* Glow Layer */}
        <div className="
          absolute inset-0 rounded-2xl
          opacity-0 hover:opacity-100
          transition duration-300
          pointer-events-none
          bg-gradient-to-r from-primary/10 via-transparent to-primary/10
        " />

        <div className="relative z-10">
          <feature.Icon
            size={40}
            className="mx-auto mb-6 text-primary transition"
          />

          <h3 className="font-semibold text-xl mb-4">
            {feature.title}
          </h3>

          <p className="text-primary">
            {feature.desc}
          </p>
        </div>
      </motion.div>
    ))}

  </div>
</section>

      {/* ABOUT */}
      <section
        id="about"
        className="py-24 px-10"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/about.png"
              alt="About"
              width={600}
              height={500}
              className="w-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Built for productivity.
            </h2>

            <p className="text-primary text-lg mb-6">
              Smart Bookmark is designed to help
              students, developers, and teams
              manage links without clutter.
            </p>

            <p>
              Clean UI. Fast performance.
              Secure Google authentication.
            </p>
          </motion.div>

        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="py-24 px-10 bg-soft"
      >
        <h2 className="text-4xl font-bold text-center mb-12">
          Contact Us
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto card space-y-4"
        >
          <input
            placeholder="Your Name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Your Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            placeholder="Your Message"
            className="input-field h-32"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />


          <button onClick={handleSubmit} className="btn-primary w-full">
            Send Message
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 border-t">
        © {new Date().getFullYear()} Smart Bookmark
      </footer>
    </div>
  );
}
