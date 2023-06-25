//TODO - Make Variables targeting elements where data will go
var currentWeather = $("#current-weather");
var currentTemp = $("#temp");
var currentWind = $("#wind");
var currentHumidity = $("#humidity");
var currentCity = $("#city");
var dayAfter1 = $("#dayAfter-1");
var dayAfter2 = $("#dayAfter-2");
var dayAfter3 = $("#dayAfter-3");
var dayAfter4 = $("#dayAfter-4");
var dayAfter5 = $("#dayAfter-5");

var searchFormEl = $("#search-form");

var lat = 0;
var lon = 0;


searchFormEl.on("submit", function(event){
    event.preventDefault();
    var city = currentCity.val();

    var requestLatLon = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=0abc1b8372c44587f42b9a4f3413df22"
    fetch(requestLatLon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data);
        lat = data[0].lat;
        lon = data[0].lon;
        console.log(lat);
        console.log(lon);
    });

    
});   

//TODO - A click function for when a city is searched. 
//This will unhide the weather data and render weather info for the searched city
//This will also get the local storage of previous searches, and then add the most recent 
//search to the local storage

//TODO - A function that will render the search history of cities
//This must be activated as the page loads

//TODO - A function that when a user clicks on one of the rendered history search buttons
//that weather data is pulled up and rendered