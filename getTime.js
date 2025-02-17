function updateTime() {
    let now = new Date();
    let formattedTime = now.toLocaleTimeString(); 
    document.getElementById("timedisplay").textContent = Date();
}

setInterval(updateTime, 1000); // Update every second

