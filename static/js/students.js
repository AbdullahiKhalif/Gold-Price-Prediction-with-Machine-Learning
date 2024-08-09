$(document).ready(function() {
    fetchStudents();

    function fetchStudents() {
        $.ajax({
            url: '/get_students',
            method: 'GET',
            success: function(data) {
                let tbody = '';
                data.forEach(function(student, index) {
                    tbody += `<tr>
                        <td>${index + 1}</td>
                        <td>${student.studentName}</td>
                        <td>${student.graduatedYear}</td>
                        <td>${student.gender}</td>
                        <td>${student.school}</td>
                        <td>${student.districtSchool}</td>
                        <td>${student.email}</td>
                        <td>
                            <button class="btn btn-primary btn-sm edit-student" data-id="${student.id}"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger btn-sm delete-student" data-id="${student.id}"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>`;
                });
                $('#studentTable tbody').html(tbody);
            },
            error: function(error) {
                console.error('Error fetching students:', error);
            }
        });
    }

    $('#addNewStudent').click(function() {
        $('#addStudentForm')[0].reset();
        $('#addStudentModal').modal('show');
    });

    $('#addStudentForm').submit(function(event) {
        event.preventDefault();
        const formData = $(this).serializeArray();
        let valid = true;
        let formDataObject = {};

        formData.forEach(field => {
            if (!field.value) {
                valid = false;
                Swal.fire('Error', `${field.name} is required`, 'error');
            }
            formDataObject[field.name] = field.value;
        });

        if (!valid) return;

        $.ajax({
            url: '/add_student',
            method: 'POST',
            data: formDataObject,
            success: function(data) {
                $('#addStudentModal').modal('hide');
                fetchStudents();
                Swal.fire('Success', data.message, 'success');
            },
            error: function(xhr) {
                console.error('Error saving student:', xhr);
                const response = xhr.responseJSON;
                const errorMessage = response && response.error ? response.error : 'Failed to save student';
                Swal.fire('Error', errorMessage, 'error');
            }
        });
    });

    $(document).on('click', '.edit-student', function() {
        const studentId = $(this).data('id');
        $.ajax({
            url: `/get_student/${studentId}`,
            method: 'GET',
            success: function(data) {
                $('#editStudentId').val(data.id);
                $('#editStudentName').val(data.studentName);
                $('#editGraduatedYear').val(data.graduatedYear);
                $('#editGender').val(data.gender);
                $('#editSchool').val(data.school);
                $('#editDistrictSchool').val(data.districtSchool);
                $('#editEmail').val(data.email);
                $('#editStudentModal').modal('show');
            },
            error: function(error) {
                console.error('Error fetching student details:', error);
            }
        });
    });

    $('#editStudentForm').submit(function(event) {
        event.preventDefault();
        const studentId = $('#editStudentId').val();
        const formData = $(this).serialize();

        $.ajax({
            url: `/edit_student/${studentId}`,
            method: 'POST',
            data: formData,
            success: function(data) {
                $('#editStudentModal').modal('hide');
                fetchStudents();
                Swal.fire('Success', data.message, 'success');
            },
            error: function(xhr) {
                console.error('Error updating student:', xhr);
                const response = xhr.responseJSON;
                const errorMessage = response && response.error ? response.error : 'Failed to update student';
                Swal.fire('Error', errorMessage, 'error');
            }
        });
    });

    $(document).on('click', '.delete-student', function() {
        const studentId = $(this).data('id');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/delete_student/${studentId}`,
                    method: 'DELETE',
                    success: function(data) {
                        fetchStudents();
                        Swal.fire('Deleted!', 'Student has been deleted.', 'success');
                    },
                    error: function(error) {
                        console.error('Error deleting student:', error);
                        Swal.fire('Error', 'Failed to delete student', 'error');
                    }
                });
            }
        });
    });
});
