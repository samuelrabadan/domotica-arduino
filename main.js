//creamos una aplicación con express, que pasaremos a un servidor http y todo esto irá ligado al servidor de websockets que 
//creamos con socket.io
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var five = require("johnny-five");
var mysql = require('mysql');
var EtherPort = require("etherport");
var schedule = require('node-schedule');
var port = 3000; 

var board = new five.Board({ 
  port: new EtherPort(3030) 
});

var router = express.Router();
bodyParser  = require("body-parser"),
app.use(bodyParser.urlencoded({ extended: true }));  

app.post('/ordenSensor', function(req, res) {
	var comando;
	if ((req.body.comando==true) || (req.body.comando == "true")) {
		ejecutarReceta(req.body.actuador, true, req.body.pin);
	} else {
		ejecutarReceta(req.body.actuador, false, req.body.pin);
	}
res.end();	
req.emit('end');
});

app.post('/horaWeb', function(req, res) {
	var comando, horaActual;
var date = new Date();
var hora = date.getHours();	
var minuto = date.getMinutes();	
var segundo = date.getSeconds();	
horaActual = hora + ":" + minuto + ":" + segundo;
	
switch(req.body.condicion) {
	case "<":
		if ((req.body.hora < horaActual) && ((req.body.comando==true) || (req.body.comando == "true"))) {
			ejecutarReceta(req.body.actuador, true, req.body.pin);							
		} else {
			ejecutarReceta(req.body.actuador, false, req.body.pin);
		}
		break;
	case ">=":
		if ((req.body.hora >= horaActual) && ((req.body.comando==true) || (req.body.comando == "true"))) {
			ejecutarReceta(req.body.actuador, true, req.body.pin);							
		} else {
			ejecutarReceta(req.body.actuador, false, req.body.pin);
		}
		break;
}

	if ((req.body.comando==true) || (req.body.comando == "true")) {
		ejecutarReceta(req.body.actuador, true, req.body.pin);
	} else {
		ejecutarReceta(req.body.actuador, false, req.body.pin);
	}

	res.end();	
	req.emit('end');
});

app.use(router);
app.listen(3001, function() {  
	  console.log("Servidor REST ejecutandose en http://172.26.1.101:3001");
	});

var router = express.Router();



//tenemos que indicar cual es la ruta que tendrán los ficheros estáticos, lo hacemos con el middleware express.static
app.use(express.static('html'));

app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/index.php');
});

//Pondremos el servidor a escuchar en localhost con el puerto 8080
server.listen(port);  
console.log('Server available at http://172.26.0.101:' + port);  

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'domotica'
});

connection.connect(function(error){
   if(error){
	   throw error;
   } else {
	   console.log('Conexion correcta.');
   }
});
var led0, zumbador0, rele0, miniservo0, pulsador0, sensor0;
var led1, zumbador1, rele1, miniservo1, pulsador1, sensor1;
var led2, zumbador2, rele2, miniservo2, pulsador2, sensor2;
var led3, zumbador3, rele3, miniservo3, pulsador3, sensor3;
var led4, zumbador4, rele4, miniservo4, pulsador4, sensor4;
var led5, zumbador5, rele5, miniservo5, pulsador5, sensor5;
var led6, zumbador6, rele6, miniservo6, pulsador6, sensor6;
var led7, zumbador7, rele7, miniservo7, pulsador7, sensor7;
var led8, zumbador8, rele8, miniservo8, pulsador8, sensor8;
var led9, zumbador9, rele9, miniservo9, pulsador9, sensor9;
var led10, zumbador10, rele10, miniservo10, pulsador10, sensor10;
var led11, zumbador11, rele11, miniservo11, pulsador11, sensor11;
var led12, zumbador12, rele12, miniservo12, pulsador12, sensor12;
var led13, zumbador13, rele13, miniservo13, pulsador13, sensor13;

//Ahora necesitamos que el servidor de websockets, que lo tenemos en la variable io, esté atento a que se realice una conexión. 
//Eso lo logramos con io.on() y pasándole el mensaje connection. Dentro de éste método enviaremos el array de objetos mensaje con el evento 'messages'
io.on('connection', function(socket) {  
	console.log(socket.id + ' se ha conectado');

    socket.on('led:on', function (data) {
    	ejecutarReceta('led', true, data.pin);
		io.emit('actuadorEstado', 'ZZZZ LED encendido');
    	
    });
    socket.on('led:off', function (data) {
    	ejecutarReceta('led', false, data.pin);
		io.emit('actuadorEstado', 'ZZZZZ LED apagado');
    }); 
    socket.on('servo:on', function (data) {
    	ejecutarReceta('servo', true, data.pin);
    });
    socket.on('servo:off', function (data) {
    	ejecutarReceta('servo', false, data.pin);
    });
    socket.on('piezo:on', function (data) {
    	ejecutarReceta('piezo', true, data.pin);
    });
    socket.on('piezo:off', function (data) {
    	ejecutarReceta('piezo', false, data.pin);
    });
    socket.on('rele:on', function (data) {
    	ejecutarReceta('rele', true, data.pin);
    });
    socket.on('rele:off', function (data) {
    	ejecutarReceta('rele', false, data.pin);
    });
});

var query_recetas = 'SELECT r.io on_off, ' 
						+ ' r.nombre nombre_receta, '
						+ ' r.accion_nombre sensor_nombre, '
						+ ' r.reaccion_nombre actuador_nombre, '
						+ ' r.condicion_nombre condicion_nombre, '
						+ ' r.valor_condicion condicion_valor, '
						+ ' r.hora_condicion condicion_hora, '
						+ ' r.arduino_nombre arduino_nombre, '
						+ ' s.nombre, '
						+ ' s.pin sensor_pin, '
						+ ' s.sensor_codigo sensor_tipo_codigo, '
						+ ' st.codigo, '
						+ ' st.tipo sensor_a_d, '
						+ ' st.web sensor_web, '
						+ ' st.condicion_familia_nombre sensor_condicion_familia_nombre, '
						+ ' a.nombre actuador_nombre, '
						+ ' a.pin actuador_pin, '
						+ ' a.actuador_codigo actuador_tipo_codigo, '
						+ ' at.codigo, '
						+ ' at.tipo actuador_a_d, '
						+ ' c.valor condicion_simbolo '
					+ ' FROM recetas r '
					+ ' LEFT JOIN sensores s '
						+ ' ON r.accion_nombre = s.nombre '
					+ ' LEFT JOIN sensores_tipos st '
						+ ' ON s.sensor_codigo = st.codigo '
					+ ' LEFT JOIN actuadores a '
						+ ' ON r.reaccion_nombre =a.nombre '
					+ ' LEFT JOIN actuadores_tipos at '
						+ ' ON a.actuador_codigo = at.codigo '
					+ ' LEFT JOIN condiciones c '
						+ ' ON r.condicion_nombre = c.nombre '
					+ ' ORDER BY 2';

//receta será un array que contenga los valores de todas las recetas configuradas
var receta = [];
						
var query = connection.query(query_recetas, function(error, result){
	if(error){
		throw error;
    } else {
		receta=result;
    }
connection.end();

});

/*			receta.on_off
			receta.nombre_receta
			receta.sensor_nombre
			receta.actuador_nombre
			receta.condicion_nombre
---------------------NO	--------receta.condicion_valor-----------------------------
			receta.condicion_hora
			receta.sensor_condicion_familia_nombre 
			receta.condicion_simbolo
			receta.sensor_pin
			receta.sensor_tipo_codigo
			receta.sensor_a_d
			receta.sensor_web
			receta.actuador_pin
			receta.actuador_tipo_codigo
			receta.actuador_a_d
			receta.arduino_nombre
*/


function mostrar_recetas(){
	for (var i = 0; i < receta.length; i++) {
		console.log("i: "+ i);
		console.log("receta: "+ receta[i].nombre_receta);
		console.log("sensor_tipo_codigo: "+ receta[i].sensor_tipo_codigo);
		console.log("actuador_pin: "+ receta[i].actuador_pin);
	}
}
setTimeout(mostrar_recetas,1500);


/*
var MySQLEvents = require('mysql-events');
var dsn = {
  host:     "localhost",
  user:     "root",
  password: "1234",
};
var mysqlEventWatcher = MySQLEvents(dsn);
var watcher =mysqlEventWatcher.add(
  'domotica',
  function (oldRow, newRow) {
     //row inserted 
    if ((oldRow === null) || (newRow === null) || ((oldRow !== null && newRow !== null))) {
      io.emit('ready');
	  socket.emit('ready');
    }
  }
);
*/
	var ejecutado0 = false;
	var ejecutado1 = false;
	var ejecutado2 = false;
	var ejecutado3 = false;
	var ejecutado4 = false;
	var ejecutado5 = false;
	var ejecutado6 = false;
	var ejecutado7 = false;
	var ejecutado8 = false;
	var ejecutado9 = false;
	var ejecutado10 = false;
	var ejecutado11 = false;
	var ejecutado12 = false;
	var ejecutado13 = false;
	
	var ejecutadoA0 = false;
	var ejecutadoA1 = false;
	var ejecutadoA2 = false;
	var ejecutadoA3 = false;
	var ejecutadoA4 = false;
	var ejecutadoA5 = false;
	var programacion;
	var ejecutadoHora0 = false;
	var ejecutadoHora1 = false;
	var ejecutadoHora2 = false;
	var ejecutadoHora3 = false;
	var ejecutadoHora4 = false;
	var ejecutadoHora5 = false;
	var ejecutadoHora6 = false;
	var ejecutadoHora7 = false;
	var ejecutadoHora8 = false;
	var ejecutadoHora9 = false;
	var ejecutadoHora10 = false;
	var ejecutadoHora11 = false;
	var ejecutadoHora12 = false;
	var ejecutadoHora13 = false;
	var ejecutadoHora14 = false;
	var ejecutadoHora15 = false;
	var ejecutadoHora16 = false;
	var ejecutadoHora17 = false;
	var programado = [];	
	var valorGuardado = 0;
	
