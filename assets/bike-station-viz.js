// 3D Visualization Functions using Three.js
let sceneBS, cameraBS, rendererBS, controlsBS;
let bikeStations = [];
let bikeRoutes = [];
let animationId = null;

function init3DVisualization() {
    // Scene setup
    sceneBS = new THREE.Scene();
    sceneBS.background = new THREE.Color(0x0a0a0a);

    // Camera setup
    cameraBS = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraBS.position.set(0, 5, 10);

    // Renderer setup
    rendererBS = new THREE.WebGLRenderer({ antialias: true });
    rendererBS.setSize(window.innerWidth, window.innerHeight);
    rendererBS.shadowMap.enabled = true;
    rendererBS.shadowMap.type = THREE.PCFSoftShadowMap;

    // Controls setup
    controlsBS = new THREE.OrbitControls(cameraBS, rendererBS.domElement);
    controlsBS.enableDamping = true;
    controlsBS.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    sceneBS.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    sceneBS.add(directionalLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    sceneBS.add(ground);

    // Create bike stations
    createBikeStations();

    // Create bike routes
    createBikeRoutes();

    // Add to DOM
    const container = document.getElementById('3d-visualization');
    if (container) {
        container.appendChild(renderer.domElement);
        animate();
    }
}

function createBikeStations() {
    // Sample station data - in real app, this would come from API
    const stations = [
        { id: 1, name: 'Clark/Lake', lat: 41.8857, lng: -87.6319, capacity: 31, bikes: 15 },
        { id: 2, name: 'State/Lake', lat: 41.8858, lng: -87.6278, capacity: 27, bikes: 12 },
        { id: 3, name: 'Michigan/Lake', lat: 41.8860, lng: -87.6244, capacity: 23, bikes: 8 },
        { id: 4, name: 'Millennium Park', lat: 41.8821, lng: -87.6223, capacity: 35, bikes: 22 },
        { id: 5, name: 'Theater District', lat: 41.8784, lng: -87.6258, capacity: 19, bikes: 6 }
    ];

    stations.forEach(station => {
        // Convert lat/lng to 3D coordinates (simplified)
        const x = (station.lng + 87.63) * 1000;
        const z = (station.lat - 41.88) * 1000;
        const y = 0;

        // Station base
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x34495e });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(x, y, z);
        base.castShadow = true;
        base.receiveShadow = true;
        sceneBS.add(base);

        // Station pole
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x7f8c8d });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(x, y + 1, z);
        pole.castShadow = true;
        sceneBS.add(pole);

        // Bike availability indicator
        const availabilityRatio = station.bikes / station.capacity;
        let indicatorColor;
        if (availabilityRatio > 0.5) {
            indicatorColor = 0x27ae60; // Green
        } else if (availabilityRatio > 0.2) {
            indicatorColor = 0xf39c12; // Orange
        } else {
            indicatorColor = 0xe74c3c; // Red
        }

        const indicatorGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const indicatorMaterial = new THREE.MeshLambertMaterial({ color: indicatorColor });
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.position.set(x, y + 2.2, z);
        sceneBS.add(indicator);

        // Station label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        context.font = 'Bold 20px Arial';
        context.fillStyle = 'rgba(255,255,255,1)';
        context.fillText(station.name, 10, 30);
        context.fillText(`Bikes: ${station.bikes}/${station.capacity}`, 10, 60);

        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const label = new THREE.Sprite(labelMaterial);
        label.position.set(x, y + 3, z);
        label.scale.set(2, 1, 1);
        sceneBS.add(label);

        bikeStations.push({
            id: station.id,
            position: new THREE.Vector3(x, y, z),
            capacity: station.capacity,
            bikes: station.bikes,
            base: base,
            pole: pole,
            indicator: indicator,
            label: label
        });
    });
}

