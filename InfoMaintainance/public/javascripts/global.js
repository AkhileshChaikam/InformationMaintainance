var userListData = [];
var updateUserId = null;

$(document).ready(function() {

	populateTable();
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#btnAddUser').on('click', addUser);
	$('#btnUpdateUser').on('click', updateUser);
	$('#userList table tbody').on('click', 'td a.linkupdateuser', showUserInfoForUpdate)
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser)
});

function populateTable(){
	var tableContent = '';
	$.getJSON('/users/userlist', function( data ) {
		userListData = data;

		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td>' + this._id + '</td>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
			tableContent += '<td>' + this.college_name + '</td>';
			tableContent += '<td>' + this.fullname + '</td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td>' + this.gender + '</td>';
			tableContent += '<td>' + this.location + '</td>';
			tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">Update</a></td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">Delete</a></td>';
			tableContent += '</tr>';
		});
		$('#userList table tbody').html(tableContent);
	});
};

function showUserInfo(event) {
	event.preventDefault();
	var thisUserName = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem)
		{return arrayItem.username;}).indexOf(thisUserName);
	var thisUserObject = userListData[arrayPosition];

	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoEmail').text(thisUserObject.email);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
};

function addUser(event) {
	event.preventDefault();
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});

	if(errorCount === 0) {
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullName').val(),
			'college_name': $('#addUser fieldset input#inputCollegeName').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputGender').val(),
		}
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType:'JSON'
		}).done(function( response ) {
			if (response.msg === '') {
				$('#addUser fieldset input').val('');
				populateTable();
			}
			else {
				alert('Error: ' + response.msg);
			}
		});
	}
	else {
		alert('Please fill in all fields');
		return false;
	}
};

function showUserInfoForUpdate(event) {
	event.preventDefault();
	var thisUserName = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem)
		{return arrayItem._id;}).indexOf(thisUserName);
	var thisUserObject = userListData[arrayPosition];
 	updateUserId = $(this).attr('rel');

	$('#updateUser fieldset input#inputUserName').val(thisUserObject.username)
	$('#updateUser fieldset input#inputUserEmail').val(thisUserObject.email)
	$('#updateUser fieldset input#inputUserFullName').val(thisUserObject.fullname)
	$('#updateUser fieldset input#inputCollegeName').val(thisUserObject.college_name)
	$('#updateUser fieldset input#inputUserLocation').val(thisUserObject.location)
	$('#updateUser fieldset input#inputGender').val(thisUserObject.gender)
};

function deleteUser(event) {
	event.preventDefault();
	var confirmation = confirm("Are you sure you want to delete this user?");
	if (confirmation === true) {
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function( response ) {
			if (response.msg === '') {
			}
			else {
				alert('Error: ' + response.msg);
			}
			populateTable();
		});
	}
	else {
		return false;
	}
};

function updateUser(event){
	event.preventDefault();
	var errorCount = 0;
	
	if (updateUserId === null){
		alert('No record selected for update');
		return false;
	}

	if(errorCount === 0) {

		var updateUser = {
			'username': $('#updateUser fieldset input#inputUserName').val(),
			'email': $('#updateUser fieldset input#inputUserEmail').val(),
			'fullname': $('#updateUser fieldset input#inputUserFullName').val(),
			'college_name': $('#updateUser fieldset input#inputCollegeName').val(),
			'location': $('#updateUser fieldset input#inputUserLocation').val(),
			'gender': $('#updateUser fieldset input#inputGender').val(),
		}
		$.ajax({
			type: 'PUT',
			data: updateUser,
			url: '/users/updateuser/'+updateUserId,
			dataType:'JSON'
		}).done(function( response ) {
			updateUserId = null
			if (response.msg === '') {
				$('#updateUser fieldset input').val('');
				populateTable();
			}
			else {
				alert('Error: ' + response.msg);
			}
		});
	}
	else {
		alert('Please fill in all fields');
		return false;
	}
}