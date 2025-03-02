const User=require("../schemas/User");
const loadenv=require("dotenv");
loadenv.config();
const uuidv4=require("uuid").v4
exports.createUser=async (req, res) => {
    try {
      const { username } = req.body;
      
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      
      const user = new User({ username });
      await user.save();
      
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

exports.getUserInfo=async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        username: user.username,
        score: user.score,
        totalGames: user.gameHistory.length
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
exports.updateUser=async (req, res) => {
    try {
      const { correct, destinationId } = req.body;
      
      const user = await User.findOne({ username: req.params.username });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (correct) {
        user.score.correct += 1;
      } else {
        user.score.incorrect += 1;
      }
      
      user.gameHistory.push({
        destinationId,
        correct,
        timestamp: new Date()
      });
      
      user.lastPlayed = new Date();
      await user.save();
      
      res.json({ score: user.score });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
exports.generateChallenge=async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const challengeId = uuidv4();
      

      
      res.json({
        challengeId,
        challengeUrl: `${process.env.FRONTEND_URL}/challenge/${challengeId}?from=${user.username}`,
        userScore: user.score
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }