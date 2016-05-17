angular.module('services')
  .service('locationService', ['playArea', function(playArea) {
    var lanes = playArea.lanes,
        freeCells = playArea.freeCells,
        homeCells = playArea.homeCells;

    function _search(area, card) {
      return area.find(function(collection) {
        return collection.includes(card);
      });
    }

    function _numberOpen(area) {
      return area.filter(function(collection) {
        return collection.find(function(card){
          return card.isNull;
        });
      }).length;
    }

    this.isSelectable = function(card) {
      var laneContainingCard = this.laneContaining(card);
      return !!laneContainingCard && 
        laneContainingCard.indexOf(card) === laneContainingCard.length - 1;
    };

    this.laneContaining = function(card) {
      return _search(lanes, card) || _search(freeCells, card) || _search(homeCells, card);
    };

    this.selectionLimit = function() {
      var openCells = _numberOpen(freeCells),
          openLanes = _numberOpen(lanes);
      return openLanes > 0 ? (openCells + 1) * openLanes * 2 : openCells + 1;
    };

  }]);