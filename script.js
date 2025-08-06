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

let currentTime = "";
const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const d = new Date();

function temperatureFToC(valNum) {
  valNum = parseFloat(valNum);
  //console.log("Converting: " + valNum + "to: " + Math.round(((valNum-32) * 5 / 9)  * 10) / 10);
  return Math.round(((valNum-32) * 5 / 9)  * 10) / 10
}

async function getWeather(location) {
    console.log(`Getting weather, location is: ${location}`);
    //const display = document.querySelector('#weathertext');
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
    DisplayWeather(daysPropsWeather, daysPropsUsed, document.querySelector('.weather-display-daily'))
    DisplayWeather(hourPropsWeather, hourPropsUsed, document.querySelector('.weather-display-hourly'))
    DisplayWeatherDay(daysPropsWeather, dayPropsUsed, document.querySelector('.weather-display-day'), 0)
    AppendUnits()
}

currentWeather = {};
daysPropsWeather = {}
daysPropsUsed = {
    conditions: "",
    feelslike: "",
    precip: "",
    precipprob: "",
}

dayPropsWeather = {}
dayPropsUsed = {
    datetime: "",
    conditions: "",
    feelslike: "",
    feelslikemax: "",
    feelslikemin: "",
    precip: "",
    precipprob: "",
    windspeed: "",
    winddir: "",
    humidity: "",
    sunrise: "",
    sunset: "",
    uvindex: "",
}
hourPropsWeather = {}
hourPropsUsed = {
    datetime: "",
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
    //let keysAll = Object.keys(obj);
    //let valuesAll = Object.values(obj);
    //let weatherDisplay = document.querySelector('.weather-display-daily')
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
    daysPropsWeather = obj.days
    hourPropsWeather = obj.days[0].hours
    dayPropsWeather = obj.days[0]
    //console.log(daysPropsWeather);
    //console.log(daysPropsWeather.length);
    //console.log(obj.days[0]);
    //console.log(dayPropsWeather);
    //console.log(dayPropsWeather.length);
};

function DisplayWeather(obj1, obj2, element1) {

    //console.log("getting class" + element1.classList[0]);
    let currentTime = 0;
    //let i = 0;
    let timeUnits = 0
    if (element1.classList[0] == "weather-display-daily") {
        currentTime = d.getDay()
        timeUnits = 14;
    } else {
        currentTime = d.getHours();
        timeUnits = 24 - currentTime
    }
    //console.log(currentTime)
    const allPropsWeatherKeys = Object.keys(obj2)
    for (let i = 0; i < timeUnits; i++) {
        //Create individual day
        let currentDisplay = document.createElement("div");
        let propTime = i
        dayOfWeekNum = currentTime + i
        if (dayOfWeekNum > 6 && dayOfWeekNum < 14 ) {
            dayOfWeekNum -= 7
        } else if (dayOfWeekNum > 13) {
            dayOfWeekNum -= 14
        }
        dayOfWeek = weekdays[dayOfWeekNum]

        currentDisplay.classList.add(element1.classList[0] + "-info-" + propTime)
        currentDisplay.classList.add("button-73")
        let currentDisplayTime = document.createElement("div");
        let propHour = 0;

        if (element1.classList[0] == "weather-display-daily") {
            console.log("working on weather-display-daily");
            currentDisplayTime.textContent = weekdays[currentTime]
            let dayOfWeekText = document.createElement("div");
            dayOfWeekText.textContent = dayOfWeek
            currentDisplay.insertBefore(dayOfWeekText, currentDisplay.firstChild)
        } else {
            currentDisplayTime.textContent = currentTime + i + ":00";
            propHour = currentTime + i;
        }
        
        for (let j = 0; j < allPropsWeatherKeys.length; j++) {
            //Create properties on each day
            let currentProp = allPropsWeatherKeys[j]
            let currentDisplayProp = document.createElement("div");
            currentDisplayProp.classList.add(currentProp)

            if (element1.classList[0] == "weather-display-daily") {
                currentDisplayProp.textContent = obj1[i][currentProp];
            } else {
                currentDisplayProp.textContent = obj1[propHour][currentProp];
            }
            currentDisplay.appendChild(currentDisplayProp);
        }
        /*
        if (element1.classList[0] == "weather-display-daily") {
        } else {
            //console.log("currentDisplayTime: " + currentDisplayTime.textContent);
            //currentDisplay.insertBefore(currentDisplayTime, currentDisplay.firstChild)
        }
        */

        element1.appendChild(currentDisplay)
        attachDragger(element1)
    }
}

