angular.module('FreeCell')
.controller('FreeCellController', ['$scope',
    'playArea',
    'actionService',
    'upkeepService',
    function($scope, playArea, actionService, upkeepService) {

      $scope.$watch('lanes', function(newValue, oldValue) {
        upkeepService.moveToFinished(newValue);
        upkeepService.autoAssociate(newValue);
        upkeepService.emptyLaneCleanup(newValue);
      }, true);

      $scope.$watch('freeCells', function(newValue, oldValue) {
        upkeepService.moveToFinished(newValue);
        upkeepService.emptyLaneCleanup(newValue);
      }, true);

      $scope.lanes = playArea.lanes;
      $scope.freeCells = playArea.freeCells;
      $scope.homeCells = playArea.homeCells;

      $scope.takeAction = actionService.playAreaCardAction;
      $scope.freeCellAction = actionService.freeCellCardAction;

    }])
  .animation('.card-container', function() {
    var cardToAnimate,
        destinationCard,
        cardHasLeft,
        cardHasEntered, 
        enterX, 
        enterY,
        leaveX,
        leaveY;

    function enterFunction(element) {
      cardHasEntered = true;
      // console.log("eneter called");
      if (!!element) {
        destinationCard = element;
        enterX = element.prop('offsetLeft');
        enterY = element.prop('offsetTop');
        destinationCard.css('display', 'none');
      }
      
      if(cardHasLeft) {
        leaveFunction();
        // element.prop('offsetTop', enterX + 'px');
        // element.prop('offsetLeft', enter Y + 'px');
        cardHasLeft = false;
        cardHasEntered = false;
      }
    };

    function leaveFunction(element) {
      cardHasLeft = true;
      // console.log("leave called");
      if (!!element) {
        cardToAnimate = element;
        leaveX = element.prop('offsetLeft');
        leaveY = element.prop('offsetTop');
      }

      if (cardHasEntered) {
        console.log("\nenterX:" + enterX + "\nenterY:" + enterY + "\nleaveX:" + leaveX + "\nleaveY:" + leaveY + "\n");
        var target = cardToAnimate.children()[0];
        var player = target.animate([
          {transform: 'translate(0)'},
          {transform: 'translate(' + (enterX - leaveX) + 'px, ' + (enterY - leaveY) + 'px)'}
        ], 500);
        player.addEventListener('finish', function() {
          // target.style.transform = 'translate(' + (enterX - leaveX) + 'px, ' + (enterY - leaveY) + 'px)';
          cardToAnimate.remove();
          destinationCard.removeAttr('style');
        });

        cardHasLeft = false;
        cardHasEntered = false;
      }
    };




    return {
      enter: enterFunction,
      leave: leaveFunction,
      move: function() {
        console.log('MOVE CALLED');
      }
    }
  });
