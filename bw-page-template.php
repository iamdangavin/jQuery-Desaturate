<?php

/** 
 * Template Name: B&W Rollover
 *
 * This will be our loop to display the post thumbnail and add in our
 * class along with the initImage that is necessary to allow this awesome
 * function to work!
 *
 * Also notice that it is wrapped in a div with the class of switched_images.
 * make sure you keep it wrapped in that div class.
 *
 * I am basing all of my div classes off of Twentyten.
 * You can just grab the_post_thumbnail and add it to any theme you would like.
 *
 *
 * @package WordPress
 * @subpackage Twenty_Ten
 * @since Twenty Ten 1.0
 */

get_header(); ?>

		<div id="container">
			<div id="content" role="main">

 
 <?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>

				<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
					<?php if ( is_front_page() ) { ?>
						<h2 class="entry-title"><?php the_title(); ?></h2>
					<?php } else { ?>
						<h1 class="entry-title"><?php the_title(); ?></h1>
					<?php } ?>

					<div class="entry-content">
					
						<div class="switched_images">
							<!-- Get the post thumbnial -->
							<?php if ( has_post_thumbnail() ) { 
								echo the_post_thumbnail('thumbnail', array( 'class'=>'des', 'onload' => 'initImage(this);')); 
							} 
							?>
							<!-- end post thumbnail -->
						</div><!-- .switched_images -->
						
						<?php the_content(); ?>
						<?php wp_link_pages( array( 'before' => '<div class="page-link">' . __( 'Pages:', 'twentyten' ), 'after' => '</div>' ) ); ?>
						<?php edit_post_link( __( 'Edit', 'twentyten' ), '<span class="edit-link">', '</span>' ); ?>
					</div><!-- .entry-content -->
				</div><!-- #post-## -->

				<?php comments_template( '', true ); ?>

<?php endwhile; // end of the loop. ?>

			</div><!-- #content -->
		</div><!-- #container -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>

 