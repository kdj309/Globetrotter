const Destination=require("../schemas/Destination")
exports.getRandomDestination =async (req, res) => {
    try {
      const count = await Destination.countDocuments();
      const random = Math.floor(Math.random() * count);
      
      const destination = await Destination.findOne().skip(random);
      
      res.json({
        id: destination._id,
        clues: destination.clues.slice(0, 2) 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  exports.getOptions= async (req, res) => {
    try {
      const correctDestination = await Destination.findById(req.params.id);
      
      const incorrectDestinations = await Destination.aggregate([
        { $match: { _id: { $ne: correctDestination._id } } },
        { $sample: { size: 3 } }
      ]);
      
      const options = [
        { id: correctDestination._id, name: correctDestination.name },
        ...incorrectDestinations.map(dest => ({ id: dest._id, name: dest.name }))
      ];
      
      const shuffled = options.sort(() => 0.5 - Math.random());
      
      res.json({ options: shuffled });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.verifyAnswer=async (req, res) => {
    try {
      
      const destination = await Destination.findById(req.body.destination);
      console.log(destination)
      const isCorrect = destination?.name === req.body.answer;
      
      const randomFunFactIndex = Math.floor(Math.random() * destination.funFacts.length);
      const funFact = destination.funFacts[randomFunFactIndex];
      
      res.json({
        correct: isCorrect,
        destination: destination.name,
        funFact: funFact
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };