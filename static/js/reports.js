$(document).ready(function() {
    fetchReportsData();

    // Function to fetch reports data
    function fetchReportsData() {
        $.ajax({
            url: '/reports_data',
            method: 'GET',
            success: function(data) {
                if (data) {
                    displayAllPredictions(data.all_predictions);
                    displayTodayPredictions(data.today_predictions);
                    displayWeeklyPredictions(data.weekly_predictions);
                    displayMonthlyPredictions(data.monthly_predictions);
                }
               console.log(data.today_predictions)

            },
            error: function(error) {
                console.log('Error fetching reports data:', error);
                alert('Failed to load reports data.');
            }
        });
    }

    // Function to display all predictions
    function displayAllPredictions(predictions) {
        let tbody = '';
        predictions.forEach(function(prediction, index) {
            tbody += `<tr>

                        <td>${prediction.date}</td>
                        <td>${prediction.name}</td>
                        <td>${prediction.openPrice.toFixed(2)}</td>
                        <td>${prediction.highPrice.toFixed(2)}</td>
                        <td>${prediction.lowPrice.toFixed(2)}</td>
                        <td>${prediction.volume}</td>
                        <td>${prediction.pricePredicted.toFixed(2)}</td>
                    </tr>`;
        });
        $('#all-predictions').html(tbody);
    }

    // Function to display today's predictions
    function displayTodayPredictions(predictions) {
        let tbody = '';
        predictions.forEach(function(prediction, index) {
            tbody += `<tr>

                        <td>${prediction.date}</td>
                        <td>${prediction.name}</td>
                        <td>${prediction.openPrice.toFixed(2)}</td>
                        <td>${prediction.highPrice.toFixed(2)}</td>
                        <td>${prediction.lowPrice.toFixed(2)}</td>
                        <td>${prediction.volume}</td>
                        <td>${prediction.pricePredicted.toFixed(2)}</td>
                    </tr>`;
        });
        $('#today-predictions').html(tbody);
    }

    // Function to display weekly predictions
    function displayWeeklyPredictions(predictions) {
        let tbody = '';
        predictions.forEach(function(prediction, index) {
            tbody += `<tr>
                        <td>${prediction.date}</td>
                        <td>${prediction.name}</td>
                        <td>${prediction.openPrice.toFixed(2)}</td>
                        <td>${prediction.highPrice.toFixed(2)}</td>
                        <td>${prediction.lowPrice.toFixed(2)}</td>
                        <td>${prediction.volume}</td>
                        <td>${prediction.pricePredicted.toFixed(2)}</td>
                    </tr>`;
        });
        $('#weekly-predictions').html(tbody);
    }

    // Function to display monthly predictions
    function displayMonthlyPredictions(predictions) {
        let tbody = '';
        predictions.forEach(function(prediction, index) {
            tbody += `<tr>
                        <td>${prediction.date}</td>
                        <td>${prediction.name}</td>
                        <td>${prediction.openPrice.toFixed(2)}</td>
                        <td>${prediction.highPrice.toFixed(2)}</td>
                        <td>${prediction.lowPrice.toFixed(2)}</td>
                        <td>${prediction.volume}</td>
                        <td>${prediction.pricePredicted.toFixed(2)}</td>
                    </tr>`;
        });
        $('#monthly-predictions').html(tbody);
    }


    $('#printAllPredictions').on('click', function() {
        printContent('#all-predictions-table');
    });

    $('#printTodayPredictions').on('click', function() {
        printContent('#today-predictions-table');
    });

    $('#printWeeklyPredictions').on('click', function() {
        printContent('#weekly-predictions-table');
    });

    $('#printMonthlyPredictions').on('click', function() {
        printContent('#monthly-predictions-table');
    });


      // Export functionality
    $('#exportAllPredictions').on('click', function() {
        exportTable('#all-predictions-table', 'all_predictions.csv');
    });

    $('#exportTodayPredictions').on('click', function() {
        exportTable('#today-predictions-table', 'today_predictions.csv');
    });

    $('#exportWeeklyPredictions').on('click', function() {
        exportTable('#weekly-predictions-table', 'ardayda_gudubtay.csv');
    });

    $('#exportMonthlyPredictions').on('click', function() {
        exportTable('#monthly-predictions-table', 'ardayda_dhacday.csv');
    });



    function printContent(selector) {
        let printContent = $(selector).html();
        let originalContent = $('body').html();
        $('body').html(printContent);
        window.print();
        $('body').html(originalContent);
    }

    function exportTable(selector, filename) {
        let table = document.querySelector(selector);
        let csvContent = '';
        table.querySelectorAll('tr').forEach(function(row) {
            let rowData = [];
            row.querySelectorAll('th, td').forEach(function(cell) {
                rowData.push(cell.textContent);
            });
            csvContent += rowData.join(',') + '\n';
        });

        let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        let link = document.createElement('a');
        if (link.download !== undefined) {
            let url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }


});
