describe('Lane Service', function() {
  var locationService, lanes, freeCells, homeCells;

  beforeEach(module('services'));

  beforeEach(module(function($provide) {
    lanes = [[],[],[],[],[],[],[],[]];
    freeCells = [[],[],[],[]];
    homeCells = [[],[],[],[]];
    $provide.service('playArea', function() {
      return {
        lanes: lanes,
        freeCells: freeCells,
        homeCells: homeCells
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

    it('should return home-cell containing card if it\'s not found in a lane or free-cell', function() {
      var findCard = {};
      homeCells[0] = [findCard];
      expect(locationService.laneContaining(findCard)).to.equal(homeCells[0]);
    });

  });

  describe('selection restriction', function() {
    function _mockCard() {
      return {};
    }


    beforeEach(function() {
      for(lane in lanes) {
        lane[0] = _mockCard();
      }
      for(cell in freeCells) {
        cell[0] = _mockCard();
      }
    });

    describe('no open lanes', function() {
      it('should return number of cells containing null cards plus one', function() {
        freeCells[0] = [{isNull: true}];
        expect(locationService.selectionLimit()).to.equal(2);
      });
    });

    describe('no open cells', function() {
      it('should return number of lanes containing null cards times 2', function() {
        lanes[0] = [{isNull: true}];
        expect(locationService.selectionLimit()).to.equal(2);
      });     
    });

    describe('open lanes and open cells', function() {
      it('should return number of cells containing null cards plus one times double the number of open lanes', function() {
        freeCells[0] = [{isNull: true}];
        lanes[0] = [{isNull: true}];
        expect(locationService.selectionLimit()).to.equal(4);
      });
    });

  });

});