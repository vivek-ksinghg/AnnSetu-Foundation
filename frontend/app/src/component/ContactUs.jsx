import React from "react";
import { Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";

const ContactUs = () => {
  const contacts = [
    {
      icon: <Mail className="w-10 h-10 text-blue-500" />,
      title: "Email",
      detail: "AnnSetu18@gmail.com",
    },
    {
      icon: <Phone className="w-10 h-10 text-green-500" />,
      title: "Phone",
      detail: "+91 9122685885",
    },
    {
      icon: <Facebook className="w-10 h-10 text-blue-700" />,
      title: "Facebook",
      detail: "AnnSetu Foundation",
    },
    {
      icon: <Instagram className="w-10 h-10 text-pink-500" />,
      title: "Instagram",
      detail: "@AnnSetuFoundation",
    },
    {
      icon: <Twitter className="w-10 h-10 text-sky-500" />,
      title: "Twitter",
      detail: "@AnnSetuFoundation",
    },
  ];
return (
  <section className="py-24 bg-linear-to-br from-blue-50 via-white to-green-50">
    <div className="max-w-6xl mx-auto px-6">

      {/* 🔹 Top Text Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-4">
          Contact Us
        </h2>

        <p className="text-lg text-gray-600 leading-relaxed">
          Welcome to{" "}
          <span className="font-semibold text-blue-600">
            AnnSetu Foundation
          </span>{" "}
          — a community-driven platform dedicated to fighting food waste and hunger.
          We connect donors with NGOs to ensure surplus food reaches those who need it most.
          Feel free to reach out through the channels below.
        </p>
      </div>

      {/* 🔹 Cards Section */}
      <div className="flex flex-col items-center gap-10">

        {/* Row 1 → Two Cards */}
        <div className="grid sm:grid-cols-2 gap-8 w-full max-w-4xl">
          {contacts.slice(0, 2).map((contact, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-lg border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all text-center"
            >
              <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 to-green-100">
                {contact.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                {contact.title}
              </h3>

              <p className="text-sm text-gray-600">
                {contact.detail}
              </p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-8 w-full max-w-4xl">
          {contacts.slice(2, 4).map((contact, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-lg border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all text-center"
            >
              <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 to-green-100">
                {contact.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                {contact.title}
              </h3>

              <p className="text-sm text-gray-600">
                {contact.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Row 2 → Center Card */}
        <div className="w-full flex justify-center">
          {contacts.slice(4, 5).map((contact, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-lg border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all text-center w-full max-w-md"
            >
              <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 to-green-100">
                {contact.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                {contact.title}
              </h3>

              <p className="text-sm text-gray-600">
                {contact.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  </section>
);


};

export default ContactUs;
