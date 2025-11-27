import { Request, Response } from 'express';
import User from '../models/User';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  console.log('📝 Registration attempt:', { name, email });

  // Validation
  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Email already exists:', email);
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const user = new User({ name, email, password });
    await user.save();

    console.log('✅ User registered successfully:', user.email);

    res.status(201).json({ 
      username: user.name || user.email.split('@')[0],
      email: user.email,
      isAdmin: user.isAdmin
    });
  } catch (err: any) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message || 'Failed to register user' 
    });
  }
};

// Login existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  console.log('🔐 Login attempt for:', email);

  // Validation
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    console.log('✅ Login successful for:', email);

    res.status(200).json({ 
      username: user.name || user.email.split('@')[0],
      email: user.email,
      isAdmin: user.isAdmin
    });
  } catch (err: any) {
    console.error('❌ Login error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message || 'Failed to login' 
    });
  }
};

// Get all users (for admin and user list)
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password
    // Use email part before @ as username if name is not set
    res.json(users.map(u => ({ 
      username: u.name || u.email.split('@')[0], 
      email: u.email, 
      isAdmin: u.isAdmin 
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Admin: Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;
  
  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Admin: Make user admin
export const makeAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  
  try {
    const user = await User.findOneAndUpdate({ email }, { isAdmin: true }, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User is now admin', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Admin: Remove admin role
export const removeAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  
  try {
    // Prevent removing admin from default admin account
    if (email === 'admin12@gmail.com') {
      res.status(400).json({ message: 'Cannot remove admin role from default admin account' });
      return;
    }
    
    const user = await User.findOneAndUpdate({ email }, { isAdmin: false }, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'Admin role removed', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Admin: Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;
  const { name, isAdmin } = req.body;
  
  try {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (typeof isAdmin === 'boolean') updateData.isAdmin = isAdmin;
    
    const user = await User.findOneAndUpdate({ email }, updateData, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};