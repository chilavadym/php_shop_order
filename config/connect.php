<?php
    session_start();
    $DB_HOST = "localhost";
    $DB_USER = "root";
    $DB_PASS = "password";
    $DB_NAME = "shop_order";

    define('SITEURL', 'http://localhost:8080/shop-order/');
    $connect = mysqli_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, 3306)
        or die("Lỗi kết nối mySQL : " . mysqli_error($connect));

?>