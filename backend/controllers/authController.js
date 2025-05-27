const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    console.log('📥 Incoming request body:', JSON.stringify(req.body, null, 2));

    const { fullName, email, password, gender, age, city } = req.body;

    // Validate fields
    if (!fullName || !email || !password || !gender || !age || !city) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = new User({ fullName, email, password, gender, age, city });

    const savedUser = await user.save();
    console.log('✅ User saved:', savedUser);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Registration Error (full):', error);
    return res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', req.body);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
