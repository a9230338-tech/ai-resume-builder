const express = require("express")
const cors = require("cors")
const path = require("path")
const multer = require("multer")
const fs = require("fs")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const db = require("./db")
const createPDF = require("./pdfGenerator")
const createDOCX = require("./docGenerator")
const generateResumeAI = require("./aiResume")

const app = express()

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_resume_key_for_local_dev";

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname,"public")))

const uploadDir = path.join(__dirname, "public", "uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"public/uploads")
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"-"+file.originalname)
  }
})

const upload = multer({storage})

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access Denied. Please log in." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid Token" });
    req.user = user;
    next();
  });
}

// User Registration
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    db.get(`SELECT id FROM users WHERE username = ?`, [username], async (err, row) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (row) return res.status(409).json({ error: "Username already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
        if (err) return res.status(500).json({ error: "Failed to register user" });
        res.json({ message: "Registration successful" });
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, isPremium: user.isPremium } });
  });
});

// Upgrade to Premium (Mock Payment success)
app.post("/upgrade", authenticateToken, (req, res) => {
  db.run(`UPDATE users SET isPremium = 1 WHERE id = ?`, [req.user.id], function(err) {
    if (err) return res.status(500).json({ error: "Failed to upgrade" });
    res.json({ message: "Successfully upgraded to Premium!" });
  });
});

// Get User Profile Data
app.get("/me", authenticateToken, (req, res) => {
  db.get(`SELECT id, username, resumeCount, isPremium FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });
});

app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"))
})

// Generate Resume (Protected Route)
app.post("/generate-resume", authenticateToken, upload.single("photo"), async (req,res)=>{
  try {
    // 1. Check user limits in DB
    db.get(`SELECT resumeCount, isPremium FROM users WHERE id = ?`, [req.user.id], async (err, user) => {
      if (err) return res.status(500).json({ error: "Database error" });
      
      if (!user.isPremium && user.resumeCount >= 1) {
        return res.status(403).json({ error: "Paywall", message: "You have used your free resume generation." });
      }

      // Proceed to generate
      const data = req.body;
      const photoPath = req.file ? req.file.path : null;

      const enhancedData = await generateResumeAI(data);

      await Promise.all([
        createPDF({
          ...enhancedData,
          photo: photoPath
        }),
        createDOCX(enhancedData, photoPath)
      ]);

      // Update resume count
      db.run(`UPDATE users SET resumeCount = resumeCount + 1 WHERE id = ?`, [req.user.id], (err) => {
        if (err) console.error("Failed to update resume count");
      });

      res.json(enhancedData);
    });
  } catch (error) {
    console.error("Resume Generation Error:", error);
    res.status(500).json({ error: "Failed to generate resume." });
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})