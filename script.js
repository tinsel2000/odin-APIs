function setPrettyText(input) {
    return input
      .replace(/([A-Z])/g, ' $1') // Add space before each uppercase letter
      .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
      .trim();
  }

async function getWeather(location) {
    console.log(`Getting weather, location is: ${location}`);
    const display = document.querySelector('#weathertext');
    const apiKey = '?key=9S6PHD9WTMVUYEKHT5KNYKJMR'
    if (!location) {
        console.log(`No location detected, setting default`);
        location = 'Carlisle'
    };
    const reqUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + location + apiKey
    const response = await fetch( 
        reqUrl, 
        { mode: 'cors'} 
    )
    const returnedData = await response.json();
    console.log(returnedData);
    setWeather(returnedData);
    DisplayWeather();
}

currentWeather = {};
function setWeather(obj) {
    currentWeather = {};
    let keys = Object.keys(obj.currentConditions);
    let values = Object.values(obj.currentConditions);
    let weatherDisplay = document.querySelector('#weatherdisplay')
    currentWeather.location = obj.resolvedAddress
    currentWeather.date = obj.days[0].datetime
    for (let i = 0; i < keys.length; i++) {
        if (values[i] === null) {continue}
        console.log(keys[i], values[i]);
        currentWeather[keys[i]] = values[i];
        /*
        let newDiv = document.createElement("div")
        newDiv.setAttribute("id", keys[i]);
        newDiv.setAttribute("class", "weatherinfo");
        newDiv.textContent = `${keys[i]} ${values[i]}`
        weatherDisplay.appendChild(newDiv);
        */
    }
    console.log(currentWeather);
};

function DisplayWeather() {
    let keys = Object.keys(currentWeather);
    document.querySelector('#location').textContent = 'Location: ' + currentWeather.location
    document.querySelector('#date').textContent = 'Date: ' + currentWeather.date
    document.querySelector('#windspeed').textContent = 'Wind Speed: ' + currentWeather.windspeed
    document.querySelector('#winddir').textContent = 'Wind Direction: ' + currentWeather.windir
    document.querySelector('#temp').textContent = 'Temperature: ' + currentWeather.temp
    document.querySelector('#humidity').textContent = 'Humidity: ' + currentWeather.humidity
    document.querySelector('#conditions').textContent = 'Conditions: ' + currentWeather.conditions
    document.querySelector('#sunrise').textContent = 'Sunrise: ' + currentWeather.sunrise
    document.querySelector('#sunset').textContent = 'Sunset: ' + currentWeather.sunset
    document.querySelector('#precip').textContent = 'Precipitation: ' + currentWeather.precip
    document.querySelector('#precipprob').textContent = 'Precipitation %: ' + currentWeather.precipprob
};

const form = document.querySelector('#weathersearch');
let searchstring = '';
form.addEventListener('submit', function(event) {
    event.preventDefault()
    searchstring = form.elements.location.value
    console.log(`Submit button clicked, form input: ${form.elements.location.value}`);
    if (searchstring) { getWeather(searchstring) };
});



getWeather();
