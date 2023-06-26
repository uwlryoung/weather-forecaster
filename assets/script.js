//TODO - Make Variables targeting elements where data will go
var currentWeather = $("#current-weather");
var currentTemp = $("#temp");
var currentWind = $("#wind");
var currentHumidity = $("#humidity");
var currentIcon = $("#icon");
var currentCity = $("#city");
var currentDate = $("#date");
var displayCity = $("#displayCity");
var futureForecast = document.getElementById("future-forecast");
var searchFormEl = $("#search-form");

var apiKey = "0abc1b8372c44587f42b9a4f3413df22";


//Click Event to get the submitted city 
searchFormEl.on("submit", function(event){
    event.preventDefault();
    
    var city = currentCity.val();
    displayCity.text(city);
    getLatLon(city);
});   

//Functions to get the Current Weather (first gets the Latitude/Longitude, then gets the weather from the city)
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

function getCurrentWeather (lat,lon){
  var requestURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
  fetch(requestURL)
    .then(function (response){
      return response.json();
    })
    .then(function (data){
      console.log(data);
      currentDate.text(dayjs().format("dddd[, ]MMMM[ ]D"));
      currentIcon.attr("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
      currentTemp.text("Temp: " + data.main.temp + "\u00B0F");
      currentWind.text("Wind: " + data.wind.speed + " MPH");
      currentHumidity.text("Humidity: " + data.main.humidity + "%")
    })
};

function getForecastWeather (lat,lon){
  var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
  fetch(requestURL)
    .then(function (response){
      return response.json();
    })
    .then(function (data){
      console.log(data);

      var forecastHeader = document.createElement("h2");
      forecastHeader.textContent = "5-day Forecast";
      futureForecast.appendChild(forecastHeader);


      for(i = 1; i < data.list.length; i+=8){
        console.log(data.list[i].main.temp);
        console.log(data.list[i].dt_txt);

        var weatherCard = document.createElement("div");
        weatherCard.setAttribute("class", "future-weather col");

        futureForecast.appendChild(weatherCard);

        var dateEl = document.createElement("p");
        dateEl.style.fontSize = "20px";
        dateEl.textContent = dayjs.unix(data.list[i].dt).format("ddd[,] MMM D")
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
    })

    
};


//TODO - A click function for when a city is searched. 
//This will unhide the weather data and render weather info for the searched city
//This will also get the local storage of previous searches, and then add the most recent 
//search to the local storage

//TODO - A function that will render the search history of cities
//This must be activated as the page loads

//TODO - A function that when a user clicks on one of the rendered history search buttons
//that weather data is pulled up and rendered

