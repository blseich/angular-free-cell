describe('Home Cell Service', function() {
  var homeCellService, 
    homeCells, 
    aceOfSpades, aceOfHearts, twoOfSpades;

  beforeEach(module('services'));
  beforeEach(module(function($provide) {
    homeCells = [[],[],[],[]];
    $provide.service('playArea', function() {
      return {
        homeCells: homeCells
      };
    });
  }));

  beforeEach(inject(function(_homeCellService_) {
    homeCellService = _homeCellService_;
  }));

  describe('available cell', function() {
    var aceOfSpades = {
        value: 'A',
        suit: 'S'
      },
      twoOfSpades = {
        value: '2',
        suit: 'S'
      },
      genericSpade = {
        suit: 'S'
      },
      fiveOfSpades = {
        value: '5',
        suit: 'S'
      };

    describe('undefined', function() {
      it('should return undefined', function() {
        expect(homeCellService.availableCell(undefined)).to.be.undefined;
      });
    });

    describe('ace of any suit', function() {
      it('should return empty cell', function() {
        homeCells[0] = [{isNull: true}];
        expect(homeCellService.availableCell(aceOfSpades)).to.equal(homeCells[0]);
      });
    });

    describe('different suit', function() {
      it('should return undefined if card isn\'t allowed in any home cell', function() {
        expect(homeCellService.availableCell({suit: 'H'})).to.be.undefined;
      });
    });

    describe('same suit', function() {
      beforeEach(function() {
        homeCells[0] = [genericSpade];
      });

      describe('cell has one less card than card\'s value', function() {
        var jackOfSpades = {
          suit: 'S',
          value: 'J'
        };

        beforeEach(function(){
          homeCells[0] = [genericSpade, genericSpade, genericSpade, genericSpade];
        });

        it('should return home cell', function() {
          homeCells[0] = [{}, genericSpade, genericSpade, genericSpade, genericSpade];
          expect(homeCellService.availableCell(fiveOfSpades)).to.equal(homeCells[0]);
        });

        it('should return home cell for face card', function() {
          homeCells[0] = [{}, genericSpade, genericSpade, genericSpade, genericSpade, genericSpade,
                          genericSpade, genericSpade, genericSpade, genericSpade, genericSpade];
          expect(homeCellService.availableCell(jackOfSpades)).to.equal(homeCells[0]);
        });

      });

      describe('cell has two or more less than card\'s value', function() {
        it('should return undefined', function() {
          expect(homeCellService.availableCell(fiveOfSpades)).to.be.undefined;
        });
      });
      
    });

  });

});