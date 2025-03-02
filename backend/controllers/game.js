const User=require("../schemas/User");
const Destination=require("../schemas/Destination");
const Game=require("../schemas/Game")



exports.createGame=async (req, res) => {
    try {
      const { username } = req.body;
      
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const destinations = await Destination.aggregate([
        { $sample: { size: 10 } }
      ]);
      
      const game = new Game({
        userId: user._id,
        destinations: destinations.map(dest => ({
          destinationId: dest._id,
          answered: false
        })),
        currentDestinationIndex: 0
      });
      
      await game.save();
      
      const currentDestination = destinations[0];
      
      res.json({
        gameId: game._id,
        destination: {
          id: currentDestination._id,
          clues: currentDestination.clues.slice(0, 2) 
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

exports.submitAnswer=async (req, res) => {
    try {
      const { answer } = req.body;
      
      const game = await Game.findById(req.params.gameId);
      
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      
      const currentIndex = game.currentDestinationIndex;
      const currentDestinationId = game.destinations[currentIndex].destinationId;
      debugger
      const destination = await Destination.findById(currentDestinationId);
      console.log(destination)
      const isCorrect = destination.name === answer;
      
      game.destinations[currentIndex].answered = true;
      game.destinations[currentIndex].correct = isCorrect;
      
      if (currentIndex < game.destinations.length - 1) {
        game.currentDestinationIndex += 1;
      } else {
        game.active = false;
      }
      
      game.lastPlayed = new Date();
      await game.save();
      
      const user = await User.findById(game.userId);
      if (isCorrect) {
        user.score.correct += 1;
      } else {
        user.score.incorrect += 1;
      }
      
      user.gameHistory.push({
        destinationId: currentDestinationId,
        correct: isCorrect
      });
      
      user.lastPlayed = new Date();
      await user.save();
      
      const randomFunFactIndex = Math.floor(Math.random() * destination.funFacts.length);
      const funFact = destination.funFacts[randomFunFactIndex];
      
      let nextDestination = null;
      if (game.active) {
        const nextDestinationId = game.destinations[game.currentDestinationIndex].destinationId;
        const nextDest = await Destination.findById(nextDestinationId);
        
        nextDestination = {
          id: nextDest._id,
          clues: nextDest.clues.slice(0, 2) 
        };
      }
      
      res.json({
        correct: isCorrect,
        destination: destination.name,
        funFact,
        nextDestination,
        gameCompleted: !game.active,
        score: user.score
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }