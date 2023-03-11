<?php
/* Child theme generated with WPS Child Theme Generator */

if (!function_exists('b7ectg_theme_enqueue_styles')) {
    add_action('wp_enqueue_scripts', 'b7ectg_theme_enqueue_styles');

    function b7ectg_theme_enqueue_styles()
    {
        wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
        wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.css', array('parent-style'));
        $rest_nonce = wp_create_nonce('wp_rest');
        $data = array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => $rest_nonce,
        );
        wp_enqueue_script('custom_fence_calculator_js', get_stylesheet_directory_uri() . '/js/custom.js', [], false);
        wp_localize_script('custom_fence_calculator_js', 'ajax_object', $data);
        // wp_enqueue_script('jquery');
    }
}


// ############### Calculate form Ajax ###############

function fence_form_calculate_submit()
{
    if (isset($_POST['action'])) {
        $feet = $_POST['feet'];
        $meters = $_POST['meters'];
        $fence_height = $_POST['fence-height'];
        $fence_height_for_posts = $_POST['fence-height'];
        $panel_type = $_POST['panel-type'];
        $post_type = $_POST['post-type'];
        $gravel_board = $_POST['gravel-board'];

        if($gravel_board == 0){
            $gravel_board = 'fencing-materials-panel-clip';
        }

        $args = array(
            'post_type' => 'product',
            'product_cat' => 'fence-panels , concrete-gravel-boards-posts, tools-misc',
            'post_name__in' => [$panel_type, $post_type, $gravel_board, 'post-mix'],
            'order' => 'ASC',
            'orderby' => 'post_name__in',
        );

        $loop = new WP_Query($args);
        if ($loop->have_posts()) {
            // var_dump($loop);
            $inc = 0;
            foreach ($loop->posts as $post) {
                $inc++;

                $product_name[] = $post->post_title;
                $product_id_for_send[] = $post->ID;
                $product_id = $post->ID;
                $price[] = get_post_meta($product_id, '_price');
                $product_slug[] = $post->post_name;
                $image[] = get_the_post_thumbnail_url($product_id);
                // var_dump($image);

                $_product = wc_get_product($product_id);
                // #### check if product is variable 
                if ($_product->is_type('variable')) {
                    
                    $product_vari = $_product->get_available_variations();
                }
                if ($product_vari) {
                    //############## This for ehight ##################
                    //############## This for ehight ##################

                    $heights = array(); // create an empty array
                    foreach ($product_vari as $variation) {
                        $check = array(); // reset the $check array
                        $check[] = $variation['dimensions']['height'];
                        $check2 = $variation["attributes"]['attribute_post-size'];
                        $check3 = $variation["attributes"]['attribute_post-size'];
                        if (in_array(floor($fence_height), $check)) {
                            $height1 = floor($fence_height);
                            $height1 = '6ft x ' . $height1 . 'ft high';
                            // $matching_variation_id_1 = $variation['variation_id']; 
                            $matching_variation_id_1 = !empty($variation['variation_id'])? $variation['variation_id'] : null; 
                        }
                        if (in_array($fence_height_for_posts, $check)) {
                            $height2 = $fence_height_for_posts;
                            $height2 = $check2;
                            if (is_null($height2)) {
                                $height2 = '  ';
                            }
                            $matching_variation_id_2 = !empty($variation['variation_id'])? $variation['variation_id'] : null; 
                            // echo $matching_variation_id_2;
                            // wp_die();
                        }
                       
                    }
                }
                foreach ($product_id_for_send as $id) {

                    $get_feet = get_field('add_feet', $id);
                    if ($get_feet) {

                        $get_qty[] = round(($feet / $get_feet));
                        // if ($get_qty_2 <= 1) {
                        //     $get_qty_2 = 1;
                        // } else {
                        //     $get_qty_2 = 0;
                        // }
                    }
                }

            }
            $merge_heights = array($height1, $height2);
            $matching_variation_id = array($matching_variation_id_1, $matching_variation_id_2);


            $data = array(
                'product_name' => $product_name,
                'product_id' => $product_id_for_send,
                'product_slug' => $product_slug,
                'product_image_url' => $image,
                'product_price' => $price,
                'qty' => $get_qty,
                'height' => $merge_heights,
                'variation_id' => $matching_variation_id,
            );
            echo json_encode($data);

            wp_die();
        } else {
            // handle case when no products are found
            echo 'Query Not Found';
            wp_die();
        }

        wp_die();
    }
}
add_action('wp_ajax_nopriv_fence_form_calculate_submit', 'fence_form_calculate_submit'); // for non loggedin
add_action('wp_ajax_fence_form_calculate_submit', 'fence_form_calculate_submit');
// ############### Calculate form Ajax ###############

// ################### Woocomemrce add to cart ###########################

function ql_woocommerce_ajax_add_to_cart(){
    echo 'ok';

    wp_die();
}

add_action('wp_ajax_ql_woocommerce_ajax_add_to_cart', 'ql_woocommerce_ajax_add_to_cart'); // for non loggedin
add_action('wp_ajax_ql_woocommerce_ajax_add_to_cart' , 'ql_woocommerce_ajax_add_to_cart');
// ################### Woocomemrce add to cart ###########################
?>