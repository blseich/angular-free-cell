angular.module('services')
  .service('laneService', ['playArea', function(playArea) {
    var lanes = playArea.lanes;

    this.isFirstInLane = function(card) {
      var laneContainingCard = lanes.find(function(lane) {
        return lane.includes(card);
      });
      return !!laneContainingCard && 
        laneContainingCard.indexOf(card) === laneContainingCard.length - 1;
    };

    this.laneContaining = function(card) {
      return lanes.find(function(lane) {
        return !!lane.find(function(checkCard) {
          return checkCard === card;
        });
      });
    };

    this.autoAssociate = function(newLanes) {
      newLanes.forEach(function(lane) {
        var cardsLeftInLane = lane.length,
            card = lane[cardsLeftInLane - 1],
            nextCard = lane[cardsLeftInLane - 2];
        while (cardsLeftInLane > 1 && nextCard.associate(card)) {
          cardsLeftInLane--;
          card = nextCard;
          nextCard = lane[cardsLeftInLane - 2];
        }
      });
      
    };

  }]);