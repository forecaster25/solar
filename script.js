// Add your JavaScript code here
const jsonUrl = 'https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json';
const plotContainer = document.getElementById('plot-container');

function fetchJsonFromWeb(url) {
    return axios.get(url)
        .then(response => response.data)
        .catch(error => {
            console.error(`Failed to fetch JSON. Error: ${error}`);
            return null;
        });
}

function plotXrayData(jsonData) {
    // Use Plotly or any other charting library to plot the data
    // Example using Plotly:
    const times = jsonData.map(entry => new Date(entry.time_tag));
    const flux = jsonData
        .filter(entry => entry.energy === '0.1-0.8nm')
        .map(entry => entry.flux);

    const trace = {
        x: times,
        y: flux,
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: 'black' },
    };

    const layout = {
        title: 'GOES X-ray Flux',
        xaxis: { title: 'Time (UTC)' },
        yaxis: { title: 'Flux Class', type: 'log' },
    };

    Plotly.newPlot(plotContainer, [trace], layout);
}

function playAlertSound(jsonData) {
    const flux = jsonData
        .filter(entry => entry.energy === '0.1-0.8nm')
        .map(entry => entry.flux);
    
    const currentFlux = flux[flux.length - 1];
    const previousFlux = flux[flux.length - 2];

    if (1e-5 < currentFlux < 1e-4 && !(previousFlux > 1e-5)) {
        console.log('Moderate Flare Ongoing.');
        // Add code to play tone_4
    } else if (currentFlux > 1e-4 && !(previousFlux > 1e-4)) {
        console.log('Major Flare Ongoing.');
        // Add code to play tone_3
    }
}

function fetchDataAndPlot() {
    fetchJsonFromWeb(jsonUrl)
        .then(jsonData => {
            if (jsonData) {
                playAlertSound(jsonData);
                plotXrayData(jsonData);
            }
        })
        .catch(error => console.error(`Error: ${error}`))
        .finally(() => setTimeout(fetchDataAndPlot, 15000)); // Fetch and update every 15 seconds
}

// Initial call to start the process
fetchDataAndPlot();
