<?php
session_start(); 


//COMPRUEBA QUE EL USUARIO ESTA AUTENTIFICADO 
if ($_SESSION["autenticado"] != "SI") {
   	//si no existe, envio a la p醙ina de autentificacion 
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

        <!-- A帽ado para Bootstrap-->
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
    <!-- Modal oculto que solo se muestra para crear una nueva acci贸n para un Arduino -->
	<div class="modal fade" id="popupNuevaReceta" tabindex="-1" role="dialog" aria-labelledby="etiqueta3" aria-hidden="true">
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
                    <h1 class="page-header">Recetas</h1>
                </div>
                <div class="col-lg-12">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Seleccione uno de los siguientes Arduinos para ver las recetas que tiene creadas a partir de sussensores y actuadores previamente configurados en la secci贸n <a href="nuevo.php">Arduinos</a>. 
                        </div>
						<div class="panel-body">
							<ul class="nav nav-pills">
<?php
	Include('conectar.php');
	$sql_arduinos= "SELECT * FROM arduinos ORDER BY id";
	$resultado_arduinos=mysql_query($sql_arduinos)
		or exit("Error de SQL".mysql_error());
	while($fila_arduinos = mysql_fetch_array($resultado_arduinos)) {
?>							<li><a href="#<?php echo $fila_arduinos['id']?>" data-toggle="tab" aria-expanded="true" onclick="infoArduinos('<?php echo $fila_arduinos['id']?>')"><?php echo $fila_arduinos['nombre']?></a>
                            </li>

<?php
	}
?>
							</ul>						
							<div class="tab-content">
<?php
	$sql_arduinos= "SELECT * FROM arduinos ORDER BY id";
	$resultado_arduinos=mysql_query($sql_arduinos)
		or exit("Error de SQL".mysql_error());
	$num_rows=mysql_num_rows($resultado_arduinos);
	while($fila_arduinos = mysql_fetch_array($resultado_arduinos)) {
?>							
                                <div class="tab-pane fade" id="<?php echo $fila_arduinos['id']?>">
									<div class="panel-body">
										<div class="dataTable_wrapper">
											<table class="table table-striped table-hover" id="dataTables-example">
												<thead>
													<tr>
														<th>Nombre</th>
														<th>Encender/Apagar</th>
														<th>Sensor</th>
														<th>Actuador</th>
														<th>Condici&oacute;n</th>
														<th>Valor</th>
														<th>
															<div>
																<button type="button" class="btn btn-info btn-sm pull-right" id="mostrar_crear_receta" onclick="mostrar_crear_receta('<?php echo $fila_arduinos['nombre']?>')">Nueva receta</button>	
															</div>
														</th>

													</tr>
												</thead>
												<tbody>
<?php
	$sql_recetas= "SELECT * FROM recetas WHERE arduino_nombre='".$fila_arduinos['nombre']."'";

	$resultado_recetas=mysql_query($sql_recetas)
		or exit("Error de SQL".mysql_error());
	$num_rows=mysql_num_rows($resultado_recetas);
	while($fila_recetas = mysql_fetch_array($resultado_recetas)) {
?>
													<tr class="odd gradeX">
														<td><?php echo $fila_recetas['nombre']?></td>
														<td><?php
														if ($fila_recetas['io'] == "i") {
															echo "Encender";
														} elseif ($fila_recetas['io'] == "o") {
															echo "Apagar";
														}?></td>
														<td><?php echo $fila_recetas['accion_nombre']?></td>
														<td><?php echo $fila_recetas['reaccion_nombre']?></td>
														<td><?php echo $fila_recetas['condicion_nombre']?></td>
														<td><?php 
														if (is_null ($fila_recetas['valor_condicion']))  {
															if (is_null ($fila_recetas['hora_condicion'])) {
																echo "<i><small><b></b></small></i>";
															} else {
																echo "<i><small><b>HORA:</b></small></i> ".$fila_recetas['hora_condicion'];
															}
														} else {
															echo "<i><small><b>".$fila_recetas['valor_condicion']."</b></small></i>";
														}?></td>
														<td>
															<div class="row">
																<div class="panel-heading">
																	<div>
																		<!--A帽ado un bot贸n al lado de cadfa acci贸n pafra poder eliminarla -->
																		<button type="button" class="btn btn-danger btn-circle pull-right" data-toggle="modal" value="<?php echo $fila_recetas['nombre']?>" onClick="eliminar_receta(this.value)"><span class="glyphicon glyphicon-remove"></span></button>	
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
