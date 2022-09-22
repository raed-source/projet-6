require('dotenv').config();
const express = require('express');
const mongoose= require('mongoose');
const helmet=require('helmet');
// --------------------IMPORTER LES ROUTES--------------------

const path = require('path');
mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.MDP}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();
app.use(helmet());
const userRoute=require('./routes/userRoute');
const sauceRoute= require('./routes/sauceRoute');
// ---------------HEADERS-------------------------------------
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy','same-site');
    next();
  });
  app.use(express.json());
  app.use('/images',express.static(path.join(__dirname,'images')));

  // -------------------IMPLEMENTER LES ROUTES DANS L'APPLICATION------------------------------
  app.use('/api/auth',userRoute)
  app.use('/api/sauces',sauceRoute);

module.exports = app;