angular.module('services')
  .service('locationService', ['playArea', function(playArea) {
    var lanes = playArea.lanes,
        freeCells = playArea.freeCells;

    function _search(area, card) {
      return area.find(function(collection) {
        return collection.includes(card);
      });
    }

    this.isSelectable = function(card) {
      var laneContainingCard = this.laneContaining(card);
      return !!laneContainingCard && 
        laneContainingCard.indexOf(card) === laneContainingCard.length - 1;
    };

    this.laneContaining = function(card) {
      return _search(lanes, card) || _search(freeCells, card);
    };

    this.openCells = function() {
      return freeCells.filter(function(cell) {
        return !!cell.find(function(card) {
          return card.isNull;
        });
      }).length;
    }

  }]);