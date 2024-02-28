/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */
['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
  document.getElementById('chart1').addEventListener(
      eventType,
      function (e) {
          let chart,
              point,
              i,
              event;

          for (i = 0; i < Highcharts.charts.length; i = i + 1) {
              chart = Highcharts.charts[i];
              // Find coordinates within the chart
              event = chart.pointer.normalize(e);
              // Get the hovered point
              point = chart.series[0].searchPoint(event, true);

              if (point) {
                  point.highlight(e);
              }
          }
      }
  );
});
['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
  document.getElementById('chart2').addEventListener(
      eventType,
      function (e) {
          let chart,
              point,
              i,
              event;

          for (i = 0; i < Highcharts.charts.length; i = i + 1) {
              chart = Highcharts.charts[i];
              // Find coordinates within the chart
              event = chart.pointer.normalize(e);
              // Get the hovered point
              point = chart.series[0].searchPoint(event, true);

              if (point) {
                  point.highlight(e);
              }
          }
      }
  );
});
['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
  document.getElementById('chart3').addEventListener(
      eventType,
      function (e) {
          let chart,
              point,
              i,
              event;

          for (i = 0; i < Highcharts.charts.length; i = i + 1) {
              chart = Highcharts.charts[i];
              // Find coordinates within the chart
              event = chart.pointer.normalize(e);
              // Get the hovered point
              point = chart.series[0].searchPoint(event, true);

              if (point) {
                  point.highlight(e);
              }
          }
      }
  );
});
/**
* Override the reset function, we don't need to hide the tooltips and
* crosshairs.
*/
Highcharts.Pointer.prototype.reset = function () {
  return undefined;
};

/**
* Highlight a point by showing tooltip, setting hover state and draw crosshair
*/
Highcharts.Point.prototype.highlight = function (event) {
  event = this.series.chart.pointer.normalize(event);
  this.onMouseOver(); // Show the hover marker
  this.series.chart.tooltip.refresh(this); // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

//Main body to collect and plot data
document.addEventListener('DOMContentLoaded', function () {
  // Fetch data from the JSON source
  fetch('https://services.swpc.noaa.gov/json/rtsw/rtsw_mag_1m.json')
  .then(response => response.json())
  .then(data => {
      // Filter data by 'active': true
      const activeData = data.filter(entry => entry.active === true);

      // Process data for the first chart
      const timeSeries1 = activeData.map(entry => [
          new Date(entry.time_tag).getTime(),
          entry.bt
      ]);

      // Process data for the second chart
      const timeSeries2 = activeData.map(entry => [
          new Date(entry.time_tag).getTime(),
          entry.bz_gse
      ]);

      // Process data for the third chart
      const timeSeries3 = activeData.map(entry => [
          new Date(entry.time_tag).getTime(),
          entry.phi_gse
      ]);       
      
      // BY CHART //
      //console.log('timeSeries1:', timeSeries1);
      
      var byAxisMax = Math.max(...timeSeries1.map(entry => entry[1])) + 2;
      console.log("Maximum by Value:", byAxisMax);

      Highcharts.chart('chart1', {
          chart: {
            type: 'spline',
            backgroundColor: '#212121',
            borderRadius: 8,
            plotBorderWidth: 0,
            syncId: 'syncGroup'
          },
          title: {
              text: 'bt',
              align: 'left'
          },
          legend: {
              enabled: false
          },
          xAxis: {
              type: 'datetime',
              crosshair: true,
              color: 'black',
              gridLineWidth: 0,
              labels: {
                  formatter: function () {
                      return Highcharts.dateFormat('%H:%M:%S', this.value);
                  }
              }
          },
          yAxis:{
              max: byAxisMax,
              gridLineWidth: 0.1
          },
          plotOptions: {
              area: {
                  fillColor: {
                      linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                      },
                      stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                      ],
                      'min': -20,
                      'max': 20

                  }
              }
          },
          series: [{
              type: 'area',
              name: 'bt',
              data: timeSeries1
          }],
          exporting: {
              enabled: false
          }
      });

      // BZ CHART //

      var bzAxisMax = 30;
      var bzAxisMin = -30;

      var lowerColor = 'red';
      var middleColor = '#212121FF';
      var upperColor = 'green'

      Highcharts.chart('chart2', {
          chart: {
            type: 'spline',
            backgroundColor: '#212121',
            borderRadius: 8,
            plotBorderWidth: 0,
            syncId: 'syncGroup'
          },
          title: {
              text: 'bz',
              align: 'left'
          },
          legend: {
              enabled: false
          },
          xAxis: {
              type: 'datetime',
              crosshair: true,
              labels: {
                  formatter: function () {
                      return Highcharts.dateFormat('%H:%M:%S', this.value);
                  }
              }
          },
          yAxis:{
              max: bzAxisMax,
              min: bzAxisMin,
              gridLineWidth: 0.1
          },
          plotOptions: {
              area: {
                  fillColor: {
                      linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                      },
                      stops: [
                      [0, upperColor],
                      [.5, middleColor],
                      [1, lowerColor]
                      ],

                  }
              }
          },
          series: [{
              type: 'area',
              name: 'bz',
              color: {
                  linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                  stops: [
                      [0, 'green'],
                      [0.5, '#212121CC'],
                      [1, 'red']
                  ],
              },
              data: timeSeries2,
              marker: {
                  radius: 5
              }
          }],
          exporting: {
              enabled: false
          }
      });

      // Create third chart with formatted time labels
      Highcharts.chart('chart3', {
          chart: {
            type: 'scatter',
            backgroundColor: '#212121',
            borderRadius: 8,
            plotBorderWidth: 0,
            syncId: 'syncGroup'
          },
          title: {
              text: 'phi',
              align: 'left'
          },
          legend: {
              enabled: false
          },
          xAxis: {
              type: 'datetime',
              crosshair: true,
              color: 'black',
              gridLineWidth: 0,
              labels: {
                  formatter: function () {
                      return Highcharts.dateFormat('%H:%M:%S', this.value);
                  }
              }
          },
          yAxis:{
              gridLineWidth: 0.1
          },
          plotOptions: {
              area: {
                  fillColor: {
                      linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                      },
                      stops: [
                      [0, Highcharts.getOptions().colors[4]],
                      [1, Highcharts.color(Highcharts.getOptions().colors[4]).setOpacity(0).get('rgba')]
                      ],
                      'min': -20,
                      'max': 20

                  }
              }
          },
          series: [{
              //type: 'area',
              name: 'bt',
              data: timeSeries3,
              marker: {
                  radius: 1
              }
          }],
          exporting: {
              enabled: false
          }
      });
  })
  .catch(error => {
      console.error('Error fetching data:', error);
  });
});
