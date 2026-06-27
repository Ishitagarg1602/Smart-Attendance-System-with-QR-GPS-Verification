# 🎥 3-Minute Demo Video Script (Updated & Simplified)

**Important Note before starting:** Make sure your Postman environment is set to **"Live Render Environment"** in the top right corner!

---

### Segment 1: Introduction (30 Seconds)
* **What to do on screen:** Have your **GitHub repository** open on your screen.
* **What to say:** "Hello, my name is Ishita Garg. For my backend internship project, I developed the Smart Attendance System with QR & GPS Verification. This system solves real-world attendance issues like proxy attendance and inaccurate tracking by combining temporary QR codes, physical geofencing, and Role-Based Access Control."

### Segment 2: Authentication & Roles (30 Seconds)
* **What to do on screen:** 
  1. Open Postman. 
  2. Open the **1. Authentication** folder on the left.
  3. Click on **Register Admin User**, then click the blue **Send** button. 
* **What to say:** "The API is fully deployed live on Render. First, let's look at Authentication. The backend uses secure JWT tokens and strict Role-Based Access Control. When an Admin or Teacher logs in, they are granted permission to create attendance sessions, whereas Students only have permission to scan and mark attendance."

### Segment 3: Geofencing & QR Generation (30 Seconds)
* **What to do on screen:** 
  1. Open the **2. Location Zones** folder.
  2. Click **Create Location Zone**, then click **Send**. *(This creates a 50-meter radius around our test coordinates).*
  3. Open the **3. QR Sessions** folder.
  4. Click **Create QR Session**, then click **Send**.
  5. **Action:** *Copy* the long text string next to `"qrData"` in the response area at the bottom.
* **What to say:** "Teachers can create physical Location Zones using GPS coordinates. When a class starts, the system generates a secure, time-sensitive QR Session linked to that specific GPS zone. The QR code contains an encrypted token that changes dynamically."

### Segment 4: Anti-Spoofing GPS Verification (1 Minute)
* **What to do on screen (The Failure Test):** 
  1. Open the **1. Authentication** folder.
  2. Click **Register Student**, then click **Send**.
  3. Click **Login User**. In the *Body* tab, change the email to `student.john@university.edu`, and click **Send**. *(You are now logged in as a student).*
  4. Open the **4. Attendance Processing** folder.
  5. Click **Mark QR Attendance (With GPS)**.
  6. Click the *Body* tab and paste your copied `qrData` string into the `"qrToken"` field.
  7. Change the `latitude` to `10.000` and `longitude` to `10.000` *(these are fake coordinates)*.
  8. Click **Send**. Point your mouse at the `400 Bad Request` error.
* **What to say:** "Now, I will try to mark attendance as a Student. If a student tries to spoof their location by sending fake GPS coordinates, the backend uses the mathematical Haversine formula to calculate the exact distance. As you can see, the attendance is rejected because the student is outside the 50-meter radius."

* **What to do on screen (The Success Test):**
  1. Change the `latitude` back to `28.6139` and `longitude` back to `77.2090`.
  2. Click **Send**. Point your mouse at the `201 Created` success message.
* **What to say:** "When the student is physically present inside the geofenced classroom, the coordinates match, and the attendance is successfully marked and saved to MongoDB."

### Segment 5: WebSockets & Real-time (15 Seconds)
* **What to do on screen:** Open **VS Code** and show the `src/socket/socket.js` file on your screen.
* **What to say:** "Under the hood, whenever a student marks attendance successfully, the backend fires a live Socket.io event. This allows the teacher's frontend dashboard to update the 'Present Student' counter instantly without refreshing the page."

### Segment 6: Analytics Dashboard (15 Seconds)
* **What to do on screen:** 
  1. Go back to **Postman**.
  2. Open the **5. Dashboard & Reports** folder.
  3. Click **Dashboard Stats**, then click **Send**.
* **What to say:** "For the admin dashboard, I wrote advanced MongoDB Aggregation pipelines. Instead of fetching thousands of records into memory, the database directly calculates total students, today's attendance distribution, and the 30-day percentage trend in real-time."

### Segment 7: Conclusion (10 Seconds)
* **What to do on screen:** Open your live **Render Dashboard** or **GitHub Repo** again.
* **What to say:** "The entire architecture is secure, scalable, and completely ready for production deployment. Thank you for reviewing my project!"
