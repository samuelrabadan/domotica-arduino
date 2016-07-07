<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Samuel Rabad&aacute;n Ort&iacute;n">

        <!-- Añado para Bootstrap-->
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
	
    <!-- Custom CSS -->
    <link href="css/sb-admin-2.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="modulos/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <link href="bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.css" rel="stylesheet" type="text/css">
    <script src="bower_components/seiyria-bootstrap-slider/dependencies/js/modernizr.js"></script>
    <script src="js/jquery-2.2.4.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/bootstrap-slider.min.js"></script>


</head>

<body>
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Cerrar</span></button>
					<h4 class="modal-title" id="etiqueta4">Crear nueva receta</h4>
				</div>
				<div id="nuevaAccion" class="modal-body">
				    <!-- Formulario que recoge los valores para crear la Acción-->
					<form role="form" method = "POST">
						<div class="form-group">
							<label for="nombreAccion">Nombre de la receta</label>
							<input type="text" class="form-control" id="nombreReceta" placeholder="Escriba aquí el nombre" onchange="sensorAcivo()" required>
						</div>
						<div class="row">
							<div class="form-group col-xs-8">
								<label for="io" class="control-label input-group">Encender/Apagar</label>
								<div class="btn-group"  data-toggle="buttons">
								    <!-- Utilizo la etiqueta VALUE para pasar el valor que quiero guardar en la base de datos a la función JavaScript (crear_accion) -->
									<label class="btn btn-default">
										<input type="radio" name="io" value="i">Encender
									</label>
									<label class="btn btn-default">
										<input type="radio" name="io" value="o">apagar
									</label>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-xs-12">
								<label>Sensor</label>
<?php
	Include('conectar.php');
	$resul = $_GET['resultado'];
//	$sql_acciones= "SELECT * FROM sensores WHERE arduino_nombre = '".$resul."'";
	$sql_acciones= "SELECT s.nombre nombre_sensor, s.sensor_codigo sensor_tipo, st.condicion_familia_nombre condicion_familia FROM sensores s LEFT JOIN sensores_tipos st ON s.sensor_codigo=st.codigo WHERE s.arduino_nombre = '".$resul."' ORDER BY nombre_sensor DESC";	
	$resultado_acciones=mysql_query($sql_acciones)
		or exit("Error de SQL".mysql_error());
?>
                                <select class="form-control" id="accionReceta" onchange="sensorAcivo()" name="accionReceta">
<?php
	while($fila_acciones = mysql_fetch_array($resultado_acciones)) {
?>
									<option value="<?php echo $fila_acciones['condicion_familia'].":".$fila_acciones['nombre_sensor']."@".$fila_acciones['sensor_tipo']?>"><?php echo $fila_acciones['nombre_sensor']?></option>

<?php
	}
?>
                                </select>
                            </div>
						</div>
						<div class="row">
							<div class="form-group col-xs-12" data-ng-controller="accionesArduino">
								<label>Actuador</label>
                                <select class="form-control" id="reaccionReceta">
<?php
	$sql_reacciones= "SELECT * FROM actuadores WHERE arduino_nombre = '".$resul."'";
	$resultado_reacciones=mysql_query($sql_reacciones)
		or exit("Error de SQL".mysql_error());
	while($fila_reacciones = mysql_fetch_array($resultado_reacciones)) {
?>
									<option value="<?php echo $fila_reacciones['nombre']?>"><?php echo $fila_reacciones['nombre']?></option>

<?php
	}
?>
                                </select>
                            </div>
						</div>
						<div class="row">
							<div class="form-group col-xs-6">
								<label class="form-group col-xs-12" >Condici&oacute;n</label>
								
								
								
								
								
								
                                <select class="form-control" id="condicionRecetaTamano">
