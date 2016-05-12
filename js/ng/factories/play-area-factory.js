angular.module('factories')
  .factory('playArea', ['deck', function(deck) {
    var lanes = _dealCards(deck);
        
    return {
      lanes: lanes,
      freeCells: [[],[],[],[]],
      homeCells: [[],[],[],[]]
    };
  }])

function _dealCards(deck) {
  var lanes = [[],[],[],[],[],[],[],[]],
    laneAccessor = 0;
  deck.shuffle();
  for (var card in deck.deck) {
    lanes[laneAccessor].push(deck.deck[card]);
    laneAccessor = (laneAccessor + 1)%8;
  }
  return lanes;
}


