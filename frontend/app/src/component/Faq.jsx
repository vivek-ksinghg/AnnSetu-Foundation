import React, { useState } from "react";

// Sample FAQ data with 14 questions
const faqData = [
  { question: "What is the Robin Hood Army?", answer: "The Robin Hood Army is a volunteer-based organization that works to feed the hungry in communities across the world." },
  { question: "How did this start?", answer: "It started when a group of friends wanted to reduce food wastage and help those in need." },
  { question: "Where are you active?", answer: "We are active in multiple cities across different countries." },
  { question: "Do you collect funds?", answer: "We do not collect funds; we operate through volunteers and donations of food." },
  { question: "How do you manage without money?", answer: "We rely on volunteers and partnerships with restaurants and food providers." },
  { question: "How can I volunteer?", answer: "You can join as a volunteer or help spread the word about our mission." },
  { question: "Do volunteers get certificates?", answer: "Yes, active volunteers receive a certificate recognizing their contribution." },
  { question: "Can I donate money?", answer: "We do not accept monetary donations; you can donate food or volunteer your time." },
  { question: "How can I start a chapter?", answer: "Reach out to us and we will guide you to start a chapter in your city." },
  { question: "What kind of food do you distribute?", answer: "We distribute cooked meals as well as packaged food that is safe to consume." },
  { question: "Who can join as a volunteer?", answer: "Anyone above 16 years of age can volunteer with us." },
  { question: "How often can I volunteer?", answer: "You can volunteer as often as you like, there’s no minimum commitment." },
  { question: "Can I donate excess food from events?", answer: "Yes, we welcome surplus food from events and functions." },
  { question: "How can I contact you?", answer: "You can contact us at +91 9569460390 or via our social media channels." },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container mt-12" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px", backgroundColor: "#f0f4f8", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#1a73e8", marginBottom: "40px" }}>Frequently Asked Questions</h1>

      <div style={{ width: "80%", maxWidth: "900px" }}>
        {faqData.map((faq, index) => (
          <div key={index} style={{ marginBottom: "15px", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
            <div
              style={{
                padding: "15px 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: activeIndex === index ? "#e8f0fe" : "#f7f9fc",
                transition: "all 0.3s",
                fontWeight: "bold",
                color: "#333",
              }}
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span style={{ fontSize: "1.5rem" }}>{activeIndex === index ? "-" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div style={{ padding: "15px 20px", color: "#555", backgroundColor: "#f7f9fc", lineHeight: "1.6", transition: "all 0.3s" }}>
                {faq.answer}
              </div>
            )}
          </div>

        
        ))}
      </div>

      
      
    </div>
  );
};

export default FAQ;
