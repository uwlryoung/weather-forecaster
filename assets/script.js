//TODO - Make Variables targeting elements where data will go
var currentWeather = $("#current-weather");
var currentTemp = $("#temp");
var currentWind = $("#wind");
var currentHumidity = $("#humidity");
var currentIcon = $("#icon");
var currentCity = $("#city");
var currentDate = $("#date");
var displayCity = $("#displayCity");
var searchFormEl = $("#search-form");
var clearHistoryBtn = $("#clear-history");
var futureForecast = document.getElementById("future-forecast");
var searchHistory = document.getElementById("search-history");

var apiKey = "0abc1b8372c44587f42b9a4f3413df22";

//Renders search history on page load
renderSearchHistory();

/* Click Events: 
  1) Search Form - When activated, user input becomes var 'city', old data (if any) is replaced, alerts user if
  nothing was searched, renders new city to search history if city was not in local storage 
  2) Search History - When activated, it will render that button's city's weather information (by its id)
  3) Clear History - When activated, it clears the local storage and removes the search history buttons
-------------------------------------------------------------------------------------------------------------*/

//Search Form Click Event
searchFormEl.on("submit", function(event){
    event.preventDefault();

    var city = currentCity.val();
    var cities = JSON.parse(localStorage.getItem("previousCities"));

    futureForecast.replaceChildren();

    if (city === ""){
      alert("Please Enter a City");
      return;
    } 
    
    if (cities === null){
      cities = [];
    }

    //Renders the newly searched city button onto the search history, only if the city hasn't been searched before
    if (cities.indexOf(city) === -1){
      renderNewCitySearch(city);
    }

    displayCity.text(city);

    saveSearchHistory(city);
    getLatLon(city);
  
    //Resets the form input so user doesn't have to backspace
    $(searchFormEl)[0].reset();
});  


//Searh History Click Event
$(searchHistory).on("click", "button", function(event) {
  futureForecast.replaceChildren();
  var city = $(this).attr("id");
  displayCity.text(city);
  getLatLon(city);
})

//Clear History Click Event
clearHistoryBtn.on("click", function(){
  localStorage.clear();
  renderSearchHistory();
  searchHistory.replaceChildren();
})


/*Functions to get the Current Weather (first gets the Latitude/Longitude, then gets the weather from the city)
---------------------------------------------------------------------------------------------------------------*/
//Gets the latitude and longitude of the input city
function getLatLon (city){
    var requestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
    fetch(requestURL)
    .then(function (response){
      return response.json();
    })
    .then(function (data){
      var lat = data[0].lat;
      var lon = data[0].lon;

      getCurrentWeather(lat,lon);
      getForecastWeather(lat,lon);
    })
  
};

//Gets the current weather using the latitude and longitude
function getCurrentWeather (lat,lon){
  var requestURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
  fetch(requestURL)
    .then(function (response){
      return response.json();
    })
    .then(function (data){
      currentDate.text(dayjs().format("dddd[, ]MMMM[ ]D"));
      currentIcon.attr("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
      currentTemp.text("Temp: " + data.main.temp + "\u00B0F");
      currentWind.text("Wind: " + data.wind.speed + " MPH");
      currentHumidity.text("Humidity: " + data.main.humidity + "%")
    })
};

//Gets the 5-day weather forecast of the current weather using the latitude and longitude
function getForecastWeather (lat,lon){
  var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
  fetch(requestURL)
    .then(function (response){
      return response.json();
    })
    .then(function (data){
      var forecastHeader = document.createElement("h2");
      forecastHeader.textContent = "5-day Forecast for " + data.city.name;
      futureForecast.appendChild(forecastHeader);

      for(i = 1; i < data.list.length; i+=8){
        var weatherCard = document.createElement("div");
        weatherCard.setAttribute("class", "future-weather col");

        futureForecast.appendChild(weatherCard);

        var dateEl = document.createElement("p");
        dateEl.style.fontSize = "20px";
        dateEl.textContent = dayjs.unix(data.list[i].dt).format("ddd[,] MMM D");
        weatherCard.appendChild(dateEl);

        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png");
        weatherCard.appendChild(iconEl);

        var tempEl = document.createElement("p");
        tempEl.textContent = "Temp: " + data.list[i].main.temp + "\u00B0F";
        weatherCard.appendChild(tempEl);

        var windEl = document.createElement("p");
        windEl.textContent = "Wind: " + data.list[i].wind.speed + " MPH";
        weatherCard.appendChild(windEl);

        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + data.list[i].main.humidity + "%";
        weatherCard.appendChild(humidityEl);
      }
    });
};

//Saves the search onto local storage, adding to a list of Previous Cities
function saveSearchHistory(city) {
  var cities = JSON.parse(localStorage.getItem("previousCities"));

  if (cities === null){
    cities = [];
    cities.push(city);
  } else if (cities.indexOf(city) === -1) {
    cities.push(city);
  } else {
  }
  localStorage.setItem("previousCities", JSON.stringify(cities));
}

//Renders search history into clickable buttons
function renderSearchHistory() {
  var cities = JSON.parse(localStorage.getItem("previousCities"));
  if (cities === null){
    cities = [];
  }

  for (i = 0; i < cities.length; i++){
    var cityButton = document.createElement("button");
    cityButton.setAttribute("id", cities[i]);
    cityButton.setAttribute("class", "button");
    cityButton.textContent = cities[i];
    searchHistory.appendChild(cityButton);
  }
}

//Renders the newly input city immediately into the search history
function renderNewCitySearch(city){
  var cityButton = document.createElement("button");
  cityButton.setAttribute("id", city);
  cityButton.setAttribute("class", "button");
  cityButton.textContent = city;
  searchHistory.appendChild(cityButton);
}



