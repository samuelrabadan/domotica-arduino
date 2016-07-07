<?php
Include('conectar.php');
//	if($nombreArduino=="" || $ipArduino=="" || $mascaraArduino=="" || $puertaArduino=="" || $puertoArduino=="")	{
//		echo "Hay que rellenar todos los campos";
//		header("location:index.php"); 
//	}
//	else {
		$sql_query = $_POST['sentencia'];

		$mensaje = str_replace('%20', ' ', $sql_query);
		
		
		$resultado_query=mysql_query($mensaje)
			or exit("Error de SQL".mysql_error());
		
		header("Refresh:0");
		
		
		
/*		$num_rows=mysql_num_rows($resultado_query);
		if($num_rows>0) {
			echo "Nuevo Arduino creado correctamente";
			header("location:nuevo.php"); 
			}

		else {
			echo "Error al crear el nuevo Arduino";
		}*/
//	}
	
?>