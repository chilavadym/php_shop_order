<?php
include "./config/connect.php";
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="shortcut icon" href="/assets/images/favicon.ico">

    <link rel="stylesheet" href="/assets/css/vendor/vendor.min.css">
    <link rel="stylesheet" href="/assets/css/plugins/plugins.min.css">
    <link rel="stylesheet" href="/assets/css/style.min.css">
    <link rel="stylesheet" href="/assets/css/custom.css">

    <title>Shop Order</title>
</head>

<body>
    <div class="header-bottom">
        <div class="header-sticky">
            <div class="container">
                <div class="row align-items-center position-relative">
                    <!-- Header Logo Start -->
                    <div class="col-lg-3 col-md-4 col-6">
                        <div class="header-logo">
                            <a href="/index.php"><img src="/assets/images/logo/logo.png" alt="Site Logo" /></a>
                        </div>
                    </div>
                    <!-- Header Logo End -->

                    <!-- Header Menu Start -->
                    <div class="col-lg-5 d-none d-lg-block">
                        <div class="main-menu">
                            <ul>
                                <li>
                                    <a href="/index.php">Trang Chủ</a>
                                </li>
                                <li><a href="/about.php">Giới Thiệu</a></li>
                                <li>
                                    <a href="/shop.php">Shop</a>
                                </li>
                                <li><a href="/contact.php">Liên Hệ</a></li>
                            </ul>
                        </div>
                    </div>
                    <!-- Header Menu End -->

                    <!-- Header Action Start -->
                    <div class="col-lg-4 col-md-8 col-6">
                        <div class="header-actions">
                            <?php include "search.php" ?>
                            <!-- account login -->
                            <?php
                            if (isset($_SESSION['user'])) {
                                echo "<a href='/account.php' class='header-action-btn header-action-btn-wishlist'>
                                    <i class='icon-user icons'></i> " . $_SESSION['user'] . "</a>";
                            } else {
                                echo "<a href='/login.php' class='header-action-btn header-action-btn-wishlist'><i class='icon-user icons'></i> Login</a>";
                            }
                            ?>
                            <?php include "cart.php" ?>
                            <!-- Scroll Top Start -->
                            <a href="#" class="scroll-top show rounded" id="scroll-top">
                                <i class="arrow-top ti-angle-double-up"></i>
                                <i class="arrow-bottom ti-angle-double-up"></i>
                            </a>
                            <!-- Scroll Top End -->
                            <!-- Mobile Menu Hambarger Action Button Start -->
                            <a href="javascript:void(0)" class="header-action-btn header-action-btn-menu d-lg-none d-md-flex">
                                <i class="icon-menu"></i>
                            </a>
                            <!-- Mobile Menu Hambarger Action Button End -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>