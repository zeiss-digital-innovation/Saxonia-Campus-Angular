'use strict'

login = angular.module 'shared.login.controller', [
  'ab-base64'
]

login.controller 'LoginController', ['$rootScope', '$scope', '$state', '$window', '$modalInstance', 'base64', 'errorCount', ($rootScope, $scope, $state, $window, $modalInstance, base64, errorCount) ->
  $scope.alert = "Ungültiger Benutzername oder Passwort." if errorCount > 0

  $scope.removeAlert = () ->
    $scope.alert = null
    return

  $scope.login = () ->
    if $scope.username? and $scope.password?
      $window.sessionStorage.token = base64.encode $scope.username + ':' + $scope.password
      $rootScope.$broadcast 'authenticated'
      $modalInstance.close true
      return
    return

  $scope.clearForm = () ->
    $scope.username = undefined
    $scope.password = undefined
    return
]
