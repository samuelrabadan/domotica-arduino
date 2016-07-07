<?php
session_start(); 


//COMPRUEBA QUE EL USUARIO ESTA AUTENTIFICADO 
if ($_SESSION["autenticado"] != "SI") {
   	//si no existe, envio a la página de autentificacion 
   	header("Location: login.php"); 
   	//ademas salgo de este script 
   	exit(); 
} else if ($_SESSION["grupo"] != "administradores") {
	header("Location: index.php");
}
?>

<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Samuel Rabad&aacute;n Ort&iacute;n">

    <title>Control dom&oacute;tico mediante Arduinos</title>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Añado para Bootstrap-->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/bootstrap-theme.min.css">
	<!-- CSS de la plantilla-->
    <link href="css/sb-admin-2.css" rel="stylesheet">

	<!-- Fuente de la plantilla -->
    <link href="modulos/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <script src="js/bootstrap.min.js"></script>

	<!-- Importamos el archivo JS con las funciones y variables necesarias para este documento PHP -->
	<script src="js/nuevo.js"></script>

    <!-- jQuery -->
    <script src="bower_components/jquery/dist/jquery.min.js"></script>

    <!-- Metis Menu Plugin JavaScript -->
   	<script src="bower_components/metisMenu/dist/metisMenu.min.js"></script>

    <!-- DataTables JavaScript -->
    <script src="bower_components/datatables/media/js/jquery.dataTables.min.js"></script>
    <script src="bower_components/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.min.js"></script>

	<!-- Custom Theme JavaScript -->
	<script src="dist/js/sb-admin-2.js"></script>
	
</head>

<body>
	    <!-- Modal oculto que solo se muestra para crear un nuevo Arduino -->
	<div class="modal fade" id="popupNuevoArduino" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Cerrar</span></button>
					<h4 class="modal-title" id="myModalLabel">A&ntilde;adir nuevo Arduino como controlador dom&oacute;tico</h4>
				</div>
				<div id="nuevoArduino" class="modal-body">
				    <!-- Formulario para rellenar los datos del Arduino-->
					<form role="form" method = "POST">
						<div class="form-group">
							<label for="nombreArduino">Nombre del Arduino</label>
							<input type="text" class="form-control" id="nombreArduino" placeholder="Escriba aquí el nombre" required>
						</div>
						<div class="row">
							<div class="form-group col-xs-6">  
								<label for="ipArduino">Direcci&oacute;n IP</label>
								<input type="text" class="form-control" id="ipArduino" placeholder="xxx.xxx.xxx.xxx" required>                      
							</div>
							<div class="form-group col-xs-2">
								<label for="puertoArduino">Puerto</label>
								<input type="number" class="form-control" id="puertoArduino" required>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-xs-6">
								<label for="mascaraArduino">M&aacute;scara de red</label>
								<input type="text" class="form-control" id="mascaraArduino"  placeholder="xxx.xxx.xxx.xxx" required>
							</div>             
							<div class="form-group col-xs-6">
								<label for="puertaArduino">Puerta de enlace</label>
								<input type="text" class="form-control" id="puertaArduino"  placeholder="xxx.xxx.xxx.xxx" required>
							</div>             
						</div>
					</form>      
				</div>
				    <!-- Botones del modal-->
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
				    <!-- Llamamos a la función CREAR_ARDUINO de javascript para crear un nuevo Arduino, no pasamos parámetros porque la función los recoge directamente del formulario-->					
					<button type="button" class="btn btn-success" id="botonCrearArduino" onClick="crear_arduino()">Crear</button>        
				</div>
			</div>
		</div>
	</div>

    <!-- Modal oculto que solo se muestra para crear una nueva acción para un Arduino -->
	<div class="modal fade" id="popupNuevaAccion" tabindex="-1" role="dialog" aria-labelledby="etiqueta3" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Cerrar</span></button>
					<h4 class="modal-title" id="etiqueta4">A&ntilde;adir un nuevo sensor</h4>
				</div>
				<div id="nuevaAccion" class="modal-body">
				    <!-- Formulario que recoge los valores para crear la Acción-->
					<form role="form" method = "POST" id="formulario">
						<div class="form-group">
							<label for="nombreAccion">Nombre del sensor</label>
							<input type="text" class="form-control" id="nombreAccion" placeholder="Escriba aquí el nombre" required>
						</div>
						<div class="row">
							<div class="form-group">  
								<div class="form-group col-xs-8">
									<label>Tipo de sensor</label>
