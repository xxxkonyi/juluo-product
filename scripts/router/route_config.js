/**
 * Code by baixiaosheng on 2015/7/13.
 */
webapp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('index', {
            url: "/",
            views: {
                '': {
                    templateUrl: 'main.html',
                    controller: function ($scope) {
                        $scope.wrapperBg = 'JL-bg1';
                    }
                },
                'header': {
                    templateUrl: 'public/header.html',
                    controller: function ($scope) {
                        $scope.navActive = 'index';
                    }
                },
                'login': {
                    templateUrl: 'public/login.html'
                },
                'footer@index': {
                    templateUrl: 'public/footer.html'
                }
            }
        })
        .state('myparty', {
            url: "/myparty",
            views: {
                '': {
                    templateUrl: 'my-party.html'
                },
                'header': {
                    templateUrl: 'public/header.html',
                    controller: function ($scope) {
                        $scope.navActive = 'myparty';
                    }
                },
                'login': {
                    templateUrl: 'public/login.html'
                },
                'user': {
                    templateUrl: 'public/user-manager.html'
                },
                'footer@myparty': {
                    templateUrl: 'public/footer.html'
                }
            }
        })
        .state('createparty', {
            url: "/createparty",
            views: {
                '': {
                    templateUrl: 'create-party.html'
                },
                'header': {
                    templateUrl: 'public/header.html',
                    controller: function ($scope) {
                        $scope.navActive = 'createparty';
                    }
                },
                'login': {
                    templateUrl: 'public/login.html'
                },
                'map': {
                    templateUrl: 'public/map.html'
                },
                'footer@createparty': {
                    templateUrl: 'public/footer.html'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'webapp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../scripts/plugins/bootstrap/css/font-awesome.css',
                            '../scripts/plugins/bootstrap/css/bootstrap-datepicker3.css',
                            '../scripts/plugins/bootstrap/css/bootstrap-timepicker.css',

                            '../scripts/plugins/bootstrap/js/bootstrap-datepicker.js',
                            '../scripts/plugins/bootstrap/js/bootstrap-timepicker.js',

                            '../scripts/pages/map.js',
                            '../scripts/pages/create-party.js'
                        ]
                    }]);
                }]
            }
        })
        .state('detail', {
            url: "/detail/{partyId}",
            views: {
                '': {
                    templateUrl: 'activity.html'
                },
                'header': {
                    templateUrl: 'public/header.html',
                    controller: function ($scope) {
                        $scope.navActive = 'myparty';
                    }
                },
                'login': {
                    templateUrl: 'public/login.html'
                },
                'footer@detail': {
                    templateUrl: 'public/footer.html'
                }
            }
        });
}]);