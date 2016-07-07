var socket = io.connect('http://172.26.0.101:3000');


var con = angular.module('domotica.controllers', []);	

con.controller('sensorCtrl', function($scope,$timeout,dateFilter) {
	$scope.cambiarEstado = function(data){
	      $timeout(function(){
//	    	  if ((data!='') && (data!=null) && (data!=undefined)&& (data!="undefined")) {
	  	        $scope.sensorEstado = data;
//	    	  }
	    	  $scope.cambiarEstado();
	      },1500);
	  };
	socket.on('sensor', function(data) {
		  $scope.cambiarEstado(data);
	});
	socket.on('pulsador', function(data) {
		  $scope.cambiarEstado(data);
	});
});	

con.controller('actuadorCtrl', function($scope,$timeout,dateFilter) {
	$scope.cambiarEstado = function(data){
	      $timeout(function(){
//	    	  if ((data!='') && (data!=null) && (data!=undefined)&& (data!="undefined")) {
	  	        $scope.actuadorEstado = data;
//	    	  }
	    	  $scope.cambiarEstado();
	      },1500);
	  };
	socket.on('ledEstado', function(data) {
		  $scope.cambiarEstado(data);
	});
	socket.on('actuadorEstado', function(data) {
		  $scope.cambiarEstado(data);
	});
});	



con.controller('actuadorController', function ($scope, $rootScope, mySocket) {
	$scope.$on('LedON', function(event, args) {
		$scope.estado="LED encendido";
	});
	$scope.$on('LedOFF', function(event, args) {
		$scope.estado="LED apagado";
	});
	$scope.$on('ReleON', function(event, args) {
		$scope.estado="Relé encendido";
	});
	$scope.$on('ReleOFF', function(event, args) {
		$scope.estado="Relé apagado";
	});
	$scope.$on('ServoON', function(event, args) {
		$scope.estado="Motor encendido";
	});
	$scope.$on('ServoOFF', function(event, args) {
		$scope.estado="Motor apagado";
	});
	$scope.$on('PiezoON', function(event, args) {
		$scope.estado="Zumbador encendido";
	});
	$scope.$on('PiezoOFF', function(event, args) {
		$scope.estado="Zumbador apagado";
	});
});

con.controller('relojCtrl', function($scope,$timeout,dateFilter) {
  $scope.updateTime = function(){
      $timeout(function(){
        $scope.theclock = (dateFilter(new Date(), 'hh:mm:ss'));
        $scope.updateTime();
      },1000);
  };
  $scope.updateTime();
});	

con.controller('ArduController', function ($scope, $rootScope, mySocket) {
	$scope.actuadorOn = function (pinEnviado, actuadorEnviado) {
		if (actuadorEnviado == "led"){
			mySocket.emit('led:on',{ pin: pinEnviado});
			$rootScope.$broadcast('LedON');
			actuadorJSON (actuadorEnviado, pinEnviado, true);
		} else if (actuadorEnviado == "miniserv"){
			mySocket.emit('servo:on',{ pin: pinEnviado});
			$rootScope.$broadcast('ServoON');
			actuadorJSON (actuadorEnviado, pinEnviado, true);
		} else if (actuadorEnviado == "rele"){
			mySocket.emit('rele:on',{ pin: pinEnviado});
			$rootScope.$broadcast('ReleON');
			actuadorJSON (actuadorEnviado, pinEnviado, true);
		} else if (actuadorEnviado == "zumbador"){
			mySocket.emit('piezo:on',{ pin: pinEnviado});
			$rootScope.$broadcast('PiezoON');
			actuadorJSON (actuadorEnviado, pinEnviado, true);
		}
	};
	$scope.actuadorOff = function (pinEnviado, actuadorEnviado) {
		if (actuadorEnviado == "led"){
			mySocket.emit('led:off',{ pin: pinEnviado});
			actuadorJSON (actuadorEnviado, pinEnviado, false);
			$rootScope.$broadcast('LedOFF');
		} else if (actuadorEnviado == "miniserv"){
			mySocket.emit('servo:off',{ pin: pinEnviado});
			actuadorJSON (actuadorEnviado, pinEnviado, false);
			$rootScope.$broadcast('ServoOFF');
		} else if (actuadorEnviado == "rele"){
			mySocket.emit('rele:off',{ pin: pinEnviado});
			actuadorJSON (actuadorEnviado, pinEnviado, false);
			$rootScope.$broadcast('ReleOFF');
		} else if (actuadorEnviado == "zumbador"){
			mySocket.emit('piezo:off',{ pin: pinEnviado});
			actuadorJSON (actuadorEnviado, pinEnviado, false);
			$rootScope.$broadcast('PiezoOFF');
		}
	};    
	
	$scope.ledOn = function (data) {
		mySocket.emit('led:on',{ pin: data});
	};
	$scope.ledOff = function (data) {
		mySocket.emit('led:off',{ pin: data});
	};    

	$scope.servoOn = function (data) {
		mySocket.emit('servo:on',{ pin: data});
	};
	$scope.servoOff = function (data) {
		mySocket.emit('servo:off',{ pin: data});
	};    

	$scope.zumbadorOn = function (data) {
		mySocket.emit('piezo:on',{ pin: data});
	};
	$scope.zumbadorOff = function (data) {
		mySocket.emit('piezo:off',{ pin: data});
	};    
	
	$scope.releOn = function (data) {
		mySocket.emit('rele:on',{ pin: data});
	};
	$scope.releOff = function (data) {
		mySocket.emit('rele:off',{ pin: data});
	};    
});