$(document).ready(function() {
    fetchUsers();

    function fetchUsers() {
        $.ajax({
            url: '/get_users',
            method: 'GET',
            success: function(data) {
                let tbody = '';
                data.forEach(function(user, index) {
                    tbody += `<tr>
                        <td>${index + 1}</td>
                        <td>${user.name}</td>
                        <td>${user.gender}</td>
                        <td>${user.email}</td>
                        <td>${user.password}</td>
                        <td>${user.userRole}</td>
                        <td>${user.date}</td>
                        <td>
                            <button class="btn btn-primary btn-sm edit-user" data-id="${user.id}"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>`;
                });
                $('#userTable tbody').html(tbody);
            },
            error: function(error) {
                console.error('Error fetching users:', error);
            }
        });
    }

    $('#addNew').click(function() {
        $('#addUserForm')[0].reset();
        $('#addUserModal').modal('show');
    });

    $('#addUserForm').submit(function(event) {
    event.preventDefault();

    var user_id = $("#id").val();
    var name = $("#addName").val();
    var gender = $("#addGender").val()
    var email = $("#addEmail").val();
    var password = $("#addPassword").val();
    var userRole = $("#addUserRole").val();

    if (name == "") {
      displayMessage("error", "Name Is Empry! | Please enter a Name");
      return;
    }else if (email == "") {
      displayMessage("error", "Email Is Empry! |Please enter an email address");
       return;
    } else if (password == "") {
      displayMessage("error", "Password Is Empry! | Please enter a password");
       return;
    }
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
        url: '/add_user',
        method: 'POST',
        data: formDataObject,
        success: function(data) {
            $('#addUserModal').modal('hide');
            fetchUsers();
            Swal.fire('Success', data.message, 'success');
        },
        error: function(xhr) {
            console.error('Error saving user:', xhr);
            const response = xhr.responseJSON;
            const errorMessage = response && response.error ? response.error : 'Failed to save user';
            Swal.fire('Error', errorMessage, 'error');
        }
    });
});

    $(document).on('click', '.edit-user', function() {
    const userId = $(this).data('id');
    $.ajax({
        url: `/get_user/${userId}`,
        method: 'GET',
        success: function(data) {
            $('#editUserId').val(data.id);
            $('#editName').val(data.name);
            $('#editGender').val(data.gender);
            $('#editEmail').val(data.email);
            $('#editPassword').val(data.password);
            $('#editUserRole').val(data.userRole);
            $('#editUserModal').modal('show');
        },
        error: function(error) {
            console.error('Error fetching user details:', error);
        }
    });
});

$('#editUserForm').submit(function(event) {
    event.preventDefault();
    const userId = $('#editUserId').val();
    const formData = $(this).serialize();

    $.ajax({
        url: `/edit_user/${userId}`,
        method: 'POST',
        data: formData,
        success: function(data) {
            $('#editUserModal').modal('hide');
            fetchUsers();
            Swal.fire('Success', data.message, 'success');
        },
        error: function(xhr) {
            console.error('Error updating user:', xhr);
            const response = xhr.responseJSON;
            const errorMessage = response && response.error ? response.error : 'Failed to update user';
            Swal.fire('Error', errorMessage, 'error');
        }
    });
});


    $(document).on('click', '.delete-user', function() {
        const userId = $(this).data('id');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/delete_user/${userId}`,
                    method: 'DELETE',
                    success: function(data) {
                        fetchUsers();
                        Swal.fire('Deleted!', 'User has been deleted.', 'success');
                    },
                    error: function(error) {
                        console.error('Error deleting user:', error);
                        Swal.fire('Error', 'Failed to delete user', 'error');
                    }
                });
            }
        });
    });

      const displayMessage = (type, message) => {
    var success = document.querySelector(".alert-success");
    var error = document.querySelector(".alert-danger");

    if (type == "success") {
      error.classList = "alert alert-danger d-none";
      success.classList = "alert alert-success p-2";
      success.innerHTML = message;

      setTimeout(() => {
        success.classList = "alert alert-success d-none";
        $("#userForm")[0].reset();
        $("#showImage").attr("src", "");
        $("#userModal").modal("hide");
      }, 3000);
    } else {
      error.classList = "alert alert-danger p-2";
      error.innerHTML = message;
      setTimeout(function () {
        error.classList = "alert alert-danger d-none";
      }, 5000);
    }
  };
});

