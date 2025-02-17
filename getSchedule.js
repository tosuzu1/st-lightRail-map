const northInbound = document.querySelector("#inbound_north");
const southInbound = document.querySelector("#inbound_south");

northBound_url = "get_scheduleNorth"
southBound_url = "get_scheduleSouth"

async function updateInbound(url)  {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    let now = new Date();

    // clear previous schdule
    const northInboundH3 = document.querySelectorAll("#inbound_north h3");
    northInboundH3.forEach(element => element.remove());
    
    let newdata = [...new Set(data)]; // some tripID are dupes, filter for unique time
    newdata.sort();
    newdata.forEach(element => {
        let newTime = new Date(element);
        let diffTime = newTime.valueOf() - now.valueOf();
        console.log(newTime.toString());
        console.log(`diff = ${diffTime }, diffH = ${Math.floor(diffTime / 1000 / 60 / 60)} diffM = ${Math.floor(diffTime / 1000 / 60) % 60}`);

        
        if  (diffTime > 60000) {
            const newTraininfo_h3 = document.createElement("h3");
            // if minute away
            newTraininfo_h3.textContent = `${String(Math.floor(diffTime / 1000 / 60 / 60)).padStart(2,'0')}:${String(Math.floor(diffTime / 1000 / 60) % 60).padStart(2,'0')}`;
            northInbound.appendChild(newTraininfo_h3);
        } else if (diffTime > - 60000) {
            // arrived now
            const newTraininfo_h3 = document.createElement("h3");
            newTraininfo_h3.textContent = `Now`;
            northInbound.appendChild(newTraininfo_h3);
        }
       
        

    });
}

updateInbound(northBound_url);

function updateNorthInbound(url) {
    setInterval(async () => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let now = new Date();

        // clear previous schdule
        const northInboundH3 = document.querySelectorAll("#inbound_north h3");
        northInboundH3.forEach(element => element.remove());

        let newdata = [...new Set(data)]; // some tripID are dupes, filter for unique time
        newdata.sort();
        newdata.forEach(element => {
            let newTime = new Date(element);
            let diffTime = newTime.valueOf() - now.valueOf();

            if  (diffTime > 60000) {
                const newTraininfo_h3 = document.createElement("h3");
                // if minute away
                newTraininfo_h3.textContent = `${String(Math.floor(diffTime / 1000 / 60 / 60)).padStart(2,'0')}:${String(Math.floor(diffTime / 1000 / 60) % 60).padStart(2,'0')}`;
                northInbound.appendChild(newTraininfo_h3);
            } else if (diffTime > - 60000) {
                // arrived now
                const newTraininfo_h3 = document.createElement("h3");
                newTraininfo_h3.textContent = `Now`;
                northInbound.appendChild(newTraininfo_h3);
            }
       
        }) 
    }, 10000)};

updateNorthInbound(northBound_url);

function updateSouthInbound(url) {
    setInterval(async () => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let now = new Date();

        // clear previous schdule
        const southInboundH3 = document.querySelectorAll("#inbound_south h3");
        southInboundH3.forEach(element => element.remove());

        let newdata = [...new Set(data)]; // some tripID are dupes, filter for unique time
        newdata.sort();
        newdata.forEach(element => {
            let newTime = new Date(element);
            let diffTime = newTime.valueOf() - now.valueOf();

            if  (diffTime > 60000) {
                const newTraininfo_h3 = document.createElement("h3");
                // if minute away
                newTraininfo_h3.textContent = `${String(Math.floor(diffTime / 1000 / 60 / 60)).padStart(2,'0')}:${String(Math.floor(diffTime / 1000 / 60) % 60).padStart(2,'0')}`;
                southInbound.appendChild(newTraininfo_h3);
            } else if (diffTime > - 60000) {
                // arrived now
                const newTraininfo_h3 = document.createElement("h3");
                newTraininfo_h3.textContent = `Now`;
                southInbound.appendChild(newTraininfo_h3);
            }
       
        }) 
    }, 10000)};


updateSouthInbound(southBound_url);