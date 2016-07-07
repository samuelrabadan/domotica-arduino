var sensorActivoInfo;
var condicionActivaTipo;
var sensorActivoNombre;
var sensorActivoTipo;

function sensorAcivo(){
	sensorActivoInfo = document.forms[0].accionReceta.value;
	condicionActivaTipo = sensorActivoInfo.substring(0, sensorActivoInfo.indexOf(':'));
	sensorActivoNombre = sensorActivoInfo.substring(sensorActivoInfo.indexOf(':')+1,sensorActivoInfo.indexOf('@'));
	sensorActivoTipo = sensorActivoInfo.substring(sensorActivoInfo.indexOf('@')+1);
	if (condicionActivaTipo == "tamano"){
		if ((sensorActivoTipo == "senluz") || (sensorActivoTipo == "microfon")){
			document.getElementById("condicionRecetaTamano").style.display = "block";
			document.getElementById("condicionRecetaBooleano").style.display = "none";
			document.getElementById("condicionRecetaHora").style.display = "none";
			document.getElementById("valorTamano").style.display = "none";
			document.getElementById("valorHora").style.display = "none";
			document.getElementById("valorSensor").style.display = "block";
			
		} else {
			document.getElementById("condicionRecetaTamano").style.display = "block";
			document.getElementById("condicionRecetaBooleano").style.display = "none";
			document.getElementById("condicionRecetaHora").style.display = "none";
			document.getElementById("valorTamano").style.display = "block";
			document.getElementById("valorHora").style.display = "none";
			document.getElementById("valorSensor").style.display = "none";
		}
	}
	else if (condicionActivaTipo == "booleano"){
		document.getElementById("condicionRecetaTamano").style.display = "none";
		document.getElementById("condicionRecetaBooleano").style.display = "block";
		document.getElementById("condicionRecetaHora").style.display = "none";
		document.getElementById("valorTamano").style.display = "none";
		document.getElementById("valorHora").style.display = "none";
		document.getElementById("valorSensor").style.display = "none";
	}
	else if (condicionActivaTipo == "hora"){
		document.getElementById("condicionRecetaTamano").style.display = "none";
		document.getElementById("condicionRecetaBooleano").style.display = "none";
		document.getElementById("condicionRecetaHora").style.display = "block";
		document.getElementById("valorTamano").style.display = "none";
		document.getElementById("valorHora").style.display = "block";
		document.getElementById("valorSensor").style.display = "none";
	}
}

//Esta funciÃ³n es la que muestra el modal que preguntarÃ¡ por los datos para crear la receta y solo mostrarÃ¡ la informaciÃ³n relacionada con el Arduino seleccionado.
function mostrar_crear_receta(arduino) {
var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
                document.getElementById("popupNuevaReceta").innerHTML = xmlhttp.responseText;
        }
		xmlhttp.open("GET","nuevareceta.php?resultado="+arduino,true);
        xmlhttp.send();
		$("#popupNuevaReceta").modal('show');
}

//FunciÃ³n llamada por el modal que contiene el formulario con los valofres para crear el Arduino. AquÃ­ es donde realmente se crea
function crear_receta(arduino){
	var xhr;  
	var io =$('input[name=io]:checked').val();
//	var valorTamano = parseInt(document.getElementById('valorRecetaTamano').value);
	var valorTamano = document.getElementById('valorRecetaTamano').value;
	var valorSensor = document.getElementById('valorRecetaSensor').value;
	var valorHora = document.getElementById("valorRecetaHora").value;
	var insertar = "ok";
	var sentencia;

	sensorActivoInfo = document.forms[0].accionReceta.value;
	condicionActivaTipo = sensorActivoInfo.substring(0, sensorActivoInfo.indexOf(':'));
	sensorActivoNombre = sensorActivoInfo.substring(sensorActivoInfo.indexOf(':')+1,sensorActivoInfo.indexOf('@'));
	sensorActivoTipo = sensorActivoInfo.substring(sensorActivoInfo.indexOf('@')+1);
	
	//Rutina de Ajax para poder actualizar informaciÃ³n vÃ­a PHP sin refrescar la pÃ¡gina
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();  
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");  
	}
	
	if ((io!="i") && (io!="o")) {
		alert ("ERROR: faltan datos");
	}
	else {
		//Lanzo el INSERT en la tabla RECETAS y llamamos a la pÃ¡gina COMANDOSDB.PHP vÃ­a Ajax
		if (condicionActivaTipo=="tamano") {
			if ((sensorActivoTipo == "senluz") || (sensorActivoTipo == "microfon")){
				sentencia = "INSERT INTO recetas(io,nombre,accion_nombre,condicion_nombre,reaccion_nombre,valor_condicion,arduino_nombre) VALUES ('" + io + "','" + document.getElementById('nombreReceta').value + "','" + sensorActivoNombre + "','" + document.getElementById('condicionRecetaTamano').value + "','" + document.getElementById('reaccionReceta').value + "','" + valorSensor + "','" + arduino + "')";	
			} else {
				sentencia = "INSERT INTO recetas(io,nombre,accion_nombre,condicion_nombre,reaccion_nombre,valor_condicion,arduino_nombre) VALUES ('" + io + "','" + document.getElementById('nombreReceta').value + "','" + sensorActivoNombre + "','" + document.getElementById('condicionRecetaTamano').value + "','" + document.getElementById('reaccionReceta').value + "','" + valorTamano + "','" + arduino + "')";	
			}
		}
		else if (condicionActivaTipo == "booleano"){
			sentencia = "INSERT INTO recetas(io,nombre,accion_nombre,condicion_nombre,reaccion_nombre,arduino_nombre) VALUES ('" + io + "','" + document.getElementById('nombreReceta').value + "','" + sensorActivoNombre + "','" + document.getElementById('condicionRecetaBooleano').value + "','" + document.getElementById('reaccionReceta').value + "','" + arduino + "')";	
		}
		else if (condicionActivaTipo == "hora"){
			sentencia = "INSERT INTO recetas(io,nombre,accion_nombre,condicion_nombre,reaccion_nombre,hora_condicion,arduino_nombre) VALUES ('" + io + "','" + document.getElementById('nombreReceta').value + "','" + sensorActivoNombre + "','" + document.getElementById('condicionRecetaHora').value + "','" + document.getElementById('reaccionReceta').value + "','" + valorHora + "','" + arduino + "')";	
		}		
		else {
			alert("ERROR: tipo de sensor no reconocido.");
			insertar="no";
		}		
	}
	if (insertar == "ok") {
		var data = "sentencia=" + sentencia;
		xhr.open("POST", "comandosdb.php", true);   
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
		xhr.send(data);
		location.reload();
	}
	//Refresco la pÃ¡gina para actualizar la informaciÃ³n
	window.location.reload(true);
}

function eliminar_receta(receta){
	var xhr; 

	//Rutina de Ajax para poder actualizar informaciÃ³n vÃ­a PHP sin refrescar la pÃ¡gina
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();  
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");  
	}
	//Pregunta de confirmaciÃ³n para evitar errores de usuario
	var r = confirm("Â¿EstÃ¡ seguro de que desea eliminar la receta seleccionada?");
	//Si todo es correcto se lanza el DELETE en la tabla RECETAS
	if (r == true) {
		var sentencia3 = "DELETE FROM recetas WHERE nombre = '" + receta + "'" ;
		var data3 = "sentencia=" + sentencia3; 
		xhr.open("POST", "comandosdb.php", true);   
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
		xhr.send(data3); 
		window.location.reload(true);
	}
}