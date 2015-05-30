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

  $scope.userInSlot = (slotId) ->
    return $scope.currentUserSlots.hasOwnProperty slotId

  $scope.showDetails = (slot) ->
    slot.$get('self').then (singleSlot) ->
      modalInstance = $modal.open
        animation: true
        size: 'lg'
        templateUrl: '/scripts/components/details/detailsView.html'
        controller: 'DetailsController'
        resolve:
          slot: () ->
            singleSlot
          userInSlot: () ->
            $scope.userInSlot(singleSlot.id)


      modalInstance.result.then (result) ->
        init() if result

  init = () ->
    $scope.currentUser = {}
    $scope.currentUserSlots = {}
    $scope.slotsInRooms = {}
    $scope.rooms = {}
    $scope.slots = {}
    $scope.slotIndices = {0: 0}

    # load current user data
    $scope.apiRoot.then (apiRoot) ->
      apiRoot.$get('currentUser').then (currentUser) ->
        $scope.currentUser = currentUser
        currentUser.$get('slots').then (slots) ->
          if slots.constructor != Array
            $scope.currentUserSlots[slots.id] = slots
            return
          slots.forEach (slot) ->
            $scope.currentUserSlots[slot.id] = slot
            return
          return
        return
      return

    #load slots
    $scope.apiRoot.then (apiRoot) ->
      apiRoot.$get('slots').then (slots) ->
        slots.$get('slots').then (embeddedSlots) ->
          embeddedSlots.forEach (slot) ->
            $scope.slots[slot.id] = slot

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

  init()
]
