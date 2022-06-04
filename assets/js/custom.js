$(function () {
    /*-------------------------
        Ajax Load Data Nagivation
    ---------------------------*/
    function loadContent(pathUrl) {
        $.ajax({
            url: pathUrl,
            success: function (data) {
                window.scrollTo(0, 0);
                $('#content').html(data);
                AOS.init();
            }
        });
    }
    function checkURL() {
        let href = window.location.href;
        let origin = window.location.origin;
        let path = href.replace(origin, "");
        let root = path.split('/')[path.split('/').length - 2];
        let loadPage = ['', 'about', 'account', `checkout`, 'contact', 'login', 'register', `shop`, 'viewcart'];

        if(!loadPage.includes(path.replaceAll('/', '').replace(root, ''))) {
            return;
        }
        if(path.indexOf('detail') > -1 || path.indexOf('order_view') > -1){
            return;
        }
        if(path.indexOf('.php') > -1){
            if(path.indexOf('index') > -1){
                path = path.replace('index.php', '');
                loadContent('./home.php');
                window.history.pushState('home', 'HOME', path);
            }
            else{
                let url = path.split('/')[path.split('/').length - 1];
                loadContent('./' + url + '.php');
            }
        } else{
            url = path.split('/')[path.split('/').length - 1];
            (url == '') ? loadContent('./home.php') : loadContent('./' + url + '.php');
        }
        
    }
    checkURL();

    function nav() {
        let pathURL = window.location.href.replace(window.location.origin, '');
        if (pathURL.indexOf('#') == -1) {
            $.ajax({
                url: './home.php',
                success: function (data) {
                    $('#content').html(data);
                    AOS.init();
                }
            })
        } else {
            let tempPath = pathURL.split('/');
            let tempPath2 = tempPath[tempPath.length - 1].split('#');
            let path = tempPath2[tempPath2.length - 1];
            path = './' + path + '.php';
            $.ajax({
                url: path,
                success: function (data) {
                    $('#content').html(data);
                    AOS.init();
                }
            });
        }
    }
    //nav();

    $(document).on('click', '.nav-content', function () {
        let id = $(this).attr('id');
        let path = window.location.href.replace(window.location.origin, '').split('/');
        path = path[path.length - 2];
        if(path == ''){
            if(id == 'home') path = '/';
            else path = '/' + id;
        } else{
            if(id == 'home') path = '/' + path + '/';
            else if(id == 'account' || id == "viewcart" || id == "checkout"){
                let check = $('.header-actions #login').text().trim().toLowerCase();
                if (check == 'login') {
                    path = '/' + path + '/' + 'login';
                    id = 'login';
                } 
                else if(check == 'viewcart'){
                    path = '/' + path + '/' + 'viewcart';
                    id = 'viewcart';
                }
                else if(check == 'checkout'){
                    path = '/' + path + '/' + 'checkout';
                    id = 'checkout';
                }
                else {
                    path = '/' + path + '/' + 'account';
                    id = 'account';
                }
            }
            else path = '/' + path + '/' + id;
        }

        window.history.pushState(id, id.toUpperCase(), path);
        loadContent('./' + id + '.php');
    });


    // search Product
    $(document).on("keypress", "#searchProduct", function (e) {
        if (e.which == 13) {
            let search = $("#searchProduct input").val();
            $.ajax({
                type: "post",
                url: "./shop.php",
                data: {
                    search: search,
                },
                success: function (data) {
                    window.scrollTo(0, 0);
                    $("#content").html(data);
                    AOS.init();
                },
            });
        }
    });

    /*-------------------------
        Ajax Function
    ---------------------------*/
    function choosePage(id) {
        $.ajax({
            type: "get",
            url: "./shop.php",
            data: {
                page: id,
            },
            success: function (data) {
                $("#content").html(data);
                AOS.init();
            },
        });
    }

    function checkProductCart(id) {
        let check = $(".cart-product-wrapper .cart-product-inner");
        for (let i = 0; i < check.length; i++) {
            if (check[i].id == "product_id" + id) return true;
        }
        return false;
    }

    function deleteProductCart(id, newprice) {
        $.ajax({
            type: "post",
            url: "./backend/delete_product_cart.php",
            data: {
                delete_id: id,
            },
            success: function () {
                let total = parseFloat($("#totalmoney").text().replace("$", ""));
                let amount = parseInt($("#count-cart").text());
                let qty = $("#quantity".id).text().replace(/\\D/g, "");
                c;
                let money = parseFloat(newprice.replace("$", ""));
                let totalMoney = parseFloat(total - money * qty).toFixed(2);
                console.log(money);
                console.log(total);
                console.log(qty);
                console.log(totalMoney);
                $("#product_id".id).hide("normal", function () {
                    $(this).remove();
                });
                $("#count-cart").text(amount - 1);
                $("#totalmoney").text(totalMoney + "$");
            },
        });
    }

    function addProduct(id, qty) {
        $.ajax({
            type: "post",
            url: "./backend/add_product_cart.php",
            data: {
                add_id: id,
                qty: qty,
            },
            success: function () {
                let product = $(".cart-product-wrapper");
                if (checkProductCart(id)) {
                    // có hàng trong giỏ chỉ cần tăng số lượng
                    let add_qty = parseInt(
                        $("#quantity" + id)
                        .text()
                        .replace(/\D/g, "")
                    );
                    let money = parseFloat(
                        $("#product_id" + id + " .price .new")
                        .text()
                        .replace("$", "")
                    );
                    let total_qty = add_qty + qty;
                    let total = parseFloat($("#totalmoney").text().replace("$", ""));
                    let totalMoney = parseFloat(total + money * qty).toFixed(2);
                    $("#quantity" + id + " > strong").text(total_qty);
                    $("#totalmoney").text(totalMoney + "$");
                } else {
                    // không có hàng trong giỏ thì thêm mới
                    let amount = $("#count-cart").text();
                    let image = $("#img-product" + id).attr("src");
                    let name = $("#product" + id + " .product-title").text();
                    let newprice = $("#product" + id + " .price .new").text();
                    let oldprice = $("#product" + id + " .price .old").text();
                    let total = parseFloat($("#totalmoney").text().replace("$", ""));
                    let totalMoney = parseFloat(newprice.replace("$", "")) * qty + total;
                    $("#count-cart").text(parseInt(amount) + 1);

                    let html = `<div class="cart-product-inner p-b-20 m-b-20 border-bottom" id="product_id${id}">
                    <div class="single-cart-product">
                  <div class="cart-product-thumb">
                      <a href="./frontend/detail_product.php"><img src="${image}" alt="Cart Product" class="rounded"></a>
                  </div>
                  <div class="cart-product-content">
                      <h3 class="title"><a href="./frontend/detail_product.php">${name}</a></h3>
                      <div class="product-quty-price">
                          <span class="cart-quantity" id="quantity${id}">Số lượng: <strong> ${qty} </strong></span>
                          <span class="price">
                            `;

                    if (oldprice != "") {
                        html += `
              <span class="new">${newprice}</span>
              <span class="old" style="text-decoration: line-through;color: #DC3545;opacity: 0.5;">${oldprice}</span>
              </span>
            `;
                    } else {
                        html += `<span class='new'>${newprice}</span>
            </span>`;
                    }
                    html += `
                      </div>
                  </div>
              </div>

              <div class="cart-product-remove">
                  <a class="remove-cart" id="product${id}" onclick="deleteProductCart(id, ${newprice})">
                    <i class="fa fa-trash-o"></i>
                  </a>
              </div>
          </div>`;
                    $(".cart-product-wrapper").append(html);
                    $("#product_id" + id)
                        .hide()
                        .fadeIn();
                    $("#totalmoney").text(parseFloat(totalMoney).toFixed(2) + "$");
                }
            },
        });
    }

    /*-------------------------
        Ajax Shop Page
    ---------------------------*/
    $(document).on("click", ".add-to_cart", function () {
        let qty = parseInt($(".cart-plus-minus-box").val());
        let id = $(this).attr("id").replace("product", "");
        $.ajax({
            type: "post",
            url: "./backend/add_product_cart.php",
            data: {
                add_id: id,
                qty: qty,
            },
            success: function () {
                let product = $(".cart-product-wrapper");
                if (checkProductCart(id)) {
                    // có hàng trong giỏ chỉ cần tăng số lượng
                    let add_qty = parseInt(
                        $("#quantity" + id)
                        .text()
                        .replace(/\D/g, "")
                    );
                    let money = parseFloat(
                        $("#product_id" + id + " .price .new")
                        .text()
                        .replace("$", "")
                    );
                    let total_qty = add_qty + qty;
                    let total = parseFloat($("#totalmoney").text().replace("$", ""));
                    let totalMoney = parseFloat(total + money * qty).toFixed(2);
                    $("#quantity" + id + " > strong").text(total_qty);
                    $("#totalmoney").text(totalMoney + "$");
                } else {
                    // không có hàng trong giỏ thì thêm mới
                    let amount = $("#count-cart").text();
                    let image = $("#img-product" + id).attr("src");
                    let name = $(".product-title").text();
                    let newprice = $(".regular-price").text();
                    let oldprice = $(".old-price").text();
                    let total = parseFloat($("#totalmoney").text().replace("$", ""));
                    let totalMoney = parseFloat(newprice.replace("$", "")) * qty + total;
                    $("#count-cart").text(parseInt(amount) + 1);

                    let html = `<div class="cart-product-inner p-b-20 m-b-20 border-bottom" id="product_id${id}">
              <div class="single-cart-product">
                  <div class="cart-product-thumb">
                      <a href="./frontend/detail_product.php"><img src="${image}" alt="Cart Product" class="rounded"></a>
                  </div>
                  <div class="cart-product-content">
                      <h3 class="title"><a href="./frontend/detail_product.php">${name}</a></h3>
                      <div class="product-quty-price">
                          <span class="cart-quantity" id="quantity${id}">Số lượng: <strong> ${qty} </strong></span>
                          <span class="price">
                            `;

                    if (oldprice != "") {
                        html += `
              <span class="new">${newprice}</span>
              <span class="old" style="text-decoration: line-through;color: #DC3545;opacity: 0.5;">${oldprice}</span>
              </span>
            `;
                    } else {
                        html += `<span class='new'>${newprice}</span>
            </span>`;
                    }
                    html += `
                      </div>
                  </div>
              </div>

              <div class="cart-product-remove">
                  <a class="remove-cart" id="product${id}" onclick="
                    $.ajax({
                      type: 'post',
                      url: './backend/delete_product_cart.php',
                      data: { delete_id: ${id} },
                      success: function () {
                        let total = parseFloat($('#totalmoney').text().replace('$', ''));
                        let amount = parseInt($('#count-cart').text());
                        let qty = $('#quantity${id}').text().replace(/\\D/g, '');c
                        let money = parseFloat('${newprice}'.replace('$', ''));
                        let totalMoney = parseFloat(total - money * qty).toFixed(2);
                        console.log(money);
                        console.log(total);
                        console.log(qty);
                        console.log(totalMoney);
                        $('#product_id${id}').hide('normal', function () {
                          $(this).remove();
                        });
                        $('#count-cart').text(amount - 1);
                        $('#totalmoney').text(totalMoney + '$');
                      }
                    });
                  ">
                    <i class="fa fa-trash-o"></i>
                  </a>
              </div>
          </div>`;
                    $(".cart-product-wrapper").append(html);
                    $("#product_id" + id)
                        .hide()
                        .fadeIn();
                    $("#totalmoney").text(parseFloat(totalMoney).toFixed(2) + "$");
                }
            },
        });
    });

    $(document).keydown('.shop_wrapper grid_4', function (e) {
        let next = $('.page-item a[aria-label="Next"]');
        let prev = $('.page-item a[aria-label="Prev"]');
        switch (e.which) {
            case 37: //left arrow key
                if (prev.length > 0) {
                    let id = parseInt($(prev).attr('name').split('page=')[1]);
                    choosePage(id - 1);
                }
                break;
            case 39: //right arrow key
                if (next.length > 0) {
                    let id = parseInt($(next).attr('name').split('page=')[1]);
                    choosePage(id + 1);
                }
                break;
        }
    })

    $(document).on('click', '.page-item a[aria-label="Next"]', function () {
        let id = parseInt($(this).attr('name').split('page=')[1]);
        choosePage(id + 1);
    });
    $(document).on('click', '.page-item a[aria-label="Prev"]', function () {
        let id = parseInt($(this).attr('name').split('page=')[1]);
        choosePage(id - 1);
    });
    $(document).on('click', '#page-choose', function () {
        let id = parseInt($(this).attr('name').split('page=')[1]);
        choosePage(id);
    });
    /*-------------------------
        Ajax Cart View
    ---------------------------*/
    $(document).on('click', '#clear-cart', function () {
        $.ajax({
            type: 'post',
            url: './backend/clear_cart.php',
            success: function () {
                $('#table-cart').fadeOut("normal", function () {
                    $(this).remove();
                });
                $('.cart-product-wrapper').fadeOut("normal", function () {
                    $(this).remove();
                });
                $('#count-cart').text('0');
                $('#totalmoney').text('0.00$');
            }
        });
    })


    /*-------------------------
        Ajax Remove Product Cart 
    ---------------------------*/
    $(document).on('click', '.remove-cart', function () {
        let id = $(this).attr('id').replace('product', '');
        $.ajax({
            type: 'post',
            url: './backend/delete_product_cart.php',
            data: {
                delete_id: id
            },
            success: function () {
                let money = parseFloat($('#product_id' + id + " .price .new").text().replace('$', ''));
                let total = parseFloat($('#totalmoney').text().replace('$', ''));
                let amount = parseInt($('#count-cart').text());
                let qty = parseInt($('#quantity' + id).text().replace(/\D/g, ''));
                let totalMoney = (total - money * qty).toFixed(2);
                $('#totalmoney').text(totalMoney + '$');
                $('#count-cart').text(amount - 1);
                $('#product_id' + id).hide('normal', function () {
                    $(this).remove();
                });
            }
        });
    });

    /*-------------------------
        Ajax Plus Product
    ---------------------------*/
    $(document).on('click', 'a#plus_product', function () {
        let id = $(this).parent().attr('id').replace('wrapper', '');
        let add_qty = 1;
        addProduct(parseInt(id), add_qty);
    });

});