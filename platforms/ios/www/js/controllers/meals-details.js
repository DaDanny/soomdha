/**
 * Created by Danny on 10/26/15.
 */
var app = angular.module('mealtrack.controllers.meals');

app.controller('MealDetailCtrl', function($scope, $stateParams, $ionicLoading,
                                          MealService, AuthService,
                                          $ionicPopup, $state, $ionicScrollDelegate,
                                          $cordovaCamera,UploadService, $ionicModal,$ionicSlideBoxDelegate){
  var mealId = $stateParams.mealId;



  $scope.newComment = '';
  var currentUser;

  $scope.focusComment = false;
  $scope.showPhotos = true;

  $ionicLoading.show();
  $scope.showDetails = false;

  // Fetch the latest data on meal every time we enter view
  $scope.$on('$ionicView.enter', function(){
    currentUser = AuthService.user;
    if(!currentUser){
      AuthService.logOut();
      $state.go('login');
      $ionicLoading.hide();
    }
    $scope.phone = currentUser.attributes.phone;
    $scope.userId = currentUser.id;
    $scope.userName = currentUser.attributes.name;
    loadMeal()
  });

  function loadMeal(){
    MealService.getMeal(mealId)
      .then(function(meal){
        $scope.meal = meal;
        $scope.mealAttr = meal.attributes;
        $scope.showDetails = true;
        $scope.owner = $scope.mealAttr.owner.id;
        $scope.comments = $scope.mealAttr.comments;
        $scope.likes = $scope.mealAttr.likes;
        checkLikes();
        checkFavorites()
      })
      .catch(function(err){
        $ionicPopup.alert({
          title: "Sorry, we couldn't retrieve this meal",
          subTitle: "We were unable to retrieve this meal at this time. Please try again later"
        });
        $state.go('tab.main');
      })
      .finally(function(){ // Finally is called whether then or catch fires
        $ionicLoading.hide();
      })
  }

  $scope.likeMeal = function(){
    if($scope.liked){
      MealService.unlikeMeal(mealId, $scope.userId)
        .then(function(response){
          $scope.liked = false;
          $scope.likes.length--;
        })
        .catch(function(err){
          console.log('like err: ', err);
        })
    } else{
      MealService.likeMeal(mealId, $scope.userId)
        .then(function(response){
          $scope.liked = true;
          $scope.likes.length++;
        })
        .catch(function(err){
          console.log('unlike err: ', err);
        })
    }
  };

  $scope.favoriteMeal = function(){
    if($scope.favorite){
      AuthService.unFavoriteMeal(mealId)
        .then(function(response){
          $scope.favorite = false;
        })
    } else{
      AuthService.favoriteMeal(mealId)
        .then(function(response){
          $scope.favorite = true;
        })
    }
  }

  $scope.goToComments = function(){
    $scope.focusComment = true;
  }

  $scope.submitComment = function(){
    if($scope.newComment.length > 0){
      var phone = $scope.phone;
      var commentId = makeId();
      var now = new Date();
      var newComment = {
        comment : $scope.newComment,
        sender : $scope.userName,
        sent : now,
        ownerId : $scope.userId,
        commentId : commentId,
        phone : phone
      }
      $scope.comments.push(newComment);
      $ionicScrollDelegate.$getByHandle('detailScroller').resize();
      MealService.addComment(mealId, newComment)
        .then(function(response){
          $scope.newComment = '';
        })
        .catch(function(err){
          console.log('err: ', err);
        })
    } else{
      $ionicPopup.alert({
        title: "You must enter a comment first!",
        subTitle: "Please fill out the comment box with your comment. "
      });
    }
  }

  $scope.deleteComment = function(comment){

    // Confirm delete comment
    var commentText = comment.comment;
    var commentSender = comment.sender;
    $ionicPopup.confirm({
      title: "Delete Comment?",
      subTitle: "Are you sure you wish to delete this comment: <br>" + '"' + commentText +'"'+ '<br>Sent by: ' + commentSender
    })
      .then(function(res){
        if(res){
          /*
           Its good to set the array length to a variable
           before a for loop so we don't have to check the
           length on every iteration
           */
          var commentId = comment.commentId,
            allComments = $scope.comments,
            commentsLength = allComments.length,
            index;

          for(index=0;index<commentsLength;index++){
            if(allComments[index].commentId == commentId){
              break;
            }
          }

          // Check if we found the comment we want to delete
          if(index < commentsLength){

            MealService.removeComment(mealId,comment)
              .then(function(response){
                $scope.comments.splice(index, 1);
              })
              .catch(function(err){
                $ionicPopup.alert({
                  title: "Unable to delete!",
                  subTitle: "Sorry we couldn't delete the comment at this time. Please try again later."
                });
              })
          }
        }
      })
  }

  $scope.deleteItem = function(){
    $ionicPopup.confirm({
      title: "Delete Item?",
      subTitle: "Are you sure you wish to remove this item?"
    })
      .then(function(res){
        if(res){
          MealService.self.removeItem(mealId)
            .then(function(){
              $state.go('tab.main');
            })
        }
      })


  }

  $scope.addPhoto = function(){
    if($scope.mealAttr.photos.length < 10){
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
            var pictureUrl = response._url;
            MealService.addPhoto(mealId, pictureUrl)
              .then(function(response){
                $scope.mealAttr.photos.push(pictureUrl);
                $ionicSlideBoxDelegate.update();
              })
              .catch(function(err){
                $ionicPopup.alert({
                  title: 'Error saving picture',
                  subTitle: 'We had a problem saving your picture, please try again'
                });
              })


          }, function(err){
            console.log('err upload: ', err);
          })

      }, function (err) {
        console.error(err);
        $ionicPopup.alert({
          title: 'Error getting picture',
          subTitle: 'We had a problem trying to get that picture, please try again'
        });
      });
    } else{
      $ionicPopup.alert({
        title: 'Max Photo Limit',
        subTitle: 'Sorry you can only have 10 photos.'
      });
    }


  }

  $scope.deletePhoto = function(photoUrl){
    console.log('photoUrl: ', photoUrl);
    $ionicPopup.confirm({
      title: "Delete Photo?",
      subTitle: "Are you sure you want to delete this photo?"
    })
      .then(function(res){
        if(res){
          $scope.modal.hide();

          MealService.removePhoto(mealId, photoUrl)
            .then(function(){
              console.log('actually remove it now');
              for(var i=0;i<$scope.mealAttr.photos.length;i++){
                if($scope.mealAttr.photos[i] == photoUrl){
                  $ionicSlideBoxDelegate.previous();
                  $scope.mealAttr.photos.splice(i, 1);

                  $ionicSlideBoxDelegate.update();
                  break;
                }
              }
            })
        }
      })
  }

  $scope.showPhoto = function(photo){
    console.log('photo: ', photo);
    if(photo){
      $scope.image = photo;
      if($scope.owner == $scope.userId){
        $scope.showDelete = true;

      }
    } else{
      $scope.image = $scope.mealAttr.mainPicture;
      $scope.showDelete = false;
    }
    $ionicModal.fromTemplateUrl('templates/photoModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove()
  };

  // Check if the user liked this meal already
  function checkLikes(){
    if($scope.likes.indexOf($scope.userId) != -1){
      $scope.liked = true;
    } else {
      $scope.liked = false;
    }
  }

  function checkFavorites(){
    if(currentUser.attributes.favorites.indexOf(mealId) != -1){
      $scope.favorite = true;
    } else{
      $scope.favorite = false;
    }
  }

  // function to make id for comments
  var makeId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

})
