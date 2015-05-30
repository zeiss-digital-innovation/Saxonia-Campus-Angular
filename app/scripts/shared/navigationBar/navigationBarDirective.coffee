'use strict'

navigationBar = angular.module 'shared.navigationBar', []

navigationBar.directive 'navigationBar', ->
  directive =
    templateUrl: 'scripts/shared/navigationBar/navigationBarView.html'
    restrict: 'E'
    replace: true
    scope: true
  directive

