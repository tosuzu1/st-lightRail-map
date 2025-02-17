// async function fetchData() {
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
// }

const url = "getTrain";
const stopNorth_url = "getNorthStationsDict"
const stopSouth_url = "getSouthStationsDict"
let trainData, northStationData, southStationData
//const northStations = document.querySelector("#north_stations");
//console.log(northStations);

// direction = 0 then its south, otherwise 1 = north
function updateTag(data) {
    const allNstation = document.querySelectorAll("#north_station .train-status");
    allNstation.forEach(ele => ele.classList.remove("train-present"));
    //classList.remove("train-present"); 
    const allSstation = document.querySelectorAll("#south_station .train-status");
    allSstation.forEach(ele => ele.classList.remove("train-present"));

    data.forEach(element => {
        if (element.direction === '1') {
            let idx = northStationData[element.next_stop];
            if (element.time_until > 60) {
                const curStation= document.querySelector(`#North_idx${Math.max(idx - 1, 0)} .train-status`);
                curStation.classList.add("train-present");
            } else {
                const curStation= document.querySelector(`#North_idx${idx} .train-status`);
                curStation.classList.add("train-present");
            }
        } else {
            let idx = southStationData[element.next_stop];
            if (element.time_until > 60) {
                const curStation= document.querySelector(`#South_idx${Math.max(idx - 1, 0)} .train-status`);
                curStation.classList.add("train-present");
            } else {
                const curStation= document.querySelector(`#South_idx${idx} .train-status`);
                curStation.classList.add("train-present");
            }
        }
    });
}

function logAPI(url) {
    setInterval(async () => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        updateTag(data);
        trainData = data;
    }, 10000);
}

logAPI(url);

async function getStationsN(url)  {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    northStationData = data; 
}

getStationsN(stopNorth_url);

async function getStationsS(url)  {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    southStationData = data; 
}

getStationsS(stopSouth_url);