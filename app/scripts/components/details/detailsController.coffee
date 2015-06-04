'use strict'

details = angular.module 'components.details', []

details.controller 'DetailsController', ['$scope', '$modalInstance', 'slot', 'room', 'userInSlot', ($scope, $modalInstance, slot, room, userInSlot) ->

  $scope.slot = slot
  $scope.room = room
  $scope.userInSlot = userInSlot

  $scope.removeAlert = () ->
    delete $scope.alert

  $scope.register = () -> # regular
    slot.$put('register').then () ->
      $modalInstance.close true
      return
    , () -> # error
      $scope.alert = "Der Slot wurde nicht gebucht, da er sich mit einem anderen gebuchten Slot überschneidet."
      return
    return

  $scope.unregister = () ->
    slot.$del('unregister').then () ->
      $modalInstance.close true
      return
    return

  return
]
