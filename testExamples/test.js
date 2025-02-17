const fs = require('fs');
let json = JSON.parse(fs.readFileSync('./example.json', 'utf8'));
let json1 = JSON.parse(fs.readFileSync('./stopexample.json', 'utf8'));
let HOME_STATION_SOUTHBOUND = "40_990005"
let HOME_STATION_NORTHBOUND = "40_990006"

require('dotenv').config();
const apiKey = process.env.API_KEY;

// json.data.list.forEach((element, key) => {
//     console.log(element);
//     console.log(key);
// });

// UniversityStudent class declaration
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

        console.log(data);
        // json.data.references.trips.forEach((element) => {
        //     console.log(element.directionId);
        // })

    }

    create_train_index(json) {
        let stops = json1.data.references.stops
        let list = json1.data.entry.stopGroupings[0].stopGroups[0].stopIds;
        let unfilterList = list.map(ele => stops.find(e => ele === e.id).name);
        let filterList = [...new Set(unfilterList)];
        let returnList = []
        for (let i = 0; i < filterList.length; i++) {
            returnList.push(filterList[i]);
            if (i != filterList.length - 1) {
                returnList.push("");
            }
        }
        console.log(returnList);
    }

    get_tripId(json) {
        return json.data.list.map((element) => {
            return element.tripId
        })
    }

    get_nextStop(jsonObj) {
        const stops = json.data.references.stops;
        json.data.list.forEach((element) => {
            console.log(stops.find((ele) => ele.id === element.status.nextStop).name);
        })
    }

    get_time_till_nextStop(jsonObj) {
        

        json.data.list.forEach((element) => {
            // console.log(Math.max(element.status.nextStopTimeOffset - (timestamp - element.status.lastUpdateTime), 0));
            // console.log(timestamp - element.status.lastUpdateTime);
            console.log(element.status.nextStopTimeOffset); // most likely time in second till next stop
        })
    }

    get_direction(json) {
        json.data.references.trips.forEach((element) => {
            console.log(element.directionId);
        })
    }

    get_schedule(json, station_id) {
        let now = new Date();
        let jsonObj = []
        let serTime = json.data.list[0].serviceDate;
        json.data.list.forEach((element) => {
            jsonObj.push(element.schedule.stopTimes.filter(e => e.stopId === station_id)[0]);
        })
        console.log(serTime);
        jsonObj =jsonObj.filter(e => e != undefined);
        let arrivalTime = []
        console.log(jsonObj.map(ele => ele.arrivalTime + serTime));
        jsonObj.map(ele => ele.arrivalTime + serTime).forEach(e => {
            let newTime = new Date(e);
            
            console.log((newTime - now).toString());
            console.log(`${newTime.getHours()}:${newTime.getMinutes()}`);
        })
        //console.log(jsonObj)
    }

    get_orderStationList(json1, direction) {
        console.log(direction);
        let stops = json1.data.references.stops
        let list = json1.data.entry.stopGroupings[0].stopGroups[direction].stopIds;
        let unfilterList = list.map(ele => stops.find(e => ele === e.id).name);
        let filered_list = [...new Set(unfilterList)];
        let dict = {}
        for (let i = 0; i < filered_list.length; i++) {
            dict[filered_list[i]] = i * 2;
        }
        return dict
        //console.log(stops)
    }

    get_situations(json) {
        let return_array = []
        json.data.references.situations.forEach(ele => {
            let tempObj = {
                activeWindow : "",
                description : ""
            }
            //console.log(ele.description.value);
            tempObj.activeWindow = ele.activeWindow
            
            if (!("description" in ele)) {
                //no description given, use summary
                tempObj.description = ele.summary.value;
            } else {
                tempObj.description = ele.description.value;
            }
            return_array.append(tempObj);
        })
        return return_array;
    }
};

let train = new Train();
train.get_orderStationList(json1, 1);

console.log(train.get_tripId(json));
train.get_nextStop(json);
train.get_time_till_nextStop(json);

let now = new Date();
let timestamp = now.getTime();
console.log(timestamp); // Milliseconds since epoch
train.get_direction(json);
train.get_schedule(json, HOME_STATION_NORTHBOUND);
train.get_schedule(json, HOME_STATION_SOUTHBOUND);
train.get_situations(json);
train.create_train_index(json);
train.get_data(json);

const trip_url = `https://api.pugetsound.onebusaway.org/api/where/trips-for-route/40_100479.json?key=${apiKey}`;
const stop_url = `https://api.pugetsound.onebusaway.org/api/where/stops-for-route/40_100479.json?key=${apiKey}`;

async function fetchData() {
    try {
      const response = await fetch(trip_url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchData2() {
    try {
      const response = await fetch(stop_url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  //fetchData().then(data => console.log(data.data.list));
  //fetchData().then(data => train.get_data(data));
  fetchData2().then(data => console.log(train.get_orderStationList(data, 1)));
  fetchData2().then(data => console.log(train.get_orderStationList(data, 0)));
  console.log(new Date(timestamp).toString()); // Milliseconds since epoch