function setPrettyText(input) {
    return input
      .replace(/([A-Z])/g, ' $1') // Add space before each uppercase letter
      .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
      .trim();
  }

function getCommonKeys(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const commonKeys = keys1.filter(key => Object.prototype.hasOwnProperty.call(obj2, key));
    return commonKeys;
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
    DisplayWeather(dayPropsWeather, dayPropsUsed, document.querySelector('.weather-display-daily'))
    DisplayWeather(hourPropsWeather, hourPropsUsed, document.querySelector('.weather-display-hourly'))
}

currentWeather = {};
dayPropsWeather = {}
dayPropsUsed = {
    conditions: "",
    datetime: "",
    feelslike: "",
    feelslikemin: "",
    feelslikemax: "",
    precip: "",
    precipprob: "",
    windspeed: "",
    winddir: "",
    humidity: "",
    sunrise: "",
    sunset: "",
    uvindex: "",
}
allPropsWeather = {};
hourPropsWeather = {}
hourPropsUsed = {
    conditions: "",
    feelslike: "",
    precip: "",
    precipprob: "",
    windspeed: "",
    humidity: "",
}

function setWeather(obj) {
    currentWeather = {};
    allPropsWeather = obj;
    let keys = Object.keys(obj.currentConditions);
    let values = Object.values(obj.currentConditions);
    let keysAll = Object.keys(obj);
    let valuesAll = Object.values(obj);
    let weatherDisplay = document.querySelector('#weatherdisplay')
    currentWeather.location = obj.resolvedAddress
    currentWeather.date = obj.days[0].datetime
    for (let i = 0; i < keys.length; i++) {
        if (values[i] === null) {continue}
        //console.log(keys[i], values[i]);
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
    console.log("all weather" + obj);
    console.log(allPropsWeather.days[0].hours)
    dayPropsWeather = obj.days
    hourPropsWeather = obj.days[0].hours
};
/*
function DisplayWeather() {
    let keys = Object.keys(currentWeather);
    document.querySelector('#location').textContent = 'Location: ' + currentWeather.location
    document.querySelector('#date').textContent = 'Date: ' + currentWeather.date
    document.querySelector('#windspeed').textContent = 'Wind Speed: ' + currentWeather.windspeed + 'km/h'
    document.querySelector('#winddir').textContent = 'Wind Direction: ' + currentWeather.windir
    document.querySelector('#temp').textContent = 'Temperature: ' + currentWeather.temp + '°C'
    document.querySelector('#humidity').textContent = 'Humidity: ' + currentWeather.humidity + '%'
    document.querySelector('#conditions').textContent = 'Conditions: ' + currentWeather.conditions
    document.querySelector('#sunrise').textContent = 'Sunrise: ' + currentWeather.sunrise
    document.querySelector('#sunset').textContent = 'Sunset: ' + currentWeather.sunset
    document.querySelector('#precip').textContent = 'Precipitation (mm): ' + currentWeather.precip + 'mm'
    document.querySelector('#precipprob').textContent = 'Precipitation (%): ' + currentWeather.precipprob + '%'
};
*/

/*
function DisplayWeatherHourly() {
    let keys = Object.keys(allPropsWeather);
    let hourlyReport = document.querySelector('.weather-display-hourly')
    let hours = allPropsWeather.days[0].hours
    const d = new Date();
    let currentHour = d.getHours();
    console.log(hours[currentHour].temp)
    for (let i = currentHour; i < hours.length; i++) {
        console.log("Info on hour" + i + ": " + hours[i].temp);
        let currentHourDisplay = document.createElement("div");
        currentHourDisplay.classList.add("hour-" + i)
        currentHourDisplay.classList.add("button-73")
        let currentHourDisplayHour = document.createElement("div");
        let currentHourDisplayCond = document.createElement("div");
        let currentHourDisplayTemp = document.createElement("div");
        let currentHourDisplayPrecip = document.createElement("div");
        let currentHourDisplayPrecipProb = document.createElement("div");
        let currentHourDisplayHumidity = document.createElement("div");
        let currentHourDisplayWindSpeed = document.createElement("div");
        currentHourDisplayHour.textContent = i + ":00"
        currentHourDisplayCond.textContent = hours[i].conditions
        currentHourDisplayTemp.textContent = hours[i].feelslike + '°C'
        currentHourDisplayPrecip.textContent = hours[i].precip + 'mm'
        currentHourDisplayPrecipProb.textContent = hours[i].precipprob + '%'
        currentHourDisplayHumidity.textContent = hours[i].humidity + '%'
        currentHourDisplay.appendChild(currentHourDisplayCond)
        currentHourDisplay.appendChild(currentHourDisplayTemp)
        currentHourDisplay.appendChild(currentHourDisplayPrecip)
        currentHourDisplay.appendChild(currentHourDisplayPrecipProb)
        currentHourDisplay.appendChild(currentHourDisplayHumidity)
        currentHourDisplay.appendChild(currentHourDisplayWindSpeed)
        document.querySelector('.weather-display-hourly').appendChild(currentHourDisplay)
    }
};
*/

function DisplayWeather(obj1, obj2, element1) {

    console.log("getting class" + element1.classList[0]);
    let currentTime = "";
    const d = new Date();
    if (element1.classList[0] == "weather-display-daily") {
        console.log("daily")
        let currentTime = d.getDay()
    } else {
        let currentTime = d.getHours();
        console.log("not daily")
    }
    console.log(currentTime)
    const allPropsWeatherKeys = Object.keys(obj2)
    for (let i = 0; i < obj1.length; i++) {
        //console.log("Info on hour" + i + ": " + obj1[i].temp);
        let currentDisplay = document.createElement("div");
        let propTime = currentTime + i
        currentDisplay.classList.add(element1.classList[0] + "-" + propTime)
        currentDisplay.classList.add("button-73")
        let currentDisplayTime = document.createElement("div");
        currentDisplayTime.textContent = currentTime + i
        currentDisplay.appendChild(currentDisplayTime)
        
        for (let j = 0; j < allPropsWeatherKeys.length; j++) {
            let currentProp = allPropsWeatherKeys[j]
            //console.log("adding: " + currentProp);
            //console.log( obj1[i][currentProp] );
            let currentHourDisplayProp = document.createElement("div");
            console.log(obj1);
            console.log(i);
            currentHourDisplayProp.textContent = obj1[i][currentProp]
            currentDisplay.appendChild(currentHourDisplayProp)
        }
        element1.appendChild(currentDisplay)
    }    
}



const form = document.querySelector('#weathersearch');
let searchstring = '';
form.addEventListener('submit', function(event) {
    event.preventDefault()
    searchstring = form.elements.location.value
    console.log(`Submit button clicked, form input: ${form.elements.location.value}`);
    if (searchstring) { getWeather(searchstring) };
});



getWeather();
