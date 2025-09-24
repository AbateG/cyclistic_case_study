# Outputs Directory

This directory contains all generated outputs from the Cyclistic analysis pipeline.

## Structure

```
outputs/
├── *.png                # Static visualizations
├── *.html               # Interactive visualizations
├── *_files/             # Supporting files for HTML outputs
├── test_dashboard.html  # Test dashboard
└── ...
```

## Generated Files

### Visualizations
- `rides_by_day.png` - Daily ridership patterns
- `ride_length_distribution.png` - Ride duration distributions
- `rides_by_year.png` - Yearly ridership trends
- `avg_ride_length_by_day.png` - Average ride length by weekday
- `station_usage_heatmap.png` - Station usage heatmaps
- `correlation_matrix.png` - Variable correlations

### Interactive Visualizations
- `interactive_rides_by_day.html` - Interactive daily patterns
- `interactive_ride_length_dist.html` - Interactive distributions
- `station_usage_heatmap.html` - Interactive station heatmap
- `popular_routes_map.html` - Interactive route visualization

### 3D Visualizations
- `3d_usage_heatmap.html` - 3D surface plot of usage by hour and day
- `3d_duration_scatter.html` - 3D scatter plot of trip durations
- `3d_station_bubbles.html` - 3D bubble chart of station usage patterns
- `3d_multi_panel_dashboard.html` - Multi-panel 3D visualization dashboard
- `3d_visualizations_report.md` - Summary report of 3D visualizations

### Animated Visualizations
- `hourly_usage_animation.gif` - Time-lapse of hourly usage throughout the week
- `daily_usage_animation.gif` - Daily ridership trends over time
- `seasonal_patterns_animation.gif` - Seasonal usage pattern changes
- `interactive_usage_animation.html` - Interactive animated trip patterns
- `animated_visualizations_report.md` - Summary report of animated visualizations

### Performance Analysis
- `performance_optimization_report.md` - Memory usage and performance optimization analysis

### Competitor Analysis
- `competitor_analysis_report.md` - Comprehensive competitor analysis report
- `competitor_user_distribution.png` - Member vs casual rider distribution comparison
- `competitor_trip_comparison.png` - Trip duration and volume comparison
- `competitor_hourly_patterns.png` - Hourly usage pattern comparison

### Reports
- `test_dashboard.html` - Web-based dashboard for testing

## File Management

- Files are regenerated during analysis runs
- Large files may be excluded from version control
- Interactive HTML files include supporting `_files/` directories

## Viewing Outputs

- **Static images**: Open directly in image viewer
- **Interactive HTML**: Open in web browser
- **Dashboard**: Serve locally with `python -m http.server` or deploy to web server