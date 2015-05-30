'use strict'

###*
 # @ngdoc function
 # @name saxoniaCampusAngularApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the saxoniaCampusAngularApp
###
home = angular.module 'components.home', []

home.controller 'HomeController', ['$scope', '$modal', ($scope, $modal) ->

  $scope.slotsInRooms = {}
  $scope.rooms = {}
  $scope.slotIndices = {0: 0}

  $scope.apiRoot.then (apiRoot) ->
    apiRoot.$get('slots').then (slots) ->
      slots.$get('slots').then (embeddedSlots) ->
        embeddedSlots.forEach (slot) ->
          slot.$get('room').then (room) ->
            $scope.slotsInRooms[room.id] = [] if !$scope.slotsInRooms.hasOwnProperty room.id
            $scope.slotsInRooms[room.id].push slot
            length = $scope.slotsInRooms[room.id].length
            $scope.slotIndices[length] = length if !$scope.slotIndices.hasOwnProperty length
            $scope.slotsInRooms[room.id].sort (a, b) ->
              return a.starttime.localeCompare b.starttime

            $scope.rooms[room.id] = room if !$scope.rooms.hasOwnProperty room.id
          return
        return
      return
    return

  $scope.showDetails = (slot) ->
    slot.$get('self').then (singleSlot) ->
      $modal.open
        animation: true
        size: 'lg'
        templateUrl: '/scripts/components/details/detailsView.html'
        controller: 'DetailsController'
        resolve:
          slot: () ->
            singleSlot
]
