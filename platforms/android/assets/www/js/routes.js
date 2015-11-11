/**
 * Created by Danny on 10/26/15.
 */
angular.module('mealtrack')
  .config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: "/login",
      cache: false,
      controller: 'LoginCtrl',
      templateUrl: "templates/login.html"
    })
    .state('signup', {
      url: "/signup",
      cache: false,
      controller: 'SignupCtrl',
      templateUrl: "templates/signup.html"
    })
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tab.meals', {
      url: '/meals/:category',
      views: {
        'tab-meals': {
          templateUrl: 'templates/tabs/tab-meals.html',
          controller: 'MealListCtrl',
          resolve:{
            'category': function($stateParams){
              if($stateParams.category){
                return $stateParams.category;

              }else{
                return undefined;
              }
            }
          }
        }
      }
    })
    .state('tab.meals-details', {
      url: '/meal/:mealId',
      views : {
        'tab-meals': {
          templateUrl: 'templates/tabs/tab-meal-detail.html',
          controller: 'MealDetailCtrl'
        }
      }
    })


    .state('tab.main', {
      url: '/main',
      views: {
        'tab-main': {
          controller : 'MainCtrl',
          templateUrl: 'templates/tabs/tab-main.html'
        }
      }
    })


    .state('tab.track', {
      url: '/track',
      views: {
        'tab-track': {
          templateUrl: 'templates/tabs/tab-track.html',
          controller: 'MealCreateCtrl'
        }
      }
    })

    .state('tab.myfav', {
      url: '/myfav',
      views: {
        'tab-myfav': {
          templateUrl: 'templates/tabs/tab-myfav.html',
          controller : 'MealFavoriteCtrl'
        }
      }
    })
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tabs/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
