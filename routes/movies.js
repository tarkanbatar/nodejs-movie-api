const express = require('express');
const router = express.Router();

//* Models
const Movie = require('../models/Movie');

router.get('/', (req, res) => {  //Butun filmleri getiren endpoint
  const promise = Movie.aggregate([{
    $lookup: {
      from: 'directors',
      localField: 'director_id',
      foreignField: '_id',
      as: 'director'
    }
  },
  {
    $unwind: {
      path: '$director'
    }
  }
  ]);
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

//! ayni routeda iki tane get methodu yazmis olduk, bunu /:movie_id metodunun altina yazmis olsak top10 ifadesini movie_id olarak algilayip bulunamadi hatasi verecekti, bu metodun ustune yazdigimiz icin once buna ulasiyor ve bunun responseunu donuyor.
router.get('/top10', (req, res) => {  //Top10 filmleri getiren endpoint
  const promise = Movie.find({}).limit(10).sort({ imdb_score: -1 });    //buyukten kucuge siralamasi icin -1 dedik
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

router.get('/:movie_id', (req, res, next) => {       //URL'de gonderilen id numarasi req.params degiskenine dusecek ve biz bu bilgiye oradan ulasip kullanacagiz.
  const promise = Movie.findById(req.params.movie_id);
  promise.then((movie) => {
    if (!movie)
      next({ message: 'Movie was not found!', code: -1 });
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

router.get('/between/:start_year/:end_year', (req, res, next) => {       //URL'de gonderilen id numarasi req.params degiskenine dusecek ve biz bu bilgiye oradan ulasip kullanacagiz.
  const { start_year, end_year } = req.params;
  const promise = Movie.find(
    {
      year: {
        "$gte": parseInt(start_year),     //! $gte operatoru buyuk ya da esit anlaminda kullanilir (great or equal)  
        "$lte": parseInt(end_year)        //! $lte operatorude kucuk ya da esit icin kullanilir (less than or equal)
        //! bu veriler string geldigi icin stringten int'e parse etmemiz gerekiyor.
      }
    }
  );
  promise.then((movie) => {
    if (!movie)
      next({ message: 'Movie was not found!', code: -1 });
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

router.put('/:movie_id', (req, res, next) => {       //URL'de gonderilen id numarasi req.params degiskenine dusecek ve biz bu bilgiye oradan ulasip kullanacagiz.
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body,
    {
      new: true,
    }
  );
  promise.then((movie) => {
    if (!movie)
      next({ message: 'Movie was not found!', code: -1 });
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

router.delete('/:movie_id', (req, res, next) => {       //URL'de gonderilen id numarasi req.params degiskenine dusecek ve biz bu bilgiye oradan ulasip kullanacagiz.
  const promise = Movie.findByIdAndRemove(req.params.movie_id, { new: true });
  promise.then((movie) => {
    if (!movie)
      next({ message: 'Movie was not found!', code: -1 });
    res.json({ status: 1 });
  }).catch((err) => {
    res.json(err);
  });
});

router.post('/', function (req, res, next) {
  /*const { title, imdb_score, category, country, year } = req.body;
  
    const movie = new Movie({
      title: title,
      category: category,
      country: country,
      imdb_score: imdb_score,
      year: year
    }); */

  const movie = new Movie(req.body);   // dbye gondermek istedigimiz veriyi yukaridaki gibi ozellestirebildigimiz gibi bu sekilde de bir butun olarak gonderebiliriz.

  /*   movie.save((err, data) => {
      if(err)
        res.json(err)
      
      res.send({ status: 1});
    }); PROMISE YAPISI KULLANMADAN BU SEKILDE DATABASE KAYITLARINI GERCEKLESTIREBILIRIZ. */

  const promise = movie.save();
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  })
});

module.exports = router;
