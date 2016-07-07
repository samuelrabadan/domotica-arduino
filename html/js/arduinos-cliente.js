//var socket = io.connect('http://172.26.0.101:3000');
var texto;

socket.on('messages', function(data) {
	alert(data);
});

socket.on('pulsador', function(data) {
	texto=data;
	document.getElementById('sensorEstado').innerHTML =texto;
});
/*
socket.on('sensor', function(data) {
	texto=data;
	document.getElementById("cambiar").innerHTML =texto;
});

*/
socket.on('actuadorEstado', function(data) {
	texto=data;
	document.getElementById("actuadorEstado").innerHTML =texto;
});
/*
socket.on('senluz', function(data) {
	texto=data;
	document.getElementById("senluzEstado").innerHTML =texto;
});
*/
function leer_recetas(receta){
	var xhr; 

	//Rutina de Ajax para poder actualizar informaciÃ³n vÃ­a PHP sin refrescar la pÃ¡gina
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();  
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");  
	}

	var sentencia = "SELECT * FROM recetas WHERE nombre = '" + receta + "'" ;
	var data = "sentencia=" + sentencia; 
	xhr.open("POST", "comandosdb.php", true);   
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
	xhr.send(data); 
	window.location.reload(true);
}