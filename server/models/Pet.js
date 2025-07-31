import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large']
  },
  age: {
    type: String,
    required: true,
    enum: ['puppy', 'young', 'adult', 'senior']
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'unknown']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['lost', 'found', 'reunited']
  },
  location: {
    area: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  dateReported: {
    type: Date,
    required: true
  },
  dateLostOrFound: {
    type: Date,
    required: true
  },
  images: [{
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  }],
  contactInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reward: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search optimization
petSchema.index({ type: 1, status: 1, location: 1 });
petSchema.index({ dateReported: -1 });

export default mongoose.model('Pet', petSchema);