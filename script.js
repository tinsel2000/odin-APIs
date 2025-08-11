function setPrettyText(input) {
    return input
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
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
let daysAdditional = 0

function temperatureFToC(valNum) {
  valNum = parseFloat(valNum);
  return Math.round(((valNum-32) * 5 / 9)  * 10) / 10
}

async function getWeather(location) {
    console.log(`Getting weather, location is: ${location}`);
    const apiKey = '?key=9S6PHD9WTMVUYEKHT5KNYKJMR'
    if (!location) {
        console.log(`No location detected, setting default as Carlisle`);
        location = 'Carlisle'
    };
    const reqUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + location + apiKey
    const response = await fetch( 
        reqUrl, 
        { mode: 'cors'} 
    )
    const returnedData = await response.json();
    console.log(returnedData);
    setWeather(returnedData, 0);
    loadWeather()
}

currentWeather = {};
allWeather = {};
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
    location: "",
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

function setWeather(obj, day) {
    allPropsWeather = obj;

    allWeather = obj;
    console.log("all weather" + obj);
    console.log(obj);
    console.log(day);
    console.log(obj.days[day]);
    console.log(allPropsWeather.days[day])
    daysPropsWeather = obj.days
    hourPropsWeather = obj.days[day].hours
    dayPropsWeather = obj.days[day]
    dayPropsWeather.location = setPrettyText(obj.address);
};

function DisplayWeather(obj1, obj2, element1, daysAdditional) {

    let currentTime = 0;
    let timeUnits = 0
    if (element1.classList[0] == "weather-display-daily") {
        currentTime = d.getDay()
        timeUnits = 14;
    } else {
        if (daysAdditional && daysAdditional > 0) {

        } else {
            currentTime = d.getHours();
        }
        timeUnits = 24 - currentTime
    }
    const allPropsWeatherKeys = Object.keys(obj2)
    for (let i = 0; i < timeUnits; i++) {
        //Create individual time unit
        let currentDisplay = document.createElement("div");
        let propTime = i
        //For weekly consideration
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

            currentDisplay.addEventListener("click", handleDayClicked)
        } else {
            currentDisplayTime.textContent = currentTime + i + ":00";
            propHour = currentTime + i;
        }
        
        for (let j = 0; j < allPropsWeatherKeys.length; j++) {
            //Create properties on each day
            let currentProp = allPropsWeatherKeys[j]
            let currentDisplayProp = document.createElement("div");
            currentDisplayProp.classList.add(currentProp)
            currentDisplayProp.style.pointerEvents = "none";

            if (element1.classList[0] == "weather-display-daily") {
                currentDisplayProp.textContent = obj1[i][currentProp];
            } else {
                currentDisplayProp.textContent = obj1[propHour][currentProp];
            }
            currentDisplay.appendChild(currentDisplayProp);
        }
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
        console
        currentInfoProp.textContent = obj1[currentWeatherProp]
        currentInfoProp.classList.add(currentWeatherProp)
        currentDisplay.appendChild(currentInfoProp)
    }
    let dateElements = currentDisplay.querySelectorAll(".datetime");
    dateElements.forEach(dateElements => {
        dateElements.classList.replace("datetime", "date");
        dateElements.setAttribute("id","day-date");
    });

    rotateCompass(obj1.winddir)

    element1.appendChild(currentDisplay)
    

    let dayConditions = obj1.conditions;
    dayConditions = "Rainy"
    dayConditions = dayConditions.replace(/\s+/g, '-').toLowerCase();
    dayConditions = dayConditions.replace("partially", 'partly');
    dayConditions = dayConditions.replace("overcast", 'cloudy');

    let dayConditionsIcons = document.querySelectorAll(".day-icons");
    let found = false;
    dayConditionsIcons.forEach(dayConditionsIcon => {
         const classList = dayConditionsIcon.classList;
         classList.forEach(className => {
            if (className.includes(dayConditions) && !found) {
                found = true;
                dayConditionsIcon.style.display = "inline-block";
            }
         });
    });
}

