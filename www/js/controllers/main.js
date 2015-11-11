var app = angular.module('mealtrack.controllers.meals')
app.controller('MainCtrl', function($scope){
  $scope.categories = [
    {
      title : 'Cars - سيارات',
      image : 'img/cars.jpg',
      category : 'Cars'
    },
    {
      title : 'Property - عقارات',
      image : "img/real.jpg",
      category : 'Property'
    },
    {
      title : 'Construction - مقاولا',
      image : 'img/cons.jpg',
      category : 'Construction'
    },
    {
      title : 'Finance - تمويل',
      image : 'img/money.jpg',
      category : 'Finance'
    },
    {
      title : 'Services - خدمات',
      image : 'img/serv.jpg',
      category : 'Services'
    },
    {
      title : 'Jobs - وظائف',
      image : 'img/jobs.jpg',
      category : 'Jobs'
    },
    {
      title : 'Men - الرجال',
      image : 'img/men.jpg',
      category : 'Men'
    },
    // TODO Change Label
    {
      title : 'Women - الرجال',
      image : 'img/women.jpg',
      category : 'Women'
    },
    {
      title : 'Kids - الاطفال',
      image : 'img/women.jpg',
      category : 'Kids'
    },
    {
      title : 'Food - المطبخ',
      image : 'img/food.jpg',
      category : 'Food'
    },
    {
      title : 'Birds - طيور',
      image : 'img/bird.jpg',
      category : 'Birds'
    },
    {
      title : 'Animals - حيوانات',
      image : 'img/animals.jpg',
      category : 'Animals'
    },
    {
      title : 'Furniture - اثاث',
      image : 'img/furn.jpg',
      category : 'Furniture'
    },
    {
      title : 'Numbers - ارقام',
      image : 'img/number.jpg',
      category : 'Numbers'
    },
    {
      title : 'Agriculture - زراعة',
      image : 'img/gard.jpg',
      category : 'Agriculture'
    },
    {
      title : 'Education - تعليم',
      image : 'img/edu.jpg',
      category : 'Education'
    },
    {
      title : 'Electronics - الكترونيات',
      image : 'img/elec.jpg',
      category : 'Electronics'
    },
    {
      title : 'Games - العاب',
      image : 'img/mob.jpg',
      category : 'Games'
    },
    {
      title : 'Camp - تخييم',
      image : 'img/takh.jpg',
      category : 'Camping'
    },
    // TODO CHange Label
    {
      title : 'Phones - تخييم',
      image : 'img/phone.jpeg',
      category : 'Phones'
    }
  ]

})
