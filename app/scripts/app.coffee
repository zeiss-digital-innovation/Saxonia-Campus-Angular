'use strict'

###*
 # @ngdoc overview
 # @name campusApp
 # @description
 # # campusApp
 #
 # Main module of the application.
###
app = angular.module 'app', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ui.router',
  'ui.bootstrap',
  'angular-hal',
  'shared.navigationBar',
  'shared.login.controller',
  'components.home',
  'components.details'
]

app.factory 'AuthInterceptor', ['$rootScope', '$q', '$window', ($rootScope, $q, $window) ->
  request: (config) ->
    if $window.sessionStorage.token
      config.headers.authorization = 'Basic ' + $window.sessionStorage.token
    config

  responseError: (response) ->
    if response.status is 401
      $rootScope.$broadcast 'unauthenticated'
    response or $q.when(response)
]

app.config ['$stateProvider', '$urlRouterProvider', '$httpProvider', ($stateProvider, $urlRouterProvider, $httpProvider) ->
  $stateProvider.state 'home',
    url: '/home'
    templateUrl: '/scripts/components/home/homeView.html'

  $httpProvider.defaults.withCredentials = true

  $httpProvider.defaults.headers.get = {} if !$httpProvider.defaults.headers.get
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
  
  $httpProvider.interceptors.push 'AuthInterceptor'

  return
]

app.run ['$rootScope', 'halClient', ($rootScope, halClient) ->
  configureApi = () ->
    $rootScope.apiRoot = halClient.$get('http://localhost:8080/rest');
    return

  $rootScope.$on 'authenticated', configureApi
  configureApi()
  return
]

app.controller 'AppController', ['$rootScope', '$state', '$modal', '$window', ($rootScope, $state, $modal, $window) ->
  login = () ->
    $window.sessionStorage.token = undefined

    $modal.open
      animation: true
      templateUrl: '/scripts/shared/login/loginView.html'
      controller: 'LoginController'
      backdrop: 'static'

  $rootScope.$on 'unauthenticated', login
  return
]
