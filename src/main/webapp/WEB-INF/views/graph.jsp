<!--<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>2D Graph with Zoom</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom"></script>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 80vh;
                margin: 0;
                background-color: #f0f0f0;
            }
            #myChart {
                width: 80vw;
                height: 80vh;
            }
        </style>
    </head>
    <body>
        <canvas id="myChart"></canvas>
        <script>
            // Sample data for the chart
            const data = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                        label: 'My Dataset',
                        data: [10, 20, 15, 25, 30, 35, 40,50],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1
                    }]
            };

            // Chart configuration
            const config = {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        zoom: {
                            zoom: {
                                wheel: {
                                    enabled: true,
                                    speed: 0.1
                                },
                                pinch: {
                                    enabled: true,
                                    threshold: 2
                                },
                                drag: {
                                    enabled: true
                                },
                                mode: 'xy' // 'x' for x-axis only, 'y' for y-axis only, 'xy' for both axes
                            },
                            pan: {
                                enabled: true,
                                mode: 'xy'
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            };

            // Create the chart
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, config);
        </script>
    </body>
</html>-->


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Height Graph</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom"></script>
    </head>
    <body>
        <div style="width: 80%; margin: 0 auto;">
            <canvas id="heightChart"></canvas>
        </div>
        <script>
            const data = {
                labels: ['9.9 m', '10.0 m', '10.1 m', '10.2 m', '10.3 m', '10.4 m', '10.5 m', '10.6 m', '10.7 m', '10.8 m'],
                datasets: [
                    {
                        label: 'Height Profile',
                        data: [122.7, 122.75, 122.76, 122.8, 122.9, 122.85, 122.8, 122.78, 122.76, 122.75],
                        segment: {
                            borderColor: ctx => {
                                const currentHeight = ctx.p1.parsed.y;
                                if (currentHeight < 122.75)
                                    return 'red';
                                if (currentHeight < 122.8)
                                    return 'pink';
                                if (currentHeight < 122.85)
                                    return 'green';
                                return 'blue';
                            }
                        },
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Max Height',
                        data: [122.95, 122.95, 122.95, 122.95, 122.95, 122.95, 122.95, 122.95, 122.95, 122.95],
                        borderColor: 'rgba(128, 0, 128, 1)', // Purple color for max height
                        backgroundColor: 'rgba(128, 0, 128, 0.1)',
                        fill: false,
                        borderDash: [5, 5], // Dashed line for max height
                        tension: 0
                    }
                ]
            };

// Configuring the chart with zoom functionality
            const config = {
                type: 'line',
                data: data,
                options: {
                    scales: {
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                text: 'Height (m)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Distance (m)'
                            }
                        }
                    },
                    plugins: {
                        zoom: {
                            pan: {
                                enabled: true,
                                mode: 'xy',
                                speed: 10,
                            },
                            zoom: {
                                wheel: {
                                    enabled: true,
                                },
                                pinch: {
                                    enabled: true
                                },
                                mode: 'xy',
                            }
                        }
                    }
                }
            };

// Initializing the chart
            const ctx = document.getElementById('heightChart').getContext('2d');
            const heightChart = new Chart(ctx, config);

        </script>
    </body>
</html>

