angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();

		// get user information on route change
		Auth.getUser()
		.then(function(res) {
			
			if(res && res.data){

				vm.user = res.data;
			}else{
				vm.user = {};
			}
		});
	});

	// function to handle login form
	vm.doLogin = function() {

		vm.processing = true;
		
		// clear the error
		vm.error = '';

		// call the Auth.login() function
		Auth.login(vm.loginData.username, vm.loginData.password)
		.then(function(res) {

			vm.processing = false;

			if(res && res.data){
				// if a user successfully logs in, redirect to users page
				if (res.data.success){
					$location.path('/users');
				}else{
					vm.error = res.data.message;
				}
			}else{
				vm.error = "error: no response message";
			}
		});
	};
	// function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		// reset all user info
		vm.user = {};
		$location.path('/login');
	};
});