<?php
//nos conectamos a la base de datos para poder obtener información
	Include('conectar.php');
	$resul = $_GET['resultado'];

	$sql_sensores = "SELECT * FROM sensores_tipos";
	$resultado_sensores=mysql_query($sql_sensores)
		or exit("Error de SQL".mysql_error());
?>				
									<select class="form-control" id="actuadorAccion" onchange="deshabilitarPin()" name="actuadorAccion">
<?php
	while($fila_sensores = mysql_fetch_array($resultado_sensores)) {
?>
										<option value="<?php echo $fila_sensores['codigo']?>"><?php echo $fila_sensores['nombre']?></option>

<?php
	}
?>
									</select>
								</div>
							<div class="form-group col-xs-4">  
								<label for="pinAccion">PIN</label>
								<input type="number" class="form-control" id="pinAccion" required>
							</div>
							</div>
						</div>
					</form>      
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
					<!-- La función NUEVA_ACCION de javascript es la que creará la nueva acción para el Arduino que hay activo en este momento-->
					<button type="button" class="btn btn-success" id="botonCrearAccion" onClick="crear_accion()">Crear</button>        
				</div>
			</div>
		</div>
	</div>

    <!-- Modal oculto que solo se muestra para crear una nueva acción para un Arduino -->
	<div class="modal fade" id="popupNuevaReaccion" tabindex="-1" role="dialog" aria-labelledby="etiqueta4" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Cerrar</span></button>
					<h4 class="modal-title" id="etiqueta4">A&ntilde;adir un nuevo actuador</h4>
				</div>
				<div id="nuevaReaccion" class="modal-body">
				    <!-- Formulario que recoge los valores para crear la Acción-->
					<form role="form" method = "POST">
						<div class="form-group">
							<label for="nombreAccion">Nombre del actuador</label>
							<input type="text" class="form-control" id="nombreReaccion" placeholder="Escriba aquí el nombre" required>
						</div>

						<div class="row">
							<div class="form-group">  
								<div class="form-group col-xs-8">
									<label>Tipo de actuador</label>
									<select class="form-control" id="sensorReaccion">
<?php
	$sql_actuadores = "SELECT * FROM actuadores_tipos";
	$resultado_actuadores = mysql_query($sql_actuadores)
		or exit("Error de SQL".mysql_error());
	while($fila_actuadores = mysql_fetch_array($resultado_actuadores)) {
?>
										<option value="<?php echo $fila_actuadores['nombre']?>"><?php echo $fila_actuadores['nombre']?></option>

<?php
	}
?>
									</select>
								</div>
							<div class="form-group col-xs-4">  
								<label for="pinAccion">PIN</label>
								<input type="number" class="form-control" id="pinReaccion" required>
							</div>
							</div>
						</div>
					</form>      
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
					<!-- La función CREAR_ACCION de javascript es la que creará la nueva acción para el Arduino que hay activo en este momento-->
					<button type="button" class="btn btn-success" id="botonCrearAccion" onClick="crear_reaccion()">Crear</button>        
				</div>
			</div>
		</div>
	</div>


    <!-- Modal oculto que se muestra solo para eliminar los Arduinos-->
	<div class="modal fade" id="popupEliminarArduino" tabindex="-1" role="dialog" aria-labelledby="etiqueta2" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Cerrar</span></button>
					<h4 class="modal-title" id="myModalLabel">Seleccione el Arduino que quiere eliminar</h4>
				</div>
				<div id="eliminaArduino" class="modal-body">
					<form role="form" method = "POST" id="formulario_eliminar" name="formulario_eliminar">
								<div class="table-responsive">
									<!-- Se crea una tabla que contiene todos los Arduinos que se han creado con todos sus campos -->
									<table class="table table-hover form-group">
										<thead>
											<tr>
												<th></th>
												<th>Nombre del Arduino</th>
												<th>Direcci&oacute;n IP</th>
												<th>M&aacute;scara de subred</th>
												<th>Puerta de enlace</th>
												<th>Puerto</th>
											</tr>
										</thead>
										<tbody>
