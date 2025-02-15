async function printJSON() {
    const response = await fetch("./api_key/api_key.json");
    const json = await response.json();
    console.log(json);
}

printJSON();