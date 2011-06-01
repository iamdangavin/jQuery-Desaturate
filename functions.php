<?php

/**
 * You will need to add these items to your child themes functions.php
 * If you do not have one, then you will need to create one.
 * You can learn to create a child theme here:
 * http://codex.wordpress.org/Child_Themes
 *
 * Make sure to look at line 78 where we add in some styles.
 * These items might need to change based on your theme and layout.
 */

 
//////////////////////////////////////////////////////////////
// Adding the necessary items to the Theme Header
/////////////////////////////////////////////////////////////

function gavin_enqueue() {
    wp_enqueue_script( 'jquery' );
	wp_register_script('gavin-jquery-desaturate', get_bloginfo('stylesheet_directory') .'/scripts/jquery.desaturate.js', NULL, array('jquery'));
	wp_enqueue_script('gavin-jquery-desaturate');	
}
add_action( 'after_setup_theme', 'gavin_enqueue' );


function gavin_scripts() { ?>
	
<script type="text/javascript">
	/* Making sure we don't interfere with any other jquery */
	var $j = jQuery.noConflict();
     /* This is the javascript to make the greyscale work. */

      var paircount = 0;

      /* If you want to desaturate after page loaded - use onload event
       * of image.
      */
      function initImage(obj)
      {
        obj.onload = null;
        var $newthis =  $j(obj);
        if ($j.browser.msie)
        {
          // You need this only if desaturate png with aplha channel
          $newthis = $newthis.desaturateImgFix();
        }
        // class for easy switch between color/gray version
        $newthis.addClass("pair_" + ++paircount);
        var $cloned = $newthis.clone();
        // reset onload event on cloned object
        $cloned.get(0).onload = null;
        // add cloned after original image, we will switch between
        // original and cloned later
        $cloned.insertAfter($newthis).addClass("color").hide();
        // desaturate original
        $newthis.desaturate();
      };

       $j(function(){

         $j('.xxx').data('desaturate', {'level':0.5});

         $j(".switched_images").bind("mouseenter mouseleave", function(event) {
            if (event.type == 'mouseenter')
            {
              //$(".des:not(.color)", this).fadeOut(1000);
               $j(".des.color", this).fadeIn(200);
            }
            if (event.type == 'mouseleave')
            {
              //$(".des:not(.color)", this).fadeIn(1000);
               $j(".des.color", this).fadeOut(200);
            }
          });
      });
</script>

<style type="text/css">
    /* These items might need to change based on your layout. */
	.switched_images {
	position: relative;
	}
	.des {
	z-index: 10;
	}
	.color {
	position: absolute;
	top:0;
	left:0;
	z-index: 15 !important;
	}
</style>


<?php }
add_action( 'wp_head', 'gavin_scripts' );