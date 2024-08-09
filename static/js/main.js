$("#predictionForm").on("submit", (event) => {
    event.preventDefault();

    var islamicScore = $("#islamicScore").val();
    var arabicScore = $("#arabicScore").val();
    var mathScore = $("#mathScore").val();
    var historyScore = $("#historyScore").val();
    var physicsScore = $("#physicsScore").val();
    var geographyScore = $("#geographyScore").val();
    var biologyScore = $("#biologyScore").val();
    var englishScore = $("#englishScore").val();
    var chemistryScore = $("#chemistryScore").val();
    var soomaaliScore = $("#somaaliScore").val();
    var modelName = $("#model").val(); // Get selected model name

    var totalScores = parseFloat(islamicScore) + parseFloat(arabicScore) + parseFloat(mathScore) + parseFloat(historyScore) + parseFloat(physicsScore) + parseFloat(geographyScore) + parseFloat(biologyScore) + parseFloat(englishScore) + parseFloat(chemistryScore) + parseFloat(soomaaliScore);
    var average = totalScores / 10;

    console.log("Total Scores: ", totalScores);
    console.log("Average Score: ", average);

    // Check empty values
    if (islamicScore === "" || islamicScore < 0 || islamicScore > 100) {
        showError("Invalid Islamic Score. Please enter a valid score between 0 and 100.");
        return;
    } else if (arabicScore === "" || arabicScore < 0 || arabicScore > 100) {
        showError("Invalid Arabic Score. Please enter a valid score between 0 and 100.");
        return;
    } else if (mathScore === "" || mathScore < 0 || mathScore > 100) {
        showError("Invalid Math Score. Please enter a valid score between 0 and 100.");
        return;
    } else if (historyScore === "" || historyScore < 0 || historyScore > 100) {
        showError("Invalid History Score. Please enter a valid score between 0 and 100.");
        return;
    } else if (physicsScore === "" || physicsScore < 0 || physicsScore > 100) {
        showError("Invalid Physics Score. Please enter a valid score between 0 and 100.");
        return;
    } else if (geographyScore === "" || geographyScore < 0 || geographyScore > 100) {
        showError("Invalid Geography Score. Please enter a valid score between 0 and 100.");
        return;
    } else if (biologyScore === "" || biologyScore < 0 || biologyScore > 100) {
        showError("Invalid Biology Score. Please enter a valid score between 0 and 100.");
        return;
    } else if (englishScore === "" || englishScore < 0 || englishScore > 100) {
        showError("Invalid English Score. Please enter a valid score between 0 and 100.");
        return;
    } else if (chemistryScore === "" || chemistryScore < 0 || chemistryScore > 100) {
        showError("Invalid Chemistry Score. Please enter a valid score between 0 and 100.");
        return;
    } else if (soomaaliScore === "" || soomaaliScore < 0 || soomaaliScore > 100) {
        showError("Invalid Af-Soomaali Score. Please enter a valid score between 0 and 100.");
        return;
    }

    // Check for failed subjects
    let failedSubjects = [];
    if (islamicScore < 50) failedSubjects.push(`Islamic: ${islamicScore}`);
    if (arabicScore < 50) failedSubjects.push(`Arabic: ${arabicScore}`);
    if (mathScore < 50) failedSubjects.push(`Math: ${mathScore}`);
    if (historyScore < 50) failedSubjects.push(`History: ${historyScore}`);
    if (physicsScore < 50) failedSubjects.push(`Physics: ${physicsScore}`);
    if (geographyScore < 50) failedSubjects.push(`Geography: ${geographyScore}`);
    if (biologyScore < 50) failedSubjects.push(`Biology: ${biologyScore}`);
    if (englishScore < 50) failedSubjects.push(`English: ${englishScore}`);
    if (chemistryScore < 50) failedSubjects.push(`Chemistry: ${chemistryScore}`);
    if (soomaaliScore < 50) failedSubjects.push(`Af-Soomaali: ${soomaaliScore}`);

    var formData = $('#predictionForm').serialize() + '&model=' + modelName;

    $.ajax({
        type: 'POST',
        url: '/predict',
        data: formData,
        success: function(response) {
            var decision = average < 50 ? 'Dhacay' : 'Gudbay';
            var faculty = response.result; // Assuming response.result is the predicted faculty
            var html = `
                <div class="container-fluid p-4" style="background-color: #ddd; min-height: 80vh;">
                    <h2 class="fw-bold p-2 fs-3 text-center text-dark">Student Information & Faculty Predicted</h2>
                    <div class="container p-2" style="background-color: #fff;">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="card" style="min-height:100vh;">
                                    <div class="table-responsive p-1" id="printArea">
                                        <table class="table" style="font-size: 15px;">
                                            <tbody>
                                                <tr>
                                                    <td class="fw-bold bg-secondary text-light"> #</td>
                                                    <td class="fw-bold bg-secondary text-light">Information</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Student Name:</td>
                                                    <td>${response.stdName}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Student Class:</td>
                                                    <td>${response.stdClass}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Graduation Year:</td>
                                                    <td>${response.graduatedYear}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Gender:</td>
                                                    <td>${response.gender}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">School:</td>
                                                    <td>${response.school}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">District School:</td>
                                                    <td>${response.districtSchool}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Email:</td>
                                                    <td>${response.email}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold bg-secondary text-light"> Subjects</td>
                                                    <td class="fw-bold bg-secondary text-light">Scores</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Islamic:</td>
                                                    <td>${islamicScore}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Arabic: </td>
                                                    <td>${arabicScore}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Math: </td>
                                                    <td>${mathScore}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">History:</td>
                                                    <td>${historyScore}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Physics:</td>
                                                    <td>${physicsScore}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Geography:</td>
                                                    <td>${geographyScore}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Biology:</td>
                                                    <td>${biologyScore}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">English: </td>
                                                    <td>${englishScore}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Chemistry:</td>
                                                    <td>${chemistryScore}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Af-Soomaali:</td>
                                                    <td>${soomaaliScore}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Total Score: </td>
                                                    <td>${totalScores}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Average: </td>
                                                    <td>${average}%</td>
                                                </tr>
                                                 <tr>
                                                    <td class="fw-bold">Decision: </td>
                                                    <td>${decision}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Faculty: </td>
                                                    <td class="bg-success text-light fw-bold rounded">${faculty}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="mt-2 mb-2">
                                    <button class="btn btn-primary text-light" id="saveStatement"><i class="fas fa-save text-light"></i> Save </button>
                                    <button class="btn btn-success text-light" id="printStatement"><i class="fas fa-print text-light"></i> Print</button>
                                    <button class="btn btn-info text-light" id="exportStatement"><i class="fas fa-file-excel text-light"></i> Export </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            if (average < 50) {
                let failedSubjectsList = `${failedSubjects.map(subject => `<li>${subject}</li>`).join('')} <hr> <i class="fa fa-warning text-center text-warning"></i> Denied <li>Total Score: ${totalScores}</li> <li>Average: ${average}</li>`;
                $('#failedSubjectsList').html(failedSubjectsList);
                $('#failedSubjectsModal').modal('show');

                 $("#saveStatement").on("click", function() {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you want to save this prediction?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, save it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        savePrediction(islamicScore, arabicScore, mathScore, historyScore, physicsScore, geographyScore, biologyScore, englishScore, chemistryScore, soomaaliScore, totalScores, average, decision);
                    }
                });
            });
                return;
            }
            else if (failedSubjects.length > 3) {
                let failedSubjectsList = `${failedSubjects.map(subject => `<li>${subject}</li>`).join('')} <hr> <li>Total Score: ${totalScores}</li> <li>Average: ${average}</li> <i class="fa fa-warning text-warning mt-2"></i> Denied! You Failed More than three subjects`;

                $('#failedSubjectsList').html(failedSubjectsList);
                $('#failedSubjectsModal').modal('show');

                 $("#saveStatement").on("click", function() {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you want to save this prediction?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, save it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        savePrediction(islamicScore, arabicScore, mathScore, historyScore, physicsScore, geographyScore, biologyScore, englishScore, chemistryScore, soomaaliScore, totalScores, average, decision);
                    }
                });
            });
                return;
            }
            $('#result').html(html);

            $("#saveStatement").on("click", function() {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you want to save this prediction?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, save it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        savePrediction(islamicScore, arabicScore, mathScore, historyScore, physicsScore, geographyScore, biologyScore, englishScore, chemistryScore, soomaaliScore, totalScores, average, decision, faculty);
                    }
                });
            });
        }
    });
});

function showError(message) {
    Swal.fire({
        title: "Error!",
        text: message,
        icon: "error"
    });
}

function savePrediction(islamic, arabic, math, history, physics, geo, bio, eng, chem, som, total, average, decision, faculty ="Back to school") {
    $.ajax({
        type: 'POST',
        url: '/save_prediction',
        data: {
            Islamic: islamic,
            Arabic: arabic,
            Math: math,
            History: history,
            Physics: physics,
            Geo: geo,
            Bio: bio,
            Eng: eng,
            Chem: chem,
            Som: som,
            totalScore: total,
            average: average,
            decision: decision,
            faculty: faculty
        },
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: "Prediction saved successfully!",
                icon: "success"
            });
        },
        error: function(error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to save prediction.",
                icon: "error"
            });
        }
    });
}

$(document).on("click", "#printStatement", function() {
    printStatement();
});

$(document).on("click", "#exportStatement", function(event) {
    var file = new Blob([$("#printArea").html()], { type: "text/html" });
    var url = URL.createObjectURL(file);
    var a = $("<a />", {
        href: url,
        download: "graduate_admission_prediction.xls"
    }).appendTo("body").get(0).click();
    event.preventDefault();
});

function printStatement() {
    let printArea = document.querySelector("#printArea");

    var newWindow = window.open("");
    newWindow.document.write(`<html><head><title>Report graduate admission prediction</title>`);
    newWindow.document.write(`<style media="print">
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');
    body {
        font-family: 'Poppins', sans-serif;
    }
    table {
        width: 100%;
    }
    h1 {
        font-size: 22 !important;
        padding: 15px !important;
    }
    td.fw-bold {
        color: #000 !important;
        font-size: 16px !important;
        font-weight: bold !important;
    }
    th, td {
        padding: 15px !important;
        text-align: left !important;
        border-bottom: 1px solid #ddd !important;
    }
    </style>`)
    newWindow.document.write(`</head><body>`)
    newWindow.document.write(printArea.innerHTML);
    newWindow.document.write(`</body></html>`);
    newWindow.print();
    newWindow.close();
}
