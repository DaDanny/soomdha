var app = angular.module('mealtrack.controllers.authentication', []);

/*********************************************************************
 * LoginCtrl
 *********************************************************************/
app.controller('LoginCtrl', function ($scope, $state, AuthService, $ionicLoading, $ionicPopup) {

	$scope.formData = {
		"email": "",
		"password": ""
	};

	$scope.login = function (form) {
    $ionicLoading.show();

    if (form.$valid){
		AuthService.login($scope.formData.email, $scope.formData.password)
      .then(function() {
          $state.go("tab.main")
      })
      .finally(function(){
        $ionicLoading.hide();
      })
		}

	};

});

/*********************************************************************
 * SignupCtrl
 *********************************************************************/
app.controller('SignupCtrl', function ($scope, $state, AuthService) {

	$scope.formData = {
		"name": "",
		"email": "",
		"password": ""
	};

	$scope.signup = function (form) {
		if (form.$valid) {
		AuthService.signup($scope.formData.email,
						   $scope.formData.name,
						   $scope.formData.password)
			.then(function() {
        $state.go("tab.meals")
		  })
		}
	};

});
