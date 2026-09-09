require ('dotenv').config();

const express = require ('express');
const mongoose = require ('mongoose');
const cors= require('cors');

const app = express();
const habitRoutes = require ('./routes/habits');

//middleware
app.use(cors());
app.use(express.json());

app.use('/api/habits',habitRoutes);

//test route
app.get('/',(req,res)=>{
    res.json({message: 'API is running'});
});

//connect to MongoDB
const PORT = process.env.PORT||5000;

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('MongoDB connected');
    app.listen(PORT,()=>{
        console.log(`server running on http://localhost:${PORT}`);
    });
}).catch((err)=>{
    console.error('mongoDB connection error:', err);
})