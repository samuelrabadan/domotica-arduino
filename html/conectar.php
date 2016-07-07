<?php
$hostname="localhost"; //local server name default localhost
$usuario="root";  //mysql username default is root.
$password="1234";       //blank if no password is set for mysql.
$database="domotica";  //database name which you created
$con=mysql_connect($hostname,$usuario,$password);
if(! $con)
{
die('Error al intentar conectar con la base de datos'.mysql_error());
}
mysql_select_db($database,$con);
mysql_set_charset('utf8');
?>
