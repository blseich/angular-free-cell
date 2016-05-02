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

    beforeEach(module(function($provide) {
      $provide.service('cardService', function() {
        this.selectCard = sinon.stub();
        this.clearSelected = sinon.spy();
        this.selectedCard = sinon.stub();
        this.forEachAssociate = sinon.spy();
      });
      $provide.service('laneService', function() {
        this.laneContaining = sinon.stub().returns([]);
        this.autoAssociate = sinon.spy();
      });
      $provide.service('movementService', function() {
        this.isLegalMove = sinon.stub();
        this.moveToAssociate = sinon.stub();
      });
    }));

    beforeEach(inject(function($rootScope, _$controller_, _cardService_, _laneService_, _movementService_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      $scope = $rootScope.$new();
      cardService = _cardService_;
      laneService = _laneService_;
      movementService = _movementService_;
    }));

    beforeEach(function() {
      var mockLanes = _mockLanes(),
          controllerParams = {};

      mockLanes[0][6] = testCard = _mockCard();
      mockLanes[0][5] = higherTestCard = _mockCard();
      mockLanes[0][4] = highestTestCard = _mockCard();

      controllerParams.$scope = $scope;
      controllerParams.playArea = {lanes: mockLanes};
      controller = $controller('FreeCellController', controllerParams);    
    });

    describe('Card Selection/Deselection', function() {

      it('should select card', function() {
        $scope.takeAction(testCard);
        sinon.assert.calledWith(cardService.selectCard, testCard);
      });

      it('should deselect card if association fails', function() {
        higherTestCard.associate = function(){return false;};
        $scope.takeAction(testCard);
        $scope.takeAction(higherTestCard);
        expect(testCard.selected).to.be.false;
      });

      it('should select new card if association fails', function() {
        higherTestCard.associate = function(){return false;};
        $scope.takeAction(testCard);
        $scope.takeAction(higherTestCard);
        sinon.assert.calledWith(cardService.selectCard, higherTestCard);
      });

      it('should deselect all cards if association is successful', function() {
        higherTestCard = _mockCard();
        movementService.isLegalMove.withArgs(testCard).returns(false);
        movementService.isLegalMove.withArgs(higherTestCard).returns(true);
        cardService.selectedCard.returns(testCard);
        $scope.takeAction(testCard);
        $scope.takeAction(higherTestCard);
        sinon.assert.calledWith(cardService.clearSelected, testCard);
      });
    });

    describe('Auto Associations', function() {
      it('should auto associate when lanes have changed', function() {
        $scope.$digest();
        sinon.assert.calledOnce(laneService.autoAssociate);
      });
    });

    describe('Card Movement', function() {
      var m_card;
      
      beforeEach(function() {
        m_card = {
          associate: function(){}
        };
      });

      it('should see if move is legal', function() {
        $scope.takeAction(m_card);
        sinon.assert.calledWith(movementService.isLegalMove, m_card);
      });

      describe('move is legal', function() {

        beforeEach(function() {
          movementService.isLegalMove.returns(true);
        });

        it('should check for association after checking for legal move', function() {
          sinon.spy(m_card, 'associate');
          movementService.isLegalMove.returns(true);
          $scope.takeAction(m_card);
          sinon.assert.callOrder(movementService.isLegalMove, m_card.associate);
        });

        describe('association fails', function() {

          it('should not setup lanes for movement', function() {
            m_card.associate = function(){return false;}
            $scope.takeAction(m_card);
            sinon.assert.notCalled(movementService.moveToAssociate);
          });

        });

        describe('association succeeds', function() {
          beforeEach(function() {
            m_card.associate = function(){return true;};
          });

          it('should setup lanes for movement', function() {
            $scope.takeAction(m_card);
            sinon.assert.calledWith(movementService.moveToAssociate, m_card);
          });

          it('should moveToAssociate for each associate of selected card', function() {
            var moveFunction = function(){},
                m_previouslySelectedCard = {};
            cardService.selectedCard.returns(m_previouslySelectedCard);
            movementService.moveToAssociate.returns(moveFunction);
            $scope.takeAction(m_card);
            sinon.assert.calledWith(cardService.forEachAssociate, m_previouslySelectedCard, moveFunction);
          });

          it('should clear selected cards', function() {
            $scope.takeAction(m_card);
            sinon.assert.calledOnce(cardService.clearSelected);
          });
        });
      });


    });
  });