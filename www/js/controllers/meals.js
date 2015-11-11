var app = angular.module('mealtrack.controllers.meals', []);


/*********************************************************************
 * MealCreateCtrl
 *********************************************************************/
app.controller('MealCreateCtrl', function ($scope,
                                           $state,
                                           $ionicPopup,
                                           $ionicLoading,
                                           $cordovaCamera,
                                           MealService,
                                           AuthService,
                                           UploadService) {

  var Meal = MealService.self;
  var currentUser = AuthService.user;
  $scope.phone = currentUser.attributes.phone;
	$scope.resetFormData = function () {
		$scope.formData = {
			'title': '',
			'category': '',
			'price': '',
			'picture': null,
      'desc' : '',
      'phone' : $scope.phone
		};
	};
	$scope.resetFormData();

  $scope.showPicture = false;


	$scope.trackMeal = function (form) {
		if (form.$valid) {
			console.log("MealCreateCtrl::trackMeal");
			$ionicLoading.show();
			Meal.track($scope.formData)
        .then(function () {
          $scope.resetFormData();
          $scope.pictureUrl = '';
          $ionicLoading.hide();
          form.$setPristine(true);
          $state.go("tab.main");
			})
        .catch(function(err){
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: "Error saving meal",
            subTitle: err.message
          });
        })
		} else{
      $scope.showErrors = true;
    }
	};

	$scope.addPicture = function () {
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // CAMERA
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 480,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false
		};

		$cordovaCamera.getPicture(options).then(function (imageData) {
      UploadService.uploadPhoto(imageData)
        .then(function(response){
          $scope.formData.picture = response._url;
          $scope.pictureUrl = response._url;
          $scope.showPicture = true;
        }, function(err){
          console.log('err upload: ', err);
        })

		}, function (err) {
			$ionicPopup.alert({
				title: 'Error getting picture',
				subTitle: 'We had a problem trying to get that picture, please try again'
			});
		});
	};

});