<!-- En el cuerpo de la tabla añadimos todos los valores que tenemos almacenados en la tabla ARDUINOS 
de nuestra base de datos por medio de PHP y los precedemos de un botón para eliminar cada valor -->
<?php
//nos conectamos a la base de datos para poder obtener información
	Include('conectar.php');
	
// Obtenemos todos los ardinos guardados
	$sql_arduinos_eliminar= "SELECT * FROM arduinos";
	$resultado_arduinos_eliminar=mysql_query($sql_arduinos_eliminar)
		or exit("Error de SQL".mysql_error());
//Recorremos todos los valores obtenidos para ir poniéndolos en la tabla
	while($fila_arduinos_eliminar = mysql_fetch_array($resultado_arduinos_eliminar)) {
?>
											<tr>
												<!-- botón para eliminar esta fila -->
												<td><button type="button" class="btn btn-outline btn-danger" value="<?php echo $fila_arduinos_eliminar['nombre']?>" onClick="eliminar_arduino(this.value)"><span class="glyphicon glyphicon-remove"></span></button></td>
												<!-- Datos de la base de datos -->
												<td><?php echo $fila_arduinos_eliminar['nombre']?></td>
												<td><?php echo $fila_arduinos_eliminar['ip']?></td>
												<td><?php echo $fila_arduinos_eliminar['mascara']?></td>
												<td><?php echo $fila_arduinos_eliminar['puerta']?></td>
												<td><?php echo $fila_arduinos_eliminar['puerto']?></td>
											</tr>

<?php
	}
?>											
										</tbody>
									</table>
								</div>
					</form>      
				</div>
				<div class="modal-footer">
					<!-- Solo ponemos la opción de CANCELAR porque la acción se ejecuta en cada línea -->
					<button type="button" class="btn btn-info" data-dismiss="modal">Cancelar</button>
				</div>
			</div>
		</div>
	</div>
	
    <div id="wrapper">
        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
			<!-- Panel de navegacion superior -->
            <div class="navbar-header">
				<a class="navbar-brand" href="index.php">Panel de control del sistema dom&oacute;tico</a>
            </div>
			<nav class="navbar-nav navbar-top-links navbar-right"> 
				<br>
				<a class="nav-item nav-link" href="login.php"><span class="glyphicon glyphicon-log-out"></span> Cerrar sesi&oacute;n</a>&nbsp;
			</nav>
			<!-- Panel de navegacion izquierdo -->
			<div class="navbar-default sidebar" role="navigation">
				<div class="sidebar-nav navbar-collapse">
					<ul class="nav" id="side-menu">
						<li>
							<a href="index.php"><span class="glyphicon glyphicon-dashboard"></span>&nbsp;Panel de control</a>
						</li>
						<li>
							<a href="configurar.php"><span class="glyphicon glyphicon-tasks"></span>&nbsp;Recetas</a>
						</li>
						<li>
							<a href="nuevo.php"><span class="glyphicon glyphicon-wrench"></span>&nbsp;Configuraciones</a>
						</li>
					</ul>
				</div>
			</div>
        </nav>

        <!-- Este es el contenedor principal -->
		<div id="page-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">Configuraciones</h1>
                </div>
            </div>

            <div class="col-lg-12">
				<div class="pull-right">
					<!-- botón que muestra el modal para crear un nuevo Arduino-->
					<button type="button"  class="btn btn-info btn-sm" data-toggle="modal" data-target="#popupNuevoArduino">A&ntilde;adir nuevo Arduino</button>&nbsp;
					<!-- botón que muestra el modal para eliminar uno o más Arduinos-->
					<button type="button" class="btn btn-danger btn-xs" data-toggle="modal" data-target="#popupEliminarArduino">Eliminar Arduino</button>
				</div>
			</div>
            <div class="col-lg-12">
				&nbsp;
			</div>
			
            <div class="row">
                <div class="col-lg-12">
                    <div class="panel panel-default">			
                        <div class="panel-heading">
                            Recuerde que un sensor origina informaci&oacute;n en el Arduino que es le&iacute;da por el sistema (entrada de datos), mientras que un actuador se produce en nuestro sistema y es escrito en el Arduino (salida de datos).Seleccione uno de los siguientes Arduinos para ver sus sensores y actuadores. 
                        </div>
						<div class="panel-body">
							<ul class="nav nav-pills">
							<!-- Muestro todos los Arduinos configurados en una fila para poder seleccionarlos-->
