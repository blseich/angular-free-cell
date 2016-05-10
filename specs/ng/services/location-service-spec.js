describe('Lane Service', function() {
  var locationService, lanes;

  beforeEach(module('services'));

  beforeEach(module(function($provide) {
    lanes = [[],[],[],[],[],[],[],[]];
    freeCells = [[],[],[],[]];
    $provide.service('playArea', function() {
      return {
        lanes: lanes,
        freeCells: freeCells
      };
    });
  }));

  beforeEach(inject(function(_locationService_) {
    locationService = _locationService_;
  }));

  describe('is selectable', function() {
    
    it('should return true if card is first in lane', function() {
      var card = {};
      lanes[0] = [card];
      expect(locationService.isSelectable(card)).to.be.true;
    });

    it('should not return true if card is not first in lane', function() {
      var notFirst = {},
          actuallyFirst = {};
      lanes[1] = [notFirst, actuallyFirst];
      expect(locationService.isSelectable(notFirst)).to.be.false;
    });

    it('should return true if card is in a free cell', function() {
      var selectable = {};
      freeCells[0] = [selectable];
      expect(locationService.isSelectable(selectable)).to.be.true;
    });
  });

  describe('lane containing', function() {

    it('should return lane that contains given card', function() {
      var findCard = {};
      lanes[2] = [findCard];
      expect(locationService.laneContaining(findCard)).to.equal(lanes[2]);
    });

    it('should return free-cell containing card if it\'s not found in a lane', function() {
      var findCard = {};
      freeCells[0] = [findCard];
      expect(locationService.laneContaining(findCard)).to.equal(freeCells[0]);
    });

  });

  describe('open cells', function() {
    it("should return number of cells containing null cards", function() {
      freeCells[0] = {isNull: true};
      freeCells[1] = {isNull: true};
      expect(locationService.openCells()).to.equal(2);
    });
  });

});