# 🍱 Ann-Setu – Food Waste Management & Redistribution Platform

Ann-Setu is a full-stack web application designed to reduce food waste by connecting **food donors** with **verified NGOs** who can distribute surplus food to people in need.

The platform ensures secure authentication, NGO verification, and a structured donation workflow to make food redistribution efficient and transparent.

---

## 🌍 Live Project

🔗 Live Link: https://annsetu-foundation.vercel.app/home 


---

## 📌 Problem Statement

Every day, large amounts of food are wasted from:
- Restaurants
- Events
- Hostels
- Weddings
- Households

At the same time, many people struggle with hunger.

Ann-Setu acts as a bridge between food donors and verified NGOs to ensure surplus food reaches those in need.

---

## 🚀 Key Features

### 🔹 1. User Authentication
- Secure login & registration system
- Password encryption
- Session handling
- Passport.js authentication

---

### 🔹 2. NGO Authorization System
- Two-step NGO registration process
- NGO verification using government registration ID
- Only verified NGOs can access donation features
- Unique NGO ID generation after approval

---

### 🔹 3. Food Donation System
- Donors can:
  - Add food details
  - Mention quantity & pickup location
  - Submit donation request
- NGOs can:
  - View available donations
  - Accept food requests
  - Track donation status

---

### 🔹 4. Role-Based Access Control
- Donor Dashboard
- NGO Dashboard
- Restricted access for unauthorized users

---

### 🔹 5. Database Integration
- MongoDB for storing:
  - User data
  - NGO details
  - Donation records
- Mongoose schema validation

---

### 🔹 6. Middleware Implementation
- Authentication middleware
- Authorization middleware
- Error-handling middleware
- Request validation

---

### 🔹 7. Responsive UI
- Clean and structured layout
- Bootstrap-based frontend
- Dynamic rendering using EJS

---

## 🛠️ Tech Stack

### 🔹 Frontend
- HTML5
- CSS3
- Reactjs
- Tailwind Css

### 🔹 Backend
- Node.js
- Express.js
- Passport.js

### 🔹 Database
- MongoDB
- Mongoose

---

## 📂 Project Structure

```
Ann-Setu/
│
├── models/
│   ├── User.js
│   ├── NGO.js
│   ├── Donation.js
│
├── routes/
├── controllers/
├── middleware/
├── views/
├── public/
├── config/
└── app.js
```

---

## 🔄 Workflow of the Application

1. User registers as Donor or NGO  
2. NGO completes verification process  
3. Admin verifies NGO manually  
4. Donor submits food donation  
5. Nearby NGO views and accepts request  
6. Food is collected and distributed  

---

## 🧠 Learning Outcomes

Through this project:
- Implemented a real-world authentication system
- Understood middleware deeply
- Built role-based authorization
- Designed scalable backend architecture
- Integrated MongoDB with Node.js
- Developed structured MVC pattern application

---

## ▶️ How to Run Locally

1. Clone the repository:
```
git clone https://github.com/vivek-ksinghg/AnnSetu-Foundation.git
```

2. Navigate into folder:
```
cd ann-setu
```

3. Install dependencies:
```
npm install
```

4. Create `.env` file and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

5. Run the server:
```
node app.js
```

6. Open in browser:
```
http://localhost:5000
```

---

## 🔐 Security Features

- Password hashing
- Session management
- Protected routes
- Middleware-based access control

---

## 🎯 Future Improvements

- Add real-time notification system
- Implement location-based matching
- Add image upload for food items
- Add admin dashboard
- Deploy on cloud platform (Render / AWS / Vercel)

---

## 🤝 Contribution

Contributions are welcome!

- Fork the repository
- Create a new branch
- Make improvements
- Submit a Pull Request

---

## ⭐ Support

If you find this project helpful, please give it a ⭐ on GitHub.

---

## 👨‍💻 Developer

Developed by Vivek Kumar Singh  
Full Stack Developer (MERN Stack)

---

