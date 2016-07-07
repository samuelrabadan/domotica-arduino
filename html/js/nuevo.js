var arduino; //Variable global que contendrÃ¡ el Arduino activo para poder aÃ±adirle nuevas acciones
//FunciÃ³n para asignar un valor a la variable global que contiene el Arduino activo

function arduino_activo(activo){
	arduino=activo;
}

//FunciÃ³n llamada por el modal que contiene el formulario con los valores para eliminar la acciÃ³n. AquÃ­ es donde realmente se elimina
function eliminar_accion(accion){
	var xhr; 

	//Rutina de Ajax para poder actualizar informaciÃ³n vÃ­a PHP sin refrescar la pÃ¡gina
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();  
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");  
	}
	//Pregunta de confirmaciÃ³n para evitar errores de usuario
	var r = confirm("¿Está seguro de que desea eliminar la acción seleccionada?");
	//Si todo es correcto se lanza el DELETE en la tabla ACCIONES
	if (r == true) {
		var sentencia2 = "DELETE FROM sensores WHERE nombre = '" + accion + "'" ;
		var data2 = "sentencia=" + sentencia2; 
		xhr.open("POST", "comandosdb.php", true);   
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
		xhr.send(data2); 
		window.location.reload(true);
	}
}

//FunciÃ³n llamada por el modal que contiene el formulario con los valores para eliminar la reacciÃ³n seleccionada. AquÃ­ es donde realmente se elimina
function eliminar_reaccion(reaccion){
	var xhr; 

	//Rutina de Ajax para poder actualizar informaciÃ³n vÃ­a PHP sin refrescar la pÃ¡gina
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();  
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");  
	}
	//Pregunta de confirmaciÃ³n para evitar errores de usuario
	var r = confirm("Â¿EstÃ¡ seguro de que desea eliminar la reacciÃ³n seleccionada?");
	//Si todo es correcto se lanza el DELETE en la tabla REACCIONES
	if (r == true) {
		var sentencia3 = "DELETE FROM actuadores WHERE nombre = '" + reaccion + "'" ;
		var data3 = "sentencia=" + sentencia3; 
		xhr.open("POST", "comandosdb.php", true);   
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
		xhr.send(data3); 
		window.location.reload(true);
	}
}

//FunciÃ³n llamada por el modal que contiene el formulario con los valores para eliminar los Arduinos. AquÃ­ es donde realmente se eliminan
function eliminar_arduino(valor){
	var xhr; 

	//Rutina de Ajax para poder actualizar informaciÃ³n vÃ­a PHP sin refrescar la pÃ¡gina
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();  
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");  
	}
	//Pregunta de confirmaciÃ³n para evitar errores de usuario
	var r = confirm("Â¿EstÃ¡ seguro de que desea eliminar este Arduino?");
	//Si todo es correcto se lanza el DELETE en la tabla ARDUINOS
	if (r == true) { 
		var sentencia2 = "DELETE FROM arduinos WHERE nombre = '" + valor + "'" ;
		var data2 = "sentencia=" + sentencia2; 
		xhr.open("POST", "comandosdb.php", true);   
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
		xhr.send(data2); 
		window.location.reload(true);
	}
}

function deshabilitarPin() {
	var opcion = document.forms[1].actuadorAccion.value;

	if ((opcion=="webboton") || (opcion=="webcalen")) {
		document.getElementById("pinAccion").disabled = true;
	}
	else {
		document.getElementById("pinAccion").disabled = false;
	}
}
