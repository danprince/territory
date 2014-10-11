var should = require('should');

var Board = require('../lib/board');

var board = new Board(3);

describe('Board', function() {

  describe('#constructor', function() {
    it('Should create an instance of Board', function() {
      (board instanceof Board).should.equal(true);
    });
  });

  describe('#set/#at', function() {
    it('Should have set the correct tile', function() {
      board.set(0, 0, 0);
      board.at(0, 0).should.equal(0);
      board.set(1, 1, 1);
      board.at(1, 1).should.equal(1);
      board.set(2, 2, 2);
      board.at(2, 2).should.equal(2);
    });
  });

  describe('#isWithin', function() {
    it('Should return false for out of bounds', function() {
      board.isWithin(-1, 4).should.equal(false);
      board.isWithin(0, 3).should.equal(false);
      board.isWithin(1, 2).should.equal(true);
      board.isWithin(0, 0).should.equal(true);
      board.isWithin(2, 2).should.equal(true);
      board.isWithin(3, 3).should.equal(false);
    });
  });

  describe('#all', function() {
    it('Should return an array of correct length', function() {
      board.all(0).should.have.lengthOf(1);
      board.all(1).should.have.lengthOf(1);
      board.all(2).should.have.lengthOf(1);
    });
  });

  describe('#full', function() {
    it('should not be full', function() {
      board.full().should.not.equal(true);
    });

    var full = new Board(3);
    // fill board
    for(var x = 0; x < 3; x++) {
      for(var y = 0; y < 3; y++) {
        full.set(x, y, 0);
      }
    }

    it('should be full', function() {
      full.full().should.equal(true);
    });
  });

  describe('#neighbours', function() {
    it('should have correct number of elements', function() {
      board.neighbours(1, 1).should.have.lengthOf(8);
      board.neighbours(0, 0).should.have.lengthOf(3);
      board.neighbours(0, 1).should.have.lengthOf(5);
      board.neighbours(2, 2).should.have.lengthOf(3);
      board.neighbours(1, 2).should.have.lengthOf(5);
    });
  });
});
