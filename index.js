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

// conexion a la base de datos
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log(`DB connected @ ${db}`);
  })
  .catch(err => console.error(`Connection error ${err}`));

// middleware
// parsear bodys con json
app.use(express.json());
// logger para desarrollo
app.use(morgan('dev'));
// usar cors
app.use(cors());
// api router
app.use('/api', require('./routes/api/note'));

// error handler
app.use((err, req, res, next) => {
  // DEBUG: console.error(err.stack)
  res.status(500).json({ msg: 'Something broke!' })
})

// listen
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});
