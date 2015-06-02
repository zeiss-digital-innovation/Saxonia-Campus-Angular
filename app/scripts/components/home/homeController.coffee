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
    $scope.slotMatrix = {}
    $scope.rooms = {}
    $scope.timeIndices = []

    # load current user data
    $scope.apiRoot.then (apiRoot) ->
      apiRoot.$get('currentUser')
    .then (currentUser) ->
      $scope.currentUser = currentUser
      currentUser.$get('slots')
    .then (slots) ->
      if slots.constructor != Array
        $scope.currentUserSlots[slots.id] = slots
        return
      slots.forEach (slot) ->
        $scope.currentUserSlots[slot.id] = slot
        return

    # load slots
    $scope.apiRoot.then (apiRoot) ->
      apiRoot.$get('slots')
    .then (slots) ->
      slots.$get('slots')
    .then (embeddedSlots) ->
      embeddedSlots.forEach (slot) -> processSlot(slot)
    .then () ->
      $scope.timeIndices = Object.getOwnPropertyNames($scope.slotMatrix)
      $scope.timeIndices.sort (a, b) ->
        a.localeCompare b
      return

  processSlot = (slot) ->
    slot.$get('room').then (room) ->
      $scope.rooms[room.id] = room if !$scope.rooms.hasOwnProperty room.id

      found = false
      Object.getOwnPropertyNames($scope.slotMatrix).forEach (timeIndex) ->
        if getTimeDiff(slot.starttime, timeIndex) < 20 * 60 * 1000
          $scope.slotMatrix[timeIndex][room.id] = slot
          found = true
          return

      if !found
        $scope.slotMatrix[slot.starttime] = {}
        $scope.slotMatrix[slot.starttime][room.id] = slot

      return
    return

  getTimeDiff = (a, b) ->
    aSplit = a.split ':'
    bSplit = b.split ':'

    aDate = new Date(2015, 0, 1, aSplit[0], aSplit[1], aSplit[2], 0).getTime()
    bDate = new Date(2015, 0, 1, bSplit[0], bSplit[1], bSplit[2], 0).getTime()

    return Math.abs(aDate - bDate)

  init()
]
