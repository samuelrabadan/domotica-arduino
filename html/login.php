<!DOCTYPE html>
<html lang="esp">

<head>

    <meta charset="ISO-8859-1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Dom&oacute;tica</title>

    <!-- Bootstrap Core CSS -->
    <link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- MetisMenu CSS -->
    <link href="bower_components/metisMenu/dist/metisMenu.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/sb-admin-2.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>
    <div class="container">
        <div class="row">
			<h2 align="center">Acceso al panel de control del sistema dom&oacute;tico</h2>
		</div>
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="login-panel panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Inicia sesi&oacute;n para acceder al panel de control</h3>
                    </div>
                    <div class="panel-body">
                        <form role="form">
                            <fieldset>
                                <div class="form-group">
				        <input class="form-control input-lg" placeholder="Usuario" name="user_id" type="text" id="user_id" autofocus>
                                </div>
                                <div class="form-group">
					<input class="form-control input-lg" placeholder="Contrase&ntilde;a" name="password" type="password" id="password">
                                </div>
                                <div class="checkbox">
                                    <label>
                                        <input name="remember" type="checkbox" value="Remember">Recu&eacute;rdame
                                    </label>
                                </div>
				<input type="submit" name="Submit" value="Acceder" class="btn btn-lg btn-success btn-block">
<!--                                <!-- Change this to a button or input when using this as a form -->
<!--                                <a href="index.php" name="Submit" class="btn btn-lg btn-success btn-block">Login</a> -->
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php
Include('conectar.php');
session_start(); 
session_destroy(); 
if (isset($_REQUEST['Submit']))
{
	if($_REQUEST['user_id']=="" || $_REQUEST['password']=="")
	{
	echo " Campo obligatorio";
	}
	else
	{
	   $sql1= "select * from usuarios where nombre= '".$_REQUEST['user_id']."' &&  password ='".$_REQUEST['password']."'";
	  $result=mysql_query($sql1)
	    or exit("Sql Error".mysql_error());
	    $num_rows=mysql_num_rows($result);
	   if($num_rows>0)
	   {

	   	$datos_usuario = mysql_fetch_array($result);	   	 
	   	
	   	session_start(); 
			$_SESSION['session_username']=$user_id;
			$_SESSION["grupo"]= $datos_usuario['grupo'];
			$_SESSION["autenticado"] = "SI"; 
   
			header("location:index.php"); 
        }
	    else
		{
			echo "El nombre de usuario y/o la contraseña son incorrectos";
		}
	}
}	
?>

    <!-- jQuery -->
    <script src="bower_components/jquery/dist/jquery.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>

    <!-- Metis Menu Plugin JavaScript -->
    <script src="bower_components/metisMenu/dist/metisMenu.min.js"></script>

    <!-- Custom Theme JavaScript -->
    <script src="js/sb-admin-2.js"></script>

</body>

</html>
