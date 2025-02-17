const northStations = document.querySelector("#north_stations");
const southStations = document.querySelector("#south_stations");

let northStationList 
const station_data = [
    'Lynnwood City Center',  '',
    'Mountlake Terrace',     '',
    'Shoreline North/185th', '',
    'Shoreline South/148th', '',
    'Northgate',             '',
    'Roosevelt',             '',
    'U District',            '',
    'Univ of Washington',    '',
    'Capitol Hill',          '',
    'Westlake',              '',
    'Symphony',              '',
    'Pioneer Square',        '',
    "Int'l Dist/Chinatown",  '',
    'Stadium',               '',
    'SODO',                  '',
    'Beacon Hill',           '',
    'Mount Baker',           '',
    'Columbia City',         '',
    'Othello',               '',
    'Rainier Beach',         '',
    "Tukwila Int'l Blvd",    '',
    'SeaTac/Airport',        '',
    'Angle Lake'
  ]
function generateNewNorthStation (data) {
    // remove all child inside 
    while(northStations.hasChildNodes()) {
        northStations.removeChild(northStations.firstChild);
    }

    for(let i = 0; i < data.length; i++) {
        const newDivStation = document.createElement("div");
        newDivStation.classList.add("station");
        newDivStation.id = `North_idx${i}`;

        const newDivStationName = document.createElement("div");
        newDivStationName.classList.add("station-name");
        newDivStationName.textContent = data[i];

        const newDivTrainStat = document.createElement("div");
        newDivTrainStat.classList.add("train-status");

        newDivStation.appendChild(newDivStationName);
        newDivStation.appendChild(newDivTrainStat);
        
        northStations.appendChild(newDivStation);
    }
}

//generateNewNorthStation(station_data);

function generateNewSouthStation (data) {
    // remove all child inside 
    while(southStations.hasChildNodes()) {
        southStations.removeChild(southStations.firstChild);
    }

    for(let i = 0; i < data.length; i++) {
        const newDivStation = document.createElement("div");
        newDivStation.classList.add("station");
        newDivStation.id = `South_idx${i}`;

        const newDivStationName = document.createElement("div");
        newDivStationName.classList.add("station-name");
        newDivStationName.textContent = data[i];

        const newDivTrainStat = document.createElement("div");
        newDivTrainStat.classList.add("train-status");

        newDivStation.appendChild(newDivStationName);
        newDivStation.appendChild(newDivTrainStat);
        
        southStations.appendChild(newDivStation);
    }
}

generateNewSouthStation(station_data);

const stopNorthlist_url = "getNorthStations"
async function getStationsN(url)  {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    northStationList  = data; 
    let northList = []
    for (let i = 0; i < northStationList.length; i++) {
        northList.push(northStationList[i]);
        if (i != northStationList.length - 1) {
            northList.push("");
        }
    }
    generateNewNorthStation(northList);
}
getStationsN(stopNorthlist_url);