(function (angular) {
    'use strict';
    angular
        .module('postApp', [])
        .filter('highlight', function() {
            return function(text, phrase) {
                return phrase
                    ? text.replace(new RegExp('('+phrase+')', 'gi'), '<b class="hglt">$1</b>')
                    : text;
            };
        })
        .filter('trustHtml', [
            '$sce',
            function($sce) {
                return function(value) {
                    return $sce.trustAs('html', value);
                };
            }
        ])
        .factory('postFactory', ['$http',
            function ($http) {
                return {
                    getPosts: function () {
                        return $http.get('https://jsonplaceholder.typicode.com/posts');
                    },
                    getUsers: function () {
                        return $http.get('https://jsonplaceholder.typicode.com/users');
                    }
                };
            }])
        .component('postList', {
            templateUrl: 'postList.html',
            controller: ['$scope', 'postFactory',
                function ($scope, postFactory) {
                    var self = this;
                    self.state = 0;
                    self.handleSearch = function ($event) {
                        self.query = $event.value;
                    };

                    postFactory.getPosts().then(function (response) {
                        self.posts = response.data;
                        postFactory.getUsers().then(function (response) {
                            self.users = response.data;
                            self.usersMap = {};
                            var item, j, k, user;
                            for (j in self.users) {
                                item = self.users[j];
                                self.usersMap[item.id] = item;
                            }
                            for (k in self.posts) {
                                item = self.posts[k];
                                user = self.usersMap[item.userId];
                                item.name = user.name;
                                item.email = user.email;
                            }

                            self.state = 1;
                        }, function (response, status) {
                            self.state = 2;
                        });

                    }, function (response, status) {
                        self.state = 2;
                    });
                }
            ]
        })
        .component('postDetail', {
            templateUrl: 'postDetail.html',
            bindings: {
                post: '<',
                query: '<'
            }
        })

        .component('searchBar' , {
            templateUrl: 'searchBar.html',
            bindings: {
                onSubmit: '&'
            },
            controller: ['$scope',
                function ($scope) {
                    var self = this;
                    self.onChange = function(){
                        self.onSubmit({
                            $event: {
                                value: $scope.query
                            }
                        });
                    };
                }
            ]
        });

})(window.angular);
