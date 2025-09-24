// Chart Functions and Data
// Data is defined in index.html

    // Dashboard Functions
    // Variables are defined globally in index.html

    /**
     * Shows loading state for a chart container
     * @param {string} chartId - The ID of the chart container
     * @param {string} message - The loading message to display
     */
    function showLoading(chartId, message = 'Loading chart...') {
        const container = document.getElementById(chartId);
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Add loading state
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-container';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        `;
        container.appendChild(loadingDiv);
        container.classList.add('loading');
    }

    /**
     * Hides loading state for a chart container
     * @param {string} chartId - The ID of the chart container
     */
    function hideLoading(chartId) {
        const container = document.getElementById(chartId);
        if (container) {
            container.classList.remove('loading');
        }
    }

    /**
 * Shows error state for a chart container
 * @param {string} chartId - The ID of the chart container
 * @param {string} message - The error message to display
 */
function showError(chartId, message = 'Error loading chart') {
    const container = document.getElementById(chartId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Add error state
    const errorDiv = document.createElement('div');
    errorDiv.className = 'loading-container';
    errorDiv.innerHTML = `
        <div style="color: var(--accent-rose); font-size: 24px; margin-bottom: 8px;">⚠️</div>
        <div class="loading-text" style="color: var(--accent-rose);">${message}</div>
    `;
    container.appendChild(errorDiv);
}

// Generic wrapper for chart loading with error handling
/**
 * Generic wrapper for chart loading with error handling
 * @param {Function} chartFunction - The function that creates the chart
 * @param {string[]} chartIds - Array of chart container IDs
 * @param {string} loadingMessage - The loading message to display
 */
function loadChartWithErrorHandling(chartFunction, chartIds, loadingMessage = 'Loading chart...') {
    // Show loading states for all chart IDs
    chartIds.forEach(id => showLoading(id, loadingMessage));

    // Simulate async loading
    setTimeout(() => {
        try {
            chartFunction();
            // Hide loading states on success
            chartIds.forEach(id => hideLoading(id));
        } catch (error) {
            console.error('Error loading charts:', error);
            // Hide loading states and show error
            chartIds.forEach(id => {
                hideLoading(id);
                showError(id, 'Failed to load chart data');
            });
        }
    }, 300); // Shorter delay for better UX
}

/**
 * Updates charts based on user type filter
 * @param {string} type - The user type ('members' or 'casuals')
 */
function updateCharts(type) {
    // Update ride length chart
    const rideTrace = {
        x: rideLengths[type],
        type: 'histogram',
        name: 'Ride Lengths (minutes)',
        marker: { color: '#3498db' }
    };
    Plotly.newPlot('ride-length-chart', [rideTrace]);

    // Update day of week chart
    const dayTrace = {
        x: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        y: daysOfWeek[type],
        type: 'bar',
        name: 'Rides by Day',
        marker: { color: '#e74c3c' }
    };
    Plotly.newPlot('day-of-week-chart', [dayTrace]);

    // Update hourly usage chart
    const hourTrace = {
        x: Array.from({length: 24}, (_, i) => i),
        y: hourlyUsage[type],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Hourly Usage',
        line: { color: '#2ecc71' }
    };
    Plotly.newPlot('hourly-usage-chart', [hourTrace]);

    // Update station heatmap (simplified)
    const heatmapData = [{
        z: Array.from({length: 10}, () => Array.from({length: 10}, () => Math.floor(Math.random() * 100))),
        type: 'heatmap',
        colorscale: 'Viridis'
    }];
    Plotly.newPlot('station-heatmap', heatmapData);
}

function loadOverviewCharts() {
    // Initialize overview charts - currently static dashboard
    console.log('Overview charts loaded');
}

function switchVizTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.viz-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.viz-tab').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = 'var(--neutral-300)';
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
    event.target.style.background = 'rgba(255,255,255,0.2)';
    event.target.style.color = 'white';

    // Load charts for this tab
    loadTabCharts(tabName);
}

