/**
 * Created by Danny on 10/26/15.
 */
var app = angular.module('mealtrack.controllers.meals');

app.controller('MealDetailCtrl', function($scope, $stateParams, $ionicLoading,
                                          MealService, AuthService, $ionicPopup, $state){
  var mealId = $stateParams.mealId;



  $scope.newComment = '';
  var currentUser;

  $scope.focusComment = false;

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
        console.log('mealAttr: ', $scope.mealAttr);
        checkLikes();
        checkFavorites()
      })
      .catch(function(err){
        $ionicPopup.alert({
          title: "Sorry, we couldn't retrieve this meal",
          subTitle: "We were unable to retrieve this meal at this time. Please try again later"
        });
        $state.go('tab.main');
        console.log('error: ', err);
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

  // Check if the user liked this meal already
  function checkLikes(){
    if($scope.likes.indexOf($scope.userId) != -1){
      $scope.liked = true;
    } else {
      $scope.liked = false;
    }
  }

  function checkFavorites(){
    console.log('user: ', currentUser);
    console.log('mealId:', mealId);
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
