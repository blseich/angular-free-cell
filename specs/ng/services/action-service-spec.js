describe('Action Service', function() {
  var actionService,
      cardService, movementService,
      m_card, m_cardToAssociateWith;

  beforeEach(module('FreeCell'));

  beforeEach(module(function($provide) {
    $provide.service('cardService', function() {
      this.selectCard = sinon.stub();
      this.clearSelected = sinon.spy();
      this.selectedCard = sinon.stub();
      this.forEachAssociate = sinon.spy();
    });
    $provide.service('movementService', function() {
      this.isLegalMove = sinon.stub();
      this.moveToAssociate = sinon.stub();
    });
  }));

  beforeEach(inject(function(_cardService_, _movementService_, _actionService_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    actionService = _actionService_;
    cardService = _cardService_;
    movementService = _movementService_;

    //setup stubbed objects
    m_card = {associate: sinon.stub()};
    m_cardToAssociateWith = {associate: sinon.stub()};
  }));

  describe('Card Actions', function(){
    describe('Card Selection/Deselection', function() {
      it('should select card', function() {
        actionService.playAreaCardAction(m_card);
        sinon.assert.calledWith(cardService.selectCard, m_card);
      });

      it('should select new card if association fails', function() {
        m_cardToAssociateWith.associate.returns(false);
        actionService.playAreaCardAction(m_cardToAssociateWith);
        sinon.assert.calledWith(cardService.selectCard, m_cardToAssociateWith);
      });

      it('should deselect all cards if association is successful', function() {
        movementService.isLegalMove.withArgs(m_card).returns(false);
        movementService.isLegalMove.withArgs(m_cardToAssociateWith).returns(true);
        cardService.selectedCard.returns(m_card);
        m_cardToAssociateWith.associate.returns(true);
        actionService.playAreaCardAction(m_card);
        actionService.playAreaCardAction(m_cardToAssociateWith);
        sinon.assert.calledWith(cardService.clearSelected, m_card);
      });
    });

    describe('Card Movement', function() {
      it('should see if move is legal', function() {
        actionService.playAreaCardAction(m_card);
        sinon.assert.calledWith(movementService.isLegalMove, m_card);
      });

      describe('move is legal', function() {

        beforeEach(function() {
          movementService.isLegalMove.returns(true);
        });

        it('should check for association after checking for legal move', function() {
          movementService.isLegalMove.returns(true);
          actionService.playAreaCardAction(m_card);
          sinon.assert.callOrder(movementService.isLegalMove, m_card.associate);
        });

        describe('association fails', function() {

          it('should not setup lanes for movement', function() {
            m_card.associate.returns(false);
            actionService.playAreaCardAction(m_card);
            sinon.assert.notCalled(movementService.moveToAssociate);
          });

        });

        describe('association succeeds', function() {
          beforeEach(function() {
            m_card.associate.returns(true);
          });

          it('should setup lanes for movement', function() {
            actionService.playAreaCardAction(m_card);
            sinon.assert.calledWith(movementService.moveToAssociate, m_card);
          });

          it('should moveToAssociate for each associate of selected card', function() {
            var moveFunction = function(){},
                m_previouslySelectedCard = {};
            cardService.selectedCard.returns(m_previouslySelectedCard);
            movementService.moveToAssociate.returns(moveFunction);
            actionService.playAreaCardAction(m_card);
            sinon.assert.calledWith(cardService.forEachAssociate, m_previouslySelectedCard, moveFunction);
          });

          it('should clear selected cards', function() {
            actionService.playAreaCardAction(m_card);
            sinon.assert.calledOnce(cardService.clearSelected);
          });
        });
      });
    });

  });

  describe('Free Cell Actions', function() {
    var m_card = {
          associate: sinon.stub()
        },
        nullCard = {isNull: true},
        moveFunc = function() {};

    beforeEach(function() {
        m_card.associate.returns(undefined);
        cardService.selectedCard.returns(m_card);
    });

    describe('unoccupied cell', function() {

      it('should only move if cell is unoccupied', function() {
        actionService.freeCellCardAction({isNull: false});
        sinon.assert.notCalled(cardService.forEachAssociate);
      });

      it('should move previously selected card into new spot', function() {
        movementService.moveToAssociate.withArgs(nullCard).returns(moveFunc);
        actionService.freeCellCardAction(nullCard);
        sinon.assert.calledWith(cardService.forEachAssociate, m_card, moveFunc);
      });

      it('should only move previously selected card if it has no associates', function() {
        m_card.associate.returns({});
        actionService.freeCellCardAction(nullCard);
        sinon.assert.notCalled(cardService.forEachAssociate);
      });

      it('should clear selected', function() {
        actionService.freeCellCardAction(nullCard);
        sinon.assert.calledWith(cardService.clearSelected, m_card);
      });

      it('should not select unoccupied cell if there was no previously selected card', function() {
        cardService.selectedCard.returns(undefined);
        actionService.freeCellCardAction(nullCard);
        expect(nullCard.selected).to.be.undefined;
      });

    });

    describe('occupied cell', function() {
      it('should select card occupying cell', function() {
        actionService.freeCellCardAction(m_card);
        sinon.assert.calledWith(cardService.selectCard, m_card);
      });
    });

  });

});