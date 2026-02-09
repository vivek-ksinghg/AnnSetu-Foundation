// // export const chatbotData = [
// //   {
// //     keywords: ["how it works", "process", "platform process", "workflow"],
// //     response:
// //       "This platform connects food donors with nearby verified NGOs. Donors submit food details, NGOs get notified, and food is distributed efficiently."
// //   },
// //   {
// //     keywords: ["food waste", "reduce food waste", "reduces food waste", "waste reduction", "prevent food waste"],
// //     response:
// //       "Yes, it reduces food waste by connecting surplus food donors to nearby NGOs quickly, so food gets picked up and distributed on time."
// //   },
// //   {
// //     keywords: ["volunteer", "i am volunteer", "volunteer work", "what does volunteer do", "volunteer role"],
// //     response:
// //       "yes ,As a volunteer, you accept nearby food pickup requests, pick up donations, update task status, and help deliver food to NGOs or people in need."
// //   },
// //   {
// //     keywords: ["old system", "previous", "earlier", "before", "manual process"],
// //     response:
// //       "Earlier food donation was manual using phone calls, causing delays and food waste. This platform automates the entire process."
// //   },
// //   {
// //     keywords: ["ai", "automation", "artificial intelligence", "smart matching", "priority handling"],
// //     response:
// //       "AI is used for smart NGO matching, prioritizing food distribution, and automating notifications and status updates."
// //   },
// //   {
// //     keywords: ["donate", "food donate", "how to donate", "give food", "submit food"],
// //     response:
// //       "To donate food, register as a donor, enter food details, and submit. Nearby verified NGOs will be notified automatically."
// //   },
// //   {
// //     keywords: ["money", "donate money", "payment", "does it accept money", "accept money", "razorpay", "upi", "card"],
// //     response:
// //       "Yes. The platform supports money donations as well (online payments like UPI/Card via Razorpay, if enabled). You can choose Money donation and complete the payment."
// //   },
// //   {
// //     keywords: ["ngo", "ngos", "ngo registration", "verified ngo", "how ngos register"],
// //     response:
// //       "NGOs can register by providing valid government documentation. Once verified, they can receive food donations from donors in real-time."
// //   },
// //   {
// //     keywords: ["food safety", "safe food", "expiry", "spoiled", "hygiene"],
// //     response:
// //       "Donated food should be fresh, properly packed, and safe for consumption. The platform prioritizes food safety for recipients."
// //   },
// //   {
// //     keywords: ["certificate", "appreciation certificate", "download certificate", "leaving certificate"],
// //     response:
// //       "You can download your certificate from your profile (Certificate button). It shows your joined date and the current date as leaving date."
// //   },
// //   {
// //     keywords: ["help", "support", "need assistance", "trouble", "problem"],
// //     response:
// //       "If you face any issues, contact our support team through the contact form or email. We are here to help you quickly."
// //   },
// //   {
// //     keywords: ["greetings", "hello", "hi", "hey", "good morning", "good evening"],
// //     response:
// //       "Hello! I am your Food Donation Assistant. You can ask me about how the platform works, donating food, or NGO registration."
// //   },
// //   {
// //     keywords: ["thank you", "thanks", "appreciate", "grateful"],
// //     response:
// //       "You're welcome! I'm glad I could help. Let me know if you have any more questions about the platform."
// //   },
// //   {
// //     keywords: ["status", "check status", "donation status", "tracking", "ngo status"],
// //     response:
// //       "You can track your food donation status in real-time through your donor dashboard once you submit the food details."
// //   },
// //   {
// //     keywords: ["mobile app", "app", "website", "platform access", "login"],
// //     response:
// //       "You can access the platform through our website on desktop or mobile devices. Log in as a donor or NGO to start using the features."
// //   },
// //   {
// //     keywords: ["impact", "impact overview", "stats", "statistics", "environmental impact"],
// //     response:
// //       "You can view live impact statistics on the Impact pages. These numbers update automatically based on current donation data."
// //   },
// //   {
// //     keywords: ["feedback", "suggestion", "improvement", "comments"],
// //     response:
// //       "We value your feedback! Please share your suggestions through the feedback form to help us improve the platform."
// //   }
// // ];



