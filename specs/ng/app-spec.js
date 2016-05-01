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

    mockCardService = {
      selectCard: sinon.spy()//,
      //clearSelected: sinon.spy()
    }

    mockLaneService = {
      laneContaining: sinon.stub(),
      autoAssociate: sinon.spy()
    }

    beforeEach(module('FreeCell'));

    beforeEach(module(function($provide) {
      $provide.service('cardService', function() {
        this.selectCard = mockCardService.selectCard;
        //this.clearSelected = mockCardService.clearSelected;
      })
      $provide.service('laneService', function() {
        this.laneContaining = mockLaneService.laneContaining;
        this.autoAssociate = mockLaneService.autoAssociate;
      })
    }));

    beforeEach(inject(function($rootScope, _$controller_, _cardService_, _laneService_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      $scope = $rootScope.$new();
      cardService = _cardService_;
      laneService = _laneService_;
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
      xit('should clear selected cards', function() {
        $scope.takeAction(testCard);
        assert(mockCardService.clearSelected.calledOnce, "card service clear selected not called with proper arg");
      });

      it('should select card', function() {
        $scope.takeAction(testCard);
        assert(mockCardService.selectCard.withArgs(testCard).calledOnce, "card service select card not called with proper arg");
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

      xit('should associate cards if card is already selected', function() {
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
      it('should auto associate when lanes have changed', function() {
        $scope.$digest();
        sinon.assert.calledOnce(mockLaneService.autoAssociate);
      });
    });

    describe('Card Movement', function() {
      var higherCardToMove,
          cardToMove;

      beforeEach(function() {
        higherCardToMove = _mockCard();
        cardToMove = _mockCard();
        mockLaneService.laneContaining.withArgs(cardToMove).returns($scope.lanes[1]);
        mockLaneService.laneContaining.withArgs(testCard).returns($scope.lanes[0]);
        mockLaneService.laneContaining.withArgs(higherCardToMove).returns($scope.lanes[1]);
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

      xit('should not allow action if card is not first in lane and doesn\'t have associates', function() {
        expect($scope.takeAction(_mockCard())).to.be.false;
      });

      xit('should allow action if card is first in lane and doesn\'t have associates', function() {
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