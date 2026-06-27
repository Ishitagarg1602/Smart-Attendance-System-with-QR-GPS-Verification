# 🎥 3-Minute Demo Video Script (Teleprompter Version)

**Important Note before starting:** Make sure your Postman environment is set to **"Live Render Environment"** in the top right corner!

---

### Segment 1: Introduction (30 Seconds)
* **What to do on screen:** Have your **GitHub repository** open on your screen.
* **What to say (Read exactly this):** "Hello, my name is Ishita Garg. For my backend internship project, I developed a Smart Attendance System with QR and GPS Verification. This system solves real-world attendance issues like proxy attendance and inaccurate tracking by using temporary QR codes and physical geofencing. Today, I will demonstrate the live API which is currently deployed on Render and connected to MongoDB Atlas."

### Segment 2: Authentication & Roles (30 Seconds)
* **What to do on screen:** 
  1. Open Postman. 
  2. Open the **1. Authentication** folder on the left.
  3. Click on **Register Admin User**, then click the blue **Send** button. 
* **What to say (Read exactly this):** "First, let's look at Authentication. The backend uses secure JSON Web Tokens and strict Role-Based Access Control. Right now, I am registering a new Admin user. I hit send, and we get a 201 Created response. This Admin now has permission to create attendance sessions and location zones."

### Segment 3: Geofencing & QR Generation (30 Seconds)
* **What to do on screen:** 
  1. Open the **2. Location Zones** folder.
  2. Click **Create Location Zone**, then click **Send**.
  3. Open the **3. QR Sessions** folder.
  4. Click **Create QR Session**, then click **Send**.
  5. **Action:** *Copy* the long text string next to `"qrData"` in the response area at the bottom.
* **What to say (Read exactly this):** "Next, the teacher needs to set up the classroom. I am creating a Location Zone which sets a 50-meter GPS radius around our classroom. Then, I create a QR Session tied to that specific zone. The API responds with a secure, encrypted QR Token that changes dynamically. I will copy this token to simulate scanning the QR code."

### Segment 4: Anti-Spoofing GPS Verification (1 Minute)
* **What to do on screen (The Failure Test):** 
  1. Open the **1. Authentication** folder.
  2. Click **Register Student**, then click **Send**.
  3. Click **Login User**. In the *Body* tab, change the email to `student.john@university.edu`, and click **Send**.
  4. Open the **4. Attendance Processing** folder.
  5. Click **Mark QR Attendance (With GPS)**.
  6. Click the *Body* tab and paste your copied `qrData` string into the `"qrToken"` field.
  7. Change the `latitude` to `10.000` and `longitude` to `10.000`.
  8. Click **Send**. Point your mouse at the `400 Bad Request` error.
* **What to say (Read exactly this):** "Now, I will register a Student and log in as that student. I will try to mark attendance by sending the QR token we just created. But first, I will intentionally send fake GPS coordinates to simulate a student trying to spoof their location from home. When I hit send, the API uses the mathematical Haversine formula to calculate the exact distance, and it rejects the attendance with a 400 Bad Request because the student is outside the 50-meter radius."

* **What to do on screen (The Success Test):**
  1. Change the `latitude` back to `28.6139` and `longitude` back to `77.2090`.
  2. Click **Send**. Point your mouse at the `201 Created` success message.
* **What to say (Read exactly this):** "Now, I will change the coordinates back to the correct classroom location. When I hit send this time, the coordinates match perfectly, and the attendance is successfully marked and saved to the database."

### Segment 5: WebSockets & Real-time (15 Seconds)
* **What to do on screen:** Open **VS Code** and show the `src/socket/socket.js` file on your screen.
* **What to say (Read exactly this):** "Under the hood, whenever a student marks attendance successfully, the backend fires a live Socket.io event. This broadcasts the new attendance data to the teacher's dashboard instantly, without needing to refresh the page."

### Segment 6: Analytics Dashboard (15 Seconds)
* **What to do on screen:** 
  1. Go back to **Postman**.
  2. Open the **5. Dashboard & Reports** folder.
  3. Click **Dashboard Stats**, then click **Send**.
* **What to say (Read exactly this):** "Finally, for the admin dashboard, I wrote advanced MongoDB Aggregation pipelines. I am calling the Dashboard Stats API, and instead of fetching thousands of records, the database directly calculates total students, today's attendance distribution, and the 30-day percentage trend in real-time."

### Segment 7: Conclusion (10 Seconds)
* **What to do on screen:** Open your live **Render Dashboard** or **GitHub Repo** again.
* **What to say (Read exactly this):** "The entire architecture is secure, scalable, and completely ready for production deployment. Thank you for reviewing my project!"