<?php
	$sql_condiciones= "SELECT * FROM condiciones WHERE condicion_familia_nombre='tamano' ORDER BY nombre";
	$resultado_condiciones=mysql_query($sql_condiciones)
		or exit("Error de SQL".mysql_error());
	while($fila_condiciones = mysql_fetch_array($resultado_condiciones)) {
?>
									<option value="<?php echo $fila_condiciones['nombre']?>"><?php echo $fila_condiciones['nombre']?></option>

<?php
	}
?>
                                </select>
                                
                                
                                <select class="form-control" id="condicionRecetaBooleano" style="display: none">
<?php
	$sql_condiciones= "SELECT * FROM condiciones WHERE condicion_familia_nombre='booleano' ORDER BY nombre";
	$resultado_condiciones=mysql_query($sql_condiciones)
		or exit("Error de SQL".mysql_error());
	while($fila_condiciones = mysql_fetch_array($resultado_condiciones)) {
?>
									<option value="<?php echo $fila_condiciones['nombre']?>"><?php echo $fila_condiciones['nombre']?></option>

<?php
	}
?>
                                </select>
                                
                                <select class="form-control" id="condicionRecetaHora" style="display: none">
<?php
	$sql_condiciones= "SELECT * FROM condiciones WHERE condicion_familia_nombre='hora' ORDER BY nombre";
	$resultado_condiciones=mysql_query($sql_condiciones)
		or exit("Error de SQL".mysql_error());
	while($fila_condiciones = mysql_fetch_array($resultado_condiciones)) {
?>
									<option value="<?php echo $fila_condiciones['nombre']?>"><?php echo $fila_condiciones['nombre']?></option>

<?php
	}
?>
                                </select>









                            </div>
							<div class="form-group col-xs-6" id="valorTamano"  style="display: block">
								<label class="form-group col-xs-12" >Valor</label>
								<input type="number" class="form-control" id="valorRecetaTamano">
                            </div>
							<div class="form-group col-xs-6" id="valorHora"  style="display: none">
								<label class="form-group col-xs-12" >Valor</label>
								<input class="form-control" type="time" id="valorRecetaHora"  step="1">
                            </div>
							<div class="form-group col-xs-6" id="valorSensor"  style="display: none">
								<label class="form-group col-xs-12" >Valor</label>
							    <select class="form-control" id="valorRecetaSensor">
							        <option value="1">1</option>
							        <option value="2">2</option>
							        <option value="3">3</option>
							        <option value="4">4</option>
							        <option value="5">5</option>
							        <option value="6">6</option>
							        <option value="7">7</option>
							        <option value="8">8</option>
							        <option value="9">9</option>
							        <option value="10">10</option>
							        <option value="11">11</option>
							        <option value="12">12</option>
							        <option value="13">13</option>
							        <option value="14">14</option>
							        <option value="15">15</option>
							        <option value="16">16</option>
							        <option value="17">17</option>
							        <option value="18">18</option>
							        <option value="19">19</option>
							        <option value="20">20</option>
							    </select>
                             </div>
						</div>
					</form>      
				</div>
				<div class="modal-footer">
					<p class="disabled" id="arduinoh4"></p>
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
					<!-- La función CREAR_RECETA de javascript es la que creará la nueva acción para el Arduino que hay activo en este momento-->
					<button type="button" class="btn btn-success" value="<?php echo $resul?>" onclick="crear_receta(this.value)">Crear</button>        
				</div>
			</div>
		</div>

    <!-- Importamos el archivo JS con las funciones y variables necesarias para este documento PHP -->
    <script src="js/configurar.js"></script>
	
    <!-- Bootstrap Core JavaScript -->
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>

    <!-- Metis Menu Plugin JavaScript -->
    <script src="bower_components/metisMenu/dist/metisMenu.min.js"></script>

    <!-- DataTables JavaScript -->
    <script src="bower_components/datatables/media/js/jquery.dataTables.min.js"></script>
    <script src="bower_components/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.min.js"></script>

    <!-- Custom Theme JavaScript -->
    <script src="js/sb-admin-2.js"></script>

    <!-- Page-Level Demo Scripts - Tables - Use for reference -->
		
</body>
</html>