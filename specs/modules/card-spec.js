describe("Card", function() {

  var underTest,
      spade_BLACK_CARD = "S";
      diamond_RED_CARD = "D";

  beforeEach(function() {
    underTest = new Card("3", spade_BLACK_CARD);
  });
  
  it("should have suit and val", function() {
    expect(underTest.suit).to.equal(spade_BLACK_CARD);
    expect(underTest.val).to.equal("3");
  });

  describe('association', function() {

    var legalAssociate = new Card("2", diamond_RED_CARD),
        wrongColorAssociate = new Card("2", spade_BLACK_CARD),
        sameValueAssociate = new Card("3", diamond_RED_CARD),
        higherValueAssociate = new Card("4", diamond_RED_CARD);

    it('should allow association with card one lower in val and of different color', function() {
      expect(underTest.associate(legalAssociate)).to.equal(true);
    });

    it('should not allow associate with a card of the same color', function() {
      expect(underTest.associate(wrongColorAssociate)).to.equal(false);
    });

    it('should not allow associate with a card of same value', function() {
      expect(underTest.associate(sameValueAssociate)).to.equal(false);
    });

    it('should not allow associate with a card of higher value', function() {
      expect(underTest.associate(higherValueAssociate)).to.equal(false);
    });

    it('should return a properly associated card', function() {
      underTest.associate(legalAssociate);
      expect(underTest.associate()).to.equal(legalAssociate);
    });

    it('should disassociate when passed undefined', function() {
      underTest.associate(legalAssociate);
      underTest.disassociate();
      expect(underTest.associate()).to.be.undefined;
    });

  });

  describe('face card association', function() {

    var legalAssociate = new Card("J", diamond_RED_CARD),
        illegalAssociate = new Card("K", diamond_RED_CARD);

    beforeEach(function() {
      underTest = new Card('Q', spade_BLACK_CARD);
    });

    it('should allow association with lower face card', function() {
      expect(underTest.associate(legalAssociate)).to.equal(true);
    });

    it('should not allow associate with higher face card', function() {
      expect(underTest.associate(illegalAssociate)).to.equal(false);
    });

  });


});