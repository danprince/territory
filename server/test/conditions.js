var should = require('should');

var Board = require('../modules/board'),
    Conditions = require('../modules/conditions');

var board = new Board(3);
var conditions = new Conditions(board);

/*
 * 0 1 1
 * 0 0 0
 * 0 0 -
 */

board.set(0, 0, 0);
board.set(0, 1, 1);
board.set(0, 2, 1);
board.set(1, 0, 0);
board.set(1, 1, 0);
board.set(1, 2, 0);
board.set(2, 0, 0);
board.set(2, 1, 0);

describe('Conditions', function() {

  describe('#setCursor', function() {
    conditions.setCursor({ id: 0 }, 0, 0);
    it('Should have correct cursor', function() {
      conditions.cursor.x.should.equal(0);
      conditions.cursor.y.should.equal(0);
    });
  });

  describe('#neighbouring', function() {
    it('Should report valid neighbours', function() {
      conditions.neighbouring().should.equal(true);
      conditions.setCursor({ id: 1 }, 2, 1);
      conditions.neighbouring().should.equal(false);
      conditions.setCursor({ id: 1 }, 2, 0);
      conditions.neighbouring().should.equal(false);
    });
  });

  describe('#open', function() {
    it('Should report valid neighbours', function() {
      conditions.setCursor({ id: 1 }, 2, 1);
      conditions.open().should.equal(false);
      conditions.setCursor({ id: 1 }, 2, 2);
      conditions.open().should.equal(true);
    });
  });

  describe('#own', function() {
    it('Should report tile ownship', function() {
      conditions.setCursor({ id: 0 }, 0, 0);
      conditions.own().should.equal(true);
      conditions.setCursor({ id: 0 }, 0, 2);
      conditions.own().should.equal(false);

      conditions.setCursor({ id: 1 }, 0, 2);
      conditions.own().should.equal(true);
      conditions.setCursor({ id: 1 }, 0, 0);
      conditions.own().should.equal(false);

      conditions.setCursor({ id: 1 }, 2, 2);
      conditions.own().should.equal(false);
    });
  });

  describe('#opponent', function() {
    it('Should report tile ownship (opponent)', function() {
      conditions.setCursor({ id: 0 }, 0, 0);
      conditions.opponent().should.not.equal(true);
      conditions.setCursor({ id: 0 }, 0, 2);
      conditions.opponent().should.not.equal(false);

      conditions.setCursor({ id: 1 }, 0, 2);
      conditions.opponent().should.not.equal(true);
      conditions.setCursor({ id: 1 }, 0, 0);
      conditions.opponent().should.not.equal(false);
    });
  });

  describe('#stuck', function() {
    it('Should calculate whether a player is stuck', function() {
      conditions.stuck({ id: 0}).should.equal(false);
      conditions.stuck({ id: 1}).should.equal(true);
    });
  });
});

