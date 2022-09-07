const express = require('express');
const mongoose= require('mongoose');
// --------------------IMPORTER LES ROUTES--------------------
const userRoute=require('./routes/userRoute');
// const sauceRoute= require('./routes/sausceRoute');


mongoose.connect('mongodb+srv://p6:p6@cluster0.8s4p9v0.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

// ---------------HEADERS-------------------------------------
app.use((req, res, next) => {
  console.log('coucou');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
  // -------------------IMPLEMENTER LES ROUTES DANS L'APPLICATION------------------------------
  app.use('/api/auth',userRoute)
  // app.use('api/',sauceRoute);

module.exports = app;