board.on('ready', function(){
	console.log('el microcontrolador está listo para su uso.');

//Configuramos las instancias correspondientes a cada uno de los actuadores configurados en las recetas

/////////////////////////////  RECETA 0  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[0] != null) {
		switch(receta[0].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[0].actuador_pin == "1") ||  (receta[0].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[0].actuador_pin == "2") || (receta[0].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[0].actuador_pin == "3") || (receta[0].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[0].actuador_pin == "4") || (receta[0].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[0].actuador_pin == "5") || (receta[0].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[0].actuador_pin == "6") || (receta[0].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[0].actuador_pin == "7") || (receta[0].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[0].actuador_pin == "8") || (receta[0].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[0].actuador_pin == "9") || (receta[0].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[0].actuador_pin == "10") || (receta[0].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[0].actuador_pin == "11") || (receta[0].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[0].actuador_pin == "12") || (receta[0].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[0].actuador_pin == "13") || (receta[0].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[0].actuador_pin == "1") ||  (receta[0].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[0].actuador_pin == "2") || (receta[0].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[0].actuador_pin == "3") || (receta[0].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[0].actuador_pin == "4") || (receta[0].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[0].actuador_pin == "5") || (receta[0].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[0].actuador_pin == "6") || (receta[0].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[0].actuador_pin == "7") || (receta[0].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[0].actuador_pin == "8") || (receta[0].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[0].actuador_pin == "9") || (receta[0].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[0].actuador_pin == "10") || (receta[0].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[0].actuador_pin == "11") || (receta[0].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[0].actuador_pin == "12") || (receta[0].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[0].actuador_pin == "13") || (receta[0].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[0].actuador_pin == "1") ||  (receta[0].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[0].actuador_pin == "2") || (receta[0].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[0].actuador_pin == "3") || (receta[0].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[0].actuador_pin == "4") || (receta[0].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[0].actuador_pin == "5") || (receta[0].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[0].actuador_pin == "6") || (receta[0].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[0].actuador_pin == "7") || (receta[0].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[0].actuador_pin == "8") || (receta[0].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[0].actuador_pin == "9") || (receta[0].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[0].actuador_pin == "10") || (receta[0].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[0].actuador_pin == "11") || (receta[0].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[0].actuador_pin == "12") || (receta[0].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[0].actuador_pin == "13") || (receta[0].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[0].actuador_pin == "1") ||  (receta[0].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "2") || (receta[0].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "3") || (receta[0].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "4") || (receta[0].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "5") || (receta[0].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "6") || (receta[0].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "7") || (receta[0].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "8") || (receta[0].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "9") || (receta[0].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "10") || (receta[0].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "11") || (receta[0].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "12") || (receta[0].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[0].actuador_pin == "13") || (receta[0].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[0].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[0].sensor_pin == "1") || (receta[0].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "2") || (receta[0].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "3") || (receta[0].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "4") || (receta[0].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "5") || (receta[0].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "6") || (receta[0].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "7") || (receta[0].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "8") || (receta[0].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "9") || (receta[0].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "10") || (receta[0].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "11") || (receta[0].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "12") || (receta[0].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[0].sensor_pin == "13") || (receta[0].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[0].sensor_pin == "1") || (receta[0].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[0].sensor_pin == "2") || (receta[0].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[0].sensor_pin == "3") || (receta[0].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[0].sensor_pin == "4") || (receta[0].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[0].sensor_pin == "5") || (receta[0].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[0].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[0].sensor_pin == "1") || (receta[0].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[0].sensor_pin == "2") || (receta[0].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[0].sensor_pin == "3") || (receta[0].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[0].sensor_pin == "4") || (receta[0].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[0].sensor_pin == "5") || (receta[0].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[0].sensor_pin == "6") || (receta[0].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[0].sensor_pin == "7") || (receta[0].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(0, "4", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[0].sensor_pin == "8") || (receta[0].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[0].sensor_pin == "9") || (receta[0].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[0].sensor_pin == "10") || (receta[0].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[0].sensor_pin == "11") || (receta[0].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[0].sensor_pin == "12") || (receta[0].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(0, "0",receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(0, "1",receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[0].sensor_pin == "13") || (receta[0].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(0, "0", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(0, "1", receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				valorGuardado =  1000-50*(receta[0].condicion_valor/1);

				
console.log(valorGuardado);



				if ((receta[0].sensor_pin == "1") || (receta[0].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(0, '' + 20-this.value/50, receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, valorGuardado, receta[0].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[0].sensor_pin == "2") || (receta[0].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(0, '' + 20-this.value/50, receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, valorGuardado, receta[0].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[0].sensor_pin == "3") || (receta[0].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(0, '' + 20-this.value/50, receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, valorGuardado, receta[0].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[0].sensor_pin == "4") || (receta[0].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(0, '' + 20-this.value/50, receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, valorGuardado, receta[0].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[0].sensor_pin == "5") || (receta[0].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(0, '' + 20-this.value/50, receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, valorGuardado, receta[0].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora0 = procesarEntrada(0, null, receta[0].sensor_condicion_familia_nombre, receta[0].condicion_simbolo, receta[0].condicion_valor, receta[0].condicion_hora, ejecutadoHora0);
				break;
		}
	}
/////////////////////////////  RECETA 1  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[1] != null) {
		switch(receta[1].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[1].actuador_pin == "1") ||  (receta[1].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[1].actuador_pin == "2") || (receta[1].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[1].actuador_pin == "3") || (receta[1].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[1].actuador_pin == "4") || (receta[1].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[1].actuador_pin == "5") || (receta[1].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[1].actuador_pin == "6") || (receta[1].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[1].actuador_pin == "7") || (receta[1].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[1].actuador_pin == "8") || (receta[1].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[1].actuador_pin == "9") || (receta[1].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[1].actuador_pin == "10") || (receta[1].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[1].actuador_pin == "11") || (receta[1].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[1].actuador_pin == "12") || (receta[1].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[1].actuador_pin == "13") || (receta[1].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[1].actuador_pin == "1") ||  (receta[1].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[1].actuador_pin == "2") || (receta[1].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[1].actuador_pin == "3") || (receta[1].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[1].actuador_pin == "4") || (receta[1].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[1].actuador_pin == "5") || (receta[1].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[1].actuador_pin == "6") || (receta[1].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[1].actuador_pin == "7") || (receta[1].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[1].actuador_pin == "8") || (receta[1].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[1].actuador_pin == "9") || (receta[1].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[1].actuador_pin == "10") || (receta[1].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[1].actuador_pin == "11") || (receta[1].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[1].actuador_pin == "12") || (receta[1].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[1].actuador_pin == "13") || (receta[1].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[1].actuador_pin == "1") ||  (receta[1].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[1].actuador_pin == "2") || (receta[1].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[1].actuador_pin == "3") || (receta[1].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[1].actuador_pin == "4") || (receta[1].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[1].actuador_pin == "5") || (receta[1].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[1].actuador_pin == "6") || (receta[1].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[1].actuador_pin == "7") || (receta[1].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[1].actuador_pin == "8") || (receta[1].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[1].actuador_pin == "9") || (receta[1].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[1].actuador_pin == "10") || (receta[1].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[1].actuador_pin == "11") || (receta[1].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[1].actuador_pin == "12") || (receta[1].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[1].actuador_pin == "13") || (receta[1].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[1].actuador_pin == "1") ||  (receta[1].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "2") || (receta[1].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "3") || (receta[1].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "4") || (receta[1].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "5") || (receta[1].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "6") || (receta[1].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "7") || (receta[1].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "8") || (receta[1].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "9") || (receta[1].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "10") || (receta[1].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "11") || (receta[1].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "12") || (receta[1].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[1].actuador_pin == "13") || (receta[1].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[1].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[1].sensor_pin == "1") || (receta[1].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "2") || (receta[1].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "3") || (receta[1].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "4") || (receta[1].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "5") || (receta[1].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "6") || (receta[1].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "7") || (receta[1].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "8") || (receta[1].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "9") || (receta[1].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "10") || (receta[1].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "11") || (receta[1].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "12") || (receta[1].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[1].sensor_pin == "13") || (receta[1].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[1].sensor_pin == "1") || (receta[1].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[1].sensor_pin == "2") || (receta[1].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[1].sensor_pin == "3") || (receta[1].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[1].sensor_pin == "4") || (receta[1].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[1].sensor_pin == "5") || (receta[1].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[1].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[1].sensor_pin == "1") || (receta[1].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[1].sensor_pin == "2") || (receta[1].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[1].sensor_pin == "3") || (receta[1].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[1].sensor_pin == "4") || (receta[1].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[1].sensor_pin == "5") || (receta[1].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[1].sensor_pin == "6") || (receta[1].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[1].sensor_pin == "7") || (receta[1].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(1, "4", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[1].sensor_pin == "8") || (receta[1].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[1].sensor_pin == "9") || (receta[1].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[1].sensor_pin == "10") || (receta[1].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[1].sensor_pin == "11") || (receta[1].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[1].sensor_pin == "12") || (receta[1].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(1, "0",receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(1, "1",receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[1].sensor_pin == "13") || (receta[1].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(1, "0", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(1, "1", receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[1].sensor_pin == "1") || (receta[1].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(1, '' + 20-this.value/50, receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[1].sensor_pin == "2") || (receta[1].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(1, '' + 20-this.value/50, receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[1].sensor_pin == "3") || (receta[1].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(1, '' + 20-this.value/50, receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[1].sensor_pin == "4") || (receta[1].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(1, '' + 20-this.value/50, receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[1].sensor_pin == "5") || (receta[1].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(1, '' + 20-this.value/50, receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora1 = procesarEntrada(1, null, receta[1].sensor_condicion_familia_nombre, receta[1].condicion_simbolo, receta[1].condicion_valor, receta[1].condicion_hora, ejecutadoHora1);
				break;
			}
	}
/////////////////////////////  RECETA 2  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[2] != null) {
		switch(receta[2].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[2].actuador_pin == "1") ||  (receta[2].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[2].actuador_pin == "2") || (receta[2].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[2].actuador_pin == "3") || (receta[2].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[2].actuador_pin == "4") || (receta[2].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[2].actuador_pin == "5") || (receta[2].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[2].actuador_pin == "6") || (receta[2].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[2].actuador_pin == "7") || (receta[2].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[2].actuador_pin == "8") || (receta[2].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[2].actuador_pin == "9") || (receta[2].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[2].actuador_pin == "10") || (receta[2].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[2].actuador_pin == "11") || (receta[2].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[2].actuador_pin == "12") || (receta[2].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[2].actuador_pin == "13") || (receta[2].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[2].actuador_pin == "1") ||  (receta[2].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[2].actuador_pin == "2") || (receta[2].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[2].actuador_pin == "3") || (receta[2].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[2].actuador_pin == "4") || (receta[2].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[2].actuador_pin == "5") || (receta[2].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[2].actuador_pin == "6") || (receta[2].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[2].actuador_pin == "7") || (receta[2].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[2].actuador_pin == "8") || (receta[2].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[2].actuador_pin == "9") || (receta[2].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[2].actuador_pin == "10") || (receta[2].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[2].actuador_pin == "11") || (receta[2].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[2].actuador_pin == "12") || (receta[2].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[2].actuador_pin == "13") || (receta[2].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[2].actuador_pin == "1") ||  (receta[2].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[2].actuador_pin == "2") || (receta[2].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[2].actuador_pin == "3") || (receta[2].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[2].actuador_pin == "4") || (receta[2].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[2].actuador_pin == "5") || (receta[2].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[2].actuador_pin == "6") || (receta[2].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[2].actuador_pin == "7") || (receta[2].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[2].actuador_pin == "8") || (receta[2].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[2].actuador_pin == "9") || (receta[2].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[2].actuador_pin == "10") || (receta[2].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[2].actuador_pin == "11") || (receta[2].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[2].actuador_pin == "12") || (receta[2].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[2].actuador_pin == "13") || (receta[2].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[2].actuador_pin == "1") ||  (receta[2].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "2") || (receta[2].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "3") || (receta[2].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "4") || (receta[2].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "5") || (receta[2].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "6") || (receta[2].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "7") || (receta[2].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "8") || (receta[2].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "9") || (receta[2].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "10") || (receta[2].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "11") || (receta[2].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "12") || (receta[2].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[2].actuador_pin == "13") || (receta[2].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[2].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[2].sensor_pin == "1") || (receta[2].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "2") || (receta[2].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "3") || (receta[2].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "4") || (receta[2].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "5") || (receta[2].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "6") || (receta[2].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "7") || (receta[2].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "8") || (receta[2].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "9") || (receta[2].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "10") || (receta[2].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "11") || (receta[2].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "12") || (receta[2].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[2].sensor_pin == "13") || (receta[2].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[2].sensor_pin == "1") || (receta[2].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[2].sensor_pin == "2") || (receta[2].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[2].sensor_pin == "3") || (receta[2].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[2].sensor_pin == "4") || (receta[2].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[2].sensor_pin == "5") || (receta[2].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[2].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[2].sensor_pin == "1") || (receta[2].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[2].sensor_pin == "2") || (receta[2].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[2].sensor_pin == "3") || (receta[2].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[2].sensor_pin == "4") || (receta[2].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[2].sensor_pin == "5") || (receta[2].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[2].sensor_pin == "6") || (receta[2].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[2].sensor_pin == "7") || (receta[2].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(2, "4", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[2].sensor_pin == "8") || (receta[2].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[2].sensor_pin == "9") || (receta[2].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[2].sensor_pin == "10") || (receta[2].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[2].sensor_pin == "11") || (receta[2].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[2].sensor_pin == "12") || (receta[2].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(2, "0",receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(2, "1",receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[2].sensor_pin == "13") || (receta[2].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(2, "0", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(2, "1", receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[2].sensor_pin == "1") || (receta[2].sensor_pin == 1)){
					sensor1.on("data", function() {
						console.log(this.value);
						ejecutadoA1 = procesarEntrada(2, '' + 20-this.value/50, receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[2].sensor_pin == "2") || (receta[2].sensor_pin == 2)){
					sensor2.on("data", function() {
						console.log(''+20-this.value/50);
						io.emit('sensor', ''+20-this.value/50);				

						ejecutadoA2 = procesarEntrada(2, '' + 20-this.value/50, receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[2].sensor_pin == "3") || (receta[2].sensor_pin == 3)){
					sensor3.on("data", function() {
						console.log(this.value);
						ejecutadoA3 = procesarEntrada(2, '' + 20-this.value/50, receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[2].sensor_pin == "4") || (receta[2].sensor_pin == 4)){
					sensor4.on("data", function() {
						console.log(this.value);
						ejecutadoA4 = procesarEntrada(2, '' + 20-this.value/50, receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[2].sensor_pin == "5") || (receta[2].sensor_pin == 5)){
					sensor5.on("data", function() {
						console.log(this.value);
						ejecutadoA5 = procesarEntrada(2, '' + 20-this.value/50, receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora2 = procesarEntrada(2, null, receta[2].sensor_condicion_familia_nombre, receta[2].condicion_simbolo, receta[2].condicion_valor, receta[2].condicion_hora, ejecutadoHora2);
				break;
			}
	}
	
/////////////////////////////  RECETA 3  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[3] != null) {
		switch(receta[3].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[3].actuador_pin == "1") ||  (receta[3].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[3].actuador_pin == "2") || (receta[3].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[3].actuador_pin == "3") || (receta[3].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[3].actuador_pin == "4") || (receta[3].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[3].actuador_pin == "5") || (receta[3].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[3].actuador_pin == "6") || (receta[3].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[3].actuador_pin == "7") || (receta[3].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[3].actuador_pin == "8") || (receta[3].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[3].actuador_pin == "9") || (receta[3].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[3].actuador_pin == "10") || (receta[3].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[3].actuador_pin == "11") || (receta[3].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[3].actuador_pin == "12") || (receta[3].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[3].actuador_pin == "13") || (receta[3].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[3].actuador_pin == "1") ||  (receta[3].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[3].actuador_pin == "2") || (receta[3].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[3].actuador_pin == "3") || (receta[3].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[3].actuador_pin == "4") || (receta[3].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[3].actuador_pin == "5") || (receta[3].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[3].actuador_pin == "6") || (receta[3].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[3].actuador_pin == "7") || (receta[3].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[3].actuador_pin == "8") || (receta[3].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[3].actuador_pin == "9") || (receta[3].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[3].actuador_pin == "10") || (receta[3].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[3].actuador_pin == "11") || (receta[3].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[3].actuador_pin == "12") || (receta[3].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[3].actuador_pin == "13") || (receta[3].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[3].actuador_pin == "1") ||  (receta[3].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[3].actuador_pin == "2") || (receta[3].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[3].actuador_pin == "3") || (receta[3].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[3].actuador_pin == "4") || (receta[3].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[3].actuador_pin == "5") || (receta[3].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[3].actuador_pin == "6") || (receta[3].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[3].actuador_pin == "7") || (receta[3].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[3].actuador_pin == "8") || (receta[3].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[3].actuador_pin == "9") || (receta[3].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[3].actuador_pin == "10") || (receta[3].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[3].actuador_pin == "11") || (receta[3].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[3].actuador_pin == "12") || (receta[3].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[3].actuador_pin == "13") || (receta[3].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[3].actuador_pin == "1") ||  (receta[3].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "2") || (receta[3].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "3") || (receta[3].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "4") || (receta[3].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "5") || (receta[3].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "6") || (receta[3].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "7") || (receta[3].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "8") || (receta[3].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "9") || (receta[3].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "10") || (receta[3].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "11") || (receta[3].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "12") || (receta[3].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[3].actuador_pin == "13") || (receta[3].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[3].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[3].sensor_pin == "1") || (receta[3].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "2") || (receta[3].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "3") || (receta[3].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "4") || (receta[3].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "5") || (receta[3].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "6") || (receta[3].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "7") || (receta[3].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "8") || (receta[3].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "9") || (receta[3].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "10") || (receta[3].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "11") || (receta[3].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "12") || (receta[3].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[3].sensor_pin == "13") || (receta[3].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[3].sensor_pin == "1") || (receta[3].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[3].sensor_pin == "2") || (receta[3].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[3].sensor_pin == "3") || (receta[3].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[3].sensor_pin == "4") || (receta[3].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[3].sensor_pin == "5") || (receta[3].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[3].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[3].sensor_pin == "1") || (receta[3].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[3].sensor_pin == "2") || (receta[3].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[3].sensor_pin == "3") || (receta[3].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[3].sensor_pin == "4") || (receta[3].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[3].sensor_pin == "5") || (receta[3].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[3].sensor_pin == "6") || (receta[3].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[3].sensor_pin == "7") || (receta[3].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(3, "4", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[3].sensor_pin == "8") || (receta[3].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[3].sensor_pin == "9") || (receta[3].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[3].sensor_pin == "10") || (receta[3].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[3].sensor_pin == "11") || (receta[3].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[3].sensor_pin == "12") || (receta[3].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(3, "0",receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(3, "1",receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[3].sensor_pin == "13") || (receta[3].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(3, "0", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(3, "1", receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[3].sensor_pin == "1") || (receta[3].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(3, '' + 20-this.value/50, receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[3].sensor_pin == "2") || (receta[3].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(3, '' + 20-this.value/50, receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[3].sensor_pin == "3") || (receta[3].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(3, '' + 20-this.value/50, receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[3].sensor_pin == "4") || (receta[3].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(3, '' + 20-this.value/50, receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[3].sensor_pin == "5") || (receta[3].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(3, '' + 20-this.value/50, receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora3 = procesarEntrada(3, null, receta[3].sensor_condicion_familia_nombre, receta[3].condicion_simbolo, receta[3].condicion_valor, receta[3].condicion_hora, ejecutadoHora3);
				break;				
			}
	}
	
/////////////////////////////  RECETA 4  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[4] != null) {
		switch(receta[4].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[4].actuador_pin == "1") ||  (receta[4].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[4].actuador_pin == "2") || (receta[4].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[4].actuador_pin == "3") || (receta[4].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[4].actuador_pin == "4") || (receta[4].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[4].actuador_pin == "5") || (receta[4].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[4].actuador_pin == "6") || (receta[4].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[4].actuador_pin == "7") || (receta[4].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[4].actuador_pin == "8") || (receta[4].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[4].actuador_pin == "9") || (receta[4].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[4].actuador_pin == "10") || (receta[4].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[4].actuador_pin == "11") || (receta[4].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[4].actuador_pin == "12") || (receta[4].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[4].actuador_pin == "13") || (receta[4].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[4].actuador_pin == "1") ||  (receta[4].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[4].actuador_pin == "2") || (receta[4].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[4].actuador_pin == "3") || (receta[4].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[4].actuador_pin == "4") || (receta[4].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[4].actuador_pin == "5") || (receta[4].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[4].actuador_pin == "6") || (receta[4].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[4].actuador_pin == "7") || (receta[4].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[4].actuador_pin == "8") || (receta[4].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[4].actuador_pin == "9") || (receta[4].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[4].actuador_pin == "10") || (receta[4].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[4].actuador_pin == "11") || (receta[4].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[4].actuador_pin == "12") || (receta[4].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[4].actuador_pin == "13") || (receta[4].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[4].actuador_pin == "1") ||  (receta[4].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[4].actuador_pin == "2") || (receta[4].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[4].actuador_pin == "3") || (receta[4].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[4].actuador_pin == "4") || (receta[4].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[4].actuador_pin == "5") || (receta[4].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[4].actuador_pin == "6") || (receta[4].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[4].actuador_pin == "7") || (receta[4].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[4].actuador_pin == "8") || (receta[4].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[4].actuador_pin == "9") || (receta[4].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[4].actuador_pin == "10") || (receta[4].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[4].actuador_pin == "11") || (receta[4].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[4].actuador_pin == "12") || (receta[4].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[4].actuador_pin == "13") || (receta[4].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[4].actuador_pin == "1") ||  (receta[4].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "2") || (receta[4].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "3") || (receta[4].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "4") || (receta[4].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "5") || (receta[4].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "6") || (receta[4].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "7") || (receta[4].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "8") || (receta[4].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "9") || (receta[4].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "10") || (receta[4].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "11") || (receta[4].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "12") || (receta[4].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[4].actuador_pin == "13") || (receta[4].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[4].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[4].sensor_pin == "1") || (receta[4].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "2") || (receta[4].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "3") || (receta[4].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "4") || (receta[4].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "5") || (receta[4].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "6") || (receta[4].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "7") || (receta[4].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "8") || (receta[4].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "9") || (receta[4].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "10") || (receta[4].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "11") || (receta[4].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "12") || (receta[4].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[4].sensor_pin == "13") || (receta[4].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[4].sensor_pin == "1") || (receta[4].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[4].sensor_pin == "2") || (receta[4].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[4].sensor_pin == "3") || (receta[4].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[4].sensor_pin == "4") || (receta[4].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[4].sensor_pin == "5") || (receta[4].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[4].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[4].sensor_pin == "1") || (receta[4].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[4].sensor_pin == "2") || (receta[4].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[4].sensor_pin == "3") || (receta[4].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[4].sensor_pin == "4") || (receta[4].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[4].sensor_pin == "5") || (receta[4].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[4].sensor_pin == "6") || (receta[4].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[4].sensor_pin == "7") || (receta[4].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(4, "4", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[4].sensor_pin == "8") || (receta[4].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[4].sensor_pin == "9") || (receta[4].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[4].sensor_pin == "10") || (receta[4].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[4].sensor_pin == "11") || (receta[4].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[4].sensor_pin == "12") || (receta[4].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(4, "0",receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(4, "1",receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[4].sensor_pin == "13") || (receta[4].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(4, "0", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(4, "1", receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[4].sensor_pin == "1") || (receta[4].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(4, '' + 20-this.value/50, receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[4].sensor_pin == "2") || (receta[4].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(4, '' + 20-this.value/50, receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[4].sensor_pin == "3") || (receta[4].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(4, '' + 20-this.value/50, receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[4].sensor_pin == "4") || (receta[4].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(4, '' + 20-this.value/50, receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[4].sensor_pin == "5") || (receta[4].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(4, '' + 20-this.value/50, receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora4 = procesarEntrada(4, null, receta[4].sensor_condicion_familia_nombre, receta[4].condicion_simbolo, receta[4].condicion_valor, receta[4].condicion_hora, ejecutadoHora4);
				break;
			}
	}
	
/////////////////////////////  RECETA 5  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[5] != null) {
		switch(receta[5].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[5].actuador_pin == "1") ||  (receta[5].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[5].actuador_pin == "2") || (receta[5].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[5].actuador_pin == "3") || (receta[5].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[5].actuador_pin == "4") || (receta[5].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[5].actuador_pin == "5") || (receta[5].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[5].actuador_pin == "6") || (receta[5].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[5].actuador_pin == "7") || (receta[5].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[5].actuador_pin == "8") || (receta[5].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[5].actuador_pin == "9") || (receta[5].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[5].actuador_pin == "10") || (receta[5].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[5].actuador_pin == "11") || (receta[5].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[5].actuador_pin == "12") || (receta[5].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[5].actuador_pin == "13") || (receta[5].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[5].actuador_pin == "1") ||  (receta[5].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[5].actuador_pin == "2") || (receta[5].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[5].actuador_pin == "3") || (receta[5].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[5].actuador_pin == "4") || (receta[5].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[5].actuador_pin == "5") || (receta[5].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[5].actuador_pin == "6") || (receta[5].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[5].actuador_pin == "7") || (receta[5].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[5].actuador_pin == "8") || (receta[5].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[5].actuador_pin == "9") || (receta[5].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[5].actuador_pin == "10") || (receta[5].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[5].actuador_pin == "11") || (receta[5].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[5].actuador_pin == "12") || (receta[5].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[5].actuador_pin == "13") || (receta[5].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[5].actuador_pin == "1") ||  (receta[5].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[5].actuador_pin == "2") || (receta[5].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[5].actuador_pin == "3") || (receta[5].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[5].actuador_pin == "4") || (receta[5].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[5].actuador_pin == "5") || (receta[5].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[5].actuador_pin == "6") || (receta[5].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[5].actuador_pin == "7") || (receta[5].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[5].actuador_pin == "8") || (receta[5].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[5].actuador_pin == "9") || (receta[5].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[5].actuador_pin == "10") || (receta[5].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[5].actuador_pin == "11") || (receta[5].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[5].actuador_pin == "12") || (receta[5].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[5].actuador_pin == "13") || (receta[5].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[5].actuador_pin == "1") ||  (receta[5].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "2") || (receta[5].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "3") || (receta[5].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "4") || (receta[5].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "5") || (receta[5].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "6") || (receta[5].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "7") || (receta[5].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "8") || (receta[5].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "9") || (receta[5].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "10") || (receta[5].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "11") || (receta[5].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "12") || (receta[5].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[5].actuador_pin == "13") || (receta[5].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[5].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[5].sensor_pin == "1") || (receta[5].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "2") || (receta[5].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "3") || (receta[5].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "4") || (receta[5].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "5") || (receta[5].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "6") || (receta[5].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "7") || (receta[5].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "8") || (receta[5].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "9") || (receta[5].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "10") || (receta[5].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "11") || (receta[5].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "12") || (receta[5].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[5].sensor_pin == "13") || (receta[5].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[5].sensor_pin == "1") || (receta[5].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[5].sensor_pin == "2") || (receta[5].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[5].sensor_pin == "3") || (receta[5].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[5].sensor_pin == "4") || (receta[5].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[5].sensor_pin == "5") || (receta[5].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[5].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[5].sensor_pin == "1") || (receta[5].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[5].sensor_pin == "2") || (receta[5].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[5].sensor_pin == "3") || (receta[5].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[5].sensor_pin == "4") || (receta[5].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[5].sensor_pin == "5") || (receta[5].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[5].sensor_pin == "6") || (receta[5].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[5].sensor_pin == "7") || (receta[5].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(5, "4", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[5].sensor_pin == "8") || (receta[5].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[5].sensor_pin == "9") || (receta[5].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[5].sensor_pin == "10") || (receta[5].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[5].sensor_pin == "11") || (receta[5].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[5].sensor_pin == "12") || (receta[5].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(5, "0",receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(5, "1",receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[5].sensor_pin == "13") || (receta[5].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(5, "0", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(5, "1", receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[5].sensor_pin == "1") || (receta[5].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(5, '' + 20-this.value/50, receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[5].sensor_pin == "2") || (receta[5].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(5, '' + 20-this.value/50, receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[5].sensor_pin == "3") || (receta[5].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(5, '' + 20-this.value/50, receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[5].sensor_pin == "4") || (receta[5].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(5, '' + 20-this.value/50, receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[5].sensor_pin == "5") || (receta[5].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(5, '' + 20-this.value/50, receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora5 = procesarEntrada(5, null, receta[5].sensor_condicion_familia_nombre, receta[5].condicion_simbolo, receta[5].condicion_valor, receta[5].condicion_hora, ejecutadoHora5);
				break;
			}
	}
	
/////////////////////////////  RECETA 6  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[6] != null) {
		switch(receta[6].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[6].actuador_pin == "1") ||  (receta[6].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[6].actuador_pin == "2") || (receta[6].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[6].actuador_pin == "3") || (receta[6].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[6].actuador_pin == "4") || (receta[6].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[6].actuador_pin == "5") || (receta[6].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[6].actuador_pin == "6") || (receta[6].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[6].actuador_pin == "7") || (receta[6].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[6].actuador_pin == "8") || (receta[6].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[6].actuador_pin == "9") || (receta[6].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[6].actuador_pin == "10") || (receta[6].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[6].actuador_pin == "11") || (receta[6].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[6].actuador_pin == "12") || (receta[6].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[6].actuador_pin == "13") || (receta[6].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[6].actuador_pin == "1") ||  (receta[6].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[6].actuador_pin == "2") || (receta[6].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[6].actuador_pin == "3") || (receta[6].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[6].actuador_pin == "4") || (receta[6].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[6].actuador_pin == "5") || (receta[6].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[6].actuador_pin == "6") || (receta[6].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[6].actuador_pin == "7") || (receta[6].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[6].actuador_pin == "8") || (receta[6].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[6].actuador_pin == "9") || (receta[6].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[6].actuador_pin == "10") || (receta[6].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[6].actuador_pin == "11") || (receta[6].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[6].actuador_pin == "12") || (receta[6].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[6].actuador_pin == "13") || (receta[6].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[6].actuador_pin == "1") ||  (receta[6].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[6].actuador_pin == "2") || (receta[6].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[6].actuador_pin == "3") || (receta[6].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[6].actuador_pin == "4") || (receta[6].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[6].actuador_pin == "5") || (receta[6].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[6].actuador_pin == "6") || (receta[6].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[6].actuador_pin == "7") || (receta[6].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[6].actuador_pin == "8") || (receta[6].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[6].actuador_pin == "9") || (receta[6].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[6].actuador_pin == "10") || (receta[6].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[6].actuador_pin == "11") || (receta[6].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[6].actuador_pin == "12") || (receta[6].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[6].actuador_pin == "13") || (receta[6].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[6].actuador_pin == "1") ||  (receta[6].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "2") || (receta[6].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "3") || (receta[6].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "4") || (receta[6].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "5") || (receta[6].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "6") || (receta[6].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "7") || (receta[6].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "8") || (receta[6].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "9") || (receta[6].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "10") || (receta[6].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "11") || (receta[6].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "12") || (receta[6].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[6].actuador_pin == "13") || (receta[6].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[6].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[6].sensor_pin == "1") || (receta[6].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "2") || (receta[6].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "3") || (receta[6].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "4") || (receta[6].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "5") || (receta[6].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "6") || (receta[6].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "7") || (receta[6].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "8") || (receta[6].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "9") || (receta[6].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "10") || (receta[6].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "11") || (receta[6].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "12") || (receta[6].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[6].sensor_pin == "13") || (receta[6].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[6].sensor_pin == "1") || (receta[6].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[6].sensor_pin == "2") || (receta[6].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[6].sensor_pin == "3") || (receta[6].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[6].sensor_pin == "4") || (receta[6].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[6].sensor_pin == "5") || (receta[6].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[6].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[6].sensor_pin == "1") || (receta[6].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[6].sensor_pin == "2") || (receta[6].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[6].sensor_pin == "3") || (receta[6].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[6].sensor_pin == "4") || (receta[6].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[6].sensor_pin == "5") || (receta[6].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[6].sensor_pin == "6") || (receta[6].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[6].sensor_pin == "7") || (receta[6].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(6, "4", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[6].sensor_pin == "8") || (receta[6].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[6].sensor_pin == "9") || (receta[6].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[6].sensor_pin == "10") || (receta[6].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[6].sensor_pin == "11") || (receta[6].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[6].sensor_pin == "12") || (receta[6].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(6, "0",receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(6, "1",receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[6].sensor_pin == "13") || (receta[6].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(6, "0", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(6, "1", receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[6].sensor_pin == "1") || (receta[6].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(6, '' + 20-this.value/50, receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[6].sensor_pin == "2") || (receta[6].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(6, '' + 20-this.value/50, receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[6].sensor_pin == "3") || (receta[6].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(6, '' + 20-this.value/50, receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[6].sensor_pin == "4") || (receta[6].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(6, '' + 20-this.value/50, receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[6].sensor_pin == "5") || (receta[6].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(6, '' + 20-this.value/50, receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora6 = procesarEntrada(6, null, receta[6].sensor_condicion_familia_nombre, receta[6].condicion_simbolo, receta[6].condicion_valor, receta[6].condicion_hora, ejecutadoHora6);
				break;
			}
	}
	
/////////////////////////////  RECETA 7  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[7] != null) {
		switch(receta[7].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[7].actuador_pin == "1") ||  (receta[7].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[7].actuador_pin == "2") || (receta[7].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[7].actuador_pin == "3") || (receta[7].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[7].actuador_pin == "4") || (receta[7].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[7].actuador_pin == "5") || (receta[7].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[7].actuador_pin == "6") || (receta[7].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[7].actuador_pin == "7") || (receta[7].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[7].actuador_pin == "8") || (receta[7].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[7].actuador_pin == "9") || (receta[7].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[7].actuador_pin == "10") || (receta[7].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[7].actuador_pin == "11") || (receta[7].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[7].actuador_pin == "12") || (receta[7].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[7].actuador_pin == "13") || (receta[7].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[7].actuador_pin == "1") ||  (receta[7].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[7].actuador_pin == "2") || (receta[7].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[7].actuador_pin == "3") || (receta[7].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[7].actuador_pin == "4") || (receta[7].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[7].actuador_pin == "5") || (receta[7].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[7].actuador_pin == "6") || (receta[7].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[7].actuador_pin == "7") || (receta[7].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[7].actuador_pin == "8") || (receta[7].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[7].actuador_pin == "9") || (receta[7].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[7].actuador_pin == "10") || (receta[7].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[7].actuador_pin == "11") || (receta[7].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[7].actuador_pin == "12") || (receta[7].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[7].actuador_pin == "13") || (receta[7].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[7].actuador_pin == "1") ||  (receta[7].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[7].actuador_pin == "2") || (receta[7].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[7].actuador_pin == "3") || (receta[7].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[7].actuador_pin == "4") || (receta[7].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[7].actuador_pin == "5") || (receta[7].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[7].actuador_pin == "6") || (receta[7].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[7].actuador_pin == "7") || (receta[7].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[7].actuador_pin == "8") || (receta[7].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[7].actuador_pin == "9") || (receta[7].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[7].actuador_pin == "10") || (receta[7].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[7].actuador_pin == "11") || (receta[7].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[7].actuador_pin == "12") || (receta[7].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[7].actuador_pin == "13") || (receta[7].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[7].actuador_pin == "1") ||  (receta[7].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "2") || (receta[7].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "3") || (receta[7].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "4") || (receta[7].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "5") || (receta[7].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "6") || (receta[7].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "7") || (receta[7].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "8") || (receta[7].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "9") || (receta[7].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "10") || (receta[7].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "11") || (receta[7].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "12") || (receta[7].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[7].actuador_pin == "13") || (receta[7].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[7].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[7].sensor_pin == "1") || (receta[7].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "2") || (receta[7].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "3") || (receta[7].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "4") || (receta[7].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "5") || (receta[7].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "6") || (receta[7].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "7") || (receta[7].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "8") || (receta[7].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "9") || (receta[7].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "10") || (receta[7].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "11") || (receta[7].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "12") || (receta[7].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[7].sensor_pin == "13") || (receta[7].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[7].sensor_pin == "1") || (receta[7].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[7].sensor_pin == "2") || (receta[7].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[7].sensor_pin == "3") || (receta[7].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[7].sensor_pin == "4") || (receta[7].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[7].sensor_pin == "5") || (receta[7].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[7].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[7].sensor_pin == "1") || (receta[7].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[7].sensor_pin == "2") || (receta[7].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[7].sensor_pin == "3") || (receta[7].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[7].sensor_pin == "4") || (receta[7].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[7].sensor_pin == "5") || (receta[7].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[7].sensor_pin == "6") || (receta[7].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[7].sensor_pin == "7") || (receta[7].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(7, "4", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[7].sensor_pin == "8") || (receta[7].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[7].sensor_pin == "9") || (receta[7].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[7].sensor_pin == "10") || (receta[7].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[7].sensor_pin == "11") || (receta[7].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[7].sensor_pin == "12") || (receta[7].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(7, "0",receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(7, "1",receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[7].sensor_pin == "13") || (receta[7].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(7, "0", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(7, "1", receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[7].sensor_pin == "1") || (receta[7].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(7, '' + 20-this.value/50, receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[7].sensor_pin == "2") || (receta[7].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(7, '' + 20-this.value/50, receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[7].sensor_pin == "3") || (receta[7].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(7, '' + 20-this.value/50, receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[7].sensor_pin == "4") || (receta[7].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(7, '' + 20-this.value/50, receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[7].sensor_pin == "5") || (receta[7].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(7, '' + 20-this.value/50, receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora7 = procesarEntrada(7, null, receta[7].sensor_condicion_familia_nombre, receta[7].condicion_simbolo, receta[7].condicion_valor, receta[7].condicion_hora, ejecutadoHora7);
				break;
			}
	}
	
/////////////////////////////  RECETA 8  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[8] != null) {
		switch(receta[8].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[8].actuador_pin == "1") ||  (receta[8].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[8].actuador_pin == "2") || (receta[8].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[8].actuador_pin == "3") || (receta[8].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[8].actuador_pin == "4") || (receta[8].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[8].actuador_pin == "5") || (receta[8].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[8].actuador_pin == "6") || (receta[8].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[8].actuador_pin == "7") || (receta[8].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[8].actuador_pin == "8") || (receta[8].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[8].actuador_pin == "9") || (receta[8].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[8].actuador_pin == "10") || (receta[8].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[8].actuador_pin == "11") || (receta[8].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[8].actuador_pin == "12") || (receta[8].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[8].actuador_pin == "13") || (receta[8].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[8].actuador_pin == "1") ||  (receta[8].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[8].actuador_pin == "2") || (receta[8].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[8].actuador_pin == "3") || (receta[8].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[8].actuador_pin == "4") || (receta[8].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[8].actuador_pin == "5") || (receta[8].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[8].actuador_pin == "6") || (receta[8].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[8].actuador_pin == "7") || (receta[8].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[8].actuador_pin == "8") || (receta[8].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[8].actuador_pin == "9") || (receta[8].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[8].actuador_pin == "10") || (receta[8].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[8].actuador_pin == "11") || (receta[8].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[8].actuador_pin == "12") || (receta[8].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[8].actuador_pin == "13") || (receta[8].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[8].actuador_pin == "1") ||  (receta[8].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[8].actuador_pin == "2") || (receta[8].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[8].actuador_pin == "3") || (receta[8].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[8].actuador_pin == "4") || (receta[8].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[8].actuador_pin == "5") || (receta[8].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[8].actuador_pin == "6") || (receta[8].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[8].actuador_pin == "7") || (receta[8].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[8].actuador_pin == "8") || (receta[8].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[8].actuador_pin == "9") || (receta[8].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[8].actuador_pin == "10") || (receta[8].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[8].actuador_pin == "11") || (receta[8].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[8].actuador_pin == "12") || (receta[8].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[8].actuador_pin == "13") || (receta[8].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[8].actuador_pin == "1") ||  (receta[8].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "2") || (receta[8].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "3") || (receta[8].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "4") || (receta[8].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "5") || (receta[8].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "6") || (receta[8].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "7") || (receta[8].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "8") || (receta[8].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "9") || (receta[8].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "10") || (receta[8].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "11") || (receta[8].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "12") || (receta[8].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[8].actuador_pin == "13") || (receta[8].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[8].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[8].sensor_pin == "1") || (receta[8].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "2") || (receta[8].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "3") || (receta[8].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "4") || (receta[8].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "5") || (receta[8].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "6") || (receta[8].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "7") || (receta[8].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "8") || (receta[8].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "9") || (receta[8].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "10") || (receta[8].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "11") || (receta[8].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "12") || (receta[8].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[8].sensor_pin == "13") || (receta[8].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[8].sensor_pin == "1") || (receta[8].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[8].sensor_pin == "2") || (receta[8].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[8].sensor_pin == "3") || (receta[8].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[8].sensor_pin == "4") || (receta[8].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[8].sensor_pin == "5") || (receta[8].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[8].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[8].sensor_pin == "1") || (receta[8].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[8].sensor_pin == "2") || (receta[8].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[8].sensor_pin == "3") || (receta[8].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[8].sensor_pin == "4") || (receta[8].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[8].sensor_pin == "5") || (receta[8].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[8].sensor_pin == "6") || (receta[8].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[8].sensor_pin == "7") || (receta[8].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(8, "4", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[8].sensor_pin == "8") || (receta[8].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[8].sensor_pin == "9") || (receta[8].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[8].sensor_pin == "10") || (receta[8].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[8].sensor_pin == "11") || (receta[8].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[8].sensor_pin == "12") || (receta[8].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(8, "0",receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(8, "1",receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[8].sensor_pin == "13") || (receta[8].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(8, "0", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(8, "1", receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[8].sensor_pin == "1") || (receta[8].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(8, '' + 20-this.value/50, receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[8].sensor_pin == "2") || (receta[8].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(8, '' + 20-this.value/50, receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[8].sensor_pin == "3") || (receta[8].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(8, '' + 20-this.value/50, receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[8].sensor_pin == "4") || (receta[8].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(8, '' + 20-this.value/50, receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[8].sensor_pin == "5") || (receta[8].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(8, '' + 20-this.value/50, receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora8 = procesarEntrada(8, null, receta[8].sensor_condicion_familia_nombre, receta[8].condicion_simbolo, receta[8].condicion_valor, receta[8].condicion_hora, ejecutadoHora8);
				break;
			}
	}
/////////////////////////////  RECETA 9  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[9] != null) {
		switch(receta[9].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[9].actuador_pin == "1") ||  (receta[9].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[9].actuador_pin == "2") || (receta[9].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[9].actuador_pin == "3") || (receta[9].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[9].actuador_pin == "4") || (receta[9].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[9].actuador_pin == "5") || (receta[9].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[9].actuador_pin == "6") || (receta[9].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[9].actuador_pin == "7") || (receta[9].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[9].actuador_pin == "8") || (receta[9].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[9].actuador_pin == "9") || (receta[9].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[9].actuador_pin == "10") || (receta[9].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[9].actuador_pin == "11") || (receta[9].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[9].actuador_pin == "12") || (receta[9].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[9].actuador_pin == "13") || (receta[9].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[9].actuador_pin == "1") ||  (receta[9].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[9].actuador_pin == "2") || (receta[9].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[9].actuador_pin == "3") || (receta[9].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[9].actuador_pin == "4") || (receta[9].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[9].actuador_pin == "5") || (receta[9].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[9].actuador_pin == "6") || (receta[9].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[9].actuador_pin == "7") || (receta[9].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[9].actuador_pin == "8") || (receta[9].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[9].actuador_pin == "9") || (receta[9].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[9].actuador_pin == "10") || (receta[9].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[9].actuador_pin == "11") || (receta[9].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[9].actuador_pin == "12") || (receta[9].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[9].actuador_pin == "13") || (receta[9].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[9].actuador_pin == "1") ||  (receta[9].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[9].actuador_pin == "2") || (receta[9].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[9].actuador_pin == "3") || (receta[9].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[9].actuador_pin == "4") || (receta[9].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[9].actuador_pin == "5") || (receta[9].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[9].actuador_pin == "6") || (receta[9].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[9].actuador_pin == "7") || (receta[9].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[9].actuador_pin == "8") || (receta[9].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[9].actuador_pin == "9") || (receta[9].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[9].actuador_pin == "10") || (receta[9].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[9].actuador_pin == "11") || (receta[9].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[9].actuador_pin == "12") || (receta[9].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[9].actuador_pin == "13") || (receta[9].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[9].actuador_pin == "1") ||  (receta[9].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "2") || (receta[9].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "3") || (receta[9].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "4") || (receta[9].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "5") || (receta[9].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "6") || (receta[9].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "7") || (receta[9].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "8") || (receta[9].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "9") || (receta[9].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "10") || (receta[9].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "11") || (receta[9].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "12") || (receta[9].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[9].actuador_pin == "13") || (receta[9].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[9].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[9].sensor_pin == "1") || (receta[9].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "2") || (receta[9].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "3") || (receta[9].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "4") || (receta[9].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "5") || (receta[9].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "6") || (receta[9].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "7") || (receta[9].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "8") || (receta[9].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "9") || (receta[9].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "10") || (receta[9].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "11") || (receta[9].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "12") || (receta[9].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[9].sensor_pin == "13") || (receta[9].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[9].sensor_pin == "1") || (receta[9].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[9].sensor_pin == "2") || (receta[9].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[9].sensor_pin == "3") || (receta[9].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[9].sensor_pin == "4") || (receta[9].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[9].sensor_pin == "5") || (receta[9].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[9].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[9].sensor_pin == "1") || (receta[9].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[9].sensor_pin == "2") || (receta[9].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[9].sensor_pin == "3") || (receta[9].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[9].sensor_pin == "4") || (receta[9].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[9].sensor_pin == "5") || (receta[9].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[9].sensor_pin == "6") || (receta[9].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[9].sensor_pin == "7") || (receta[9].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(9, "4", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[9].sensor_pin == "8") || (receta[9].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[9].sensor_pin == "9") || (receta[9].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[9].sensor_pin == "10") || (receta[9].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[9].sensor_pin == "11") || (receta[9].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[9].sensor_pin == "12") || (receta[9].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(9, "0",receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(9, "1",receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[9].sensor_pin == "13") || (receta[9].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(9, "0", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(9, "1", receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[9].sensor_pin == "1") || (receta[9].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(9, '' + 20-this.value/50, receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[9].sensor_pin == "2") || (receta[9].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(9, '' + 20-this.value/50, receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[9].sensor_pin == "3") || (receta[9].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(9, '' + 20-this.value/50, receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[9].sensor_pin == "4") || (receta[9].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(9, '' + 20-this.value/50, receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[9].sensor_pin == "5") || (receta[9].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(9, '' + 20-this.value/50, receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora9 = procesarEntrada(9, null, receta[9].sensor_condicion_familia_nombre, receta[9].condicion_simbolo, receta[9].condicion_valor, receta[9].condicion_hora, ejecutadoHora9);
				break;
			}
	}
/////////////////////////////  RECETA 10  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[10] != null) {
		switch(receta[10].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[10].actuador_pin == "1") ||  (receta[10].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[10].actuador_pin == "2") || (receta[10].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[10].actuador_pin == "3") || (receta[10].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[10].actuador_pin == "4") || (receta[10].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[10].actuador_pin == "5") || (receta[10].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[10].actuador_pin == "6") || (receta[10].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[10].actuador_pin == "7") || (receta[10].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[10].actuador_pin == "8") || (receta[10].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[10].actuador_pin == "9") || (receta[10].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[10].actuador_pin == "10") || (receta[10].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[10].actuador_pin == "11") || (receta[10].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[10].actuador_pin == "12") || (receta[10].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[10].actuador_pin == "13") || (receta[10].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[10].actuador_pin == "1") ||  (receta[10].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[10].actuador_pin == "2") || (receta[10].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[10].actuador_pin == "3") || (receta[10].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[10].actuador_pin == "4") || (receta[10].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[10].actuador_pin == "5") || (receta[10].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[10].actuador_pin == "6") || (receta[10].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[10].actuador_pin == "7") || (receta[10].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[10].actuador_pin == "8") || (receta[10].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[10].actuador_pin == "9") || (receta[10].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[10].actuador_pin == "10") || (receta[10].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[10].actuador_pin == "11") || (receta[10].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[10].actuador_pin == "12") || (receta[10].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[10].actuador_pin == "13") || (receta[10].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[10].actuador_pin == "1") ||  (receta[10].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[10].actuador_pin == "2") || (receta[10].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[10].actuador_pin == "3") || (receta[10].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[10].actuador_pin == "4") || (receta[10].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[10].actuador_pin == "5") || (receta[10].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[10].actuador_pin == "6") || (receta[10].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[10].actuador_pin == "7") || (receta[10].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[10].actuador_pin == "8") || (receta[10].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[10].actuador_pin == "9") || (receta[10].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[10].actuador_pin == "10") || (receta[10].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[10].actuador_pin == "11") || (receta[10].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[10].actuador_pin == "12") || (receta[10].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[10].actuador_pin == "13") || (receta[10].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[10].actuador_pin == "1") ||  (receta[10].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "2") || (receta[10].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "3") || (receta[10].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "4") || (receta[10].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "5") || (receta[10].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "6") || (receta[10].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "7") || (receta[10].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "8") || (receta[10].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "9") || (receta[10].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "10") || (receta[10].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "11") || (receta[10].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "12") || (receta[10].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[10].actuador_pin == "13") || (receta[10].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[10].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[10].sensor_pin == "1") || (receta[10].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "2") || (receta[10].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "3") || (receta[10].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "4") || (receta[10].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "5") || (receta[10].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "6") || (receta[10].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "7") || (receta[10].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "8") || (receta[10].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "9") || (receta[10].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "10") || (receta[10].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "11") || (receta[10].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "12") || (receta[10].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[10].sensor_pin == "13") || (receta[10].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[10].sensor_pin == "1") || (receta[10].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[10].sensor_pin == "2") || (receta[10].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[10].sensor_pin == "3") || (receta[10].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[10].sensor_pin == "4") || (receta[10].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[10].sensor_pin == "5") || (receta[10].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[10].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[10].sensor_pin == "1") || (receta[10].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[10].sensor_pin == "2") || (receta[10].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[10].sensor_pin == "3") || (receta[10].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[10].sensor_pin == "4") || (receta[10].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[10].sensor_pin == "5") || (receta[10].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[10].sensor_pin == "6") || (receta[10].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[10].sensor_pin == "7") || (receta[10].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(10, "4", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[10].sensor_pin == "8") || (receta[10].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[10].sensor_pin == "9") || (receta[10].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[10].sensor_pin == "10") || (receta[10].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[10].sensor_pin == "11") || (receta[10].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[10].sensor_pin == "12") || (receta[10].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(10, "0",receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(10, "1",receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[10].sensor_pin == "13") || (receta[10].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(10, "0", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(10, "1", receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[10].sensor_pin == "1") || (receta[10].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(10, '' + 20-this.value/50, receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[10].sensor_pin == "2") || (receta[10].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(10, '' + 20-this.value/50, receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[10].sensor_pin == "3") || (receta[10].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(10, '' + 20-this.value/50, receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[10].sensor_pin == "4") || (receta[10].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(10, '' + 20-this.value/50, receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[10].sensor_pin == "5") || (receta[10].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(10, '' + 20-this.value/50, receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora10 = procesarEntrada(10, null, receta[10].sensor_condicion_familia_nombre, receta[10].condicion_simbolo, receta[10].condicion_valor, receta[10].condicion_hora, ejecutadoHora10);
				break;
			}
	}
/////////////////////////////  RECETA 11  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[11] != null) {
		switch(receta[11].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[11].actuador_pin == "1") ||  (receta[11].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[11].actuador_pin == "2") || (receta[11].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[11].actuador_pin == "3") || (receta[11].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[11].actuador_pin == "4") || (receta[11].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[11].actuador_pin == "5") || (receta[11].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[11].actuador_pin == "6") || (receta[11].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[11].actuador_pin == "7") || (receta[11].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[11].actuador_pin == "8") || (receta[11].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[11].actuador_pin == "9") || (receta[11].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[11].actuador_pin == "10") || (receta[11].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[11].actuador_pin == "11") || (receta[11].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[11].actuador_pin == "12") || (receta[11].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[11].actuador_pin == "13") || (receta[11].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[11].actuador_pin == "1") ||  (receta[11].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[11].actuador_pin == "2") || (receta[11].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[11].actuador_pin == "3") || (receta[11].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[11].actuador_pin == "4") || (receta[11].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[11].actuador_pin == "5") || (receta[11].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[11].actuador_pin == "6") || (receta[11].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[11].actuador_pin == "7") || (receta[11].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[11].actuador_pin == "8") || (receta[11].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[11].actuador_pin == "9") || (receta[11].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[11].actuador_pin == "10") || (receta[11].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[11].actuador_pin == "11") || (receta[11].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[11].actuador_pin == "12") || (receta[11].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[11].actuador_pin == "13") || (receta[11].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[11].actuador_pin == "1") ||  (receta[11].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[11].actuador_pin == "2") || (receta[11].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[11].actuador_pin == "3") || (receta[11].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[11].actuador_pin == "4") || (receta[11].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[11].actuador_pin == "5") || (receta[11].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[11].actuador_pin == "6") || (receta[11].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[11].actuador_pin == "7") || (receta[11].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[11].actuador_pin == "8") || (receta[11].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[11].actuador_pin == "9") || (receta[11].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[11].actuador_pin == "10") || (receta[11].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[11].actuador_pin == "11") || (receta[11].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[11].actuador_pin == "12") || (receta[11].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[11].actuador_pin == "13") || (receta[11].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[11].actuador_pin == "1") ||  (receta[11].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "2") || (receta[11].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "3") || (receta[11].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "4") || (receta[11].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "5") || (receta[11].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "6") || (receta[11].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "7") || (receta[11].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "8") || (receta[11].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "9") || (receta[11].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "10") || (receta[11].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "11") || (receta[11].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "12") || (receta[11].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[11].actuador_pin == "13") || (receta[11].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[11].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[11].sensor_pin == "1") || (receta[11].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "2") || (receta[11].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "3") || (receta[11].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "4") || (receta[11].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "5") || (receta[11].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "6") || (receta[11].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "7") || (receta[11].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "8") || (receta[11].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "9") || (receta[11].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "10") || (receta[11].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "11") || (receta[11].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "12") || (receta[11].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[11].sensor_pin == "13") || (receta[11].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[11].sensor_pin == "1") || (receta[11].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[11].sensor_pin == "2") || (receta[11].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[11].sensor_pin == "3") || (receta[11].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[11].sensor_pin == "4") || (receta[11].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[11].sensor_pin == "5") || (receta[11].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[11].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[11].sensor_pin == "1") || (receta[11].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[11].sensor_pin == "2") || (receta[11].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[11].sensor_pin == "3") || (receta[11].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[11].sensor_pin == "4") || (receta[11].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[11].sensor_pin == "5") || (receta[11].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[11].sensor_pin == "6") || (receta[11].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[11].sensor_pin == "7") || (receta[11].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(11, "4", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[11].sensor_pin == "8") || (receta[11].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[11].sensor_pin == "9") || (receta[11].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[11].sensor_pin == "10") || (receta[11].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[11].sensor_pin == "11") || (receta[11].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[11].sensor_pin == "12") || (receta[11].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(11, "0",receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(11, "1",receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[11].sensor_pin == "13") || (receta[11].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(11, "0", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(11, "1", receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[11].sensor_pin == "1") || (receta[11].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(11, '' + 20-this.value/50, receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[11].sensor_pin == "2") || (receta[11].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(11, '' + 20-this.value/50, receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[11].sensor_pin == "3") || (receta[11].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(11, '' + 20-this.value/50, receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[11].sensor_pin == "4") || (receta[11].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(11, '' + 20-this.value/50, receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[11].sensor_pin == "5") || (receta[11].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(11, '' + 20-this.value/50, receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora11 = procesarEntrada(11, null, receta[11].sensor_condicion_familia_nombre, receta[11].condicion_simbolo, receta[11].condicion_valor, receta[11].condicion_hora, ejecutadoHora11);
				break;
			}
	}
/////////////////////////////  RECETA 12  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[12] != null) {
		switch(receta[12].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[12].actuador_pin == "1") ||  (receta[12].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[12].actuador_pin == "2") || (receta[12].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[12].actuador_pin == "3") || (receta[12].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[12].actuador_pin == "4") || (receta[12].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[12].actuador_pin == "5") || (receta[12].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[12].actuador_pin == "6") || (receta[12].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[12].actuador_pin == "7") || (receta[12].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[12].actuador_pin == "8") || (receta[12].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[12].actuador_pin == "9") || (receta[12].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[12].actuador_pin == "10") || (receta[12].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[12].actuador_pin == "11") || (receta[12].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[12].actuador_pin == "12") || (receta[12].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[12].actuador_pin == "13") || (receta[12].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[12].actuador_pin == "1") ||  (receta[12].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[12].actuador_pin == "2") || (receta[12].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[12].actuador_pin == "3") || (receta[12].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[12].actuador_pin == "4") || (receta[12].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[12].actuador_pin == "5") || (receta[12].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[12].actuador_pin == "6") || (receta[12].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[12].actuador_pin == "7") || (receta[12].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[12].actuador_pin == "8") || (receta[12].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[12].actuador_pin == "9") || (receta[12].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[12].actuador_pin == "10") || (receta[12].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[12].actuador_pin == "11") || (receta[12].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[12].actuador_pin == "12") || (receta[12].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[12].actuador_pin == "13") || (receta[12].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[12].actuador_pin == "1") ||  (receta[12].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[12].actuador_pin == "2") || (receta[12].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[12].actuador_pin == "3") || (receta[12].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[12].actuador_pin == "4") || (receta[12].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[12].actuador_pin == "5") || (receta[12].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[12].actuador_pin == "6") || (receta[12].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[12].actuador_pin == "7") || (receta[12].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[12].actuador_pin == "8") || (receta[12].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[12].actuador_pin == "9") || (receta[12].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[12].actuador_pin == "10") || (receta[12].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[12].actuador_pin == "11") || (receta[12].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[12].actuador_pin == "12") || (receta[12].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[12].actuador_pin == "13") || (receta[12].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[12].actuador_pin == "1") ||  (receta[12].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "2") || (receta[12].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "3") || (receta[12].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "4") || (receta[12].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "5") || (receta[12].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "6") || (receta[12].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "7") || (receta[12].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "8") || (receta[12].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "9") || (receta[12].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "10") || (receta[12].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "11") || (receta[12].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "12") || (receta[12].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[12].actuador_pin == "13") || (receta[12].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[12].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[12].sensor_pin == "1") || (receta[12].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "2") || (receta[12].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "3") || (receta[12].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "4") || (receta[12].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "5") || (receta[12].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "6") || (receta[12].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "7") || (receta[12].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "8") || (receta[12].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "9") || (receta[12].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "10") || (receta[12].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "11") || (receta[12].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "12") || (receta[12].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[12].sensor_pin == "13") || (receta[12].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[12].sensor_pin == "1") || (receta[12].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[12].sensor_pin == "2") || (receta[12].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[12].sensor_pin == "3") || (receta[12].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[12].sensor_pin == "4") || (receta[12].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[12].sensor_pin == "5") || (receta[12].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[12].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[12].sensor_pin == "1") || (receta[12].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[12].sensor_pin == "2") || (receta[12].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[12].sensor_pin == "3") || (receta[12].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[12].sensor_pin == "4") || (receta[12].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[12].sensor_pin == "5") || (receta[12].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[12].sensor_pin == "6") || (receta[12].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[12].sensor_pin == "7") || (receta[12].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(12, "4", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[12].sensor_pin == "8") || (receta[12].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[12].sensor_pin == "9") || (receta[12].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[12].sensor_pin == "10") || (receta[12].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[12].sensor_pin == "11") || (receta[12].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[12].sensor_pin == "12") || (receta[12].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(12, "0",receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(12, "1",receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[12].sensor_pin == "13") || (receta[12].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(12, "0", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(12, "1", receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[12].sensor_pin == "1") || (receta[12].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(12, '' + 20-this.value/50, receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[12].sensor_pin == "2") || (receta[12].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(12, '' + 20-this.value/50, receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[12].sensor_pin == "3") || (receta[12].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(12, '' + 20-this.value/50, receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[12].sensor_pin == "4") || (receta[12].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(12, '' + 20-this.value/50, receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[12].sensor_pin == "5") || (receta[12].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(12, '' + 20-this.value/50, receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora12 = procesarEntrada(12, null, receta[12].sensor_condicion_familia_nombre, receta[12].condicion_simbolo, receta[12].condicion_valor, receta[12].condicion_hora, ejecutadoHora12);
				break;
			}
	}
/////////////////////////////  RECETA 13  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[13] != null) {
		switch(receta[13].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[13].actuador_pin == "1") ||  (receta[13].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[13].actuador_pin == "2") || (receta[13].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[13].actuador_pin == "3") || (receta[13].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[13].actuador_pin == "4") || (receta[13].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[13].actuador_pin == "5") || (receta[13].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[13].actuador_pin == "6") || (receta[13].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[13].actuador_pin == "7") || (receta[13].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[13].actuador_pin == "8") || (receta[13].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[13].actuador_pin == "9") || (receta[13].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[13].actuador_pin == "10") || (receta[13].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[13].actuador_pin == "11") || (receta[13].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[13].actuador_pin == "12") || (receta[13].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[13].actuador_pin == "13") || (receta[13].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[13].actuador_pin == "1") ||  (receta[13].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[13].actuador_pin == "2") || (receta[13].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[13].actuador_pin == "3") || (receta[13].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[13].actuador_pin == "4") || (receta[13].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[13].actuador_pin == "5") || (receta[13].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[13].actuador_pin == "6") || (receta[13].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[13].actuador_pin == "7") || (receta[13].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[13].actuador_pin == "8") || (receta[13].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[13].actuador_pin == "9") || (receta[13].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[13].actuador_pin == "10") || (receta[13].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[13].actuador_pin == "11") || (receta[13].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[13].actuador_pin == "12") || (receta[13].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[13].actuador_pin == "13") || (receta[13].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[13].actuador_pin == "1") ||  (receta[13].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[13].actuador_pin == "2") || (receta[13].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[13].actuador_pin == "3") || (receta[13].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[13].actuador_pin == "4") || (receta[13].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[13].actuador_pin == "5") || (receta[13].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[13].actuador_pin == "6") || (receta[13].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[13].actuador_pin == "7") || (receta[13].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[13].actuador_pin == "8") || (receta[13].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[13].actuador_pin == "9") || (receta[13].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[13].actuador_pin == "10") || (receta[13].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[13].actuador_pin == "11") || (receta[13].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[13].actuador_pin == "12") || (receta[13].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[13].actuador_pin == "13") || (receta[13].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[13].actuador_pin == "1") ||  (receta[13].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "2") || (receta[13].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "3") || (receta[13].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "4") || (receta[13].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "5") || (receta[13].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "6") || (receta[13].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "7") || (receta[13].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "8") || (receta[13].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "9") || (receta[13].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "10") || (receta[13].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "11") || (receta[13].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "12") || (receta[13].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[13].actuador_pin == "13") || (receta[13].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[13].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[13].sensor_pin == "1") || (receta[13].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "2") || (receta[13].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "3") || (receta[13].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "4") || (receta[13].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "5") || (receta[13].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "6") || (receta[13].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "7") || (receta[13].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "8") || (receta[13].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "9") || (receta[13].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "10") || (receta[13].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "11") || (receta[13].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "12") || (receta[13].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[13].sensor_pin == "13") || (receta[13].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[13].sensor_pin == "1") || (receta[13].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[13].sensor_pin == "2") || (receta[13].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[13].sensor_pin == "3") || (receta[13].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[13].sensor_pin == "4") || (receta[13].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[13].sensor_pin == "5") || (receta[13].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[13].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[13].sensor_pin == "1") || (receta[13].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[13].sensor_pin == "2") || (receta[13].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[13].sensor_pin == "3") || (receta[13].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[13].sensor_pin == "4") || (receta[13].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[13].sensor_pin == "5") || (receta[13].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[13].sensor_pin == "6") || (receta[13].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[13].sensor_pin == "7") || (receta[13].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(13, "4", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[13].sensor_pin == "8") || (receta[13].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[13].sensor_pin == "9") || (receta[13].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[13].sensor_pin == "10") || (receta[13].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[13].sensor_pin == "11") || (receta[13].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[13].sensor_pin == "12") || (receta[13].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(13, "0",receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(13, "1",receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[13].sensor_pin == "13") || (receta[13].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(13, "0", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(13, "1", receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[13].sensor_pin == "1") || (receta[13].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(13, '' + 20-this.value/50, receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[13].sensor_pin == "2") || (receta[13].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(13, '' + 20-this.value/50, receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[13].sensor_pin == "3") || (receta[13].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(13, '' + 20-this.value/50, receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[13].sensor_pin == "4") || (receta[13].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(13, '' + 20-this.value/50, receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[13].sensor_pin == "5") || (receta[13].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(13, '' + 20-this.value/50, receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora13 = procesarEntrada(13, null, receta[13].sensor_condicion_familia_nombre, receta[13].condicion_simbolo, receta[13].condicion_valor, receta[13].condicion_hora, ejecutadoHora13);
				break;
			}
	}
/////////////////////////////  RECETA 14  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[14] != null) {
		switch(receta[14].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[14].actuador_pin == "1") ||  (receta[14].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[14].actuador_pin == "2") || (receta[14].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[14].actuador_pin == "3") || (receta[14].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[14].actuador_pin == "4") || (receta[14].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[14].actuador_pin == "5") || (receta[14].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[14].actuador_pin == "6") || (receta[14].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[14].actuador_pin == "7") || (receta[14].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[14].actuador_pin == "8") || (receta[14].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[14].actuador_pin == "9") || (receta[14].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[14].actuador_pin == "10") || (receta[14].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[14].actuador_pin == "11") || (receta[14].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[14].actuador_pin == "12") || (receta[14].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[14].actuador_pin == "13") || (receta[14].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[14].actuador_pin == "1") ||  (receta[14].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[14].actuador_pin == "2") || (receta[14].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[14].actuador_pin == "3") || (receta[14].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[14].actuador_pin == "4") || (receta[14].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[14].actuador_pin == "5") || (receta[14].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[14].actuador_pin == "6") || (receta[14].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[14].actuador_pin == "7") || (receta[14].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[14].actuador_pin == "8") || (receta[14].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[14].actuador_pin == "9") || (receta[14].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[14].actuador_pin == "10") || (receta[14].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[14].actuador_pin == "11") || (receta[14].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[14].actuador_pin == "12") || (receta[14].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[14].actuador_pin == "13") || (receta[14].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[14].actuador_pin == "1") ||  (receta[14].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[14].actuador_pin == "2") || (receta[14].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[14].actuador_pin == "3") || (receta[14].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[14].actuador_pin == "4") || (receta[14].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[14].actuador_pin == "5") || (receta[14].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[14].actuador_pin == "6") || (receta[14].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[14].actuador_pin == "7") || (receta[14].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[14].actuador_pin == "8") || (receta[14].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[14].actuador_pin == "9") || (receta[14].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[14].actuador_pin == "10") || (receta[14].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[14].actuador_pin == "11") || (receta[14].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[14].actuador_pin == "12") || (receta[14].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[14].actuador_pin == "13") || (receta[14].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[14].actuador_pin == "1") ||  (receta[14].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "2") || (receta[14].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "3") || (receta[14].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "4") || (receta[14].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "5") || (receta[14].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "6") || (receta[14].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "7") || (receta[14].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "8") || (receta[14].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "9") || (receta[14].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "10") || (receta[14].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "11") || (receta[14].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "12") || (receta[14].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[14].actuador_pin == "13") || (receta[14].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[14].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[14].sensor_pin == "1") || (receta[14].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "2") || (receta[14].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "3") || (receta[14].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "4") || (receta[14].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "5") || (receta[14].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "6") || (receta[14].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "7") || (receta[14].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "8") || (receta[14].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "9") || (receta[14].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "10") || (receta[14].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "11") || (receta[14].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "12") || (receta[14].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[14].sensor_pin == "13") || (receta[14].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[14].sensor_pin == "1") || (receta[14].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[14].sensor_pin == "2") || (receta[14].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[14].sensor_pin == "3") || (receta[14].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[14].sensor_pin == "4") || (receta[14].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[14].sensor_pin == "5") || (receta[14].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[14].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[14].sensor_pin == "1") || (receta[14].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[14].sensor_pin == "2") || (receta[14].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[14].sensor_pin == "3") || (receta[14].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[14].sensor_pin == "4") || (receta[14].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[14].sensor_pin == "5") || (receta[14].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[14].sensor_pin == "6") || (receta[14].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[14].sensor_pin == "7") || (receta[14].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(14, "4", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[14].sensor_pin == "8") || (receta[14].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[14].sensor_pin == "9") || (receta[14].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[14].sensor_pin == "10") || (receta[14].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[14].sensor_pin == "11") || (receta[14].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[14].sensor_pin == "12") || (receta[14].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(14, "0",receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(14, "1",receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[14].sensor_pin == "13") || (receta[14].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(14, "0", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(14, "1", receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[14].sensor_pin == "1") || (receta[14].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(14, '' + 20-this.value/50, receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[14].sensor_pin == "2") || (receta[14].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(14, '' + 20-this.value/50, receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[14].sensor_pin == "3") || (receta[14].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(14, '' + 20-this.value/50, receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[14].sensor_pin == "4") || (receta[14].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(14, '' + 20-this.value/50, receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[14].sensor_pin == "5") || (receta[14].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(14, '' + 20-this.value/50, receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora14 = procesarEntrada(14, null, receta[14].sensor_condicion_familia_nombre, receta[14].condicion_simbolo, receta[14].condicion_valor, receta[14].condicion_hora, ejecutadoHora14);
				break;
			}
	}
	
/////////////////////////////  RECETA 15  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[15] != null) {
		switch(receta[15].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[15].actuador_pin == "1") ||  (receta[15].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[15].actuador_pin == "2") || (receta[15].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[15].actuador_pin == "3") || (receta[15].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[15].actuador_pin == "4") || (receta[15].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[15].actuador_pin == "5") || (receta[15].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[15].actuador_pin == "6") || (receta[15].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[15].actuador_pin == "7") || (receta[15].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[15].actuador_pin == "8") || (receta[15].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[15].actuador_pin == "9") || (receta[15].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[15].actuador_pin == "10") || (receta[15].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[15].actuador_pin == "11") || (receta[15].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[15].actuador_pin == "12") || (receta[15].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[15].actuador_pin == "13") || (receta[15].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[15].actuador_pin == "1") ||  (receta[15].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[15].actuador_pin == "2") || (receta[15].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[15].actuador_pin == "3") || (receta[15].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[15].actuador_pin == "4") || (receta[15].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[15].actuador_pin == "5") || (receta[15].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[15].actuador_pin == "6") || (receta[15].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[15].actuador_pin == "7") || (receta[15].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[15].actuador_pin == "8") || (receta[15].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[15].actuador_pin == "9") || (receta[15].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[15].actuador_pin == "10") || (receta[15].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[15].actuador_pin == "11") || (receta[15].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[15].actuador_pin == "12") || (receta[15].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[15].actuador_pin == "13") || (receta[15].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[15].actuador_pin == "1") ||  (receta[15].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[15].actuador_pin == "2") || (receta[15].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[15].actuador_pin == "3") || (receta[15].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[15].actuador_pin == "4") || (receta[15].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[15].actuador_pin == "5") || (receta[15].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[15].actuador_pin == "6") || (receta[15].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[15].actuador_pin == "7") || (receta[15].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[15].actuador_pin == "8") || (receta[15].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[15].actuador_pin == "9") || (receta[15].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[15].actuador_pin == "10") || (receta[15].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[15].actuador_pin == "11") || (receta[15].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[15].actuador_pin == "12") || (receta[15].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[15].actuador_pin == "13") || (receta[15].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[15].actuador_pin == "1") ||  (receta[15].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "2") || (receta[15].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "3") || (receta[15].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "4") || (receta[15].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "5") || (receta[15].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "6") || (receta[15].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "7") || (receta[15].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "8") || (receta[15].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "9") || (receta[15].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "10") || (receta[15].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "11") || (receta[15].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "12") || (receta[15].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[15].actuador_pin == "13") || (receta[15].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[15].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[15].sensor_pin == "1") || (receta[15].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "2") || (receta[15].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "3") || (receta[15].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "4") || (receta[15].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "5") || (receta[15].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "6") || (receta[15].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "7") || (receta[15].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "8") || (receta[15].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "9") || (receta[15].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "10") || (receta[15].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "11") || (receta[15].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "12") || (receta[15].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[15].sensor_pin == "13") || (receta[15].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[15].sensor_pin == "1") || (receta[15].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[15].sensor_pin == "2") || (receta[15].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[15].sensor_pin == "3") || (receta[15].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[15].sensor_pin == "4") || (receta[15].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[15].sensor_pin == "5") || (receta[15].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[15].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[15].sensor_pin == "1") || (receta[15].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[15].sensor_pin == "2") || (receta[15].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[15].sensor_pin == "3") || (receta[15].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[15].sensor_pin == "4") || (receta[15].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[15].sensor_pin == "5") || (receta[15].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[15].sensor_pin == "6") || (receta[15].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[15].sensor_pin == "7") || (receta[15].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(15, "4", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[15].sensor_pin == "8") || (receta[15].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[15].sensor_pin == "9") || (receta[15].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[15].sensor_pin == "10") || (receta[15].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[15].sensor_pin == "11") || (receta[15].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[15].sensor_pin == "12") || (receta[15].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(15, "0",receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(15, "1",receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[15].sensor_pin == "13") || (receta[15].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(15, "0", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(15, "1", receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[15].sensor_pin == "1") || (receta[15].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(15, '' + 20-this.value/50, receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[15].sensor_pin == "2") || (receta[15].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(15, '' + 20-this.value/50, receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[15].sensor_pin == "3") || (receta[15].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(15, '' + 20-this.value/50, receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[15].sensor_pin == "4") || (receta[15].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(15, '' + 20-this.value/50, receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[15].sensor_pin == "5") || (receta[15].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(15, '' + 20-this.value/50, receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora15 = procesarEntrada(15, null, receta[15].sensor_condicion_familia_nombre, receta[15].condicion_simbolo, receta[15].condicion_valor, receta[15].condicion_hora, ejecutadoHora15);
				break;
			}
	}
	
/////////////////////////////  RECETA 16  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[16] != null) {
		switch(receta[16].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[16].actuador_pin == "1") ||  (receta[16].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[16].actuador_pin == "2") || (receta[16].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[16].actuador_pin == "3") || (receta[16].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[16].actuador_pin == "4") || (receta[16].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[16].actuador_pin == "5") || (receta[16].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[16].actuador_pin == "6") || (receta[16].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[16].actuador_pin == "7") || (receta[16].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[16].actuador_pin == "8") || (receta[16].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[16].actuador_pin == "9") || (receta[16].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[16].actuador_pin == "10") || (receta[16].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[16].actuador_pin == "11") || (receta[16].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[16].actuador_pin == "12") || (receta[16].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[16].actuador_pin == "13") || (receta[16].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[16].actuador_pin == "1") ||  (receta[16].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[16].actuador_pin == "2") || (receta[16].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[16].actuador_pin == "3") || (receta[16].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[16].actuador_pin == "4") || (receta[16].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[16].actuador_pin == "5") || (receta[16].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[16].actuador_pin == "6") || (receta[16].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[16].actuador_pin == "7") || (receta[16].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[16].actuador_pin == "8") || (receta[16].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[16].actuador_pin == "9") || (receta[16].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[16].actuador_pin == "10") || (receta[16].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[16].actuador_pin == "11") || (receta[16].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[16].actuador_pin == "12") || (receta[16].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[16].actuador_pin == "13") || (receta[16].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[16].actuador_pin == "1") ||  (receta[16].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[16].actuador_pin == "2") || (receta[16].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[16].actuador_pin == "3") || (receta[16].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[16].actuador_pin == "4") || (receta[16].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[16].actuador_pin == "5") || (receta[16].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[16].actuador_pin == "6") || (receta[16].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[16].actuador_pin == "7") || (receta[16].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[16].actuador_pin == "8") || (receta[16].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[16].actuador_pin == "9") || (receta[16].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[16].actuador_pin == "10") || (receta[16].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[16].actuador_pin == "11") || (receta[16].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[16].actuador_pin == "12") || (receta[16].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[16].actuador_pin == "13") || (receta[16].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[16].actuador_pin == "1") ||  (receta[16].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "2") || (receta[16].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "3") || (receta[16].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "4") || (receta[16].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "5") || (receta[16].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "6") || (receta[16].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "7") || (receta[16].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "8") || (receta[16].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "9") || (receta[16].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "10") || (receta[16].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "11") || (receta[16].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "12") || (receta[16].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[16].actuador_pin == "13") || (receta[16].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[16].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[16].sensor_pin == "1") || (receta[16].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "2") || (receta[16].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "3") || (receta[16].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "4") || (receta[16].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "5") || (receta[16].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "6") || (receta[16].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "7") || (receta[16].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "8") || (receta[16].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "9") || (receta[16].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "10") || (receta[16].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "11") || (receta[16].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "12") || (receta[16].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[16].sensor_pin == "13") || (receta[16].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[16].sensor_pin == "1") || (receta[16].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[16].sensor_pin == "2") || (receta[16].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[16].sensor_pin == "3") || (receta[16].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[16].sensor_pin == "4") || (receta[16].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[16].sensor_pin == "5") || (receta[16].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[16].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[16].sensor_pin == "1") || (receta[16].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[16].sensor_pin == "2") || (receta[16].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[16].sensor_pin == "3") || (receta[16].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[16].sensor_pin == "4") || (receta[16].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[16].sensor_pin == "5") || (receta[16].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[16].sensor_pin == "6") || (receta[16].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[16].sensor_pin == "7") || (receta[16].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(16, "4", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[16].sensor_pin == "8") || (receta[16].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[16].sensor_pin == "9") || (receta[16].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[16].sensor_pin == "10") || (receta[16].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[16].sensor_pin == "11") || (receta[16].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[16].sensor_pin == "12") || (receta[16].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(16, "0",receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(16, "1",receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[16].sensor_pin == "13") || (receta[16].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(16, "0", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(16, "1", receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[16].sensor_pin == "1") || (receta[16].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(16, '' + 20-this.value/50, receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[16].sensor_pin == "2") || (receta[16].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(16, '' + 20-this.value/50, receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[16].sensor_pin == "3") || (receta[16].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(16, '' + 20-this.value/50, receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[16].sensor_pin == "4") || (receta[16].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(16, '' + 20-this.value/50, receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[16].sensor_pin == "5") || (receta[16].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(16, '' + 20-this.value/50, receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora16 = procesarEntrada(16, null, receta[16].sensor_condicion_familia_nombre, receta[16].condicion_simbolo, receta[16].condicion_valor, receta[16].condicion_hora, ejecutadoHora16);
				break;
			}
	}
	
/////////////////////////////  RECETA 17  //////////////////////////////////////////////////////////////////////////////////////
	if (receta[17] != null) {
		switch(receta[17].actuador_tipo_codigo) {
	    case "led":
	    	if ((receta[17].actuador_pin == "1") ||  (receta[17].actuador_pin == 1)){
	    		led1 = new five.Led(1);
	    	} else if ((receta[17].actuador_pin == "2") || (receta[17].actuador_pin == 2)) {
	    		led2 = new five.Led(2);
	    	} else if ((receta[17].actuador_pin == "3") || (receta[17].actuador_pin == 3)) {
	    		led3 = new five.Led(3);
	    	} else if ((receta[17].actuador_pin == "4") || (receta[17].actuador_pin == 4)) {
	    		led4 = new five.Led(4);
	    	} else if ((receta[17].actuador_pin == "5") || (receta[17].actuador_pin == 5)) {
	    		led5 = new five.Led(5);
	    	} else if ((receta[17].actuador_pin == "6") || (receta[17].actuador_pin == 6)) {
	    		led6 = new five.Led(6);
	    	} else if ((receta[17].actuador_pin == "7") || (receta[17].actuador_pin == 7)) {
	    		led7 = new five.Led(7);
	    	} else if ((receta[17].actuador_pin == "8") || (receta[17].actuador_pin == 8)) {
	    		led8 = new five.Led(8);
	    	} else if ((receta[17].actuador_pin == "9") || (receta[17].actuador_pin == 9)) {
	    		led9 = new five.Led(9);
	    	} else if ((receta[17].actuador_pin == "10") || (receta[17].actuador_pin == 10)) {
	    		led10 = new five.Led(10);
	    	} else if ((receta[17].actuador_pin == "11") || (receta[17].actuador_pin == 11)) {
	    		led11 = new five.Led(11);
	    	} else if ((receta[17].actuador_pin == "12") || (receta[17].actuador_pin == 12)) {
	    		led12 = new five.Led(12);
	    	} else if ((receta[17].actuador_pin == "13") || (receta[17].actuador_pin == 13)) {
	    		led13 = new five.Led(13);
	    	} 
	        break;
	    case "miniserv":
	    	if ((receta[17].actuador_pin == "1") ||  (receta[17].actuador_pin == 1)){
				miniservo1 = new five.Servo.Continuous(1);
	    	} else if ((receta[17].actuador_pin == "2") || (receta[17].actuador_pin == 2)) {
				miniservo2 = new five.Servo.Continuous(2);
	    	} else if ((receta[17].actuador_pin == "3") || (receta[17].actuador_pin == 3)) {
				miniservo3 = new five.Servo.Continuous(3);
	    	} else if ((receta[17].actuador_pin == "4") || (receta[17].actuador_pin == 4)) {
				miniservo4 = new five.Servo.Continuous(4);
	    	} else if ((receta[17].actuador_pin == "5") || (receta[17].actuador_pin == 5)) {
				miniservo5 = new five.Servo.Continuous(5);
	    	} else if ((receta[17].actuador_pin == "6") || (receta[17].actuador_pin == 6)) {
				miniservo6 = new five.Servo.Continuous(6);
	    	} else if ((receta[17].actuador_pin == "7") || (receta[17].actuador_pin == 7)) {
				miniservo7 = new five.Servo.Continuous(7);
	    	} else if ((receta[17].actuador_pin == "8") || (receta[17].actuador_pin == 8)) {
				miniservo8 = new five.Servo.Continuous(8);
	    	} else if ((receta[17].actuador_pin == "9") || (receta[17].actuador_pin == 9)) {
				miniservo9 = new five.Servo.Continuous(9);
	    	} else if ((receta[17].actuador_pin == "10") || (receta[17].actuador_pin == 10)) {
				miniservo10 = new five.Servo.Continuous(10);
	    	} else if ((receta[17].actuador_pin == "11") || (receta[17].actuador_pin == 11)) {
				miniservo11 = new five.Servo.Continuous(11);
	    	} else if ((receta[17].actuador_pin == "12") || (receta[17].actuador_pin == 12)) {
				miniservo12 = new five.Servo.Continuous(12);
	    	} else if ((receta[17].actuador_pin == "13") || (receta[17].actuador_pin == 13)) {
				miniservo13 = new five.Servo.Continuous(13);
	    	} 
	        break;
	    case "piezo":
	    	if ((receta[17].actuador_pin == "1") ||  (receta[17].actuador_pin == 1)){
	    		zumbador1 = new five.Piezo(1);
	    	} else if ((receta[17].actuador_pin == "2") || (receta[17].actuador_pin == 2)) {
	    		zumbador2 = new five.Piezo(2);
	    	} else if ((receta[17].actuador_pin == "3") || (receta[17].actuador_pin == 3)) {
	    		zumbador3 = new five.Piezo(3);
	    	} else if ((receta[17].actuador_pin == "4") || (receta[17].actuador_pin == 4)) {
	    		zumbador4 = new five.Piezo(4);
	    	} else if ((receta[17].actuador_pin == "5") || (receta[17].actuador_pin == 5)) {
	    		zumbador5 = new five.Piezo(5);
	    	} else if ((receta[17].actuador_pin == "6") || (receta[17].actuador_pin == 6)) {
	    		zumbador6 = new five.Piezo(6);
	    	} else if ((receta[17].actuador_pin == "7") || (receta[17].actuador_pin == 7)) {
	    		zumbador7 = new five.Piezo(7);
	    	} else if ((receta[17].actuador_pin == "8") || (receta[17].actuador_pin == 8)) {
	    		zumbador8 = new five.Piezo(8);
	    	} else if ((receta[17].actuador_pin == "9") || (receta[17].actuador_pin == 9)) {
	    		zumbador9 = new five.Piezo(9);
	    	} else if ((receta[17].actuador_pin == "10") || (receta[17].actuador_pin == 10)) {
	    		zumbador10 = new five.Piezo(10);
	    	} else if ((receta[17].actuador_pin == "11") || (receta[17].actuador_pin == 11)) {
	    		zumbador11 = new five.Piezo(11);
	    	} else if ((receta[17].actuador_pin == "12") || (receta[17].actuador_pin == 12)) {
	    		zumbador12 = new five.Piezo(12);
	    	} else if ((receta[17].actuador_pin == "13") || (receta[17].actuador_pin == 13)) {
	    		zumbador13 = new five.Piezo(13);
	    	} 
	        break;
	    case "rele":
	    	if ((receta[17].actuador_pin == "1") ||  (receta[17].actuador_pin == 1)){
				rele1 = new five.Relay({
					  pin: 1, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "2") || (receta[17].actuador_pin == 2)) {
				rele2 = new five.Relay({
					  pin: 2, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "3") || (receta[17].actuador_pin == 3)) {
				rele3 = new five.Relay({
					  pin: 3, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "4") || (receta[17].actuador_pin == 4)) {
				rele4 = new five.Relay({
					  pin: 4, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "5") || (receta[17].actuador_pin == 5)) {
				rele5 = new five.Relay({
					  pin: 5, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "6") || (receta[17].actuador_pin == 6)) {
				rele6 = new five.Relay({
					  pin: 6, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "7") || (receta[17].actuador_pin == 7)) {
				rele7 = new five.Relay({
					  pin: 7, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "8") || (receta[17].actuador_pin == 8)) {
				rele8 = new five.Relay({
					  pin: 8, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "9") || (receta[17].actuador_pin == 9)) {
				rele9 = new five.Relay({
					  pin: 9, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "10") || (receta[17].actuador_pin == 10)) {
				rele10 = new five.Relay({
					  pin: 10, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "11") || (receta[17].actuador_pin == 11)) {
				rele11 = new five.Relay({
					  pin: 11, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "12") || (receta[17].actuador_pin == 12)) {
				rele12 = new five.Relay({
					  pin: 12, 
					  type: "NC"
					});
	    	} else if ((receta[17].actuador_pin == "13") || (receta[17].actuador_pin == 13)) {
				rele13 = new five.Relay({
					  pin: 13, 
					  type: "NC"
					});
	    	} 
	        break;
		}
		
		switch(receta[17].sensor_tipo_codigo) {
	    case "pulsador":
	    	if ((receta[17].sensor_pin == "1") || (receta[17].sensor_pin == 1)){
	    		pulsador1 = new five.Button(1);
	    		this.pinMode(1, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "2") || (receta[17].sensor_pin == 2)){
	    		pulsador2 = new five.Button(2);
	    		this.pinMode(2, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "3") || (receta[17].sensor_pin == 3)){
	    		pulsador3 = new five.Button(3);
	    		this.pinMode(3, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "4") || (receta[17].sensor_pin == 4)){
	    		pulsador4 = new five.Button(4);
	    		this.pinMode(4, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "5") || (receta[17].sensor_pin == 5)){
	    		pulsador5 = new five.Button(5);
	    		this.pinMode(5, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "6") || (receta[17].sensor_pin == 6)){
	    		pulsador6 = new five.Button(6);
	    		this.pinMode(6, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "7") || (receta[17].sensor_pin == 7)){
	    		pulsador7 = new five.Button(7);
	    		this.pinMode(7, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "8") || (receta[17].sensor_pin == 8)){
	    		pulsador8 = new five.Button(8);
	    		this.pinMode(8, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "9") || (receta[17].sensor_pin == 9)){
	    		pulsador9 = new five.Button(9);
	    		this.pinMode(9, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "10") || (receta[17].sensor_pin == 10)){
	    		pulsador10 = new five.Button(10);
	    		this.pinMode(10, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "11") || (receta[17].sensor_pin == 11)){
	    		pulsador11 = new five.Button(11);
	    		this.pinMode(11, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "12") || (receta[17].sensor_pin == 12)){
	    		pulsador12 = new five.Button(12);
	    		this.pinMode(12, five.Pin.INPUT);
	    	} else if ((receta[17].sensor_pin == "13") || (receta[17].sensor_pin == 13)){
	    		pulsador13 = new five.Button(13);
	    		this.pinMode(13, five.Pin.INPUT);
	    	} 
	        break;
	    case "senluz":
	    case "microfon":
	    	if ((receta[17].sensor_pin == "1") || (receta[17].sensor_pin == 1)){
				sensor1 = new five.Sensor({
				    pin: "A1",
				    freq: 250
				});
	    	} else if ((receta[17].sensor_pin == "2") || (receta[17].sensor_pin == 2)){
				sensor2 = new five.Sensor({
				    pin: "A2",
				    freq: 250
				  });
	    	} else if ((receta[17].sensor_pin == "3") || (receta[17].sensor_pin == 3)){
				sensor3 = new five.Sensor({
				    pin: "A3",
				    freq: 250
				  });
	    	} else if ((receta[17].sensor_pin == "4") || (receta[17].sensor_pin == 4)){
				sensor4 = new five.Sensor({
				    pin: "A4",
				    freq: 250
				  });
	    	} else if ((receta[17].sensor_pin == "5") || (receta[17].sensor_pin == 5)){
				sensor5 = new five.Sensor({
				    pin: "A5",
				    freq: 250
				  });
	    	} 
        break;
		}

		switch(receta[17].sensor_tipo_codigo) {
		    case "pulsador":
				if ((receta[17].sensor_pin == "1") || (receta[17].sensor_pin == 1)){
		    		this.digitalRead(1, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado1 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado1 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado1);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[17].sensor_pin == "2") || (receta[17].sensor_pin == 2)){
		    		this.digitalRead(2, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado2 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado2 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado2);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[17].sensor_pin == "3") || (receta[17].sensor_pin == 3)){
		    		this.digitalRead(3, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado3 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado3 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado3);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[17].sensor_pin == "4") || (receta[17].sensor_pin == 4)){
		    		this.digitalRead(4, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado4 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado4 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado4);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[17].sensor_pin == "5") || (receta[17].sensor_pin == 5)){
		    		this.digitalRead(5, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado5 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado5 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado5);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[17].sensor_pin == "6") || (receta[17].sensor_pin == 6)){
		    		this.digitalRead(6, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado6 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado6 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado6);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});
				} else if ((receta[17].sensor_pin == "7") || (receta[17].sensor_pin == 7)){
		    		this.digitalRead(7, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado7 = procesarEntrada(17, "4", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado7 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado7);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} else if ((receta[17].sensor_pin == "8") || (receta[17].sensor_pin == 8)) {
		    		this.digitalRead(8, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado8 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado8 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado8);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[17].sensor_pin == "9") || (receta[17].sensor_pin == 9)){
		    		this.digitalRead(9, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado9 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado9);
							io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado9 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado9);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[17].sensor_pin == "10") || (receta[17].sensor_pin == 10)){
		    		this.digitalRead(10, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado10 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado10 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado10);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[17].sensor_pin == "11") || (receta[17].sensor_pin == 11)){
		    		this.digitalRead(11, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado11 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado11 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado11);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[17].sensor_pin == "12") || (receta[17].sensor_pin == 12)){
		    		this.digitalRead(12, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado12 = procesarEntrada(17, "0",receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado12 = procesarEntrada(17, "1",receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado12);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
				} else if ((receta[17].sensor_pin == "13") || (receta[17].sensor_pin == 13)){
		    		this.digitalRead(13, function(value) {
		    			if(value === 0) {
		    		    	console.log('Suelto');
							ejecutado13 = procesarEntrada(17, "0", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador soltado');
		    			} else if (value === 1) {
		    				console.log('Pulsado');
							ejecutado13 = procesarEntrada(17, "1", receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutado13);
		    				io.emit('pulsador', 'Pulsador pulsado');
		    		    }
		    		});	    		
		    	} 
		        break;
		    case "senluz":
		    case "microfon":
				if ((receta[17].sensor_pin == "1") || (receta[17].sensor_pin == 1)){
					sensor1.on("data", function() {
						ejecutadoA1 = procesarEntrada(17, '' + 20-this.value/50, receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutadoA1);
					});
				} else if ((receta[17].sensor_pin == "2") || (receta[17].sensor_pin == 2)){
					sensor2.on("data", function() {
						ejecutadoA2 = procesarEntrada(17, '' + 20-this.value/50, receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutadoA2);
					});
				} else if ((receta[17].sensor_pin == "3") || (receta[17].sensor_pin == 3)){
					sensor3.on("data", function() {
						ejecutadoA3 = procesarEntrada(17, '' + 20-this.value/50, receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutadoA3);
					});
				} else if ((receta[17].sensor_pin == "4") || (receta[17].sensor_pin == 4)){
					sensor4.on("data", function() {
						ejecutadoA4 = procesarEntrada(17, '' + 20-this.value/50, receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutadoA4);
					});
				} else if ((receta[17].sensor_pin == "5") || (receta[17].sensor_pin == 5)){
					sensor5.on("data", function() {
						ejecutadoA5 = procesarEntrada(17, '' + 20-this.value/50, receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutadoA5);
					});
		    	} 
		        break;
			case "webhora":
				ejecutadoHora17 = procesarEntrada(17, null, receta[17].sensor_condicion_familia_nombre, receta[17].condicion_simbolo, receta[17].condicion_valor, receta[17].condicion_hora, ejecutadoHora17);
				break;
			}
	}			
});

function procesarEntrada(idreceta, dato, condicionFamilia, condicionSimbolo, condicionValor, condicionHora, ejecutado){
	var ejecutadoAux = ejecutado;
	
	if (condicionFamilia == "tamano") {
		switch(condicionSimbolo) {
		    case "==":
		    	if (dato == condicionValor) {
		    		ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
				} else {
					ejecutarReceta(receta[idreceta].actuador_tipo_codigo, false, receta[idreceta].actuador_pin);
				}
		        break;
		    case ">":
				if (dato > condicionValor) {
					ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
				} else {
					ejecutarReceta(receta[idreceta].actuador_tipo_codigo, false, receta[idreceta].actuador_pin);
				}
		        break;
		    case "<":
				if (dato < condicionValor) {
					ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
				} else {
					ejecutarReceta(receta[idreceta].actuador_tipo_codigo, false, receta[idreceta].actuador_pin);
				}					
		        break;
		    case "!=":
		    	if (dato != condicionValor) {
		    		ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
				} else {
					ejecutarReceta(receta[idreceta].actuador_tipo_codigo, false, receta[idreceta].actuador_pin);
				}
		        break;
		    case ">=":
				if (dato >= condicionValor) {
					ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
				} else {
					ejecutarReceta(receta[idreceta].actuador_tipo_codigo, false, receta[idreceta].actuador_pin);
				}					
		        break;
		    case "<=":
				if (dato <= condicionValor) {
					ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
				} else {
					ejecutarReceta(receta[idreceta].actuador_tipo_codigo, false, receta[idreceta].actuador_pin);
				}					
		        break;
		  }
	}  else if (condicionFamilia == "booleano") {
		if (dato == condicionSimbolo) {
			ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
		} else {
			ejecutarReceta(receta[idreceta].actuador_tipo_codigo, false, receta[idreceta].actuador_pin);
		}
	} else if (condicionFamilia == "hora") {
		var hora = condicionHora.substring(0, 2);
		var minuto = condicionHora.substring(3, 5);
		var segundo = condicionHora.substring(6, 8);
		var string_cron = segundo + " " + minuto + " " + hora + " * * *";
		if (programado[idreceta]!=false) {
			switch(condicionSimbolo) {
				case "<":
					if (receta[idreceta].on_off = "i") {
						ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
						programacion = schedule.scheduleJob(string_cron, function(){
							ejecutarReceta(receta[idreceta].actuador_tipo_codigo, false, receta[idreceta].actuador_pin);
							programado[idreceta] = true;
						});
					} else {
						programacion = schedule.scheduleJob(string_cron, function(){
							ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
							programado[idreceta] = true;
						});
					}
					break;
				case ">=":
					if (receta[idreceta].on_off = "i") {
						programacion = schedule.scheduleJob(string_cron, function(){
							ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
							programado[idreceta] = true;
						});
					} else {
						ejecutarReceta(receta[idreceta].actuador_tipo_codigo, true, receta[idreceta].actuador_pin);
						programacion = schedule.scheduleJob(string_cron, function(){
							ejecutarReceta(receta[idreceta].actuador_tipo_codigo, false, receta[idreceta].actuador_pin);
							programado[idreceta] = true;
						});
					}
					break;
			}
		}
		
	}
	
	return ejecutadoAux;
}

function ejecutarReceta(actuador, orden, pin) {
	io.emit('ledEstado', orden);
	  switch(actuador) {
	    case 'led':
	    	if ((pin == "0") || (pin == 0)){
		    	if (orden) {
		    		led0.on();
				} else {
			    	led0.off();
				}
	    	} else if ((pin == "1") || (pin == 1)){
		    	if (orden) {
		    		led1.on();
				} else {
			    	led1.off();
				}
	    	} else if ((pin == "2") || (pin == 2)){
		    	if (orden) {
		    		led2.on();
				} else {
			    	led2.off();
				}
	    	} else if ((pin == "3") || (pin == 3)){
		    	if (orden) {
		    		led3.on();
				} else {
			    	led3.off();
				}
	    	} else if ((pin == "4") || (pin == 4)){
		    	if (orden) {
		    		led4.on();
				} else {
			    	led4.off();
				}
	    	} else if ((pin == "5") || (pin == 5)){
		    	if (orden) {
		    		led5.on();
				} else {
			    	led5.off();
				}
	    	} else if ((pin == "6") || (pin == 6)){
		    	if (orden) {
		    		led6.on();
				} else {
			    	led6.off();
				}
	    	} else if ((pin == "7") || (pin == 7)){
		    	if (orden) {
		    		led7.on();
				} else {
			    	led7.off();
				}
	    	} else if ((pin == "8") || (pin == 8)){
		    	if (orden) {
		    		led8.on();
				} else {
			    	led8.off();
				}
	    	} else if ((pin == "9") || (pin == 9)){
		    	if (orden) {
		    		led9.on();
				} else {
			    	led9.off();
				}
	    	} else if ((pin == "10") || (pin == 10)){
		    	if (orden) {
		    		led10.on();
				} else {
			    	led10.off();
				}
	    	} else if ((pin == "11") || (pin == 11)){
		    	if (orden) {
		    		led11.on();
				} else {
			    	led11.off();
				}
	    	} else if ((pin == "12") || (pin == 12)){
		    	if (orden) {
		    		led12.on();
				} else {
			    	led12.off();
				}
	    	} else if ((pin == "13") || (pin == 13)){
		    	if (orden) {
		    		led13.on();
				} else {
			    	led13.off();
				}
	    	}
	
	    	if (orden) {
		        console.log('LED ON RECIBIDO');
				io.emit('actuadorEstado', 'LED encendido');				
			} else {
		        console.log('LED OFF RECIBIDO');
				io.emit('actuadorEstado', 'LED apagado');				
			}
	        break;
	    case 'servo':
	    	if ((pin == "0") || (pin == 0)){
		    	if (orden) {
		        	miniservo0.cw();
				} else {
			    	miniservo0.stop();
				}
	    	} else if ((pin == "1") || (pin == 1)){
		    	if (orden) {
		        	miniservo1.cw();
				} else {
			    	miniservo1.stop();
				}
	    	} else if ((pin == "2") || (pin == 2)){
		    	if (orden) {
		        	miniservo2.cw();
				} else {
			    	miniservo2.stop();
				}
	    	} else if ((pin == "3") || (pin == 3)){
		    	if (orden) {
		        	miniservo3.cw();
				} else {
			    	miniservo3.stop();
				}
	    	} else if ((pin == "4") || (pin == 4)){
		    	if (orden) {
		        	miniservo4.cw();
				} else {
			    	miniservo4.stop();
				}
	    	} else if ((pin == "5") || (pin == 5)){
		    	if (orden) {
		        	miniservo5.cw();
				} else {
			    	miniservo5.stop();
				}
	    	} else if ((pin == "6") || (pin == 6)){
		    	if (orden) {
		        	miniservo6.cw();
				} else {
			    	miniservo6.stop();
				}
	    	} else if ((pin == "7") || (pin == 7)){
		    	if (orden) {
		        	miniservo7.cw();
				} else {
			    	miniservo7.stop();
				}
	    	} else if ((pin == "8") || (pin == 8)){
		    	if (orden) {
		        	miniservo8.cw();
				} else {
			    	miniservo8.stop();
				}
	    	} else if ((pin == "9") || (pin == 9)){
		    	if (orden) {
		        	miniservo9.cw();
				} else {
			    	miniservo9.stop();
				}
	    	} else if ((pin == "10") || (pin == 10)){
		    	if (orden) {
		        	miniservo10.cw();
				} else {
			    	miniservo10.stop();
				}
	    	} else if ((pin == "11") || (pin == 11)){
		    	if (orden) {
		        	miniservo11.cw();
				} else {
			    	miniservo11.stop();
				}
	    	} else if ((pin == "12") || (pin == 12)){
		    	if (orden) {
		        	miniservo12.cw();
				} else {
			    	miniservo12.stop();
				}
	    	} else if ((pin == "13") || (pin == 13)){
		    	if (orden) {
		        	miniservo13.cw();
				} else {
			    	miniservo13.stop();
				}
	    	}
	    	if (orden){
	            console.log('SERVO ON RECIBIDO');
	    		io.emit('actuadorEstado', 'Servo encendido');
			} else {
		        console.log('SERVO OFF RECIBIDO');
				io.emit('actuadorEstado', 'Servo apagado');				
			}
	        break;
	    case 'piezo':
	    	if ((pin == "0") || (pin == 0)){
		    	if (orden) {
		        	zumbador0.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador0.noTone();
				}
	    	} else if ((pin == "1") || (pin == 1)){
		    	if (orden) {
		        	zumbador1.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador1.noTone();
				}
	    	} else if ((pin == "2") || (pin == 2)){
		    	if (orden) {
		        	zumbador2.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador2.noTone();
				}
	    	} else if ((pin == "3") || (pin == 3)){
		    	if (orden) {
		        	zumbador3.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador3.noTone();
				}
	    	} else if ((pin == "4") || (pin == 4)){
		    	if (orden) {
		        	zumbador4.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador4.noTone();
				}
	    	} else if ((pin == "5") || (pin == 5)){
		    	if (orden) {
		        	zumbador5.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador5.noTone();
				}
	    	} else if ((pin == "6") || (pin == 6)){
		    	if (orden) {
		        	zumbador6.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador6.noTone();
				}
	    	} else if ((pin == "7") || (pin == 7)){
		    	if (orden) {
		        	zumbador7.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador7.noTone();
				}
	    	} else if ((pin == "8") || (pin == 8)){
		    	if (orden) {
		        	zumbador8.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador8.noTone();
				}
	    	} else if ((pin == "9") || (pin == 9)){
		    	if (orden) {
		        	zumbador9.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador9.noTone();
				}
	    	} else if ((pin == "10") || (pin == 10)){
		    	if (orden) {
		        	zumbador10.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador10.noTone();
				}
	    	} else if ((pin == "11") || (pin == 11)){
		    	if (orden) {
		        	zumbador11.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador11.noTone();
				}
	    	} else if ((pin == "12") || (pin == 12)){
		    	if (orden) {
		        	zumbador12.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador12.noTone();
				}
	    	} else if ((pin == "13") || (pin == 13)){
		    	if (orden) {
		        	zumbador13.play({
		        	    song: [
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["A4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["A4", 1],
		        	      ["G4", 1],
		        	      [null, 1 / 2],
		        	      ["C4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["F4", 1 / 4],
		        	      ["D4", 1 / 4],
		        	      ["G4", 1 / 4],
		        	      [null, 1 / 4],
		        	      ["G4", 1],
		        	      ["F4", 1],
		        	      [null, 1 / 2]
		        	    ],
		        	    tempo: 100
		        	  });
				} else {
			    	zumbador13.noTone();
				}
	    	}
	    	if (orden){
	            console.log('PIEZO ON RECIBIDO');
	    		io.emit('actuadorEstado', 'Zumbador sonando');
			} else {
		        console.log('PIEZO OFF RECIBIDO');
				io.emit('actuadorEstado', 'Zumbador apagado');
			}
	        break;
	    case 'rele':
	    	if ((pin == "0") || (pin == 0)){
		    	if (orden) {
		        	rele0.on();
				} else {
			    	rele0.off();
				}
	    	} else if ((pin == "1") || (pin == 1)){
		    	if (orden) {
		        	rele1.on();
				} else {
			    	rele1.off();
				}
	    	} else if ((pin == "2") || (pin == 2)){
		    	if (orden) {
		        	rele2.on();
				} else {
			    	rele2.off();
				}
	    	} else if ((pin == "3") || (pin == 3)){
		    	if (orden) {
		        	rele3.on();
				} else {
			    	rele3.off();
				}
	    	} else if ((pin == "4") || (pin == 4)){
		    	if (orden) {
		        	rele4.on();
				} else {
			    	rele4.off();
				}
	    	} else if ((pin == "5") || (pin == 5)){
		    	if (orden) {
		        	rele5.on();
				} else {
			    	rele5.off();
				}
	    	} else if ((pin == "6") || (pin == 6)){
		    	if (orden) {
		        	rele6.on();
				} else {
			    	rele6.off();
				}
	    	} else if ((pin == "7") || (pin == 7)){
		    	if (orden) {
		        	rele7.on();
				} else {
			    	rele7.off();
				}
	    	} else if ((pin == "8") || (pin == 8)){
		    	if (orden) {
		        	rele8.on();
				} else {
			    	rele8.off();
				}
	    	} else if ((pin == "9") || (pin == 9)){
		    	if (orden) {
		        	rele9.on();
				} else {
			    	rele9.off();
				}
	    	} else if ((pin == "10") || (pin == 10)){
		    	if (orden) {
		        	rele10.on();
				} else {
			    	rele10.off();
				}
	    	} else if ((pin == "11") || (pin == 11)){
		    	if (orden) {
		        	rele11.on();
				} else {
			    	rele11.off();
				}
	    	} else if ((pin == "12") || (pin == 12)){
		    	if (orden) {
		        	rele12.on();
				} else {
			    	rele12.off();
				}
	    	} else if ((pin == "13") || (pin == 13)){
		    	if (orden) {
		        	rele13.on();
				} else {
			    	rele13.off();
				}
	    	}
	    	if (orden){
	            console.log('RELE ON RECIBIDO');
	    		io.emit('actuadorEstado', 'Rele encendido');
			} else {
		        console.log('RELE OFF RECIBIDO');
				io.emit('actuadorEstado', 'Rele apagado');
			}
	        break;
	  }
}