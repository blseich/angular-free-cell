describe('Controller', function() {
    var $scope,
        $controller,
        m_card, m_cardToAssociateWith;

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
      $controller('FreeCellController', {$scope: $scope});

      //setup stubbed objects
      m_card = {associate: sinon.stub()};
      m_cardToAssociateWith = {associate: sinon.stub()};
    }));

    describe('Card Selection/Deselection', function() {
      it('should select card', function() {
        $scope.takeAction(m_card);
        sinon.assert.calledWith(cardService.selectCard, m_card);
      });

      it('should select new card if association fails', function() {
        m_cardToAssociateWith.associate.returns(false);
        $scope.takeAction(m_cardToAssociateWith);
        sinon.assert.calledWith(cardService.selectCard, m_cardToAssociateWith);
      });

      it('should deselect all cards if association is successful', function() {
        movementService.isLegalMove.withArgs(m_card).returns(false);
        movementService.isLegalMove.withArgs(m_cardToAssociateWith).returns(true);
        cardService.selectedCard.returns(m_card);
        m_cardToAssociateWith.associate.returns(true);
        $scope.takeAction(m_card);
        $scope.takeAction(m_cardToAssociateWith);
        sinon.assert.calledWith(cardService.clearSelected, m_card);
      });
    });

    describe('Auto Associations', function() {
      it('should auto associate when lanes have changed', function() {
        $scope.$digest();
        sinon.assert.calledOnce(laneService.autoAssociate);
      });
    });

    describe('Card Movement', function() {
      it('should see if move is legal', function() {
        $scope.takeAction(m_card);
        sinon.assert.calledWith(movementService.isLegalMove, m_card);
      });

      describe('move is legal', function() {

        beforeEach(function() {
          movementService.isLegalMove.returns(true);
        });

        it('should check for association after checking for legal move', function() {
          movementService.isLegalMove.returns(true);
          $scope.takeAction(m_card);
          sinon.assert.callOrder(movementService.isLegalMove, m_card.associate);
        });

        describe('association fails', function() {

          it('should not setup lanes for movement', function() {
            m_card.associate.returns(false);
            $scope.takeAction(m_card);
            sinon.assert.notCalled(movementService.moveToAssociate);
          });

        });

        describe('association succeeds', function() {
          beforeEach(function() {
            m_card.associate.returns(true);
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