function createBikeRoutes() {
    // Sample route data - in real app, this would come from API
    const routes = [
        { from: 1, to: 2, intensity: 0.8 },
        { from: 1, to: 4, intensity: 0.6 },
        { from: 2, to: 3, intensity: 0.7 },
        { from: 3, to: 4, intensity: 0.5 },
        { from: 4, to: 5, intensity: 0.4 }
    ];

    routes.forEach(route => {
        const fromStation = bikeStations.find(s => s.id === route.from);
        const toStation = bikeStations.find(s => s.id === route.to);

        if (fromStation && toStation) {
            // Create curved line between stations
            const points = [];
            const startPoint = fromStation.position.clone();
            const endPoint = toStation.position.clone();
            const midPoint = startPoint.clone().add(endPoint).multiplyScalar(0.5);
            midPoint.y += 1; // Arc up

            // Quadratic Bezier curve
            for (let t = 0; t <= 1; t += 0.02) {
                const point = new THREE.Vector3();
                point.x = (1 - t) * (1 - t) * startPoint.x + 2 * (1 - t) * t * midPoint.x + t * t * endPoint.x;
                point.y = (1 - t) * (1 - t) * startPoint.y + 2 * (1 - t) * t * midPoint.y + t * t * endPoint.y;
                point.z = (1 - t) * (1 - t) * startPoint.z + 2 * (1 - t) * t * midPoint.z + t * t * endPoint.z;
                points.push(point);
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(0.6, 1, 0.5),
                opacity: route.intensity * 0.8,
                transparent: true
            });
            const line = new THREE.Line(geometry, material);
            sceneBS.add(line);

            bikeRoutes.push({
                from: route.from,
                to: route.to,
                line: line,
                intensity: route.intensity
            });
        }
    });
}

function animate() {
    animationId = requestAnimationFrame(animate);

    // Update controls
    controlsBS.update();

    // Animate bike availability (simulate real-time updates)
    bikeStations.forEach(station => {
        // Slight random variation in bike counts
        const variation = (Math.random() - 0.5) * 2;
        const newBikes = Math.max(0, Math.min(station.capacity, station.bikes + variation));

        if (newBikes !== station.bikes) {
            station.bikes = Math.round(newBikes);

            // Update indicator color
            const availabilityRatio = station.bikes / station.capacity;
            let indicatorColor;
            if (availabilityRatio > 0.5) {
                indicatorColor = 0x27ae60;
            } else if (availabilityRatio > 0.2) {
                indicatorColor = 0xf39c12;
            } else {
                indicatorColor = 0xe74c3c;
            }
            station.indicator.material.color.setHex(indicatorColor);

            // Update label
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 128;
            context.font = 'Bold 20px Arial';
            context.fillStyle = 'rgba(255,255,255,1)';
            context.fillText(station.name, 10, 30);
            context.fillText(`Bikes: ${station.bikes}/${station.capacity}`, 10, 60);

            station.label.material.map = new THREE.CanvasTexture(canvas);
            station.label.material.map.needsUpdate = true;
        }
    });

    // Animate routes (pulse effect)
    const time = Date.now() * 0.001;
    bikeRoutes.forEach(route => {
        const opacity = 0.3 + 0.5 * Math.sin(time + route.from) * route.intensity;
        route.line.material.opacity = opacity;
    });

    rendererBS.render(sceneBS, cameraBS);
}

function update3DVisualization() {
    // Update visualization based on current filters
    // This would typically fetch new data and update the scene
    console.log('Updating 3D visualization with filters:', currentFilters);
}

function cleanup3DVisualization() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (renderer) {
        renderer.dispose();
    }

    // Clear scene
    while(sceneBS.children.length > 0){
        sceneBS.remove(sceneBS.children[0]);
    }

    bikeStations = [];
    bikeRoutes = [];
}

function resize3DVisualization() {
    if (cameraBS && rendererBS) {
        cameraBS.aspect = window.innerWidth / window.innerHeight;
        cameraBS.updateProjectionMatrix();
        rendererBS.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize 3D visualization when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the page with 3D visualization
    const vizContainer = document.getElementById('3d-visualization');
    if (vizContainer) {
        init3DVisualization();

        // Handle window resize
        window.addEventListener('resize', resize3DVisualization);
    }
});