// export const chatbotData = [

//   // ================= GREETING =================
//   {
//     keywords: ["hi","hii", "hello", "hey", "namaste"],
//     response:
//       "Hello 👋 I am the Annsetu Assistant. You can ask me about food donation, NGOs, volunteers, or how the platform works."
//   },

//   // ================= PLATFORM =================
//   {
//     keywords: ["annsetu", "platform", "website"],
//     response:
//       "Annsetu is a food waste management and redistribution platform connecting donors with verified NGOs."
//   },
//   {
//     keywords: ["work", "process", "workflow"],
//     response:
//       "Donors submit food details, NGOs are notified, volunteers pick up food, and it is distributed to people in need."
//   },

//   // ================= DONATION =================
//   {
//     keywords: ["donate", "donation", "food"],
//     response:
//       "To donate food, log in as a donor, enter food details, and submit. Nearby NGOs will be notified."
//   },
//   {
//     keywords: ["submit", "add", "upload"],
//     response:
//       "You can submit food details using the donor dashboard."
//   },
//   {
//     keywords: ["cancel", "edit", "update"],
//     response:
//       "You can edit or cancel a donation before an NGO accepts it."
//   },

//   // ================= FOOD TYPE =================
//   {
//     keywords: ["allowed", "fresh", "safe"],
//     response:
//       "Only fresh, hygienic, and safe food is allowed for donation."
//   },
//   {
//     keywords: ["expired", "spoiled", "old"],
//     response:
//       "Expired or spoiled food is not allowed on Annsetu."
//   },
//   {
//     keywords: ["home", "homemade"],
//     response:
//       "Homemade food can be donated if it is fresh and properly packed."
//   },
//   {
//     keywords: ["small", "minimum", "quantity"],
//     response:
//       "Even small quantities of food can be donated if the food is safe."
//   },

//   // ================= NGO =================
//   {
//     keywords: ["ngo", "organization"],
//     response:
//       "NGOs collect donated food and distribute it to people who need it."
//   },
//   {
//     keywords: ["register", "registration"],
//     response:
//       "NGOs must register with valid government documents."
//   },
//   {
//     keywords: ["verify", "verification", "approved"],
//     response:
//       "Only verified NGOs are allowed to accept donations."
//   },
//   {
//     keywords: ["accept", "receive"],
//     response:
//       "Verified NGOs can accept food donations from their dashboard."
//   },

//   // ================= VOLUNTEER =================
//   {
//     keywords: ["volunteer"],
//     response:
//       "Volunteers help pick up donated food and deliver it to NGOs or needy people."
//   },
//   {
//     keywords: ["join", "become"],
//     response:
//       "You can register on Annsetu to become a volunteer."
//   },
//   {
//     keywords: ["task", "pickup", "delivery"],
//     response:
//       "Volunteers receive pickup and delivery tasks after NGO acceptance."
//   },
//   {
//     keywords: ["paid", "salary", "payment"],
//     response:
//       "Volunteering on Annsetu is unpaid and focused on social service."
//   },

//   // ================= TRACKING =================
//   {
//     keywords: ["status", "track", "tracking"],
//     response:
//       "You can track your donation status in real time from the dashboard."
//   },
//   {
//     keywords: ["delivered", "completed"],
//     response:
//       "Once food is delivered, the status is updated automatically."
//   },

//   // ================= MONEY =================
//   {
//     keywords: ["money", "payment", "upi", "card"],
//     response:
//       "Annsetu supports online money donations if enabled."
//   },
//   {
//     keywords: ["refund", "failed"],
//     response:
//       "If a payment fails, you can retry or receive an automatic refund."
//   },

//   // ================= CERTIFICATE =================
//   {
//     keywords: ["certificate"],
//     response:
//       "Certificates can be downloaded from your profile section."
//   },

//   // ================= SECURITY =================
//   {
//     keywords: ["privacy", "data", "secure"],
//     response:
//       "Annsetu follows secure data handling practices to protect user information."
//   },

//   // ================= SUPPORT =================
//   {
//     keywords: ["help", "support", "contact"],
//     response:
//       "You can contact the Annsetu support team using the contact form."
//   },

