<?php defined( 'ABSPATH' ) or die; ?>

<div class="brz-content">
	<div class="brz-container">`
		<div
			class="brz-title-page">
			<?php echo sprintf( __( 'Welcome to %s', 'brizy' ), __bt( 'brizy', 'Brizy' ) ) ?>
		</div>
		<div class="brz-subtitle-page">
			<?php _e( 'Build no-code WordPress websites fast & easy', 'brizy' ); ?>
		</div>
		<?php if ( ! $name ) : ?>
			<video class="brz-video-page"
			       poster="<?php echo $imgPath ?>Video_Cover.jpg"
			       controls>
				<source src="" type="video/mp4">
				<source src="" type="video/ogg">
				<?php _e( 'Your browser does not support the video tag.', 'brizy' ); ?>
			</video>
		<?php endif; ?>

		<nav class="brz-nav-menu">
			<span class="brz-menu-tab brz-menu-tab-active">
				<?php _e( 'Start From a Premade Website', 'brizy' ); ?>
			</span>
			<span class="brz-menu-tab">
				<?php _e( 'Add Pages on Your Existing Website', 'brizy' ); ?>
			</span>
		</nav>

		<div class="brz-content-tab brz-content-tab-active">
			<div class="brz-tab-block">
				<div>
					<a href="admin.php?page=starter-templates">
						<img
							src="<?php echo $imgPath ?>1_Go_to_starter_Templates.jpg"
							alt="">
					</a>
				</div>
				<div>
					<div class="brz-title-tab">
						<?php _e( '1. Go to Starter Templates', 'brizy' ); ?>
					</div>
					<div
						class="brz-subtitle-tab">
						<?php echo sprintf( __( 'Perfect if you want to start with a premade website and go from there. Go to the %s Starter Templates %s page of the plugin, in the main sidebar.', 'brizy' ), '<strong>', '</strong>' ); ?>
					</div>
					<a href="admin.php?page=starter-templates">
						<p class="brz-button-tab">
							<?php _e( 'View Starter Templates', 'brizy' ); ?>
						</p>
					</a>
				</div>
			</div>

			<div class="brz-tab-block brz-tab-block-inverse">
				<div>
					<a href="admin.php?page=starter-templates">
						<img
							src="<?php echo $imgPath ?>2_Browse_Websites_Library.jpg"
							alt="">
					</a>
				</div>
				<div>
					<div class="brz-title-tab">
						<?php _e( '2. Browse the Websites Library', 'brizy' ); ?>
					</div>
					<div class="brz-subtitle-tab">
						<?php echo sprintf( __( 'With %s over 150 ready made websites %s & landing pages, our library was carefully crafted by professional designers to let you quickly spin up a new website.', 'brizy' ), '<strong>', '</strong>' ); ?>
					</div>
					<a href="admin.php?page=starter-templates">
						<p class="brz-button-tab">
							<?php _e( 'Browse All Designs', 'brizy' ); ?>
						</p>
					</a>
				</div>
			</div>

			<div class="brz-tab-block">
				<div>
					<a href="admin.php?page=starter-templates">
						<img
							src="<?php echo $imgPath ?>3_Install_with_1_click.jpg"
							alt="">
					</a>
				</div>
				<div>
					<div class="brz-title-tab">
						<?php _e( '3. Install With 1-click', 'brizy' ); ?>
					</div>
					<div class="brz-subtitle-tab">
						<?php echo sprintf( __( 'When you decided, %s press the Install button. %s This will let you start from a ready made website by installing all content: images, copy, pages, menus & more.', 'brizy' ), '<strong>', '</strong>' ); ?>
					</div>
					<a href="admin.php?page=starter-templates">
						<p class="brz-button-tab">
							<?php _e( 'Install a Ready Made Website', 'brizy' ); ?>
						</p>
					</a>
				</div>
			</div>

			<div class="brz-tab-block brz-tab-block-inverse">
				<div>
					<a href="edit.php?post_type=page">
						<img
							src="<?php echo $imgPath ?>4_Start_editing.jpg"
							alt="">
					</a>
				</div>
				<div>
					<div class="brz-title-tab">
						<?php _e( '4. Start Editing Your Website', 'brizy' ); ?>
					</div>
					<div class="brz-subtitle-tab">
						<?php echo sprintf( __( 'Once the install is done, you can edit any imported page by going to Pages, find the page name and %s press the Edit with button. %s ', 'brizy' ), '<strong>', '</strong>' ); ?>
					</div>
					<a href="edit.php?post_type=page">
						<p class="brz-button-tab">
							<?php _e( 'Go to All Pages', 'brizy' ); ?>
						</p>
					</a>
				</div>
			</div>


			<div class="brz-content-tab-bottom">
				<?php if ( ! $name ) : ?>
					<div class="brz-tab-block-bottom">
						<div>
							<a href="">
								<img
									src="<?php echo $imgPath ?>Visit_Brizy_Academy.jpg"
									alt="">
							</a>
						</div>
						<div class="brz-tab-block-bottom-content">
							<div class="brz-title-tab-bottom">
								<?php _e( 'Visit the Brizy Academy', 'brizy' ); ?>
							</div>
							<div class="brz-subtitle-tab-bottom">
								<?php _e( 'Follow step by step guides and tutorials on how to build your website and bring your web presence to life.', 'brizy' ); ?>
							</div>
							<a href="">
								<p class="brz-button-tab-bottom">
									<?php _e( 'Visit the Academy', 'brizy' ); ?>
								</p>
							</a>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</div>


		<div class="brz-content-tab">
			<div class="brz-tab-block">
				<div>
					<a href="admin.php?page=starter-templates">
						<img
							src="<?php echo $imgPath ?>1_Go_to_Pages.jpg"
							alt="">
					</a>
				</div>
				<div>
					<div class="brz-title-tab">
						<?php _e( '1. Go to Pages', 'brizy' ); ?>
					</div>
					<div class="brz-subtitle-tab">
						<?php echo sprintf( __( 'Perfect if you want to add %s pages %s to your existing website. Go to Pages, in the main sidebar.', 'brizy' ), '<strong>', '</strong>' ); ?>
					</div>
					<a href="admin.php?page=starter-templates">
						<p class="brz-button-tab">
							<?php _e( 'Create a New Page', 'brizy' ); ?>
						</p>
					</a>
				</div>
			</div>

			<div class="brz-tab-block brz-tab-block-inverse">
				<div>
					<a href="admin.php?page=starter-templates">
						<img
							src="<?php echo $imgPath ?>2_Create_New_Page.jpg"
							alt="">
					</a>
				</div>
				<div>
					<div class="brz-title-tab">
						<?php _e( '2. Create a New Page', 'brizy' ); ?>
					</div>
					<div class="brz-subtitle-tab">
						<?php echo sprintf( __( 'Add a new page by pressing the %s Add New %s button from the top of the page.', 'brizy' ), '<strong>', '</strong>' ); ?>
					</div>
					<a href="admin.php?page=starter-templates">
						<p class="brz-button-tab">
							<?php _e( 'Create a New Page', 'brizy' ); ?>
						</p>
					</a>
				</div>
			</div>

			<div class="brz-tab-block">
				<div>
					<a href="admin.php?page=starter-templates">
						<img
							src="<?php echo $imgPath ?>3_Edit_with_Builder.jpg"
							alt="">
					</a>
				</div>
				<div>
					<div class="brz-title-tab">
						<?php _e( '3. Edit page with the builder', 'brizy' ); ?>
					</div>
					<div class="brz-subtitle-tab">
						<?php echo sprintf( __( 'Press the %s Edit with Builders %s button to load the drag and drop visual builder and start editting your page.', 'brizy' ), '<strong>', '</strong>' ); ?>
					</div>
					<a href="admin.php?page=starter-templates">
						<p class="brz-button-tab">
							<?php _e( 'Create a New Page', 'brizy' ); ?>
						</p>
					</a>
				</div>
			</div>


			<div class="brz-content-tab-bottom">
				<?php if ( ! $name ) : ?>
					<div class="brz-tab-block-bottom">
						<div>
							<a href="">
								<img
									src="<?php echo $imgPath ?>Visit_Brizy_Academy.jpg"
									alt="">
							</a>
						</div>
						<div class="brz-tab-block-bottom-content">
							<div class="brz-title-tab-bottom">
								<?php _e( 'Visit the Brizy Academy', 'brizy' ); ?>
							</div>
							<div class="brz-subtitle-tab-bottom">
								<?php _e( 'Follow step by step guides and tutorials on how to build your website and bring your web presence to life.', 'brizy' ); ?>
							</div>
							<a href="">
								<p class="brz-button-tab-bottom">
									<?php _e( 'Visit the Academy', 'brizy' ); ?>
								</p>
							</a>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>


<script>
    jQuery(document).ready(function ($) {
        $('.brz-container .brz-nav-menu .brz-menu-tab').on('click', function () {
            $(this).closest('.brz-container').find('.brz-content-tab, .brz-menu-tab').removeClass('brz-content-tab-active brz-menu-tab-active');
            $(this).addClass('brz-menu-tab-active').closest('.brz-container').find('.brz-content-tab').eq($(this).index()).addClass('brz-content-tab-active');
        });
    });
</script>