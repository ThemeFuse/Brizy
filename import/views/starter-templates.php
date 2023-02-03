<div class="wrap brz-wrap-demodata">
    <div class="wp-filter" style="padding-left: 20px;">
        <div class="filter-count">
            <span class="count theme-count"><?php echo $count; ?></span>
        </div>
        <ul class="filter-links">
            <li><a href="#" data-sort="" class="current js-filter-link"><?php echo $l10n['all']; ?></a></li>
            <li><a href="#" data-sort="free" class="js-filter-link"><?php echo $l10n['free']; ?></a></li>
            <li><a href="#" data-sort="pro" class="js-filter-link"><?php echo $l10n['pro']; ?></a></li>
            <li>
                <div class="brz-demo-filter-terms">
                    <select class="select2">
                        <option value=""><?php echo $l10n['allCategories']; ?></option>
	                    <?php foreach( $terms as $term ): ?>
                            <option value="<?php echo $term['id']; ?>"><?php echo $term['name']; ?></option>
	                    <?php endforeach; ?>
                    </select>
                </div>
            </li>
        </ul>
        <form class="search-form">
            <label class="screen-reader-text" for="wp-filter-search-input"><?php echo $l10n['search']; ?></label>
            <input placeholder="<?php echo $l10n['search']; ?>..." type="search" aria-describedby="live-search-desc" id="wp-filter-search-input" class="wp-filter-search js-demo-input-search">
        </form>
    </div>
    <div class="theme-browser content-filterable rendered">
        <div class="themes wp-clearfix">
	        <?php foreach( $demos as $demo ): ?>
                <div class="theme <?php echo ( $demo['pro'] ? 'brz-demo-is-pro' : 'brz-demo-is-free' ); ?>" data-terms="<?php echo implode( ',', $demo['terms'] ); ?>" data-keywords="<?php echo $demo['keywords']; ?>" data-name="<?php echo $demo['name']; ?>" data-preview-link="<?php echo $demo['url']; ?>">
                    <div class="theme-screenshot" style="height: 400px">
                        <img src="<?php echo $demo['photo']; ?>" loading=lazy>
                    </div>
                    <span class="brz-demo-badge">
                        <?php echo ( $demo['pro'] ? $l10n['pro'] : $l10n['free'] ); ?>
                    </span>
                    <span class="more-details"><?php echo $l10n['livePreview']; ?></span>
                    <div class="theme-id-container">
                        <h3 class="theme-name"><?php echo $demo['name']; ?></h3>
                        <div class="theme-actions">
	                        <?php $goPro = $demo['pro'] && ! $isPro; ?>
                            <a class="button <?php echo ( $goPro ? 'brz-demo-item-gopro' : 'brz-demo-item-install' ); ?>" href="<?php echo ( $goPro ? $goProUrl : '#' ); ?>" target="_blank" data-demo-id="<?php echo $demo['id']; ?>">
	                            <?php echo ( $goPro ? $l10n['goPro'] : $l10n['install'] ); ?>
                            </a>
                        </div>
                    </div>
                </div>
	        <?php endforeach; ?>
        </div>
    </div>

    <div class="brz-demo-modal">
        <div class="brz-demo-modal-content"></div>
    </div>

    <script id="brz-demo-modal-content-error" type="text/template">
        <div class="brz-demo-modal-content-response">
            <svg width="60px" height="60px" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="WP-Starter-Templates" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                    <g id="Error" transform="translate(-904.000000, -315.000000)" stroke="#DB352D" stroke-width="2">
                        <g id="Group" transform="translate(786.000000, 316.000000)">
                            <g id="c-warning" transform="translate(119.000000, 0.000000)">
                                <circle id="Oval" cx="29" cy="29" r="29"></circle>
                                <line x1="29" y1="11" x2="29" y2="36" id="Path"></line>
                                <circle id="Oval" cx="29" cy="44" r="1"></circle>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
            <h3 class="brz-demo-modal-content-h3"><?php echo $l10n['t1']; ?></h3>
            <p class="brz-demo-modal-content-p"><?php echo $l10n['t2']; ?></p>
            <button class="button button-primary js-demo-data-close-modal brz-demo-modal-content-button"><?php echo $l10n['t3']; ?></button>
        </div>
    </script>

    <script id="brz-demo-modal-content-success" type="text/template">
        <div class="brz-demo-modal-content-response">
            <svg width="58px" height="56px" viewBox="0 0 58 56" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="WP-Starter-Templates" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                    <g id="Success" transform="translate(-905.000000, -317.000000)" stroke="#3CAA1A" stroke-width="2">
                        <g id="Group" transform="translate(786.000000, 318.000000)">
                            <g id="n-check" transform="translate(120.000000, 0.000000)">
                                <path d="M50,18 C51.3,21.1 52,24.5 52,28 C52,42.4 40.4,54 26,54 C11.6,54 0,42.4 0,28 C0,13.6 11.6,2 26,2 C31.1,2 35.9,3.5 39.9,6" id="Path"></path>
                                <polyline id="Path" points="16 20 26 30 56 0"></polyline>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
            <h3 class="brz-demo-modal-content-h3"><?php echo $l10n['t4']; ?></h3>
            <p class="brz-demo-modal-content-p"><?php echo $l10n['t5']; ?></p>
            <button class="button button-primary js-demo-data-close-modal brz-demo-modal-content-button"><?php echo $l10n['t6']; ?></button>
        </div>
    </script>

    <script id="brz-demo-modal-content-installing" type="text/template">
        <div class="brz-demo-modal-content-response">
            <svg width="62px" height="60px" viewBox="0 0 62 60" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="WP-Starter-Templates" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                    <g id="Installing" transform="translate(-902.000000, -320.000000)" stroke="#206FB0" stroke-width="2">
                        <g id="Group" transform="translate(786.000000, 321.000000)">
                            <g id="cloud-data-download" transform="translate(117.000000, 0.000000)">
                                <polyline id="Path" points="41.0000518 46.9989411 30.0000518 57.9989411 19.0000518 46.9989411"></polyline>
                                <line x1="30.0000518" y1="24.9989411" x2="30.0000518" y2="57.9989411" id="Path"></line>
                                <path d="M38.0000518,39.9989411 L50.0000518,39.9989411 C55.688949,39.458409 60.0261741,34.6677186 60.0003153,28.9532586 C59.9742244,23.2387987 55.5936278,18.4877348 49.9000518,17.9989411 C48.9564307,8.51539049 41.444875,1.01918085 31.9594144,0.0949564839 C22.4739538,-0.829267882 13.6566207,5.07592182 10.9000518,14.1989411 C4.60861295,15.1960874 -0.0178494505,20.6289974 3.55271368e-15,26.9989411 C0.0131558114,33.7925848 5.22915965,39.4432557 12.0000518,39.9989411 L22.0000518,39.9989411" id="Path"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
            <h3 class="brz-demo-modal-content-h3"><?php echo $l10n['t7']; ?></h3>
            <p class="brz-demo-modal-content-p"><?php echo $l10n['t8']; ?></p>
            <span class="spinner"></span>
        </div>
    </script>

    <script id="brz-demo-modal-content-install" type="text/template">
	    <div class="brz-demo-modal-content-install-container">
            <div>
                <svg width="56px" height="56px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="WP-Starter-Templates" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                        <g id="Keep/Delete" transform="translate(-733.000000, -306.000000)" stroke="#2270B1" stroke-width="2">
                            <g id="Group-3" transform="translate(657.000000, 307.000000)">
                                <g id="Group-2" transform="translate(77.000000, 0.000000)">
                                    <polyline id="Path" points="35 6 35 18 7 18 7 6"></polyline>
                                    <line x1="27" y1="6" x2="27" y2="12" id="Path"></line>
                                    <polyline id="Path" points="7 48 7 33 44 33 44 48"></polyline>
                                    <path d="M49,54 L5,54 C2.23857625,54 0,51.7614237 0,49 L0,5 C0,2.23857625 2.23857625,0 5,0 L40,0 L54,14 L54,49 C54,51.7614237 51.7614237,54 49,54 Z" id="Path"></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
                <h3 class="brz-demo-modal-content-h3"><?php echo $l10n['t9']; ?></h3>
                <p class="brz-demo-modal-content-p"><?php echo $l10n['t10']; ?></p>
                <button class="button button-primary js-demo-install brz-demo-modal-content-button" data-rm-content="0">
	                <?php echo $l10n['t11']; ?>
                </button>
            </div>
            <div>
                <svg width="58px" height="60px" viewBox="0 0 58 60" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="WP-Starter-Templates" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                        <g id="Keep/Delete" transform="translate(-1078.000000, -306.000000)" stroke="#2270B1" stroke-width="2">
                            <g id="Group-4" transform="translate(995.000000, 307.000000)">
                                <g id="Group" transform="translate(84.000000, 0.000000)">
                                    <path d="M50,16 L50,53 C50,55.7614237 47.7614237,58 45,58 L11,58 C8.23857625,58 6,55.7614237 6,53 L6,16" id="Path"></path>
                                    <line x1="28" y1="24" x2="28" y2="46" id="Path"></line>
                                    <line x1="18" y1="24" x2="18" y2="46" id="Path"></line>
                                    <line x1="38" y1="24" x2="38" y2="46" id="Path"></line>
                                    <polyline id="Path" points="18 10 18 0 38 0 38 10"></polyline>
                                    <line x1="56" y1="10" x2="0" y2="10" id="Path"></line>
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
                <h3 class="brz-demo-modal-content-h3"><?php echo $l10n['t12']; ?></h3>
                <p class="brz-demo-modal-content-p"><?php echo $l10n['t13']; ?></p>
                <button class="button button-primary js-demo-install brz-demo-modal-content-button" data-rm-content="1"><?php echo $l10n['t11']; ?></button>
                <p class="brz-demo-modal-content-install-notice">(<?php echo $l10n['t14']; ?>)</p>
            </div>
        </div>
    </script>

</div>