<?php
	//Selecciono el ID y el NOMBRE de todos los Arduinos para crear el menú dSuperior horizontal para seleccionar un Arduino
	$sql_arduinos= "SELECT id,nombre FROM arduinos ORDER BY id";
	$resultado_arduinos=mysql_query($sql_arduinos)
		or exit("Error de SQL".mysql_error());
	$i=0;
	//Creo un bucle para pasar por todos los valores de la tabla y crear un botón con el nombre del Arduino
	while($fila_arduinos = mysql_fetch_array($resultado_arduinos)) {
	$array_arduinos[$i++]=$fila_arduinos['nombre'];
?>							<li><a href="#<?php echo $fila_arduinos['id']?>" data-toggle="tab" aria-expanded="true" onClick="arduino_activo('<?php echo $fila_arduinos['nombre']?>')"><?php echo $fila_arduinos['nombre']?></a>
                            </li>

<?php
	}
?>
							</ul>
							<div class="tab-content">
<?php
	//Vuelvo a seleccionar el ID y el NOMBRE de todos los Arduinos para recorrerlo desde el principio
	$sql_arduinos= "SELECT id,nombre FROM arduinos ORDER BY nombre";
	$resultado_arduinos=mysql_query($sql_arduinos)
		or exit("Error de SQL".mysql_error());
	//Recorro todos los Arduinos para ir mostrando las acciones configuradas en cada uno
	while($fila_arduinos = mysql_fetch_array($resultado_arduinos)) {
?>							
                                <!--Aquí creo un panel oculto con el id del Arduino y que contendrá las acciones de ese Arduino -->
								<div class="tab-pane fade" id="<?php echo $fila_arduinos['id']?>">
									<div class="panel-body">
										<div class="dataTable_wrapper">
											<table class="table table-striped table-hover" id="dataTables-example">
												<thead>
													<tr>
														<th><h4>Sensores configurados</h4></th>
													</tr>
													<tr>
						                                <!--Valores de la acción -->
														<th>Nombre</th>
														<th>Tipo de sensor</th>
														<th>PIN</th>
														<!--Botón para mostrsr el modal que crea una nueva acción -->
														<th>
															<div>
																<button type="button" class="btn btn-info btn-sm pull-right" data-toggle="modal" data-target="#popupNuevaAccion">Nuevo sensor</button>	
															</div>
														</th>
													</tr>
												</thead>
												<tbody>

<!--Comenzamos a rellenar el cuerpo de la tabla -->												
<?php
	//Selecciono las acciones del Arduino activo en el loop del WHILE anterior
	$sql_acciones= "SELECT s.nombre, s.pin, st.nombre AS sensor_tipo FROM sensores s LEFT JOIN sensores_tipos st ON s.sensor_codigo=st.codigo WHERE arduino_nombre='".$fila_arduinos['nombre']."' ORDER BY nombre";
	
	//$sql_reacciones= "SELECT a.nombre, a.pin, at.nombre AS tipo_actuador FROM actuadores a LEFT JOIN actuadores_tipos at ON a.actuador_codigo=at.codigo WHERE arduino_nombre='".$fila_arduinos['nombre']."' ORDER BY nombre";
	
	$resultado_acciones=mysql_query($sql_acciones)
		or exit("Error de SQL".mysql_error());
	$x=0;
	$z=0;
	//Recorro todos los valores obtenidos para rellenar la tabla con todas las opciones configuradas en cada Arduino
	while($fila_acciones = mysql_fetch_array($resultado_acciones)) {
		$array_acciones[$x++]=$fila_acciones['nombre'];
		$array_pines[$z++]=$fila_acciones['pin'];
?>
													<tr class="odd gradeX">
														<td><?php echo $fila_acciones['nombre']?></td>
														<td><?php echo $fila_acciones['sensor_tipo']?></td>
														<td><?php echo $fila_acciones['pin']?></td>
														<td>
															<div class="row">
																<div class="panel-heading">
																	<div>
																		<!--Añado un botón al lado de cadfa acción pafra poder eliminarla -->
																		<button type="button" class="btn btn-danger btn-circle pull-right" data-toggle="modal" value="<?php echo $fila_acciones['nombre']?>" onClick="eliminar_accion(this.value)"><span class="glyphicon glyphicon-remove"></span></button>
																	</div>
																</div>
																<div class="panel-body">
																</div>
															</div>
														</td>
													</tr>
<?php
	}
?>													
												</tbody>
											</table>
										</div>
									</div>

<!--AQUI EMPIEZA	-->								
									<div class="panel-body">
										<div class="dataTable_wrapper">
											<table class="table table-striped table-hover" id="dataTable2">
												<thead>
													<tr>
														<th><h4>Actuadores configurados</h4></th>
													</tr>
													<tr>
						                                <!--Valores de la reacción -->
														<th>Nombre</th>
														<th>Tipo de actuador</th>
														<th>PIN</th>
														<!--Botón para mostrar el modal que crea una nueva acción -->
														<th>
															<div>
																<button type="button" class="btn btn-info btn-sm pull-right" data-toggle="modal" data-target="#popupNuevaReaccion">Nuevo actuador</button>	
															</div>
														</th>
													</tr>
												</thead>
												<tbody>

<!--Comenzamos a rellenar el cuerpo de la tabla -->												
<?php
	//Selecciono las acciones del Arduino activo en el loop del WHILE anterior
	$sql_reacciones= "SELECT a.nombre, a.pin, at.nombre AS tipo_actuador FROM actuadores a LEFT JOIN actuadores_tipos at ON a.actuador_codigo=at.codigo WHERE arduino_nombre='".$fila_arduinos['nombre']."' ORDER BY nombre";
	$resultado_reacciones=mysql_query($sql_reacciones)
		or exit("Error de SQL".mysql_error());
	$x=0;
	//Recorro todos los valores obtenidos para rellenar la tabla con todas las opciones configuradas en cada Arduino
	while($fila_reacciones = mysql_fetch_array($resultado_reacciones)) {
		$array_reacciones[$x++]=$fila_reacciones['nombre'];
		$array_pines[$z++]=$fila_reacciones['pin'];
?>
													<tr class="odd gradeX">
														<td><?php echo $fila_reacciones['nombre']?></td>
														<td><?php echo $fila_reacciones['tipo_actuador']?></td>
														<td><?php echo $fila_reacciones['pin']?></td>
														<td>
															<div class="row">
																<div class="panel-heading">
																	<div>
																		<!--Añado un botón al lado de cadfa acción pafra poder eliminarla -->
																		<button type="button" class="btn btn-danger btn-circle pull-right" data-toggle="modal" value="<?php echo $fila_reacciones['nombre']?>" onClick="eliminar_reaccion(this.value)"><span class="glyphicon glyphicon-remove"></span></button>	
																	</div>
																</div>
																<div class="panel-body">
																</div>
															</div>
														</td>
													</tr>
<?php
	}
?>													
												</tbody>
											</table>
										</div>
									</div>
									
									
<!--AQUI TERMINA -->									
									
								</div>
<?php
	}
