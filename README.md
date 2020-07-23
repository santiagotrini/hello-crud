# Hello CRUD

Una API REST en Express y Mongoose para una app de tomar notas.

## Qué vamos a hacer

Vamos a a hacer una API con las cuatro operaciones básicas sobre una colección de MongoDB. El acrónimo CRUD viene del inglés _create read update delete_ (crear, leer, actualizar y borrar). Para eso vamos a usar los métodos que Mongoose nos da para los modelos.

La base de datos va a guardar notas y en la próxima guía vamos a armar un _frontend_ en React para una aplicación de tomar notas que use esta API.

Además vamos a usar Postman para testear manualmente los _endpoints_.

## Creando el proyecto

Creamos el proyecto en la terminal.

```console
$ mkdir hello-crud
$ cd hello-crud
$ npm init -y
$ git init
$ touch index.js
$ mkdir api
$ mkdir api/routes api/models
$ touch api/routes/note.js
$ touch api/models/Note.js
$ npm i express mongoose cors morgan
$ npm i -D nodemon
$ echo node_modules > .gitignore
$ echo web: npm start > Procfile
```

Agregamos los scripts `dev` y `start` al `package.json`.

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

Vamos a necesitar después una base de datos en MongoDB Atlas y nuestro código en algún repo de GitHub.

Todo el código relativo a la API lo vamos a poner en el directorio `api`. Más adelante vamos a usar este mismo proyecto para desplegar nuestro _frontend_.

## Empezando

El esqueleto básico de Express que ya conocemos en `index.js`.

```js
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const morgan   = require('morgan');

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

// todo el middleware aca abajo y antes del listen

// listen
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});  
```

Entre la conexión a Mongo y el `app.listen()` vamos a poner todos los _middlewares_ de Express. Vamos uno por uno.

Primero agregamos los _middlewares_ de las librerías que instalamos. Y luego linkeamos las rutas de la API que vamos a definir en otro `api/routes/note.js`.

```js
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', require('./api/routes/note'));
```

Los dos _middlewares_ del medio no requiren mucha explicación, ya los usamos. CORS para evitar errores por SOP y Morgan para loggear mientras desarrollamos. Es recomendable sacar Morgan cuando llevamos la app a producción (cuando la ponemos a funcionar para los usuarios).

El primero merece una explicación. Cuando tengamos que crear o actualizar notas en la base de datos vamos a tener que pasar datos del cliente al servidor. Esos datos van a viajar en el cuerpo (_body_) de la petición HTTP en formato JSON. Para poder capturar ese JSON y verlo en `req.body` necesitamos `express.json()`, un _middleware_ incluído en Express.

La cuarta línea es nuestro archivo de rutas y nos va a generar un error porque todavía no hace nada. Vamos al código de `note.js` entonces.

## Definiendo los endpoints de la API

Un _endpoint_ es una URL y un método HTTP. Una de las ideas detrás de una API REST es hacer corresponder una URL con un recurso y un método HTTP con una operación.

Por recurso entendemos acá una colección en MongoDB, aunque podría ser otra cosa. En nuestro caso tenemos una sola colección, `notes` (notas).

Y por operación nos referimos a las operaciones CRUD. Hacemos corresponder los métodos HTTP de la siguiente manera:

- `POST`: crear (_create_)
- `GET`: leer (_read_)
- `PUT`: modificar (_update_)
- `DELETE`: eliminar (_delete_)

En total vamos a tener cinco _endpoints_ o rutas.

- `POST /notes`: crea una nota
- `GET /notes`: consulta todas las notas
- `GET /notes/id`: consulta una nota filtrando por ID
- `PUT /notes/id`: modifica una nota filtrando por ID
- `DELETE /notes/id`: elimina una nota filtrando por ID

Entonces `api/routes/note.js` viene a ser algo así.

```js
const express = require('express');
const router = express.Router();

const Note = require('../models/Note');

// POST /notes
router.post('/notes', (req, res, next) => {
  // ...
});
// GET /notes
router.get('/notes', (req, res, next) => {
  // ...
});
// GET /notes/id
router.get('/notes/:id', (req, res, next) => {
  // ...
});
// PUT /notes/id
router.put('/notes/:id', (req, res, next) => {
  // ...
});
// DELETE /notes/id
router.delete('/notes/:id', (req, res, next) => {
  // ...
});

module.exports = router;
```

Claro que no podemos hacer mucho en esas funciones hasta que no tengamos un modelo para trabajar con la base de datos.

## Modelo de nota

En la base de datos cada nota va a estar representada en un objeto similar a este.

```js
{
  _id: '5f1914483a78a51b1d3d69b1',
  title: 'Titulo de la nota',
  text: 'Texto de la nota',
  updatedAt: '2020-07-23T04:38:32.669Z',
  createdAt: '2020-07-23T04:38:32.669Z'
}
```

Donde los campos `updatedAt` y `createdAt` son _timestamps_ o fechas que indican el tiempo de creación y la última modificación y el campo `_id` es el identificador único generado por MongoDB. Vamos a darles valores por defecto a los dos últimos campos y hacer que los el título y el texto sean obligatorios. El ID se va a generar automáticamente. El archivo `api/models/Note.js` es sencillo.

```js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
```

Ahora sí podemos volver a las rutas, pero antes pensemos mal del usuario un poco y veamos de que manera podemos manejar los errores.

## Manejo de errores

El manejo de errores o _error handling_ como le dicen en inglés es una buena parte del trabajo de los desarrolladores. Uno tiene que pensar mal del usuario, el usuario rompe las cosas y las usa de maneras no anticipadas por el desarrollador.

Por ejemplo, a esta altura sabemos que rutas tienen sentido para esta app, pero en la barra de direcciones del navegador uno puede escribir lo que quiera, como `http://host.com/api/autos` o `http://host.com/ruta/secreta`.

Si esto va a ser una API REST más o menos seria tiene que comportarse como tal, si la ruta existe seguro va a devolver algo en JSON, pero si no existe también queremos que devuelva JSON, posiblemente indicando el error. Volvamos a `index.js` a ver que podemos hacer.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
