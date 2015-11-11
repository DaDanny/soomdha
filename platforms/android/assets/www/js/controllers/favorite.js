/**
 * Created by Danny on 11/3/15.
 */
var app = angular.module('mealtrack.controllers.meals');
  app.controller('MealFavoriteCtrl', function($scope, $ionicLoading, MealService,AuthService){

    $scope.$on('$ionicView.enter', function(){
      var currentUser = AuthService.user;
      var favorites = currentUser.attributes.favorites;
      $scope.favorites = [];
      var Meal = MealService.self;
      if(favorites.length >0){
        $ionicLoading.show();
        Meal.loadFavorites(favorites)
          .then(function(response){
            $scope.favorites = response;
          })
          .catch(function(err){
            console.log('err: ', err);
          })
          .finally(function(){
            $ionicLoading.hide();
          })
      }
    });
  })
