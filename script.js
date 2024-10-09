const ctx = document.getElementById('sensorChart').getContext('2d');
const sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Time labels
        datasets: [
            {
                label: 'Soil Moisture',
                data: [], // Soil moisture data
                borderColor: 'blue',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Rainfall',
                data: [], // Rainfall data
                borderColor: 'green',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Tilt',
                data: [], // Tilt data
                borderColor: 'red',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Vibration',
                data: [], // Vibration data
                borderColor: 'orange',
                borderWidth: 2,
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Sensor Values'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
                }
            }
        }
    }
});

// Initialize 3D scene for landslide simulation
function initScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('monitoring-area').appendChild(renderer.domElement);

    // Example terrain (replace with actual terrain model)
    const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    scene.add(terrain);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        terrain.rotation.z += 0.01; // Example animation
        renderer.render(scene, camera);
    }
    animate();
}

document.addEventListener('DOMContentLoaded', initScene);

// Update chart with simulated data
function updateChart(newData) {
    const timeNow = new Date().toLocaleTimeString();
    sensorChart.data.labels.push(timeNow);
    sensorChart.data.datasets[0].data.push(newData.soilMoisture);
    sensorChart.data.datasets[1].data.push(newData.rainfall);
    sensorChart.data.datasets[2].data.push(newData.tilt);
    sensorChart.data.datasets[3].data.push(newData.vibration);
    sensorChart.update();
}

// Simulate sensor values when button is clicked
document.getElementById('simulateBtn').addEventListener('click', () => {
    const soilMoisture = parseInt(document.getElementById('moistureSensor').value);
    const rainfall = parseInt(document.getElementById('rainSensor').value);
    const tilt = parseInt(document.getElementById('tiltSensor').value);
    const vibration = parseInt(document.getElementById('vibrationSensor').value);

    if (isNaN(soilMoisture) || isNaN(rainfall) || isNaN(tilt) || isNaN(vibration)) {
        alert('Please enter valid numerical values for all sensors.');
        return;
    }

    const simulatedData = { soilMoisture, rainfall, tilt, vibration };
    updateChart(simulatedData);
});

// Connect to Wi-Fi camera (mockup)
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        const video = document.getElementById('video');
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing camera: ', error);
    });

// Get user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('location').textContent = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    const locationText = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
    document.getElementById('location').textContent = locationText;
}

function showError(error) {
    let errorMessage;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred.";
            break;
    }
    document.getElementById('location').textContent = errorMessage;
}

// Call getLocation on page load
document.addEventListener('DOMContentLoaded', getLocation);
