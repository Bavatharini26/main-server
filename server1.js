import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";


const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(`mongodb+srv://Bavatharini:againbitchesnotallowed@cluster0.6k1a2ao.mongodb.net/webdev`
    
);
const db = mongoose.connection;

db.once('open', () => {
    console.log("Mongodb connection successful");
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },   
    password: { type: String, required: true },
    //confirmpassword: { type: String, required: true }
});

const UserModel = mongoose.model("users", userSchema);

app.post('/register', async (req, res) => {
    const { username, email, password  } = req.body;
    
    try {
        const user = new UserModel({ username,email, password });
         //  const hashedPassword = await bcrypt.hash(password, 10);
        await user.save();
        res.json({ success: true });
    } catch (error) {
        console.log('Error during registration:', error);
        res.json({ success: false });
    }
});

app.post('/login', async (req, res) => {
    const {username, email, password } = req.body;
    
    
    try {
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        // Compare the provided password with the hashed password
        const passwordMatch = (password==user.password);
        
        if (passwordMatch) {
            res.json({ success: true });``
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log('Error during login:', error);
        popup('you are not a user');
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
