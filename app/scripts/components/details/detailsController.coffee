'use strict'

details = angular.module 'components.details', []

details.controller 'DetailsController', ['$scope', '$modalInstance', 'slot', 'userInSlot', ($scope, $modalInstance, slot, userInSlot) ->

  $scope.slot = slot
  $scope.userInSlot = userInSlot

  $scope.register = () ->
    slot.$put('register').then () ->
      $modalInstance.close true
      return
    return

  $scope.unregister = () ->
    slot.$del('unregister').then () ->
      $modalInstance.close true
      return
    return

  return
]
