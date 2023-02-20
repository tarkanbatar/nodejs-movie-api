const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mocha = require('mocha');

const server = require('../app');

chai.use(chaiHttp);

describe('Node Server', ()=>{  //* Describelar it'leri kapsar yani bir describe icinde birden fazla it olabilir. Describe da yapilan testi belirtmek icin kullanilir test islemi itlerle gerceklestirilir.
    it('(GET /) anasayfayi dondurur', (done)=>{
        chai.request(server)
            .get('/')
            .end((err, res)=>{
                res.should.have.status(200);
                done();
            })
    });
});