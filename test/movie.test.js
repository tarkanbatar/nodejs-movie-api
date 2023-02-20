const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mocha = require('mocha');

const server = require('../app');

chai.use(chaiHttp);
let token;

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

    describe('/POST movie',()=>{
        it('it should create a new movie entity', (done)=>{
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
                .end((err,res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    
});