//   // ================= IMPACT =================
//   {
//     keywords: ["impact", "saved", "helped"],
//     response:
//       "The Impact section shows how much food has been saved and how many people were helped."
//   },

//   // ================= OUT OF SCOPE =================
//   {
//     keywords: ["job", "coding", "exam", "politics"],
//     response:
//       "Sorry, I can answer questions related to the Annsetu platform only."
//   },

//   // ================= THANKS =================
//   {
//     keywords: ["thanks", "thank"],
//     response:
//       "You're welcome 😊 Happy to help!"
//   },

//    // ================= FOOD DATE =================
//   {
//     keywords: ["date", "cook", "prepared"],
//     response:
//       "Food is categorized based on the cooking or preparation date provided by the donor."
//   },
//   {
//     keywords: ["today", "same", "day"],
//     response:
//       "Food prepared today is treated as high priority for quick distribution."
//   },
//   {
//     keywords: ["yesterday", "previous", "day"],
//     response:
//       "Food prepared on the previous day is accepted only if it is safe and within consumption limits."
//   },

//   // ================= EXPIRY =================
//   {
//     keywords: ["expiry", "expire"],
//     response:
//       "Food expiry time is calculated using the preparation time and food type."
//   },
//   {
//     keywords: ["hours", "time", "limit"],
//     response:
//       "Each food type has a defined safe consumption time limit."
//   },
//   {
//     keywords: ["crossed", "over", "passed"],
//     response:
//       "Food that crosses the safe time limit is automatically marked as not eligible."
//   },

//   // ================= PRIORITY =================
//   {
//     keywords: ["priority", "urgent"],
//     response:
//       "Food priority is decided based on freshness, quantity, and time remaining before expiry."
//   },
//   {
//     keywords: ["high", "medium", "low"],
//     response:
//       "High priority food is distributed first, followed by medium and low priority."
//   },

//   // ================= FOOD TYPE =================
//   {
//     keywords: ["cooked", "meal"],
//     response:
//       "Cooked meals are given higher urgency due to shorter shelf life."
//   },
//   {
//     keywords: ["dry", "packed"],
//     response:
//       "Dry or packed food has a longer safe consumption window."
//   },

//   // ================= AUTO RULES =================
//   {
//     keywords: ["auto", "automatic", "system"],
//     response:
//       "The system automatically categorizes food using date, time, and food type."
//   },
//   {
//     keywords: ["rule", "logic"],
//     response:
//       "Food categorization follows predefined safety and freshness rules."
//   },

//   // ================= NGO VIEW =================
//   {
//     keywords: ["ngo", "view", "filter"],
//     response:
//       "NGOs can filter food requests based on freshness and priority."
//   },

//   // ================= DONOR =================
//   {
//     keywords: ["donor", "update", "time"],
//     response:
//       "Donors must enter correct preparation time to ensure accurate categorization."
//   },

//   // ================= VOLUNTEER =================
//   {
//     keywords: ["volunteer", "pickup", "urgent"],
//     response:
//       "Volunteers see urgent food pickups first to avoid wastage."
//   },

//   // ================= EDGE CASES =================
//   {
//     keywords: ["late", "delay"],
//     response:
//       "If pickup is delayed, food priority is recalculated automatically."
//   },
//   {
//     keywords: ["reject", "decline"],
//     response:
//       "Food may be rejected if freshness or safety conditions are not met."
//   },

//   // ================= SAFETY =================
//   {
//     keywords: ["safety", "health", "risk"],
//     response:
//       "Food safety checks are applied before allowing distribution."
//   }

// ];

