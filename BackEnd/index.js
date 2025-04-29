require('dotenv').config();
const express = require("express");
const connectToMongo = require("./Connection");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Submission = require('./models/Submission');

const app = express();
const PORT = process.env.PORT || 4000;

// Create) uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Molter cnfiguration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'cv') {
    if (path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for CV'), false);
    }
  } else if (file.fieldname === 'assignment') {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.zip' || ext === '.txt') {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP or TXT files are allowed for Assignment'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
// Connecting MognoDB
connectToMongo(process.env.DB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// API endpoint for form submissiong
app.post('/upload', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'assignment', maxCount: 1 }
]), async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      githubLink, 
      skills, 
      apiExperience, 
      carbonDataset, 
      blockchainProject 
    } = req.body;

    // Basic validation
    if (!fullName || !email || !req.files?.cv) {
      return res.status(400).json({ 
        success: false, 
        message: 'Full name, email, and CV are required' 
      });
    }

    // Create new submission
    const submission = new Submission({
      fullName,
      email,
      phone,
      githubLink,
      skills: Array.isArray(skills) ? skills : [skills].filter(Boolean),
      apiExperience,
      carbonDataset,
      blockchainProject,
      cv: req.files.cv[0].path,
      assignment: req.files.assignment?.[0]?.path
    });

    // Save to database
    await submission.save();

    res.status(201).json({ 
      success: true, 
      message: 'Data submitted successfully' 
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error submitting application' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      success: false, 
      message: err.message || 'File upload error' 
    });
  } else if (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message || 'Bad request' 
    });
  }
  next();
});

// Creating Server
app.listen(PORT, () => {
  console.log("Server is listening to PORT: " + PORT);
});

