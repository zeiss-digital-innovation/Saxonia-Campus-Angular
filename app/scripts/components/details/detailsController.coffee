'use strict'

details = angular.module 'components.details', []

details.controller 'DetailsController', ['$scope', '$modalInstance', 'slot', ($scope, $modalInstance, slot) ->

  $scope.slot = slot

  $scope.register = () ->
    slot.$put('register').then () ->
      $modalInstance.close true
      return
    return

  return
]
