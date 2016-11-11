angular.module('userCtrl', ['userService'])

// user controller for the main page
// inject the User factory

.controller('userController', function(User) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	User.all()
		.then(function(res) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			if(res && res.data){
				
				vm.users = res.data;
			}else{
				vm.users = [];
			}		
		});
	// function to delete a user
	vm.deleteUser = function(id) {
		
		vm.processing = true;
		
		// accepts the user id as a parameter
		User.delete(id)
			.then(function(res) {
			
				// get all users to update the table
				// you can also set up your api
				// to return the list of users with the delete call
				User.all()
					.then(function(res) {
					vm.processing = false;
						if(res && res.data){
							vm.users = res.data;
						}else{
							vm.users = [];
						}		
					});
			});
	};
})

// controller applied to user creation page
.controller('userCreateController', function(User) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a user
	vm.saveUser = function() {
		
		vm.processing = true;

		// clear the message
		vm.message = '';

		// use the create function in the userService
		User.create(vm.userData)
		.then(function(res) {
			vm.processing = false;

			// clear the form
			vm.userData = {};
			
			if(res && res.data){

				vm.message = res.data.message;
			}else{
				vm.message = 'failed to make user: no response message';
			}
		});
	};
})

// controller applied to user edit page
.controller('userEditController', function($routeParams, User) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
	.then(function(res) {
		
		if(res && res.data){

			vm.userData = res.data;
		}else{
			vm.userData = {};
		}
	});

	// function to save the user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// call the userService function to update
		User.update($routeParams.user_id, vm.userData)
		.then(function(res) {

			vm.processing = false;

			// clear the form
			vm.userData = {};

			if(res && res.data){

				// bind the message from our API to vm.message
				vm.message = res.data.message;
			}else{
				vm.message = 'failed to make user: no response message';
			}
		});
	};

});
