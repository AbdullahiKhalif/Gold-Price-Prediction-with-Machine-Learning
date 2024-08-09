$(document).ready(function() {
    // Fetch and display dashboard data on page load
    fetchDashboardData();

    function fetchDashboardData() {
        $.ajax({
            url: '/dashboard_data',
            method: 'GET',
            success: function(data) {
                // Update the text elements with the fetched data
                $('#total_users').text(data.total_users);
                $('#total_admins').text(data.total_admins);
                $('#total_predictions').text(data.total_predictions);
                $('#today_predictions').text(data.today_predictions);
                $('#week_predictions').text(data.week_predictions);

                // Initialize charts
//                initGenderChart(data.gender_distribution);
// Gender Distribution Chart
            const genderLabels = data.gender_distribution.map(item => item.gender);
            const genderData = data.gender_distribution.map(item => item.count);
            const genderCtx = document.getElementById('genderChart').getContext('2d');
            new Chart(genderCtx, {
                type: 'pie',
                data: {
                    labels: genderLabels,
                    datasets: [{
                        data: genderData,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    }]
                },
               options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    enabled: true
                },
                datalabels: {
                    display: true,
                    color: '#fff'
                }
            }
        },
        plugins: [ChartDataLabels]
            });

            },
            error: function(error) {
                console.error('Error fetching dashboard data:', error);
                alert('Failed to fetch data, please try again.');
            }
        });
    }

    function initGenderChart(genderData) {
        // Prepare the data for the gender distribution chart
        const genderLabels = genderData.map(item => item.gender[0]);
        const genderCounts = genderData.map(item => item.count[1]);

        console.log(genderLabels)
        console.log(genderCounts)
        const ctx = document.getElementById('genderChart').getContext('2d');

        // Clear any previous instance of the chart before creating a new one
        if (window.genderChart) {
            window.genderChart.destroy();
        }

        // Create a new pie chart
        window.genderChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: genderLabels,
                datasets: [{
                    label: 'Gender Distribution',
                    data: genderCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });
    }
});
