import express from 'express';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.mjs';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Send reunion confirmation email (mock function)
const sendReunionConfirmationEmail = async (user, pet) => {
  console.log(`Reunion confirmation email would be sent to ${user.email} for pet: ${pet.name}`);
  // In a real app, you would send an actual email here
};

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalPets = await Pet.countDocuments();
    const lostPets = await Pet.countDocuments({ status: 'lost', isActive: true });
    const foundPets = await Pet.countDocuments({ status: 'found', isActive: true });
    const reunitedPets = await Pet.countDocuments({ status: 'reunited' });
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentPets = await Pet.countDocuments({ 
      dateReported: { $gte: thirtyDaysAgo } 
    });
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    res.json({
      stats: {
        totalPets,
        lostPets,
        foundPets,
        reunitedPets,
        totalUsers,
        verifiedUsers,
        recentPets,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all pets with pagination and filters
router.get('/pets', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { breed: new RegExp(search, 'i') },
        { 'contactInfo.name': new RegExp(search, 'i') },
        { 'location.area': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') }
      ];
    }

    const pets = await Pet.find(query)
      .sort({ dateReported: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pet.countDocuments(query);

    // Convert images to Base64 for each pet
    const petsWithBase64Images = pets.map(pet => {
      const petObj = pet.toObject();
      if (petObj.images && petObj.images.length > 0) {
        petObj.images = petObj.images.map(image => ({
          data: `data:${image.contentType};base64,${image.data.toString('base64')}`,
          contentType: image.contentType
        }));
      }
      return petObj;
    });

    res.json({
      pets: petsWithBase64Images,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update pet status (mark as reunited)
router.patch('/pets/:id/status', async (req, res) => {
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

    // If pet is marked as reunited, send confirmation email
    if (status === 'reunited') {
      try {
        const user = await User.findOne({ email: pet.contactInfo.email });
        if (user) {
          await sendReunionConfirmationEmail(user, pet);
        }
      } catch (emailError) {
        console.error('Failed to send reunion confirmation email:', emailError);
        // Continue with status update even if email fails
      }
    }

    // Convert images to Base64
    const petObj = pet.toObject();
    if (petObj.images && petObj.images.length > 0) {
      petObj.images = petObj.images.map(image => ({
        data: `data:${image.contentType};base64,${image.data.toString('base64')}`,
        contentType: image.contentType
      }));
    }

    res.json(petObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete pet
router.delete('/pets/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role or status
router.patch('/users/:id', async (req, res) => {
  try {
    const { role, isVerified } = req.body;
    const updateData = {};
    
    if (role) updateData.role = role;
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password -verificationToken -resetPasswordToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;