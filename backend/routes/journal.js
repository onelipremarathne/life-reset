const express = require ('express');
const router = express.Router();
const JournalEntry = require ('../models/JournalEntry');

router.get ('/', async(req,res)=>{
    try{
        const entries = await JournalEntry.find().sort({ createdAt: -1 });
        res.json(entries);
    } catch (err){
        res.status(500).json({error: err.message});
    }
});


router.post('/', async (req,res)=>{
    try{
        const {date, title, mood, entry}= req.body;
        const newEntry = new JournalEntry({date, title, mood, entry});
        const saved = await newEntry.save();
        res.status(201).json(saved);
    }catch (err) {
    res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await JournalEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Entry not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async(req,res)=>{
    try{
        const deleted = await JournalEntry.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({error:'Entry not found'});
        res.json({message: 'Entry deleted'});
    } catch (err){
        res.status(500).json({error: err.message});
    }
})

module.exports = router;