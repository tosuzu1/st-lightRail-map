const getSituations_url = "get_situations"
const alertElement = document.querySelector("#Alert-card")

function updateSituations(url) {
    setInterval(async () => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        console.log(data[0].activeWindow);

        const alertElementh3 = document.querySelectorAll("#Alert-card h3")
        //const alertElementh2 = document.querySelectorAll("#Alert-card p")
        alertElementh3.forEach(ele => ele.remove());
        //alertElementh2.forEach(ele => ele.remove());

        data.forEach (ele => {
            const newh4 = document.createElement("h3");
            //newh4.textContent = `from : ${(new Date(ele.activeWindow.from)).toLocaleDateString("en-US", {timeZone: "America/Los_Angeles"})} to : ${(new Date(ele.activeWindow.to)).toLocaleDateString("en-US", {timeZone: "America/Los_Angeles"})} `;
            //const newp = document.createElement("p");
            newh4.textContent = "*  " + ele.description;
            newh4.classList.add("alert-info");

            //alertElement.appendChild(newh4);
            alertElement.appendChild(newh4);
        })
    }, 10000)
        
}

updateSituations(getSituations_url);