var values = {
    0: "A",
    1: "2",
    2: "3",
    3: "4",
    4: "5",
    5: "6",
    6: "7",
    7: "8",
    8: "9",
    9: "10",
    10: "J",
    11: "Q",
    12: "K"
  }, suits = {
    0: "S",
    1: "H",
    2: "D",
    3: "C"
  };

angular.module('factories',[])
  .factory('deck', [function() {
    var deck = _createDeck();

    function shuffle() {
      var i, j, k, temp;

      // Shuffle the stack 'n' times.

      for (i = 0; i < Math.random(); i++) {
        for (j = 0; j < deck.length; j++) {
          k = Math.floor(Math.random() * deck.length);
          temp = deck[j];
          deck[j] = deck[k];
          deck[k] = temp;
        }
      }
    }

    return {
      deck: deck,
      shuffle: shuffle
    };

  }])
  .factory('playArea', ['deck', function(deck) {
    var lanes = _dealCards(deck);
        
    return {
      lanes: lanes,
      stores: [[],[],[],[]],
      finished: [[],[],[],[]]
    };
  }])
  .factory('indexFunctions', ['playArea', function(playArea) {
    var lanes = playArea.lanes;
    
    function isFirstInLane(card) {
      var laneContainingCard = lanes.find(function(lane) {
        return lane.includes(card);
      });
      return !!laneContainingCard && laneContainingCard.indexOf(card) === laneContainingCard.length - 1;
    }
    
    return {
      isFirstInLane: isFirstInLane
    }
  }]);



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


