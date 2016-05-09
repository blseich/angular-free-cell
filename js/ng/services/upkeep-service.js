angular.module('services')
  .service('upkeepService', ['locationService', function(locationService) {
    this.autoAssociate = function(newLanes) {
      newLanes.forEach(function(lane) {
        var cardsLeftInLane = lane.length,
            card = lane[cardsLeftInLane - 1],
            nextCard = lane[cardsLeftInLane - 2];
        if(!!card) {
          card.disassociate();
        }
        while (cardsLeftInLane > 1 && nextCard.associate(card)) {
          cardsLeftInLane--;
          card = nextCard;
          nextCard = lane[cardsLeftInLane - 2];
        }
      });
    };

    this.emptyLaneCleanup = function(newLanes) {
      newLanes.forEach(function(lane){
        if(lane.length === 0) {
          lane.push(Card.NULL_CARD());
        } else if(lane.length > 1 && lane[0].isNull) {
          lane.splice(0, 1);
        }
      });
    };

  }]);