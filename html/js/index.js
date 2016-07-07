var receta;    	 	

function receta_activa(activo){
	receta=activo;
}

function actuadorJSON (actuadorTipo, pinActuador, encender) {
var estado;
	if ((encender==true) || (encender=="true") || (encender=="on")){
		estado = true;
	} else {
		estado = false;
	}
	xhr = new XMLHttpRequest();
	var url = "http://172.26.0.101:3001/ordenSensor";
	var params = "actuador="+actuadorTipo+"&pin="+pinActuador+"&comando="+estado;
	xhr.open("POST", url, true);
	
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	xhr.send(params);	
}
