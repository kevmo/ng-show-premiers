app.controller("mainController", function($scope, $http){

    $scope.apiKey = "0209463d7666519dfb77918dca6b0331";
    $scope.results = [];
    $scope.filterText = null;
    $scope.availableGenres = [];
    $scope.genreFilter = null;

    $scope.init = function() {

      //API requires a start date
      var today = new Date();

      //create date string and ensure leading zeroes if reqd
      var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);

      // API call
      $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK')
      // success promise
      .success(function(data){
        //format the data: for each day, get all the data
        angular.forEach(data, function(val, index){
          //API stores full date from each episode
          var date = val.date;
          // for each episode, add it to the results array
          angular.forEach(val.episodes, function(tvshow, index){
            //date string for filtering use input
            tvshow.date = date; //attaching full date to each episode
            $scope.results.push(tvshow);
            //loop through genres for this episode
            angular.forEach(tvshow.show.genres, function(genre, index){
              //only add to available generes array if it doesnt already exist
              var exists = false;
              angular.forEach($scope.availableGenres, function(avGenre, index){
                            if (avGenre == genre) {
                                exists = true;
                            }
                        });
                        if (exists === false) {
                            $scope.availableGenres.push(genre);
                        }
            });
          });
        });
        console.log($scope.results);
      })
      // error promise
      .error(function(err){
        console.log(err);
      });

    };

    $scope.setGenreFilter = function(genre){
      $scope.genreFilter = genre;
    };

});

app.filter('isGenre', function(){
  return function(input, genre){
    if (typeof genre == 'undefined' || genre == null){
      return input;
    } else {
      var out = [];
      for (var a = 0; a < input.length; a++){
                for (var b = 0; b < input[a].show.genres.length; b++){
                    if(input[a].show.genres[b] == genre) {
                        out.push(input[a]);
                    }
                }
            }
            return out;
    }
  }
})

