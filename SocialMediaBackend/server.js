const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // For password hashing
const path = require('path');
const multer = require('multer'); // Multer for file uploads

const app = express();
const PORT = 5000;
const SECRET_KEY = "mysecretkey"; // Secret key for JWT

let users = []; // Temporary storage for users
let posts = []; // Temporary storage for posts

// ✅ Set up storage engine for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// ✅ Middleware
app.use(express.json());
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', path.join(__dirname, 'views')); // Set views directory

// ✅ Serve Static Files from /uploads
app.use('/uploads', express.static('uploads')); // Serve images from uploads/ folder

// ✅ Home Route - Render Posts Page
app.get('/', (req, res) => {
    res.render('index', { posts });
});

// ✅ User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
});

// ✅ User Login (Generate JWT)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// ✅ Middleware to protect routes
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ message: "Access Denied" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

// ✅ Get all posts (Public) with Pagination
app.get('/posts', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedPosts = posts.slice(startIndex, endIndex);
    res.json({
        total: posts.length,
        page,
        totalPages: Math.ceil(posts.length / limit),
        posts: paginatedPosts
    });
});

// ✅ Create a new post (Protected, with Image Upload)
app.post('/posts', authenticate, upload.single('image'), (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        image: req.file ? `/uploads/${req.file.filename}` : null
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// ✅ Update a post (Protected)
app.put('/posts/:id', authenticate, (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.title = req.body.title;
    post.content = req.body.content;
    res.json(post);
});

// ✅ Delete a post (Protected)
app.delete('/posts/:id', authenticate, (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== postId);
    res.json({ message: "Post deleted successfully" });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
