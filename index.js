// import packages
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const morgan   = require('morgan');

// TODO: usar dotenv

// config vars
const port = process.env.PORT        || 3000;
const db   = process.env.MONGODB_URI || 'mongodb://localhost/notas';

// crear app
const app = express();

// middleware
// parsear bodys con json
app.use(express.json());
app.use(morgan('dev'));  // para DEBUG
// usar cors
app.use(cors());
// api router
app.use('/api', require('./routes/api/note'));

/* TODO: handle errors
app.use('/api', (err, req, res) => {
  res.status(500).json({ err: err });
}); */

// conexion a la base de datos
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log(`DB connected @ ${db}`);
  })
  .catch(err => console.error(`Connection error ${err}`));

// listen
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});