function DisplayWeatherDay(obj1, obj2, element1, dayOfWeekNum) {
    let currentDisplay = document.createElement("div");
    currentDisplay.classList.add("button-73")
    currentDisplay.classList.add(element1.classList[0] + "-info-" + dayOfWeekNum)
    const obj2Keys = Object.keys(obj2)
    for (let i = 0; i < obj2Keys.length; i++) {
        let currentWeatherProp = obj2Keys[i]
        let currentInfoProp = document.createElement("div");
        currentInfoProp.textContent = obj1[0][currentWeatherProp]
        currentInfoProp.classList.add(currentWeatherProp)
        currentDisplay.appendChild(currentInfoProp)
    }
    let dateElements = currentDisplay.querySelectorAll(".datetime");
    dateElements.forEach(dateElements => {
        dateElements.classList.replace("datetime", "date");
    });

    rotateCompass(obj1[0].winddir)
    let dayOfWeek = weekdays[d.getDay()]
    let dayOfWeekText = document.createElement("div");
    dayOfWeekText.textContent = dayOfWeek
    currentDisplay.insertBefore(dayOfWeekText, currentDisplay.firstChild)
    element1.appendChild(currentDisplay)

    let dayConditions = obj1[0].conditions;
    dayConditions = "Rainy"
    dayConditions = dayConditions.replace(/\s+/g, '-').toLowerCase();
    dayConditions = dayConditions.replace("partially", 'partly');
    dayConditions = dayConditions.replace("overcast", 'cloudy');
    console.log("dayConditions: " + dayConditions);

    let dayConditionsIcons = document.querySelectorAll(".day-icons");
    let found = false;
    dayConditionsIcons.forEach(dayConditionsIcon => {
         const classList = dayConditionsIcon.classList;
         console.log("classList: " + classList);
         classList.forEach(className => {
            if (className.includes(dayConditions) && !found) {
                console.log(found);
                found = true;
                dayConditionsIcon.style.display = "inline-block";
                console.log(className);
            }
         });
    });
}

function rotateCompass(winddir) {
    console.log("rotateCompass running");
    let compass = document.querySelector('.compass-needle')
    compass.style.transform = `translate(-50%, -50%) rotate(${winddir}deg)`;
}

const form = document.querySelector('#weathersearch');
let searchstring = '';
form.addEventListener('submit', function(event) {
    event.preventDefault()
    searchstring = form.elements.location.value
    console.log(`Submit button clicked, form input: ${form.elements.location.value}`);
    if (searchstring) { getWeather(searchstring) };
});

function attachDragger(element) {
    let isDragging = false;
    let lastPosition = { x: 0, y: 0 };
    let animationFrameId = null;

    const handleMouseMove = (e) => {
        if (isDragging) {
            const currentX = e.clientX;
            const currentY = e.clientY;
            const diffX = currentX - lastPosition.x;
            const diffY = currentY - lastPosition.y;

            // Reduce the scrolling speed by introducing a scaling factor
            const scrollSpeed = 0.04; // Adjust this value to control the scrolling speed
            const scrollX = diffX * scrollSpeed;
            const scrollY = diffY * scrollSpeed;

            // Use requestAnimationFrame for smoother scrolling
            if (animationFrameId === null) {
                animationFrameId = requestAnimationFrame(() => {
                    element.scrollLeft -= scrollX;
                    element.scrollTop -= scrollY;
                    lastPosition.x = currentX;
                    lastPosition.y = currentY;
                    animationFrameId = null;
                });
            }
            e.preventDefault();
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            element.style.userSelect = '';
        }
    };

    const handleMouseDown = (e) => {
        isDragging = true;
        lastPosition.x = e.clientX;
        lastPosition.y = e.clientY;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        element.style.userSelect = 'none';
        e.preventDefault();
    };

    element.addEventListener('mousedown', handleMouseDown);
}

function AppendUnits() {
    let mph = document.querySelectorAll(".windspeed");
    let temps = document.querySelectorAll(".feelslike, .feelslikemin, .feelslikemax");
    let percents = document.querySelectorAll(".precipprob, .humidity");
    let millimetres = document.querySelectorAll(".precip");
    let time = document.querySelectorAll(".datetime, .sunrise, .sunset");

    mph.forEach(mph => {
        mph.textContent += " mph"
    });
    temps.forEach(temps => {
        let newText = temperatureFToC(temps.textContent) + " °C"
        temps.textContent = newText
    });
    percents.forEach(percents => {
        percents.textContent += " %"
    });
    millimetres.forEach(millimetres => {
        millimetres.textContent += " mm"
    });
    time.forEach(time => {
        time.textContent = time.textContent.substring(0, 5);
        //console.log(time.textContent.substring(0, 5))
    });
}

getWeather();