function DisplayWeatherDayChart(obj1, obj2, unit, label1, color1, color2) {
    console.log(color1 + color2);
    //let xyValues = [];
    let xValues = [];
    let yValues = [];
    console.log(daysAdditional);
    if (daysAdditional > 0 ) {
        currentTime = 0;
    } else {
        currentTime = d.getHours();
    }
    timeUnits = 24 - currentTime;
    const allPropsWeatherKeys = Object.keys(obj2)

    for (let i = 0; i < timeUnits; i++) {
        
        //Create individual time unit
        let propTime = i
        let propHour = 0;
        propHour = currentTime + i;
        allPropsWeatherKeys
        xValues.push(propHour)
        if (unit === "feelslike") {
             yValues.push(temperatureFToC(obj1[propHour][unit]))
        } else {
             yValues.push(obj1[propHour][unit])
        }
       

    }
    const chart = document.querySelector('#weather-display-day-chart');

    new Chart(chart, {
    type: 'line',
    data: {
    labels: xValues,
      datasets: [{
        backgroundColor: color1,
        borderColor: color2,
        label: label1,
        data: yValues,
        borderWidth: 3
      }]
    },
    options: {
      scales: {
        y: {
          stacked: true,
          min: 0,
          beginAtZero: true,
          ticks: {
            callback: function(value, index, ticks) {
                return '$' + value;
            }
          }
        }
      }
    }
  });
}

function loadWeather(daysAdditional) {
    let weekly = document.querySelector('.weather-display-daily')
    let hourly = document.querySelector('.weather-display-hourly')
    let day = document.querySelector('.weather-display-day')

    //Check if not current date

    //Clear UI
    weekly.querySelectorAll("[class*='info']").forEach(e => e.remove());
    hourly.querySelectorAll("[class*='info']").forEach(e => e.remove());
    day.querySelectorAll("[class*='info']").forEach(e => e.remove());

    DisplayWeather(daysPropsWeather, daysPropsUsed, weekly)
    DisplayWeather(hourPropsWeather, hourPropsUsed, hourly, daysAdditional)
    DisplayWeatherDay(dayPropsWeather, dayPropsUsed, day, 0)
    loadWeatherDayChart()
    AppendUnits()
}

function loadWeatherDayChart(e) {
    let newUnit = "feelslike";
    let color1 = "";
    let color2 = "";
    let label1 = "";

    try {
        if (e.target.classList.value.replace("chart-button-" , "")) {
            newUnit = e.target.classList.value.replace("chart-button-" , "")
        }
    } catch (error) {
    }

    console.log(newUnit);
    switch (newUnit) {
        case "feelslike":
            label1 = "Temperature (°C)";
            color1 = "rgba(255, 183, 0, 0.79)";
            color2 = "rgba(238, 255, 0, 1)";
            break;
        case "precip":
            label1 = "Rainfall (mm)";
            color1 = "rgba(0, 8, 255, 0.63)";
            color2 = "rgba(0, 242, 255, 0.75)";
            break;
        case "humidity":
            label1 = "Humidity (%)";
            color1 = "rgba(152, 213, 253, 0.63)";
            color2 = "rgba(0, 239, 252, 0.75))";
            break;
    }

    DisplayWeatherDayChart(hourPropsWeather, hourPropsUsed, newUnit, label1, color1, color2)
}

function handleDayClicked(e) {
    console.log("handleDayClicked running");
    if (e.target.classList[0].includes("weather-display-daily-info-") ) {
        let daysNum = e.target.classList[0]
        console.log(daysNum.replace("weather-display-daily-info-", ""));
        daysAdditional = daysNum.replace("weather-display-daily-info-", "")
        console.log(daysAdditional);

        setWeather(allWeather, daysAdditional)
        loadWeather(daysAdditional)
    }
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

            // Scaling factor
            const scrollSpeed = 0.04; // Adjust to control scrolling speed
            const scrollX = diffX * scrollSpeed;
            const scrollY = diffY * scrollSpeed;

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
    });
}

getWeather();