export const chatbotData = [

  // ================= GREETINGS =================
  {
    intent: "user greeting and starting conversation",
    response:
      "Hello 👋 I am the AnnSetu Assistant. You can ask me about food donation, NGOs, volunteers, or how the platform works."
  },
  {
    intent: "user saying thanks or appreciation",
    response:
      "You're welcome 😊 I'm happy to help. Feel free to ask anything about AnnSetu."
  },

  // ================= PLATFORM =================
  {
    intent: "what is annsetu platform and its purpose",
    response:
      "AnnSetu is a food waste management and redistribution platform that connects food donors with verified NGOs to help needy people."
  },
  {
    intent: "why annsetu is needed and its importance",
    response:
      "AnnSetu helps reduce food waste and ensures surplus food reaches people in need instead of being thrown away."
  },

  // ================= WORKFLOW =================
  {
    intent: "overall workflow of annsetu platform",
    response:
      "Donors submit food details, nearby verified NGOs get notified, volunteers pick up the food, and it is distributed to people in need."
  },
  {
    intent: "step by step process for food donation",
    response:
      "First, log in as a donor. Then enter food details, submit the request, and wait for an NGO to accept it."
  },

  // ================= DONOR =================
  {
    intent: "how a donor can donate food",
    response:
      "To donate food, log in as a donor, enter food details like quantity and preparation time, and submit the donation."
  },
  {
    intent: "can donor edit or cancel food donation",
    response:
      "Yes, donors can edit or cancel a food donation request before it is accepted by an NGO."
  },
  {
  intent: "can donor cancel or edit a food donation after submitting",
  response:
    "Yes, you can cancel or edit your donation before it is accepted by an NGO."
},

  {
    intent: "what type of food can be donated",
    response:
      "Only fresh, hygienic, and safe food can be donated on AnnSetu."
  },
  {
    intent: "can homemade food be donated",
    response:
      "Yes, homemade food can be donated if it is fresh, properly packed, and safe to consume."
  },

  // ================= FOOD SAFETY =================
  {
    intent: "rules for food safety and freshness",
    response:
      "Food must be fresh, properly packed, and within the safe consumption time to be accepted."
  },
  {
    intent: "what happens if food is expired or spoiled",
    response:
      "Expired or spoiled food is automatically rejected to ensure the safety of recipients."
  },
  {
    intent: "how food expiry is calculated",
    response:
      "Food expiry is calculated using the preparation time, food type, and defined safety limits."
  },

  // ================= NGO =================
  {
    intent: "role of ngos on annsetu platform",
    response:
      "NGOs receive food donation requests and distribute the food to people who need it."
  },
  {
    intent: "ngo registration and verification process",
    response:
      "NGOs must register with valid government documents and are manually verified before accepting donations."
  },
  {
    intent: "who can accept food donations",
    response:
      "Only verified NGOs are allowed to accept food donations on AnnSetu."
  },

  // ================= VOLUNTEER =================
  {
    intent: "what volunteers do on annsetu",
    response:
      "Volunteers help pick up donated food and deliver it to NGOs or needy people."
  },
  {
    intent: "how to become a volunteer",
    response:
      "You can register on AnnSetu as a volunteer to start helping with food pickups and deliveries."
  },
  {
    intent: "are volunteers paid or unpaid",
    response:
      "Volunteering on AnnSetu is unpaid and focused on social service."
  },

  // ================= TRACKING =================
  {
    intent: "how to track donation status",
    response:
      "You can track your food donation status in real time from your donor dashboard."
  },
  {
    intent: "what happens after food is delivered",
    response:
      "Once food is delivered, the donation status is updated automatically."
  },

  // ================= CERTIFICATE =================
  {
    intent: "how to download participation or volunteer certificate",
    response:
      "Certificates can be downloaded from your profile section after completing activities."
  },

  // ================= MONEY =================
  {
    intent: "does annsetu accept money donations",
    response:
      "AnnSetu supports online money donations if the feature is enabled on the platform."
  },
  {
    intent: "what happens if payment fails",
    response:
      "If a payment fails, you can retry or receive an automatic refund if applicable."
  },

  // ================= IMPACT =================
  {
    intent: "impact of annsetu and statistics",
    response:
      "The Impact section shows how much food has been saved and how many people have been helped."
  },

  // ================= SECURITY =================
  {
    intent: "data privacy and security on annsetu",
    response:
      "AnnSetu follows secure data handling practices to protect user information."
  },

  // ================= SUPPORT =================
  {
    intent: "how to contact annsetu support",
    response:
      "You can contact the AnnSetu support team using the contact form available on the website."
  }

];
