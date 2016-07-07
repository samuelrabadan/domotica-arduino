var con = angular.module('domotica.services', ['btford.socket-io']).
	factory('mySocket', function (socketFactory) {
		return socketFactory();
    });