?>						
							</div>
						</div>
						</div>
                    </div>	
				</div>
            </div>
        </div>

 <script>
//Estas funcionas JS llevan incrustado algo de c󤩧o PHP y no pueden ir separadas en un archivo JS independiente
 
//Función llamada por el modal que contiene el formulario con los valofres para crear el Arduino. Aquí es donde realmente se crea
 function crear_arduino(){
 	var xhr;  
 	var nombres_arduinos = <?php echo json_encode($array_arduinos); ?>; //Contiene todos los nombres de los Arduinos parsa que no se repitan
 	var indice;
 	var duplicado = "false";
 	//Rutina de Ajax para poder actualizar información vía PHP sin refrescar la página
 	if (window.XMLHttpRequest) {
 		xhr = new XMLHttpRequest();  
 	} else if (window.ActiveXObject) {
 		xhr = new ActiveXObject("Microsoft.XMLHTTP");  
 	}
 	//Compruebo que no se va a repetir el nombre del Arduino
 	for	(indice = 0; indice < nombres_arduinos.length; indice++) {
 		if (document.getElementById('nombreArduino').value == nombres_arduinos[indice]) {
 			window.alert("Error: Ya existe un Arduino con ese nombre.");
 			duplicado="true";
 			break;
 		}
 	}
 	//Compruebo que se han frellenado todos los campos para crear el Arduino
 	if (duplicado=="false") {
 		if ((document.getElementById('nombreArduino').value=="") || (document.getElementById('ipArduino').value=="") || (document.getElementById('mascaraArduino').value=="") || (document.getElementById('puertaArduino').value=="") || (document.getElementById('puertoArduino').value==""))  {
 			window.alert("Faltan datos");
 		}  
 		//Si todo está correcto lanzo el INSERT en la tabla ARDUINOS y llamamos a la página COMANDOSDB.PHP vía Ajax
 		else {
 			var sentencia = "INSERT INTO arduinos(nombre,ip,mascara,puerta,puerto) VALUES ('" + document.getElementById('nombreArduino').value + "','" + document.getElementById('ipArduino').value + "','" + document.getElementById('mascaraArduino').value + "','" + document.getElementById('puertaArduino').value + "'," + document.getElementById('puertoArduino').value + ")";
 			var data = "sentencia=" + sentencia; 
 			xhr.open("POST", "comandosdb.php", true);   
 			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
 			xhr.send(data); 
 			//Refresco la página para actualizar la información
 			window.location.reload(true);
 		}
 	}
 }

 //Función llamada por el modal que contiene el formulario con los valores para crear la nueva acción. Aquí es donde realmente se crea
 function crear_accion(){
 	var xhr;  
 	var nombres_acciones = <?php echo json_encode($array_acciones); ?>;
 	var pines_usados = <?php echo json_encode($array_pines); ?>;
 	var indice;
 	var duplicado = "false";
 	
 	//Rutina de Ajax para poder actualizar información vía PHP sin refrescar la página
 	if (window.XMLHttpRequest) {
 		xhr = new XMLHttpRequest();  
 	} else if (window.ActiveXObject) {
 		xhr = new ActiveXObject("Microsoft.XMLHTTP");  
 	}
 	for	(indice = 0; indice < nombres_acciones.length; indice++) {
 		for	(indice2 = 0; indice2 < pines_usados.length; indice2++) {
 			if (document.getElementById('nombreAccion').value == nombres_acciones[indice]) {
 				window.alert("Error: Ya existe una acci&oacute;n con ese nombre.");
 				duplicado="true";
 				break;
 			} else if (document.getElementById('pinAccion').value == pines_usados[indice]){
 				window.alert("Error: el PIN seleccionado ya está siendo utilizado en otra configuración.");
 				duplicado="true";
 				break;				
 			}
 		}
 	}
 	
 	//Compruebo que se han rellenado todos los campos
 	if (duplicado=="false") {
		opcion = document.forms[1].actuadorAccion.value;

 		if (((opcion=="webboton") || (opcion=="webcalen")) && (document.getElementById('nombreAccion').value==""))  {
 				window.alert("Debe proporcionar un nombre");
 			}
 		else if ((opcion!="webboton") && (opcion!="webcalen") && ((document.getElementById('nombreAccion').value=="") || (document.getElementById('pinAccion').value==""))) {  
 			window.alert("Faltan datos");
 		}  
 		//Si todo es correcto se lanza el INSERT sobre la tabla ACCIONES con los valores del modal
 		else if ((opcion=="webboton") || (opcion=="webcalen")) {
			var sentencia = "INSERT INTO sensores(nombre,arduino_nombre,sensor_codigo) VALUES ('" + document.getElementById('nombreAccion').value + "','" + arduino + "','" + document.getElementById('actuadorAccion').value + "')";
			var data = "sentencia=" + sentencia; 
 			xhr.open("POST", "comandosdb.php", true);   
 			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
 			xhr.send(data); 
 			window.location.reload(true);
 		}
 		else {
 			var sentencia = "INSERT INTO sensores(nombre,arduino_nombre,sensor_codigo,pin) VALUES ('" + document.getElementById('nombreAccion').value + "','" + arduino + "','" + document.getElementById('actuadorAccion').value + "'," +  document.getElementById('pinAccion').value + ")";
			var data = "sentencia=" + sentencia; 
 			xhr.open("POST", "comandosdb.php", true);   
 			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
 			xhr.send(data); 
 			window.location.reload(true);
 		}
 	}
	window.location.reload(true);
 }

 function crear_reaccion(){
 	var xhr;  
 	var nombres_reacciones = <?php echo json_encode($array_reacciones); ?>;
 	var pines_usados = <?php echo json_encode($array_pines); ?>;
 	var indice;
 	var duplicado = "false";
 	
 	//Rutina de Ajax para poder actualizar información vía PHP sin refrescar la página
 	if (window.XMLHttpRequest) {
 		xhr = new XMLHttpRequest();  
 	} else if (window.ActiveXObject) {
 		xhr = new ActiveXObject("Microsoft.XMLHTTP");  
 	}
 	for	(indice = 0; indice < nombres_reacciones.length; indice++) {
 		for	(indice2 = 0; indice2 < pines_usados.length; indice2++) {
 			if (document.getElementById('nombreReaccion').value == nombres_reacciones[indice]) {
 				window.alert("Error: Ya existe una reacción con ese nombre.");
 				duplicado="true";
 				break;
 			} else if (document.getElementById('pinReaccion').value == pines_usados[indice2]){
 				window.alert("Error: el PIN seleccionado ya está siendo usado en otra configuración.");
 				duplicado="true";
 				break;				
 			}
 		}
 	}
 	//Compruebo que se han rellenado todos los campos
 	if (duplicado=="false") { 	 	
 		if ((document.getElementById('nombreReaccion').value=="") || (document.getElementById('pinReaccion').value==""))  {
 			window.alert("Faltan datos");
 		}  
 		//Si todo es correcto se lanza el INSERT sobre la tabla ACCIONES con los valores del modal
 		else {
 			var sentencia = "INSERT INTO actuadores(nombre,arduino_nombre,actuador_codigo,pin) VALUES ('" + document.getElementById('nombreReaccion').value + "','" + arduino + "','" + document.getElementById('sensorReaccion').value + "'," +  document.getElementById('pinReaccion').value + ")";
 			var data = "sentencia=" + sentencia; 
 			xhr.open("POST", "comandosdb.php", true);   
 			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
 			xhr.send(data); 
 			window.location.reload(true);
 		}
 	}
 }
</script>
 
	
</body>
</html>
