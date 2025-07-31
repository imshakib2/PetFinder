import express from 'express';
import Pet from '../models/Pet.js';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.mjs';

const router = express.Router();

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to convert images to Base64 for frontend
const convertImagesToBase64 = (pet) => {
  if (pet.images && pet.images.length > 0) {
    pet.images = pet.images.map(image => ({
      data: `data:${image.contentType};base64,${image.data.toString('base64')}`,
      contentType: image.contentType
    }));
  }
  return pet;
};

// Get all pets with filtering
router.get('/', async (req, res) => {
  try {
    console.log('Received query params:', req.query);
    const { status, type, location, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (status) query.status = status;
    if (type) query.type = type;
    if (location) {
      query.$or = [
        { 'location.area': new RegExp(location, 'i') },
        { 'location.city': new RegExp(location, 'i') }
      ];
    }

    console.log('Database query:', query);

    const pets = await Pet.find(query)
      .sort({ dateReported: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pet.countDocuments(query);

    console.log(`Found ${pets.length} pets out of ${total} total`);
    // Convert images to Base64 for each pet
    const petsWithBase64Images = pets.map(pet => {
      const petObj = pet.toObject();
      return convertImagesToBase64(petObj);
    });

    res.json({
      pets: petsWithBase64Images,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error in pets route:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    const petObj = pet.toObject();
    const petWithBase64Images = convertImagesToBase64(petObj);
    
    res.json(petWithBase64Images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new pet report
router.post('/', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const petData = JSON.parse(req.body.petData);
    
    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          data: file.buffer,
          contentType: file.mimetype
        });
      });
    }

    const pet = new Pet({
      ...petData,
      userId: req.user._id,
      images,
      dateReported: new Date()
    });

    const savedPet = await pet.save();
    
    // Convert images to Base64 for response
    const petObj = savedPet.toObject();
    const petWithBase64Images = convertImagesToBase64(petObj);
    
    res.status(201).json(petWithBase64Images);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current user's pets with statistics
router.get('/user/my-pets', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching pets for user:', userId);
    
    // Get all pets for this user
    const pets = await Pet.find({ userId: userId })
      .sort({ dateReported: -1 });

    console.log(`Found ${pets.length} pets for user ${userId}`);

    // Calculate statistics
    const totalReported = pets.length;
    const reunitedPets = pets.filter(pet => pet.status === 'reunited').length;
    const activePets = pets.filter(pet => pet.status === 'lost' || pet.status === 'found').length;
    const lostPets = pets.filter(pet => pet.status === 'lost').length;
    const foundPets = pets.filter(pet => pet.status === 'found').length;

    // Convert images to Base64 for each pet
    const petsWithBase64Images = pets.map(pet => {
      const petObj = pet.toObject();
      return convertImagesToBase64(petObj);
    });

    const statistics = {
      totalReported,
      reunitedPets,
      activePets,
      lostPets,
      foundPets
    };

    console.log('User statistics:', statistics);

    res.json({
      pets: petsWithBase64Images,
      statistics
    });
  } catch (error) {
    console.error('Error fetching user pets:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update pet status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    const petObj = pet.toObject();
    const petWithBase64Images = convertImagesToBase64(petObj);
    
    res.json(petWithBase64Images);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Search pets
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchRegex = new RegExp(query, 'i');

    const pets = await Pet.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { breed: searchRegex },
        { color: searchRegex },
        { description: searchRegex },
        { 'location.area': searchRegex },
        { 'location.city': searchRegex }
      ]
    }).sort({ dateReported: -1 });

    // Convert images to Base64 for each pet
    const petsWithBase64Images = pets.map(pet => {
      const petObj = pet.toObject();
      return convertImagesToBase64(petObj);
    });

    res.json(petsWithBase64Images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;