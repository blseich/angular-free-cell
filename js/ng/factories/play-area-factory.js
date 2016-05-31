angular.module('factories')
  .factory('playArea', ['deck', function(deck) {
    var lanes = [[], [], [], [], [], [], [], []];
        laneAccessor = 0;

    deck.shuffle();
    for (var card in deck.deck) {
      lanes[laneAccessor].push(deck.deck[card]);
      laneAccessor = (laneAccessor + 1)%8;
    }

    return {
      lanes: lanes,
      freeCells: [[Card.NULL_CARD()], [Card.NULL_CARD()], [Card.NULL_CARD()], [Card.NULL_CARD()]],
      homeCells: [[Card.NULL_CARD()], [Card.NULL_CARD()], [Card.NULL_CARD()], [Card.NULL_CARD()]]
    };
  }]);
