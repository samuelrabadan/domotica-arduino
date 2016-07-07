<?php
session_start(); 

//COMPRUEBA QUE EL USUARIO ESTA AUTENTIFICADO 
if ($_SESSION["autenticado"] != "SI") { 
   	//si no existe, envio a la página de autentificacion 
   	header("Location: login.php"); 
   	//ademas salgo de este script 
   	exit(); 
}
?>
<!DOCTYPE html>
<html lang="es" data-ng-app="domotica">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Samuel Rabad&aacute;n Ort&iacute;n">

    <title>Control dom&oacute;tico mediante Arduinos</title>

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/sb-admin-2.css" rel="stylesheet">
    <!-- Fuente de la plantilla -->
    <link href="modulos/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

  <script src="lib/socket.io-client/socket.io.js"></script>
  <script src="lib/angular/angular.js"></script>  
  <script src="lib/angular-socket-io/socket.js"></script>
  
    <script src="/json.js"></script> <!-- for ie -->
    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
	<script src="http://172.26.0.101:3000/socket.io/socket.io.js"></script>


    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="js/sb-admin-2.js"></script>
	
	<script src="js/arduinos-app.js"></script>
	<script src="js/arduinos-controllers.js"></script>
	<script src="js/arduinos-services.js"></script>	
    <script src="js/arduinos-directives.js"></script>
    <script src="js/arduinos-routes.js"></script>

	<script src="js/arduinos-cliente.js"></script>
	<script src="js/index.js"></script>	
</head>

<body>
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
<?php
if ($_SESSION["grupo"] == "administradores") {
echo "						<li>
							<a href=\"configurar.php\"><span class=\"glyphicon glyphicon-tasks\"></span>&nbsp;Recetas</a>
						</li>
						<li>
							<a href=\"nuevo.php\"><span class=\"glyphicon glyphicon-wrench\"></span>&nbsp;Configuraciones</a>
						</li>";
}						
?>
					</ul>
				</div>
			</div>
        </nav>

		<!-- Este es el contenedor principal -->
		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-12">
					<h1 class="page-header">Panel de control</h1>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="panel panel-default">
						<div class="panel-heading">
							Seleccione uno de los siguientes Arduinos para ver sus opciones de control y monitorizaci&oacute;n. 
						</div>
						<div class="panel-body">
							<ul class="nav nav-pills">
<?php
	Include('conectar.php');
	$sql_arduinos= "SELECT * FROM arduinos ORDER BY id";
	$resultado_arduinos=mysql_query($sql_arduinos);

	while($fila_arduinos = mysql_fetch_array($resultado_arduinos)) {
?>
								<li><a href="#<?php echo $fila_arduinos['id']?>" data-toggle="tab" aria-expanded="true" onclick="infoArduinos('<?php echo $fila_arduinos['id']?>')"><?php echo $fila_arduinos['nombre']?></a>
<?php
	}
?>
								</li>
							</ul>						
							<div class="tab-content">
