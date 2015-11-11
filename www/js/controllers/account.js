var app = angular.module('mealtrack.controllers.account', []);

/*********************************************************************
 * AccountCtrl
 *********************************************************************/
app.controller('AccountCtrl', function ($scope, $state, AuthService, $ionicPopup) {

  var user = AuthService.user.attributes;

	$scope.formData = {
		name: user.name,
		email: user.email,
    city : user.city,
    phone : user.phone,
    sex : user.sex
	};

	$scope.submit = function (form) {
		if(form.$valid) {
			AuthService.update($scope.formData)
        .then(function () {
          $ionicPopup.alert({
            title: "Account Saved!",
            subTitle: 'We have updated your account.'
          });
          $state.go('tab.main')
			  })
        .catch(function(error){
          $ionicPopup.alert({
            title: "Save Error",
            subTitle: error.message
          });
        })
		}
	};


	$scope.logout = function () {
		AuthService.logOut();
		$state.go("login");
	};
});
