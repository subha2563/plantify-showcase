const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Google Configuration
const GOOGLE_CLIENT_ID = "794774501603-viqn0c123urhc8i6e1udv643dn82qu6b.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// MongoDB Connection
mongoose.connect('mongodb+srv://subha256256_db_user:PLX9GScXweOC1Lvk@cluster0.relsm8g.mongodb.net/?appName=Cluster0')
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

const PORT = 5000;

// --- Schemas & Models ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Kept for schema compatibility
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' }]
});

const plantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    img: String
});

const User = mongoose.model('User', userSchema);
const Plant = mongoose.model('Plant', plantSchema);

// --- Auth Routes ---

// The ONLY Login Route: Handles both Register and Login via Google
app.post('/api/google-login', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const { name, email } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Auto-register new Google users with a secure random password
            const randomPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({ 
                username: name, 
                email, 
                password: hashedPassword 
            });
            await user.save();
        }

        // Sign JWT using your .env secret
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ 
            token: jwtToken, 
            username: user.username, 
            id: user._id 
        });

    } catch (err) {
        console.error("Google Auth Error:", err);
        res.status(500).json({ error: "Google authentication failed" });
    }
});

// --- Plant CRUD Routes ---
app.get('/api/plants', async (req, res) => {
    try {
        const plants = await Plant.find();
        res.json(plants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/plants/category/:catName', async (req, res) => {
    try {
        const plants = await Plant.find({ category: req.params.catName });
        res.json(plants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Favorites Routes ---
app.post('/api/user/favorite', async (req, res) => {
    try {
        const { userId, plantId } = req.body;
        await User.findByIdAndUpdate(userId, { $addToSet: { favorites: plantId } });
        res.status(200).json({ message: "Added to favorites!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/user/favorites/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('favorites');
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Route to REMOVE a plant from favorites
// Route to REMOVE a plant from favorites
app.post('/api/user/favorite/remove', async (req, res) => {
    try {
        const { userId, plantId } = req.body;
        
        // $pull removes the specific plantId from the favorites array
        const user = await User.findByIdAndUpdate(
            userId, 
            { $pull: { favorites: plantId } },
            { new: true } // Returns the updated user document
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Removed from favorites!" });
    } catch (err) {
        console.error("Remove Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});