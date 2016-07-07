<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Samuel Rabad&aacute;n Ort&iacute;n">


		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
        <!-- Añado para Bootstrap-->
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <script src="js/bootstrap.min.js"></script>

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- CSS de la plantilla-->
    <link href="css/sb-admin-2.css" rel="stylesheet">

    <!-- Fuente de la plantilla -->
    <link href="modulos/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

</head>
<body>
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
					<!-- La función NUEVA_ACCION de javascript es la que creará la nueva acción para el Arduino que hay activo en este momento-->
					<button id="a" onclick="prueba()">Click me</button>
				</div>
			</div>
		</div>




<script>
//Funcion llamada por el modal que contiene el formulario con los valores para crear la nueva accion. Aqui es donde realmente se crea
$("a").click(function prueba(){
	window.alert("hla");
});
	</script>
		
</body>
</html>