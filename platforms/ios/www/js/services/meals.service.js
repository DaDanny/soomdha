var app = angular.module('mealtrack.services.meals', []);

app.service("MealService", function ($q, AuthService, $ionicPopup) {
	var self = {
		'page': 0,
		'page_size': 30,
		'isLoading': false,
		'isSaving': false,
		'hasMore': true,
		'results': [],
		'refresh': function (category) {
			self.page = 0;
			self.isLoading = false;
			self.isSaving = false;
			self.hasMore = true;
			self.results = [];
			return self.load(category);
		},
		'next': function (category) {
			self.page += 1;
			return self.load(category);
		},
		'load': function (category, init) {
      if(init){
        self.page = 0;
        self.isLoading = false;
        self.isSaving = false;
        self.hasMore = true;
        self.results = [];
      }
			self.isLoading = true;
			var d = $q.defer();

			// Initialise Query
			var Meal = Parse.Object.extend("Meal");
			var mealQuery = new Parse.Query(Meal);
			mealQuery.descending('created');
      mealQuery.equalTo("category", category);
			//mealQuery.equalTo("owner", AuthService.user);


			// Paginate
			mealQuery.skip(self.page * self.page_size);
			mealQuery.limit(self.page_size);
      self.results = [];
			// Perform the query
			mealQuery.find({
				success: function (results) {
					angular.forEach(results, function (item) {
						var meal = new Meal(item);
            meal.objectId = item.id;
						self.results.push(meal)
					});
					console.debug(self.results);

					if (results.length == 0) {
						self.hasMore = false;
					}

					// Finished
					d.resolve(self.results);
				}
			});

			return d.promise;
		},
		'track': function (data) {
			self.isSaving = true;
			var d = $q.defer();

			var Meal = Parse.Object.extend("Meal");
			var user = AuthService.user;
			//var file = data.picture ? new Parse.File("photo.jpg", {base64: data.picture}) : null;


			var meal = new Meal();
			meal.set("owner", user);
			meal.set("mainPicture", data.picture);
			meal.set("title", data.title);
			meal.set("category", data.category);
			meal.set("created", new Date());
      meal.set("price", data.price);
      meal.set("description", data.desc);
      meal.set("phone", data.phone);
      meal.set("comments", []);
      meal.set("likes", []);
      meal.set("photos", []);

			meal.save(null, {
				success: function (meal) {
					self.results.unshift(meal);
					d.resolve(meal);
				},
				error: function (item, error) {
					d.reject(error);
				}
			});

			return d.promise;
		},
    loadFavorites : function(favorites){
      var d = $q.defer();
      var Meal = Parse.Object.extend("Meal");
      var mealQuery = new Parse.Query(Meal);
      mealQuery.containedIn("objectId", favorites);
      var favorites = [];
      mealQuery.find({
        success: function(results){
          angular.forEach(results, function (item) {
            var meal = new Meal(item);
            meal.objectId = item.id;
            favorites.push(meal)
          });
          d.resolve(favorites);
        }
      })

      return d.promise;
    },
    removeItem : function(mealId){
      var Meal = Parse.Object.extend("Meal");
      var query = new Parse.Query(Meal);
      var d = $q.defer();
      query.get(mealId, {
        success: function(mealItem) {
          mealItem.destroy({
            success: function(results){
              d.resolve(results);
            },
            error: function(err){
              d.reject(err);
            }
          })
        },
        error: function(error) {
          alert("Error: " + error.code + " " + error.message);
          d.reject(error);
        }
      });
      return d.promise;
    }

	};

  var getMeal = function(mealId){
    var Meal = Parse.Object.extend("Meal");
    var query = new Parse.Query(Meal);
    query.equalTo("objectId", mealId);
    var d = $q.defer();
    query.find({
      success: function(results) {
        d.resolve(results[0])
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
        d.reject(error);
      }
    });
    return d.promise;
  }

  var addComment = function(mealId, newComment){
    var d = $q.defer();
    // Initalize our query
    var Meal = Parse.Object.extend("Meal");
    var query = new Parse.Query(Meal);
    // Get our object
    query.get(mealId, {
      success: function(mealItem) {
        mealItem.add("comments", newComment);
        mealItem.save()
          .then(function(response){
            d.resolve(response);
          }, function(err){
            d.reject(err);
          })
      },
      error: function(object, error) {
        d.reject();
      }
    });

    return d.promise;
  }

  var removeComment = function(mealId, comment){
    var d = $q.defer();
    // Initalize our query
    var Meal = Parse.Object.extend("Meal");
    var query = new Parse.Query(Meal);
    // Get our object
    query.get(mealId, {
      success: function(mealItem) {
        mealItem.remove("comments", comment);
        mealItem.save()
          .then(function(response){
            d.resolve(response);
          }, function(err){
            d.reject(err);
          })
      },
      error: function(object, error) {
        d.reject();
      }
    });

    return d.promise;
  }

  var likeMeal = function(mealId, userId){
    var d = $q.defer();
    // Initalize our query
    var Meal = Parse.Object.extend("Meal");
    var query = new Parse.Query(Meal);
    // Get our object
    query.get(mealId, {
      success: function(mealItem) {
        mealItem.addUnique("likes", userId);
        mealItem.save()
          .then(function(response){
            d.resolve(response);
          }, function(err){
            d.reject(err);
          })
      },
      error: function(object, error) {
        d.reject();
      }
    });

    return d.promise;
  }

  var unlikeMeal = function(mealId, userId){
    var d = $q.defer();
    // Initalize our query
    var Meal = Parse.Object.extend("Meal");
    var query = new Parse.Query(Meal);
    // Get our object
    query.get(mealId, {
      success: function(mealItem) {
        mealItem.remove("likes", userId);
        mealItem.save()
          .then(function(response){
            d.resolve(response);
          }, function(err){
            d.reject(err);
          })
      },
      error: function(object, error) {
        d.reject();
      }
    });

    return d.promise;
  }

  var addPhoto = function(mealId, photoUrl) {
    var d = $q.defer();
    // Initalize our query
    var Meal = Parse.Object.extend("Meal");
    var query = new Parse.Query(Meal);
    // Get our object
    query.get(mealId, {
      success: function(mealItem) {
        mealItem.addUnique("photos", photoUrl);
        mealItem.save()
          .then(function(response){
            d.resolve(response);
          }, function(err){
            d.reject(err);
          })
      },
      error: function(object, error) {
        d.reject();
      }
    });

    return d.promise;
  }

  var removePhoto = function(mealId, photoUrl){
    var d = $q.defer();
    // Initalize our query
    var Meal = Parse.Object.extend("Meal");
    var query = new Parse.Query(Meal);
    // Get our object
    query.get(mealId, {
      success: function(mealItem) {
        mealItem.remove("photos", photoUrl);
        mealItem.save()
          .then(function(response){
            d.resolve(response);
          }, function(err){
            d.reject(err);
          })
      },
      error: function(object, error) {
        d.reject();
      }
    });

    return d.promise;
  }


	return {
    self : self,
    getMeal : getMeal,
    addComment : addComment,
    removeComment : removeComment,
    likeMeal : likeMeal,
    unlikeMeal : unlikeMeal,
    addPhoto : addPhoto,
    removePhoto : removePhoto
  };
});