function loadTabCharts(tabName) {
    switch(tabName) {
        case 'usage':
            loadChartWithErrorHandling(
                loadUsageCharts,
                ['usage-comparison-chart', 'temporal-patterns-chart', 'revenue-impact-chart', 'station-preferences-chart'],
                'Loading usage analytics...'
            );
            break;
        case 'temporal':
            loadChartWithErrorHandling(
                loadTemporalCharts,
                ['weekday-weekend-chart', 'hourly-comparison-chart', 'seasonal-trends-chart', 'growth-analysis-chart'],
                'Loading temporal patterns...'
            );
            break;
        case 'stations':
            loadChartWithErrorHandling(
                loadStationsCharts,
                ['station-heatmap-chart', 'station-popularity-chart', 'route-optimization-chart', 'capacity-analysis-chart'],
                'Loading station analysis...'
            );
            break;
        case 'business':
            loadChartWithErrorHandling(
                loadBusinessCharts,
                ['revenue-breakdown-chart', 'profitability-chart', 'market-share-chart', 'roi-analysis-chart'],
                'Loading business metrics...'
            );
            break;
        case 'conversion':
            loadChartWithErrorHandling(
                loadConversionCharts,
                ['conversion-funnel-chart', 'retention-analysis-chart', 'lifetime-value-chart', 'churn-prediction-chart'],
                'Loading conversion insights...'
            );
            break;
    }
}

