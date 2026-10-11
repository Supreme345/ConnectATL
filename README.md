# ConnectATL
### Making Affordable Internet Easier to Find in Atlanta

ConnectATL is a web application designed to help Atlanta residents discover affordable internet programs based on their location, household income, student status, and participation in assistance programs.

Instead of navigating multiple internet providers and complicated eligibility requirements, users can complete a simple questionnaire to explore relevant options.

---

## 🌐 LIVE WEBSITE — TRY CONNECTATL

### **[🚀 CLICK HERE TO LAUNCH CONNECTATL](https://www.connectatl.biz)**

**Website:** https://www.connectatl.biz

No installation or account required.

**Important — Free Hosting:** ConnectATL uses Render's free tier for its Spring Boot backend and Neon's free tier for PostgreSQL. Render may put the backend to sleep after inactivity, meaning the first eligibility request can take 30–90 seconds or longer while the server restarts. Subsequent requests should generally be faster.

---

## 🧪 TEST CASES — INPUT THESE EXAMPLES

### **[▶ OPEN THE WEBSITE AND TRY THESE TESTS](https://www.connectatl.biz)**

The following are **fictional household scenarios using real Atlanta-area public locations as example addresses**. They are intended to demonstrate the application's eligibility workflow, not to represent actual residents or guarantee internet availability at those locations.

### Test Case 1 — Low-Income Household With a K–12 Student

| Field | Enter This |
|---|---|
| Street Address | 55 Gilmer Street SE |
| ZIP Code | 30303 |
| Household Size | 4 |
| Annual Household Income | $24,000 |
| K–12 Student | Yes |
| Assistance Programs | SNAP (if available) |
| Language | English |

**Expected:** Complete the questionnaire and select **See My Options**. The application should evaluate the household's circumstances and display relevant affordable internet options.

### Test Case 2 — Household Without a K–12 Student

| Field | Enter This |
|---|---|
| Street Address | 225 North Avenue NW |
| ZIP Code | 30332 |
| Household Size | 2 |
| Annual Household Income | $48,000 |
| K–12 Student | No |
| Assistance Programs | None |
| Language | English |

**Expected:** The application processes the different household circumstances and displays the applicable results, which may differ from Test Case 1.

### Test Case 3 — Larger Household With Assistance Benefits

| Field | Enter This |
|---|---|
| Street Address | 1000 Peachtree Street NE |
| ZIP Code | 30309 |
| Household Size | 5 |
| Annual Household Income | $32,000 |
| K–12 Student | Yes |
| Assistance Programs | Medicaid (if available) |
| Language | English |

**Expected:** The application evaluates the larger household and selected benefits, then displays the relevant plan information.

### Additional Features to Explore

- **Interactive Map:** Explore Atlanta-area broadband information displayed on the map.
- **AI Assistance:** Ask the AI assistant to explain affordable internet eligibility or program requirements.
- **Responsive Design:** Open ConnectATL on a mobile device or resize your browser window.
- **Provider Information:** Review available plan prices, speeds, and provider links.

**Testing Note:** Addresses are illustrative public locations. Eligibility and service availability must ultimately be confirmed with the internet provider. The expected results above describe intended application behavior and may vary depending on the available program data.

---

## 🎯 The Problem

Reliable internet access is increasingly essential for education, employment, healthcare, and daily life. Yet affordable internet programs can be difficult to find because provider information is fragmented, eligibility rules vary, and availability depends on location.

This information gap can prevent households from discovering connectivity resources they may qualify for.

## 💡 The Solution

ConnectATL provides a centralized, accessible way to explore affordable internet options through:

- Personalized household eligibility screening
- Internet plan discovery and provider information
- Geographic broadband visualization
- AI-powered explanations of programs and requirements

**Our goal is to reduce informational barriers to affordable connectivity and help bridge Atlanta's digital divide.**

## ✨ Key Features

- **Eligibility Questionnaire:** A guided three-step process collecting address, household size, income, K–12 student status, and benefit participation.
- **Personalized Internet Options:** Evaluates household circumstances and presents relevant program information.
- **Interactive Broadband Map:** Visualizes geographic broadband information across Atlanta.
- **AI-Powered Assistance:** Integrates Google Gemini to explain programs and eligibility requirements.
- **Responsive Interface:** Designed for desktop and mobile browsers.
- **Cloud-Based Architecture:** Connects a React frontend, Spring Boot REST API, and PostgreSQL database.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, JavaScript, Vite |
| Backend | Java, Spring Boot |
| Database | PostgreSQL |
| AI | Google Gemini API |
| Mapping | Leaflet |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Database Hosting | Neon |
| Version Control | GitHub |

## ⚙️ How It Works

1. **Enter Your Location:** Provide an Atlanta-area address and ZIP code.
2. **Complete the Questionnaire:** Enter household income, size, student status, and applicable assistance benefits.
3. **See Your Options:** Review relevant internet programs and explore additional information through the map and AI assistance.

The frontend communicates with a Spring Boot REST API, which evaluates eligibility using program information stored in PostgreSQL.

## 🌍 Project Value

ConnectATL aims to make affordable internet programs easier to discover and understand, particularly for households facing financial barriers.

By combining eligibility screening, geographic visualization, and AI assistance, it demonstrates how technology can make essential connectivity information more accessible.

## 📌 Project Status

Developed for **Hacklanta II (2026)** as a functional hackathon prototype.

ConnectATL demonstrates an end-to-end application integrating modern web development, cloud infrastructure, geographic visualization, and generative AI.

Actual internet service availability and program eligibility should be verified directly with the provider.

---

### **[🚀 TRY CONNECTATL NOW — WWW.CONNECTATL.BIZ](https://www.connectatl.biz)**
