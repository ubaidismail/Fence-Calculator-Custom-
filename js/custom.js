jQuery(document).ready(function ($) {
    var xhr = null;

    jQuery('form#calculator-fence').submit(function (e) {
        e.preventDefault();

        var formSubmit = jQuery(this).serialize();
        formSubmit += '&action=fence_form_calculate_submit';

        if (xhr != null) {
            xhr.abort();
        }
        var feet = $('input#feet').val();
        var meter = $('input#meter').val();
        var height = $('select#fence-height').val();
        if (feet == '') {
            $('p#errors').html('<span>Please add feet</span>');
            setTimeout(() => {
                $('p#errors span').hide();

            }, 1500);
            return false;
        }
        if (meter == '') {
            $('p#errors').html('<span>Please add meter</span>');
            setTimeout(() => {
                $('p#errors span').hide();

            }, 1500);
            return false;
        }
        if (height == null) {
            $('p#errors').append('<span>Please add height</span>');
            setTimeout(() => {
                $('p#errors span').hide();

            }, 1500);
            return false;
        }
        $.ajax({
            type: 'POST',
            url: ajax_object.ajax_url,
            data: formSubmit,
            success: function (response) {
                var dataParse = JSON.parse(response);
                console.log(dataParse);
                var table_html = '';
                table_html +=
                    `<table class='bg-white-important appenedd-data'>
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Quanitity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>`;
                for (var i = 0; i < dataParse.product_name.length; i++) {

                    table_html += `
                        <tr data-productID='`+ dataParse.product_id[i] + `'>
                            <td>
                                <div class='flex-inners-data'>
                                    <div class='img_of_product'>
                                        <img src='`+ dataParse.product_image_url[i] + `' />
                                    </div>
                                    <div class='img_of_product head'>
                                       <a href='`+ dataParse.product_slug[i] + `' target="_blank"> <h3>` + dataParse.product_name[i] + `</h3> </a>
                                       <span>`+
                        ((dataParse.height[i] == null) ? ' ' : dataParse.height[i])
                        + `</span>
                                    </div>
                                </div>
                            </td>
                            <td><h3 class='actual_price'>`+ dataParse.product_price[i][0] + `</h3></td>
                            <td id="fenceQty" class="col-qty" data-th="Qty">
                                <button onclick="decrease()" class='dec_qty'>-</button>
                                <input type="text" class="fence-quantity" class='input-qty' value="`+ dataParse.qty[i] + `">
                                <button onclick="increase()" class="inc_qty">+</button>
                            </td>
                               
                            <td><h3 class='subtotal_val'>`+ (dataParse.qty[i] * dataParse.product_price[i][0]) + `</h3></td>
                            <td class='add_to_parent'>
                            <a data-Quanitity='`+dataParse.qty[i]+`' data-productId='`+ dataParse.product_id[i]+`' href='javascript:void(0)' class='add_to_ct add_to_cart_custom'>Add To Basket</a></td>
                        </tr>
                    `;
                }
                table_html += `</table>`;
                $('#response_data').html(table_html);
                // $('#response_data').html(response);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(xhr, textStatus, errorThrown);
            }
        });
    })



    // #################### Add To Cart AJAx #########################
    // #################### Add To Cart AJAx #########################

    $('#response_data').on('click', '.add_to_cart_custom', function (e) {
        e.preventDefault();

        alert('Working On IT');

        // $thisbutton = $(this),
        //     $form = $thisbutton.closest('form.cart'),
        //     id = $thisbutton.val(),
        //     product_qty = $form.find('input[name=quantity]').val() || 1,
        //     product_id = $form.find('input[name=product_id]').val() || id,
        //     variation_id = $form.find('input[name=variation_id]').val() || 0;
        // var data = {
        //     action: 'ql_woocommerce_ajax_add_to_cart',
        //     product_id: product_id,
        //     product_sku: '',
        //     quantity: product_qty,
        //     variation_id: variation_id,
        // };
        // $.ajax({
        //     type: 'post',
        //     url: ajax_object.ajax_url,
        //     data: data,
        //     beforeSend: function (response) {
        //         $thisbutton.removeClass('added').addClass('loading');
        //     },
        //     complete: function (response) {
        //         $thisbutton.addClass('added').removeClass('loading');
        //     },
        //     success: function (response) {
        //         if (response.error & response.product_url) {
        //             window.location = response.product_url;
        //             return;
        //         } else {
        //             $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $thisbutton]);
        //         }
        //     },
        // });
    });
    // #################### Add To Cart AJAx END #########################
    // #################### Add To Cart AJAx END #########################

    $('#response_data').on('click', 'button.dec_qty', function () {
        var qty = $('input.fence-quantity', $(this).parent()).val();
        var actual_price = $('h3.actual_price', $(this).closest('tr')).text();
        var round_data = parseFloat((qty * actual_price).toFixed(2));
        $('h3.subtotal_val', $(this).closest('tr')).text(round_data);
    });

    $('#response_data').on('click', 'button.inc_qty', function () {
        var qty = $('input.fence-quantity', $(this).parent()).val();
        var actual_price = $('h3.actual_price', $(this).closest('tr')).text();
        var round_data = parseFloat((qty * actual_price).toFixed(2));
        $('h3.subtotal_val', $(this).closest('tr')).text(round_data);
    });
})

// })
function increase() {
    var value = parseInt(document.querySelector('.fence-quantity').value);
    value = isNaN(value) ? 0 : value;
    value++;
    document.querySelector('.fence-quantity').value = value;
}
function decrease() {
    var value = parseInt(document.querySelector('.fence-quantity').value);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.querySelector('.fence-quantity').value = value;
}