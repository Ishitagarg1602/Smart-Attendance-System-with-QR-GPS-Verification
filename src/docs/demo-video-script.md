# Demo Video Script: Phase 2 Internship Submission 🎥
**Target Length:** 8–12 Minutes
**Objective:** Present the Phase 2 implementation of the Smart Attendance System, highlighting GPS Geofencing, Real-Time Socket.io, and the Aggregation Dashboard.

---

### Segment 1: Introduction (1 Minute)
* **Visual:** Display the GitHub repository and Architecture Diagram from `README.md`.
* **Speaker:** "Hello, I am [Your Name]. Welcome to my final Phase 2 demo of the Smart Attendance System with QR and GPS Verification. In Phase 1, we built the core Auth and QR APIs. Today, I'll demonstrate the production-grade Geofencing, WebSocket real-time updates, and the Analytics dashboard."

### Segment 2: Creating a Location Zone & Session (2 Minutes)
* **Visual:** Open Postman. Show the Environment variables being used.
* **Action:**
  1. Login as **Admin**.
  2. Call `POST /api/zones` to create "Main Campus" with coordinates and a `50m` radius.
  3. Call `POST /api/qr/create-session`. Pass the `locationZone` ID in the payload.
* **Speaker:** "First, we establish a Geofence. The Admin defines the exact Latitude, Longitude, and allowable Radius in meters. Then, we link this Zone to our new Attendance Session. The system generates a cryptographic Base-64 QR image preventing tampering."

### Segment 3: GPS Geofencing - Failure & Success (3 Minutes)
* **Visual:** Postman, calling the `mark attendance` API.
* **Action (Failure):**
  1. Grab the QR token from the previous step.
  2. Call `POST /api/attendance/mark` as a **Student**.
  3. Intentionally pass dummy coordinates that are far away.
  4. **Result:** Show the `400 Bad Request` saying "Attendance Rejected: You are 5000m away".
* **Action (Success):**
  1. Update coordinates to match exactly or within the 50m radius of the Zone.
  2. Call the API again.
  3. **Result:** Show the `201 Created` success message.
* **Speaker:** "Here is the core logic in action. The backend employs the mathematical Haversine formula to calculate the exact physical distance in meters. When outside the radius, attendance is blocked and logged as a spoofing attempt. When inside, it is approved."

### Segment 4: Real-Time WebSockets (Socket.io) (2 Minutes)
* **Visual:** Code walkthrough of `src/socket/socket.js`.
* **Speaker:** "Notice that when attendance is successfully marked, the backend doesn't just save to MongoDB. It actively fires a Socket.io broadcast to the specific session room. This allows the frontend dashboard to update the 'Present Student' counter live without requiring a page refresh."

### Segment 5: Advanced Analytics & Dashboard APIs (2 Minutes)
* **Visual:** Call `GET /api/dashboard/stats` and `GET /api/dashboard/trends` in Postman.
* **Speaker:** "For the admin dashboard, I wrote advanced MongoDB Aggregation pipelines. Instead of fetching thousands of records into memory, the database directly groups, counts, and projects the data, returning instant metrics for Total Students, Today's attendance distribution, and the 30-day percentage trend."

### Segment 6: Reports & Deployment (1 Minute)
* **Visual:** Call `GET /api/reports/daily` in Postman. Briefly show deployment configurations (e.g., Render/Railway).
* **Speaker:** "Finally, the reporting module exports structured daily and student-specific records, which can easily be piped into CSV or PDF engines on the client side. The entire architecture is secure, scalable, and completely ready for production deployment."

### Segment 7: Conclusion (30 Seconds)
* **Speaker:** "Thank you for reviewing my project. All code, Swagger docs, and architecture flows are documented in the GitHub repo."
