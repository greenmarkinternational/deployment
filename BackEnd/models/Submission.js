const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  githubLink: {
    type: String,
    trim: true
  },
  skills: {
    type: [String],
    default: []
  },
  apiExperience: {
    type: String,
    trim: true
  },
  carbonDataset: {
    type: String,
    trim: true
  },
  blockchainProject: {
    type: String,
    trim: true
  },
  cv: {
    type: String,
    required: true
  },
  assignment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', submissionSchema);