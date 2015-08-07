/**
 * Code by baixiaosheng on 2015/7/13.
 */
webapp.controller('index', function ($scope, $state, $log, $timeout, $localStorage, AuthenticationFactory, ApplicationContext, AuthRestangular) {
    $localStorage.authToken ? $scope.isLoggedIn = true : $scope.isLoggedIn = false;
    $scope.user = $localStorage.username ? {username: $localStorage.username} : {};
    $scope.dropdownShowOrHide = false;
    $scope.partyTitle = '';
    $scope.showLoginForm = function () {
        $scope.loginFormShowOrHide = true;
    };
    $scope.hideLoginForm = function () {
        $scope.loginFormShowOrHide = false;
    };
    $scope.showDropdown = function () {
        $scope.dropdownShowOrHide = !$scope.dropdownShowOrHide;
    };
    $scope.loginSubmit = function () {
        AuthenticationFactory.login($scope.user.username, $scope.user.password, onLoginSuccess, onLoginFailure);
    };
    $scope.logout = function () {
        AuthenticationFactory.logout(onLogoutSuccess);
    };

    $scope.showMap = function () {
        $scope.mapShowOrHide = true;
    };
    $scope.hideMap = function () {
        $scope.mapShowOrHide = false;
    };

    $scope.showUser = function (partyId, partyTitle) {
        console.log(partyTitle);
        $scope.partyTitle = partyTitle;
        AuthRestangular.one('f/parties/' + partyId + '/requests').getList().then(function (data) {
            $scope.requests = data;
            console.log(data);
            $log.debug('User get requests');
        }, function () {
            $log.debug('Server  get requests failure');
        });
        AuthRestangular.one('f/parties/' + partyId + '/members').getList().then(function (data) {
            $scope.members = data;
            console.log(data);
            $log.debug('User get members');
        }, function () {
            $log.debug('Server  get members failure');
        });

        $scope.userShowOrHide = true;
    };
    $scope.hideUser = function () {
        $scope.members = '';
        $scope.requests = '';
        $scope.userShowOrHide = false;
    };
    var onLoginSuccess = function () {
        $log.debug('Login was successful. Handling success workflow.');
        $scope.loginFormShowOrHide = false;
        $scope.isLoggedIn = true;
        $timeout(function () {
            // Check for a pre-login state
            $localStorage.username = $scope.user.username;
            var preLoginState = ApplicationContext.getPreLoginState();
            if (preLoginState) {
                $log.debug('Found pre login state ' + preLoginState.toState);
                $state.go(preLoginState.toState, preLoginState.toParams, {reload: true});
            } else {
                if ($state.current.name !== '') {
                    $state.reload();
                }
            }
        });
    };

    var onLoginFailure = function (message) {
        $log.error('Incorrect credentials', message);
        alert('账号或密码错误');
    };
    var onLogoutSuccess = function () {
        $log.debug('Logout was successful. Handling success workflow.');
        $scope.dropdownShowOrHide = false;
        $scope.isLoggedIn = false;
        $timeout(function () {
            $state.go('index', {}, {reload: true});
        });
    };
    var onRememberMeFailure = function (message) {
        $log.debug(message);
    };
    if (!ApplicationContext.isLoggedIn()) {
        $log.debug('User is not currently logged in. Going to try remember-me to se if user there.');
        // Check for a cookie to login
        // If the cookie auth token is there, assume logged in while waiting for the getUser call
        AuthenticationFactory.remember(onLoginSuccess, onRememberMeFailure);
    }
});
webapp.controller('myParty', function ($scope, AuthRestangular, $log) {
    AuthRestangular.one('f/my').getList('parties').then(function (data) {
        $scope.parties = data;
        $log.debug('User get my parties');
    }, function () {
        $log.debug('Server get my parties failure');
    });
});

webapp.controller('createParty', function ($scope, AuthRestangular, $log, $state) {
    $scope.myparties = {
        poster2: 'http://upload-bg.png'
    };
    $scope.changeUrl = function (url) {
        $scope.myparties.poster2 = url;
    };
    $scope.createSubmit = function () {
        if (!$scope.myparties.poster) {
            $scope.parties.poster = $scope.myparties.poster2;
        } else {
            $scope.parties.poster = $scope.myparties.poster.base64;
        }
        $scope.parties.startTime = $scope.myparties.startTimeDate + 'T' + $scope.myparties.startTimeTime + ':00';
        $scope.parties.endTime = $scope.myparties.endTimeDate + 'T' + $scope.myparties.endTimeTime + ':00';
        AuthRestangular.one('f/my/parties').customPOST($scope.parties).then(function (data) {
            $state.go('myparty', {}, {reload: true});
            $log.debug('User get my parties');
        }, function () {
            $log.debug('Server get my parties failure');
        });
    }
});

webapp.controller('partyDetail', function ($scope, AuthRestangular, $log, $state, $stateParams) {
    AuthRestangular.one('f/parties/' + $stateParams.partyId).get().then(function (data) {
        $scope.party = data;
        $log.debug('User get party detail');
    }, function () {
        $log.debug('Server get party detail failure');
    });
    AuthRestangular.one('f/parties/' + $stateParams.partyId + '/members/count').get().then(function (data) {
        $scope.coutJoinParty = data;
        $log.debug('User get count join party person');
    }, function () {
        $log.debug('Server  get count join party person failure');
    });
    $scope.applyParty = function (partyId) {
        AuthRestangular.one('f/my/parties/' + partyId + '/requests').customPOST().then(function (data) {
            $state.go('detail', {partyId: partyId}, {reload: true});
            $log.debug('User apply party success');
        }, function () {
            $log.debug('Server apply party failure');
        });
    }
});
webapp.controller('userjoin', function ($scope, AuthRestangular, $log, $state) {
    $scope.agree = function (partyId, memberId) {
        AuthRestangular.one('f/my/parties/' + partyId + '/requests').customPUT({memberId: memberId}).then(function (data) {
            $log.debug('User agree success');
        }, function () {
            $log.debug('Server agree failure');
        });
    };
    $scope.refuse = function (partyId, memberId) {
        AuthRestangular.one('f/my/parties/' + partyId).customDELETE('/requests', {memberId: memberId}).then(function (data) {
                $log.debug('User refuse success');
            }, function () {
                $log.debug('Server refuse failure');
            }
        )
        ;
    };
})
;