<?php
	$sql_arduinos= "SELECT * FROM arduinos ORDER BY id";
	$resultado_arduinos=mysql_query($sql_arduinos) or exit("Error de SQL".mysql_error());
	while($fila_arduinos = mysql_fetch_array($resultado_arduinos)) {
?>							
								<div class="tab-pane fade" id="<?php echo $fila_arduinos['id']?>">
									<div class="panel-body">
										<div class="col-md-3">
  											<ul class="nav nav-pills nav-stacked">

<?php
$sql_sensores= "SELECT * FROM sensores_tipos st LEFT JOIN sensores s ON s.sensor_codigo='".$fila_recetas['nombre_accion']."'";
$sql_recetas= "SELECT r.nombre nombre_receta, r.accion_nombre nombre_accion FROM recetas r WHERE r.arduino_nombre='".$fila_arduinos['nombre']."'";
		$resultado_recetas=mysql_query($sql_recetas)
			or exit("Error de SQL".mysql_error());
		while($fila_recetas = mysql_fetch_array($resultado_recetas)) {
?>
												<li>  
													<a href="#<?php echo $fila_recetas['nombre_receta']?>" class="btn btn-default" data-toggle="tab" aria-expanded="true" onClick="receta_activa('<?php echo $fila_recetas['nombre_receta']?>')"><?php echo $fila_recetas['nombre_receta']?></a>
                            					</li>

<?php
	}
?>

											</ul>
										</div>
										<div class="tab-content col-md-9">
<?php
//$sql_recetas= "SELECT * FROM recetas WHERE arduino_nombre='".$fila_arduinos['nombre']."'";
$sql_recetas= "SELECT r.nombre nombre_receta,r.condicion_nombre nombre_condicion, r.valor_condicion condicion_valor, r.hora_condicion condicion_hora, s.sensor_codigo tipo_sensor, s.nombre nombre_sensor, a.actuador_codigo tipo_actuador, st.condicion_familia_nombre condicion_familia, st.nombre nombre_tipo_sensor, a.pin pin_actuador FROM recetas r LEFT JOIN sensores s ON r.accion_nombre=s.nombre LEFT JOIN actuadores a ON r.reaccion_nombre=a.nombre LEFT JOIN sensores_tipos st ON s.sensor_codigo=st.codigo WHERE r.arduino_nombre='".$fila_arduinos['nombre']."'";

		$resultado_recetas=mysql_query($sql_recetas)
			or exit("Error de SQL".mysql_error());
		while($fila_recetas = mysql_fetch_array($resultado_recetas)) {
?>
											<div class="tab-pane" id="<?php echo $fila_recetas['nombre_receta']?>">
												<div class="tab-content col-md-7">
													<table class="table table-striped table-hover" id="tabla-sensores">
  														<tr>
														    <th>Tipo de sensor</th>
														    <th>Condici&oacute;n</th> 
    														<th>Estado</th> 
  														</tr>
					  									<tr>
														    <td><?php echo $fila_recetas['nombre_tipo_sensor']?></td>
    														<td><?php
    														if ($fila_recetas['condicion_familia'] == "tamano") {
    															echo $fila_recetas['nombre_condicion']."<i><small><b> que </b></small></i>".$fila_recetas['condicion_valor'];
    														} elseif ($fila_recetas['condicion_familia'] == "booleano") {
    															echo $fila_recetas['nombre_condicion'];
    														} elseif ($fila_recetas['condicion_familia'] == "hora") {
    															echo $fila_recetas['nombre_condicion']."<i><small><b> a </b></small></i>".$fila_recetas['condicion_hora'];
    														}?></td> 
    														<td><?php
    														if ($fila_recetas['tipo_sensor'] == "webboton") {
    															echo "<form><div class=\"btn-group\" data-ng-controller=\"ArduController\">
    															<label class=\"btn btn-info btn-xs \">   			
   																<input type=\"radio\" name=\"botonSensor\" value=\"apagar\"  data-ng-click=\"actuadorOff(".$fila_recetas['pin_actuador'].",'".$fila_recetas['tipo_actuador']."')\" checked>Apagar
    															</label>   			
   																<label class=\"btn btn-info btn-xs\">    		
    															<input type=\"radio\" name=\"botonSensor\" value=\"encender\"  data-ng-click=\"actuadorOn(".$fila_recetas['pin_actuador'].",'".$fila_recetas['tipo_actuador']."')\">Encender
    															</label></div>
    															</form>";
    														} elseif ($fila_recetas['tipo_sensor'] == "webhora") {
    															echo "<div data-ng-controller=\"relojCtrl\">{{theclock}}</div>";
    														} elseif (($fila_recetas['tipo_sensor'] == "senluz") || ($fila_recetas['tipo_sensor'] == "pulsador")) {
    															echo "<div data-ng-controller=\"sensorCtrl\">{{sensorEstado}}</div>";
    														}
    															?>
    														</td> 
  														</tr>
													</table>
												</div>
												<div class="tab-content col-md-5">
													<table class="table table-striped table-hover" id="tabla-reactores">
														<tr>
		    												<th>Tipo de actuador</th>
    														<th>Estado</th> 
  														</tr>
 	 													<tr>
    														<td><?php echo $fila_recetas['tipo_actuador']?></td>
    														<td>
    															<?php //if ($fila_recetas['tipo_sensor'] == "webboton") {echo "<b><i><div data-ng-controller=\"actuadorController\">{{estado}}</div></i></b>"; } else {
    															echo "<b><i><div data-ng-controller=\"actuadorCtrl\">{{actuadorEstado}}</div></i></b>";
    														//}
    														?>
    														</td> 
  														</tr>
													</table>
												</div>
											</div>
<?php
	}
?>
										</div>
									</div>
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
</body>

</html>