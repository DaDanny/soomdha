/**
 * Created by Danny on 10/26/15.
 */
var app = angular.module('mealtrack.controllers.meals');

app.controller('MealListCtrl', function ($scope, $ionicLoading, MealService, category, AuthService) {

  $scope.meals = [];
  var currentUser, Meal;

  if(!category){
    $scope.category = 'Please select a category!'
  } else{
    $scope.category = category;
  }

  $scope.$on('$ionicView.enter', function(){
    $scope.meals = [];
    $ionicLoading.show();
    currentUser = AuthService.user;
    $scope.userId = currentUser.id;
    Meal = MealService.self;
    Meal.load(category, true)
      .then(function (results) {
        $scope.meals = results;
        $scope.hasMore = Meal.hasMore;
      })
      .finally(function(){
        $ionicLoading.hide();
      })
  });


  $scope.refreshItems = function () {
    Meal.refresh(category)
      .then(function (results) {
        $scope.meals = results;
        $scope.hasMore = Meal.hasMore;

        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.nextPage = function () {
    console.log('scroll');
    Meal.next(category)
      .then(function (results) {
        console.log('results: ', results);
        $scope.meals.push.apply($scope.meals, results);
        $scope.hasMore = Meal.hasMore;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  };

});
