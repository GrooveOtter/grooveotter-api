
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Task = require('./task.model');
var mongoose = require('mongoose');
var uri = 'mongodb://localhost/goserver-test2'

describe('Save Tasks',function() {
  it('should save without error', function(done){
    var task = new Task({title: 'test2'});
    task.save(function(error) {
      if(error) console.log(error);
      task.title.should.equal('test2');
      done();
    });
  });
});

// describe('Update tasks', function () {
//   mongoose.createConnection(uri);
//   it('should update without error', function(done){
//     var task = new Task({title: 'title115'});
//     task.save(function(error) {
//       if(error) console.log(error);
//       Task.update({title: 'title115'},{$set: {title:'test771'}}, function (err, task){
//       });
//       Task.find({title:'title115'}, function(task) {
//         console.log('task', task);
//       });
//     });


//   });
// });


describe('Read tasks', function () {
  it('should find an individual task', function(done){
    var task = new Task({title: 'tests20'});
    task.save(function(error, task) {
      if(error) console.log(error);
      Task.find({title:'tests20'}).find(function(error, firstTask) {
        firstTask[0].title.should.equal('tests20');
        done();
      });
    });
  });
});

describe('Delete Tasks', function(){
  it('should find an individual task', function(done){
    var task = new Task({title: 'testing1001'});
    task.save(function(error, task){
      if (error) console.log(error);
      task.remove();
      Task.find({title: 'testing1001'}).find(function(error, deletedTask){
        Object.keys(deletedTask).length.should.equal(0);
        done();
      })
    });
  });
});

//Ugly use of callbacks
