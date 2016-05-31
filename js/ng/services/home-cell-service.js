angular.module('services')
  .service('homeCellService', ['playArea', function(playArea) {
    var homeCells = playArea.homeCells;

    function _emptyCell() {
      return function(cell) {
        return cell.length === 1;
      };
    };

    function _suitedCell(suit) {
      return function(cell) {
        return !!cell[1] ? cell[1].suit === suit : false;
      };
    };

    function _numValue(cardVal) {
      var faceCardValues = {
        A: 1,
        J: 11,
        Q: 12,
        K: 13
      };
      return faceCardValues[cardVal] || parseInt(cardVal);
    }

    this.availableCell = function(card) {
      if (card !== undefined) {
        if (card.value === 'A') {
          return homeCells.find(_emptyCell());
        } else {
          var suitedCell = homeCells.find(_suitedCell(card.suit)) || [];
          return suitedCell.length === _numValue(card.value) ? suitedCell : undefined;
        }
      }
    };

  }]);
