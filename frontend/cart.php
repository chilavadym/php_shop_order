<!-- Header Action Button Start -->
<div class="header-action-btn header-action-btn-cart d-none d-sm-flex">
    <a class="cart-visible" href="javascript:void(0)">
        <i class="icon-handbag icons"></i>
        <?php
        $user = $_SESSION['user'];
        $sql = "SELECT * FROM `tb_cart` WHERE username = '$user'";
        $count = mysqli_num_rows(mysqli_query($conn, $sql));
        echo "<span class='header-action-num' id='count-cart'>" . $count . "</span>";
        ?>
    </a>

    <!-- Header Cart Content Start -->
    <div class="header-cart-content">

        <!-- Cart Procut Wrapper Start  -->
        <div class="cart-product-wrapper">
            <?php
            $sql = "SELECT * 
                        FROM `tb_cart` as c, `tb_product` as p
                        WHERE c.username = '" . $_SESSION['user'] . "'
                        AND c.id_product = p.id_product";
            $result = mysqli_query($conn, $sql);
            $count = mysqli_num_rows($result);
            if ($count > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $id = $row['id_product'];
                    $name = $row['name'];
                    $amount = $row['amount'];
                    $image = $row['image'];
                    $price = $row['price'];
                    $discount = $row['discount'];
                    $discount_price = $price - ($price * $discount / 100);
            ?>
                    <!-- Cart Product/Price Start -->
                    <div class="cart-product-inner p-b-20 m-b-20 border-bottom" id="product_id<?php echo $id ?>">
                        <!-- Single Cart Product Start -->
                        <div class="single-cart-product">
                            <div class="cart-product-thumb">
                                <a href="/frontend/detail_product.php"><img src="/assets/images/products/<?php echo $image ?>" alt="Cart Product" class="rounded"></a>
                            </div>
                            <div class="cart-product-content">
                                <h3 class="title"><a href="/frontend/detail_product.php"><?php echo $name ?></a></h3>
                                <div class="product-quty-price">
                                    <span class="cart-quantity" id="quantity<?php echo $id ?>">Số lượng: <strong> <?php echo $amount ?> </strong></span>
                                    <span class="price">
                                        <?php
                                        if ($discount > 0) {
                                        ?>
                                            <span class="new">$<?php echo $discount_price ?></span>
                                            <span class="old" style="text-decoration: line-through;color: #DC3545;opacity: 0.5;">$<?php echo $price ?></span>
                                        <?php
                                        } else {
                                        ?>
                                            <span class='new'>$<?php echo $price ?></span>
                                        <?php
                                        }
                                        ?>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!-- Single Cart Product End -->

                        <!-- Product Remove Start -->
                        <div class="cart-product-remove">
                            <a class="remove-cart" id="product<?php echo $id ?>"><i class="fa fa-trash-o"></i></a>
                        </div>
                        <!-- Product Remove End -->

                    </div>
                    <!-- Cart Product/Price End -->
            <?php
                }
            }
            ?>
        </div>
        <!-- Cart Procut Wrapper -->

        <!-- Cart Product Total Start -->
        <div class="cart-product-total p-b-20 m-b-20 border-bottom">
            <span class="value">Tổng tiền</span>
            <?php
            $sql = "SELECT * 
                        FROM `tb_cart` as c, `tb_product` as p
                        WHERE c.username = '" . $_SESSION['user'] . "'
                        AND c.id_product = p.id_product";
            $result = mysqli_query($conn, $sql);
            $count = mysqli_num_rows($result);
            $total = 0;
            if ($count > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $price = (float)$row['price'];
                    $discount = (float)$row['discount'];
                    $amount = (int)$row['amount'];
                    $discount_price = $price - ($price * $discount / 100);
                    $total += $discount_price * $amount;
                }
                echo "<span class='value' id='totalmoney'>" . $total . "$</span>";
            } else {
                echo "<span class='value' id='totalmoney'>0.00$</span>";
            }
            ?>
        </div>
        <!-- Cart Product Total End -->

        <!-- Cart Product Button Start -->
        <div class="cart-product-btn m-t-20">
            <a href="/index.php#viewcart" id="nav-viewcart" class="btn btn-outline-light btn-hover-primary w-100">View cart</a>
            <a href="/index.php#checkout" id="nav-checkout" class="btn btn-outline-light btn-hover-primary w-100 m-t-20">Checkout</a>
        </div>
        <!-- Cart Product Button End -->

    </div>
    <!-- Header Cart Content End -->
</div>