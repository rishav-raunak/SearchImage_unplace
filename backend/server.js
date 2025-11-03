import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import session from "express-session";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Passport initialize
app.use(passport.initialize());
app.use(passport.session()); 

//  MongoDB connect 
mongoose
  .connect(process.env.MONGO_URI, { dbName: "soulApp" })
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.log(" MongoDB error:", err.message));


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true }
});

const User = mongoose.model("User", userSchema);


const findOrCreateUser = async (profile, providerIdField) => {
  const userEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  if (!userEmail) {
    throw new Error("Could not retrieve email from provider.");
  }


  let user = await User.findOne({ [providerIdField]: profile.id });
  if (user) return user;

  
  user = await User.findOne({ email: userEmail });
  if (user) {
    
    user[providerIdField] = profile.id;
    user.name = user.name || profile.displayName;
    await user.save();
    return user;
  }

 
  const newUser = new User({
    [providerIdField]: profile.id,
    name: profile.displayName || profile.username,
    email: userEmail
  });
  await newUser.save();
  return newUser;
};


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile, 'googleId');
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
));

// github
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile, 'githubId');
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
));

//  Facebook 
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile, 'facebookId');
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please enter all fields" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    
    if (!user.password) {
      return res.status(400).json({ error: "Please login using the method you originally signed up with." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const sendTokenToFrontend = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

 
  res.send(`
    <script>
      window.opener.postMessage({
        token: "${token}",
        user: {
          name: "${req.user.name}",
          email: "${req.user.email}"
        }
      }, "http://localhost:3000"); // <-- Apna React App ka URL
      window.close();
    </script>
  `);
};

// Google OAuth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure', session: false }),
  sendTokenToFrontend
);

// GitHub OAuth
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure', session: false }),
  sendTokenToFrontend
);

// Facebook OAuth
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/failure', session: false }),
  sendTokenToFrontend
);

// OAuth fail hone par
app.get('/auth/failure', (req, res) => {
  res.send(`
    <script>
      window.opener.postMessage({
        error: "Authentication failed. Please try again."
      }, "http://localhost:3000"); // <-- Apna React App ka URL
      window.close();
    </script>
  `);
});





app.get("/", (req, res) => {
  res.send(" Backend Auth Server is running...");
});

//  server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));

