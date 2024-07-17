const weatherIconsData = {
    "clear": {
        "code": [1000],
        "image": "sun.png"
    },
    "cloudy": {
        "code": [1003, 1006, 1009],
        "image": "cloudy.png"
    },
    "fog": {
        "code": [1030, 1135, 1147],
        "image": "fog.png"
    },
    "lightRain": {
        "code": [1063, 1150, 1153, 1180, 1183, 1240, 1186, 1189, 1243, 1273],
        "image": "rainy.png"
    },
    "heavyRain": {
        "code": [1192, 1195, 1246, 1276],
        "image": "rainy_heavy.png"
    },
    "freezingRain": {
        "code": [1072, 1168, 1171, 1198, 1201, 1237, 1261, 1264],
        "image": "hail.png"
    },
    "snow": {
        "code": [1066, 1210, 1213, 1255, 1279, 1216, 1219, 1258, 1282, 1222, 1225],
        "image": "snowy.png"
    },
    "sleet": {
        "code": [1069, 1204, 1207, 1249, 1252],
        "image": "rainy_snow.png"
    },
    "thunder": {
        "code": [1087, 1273, 1276, 1279, 1282],
        "image": "storm.png"
    },
}

function getWeatherIcon(code) {
    let icon = "unknown.png";

    for (let category in weatherIconsData) {
        if (weatherIconsData.hasOwnProperty(category)) {
            if (weatherIconsData[category].code.includes(code)) {
                icon = weatherIconsData[category].image;
                break;
            }
        }
    }

    return icon;
}