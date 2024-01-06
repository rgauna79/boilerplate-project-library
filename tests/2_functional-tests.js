/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let bookID;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        //bookID = res.body[0]._id;
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({
          title: "something"
        })
        .end(function (err,res) {
          assert.equal(res.status, 200);
          bookID = res.body._id;
          assert.equal(res.body.title, "something")
          done();
        })
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({
          title: ""
        })
        .end(function (err,res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title')
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
        .request(server)
        .get('/api/books')
        .end(function (err,res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, "response should be an array")
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get('/api/books/6598b235d9ced04d18aac4bcinvalid')
        // .send({
        //   _id: '6598b235d9ced04d18aac4bcinvalid'
        // })
        .end(function (err,res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists')
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .get('/api/books/' + bookID)
        .end(function (err,res){
          console.log(res.body)
          assert.equal(res.status, 200);
          assert.equal(res.body._id, bookID)
          done();
        })
        .timeout(10000)
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books with comment for an existing book', function(done){
        chai
          .request(server)
          .post(`/api/books/${bookID}`)
          .send({
            comment: 'new comment'
          })
          .end(function (err, res){
            assert.equal(res.status, 200, 'Expected status code 200');
            assert.isArray(res.body.comments, 'Expected comments to be an array');
            assert.include(res.body.comments, 'new comment');
            done();
          });
      });
      

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .post(`/api/books/${bookID}`)
        .send({
          comment: ''
        })
        .end(function (err, res){
          assert.equal(res.status, 200, 'Expected status code 200');
          assert.equal(res.text, 'missing required field comment')
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .post(`/api/books/6598b235d9ced04d18aac4bcinvalid`)
        .send({
          comment: 'new comment'
        })
        .end(function (err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists')
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .delete(`/api/books/` + bookID)

        .end(function (err, res){
 
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful')
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .delete(`/api/books/6598b235d9ced04d18aac4bcinvalid`)
        .end(function (err, res){
 
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists')
          done();
        });
      });

    });

  });

});
