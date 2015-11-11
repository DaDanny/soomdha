/**
 * Created by Danny on 11/4/15.
 */
var app = angular.module('mealtrack.services.meals');

app.service('UploadService', function($http){

  var uploadPhoto = function(imageData){
    var image64 = imageData.replace(/^data:image\/(png|jpeg);base64,/, "");
    var file = new Parse.File("userImage.jpeg", { base64: image64 });
    return file.save()
  };

  return{
    uploadPhoto : uploadPhoto
  }
});
