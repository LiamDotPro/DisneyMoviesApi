var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const sqlite3 = require('sqlite3').verbose();
const DisneyMovie = require('./models/disneyMovie');
const MoviesWithLessDetail = require('./models/moviesWithLessDetail');

const db = new sqlite3.Database('./database/DisneyMoviesDB.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Enable CORS for all routes
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/movies', (req, res) => {
  const sql = 'SELECT * FROM disney_movies';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    const movies = rows.map(row => new DisneyMovie(
        row.MovieId,
        row.title,
        row.year,
        row.link,
        row.image,
        row.runtime,
        row.genre,
        row.summary,
        row.rating,
        row.metascore,
        row.directors,
        row.stars
    ));
    res.json(movies);
  });
});

app.get('/api/movies/less-detail', (req, res) => {
  const sql = 'SELECT MovieId, Title, Year, Image, Rating FROM disney_movies';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    const movies = rows.map(row => new MoviesWithLessDetail(
        row.MovieId,
        row.title,
        row.year,
        row.image,
        row.rating
    ));
    res.json(movies);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
