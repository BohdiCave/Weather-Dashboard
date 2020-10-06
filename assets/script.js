// Assignment and Declarations 
var citySearch = $("#city-search").val();
var cityInfo1 = $("#cityInfo-1");
var cityInfo2 = $("#cityInfo-2");
var cityName1 = $("#cityName-1");
var cityName2 = $("#cityName-2");
var weatherIcon1 = $("#weatherIcon-1");
var weatherIcon2 = $("#weatherIcon-2");
var todayDate = $("#todayDate");
var searchedDiv = $("#searched");
var newSearch = false;
var input = "";
var weatherURL = "";
var forecastURL = "";
var arrSearched = [];

// AJAX request for the current local weather in Philadelphia (to remain static after request)  
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Philadelphia,PA,USA&units=imperial&appid=f0f4d87763aa343a55935871e0d71f65";
$.ajax(url = queryURL, method = "GET").then(function(local) {
    //getting the city name to display
    var localName = local.name;
    cityName2.text(localName + ", PA");
    //creating the array for storing searched cities
    var arrName = [localName];
    localStorage.setItem("Searched Cities", JSON.stringify(arrName));
    //getting the current date
    var date = new Date(local.dt * 1000); 
    todayDate.text((date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear());
    //getting the correct weather icon based on the API docs and the JSON data
    var iconURL2 = "http://openweathermap.org/img/wn/" + local.weather[0].icon + ".png";
    weatherIcon2.attr("src", iconURL2);
    weatherIcon2.attr("alt", local.weather[0].description);
    //getting the current local temperature and humidity from the JSON data 
    var localTemp = $("<p>");
    localTemp.attr("id", "localTemp");
    cityInfo2.append(localTemp);
    localTemp.append("Temperature: " + Math.round(local.main.temp) + "&deg;F / " + Math.round((local.main.temp - 32)*5/9) + "&deg;C");
    localTemp.append("<br> Humidity: " + local.main.humidity + "%");
    //getting the current wind data from the JSON response
    var localWind = $("<p>");
    localWind.attr("id", "localWind");
    cityInfo2.append(localWind);
    localWind.append("Wind degree: " + local.wind.deg + "&deg;");
    localWind.append("<br> Wind speed: " + local.wind.speed + " mph / " + (local.wind.speed*0.44704).toFixed(2) + " m/s");
    //getting the UV index data through the request to another API, based on the current JSON data
    var localLon = local.coord.lon;
    var localLat = local.coord.lat;
    var uvindexURL2 = "http://api.openweathermap.org/data/2.5/uvi?lat=" + localLat + "&lon=" + localLon + "&appid=f0f4d87763aa343a55935871e0d71f65";
    $.ajax(url = uvindexURL2, method = "GET").then(function(localUV) {
        var indexUV2 = $("<p>");
        indexUV2.attr("id", "localUV"); 
        cityInfo2.append(indexUV2);
        indexUV2.append("UV index: " + localUV.value);
    });
});

// AJAX request for local forecast for Philadelphia (to remain static)
var localForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=Philadelphia,PA,USA&units=imperial&appid=f0f4d87763aa343a55935871e0d71f65";
$.ajax(url = localForecastURL, method = "GET").then(function(localForecast) {
    var row2 = $("#five-days-2");
    var localDailyForecast = localForecast.list;
    //constructing a loop to fill in the 5-day, 3-hour forecast information
    for (var j = 0; j < localDailyForecast.length; j+=8) {                
        var column2 = $("<div>");
        column2.attr("class", "column each-day-2");
        row2.append(column2); 
        //getting and displaying the forecast date
        var localForecastDate = new Date(localDailyForecast[j].dt * 1000);
        column2.append("<div id='localForeDate'>"+(localForecastDate.getMonth()+1)+"/"+ localForecastDate.getDate()+"/"+ localForecastDate.getFullYear()+"</div>");
        //getting and displaying the correct weather icon for that date
        var localForecastURL = "http://openweathermap.org/img/wn/" + localDailyForecast[j].weather[0].icon + ".png";
        var localForecastIcon = $("<img>");
        localForecastIcon.attr("src", localForecastURL); 
        localForecastIcon.attr("alt", localDailyForecast[j].weather[0].description);
        column2.append(localForecastIcon);
        //getting the forecast temperature and humidity for that date
        var localForecastTemp = localDailyForecast[j].main.temp;
        var localForecastHumid = localDailyForecast[j].main.humidity;
        column2.append("<div id='localForeTemp'> Temp:<br>" + Math.round(localForecastTemp) + "&deg;F / " + Math.round((localForecastTemp - 32)*5/9) + "&deg;C <br> Humid: " + localForecastHumid + "% </div>");
    }
});

// Function code

// Conditional function for the initial page load versus the new search to be loaded
function repeatSearch() {
    if (newSearch) {
        weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=imperial&appid=f0f4d87763aa343a55935871e0d71f65";
        forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + input + "&units=imperial&appid=f0f4d87763aa343a55935871e0d71f65";
    } else {
        weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&units=imperial&appid=f0f4d87763aa343a55935871e0d71f65";
        forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&units=imperial&appid=f0f4d87763aa343a55935871e0d71f65";
    }
}
repeatSearch();

// AJAX request for the current weather at the new city (to remain dynamic)
// The flow of code is equivalent to the current local weather request above 
function cityWeather() {

    $.ajax(url = weatherURL, method = "GET").then(function(response) {
                    
        var name = response.name;
        var country = response.sys.country;
        cityName1.text(name + ", " + country);
        //constructing a loop to add search history buttons, unless the city has already been added
        arrSearched = JSON.parse(localStorage.getItem("Searched Cities")) || [];
        for (var c = 0; c < arrSearched.length; c++) {
            var name2 = arrSearched[c];
            if (name === name2) {break;} 
            else if (c==(arrSearched.length-1)) {
                var cityBtn = $("<input>");
                cityBtn.attr("class", "button button-outline search-history");
                cityBtn.attr("id", "city-searched");
                cityBtn.attr("type", "submit");
                cityBtn.attr("value", name);
                searchedDiv.append(cityBtn);
                arrSearched.push(name);
                localStorage.setItem("Searched Cities", JSON.stringify(arrSearched));}
        }
        //getting the correct weather icon to display alongside city name
        var iconURL1 = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
        weatherIcon1.attr("src", iconURL1); 
        weatherIcon1.attr("alt", response.weather[0].description);
        //getting temperature and humidity
        var temp = $("<p>");
        temp.attr("id", "temp");
        cityInfo1.append(temp);
        temp.append("Temperature: " + Math.round(response.main.temp) + "&deg;F / " + Math.round((response.main.temp - 32) * 5 / 9) + "&deg;C");
        temp.append("<br> Humidity: " + response.main.humidity + "%");
        //getting wind data
        var wind = $("<p>");
        wind.attr("id", "wind");
        cityInfo1.append(wind);
        wind.append("Wind degree: " + response.wind.deg + "&deg;");
        wind.append("<br> Wind speed: " + response.wind.speed + " mph / " + (response.wind.speed * 0.44704).toFixed(2) + " m/s");
        //getting UVI data via a separate AJAX request
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        var uvindexURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=f0f4d87763aa343a55935871e0d71f65";
        $.ajax(url = uvindexURL, method = "GET").then(function(uvindex) {
            var indexUV = $("<p>");
            indexUV.attr("id", "ultraViolet"); 
            cityInfo1.append(indexUV);
            indexUV.append("UV index: " + uvindex.value);
        });
    });
}
cityWeather();

// AJAX request for the forecast at the new city location (to remain dynamic)
// The flow of code is equivalent to the local forecast request above 
function cityForecast() {

    $.ajax(url = forecastURL, method = "GET").then(function(forecast) {
        var row = $("#five-days");
        var dailyForecast = forecast.list;
        var forecastCity = forecast.city.name;
        $("#forecast-city").text(" " + forecastCity);
        //constructing a loop to get the 5-day, 3-hour forecast data
        for (var i = 0; i < dailyForecast.length; i+=8) {                
            
            var column = $("<div>");
            column.attr("class", "column each-day-1");
            row.append(column); 
            //getting the forecast date
            var forecastDate = new Date(dailyForecast[i].dt * 1000);
            column.append("<div id='foreDate'>"+(forecastDate.getMonth()+1)+"/"+ forecastDate.getDate()+"/"+ forecastDate.getFullYear()+"</div>");
            //getting the correct weather icon for that date
            var forecastURL = "http://openweathermap.org/img/wn/" + dailyForecast[i].weather[0].icon + ".png";
            var forecastIcon = $("<img>");
            forecastIcon.attr("src", forecastURL); 
            forecastIcon.attr("alt", dailyForecast[i].weather[0].description);
            column.append(forecastIcon);
            //getting the temperature and humidity data for that date
            var forecastTemp = dailyForecast[i].main.temp;
            var forecastHumid = dailyForecast[i].main.humidity;
            column.append("<div id='foreTemp'> Temp:<br>" + Math.round(forecastTemp) + "&deg;F / " + Math.round((forecastTemp - 32)*5/9) + "&deg;C <br> Humid: " + forecastHumid + "% </div>");
        }
    });

}
cityForecast();

// Event handling function when the "Search" button is clicked
// - Clearing the previous search results before the new data is loaded
// - Running the three search functions again
$("#search-button").on("click", function(event) {
    event.preventDefault();
    newSearch = true;
    input = $("#city-search").val();
    $("#cityInfo-1").empty();
    $("#cityName-1").empty();
    $("#weatherIcon-1").attr("src", null);
    $("#weatherIcon-1").attr("alt", null);
    $("#five-days").empty();
    repeatSearch();
    cityWeather();
    cityForecast();
    newSearch = false;
    $("#city-search").val("");
});

// Event handling function to load the correct weather information
// when one of the search history buttons is clicked
$("#searched").on("click", "input", function(event) {
    event.preventDefault();
    newSearch = true;
    input = $(this).val();
    $("#cityInfo-1").empty();
    $("#cityName-1").empty();
    $("#weatherIcon-1").attr("src", null);
    $("#weatherIcon-1").attr("alt", null);
    $("#five-days").empty();
    repeatSearch();
    cityWeather();
    cityForecast();
    newSearch = false;
    $("#city-search").val("");
});

// Clearing local storage on reload to clear search history
$(window).on("load", function(){
    localStorage.clear();
    $("#city-search").val("");
});