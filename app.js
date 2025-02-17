const express = require("express");
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(express.json());

// These are our station ID for our home station
const HOME_STATION_SOUTHBOUND = "40_990005"
const HOME_STATION_NORTHBOUND = "40_990006"

// information about server
const PORT = 1234;
const apiKey = process.env.API_KEY;

// store json data
let train_jsonData, stop_jsonData

class Train {
    constructor() {
    }

    get_data(json) {
        let data = []
        let now = new Date();
        let timestamp = now.getTime();

        // get all trip id
        let tripid_list = this.get_tripId(json);
        // some tripid are dupe, filter for uniques
        tripid_list = [...new Set(tripid_list)];

        // create a array of object  for our train data
        tripid_list.forEach(ele => {
            let tempdata = {
                id : "",
                direction : "",
                next_stop : "",
                time_until : "",
                nextStopTimeOffset : "",
                staleness : 0,
                lastUpdateTime : ""
            }
    
            tempdata.id = ele;
            data.push(tempdata);
        });

        // fill in data
        data.forEach(ele => {
            ele.direction = json.data.references.trips.find(e => e.id === ele.id).directionId;
            let id_to_status = json.data.list.find(e => ele.id === e.tripId).status;
            ele.next_stop = json.data.references.stops.find(e => e.id === id_to_status.nextStop).name;
            let staleness = timestamp / 1000 - id_to_status.lastUpdateTime / 1000;
            ele.lastUpdateTime = new Date(id_to_status.lastUpdateTime).toString();
            ele.time_until = Math.max(id_to_status.nextStopTimeOffset - staleness, 0);
            ele.nextStopTimeOffset = id_to_status.nextStopTimeOffset;
            ele.staleness = staleness;
        })

        //console.log(data);
        return data;
    }

    get_tripId(json) {
        // return all possible tripID
        return json.data.list.map((element) => {
            return element.tripId
        })
    }

    get_schedule(json, station_id) {
        let jsonObj = []
        let serviceTime = json.data.list[0].serviceDate;
        // get train schdule for station id from each trip
        json.data.list.forEach((element) => {
            jsonObj.push(element.schedule.stopTimes.filter(e => e.stopId === station_id)[0]);
        })

        // some are undefine because they pass the station already, filter them out
        jsonObj =jsonObj.filter(e => e != undefined);

        // arrival time is in second, so we need to convert to millisecond for JS time
        return jsonObj.map(ele => (ele.arrivalTime * 1000) + serviceTime)
    }

    get_orderStationList(json1, direction) {
        // return orderList of station, 0 = southbound, 1 = northbound
        let stops = json1.data.references.stops
        let list = json1.data.entry.stopGroupings[0].stopGroups[direction].stopIds;
        let unfilterList = list.map(ele => stops.find(e => ele === e.id).name);
        return [...new Set(unfilterList)];
    }

    get_orderStationDict(json1, direction) {
        // like list of station but return a index, useful to find the index we need to write to
        let stops = json1.data.references.stops
        let list = json1.data.entry.stopGroupings[0].stopGroups[direction].stopIds;
        let unfilterList = list.map(ele => stops.find(e => ele === e.id).name);
        let filered_list = [...new Set(unfilterList)];
        let dict = {}
        for (let i = 0; i < filered_list.length; i++) {
            dict[filered_list[i]] = i * 2;
        }
        return dict
    }

    get_situations(json) {
        // return list of situations
        let return_array = []
        json.data.references.situations.forEach(ele => {
            let tempObj = {
                activeWindow : {},
                description : ""
            }
            tempObj.activeWindow = ele.activeWindows[0]
            
            // maybe we just want summary as descript are very long
            // if (!("description" in ele)) {
            //     //no description given, use summary
            //     tempObj.description = ele.summary.value;
            // } else {
            //     tempObj.description = ele.description.value;
            // }
            tempObj.description = ele.summary.value;
            return_array.push(tempObj);
        })
        //console.log(return_array);
        return return_array;
    }
}

// all API
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
    });

// station dict
app.get("/getNorthStationsDict", (request, response) => {
    response.send(trainProcessor.get_orderStationDict(stop_jsonData, 1));
    });

app.get("/getSouthStationsDict", (request, response) => {
    response.send(trainProcessor.get_orderStationDict(stop_jsonData, 0));
    });

 // station list
app.get("/getNorthStations", (request, response) => {
    
    response.send(trainProcessor.get_orderStationList(stop_jsonData, 1));
    });

app.get("/getSouthStations", (request, response) => {
    response.send(trainProcessor.get_orderStationList(stop_jsonData, 0));
    });

// return trains 
app.get("/getTrain", (request, response) => {
    response.send(trainProcessor.get_data(train_jsonData));
 });

// server html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

app.get('/style.css', function(req, res) {
    res.sendFile(path.join(__dirname, '/style.css'));
});

app.get('/getTime.js', function(req, res) {
    res.sendFile(path.join(__dirname, '/getTime.js'));
});

app.get('/getLocalJson.js', function(req, res) {
    res.sendFile(path.join(__dirname, '/getLocalJson.js'));
});

app.get('/getSchedule.js', function(req, res) {
    res.sendFile(path.join(__dirname, '/getSchedule.js'));
});

app.get('/generateStations.js', function(req, res) {
    res.sendFile(path.join(__dirname, '//generateStations.js'));
});

app.get('/getSituations.js' , function(req, res) {
    res.sendFile(path.join(__dirname, '/getSituations.js'));
});

// server train schedule
app.get('/get_scheduleNorth', function(req, res) {
    res.send(trainProcessor.get_schedule(train_jsonData, HOME_STATION_NORTHBOUND));
});

app.get('/get_scheduleSouth', function(req, res) {
    res.send(trainProcessor.get_schedule(train_jsonData, HOME_STATION_SOUTHBOUND));
});

// serve situations
app.get('/get_situations', function(req, res) {
    res.send(trainProcessor.get_situations(train_jsonData));
});


console.log("running");

const trip_url = `https://api.pugetsound.onebusaway.org/api/where/trips-for-route/40_100479.json?key=${apiKey}`;
const stop_url = `https://api.pugetsound.onebusaway.org/api/where/stops-for-route/40_100479.json?key=${apiKey}`;

// first time fetching data
async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}
  
//first time to fetch data
fetchData(trip_url)
  .then(data => train_jsonData = data)
  .catch(error => console.error(error));

fetchData(stop_url)
  .then(data =>  stop_jsonData = data)
  .catch(error => console.error(error));
const trainProcessor = new Train();

// set interval every 15 for trip and minutes for station info
function updateTraininfo(url) {
    setInterval(async () => {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            return 0;
        }
        const data = await response.json();
        train_jsonData = data
    }, 30000);
}

function updateStationinfo(url) {
    setInterval(async () => {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            return 0;
        }
        const data = await response.json();
        stop_jsonData = data
    }, 60000);
}

updateTraininfo(trip_url);
updateStationinfo(stop_url);