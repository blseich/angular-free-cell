describe('Controller', function() {
    var $scope,
        $controller,
        testCard, higherTestCard, highestTestCard;


    function _mockCard() {
      return {
        'selected': false,
        'associate': function(card) {
          if (card) {
            this.associateCard = card;
            return true          
          } else {
            return this.associateCard;
          }
        },
        'disassociate': function() {}
      };
    }

    function _mockLanes() {
      var mockLanes = [];
      for(var i = 0; i < 4; i++) {
        mockLanes[i] = [];
        for(var j = 0; j < 7; j++) {
          var mockCard = _mockCard();
          sinon.spy(mockCard, 'associate');
          mockLanes[i].push(mockCard);
        }
      }
      for(var i = 4; i < 8; i++) {
        mockLanes[i] = [];
        for(var j = 0; j < 6; j++) {
          var mockCard = _mockCard();
          sinon.spy(mockCard, 'associate');
          mockLanes[i].push(mockCard);
        }
      }
      return mockLanes;
    }

    beforeEach(module('FreeCell'));

    beforeEach(inject(function($rootScope, _$controller_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      $scope = $rootScope.$new();
    }));

    beforeEach(function() {
      var mockLanes = _mockLanes(),
          controllerParams = {};

      mockLanes[0][6] = testCard = _mockCard();
      mockLanes[0][5] = higherTestCard = _mockCard();
      mockLanes[0][4] = highestTestCard = _mockCard();

      controllerParams.$scope = $scope;
      controllerParams.playArea = {lanes: mockLanes};
      controllerParams.indexFunctions = {
        isFirstInLane: function(card) {return true}
      }
      controller = $controller('FreeCellController', controllerParams);     
    });

    describe('Card Selection/Deselection', function() {
      it('should set card selected on first call', function() {
        $scope.takeAction(testCard);
        expect(testCard.selected).to.be.true;
      });

      it('should deselect card if card is already selected', function() {
        $scope.takeAction(testCard);
        $scope.takeAction(higherTestCard);
        expect(testCard.selected).to.be.false;
      });

      it('should select all associate cards', function() {
        higherTestCard.associate(testCard);
        $scope.takeAction(higherTestCard);
        expect(higherTestCard.selected).to.be.true;
        expect(testCard.selected).to.be.true;
      });

      it('should deselect all associate cards', function() {
        higherTestCard.associate(testCard);
        $scope.takeAction(higherTestCard);
        $scope.takeAction(highestTestCard);
        expect(higherTestCard.selected).to.be.false;
        expect(testCard.selected).to.be.false;
      });

      it('should select new cards if new card selected has associates', function() {
        higherTestCard.associate(testCard);
        $scope.takeAction(highestTestCard);
        $scope.takeAction(higherTestCard);
        expect(higherTestCard.selected).to.be.true;
      });

      it('should deselect old card if new card selected has associate', function() {
        higherTestCard.associate(testCard);
        $scope.takeAction(highestTestCard);
        $scope.takeAction(higherTestCard);
        expect(highestTestCard.selected).to.be.false;
      });

      it('should deselect card if association fails', function() {
        higherTestCard.associate = function(){return false};
        $scope.takeAction(testCard);
        $scope.takeAction(higherTestCard);
        expect(testCard.selected).to.be.false;
      });
    });

    describe('Card Association', function() {

      beforeEach(function() {
        sinon.spy(higherTestCard, 'associate');
      });

      it('should associate cards if card is already selected', function() {
        $scope.takeAction(testCard);
        $scope.takeAction(higherTestCard);
        assert(higherTestCard.associate.called, 'associate not called');
        assert(higherTestCard.associate.calledWith(testCard), 'associate not called with proper args');
      });
      
      it('should not call associate if card to move to already has an associated card', function() {
        higherTestCard.associate(testCard);
        $scope.takeAction(highestTestCard);
        $scope.takeAction(higherTestCard);
        expect(higherTestCard.associate.calledWith(highestTestCard)).to.be.false;
      });
    });

    describe('Auto Associations', function() {

      beforeEach(function() {
        sinon.stub(higherTestCard, 'associate', function(){return true});
        sinon.stub(highestTestCard, 'associate');

      });

      it('should call associate on proper card of lane', function() {
        var firstCard = $scope.lanes[0][$scope.lanes[0].length - 1],
            secondCard = $scope.lanes[0][$scope.lanes[0].length - 2];
        $scope.$digest();
        assert(secondCard.associate.called, 'associate wasn\'t called');
        assert(secondCard.associate.calledWith(firstCard), 'associate wasn\'t called with proper arg');
      });

      it('should attempt association on all lanes', function() {
        for (var i = 0; i < 8; i++) {
          var laneCard = $scope.lanes[i][$scope.lanes[i].length - 2];
          $scope.$digest();
          assert($scope.lanes[i][$scope.lanes[i].length - 2].associate.called, 'associate wasn\'t called on ' + i);
        }
      });

      it('should attempt successive associations if successful', function() {        
        $scope.lanes[0][$scope.lanes[0].length - 1] = testCard;
        $scope.lanes[0][$scope.lanes[0].length - 2] = higherTestCard;
        $scope.lanes[0][$scope.lanes[0].length - 3] = highestTestCard;

        $scope.$digest();

        assert(highestTestCard.associate.called, 'associate wasn\'t called');
      });

      it('should not attempt association on empty lanes', function() {
        $scope.lanes[0] = [];

        var digestWrapper = function() {
          $scope.$digest();
        }

        expect(digestWrapper).to.not.throw(Error);
      });

      it('should end assocaition if no more cards remain in lane', function() {
        $scope.lanes[0] = [_mockCard(), _mockCard()];
        var digestWrapper = function() {
          $scope.$digest();
        }
        expect(digestWrapper).to.not.throw(Error);
      });

      it('should remove associate if card is first in lane', function() {
        var card = _mockCard();
        sinon.spy(card, 'disassociate');
        $scope.lanes[0].push(card);

        $scope.$digest();

        assert(card.disassociate.called, "disassocaite wasn't called with undefined");
      });
    });

    describe('Card Movement', function() {
      var higherCardToMove,
          cardToMove;

      beforeEach(function() {
        $scope.lanes[1][5] = higherCardToMove = _mockCard();
        $scope.lanes[1][6] = cardToMove = _mockCard();
      });

      it('should move card to spot infront', function() {
        $scope.takeAction(cardToMove);
        $scope.takeAction(testCard);

        expect($scope.lanes[0][7]).to.be.equal(cardToMove);
      });

      it('should remove card from previous spot', function() {
        $scope.takeAction(cardToMove);
        $scope.takeAction(testCard);

        expect($scope.lanes[1].length).to.equal(6);
      });

      it('should move all cards associated to moving card', function() {
        higherCardToMove.associate(cardToMove);
        $scope.takeAction(higherCardToMove);
        $scope.takeAction(testCard);

        expect($scope.lanes[0][8]).to.be.equal(cardToMove);
      });

      it('should remove all cards associated from previous spots', function() {
        higherCardToMove.associate(cardToMove);
        $scope.takeAction(higherCardToMove);
        $scope.takeAction(testCard);

        expect($scope.lanes[1].length).to.equal(5);
      });

      it('should not move card if association fails', function() {
        higherCardToMove.associate = function() {return false};
        $scope.takeAction(testCard);
        $scope.takeAction(higherCardToMove);

        expect($scope.lanes[0].length).to.equal(7);
      });

    });

    describe('Allowing/Disallowing Action', function() {
      beforeEach(function() {
        var mockLanes = _mockLanes(),
            controllerParams = {},
            isFirst = false;

        controllerParams.$scope = $scope;
        controllerParams.playArea = {lanes: mockLanes};
        controllerParams.indexFunctions = {
          isFirstInLane: function(card) {return isFirst}
        }
        controller = $controller('FreeCellController', controllerParams);     
      });

      it('should not allow action if card is not first in lane and doesn\'t have associates', function() {
        expect($scope.takeAction(_mockCard())).to.be.false;
      });

      it('should allow action if card is first in lane and doesn\'t have associates', function() {
        isFirst = true;
        expect($scope.takeAction(_mockCard())).to.be.false;
      });

      it('should allow action if card has associate', function() {
        isFirst = false;
        var legalSelection = _mockCard();
        legalSelection.associate(_mockCard());
        expect($scope.takeAction(legalSelection)).to.be.true;
      });

    });

  });