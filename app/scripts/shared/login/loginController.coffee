'use strict'

login = angular.module 'shared.login.controller', [
  'ab-base64'
]

login.controller 'LoginController', ['$rootScope', '$scope', '$state', '$window', '$modalInstance', 'base64', ($rootScope, $scope, $state, $window, $modalInstance, base64) ->
  $scope.login = () ->
    if $scope.username? and $scope.password?
      $window.sessionStorage.token = base64.encode $scope.username + ':' + $scope.password
      $rootScope.$broadcast 'authenticated'
      $modalInstance.close true
      $state.go 'home'
      return
  $scope.clearForm = () ->
    $scope.username = undefined
    $scope.password = undefined
]
