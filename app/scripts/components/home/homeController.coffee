'use strict'

###*
 # @ngdoc function
 # @name saxoniaCampusAngularApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the saxoniaCampusAngularApp
###
home = angular.module 'components.home', []

home.controller 'HomeController', ['$rootScope', '$scope', '$modal', 'usSpinnerService', ($rootScope, $scope, $modal, usSpinnerService) ->

  $scope.userInSlot = (slotId) ->
    return $scope.currentUserSlots.hasOwnProperty slotId

  $scope.showDetails = (slot) ->
    usSpinnerService.spin 'spinner'

    slot.$get('self').then (singleSlot) ->
      singleSlot.$get('room').then (room) ->
        usSpinnerService.stop 'spinner'

        modalInstance = $modal.open
          animation: true
          size: 'lg'
          templateUrl: 'scripts/components/details/detailsView.html'
          controller: 'DetailsController'
          resolve:
            slot: () ->
              singleSlot
            room: () ->
              room
            userInSlot: () ->
              $scope.userInSlot(singleSlot.id)

        modalInstance.result.then (result) ->
          init() if result

  $scope.isContinuation = (timeIndex, roomId) ->
    index = $scope.timeIndices.indexOf(timeIndex)
    if index == 0
      return false

    for i in [index-1...-1] by -1
      slot = $scope.slotMatrix[$scope.timeIndices[i]][roomId]
      if slot?
        if getTimeDiff(slot.endtime, timeIndex) > 0
          return true
        break

    return false

  clearAll = () ->
    $scope.currentUser = {}
    $scope.currentUserSlots = {}
    $scope.slotMatrix = {}
    $scope.rooms = {}
    $scope.timeIndices = []
    return

  init = () ->
    clearAll()

    usSpinnerService.spin 'spinner'

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

      usSpinnerService.stop 'spinner'
      return

  processSlot = (slot) ->
    slot.$get('room').then (room) ->
      $scope.rooms[room.id] = room if !$scope.rooms.hasOwnProperty room.id

      found = false
      Object.getOwnPropertyNames($scope.slotMatrix).forEach (timeIndex) ->
        if Math.abs(getTimeDiff(slot.starttime, timeIndex)) < 20 * 60 * 1000
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

    return aDate - bDate

  init() if $scope.isLoggedIn()
  $rootScope.$on 'clearAll', clearAll
  $rootScope.$on 'reload', init
]
