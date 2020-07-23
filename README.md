# Hello CRUD

Una API REST en Express y Mongoose para una app de tomar notas.

## Qué vamos a hacer

Vamos a a hacer una API con las cuatro operaciones sobre una colección de MongoDB. El acrónimo CRUD del inglés _create read update delete_ (crear, leer, actualizar y borrar). Para eso vamos a usar los métodos que Mongoose nos da para los modelos.

La base de datos va a guardar notas y en la próxima guía vamos a armar un _frontend_ para una aplicación de tomar notas que use este _backend_.

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
