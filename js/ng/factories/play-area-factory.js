angular.module('factories')
  .factory('playArea', ['deck', function(deck) {
    var lanes = _dealCards(deck);
        
    return {
      lanes: lanes,
      stores: [[],[],[],[]],
      finished: [[],[],[],[]]
    };
  }])

function _createDeck() {
  var deck = [];
  for (var suit = 0; suit < 4; suit++) {
    for (var val = 0; val < 13; val++) {
      deck.push(new Card(values[val], suits[suit]));
    }
  }
  return deck;
}

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


