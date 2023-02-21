const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mocha = require('mocha');

const server = require('../app');

chai.use(chaiHttp);
let token, movieId;

describe('/api/movies tests', () => {  //* Describelar it'leri kapsar yani bir describe icinde birden fazla it olabilir. Describe da yapilan testi belirtmek icin kullanilir test islemi itlerle gerceklestirilir.
    before((done) => {      //! api servisine baglanmadan once tokenimiz olmali
        chai.request(server)
            .post('/authenticate')
            .send({ username: 'superadmin', password: 'superadmin' })
            .end((err, res) => {
                token = res.body.token;   //verdigimiz kullanicinin tokenini kullanabilir hale geldik
                done();
            });
    });

    describe('/GET movies', () => {
        it('it should GET all the movies', (done) => {
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe('/POST movie', () => {
        it('it should create a new movie entity', (done) => {
            const movie = {
                title: 'udemy',
                director_id: '63f126d8ef0f843fb34c59a7',
                category: 'Comedy',
                country: 'Turkey',
                year: 2023,
                imdb_score: 10
            }

            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('title');
                    res.body.should.have.a.property('director_id');
                    res.body.should.have.a.property('category');
                    res.body.should.have.a.property('country');
                    res.body.should.have.a.property('year');
                    res.body.should.have.a.property('imdb_score');
                    movieId = res.body._id;
                    done();
                });
        });
    });

    describe('/GET/movie_id movie', () => {
        it('It should get a movie by the given id', (done) => {
            chai.request(server)
                .get('/api/movies/' + movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('title');
                    res.body.should.have.a.property('director_id');
                    res.body.should.have.a.property('category');
                    res.body.should.have.a.property('country');
                    res.body.should.have.a.property('year');
                    res.body.should.have.a.property('imdb_score');
                    res.body.should.have.a.property('_id').eql(movieId);
                    done();
                });
        });
    });

    describe('/PUT/:movie_id movie', () => {
        it('it should UPDATE a movie entity', (done) => {
            const movie = {
                title: 'Ezgi',
                director_id: '63f126d8ef0f843fb34c59a1',
                category: 'Crime',
                country: 'Afghanistan',
                year: 2021,
                imdb_score: 3
            }

            chai.request(server)
                .put('/api/movies/' + movieId)
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('title').eql(movie.title);
                    res.body.should.have.a.property('director_id').eql(movie.director_id);
                    res.body.should.have.a.property('category').eql(movie.category);
                    res.body.should.have.a.property('country').eql(movie.country);
                    res.body.should.have.a.property('year').eql(movie.year);
                    res.body.should.have.a.property('imdb_score').eql(movie.imdb_score);
                    done();
                });
        });
    });


    describe('/DELETE/:movie_id movie', () => {
        it('it should DELETE a movie entity', (done) => {
            chai.request(server)
                .delete('/api/movies/' + movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('status').eql(1);
                    done();
                });
        });
    });
});