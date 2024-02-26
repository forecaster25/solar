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
    const times = jsonData
        .filter(entry => entry.energy === '0.1-0.8nm')
        .map(entry => new Date(entry.time_tag));
    const flux = jsonData
        .filter(entry => entry.energy === '0.1-0.8nm')
        .map(entry => entry.flux);

    const traceLine = {
        x: times,
        y: flux,
        mode: 'lines',
        line: { color: 'black', width: 1 },
        name: 'Flux Trend',
    };

    const traceDots = {
        x: times,
        y: flux,
        mode: 'markers',
        marker: { size: 5, color: flux, colorscale: 'hot', cmin: Math.min(...flux), cmax: Math.max(...flux), colorbar: { title: 'Flux Class', tickvals: [-6, -5, -4], ticktext: ['C', 'M', 'X'] } },
        name: 'Flux Dots',
    };

    const layout = {
        title: 'GOES X-ray Flux',
        xaxis: {
            title: 'Time (UTC)',
            tickmode: 'array',
            tickvals: times.filter(time => time.getUTCMinutes() % 30 === 0),
            ticktext: times.filter(time => time.getUTCMinutes() % 30 === 0).map(time => time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })),
            tickangle: -45,
        },
        yaxis: { title: 'Flux Class', type: 'log' },
        shapes: times.filter(time => time.getUTCMinutes() % 30 === 0).map(time => ({ type: 'line', xref: 'x', yref: 'y', x0: time, x1: time, y0: Math.min(...flux), y1: Math.max(...flux), line: { color: 'lightgrey', width: 0.5 } })),
        annotations: [{
            x: times[times.length - 1],
            y: Math.max(...flux),
            xref: 'x',
            yref: 'y',
            text: `Last Updated Time: ${times[times.length - 1].toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'UTC' })}\nCurrent Flux: ${fluxLabel(flux[flux.length - 1])}`,
            showarrow: false,
            xanchor: 'right',
            yanchor: 'top',
            font: { size: 10, color: 'red' },
        }],
        images: [{
            source: 'solar_xray_flux_plot.png',
            x: times[0],
            y: Math.max(...flux),
            sizex: times[times.length - 1] - times[0],
            sizey: Math.max(...flux) - Math.min(...flux),
            xref: 'x',
            yref: 'y',
            opacity: 0.5,
            layer: 'above',
        }],
    };

    Plotly.newPlot(plotContainer, [traceLine, traceDots], layout);
}

function fluxLabel(fluxValue) {
    if (fluxValue > 1e-4) {
        return `X ${fluxValue * 10000.0}`;
    } else if (fluxValue > 1e-5) {
        return `M ${fluxValue * 100000.0}`;
    } else if (fluxValue > 1e-6) {
        return `C ${fluxValue * 1000000.0}`;
    } else {
        return '';
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