function loadUsageCharts() {
    // Ride Duration: Members vs Casuals
    const durationData = [{
        x: ['Members', 'Casuals'],
        y: [12.5, 25.3],
        type: 'bar',
        name: 'Average Ride Duration (minutes)',
        marker: {color: ['#1f77b4', '#ff7f0e']}
    }];
    Plotly.newPlot('usage-comparison-chart', durationData, {
        title: 'Ride Duration: Members vs Casuals',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    }, {
        responsive: true,
        displayModeBar: false,
        staticPlot: false
    });

    // Ride Frequency Comparison
    const frequencyData = [{
        x: ['Members', 'Casuals'],
        y: [291, 97],
        type: 'bar',
        name: 'Average Annual Rides',
        marker: {color: ['#1f77b4', '#ff7f0e']}
    }];
    Plotly.newPlot('temporal-patterns-chart', frequencyData, {
        title: 'Ride Frequency: Members vs Casuals',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    }, {
        responsive: true,
        displayModeBar: false,
        staticPlot: false
    });

    // Revenue per User Type
    const revenueData = [{
        x: ['Members', 'Casuals'],
        y: [2400000, 669000],
        type: 'bar',
        name: 'Annual Revenue ($)',
        marker: {color: ['#1f77b4', '#ff7f0e']}
    }];
    Plotly.newPlot('revenue-impact-chart', revenueData, {
        title: 'Revenue Impact: Members vs Casuals',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // User Type Distribution
    const distributionData = [{
        values: [78, 22],
        labels: ['Members (2.4M rides)', 'Casuals (669K rides)'],
        type: 'pie',
        marker: {colors: ['#1f77b4', '#ff7f0e']}
    }];
    Plotly.newPlot('station-preferences-chart', distributionData, {
        title: 'User Type Distribution',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });
}

function loadTemporalCharts() {
    // Weekday vs Weekend Usage
    const weekdayData = [{
        x: ['Weekday', 'Weekend'],
        y: [75, 25],
        type: 'bar',
        name: 'Member Usage %',
        marker: {color: '#1f77b4'}
    }, {
        x: ['Weekday', 'Weekend'],
        y: [35, 65],
        type: 'bar',
        name: 'Casual Usage %',
        marker: {color: '#ff7f0e'}
    }];
    Plotly.newPlot('weekday-weekend-chart', weekdayData, {
        barmode: 'group',
        title: 'Weekday vs Weekend Usage Patterns',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Hourly Usage Comparison
    const hourlyData = [{
        x: Array.from({length: 24}, (_, i) => i),
        y: [8000, 5000, 3000, 2000, 3000, 15000, 35000, 55000, 45000, 35000, 30000, 35000, 40000, 45000, 50000, 55000, 50000, 35000, 25000, 15000, 10000, 8000, 6000, 5000],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Members (Commute Hours)',
        line: {color: '#1f77b4'}
    }, {
        x: Array.from({length: 24}, (_, i) => i),
        y: [3000, 2000, 1500, 1000, 2000, 5000, 12000, 18000, 22000, 25000, 28000, 30000, 28000, 25000, 22000, 18000, 15000, 12000, 8000, 6000, 4000, 3000, 2500, 2000],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Casuals (Leisure Hours)',
        line: {color: '#ff7f0e'}
    }];
    Plotly.newPlot('hourly-comparison-chart', hourlyData, {
        title: 'Hourly Usage: Members vs Casuals',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Seasonal Trends
    const seasonalData = [{
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        y: [20000, 25000, 35000, 45000, 55000, 65000, 70000, 68000, 55000, 45000, 30000, 25000],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Total Usage',
        line: {color: '#2ca02c'}
    }];
    Plotly.newPlot('seasonal-trends-chart', seasonalData, {
        title: 'Seasonal Usage Trends',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Duration by Hour
    const durationHourData = [{
        x: Array.from({length: 24}, (_, i) => i),
        y: Array.from({length: 24}, () => 12 + Math.random() * 3), // Members: consistent short rides
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Members (Consistent)',
        line: {color: '#1f77b4'}
    }, {
        x: Array.from({length: 24}, (_, i) => i),
        y: Array.from({length: 24}, () => 20 + Math.random() * 15), // Casuals: variable longer rides
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Casuals (Variable)',
        line: {color: '#ff7f0e'}
    }];
    Plotly.newPlot('duration-by-hour-chart', durationHourData, {
        title: 'Average Ride Duration by Hour',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });
}

function createNetworkGraph() {
    const svg = d3.select('#network-graph-chart').append('svg')
        .attr('width', '100%')
        .attr('height', 300);

    // Sample network data
    const nodes = [
        {id: 1, name: 'Station A', x: 100, y: 100},
        {id: 2, name: 'Station B', x: 200, y: 150},
        {id: 3, name: 'Station C', x: 150, y: 200},
        {id: 4, name: 'Station D', x: 250, y: 100}
    ];

    const links = [
        {source: 1, target: 2, value: 10},
        {source: 1, target: 3, value: 8},
        {source: 2, target: 4, value: 6},
        {source: 3, target: 4, value: 4}
    ];

    // Draw links
    svg.selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('x1', d => nodes.find(n => n.id === d.source).x)
        .attr('y1', d => nodes.find(n => n.id === d.source).y)
        .attr('x2', d => nodes.find(n => n.id === d.target).x)
        .attr('y2', d => nodes.find(n => n.id === d.target).y)
        .attr('stroke', '#1f77b4')
        .attr('stroke-width', d => Math.sqrt(d.value));

    // Draw nodes
    svg.selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 20)
        .attr('fill', '#ff7f0e')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

    // Add labels
    svg.selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '10px')
        .text(d => d.name);
}

function loadSpatialCharts() {
    // Network Graph using D3
    createNetworkGraph();

    // Treemap
    const treemapData = [{
        type: 'treemap',
        labels: ['Station A', 'Station B', 'Station C', 'Station D', 'Station E', 'Station F'],
        parents: ['', '', '', '', '', ''],
        values: [100, 80, 60, 40, 30, 20],
        textinfo: 'label+value'
    }];
    Plotly.newPlot('treemap-chart', treemapData, {paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)'});

    // Sunburst
    const sunburstData = [{
        type: 'sunburst',
        labels: ['Downtown', 'North Side', 'South Side', 'West Side', 'Station 1', 'Station 2', 'Station 3', 'Station 4'],
        parents: ['', '', '', '', 'Downtown', 'North Side', 'South Side', 'West Side'],
        values: [50, 30, 20, 25, 25, 15, 10, 15]
    }];
    Plotly.newPlot('sunburst-chart', sunburstData, {paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)'});

    // Sankey Diagram
    const sankeyData = {
        type: 'sankey',
        node: {
            pad: 15,
            thickness: 20,
            line: {color: 'var(--neutral-400)', width: 0.5},
            label: ['Residential', 'Commercial', 'Parks', 'Transit', 'Morning', 'Evening', 'Weekend']
        },
        link: {
            source: [0, 0, 1, 1, 2, 2, 3, 3],
            target: [4, 5, 4, 6, 5, 6, 4, 5],
            value: [20, 10, 15, 5, 8, 12, 18, 7]
        }
    };
    Plotly.newPlot('sankey-chart', [sankeyData], {paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)'});
}

function loadStationsCharts() {
    // Top Stations by User Type
    const stationsData = [{
        x: ['Clark/Lake', 'Wells/Marble Place', 'Millennium Park', 'Theater District', 'Michigan Ave'],
        y: [85000, 72000, 68000, 65000, 62000],
        type: 'bar',
        name: 'Member Usage',
        marker: {color: '#1f77b4'}
    }, {
        x: ['Clark/Lake', 'Wells/Marble Place', 'Millennium Park', 'Theater District', 'Michigan Ave'],
        y: [25000, 18000, 45000, 42000, 35000],
        type: 'bar',
        name: 'Casual Usage',
        marker: {color: '#ff7f0e'}
    }];
    Plotly.newPlot('top-stations-chart', stationsData, {
        barmode: 'group',
        title: 'Top Stations: Members vs Casuals',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Station Usage Heatmap
    const heatmapData = [{
        z: Array.from({length: 10}, () => Array.from({length: 10}, () => Math.floor(Math.random() * 100))),
        type: 'heatmap',
        colorscale: 'Blues'
    }];
    Plotly.newPlot('station-heatmap-chart', heatmapData, {
        title: 'Station Usage Heatmap',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Popular Routes
    const routesData = [{
        x: ['Downtown Commute', 'North Side Local', 'Lakefront Leisure', 'Business District', 'Tourist Loop'],
        y: [120000, 85000, 95000, 78000, 65000],
        type: 'bar',
        name: 'Route Popularity',
        marker: {color: '#2ca02c'}
    }];
    Plotly.newPlot('popular-routes-chart', routesData, {
        title: 'Popular Routes by Usage Type',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Station Utilization
    const utilizationData = [{
        x: ['Transit Hubs', 'Business Districts', 'Parks & Attractions', 'Residential Areas'],
        y: [95, 88, 76, 45],
        type: 'bar',
        name: 'Utilization Rate %',
        marker: {color: '#9467bd'}
    }];
    Plotly.newPlot('station-utilization-chart', utilizationData, {
        title: 'Station Utilization Rates',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });
}

function loadBusinessCharts() {
    // Revenue Impact
    const revenueImpactData = [{
        x: ['Members', 'Casuals', 'Conversion Potential'],
        y: [2400000, 669000, 2800000],
        type: 'bar',
        name: 'Annual Revenue ($)',
        marker: {color: ['#1f77b4', '#ff7f0e', '#2ca02c']}
    }];
    Plotly.newPlot('revenue-impact-chart', revenueImpactData, {
        title: 'Revenue Impact Analysis',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Customer Lifetime Value
    const ltvData = [{
        x: ['Members (2+ years)', 'Casuals (3 months)'],
        y: [1200, 150],
        type: 'bar',
        name: 'Lifetime Value ($)',
        marker: {color: ['#1f77b4', '#ff7f0e']}
    }];
    Plotly.newPlot('lifetime-value-chart', ltvData, {
        title: 'Customer Lifetime Value',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Conversion Funnel
    const funnelData = [{
        x: ['All Casuals', 'High Potential', 'Contacted', 'Converted'],
        y: [100, 30, 10, 2],
        type: 'funnel',
        name: 'Conversion Funnel',
        marker: {color: '#9467bd'}
    }];
    Plotly.newPlot('conversion-funnel-chart', funnelData, {
        title: 'Conversion Funnel Analysis',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Profitability Matrix
    const profitabilityData = [{
        x: ['High Frequency', 'Medium Frequency', 'Low Frequency'],
        y: [500, 200, 50],
        type: 'bar',
        name: 'Monthly Revenue per User ($)',
        marker: {color: '#d62728'}
    }];
    Plotly.newPlot('profitability-matrix-chart', profitabilityData, {
        title: 'Profitability by Usage Pattern',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });
}

function loadConversionCharts() {
    // Top Recommendations
    const recommendationsData = [{
        x: ['Weekend Campaigns', 'Digital Nudging', 'Seasonal Promotions'],
        y: [15, 25, 20],
        type: 'bar',
        name: 'Expected Conversion Rate %',
        marker: {color: '#1f77b4'}
    }];
    Plotly.newPlot('recommendations-chart', recommendationsData, {
        title: 'Top 3 Conversion Strategies',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Digital Marketing
    const digitalData = [{
        x: ['App Notifications', 'Location-Based Offers', 'Social Proof', 'Email Campaigns'],
        y: [300, 250, 180, 120],
        type: 'bar',
        name: 'Expected ROI %',
        marker: {color: '#ff7f0e'}
    }];
    Plotly.newPlot('digital-marketing-chart', digitalData, {
        title: 'Digital Marketing Opportunities',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Expansion Plan
    const expansionData = [{
        x: ['Tourist Areas', 'Business Districts', 'Transit Hubs', 'Residential'],
        y: [25, 20, 15, 10],
        type: 'bar',
        name: 'Ridership Increase %',
        marker: {color: '#2ca02c'}
    }];
    Plotly.newPlot('expansion-plan-chart', expansionData, {
        title: 'Infrastructure Expansion Impact',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Success Metrics
    const metricsData = [{
        x: ['Conversion Rate', 'CAC', 'LTV Increase', 'Revenue Growth'],
        y: [15, 50, 500, 2800000],
        type: 'bar',
        name: 'Target Metrics',
        marker: {color: '#9467bd'}
    }];
    Plotly.newPlot('success-metrics-chart', metricsData, {
        title: 'Success Metrics Dashboard',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });
}

function updateAllCharts() {
    const activeTab = document.querySelector('.viz-tab.active');
    if (activeTab) {
        const tabName = activeTab.textContent.toLowerCase().split(' ')[0];
        loadTabCharts(tabName);
    }
}

function resetFilters() {
    const userFilter = document.getElementById('user-filter');
    if (userFilter) userFilter.value = 'all';

    const timeFilter = document.getElementById('time-filter');
    if (timeFilter) timeFilter.value = 'all';

    const metricFilter = document.getElementById('metric-filter');
    if (metricFilter) metricFilter.value = 'duration';

    currentFilters = {
        user: 'all',
        time: 'all',
        metric: 'duration'
    };

    updateAllCharts();
}

// Update dashboard charts function for focused dashboard
function updateDashboardCharts() {
    // Usage comparison chart
    const usageData = [{
        x: ['Members', 'Casuals'],
        y: [2.4, 0.67],
        type: 'bar',
        name: 'Total Rides (Millions)',
        marker: {color: ['#1f77b4', '#ff7f0e']}
    }];
    Plotly.newPlot('usage-comparison-chart', usageData, {
        title: 'Total Rides: Members vs Casuals',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Temporal patterns chart
    const temporalData = [{
        x: ['Weekday', 'Weekend'],
        y: [75, 25],
        type: 'bar',
        name: 'Member Usage %',
        marker: {color: '#1f77b4'}
    }, {
        x: ['Weekday', 'Weekend'],
        y: [35, 65],
        type: 'bar',
        name: 'Casual Usage %',
        marker: {color: '#ff7f0e'}
    }];
    Plotly.newPlot('temporal-patterns-chart', temporalData, {
        barmode: 'group',
        title: 'Usage Patterns: Weekday vs Weekend',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Revenue impact chart
    const revenueImpactData = [{
        x: ['Members', 'Casuals', 'Potential'],
        y: [2.4, 0.67, 2.8],
        type: 'bar',
        name: 'Revenue (Millions $)',
        marker: {color: ['#1f77b4', '#ff7f0e', '#2ca02c']}
    }];
    Plotly.newPlot('revenue-impact-chart', revenueImpactData, {
        title: 'Revenue Impact Analysis',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });

    // Station preferences chart
    const stationData = [{
        x: ['Transit Hubs', 'Business Districts', 'Parks & Attractions', 'Residential Areas'],
        y: [95, 88, 76, 45],
        type: 'bar',
        name: 'Utilization Rate %',
        marker: {color: '#9467bd'}
    }];
    Plotly.newPlot('station-preferences-chart', stationData, {
        title: 'Station Utilization by Type',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    });
}