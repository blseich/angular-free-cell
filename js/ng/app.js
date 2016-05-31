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

    }]);
