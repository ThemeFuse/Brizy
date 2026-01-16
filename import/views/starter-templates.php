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
    <!-- ai-core -->
    <style>
        .brz-ai-banner {
            flex-wrap: wrap;
            box-sizing: border-box;
        }
        .brz-ai-banner-left,
        .brz-ai-banner-center,
        .brz-ai-banner-right {
            box-sizing: border-box;
        }
        @media screen and (max-width: 1024px) {
            .brz-ai-banner {
                gap: 32px !important;
                padding: 40px 32px !important;
            }
            .brz-ai-banner-center {
                max-width: 100% !important;
                flex: 1 1 100% !important;
                order: 3 !important;
            }
            .brz-ai-banner-right {
                flex: 0 0 auto !important;
                order: 2 !important;
            }
        }
        @media screen and (max-width: 768px) {
            .brz-ai-banner {
                flex-direction: column !important;
                padding: 32px 24px !important;
                gap: 32px !important;
                margin: 20px 0 !important;
                align-items: stretch !important;
            }
            .brz-ai-banner-left {
                min-width: auto !important;
                width: 100% !important;
                flex: 1 1 100% !important;
                order: 1 !important;
            }
            .brz-ai-banner-left h2 {
                font-size: clamp(24px, 5vw, 28px) !important;
                line-height: 1.3 !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
            }
            .brz-ai-banner-left .brz-ai-button,
            .brz-ai-banner-left .brz-ai-button-disabled {
                width: 100% !important;
                max-width: 100% !important;
                justify-content: center !important;
                align-self: stretch !important;
                box-sizing: border-box !important;
            }
            .brz-ai-banner-center {
                max-width: 100% !important;
                width: 100% !important;
                flex: 1 1 100% !important;
                justify-content: flex-start !important;
                order: 2 !important;
            }
            .brz-ai-banner-center ul {
                width: 100% !important;
                max-width: 100% !important;
            }
            .brz-ai-banner-center ul li {
                font-size: clamp(14px, 3.5vw, 16px) !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
            }
            .brz-ai-banner-right {
                width: 100% !important;
                flex: 1 1 100% !important;
                display: flex !important;
                justify-content: center !important;
                order: 3 !important;
            }
            .brz-ai-banner-right .brz-ai-logo-container {
                padding: 16px !important;
                text-align: center !important;
                width: 100% !important;
            }
            .brz-ai-banner-right .brz-ai-logo-container svg {
                width: clamp(70px, 20vw, 100px) !important;
                height: auto !important;
                max-width: 100px !important;
                margin: 0 auto !important;
            }
        }
        @media screen and (max-width: 480px) {
            .brz-ai-banner {
                padding: 24px 16px !important;
                gap: 24px !important;
                margin: 16px 0 !important;
            }
            .brz-ai-banner-left h2 {
                font-size: clamp(20px, 6vw, 24px) !important;
                letter-spacing: -0.3px !important;
            }
            .brz-ai-banner-left .brz-ai-button,
            .brz-ai-banner-left .brz-ai-button-disabled {
                font-size: 14px !important;
                padding: 10px 20px !important;
                white-space: normal !important;
            }
            .brz-ai-banner-center ul {
                gap: 14px !important;
            }
            .brz-ai-banner-center ul li {
                font-size: clamp(13px, 3.2vw, 15px) !important;
                line-height: 1.5 !important;
            }
            .brz-ai-banner-center ul li svg {
                width: 20px !important;
                height: 20px !important;
                margin-right: 10px !important;
                flex-shrink: 0 !important;
            }
            .brz-ai-banner-right .brz-ai-logo-container {
                padding: 12px !important;
            }
            .brz-ai-banner-right .brz-ai-logo-container svg {
                width: clamp(60px, 18vw, 80px) !important;
                max-width: 80px !important;
            }
        }
        @media screen and (max-width: 360px) {
            .brz-ai-banner {
                padding: 20px 12px !important;
                gap: 20px !important;
            }
            .brz-ai-banner-left h2 {
                font-size: 20px !important;
            }
            .brz-ai-banner-center ul li {
                font-size: 13px !important;
            }
            .brz-ai-banner-center ul li svg {
                width: 18px !important;
                height: 18px !important;
                margin-right: 8px !important;
            }
        }
    </style>
    <div class="brz-ai-banner" style="margin: 30px 0; background: 
        radial-gradient(ellipse 120% 100% at 0% 0%, rgba(0, 110, 255, 0.25) 0%, rgba(0, 110, 255, 0.08) 20%, transparent 45%),
        linear-gradient(180deg, #ffffff 0%, #ffffff 35%, #fefefe 50%, rgba(253, 250, 255, 0.99) 60%, rgba(250, 245, 255, 0.98) 70%, rgba(245, 240, 255, 0.96) 80%, rgba(240, 235, 255, 0) 90%, rgba(237, 233, 254, 0) 100%); 
        border-radius: 12px; padding: 48px 56px; display: flex; align-items: center; justify-content: space-between; gap: 48px; position: relative; overflow: hidden; z-index: 0; width: 100%; box-sizing: border-box; max-width: 100%;">
        <div style="position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
        
        <div class="brz-ai-banner-left" style="flex: 0 1 auto; position: relative; z-index: 1; display: flex; flex-direction: column; gap: 24px; min-width: 280px; max-width: 100%; box-sizing: border-box;">
            <h2 style="font-size: 36px; font-weight: 700; line-height: 1.2; color: #1a1a1a; margin: 0; letter-spacing: -0.5px;">
                <?php 
                $title = $l10n['aiBannerTitle'];
                $highlight = $l10n['aiBannerTitleHighlight'];
                $titleParts = explode($highlight, $title);
                if (count($titleParts) == 2) {
                    echo esc_html($titleParts[0]) . '<span style="color: #8b5cf6; position: relative; display: inline-block; font-weight: 700; border-bottom: 2px solid #8b5cf6; padding-bottom: 2px;">' . esc_html($highlight) . '</span>' . esc_html($titleParts[1]);
                } else {
                    echo esc_html($title);
                }
                ?>
            </h2>
            <?php if ( $isPro ): ?>
                <a class="button button-primary brz-ai-button js-open-ai-selection-modal" href="#" title="<?php echo $l10n['buildWebsite']; ?>" style="font-size: 15px; font-weight: 600; padding: 10px 32px; height: auto; background: #1e3a8a; color: #fff; border: none; border-radius: 8px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; align-self: flex-start; box-shadow: 0 2px 8px rgba(30, 58, 138, 0.3);" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#1e3a8a'">
                    <span><?php echo $l10n['buildWebsite']; ?></span>
                    <svg width="18px" height="18px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: inline-block; vertical-align: middle; flex-shrink: 0; margin-left: 2px;">
                        <title>AI Icon</title>
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Step-2" transform="translate(-1149, -610)" fill="#FFFFFF" fill-rule="nonzero">
                                <path d="M1154.33333,615.333333 C1154.82425,615.333333 1155.22222,615.731302 1155.22222,616.222222 C1155.22222,617.757576 1157.24242,619.777778 1158.77778,619.777778 C1159.2687,619.777778 1159.66667,620.175747 1159.66667,620.666667 C1159.66667,621.157586 1159.2687,621.555556 1158.77778,621.555556 C1157.0778,621.555556 1155.35817,623.34172 1155.22222,625.111111 C1155.18461,625.600588 1154.82425,626 1154.33333,626 C1153.84241,626 1153.4917,625.599751 1153.44444,625.111111 C1153.28133,623.424557 1151.19734,621.676618 1149.88889,621.555556 C1149.40006,621.510327 1149,621.157586 1149,620.666667 C1149,620.175747 1149.39797,619.777778 1149.88889,619.777778 C1151.61422,619.777778 1153.30894,617.628929 1153.44444,616.222222 C1153.49152,615.733564 1153.84241,615.333333 1154.33333,615.333333 Z M1162.57576,620.666667 C1162.91048,620.666667 1163.18182,620.938009 1163.18182,621.272727 C1163.18182,621.942163 1163.7245,622.484848 1164.39394,622.484848 C1164.72866,622.484848 1165,622.756191 1165,623.090909 C1165,623.425627 1164.72866,623.69697 1164.39394,623.69697 C1163.7245,623.69697 1163.18182,624.239655 1163.18182,624.909091 C1163.18182,625.243809 1162.91048,625.515152 1162.57576,625.515152 C1162.24104,625.515152 1161.9697,625.243809 1161.9697,624.909091 C1161.9697,624.239655 1161.42701,623.69697 1160.75758,623.69697 C1160.42286,623.69697 1160.15152,623.425627 1160.15152,623.090909 C1160.15152,622.756191 1160.42286,622.484848 1160.75758,622.484848 C1161.42701,622.484848 1161.9697,621.942163 1161.9697,621.272727 C1161.9697,620.938009 1162.24104,620.666667 1162.57576,620.666667 Z M1161.12121,610 C1161.65676,610 1161.91933,610.462379 1162.09091,610.969697 C1162.34915,611.733218 1163.37568,612.741286 1164.0303,612.909091 C1164.54908,613.042073 1165,613.343239 1165,613.878788 C1165,614.414337 1164.52882,614.652798 1164.0303,614.848485 C1163.50538,615.054537 1162.33869,616.084555 1162.09091,616.787879 C1161.91295,617.292997 1161.65676,617.757576 1161.12121,617.757576 C1160.58566,617.757576 1160.28335,617.306947 1160.15152,616.787879 C1159.97518,616.093614 1158.79726,614.979278 1158.21212,614.848485 C1157.68947,614.731659 1157.24242,614.414337 1157.24242,613.878788 C1157.24242,613.343239 1157.67657,612.909091 1158.21212,612.909091 C1158.83402,612.909091 1160.15152,611.584791 1160.15152,610.969697 C1160.15152,610.434148 1160.58566,610 1161.12121,610 Z M1151.90909,610 C1152.24381,610 1152.61095,610.283523 1152.70042,610.606061 C1152.88569,611.273913 1152.97759,611.4145 1153.73018,611.680868 C1154.04572,611.792548 1154.33333,612.089524 1154.33333,612.424242 C1154.33333,612.75896 1154.175,613.033142 1153.87085,613.172892 C1153.25209,613.457201 1152.88996,613.659113 1152.70042,614.242424 C1152.59698,614.560759 1152.24381,614.848485 1151.90909,614.848485 C1151.57437,614.848485 1151.13069,614.556681 1151.01546,614.242424 C1150.76381,613.556152 1150.41724,613.556152 1149.90086,613.172892 C1149.63209,612.973403 1149.48485,612.75896 1149.48485,612.424242 C1149.48485,612.089524 1149.771,611.779338 1150.09091,611.680868 C1150.87902,611.43828 1150.87902,611.192034 1151.14202,610.606061 C1151.27908,610.300691 1151.57437,610 1151.90909,610 Z" id="Combined-Shape"></path>
                            </g>
                        </g>
                    </svg>
                </a>
            <?php else: ?>
                <button class="button button-primary button-disabled brz-ai-button-disabled" disabled title="<?php echo $l10n['requiresProLicense']; ?>" style="font-size: 15px; font-weight: 600; padding: 10px 32px; height: auto; background: #f3f4f6; color: #9ca3af; border: 1px solid #e5e7eb; border-radius: 8px; cursor: not-allowed; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; align-self: flex-start;">
                    <span><?php echo $l10n['buildWebsite']; ?></span>
                    <svg width="18px" height="18px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: inline-block; vertical-align: middle; flex-shrink: 0; margin-left: 2px; opacity: 0.5;">
                        <title>AI Icon</title>
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Step-2" transform="translate(-1149, -610)" fill="#FFFFFF" fill-rule="nonzero">
                                <path d="M1154.33333,615.333333 C1154.82425,615.333333 1155.22222,615.731302 1155.22222,616.222222 C1155.22222,617.757576 1157.24242,619.777778 1158.77778,619.777778 C1159.2687,619.777778 1159.66667,620.175747 1159.66667,620.666667 C1159.66667,621.157586 1159.2687,621.555556 1158.77778,621.555556 C1157.0778,621.555556 1155.35817,623.34172 1155.22222,625.111111 C1155.18461,625.600588 1154.82425,626 1154.33333,626 C1153.84241,626 1153.4917,625.599751 1153.44444,625.111111 C1153.28133,623.424557 1151.19734,621.676618 1149.88889,621.555556 C1149.40006,621.510327 1149,621.157586 1149,620.666667 C1149,620.175747 1149.39797,619.777778 1149.88889,619.777778 C1151.61422,619.777778 1153.30894,617.628929 1153.44444,616.222222 C1153.49152,615.733564 1153.84241,615.333333 1154.33333,615.333333 Z M1162.57576,620.666667 C1162.91048,620.666667 1163.18182,620.938009 1163.18182,621.272727 C1163.18182,621.942163 1163.7245,622.484848 1164.39394,622.484848 C1164.72866,622.484848 1165,622.756191 1165,623.090909 C1165,623.425627 1164.72866,623.69697 1164.39394,623.69697 C1163.7245,623.69697 1163.18182,624.239655 1163.18182,624.909091 C1163.18182,625.243809 1162.91048,625.515152 1162.57576,625.515152 C1162.24104,625.515152 1161.9697,625.243809 1161.9697,624.909091 C1161.9697,624.239655 1161.42701,623.69697 1160.75758,623.69697 C1160.42286,623.69697 1160.15152,623.425627 1160.15152,623.090909 C1160.15152,622.756191 1160.42286,622.484848 1160.75758,622.484848 C1161.42701,622.484848 1161.9697,621.942163 1161.9697,621.272727 C1161.9697,620.938009 1162.24104,620.666667 1162.57576,620.666667 Z M1161.12121,610 C1161.65676,610 1161.91933,610.462379 1162.09091,610.969697 C1162.34915,611.733218 1163.37568,612.741286 1164.0303,612.909091 C1164.54908,613.042073 1165,613.343239 1165,613.878788 C1165,614.414337 1164.52882,614.652798 1164.0303,614.848485 C1163.50538,615.054537 1162.33869,616.084555 1162.09091,616.787879 C1161.91295,617.292997 1161.65676,617.757576 1161.12121,617.757576 C1160.58566,617.757576 1160.28335,617.306947 1160.15152,616.787879 C1159.97518,616.093614 1158.79726,614.979278 1158.21212,614.848485 C1157.68947,614.731659 1157.24242,614.414337 1157.24242,613.878788 C1157.24242,613.343239 1157.67657,612.909091 1158.21212,612.909091 C1158.83402,612.909091 1160.15152,611.584791 1160.15152,610.969697 C1160.15152,610.434148 1160.58566,610 1161.12121,610 Z M1151.90909,610 C1152.24381,610 1152.61095,610.283523 1152.70042,610.606061 C1152.88569,611.273913 1152.97759,611.4145 1153.73018,611.680868 C1154.04572,611.792548 1154.33333,612.089524 1154.33333,612.424242 C1154.33333,612.75896 1154.175,613.033142 1153.87085,613.172892 C1153.25209,613.457201 1152.88996,613.659113 1152.70042,614.242424 C1152.59698,614.560759 1152.24381,614.848485 1151.90909,614.848485 C1151.57437,614.848485 1151.13069,614.556681 1151.01546,614.242424 C1150.76381,613.556152 1150.41724,613.556152 1149.90086,613.172892 C1149.63209,612.973403 1149.48485,612.75896 1149.48485,612.424242 C1149.48485,612.089524 1149.771,611.779338 1150.09091,611.680868 C1150.87902,611.43828 1150.87902,611.192034 1151.14202,610.606061 C1151.27908,610.300691 1151.57437,610 1151.90909,610 Z" id="Combined-Shape"></path>
                            </g>
                        </g>
                    </svg>
                </button>
                <p class="description" style="margin: 12px 0 0 0; font-size: 14px; line-height: 1.6; color: #6b7280; font-weight: 400;">
                    <?php echo $l10n['requiresProMessage']; ?> 
                    <a href="<?php echo $goProUrl; ?>" target="_blank" class="brz-ai-pro-link" style="color: #D62C64; text-decoration: none; font-weight: 600; border-bottom: 2px solid #D62C64; transition: all 0.2s ease; padding-bottom: 2px;">
                        <?php echo $l10n['getProLicense']; ?>
                    </a>
                </p>
            <?php endif; ?>
        </div>

        <div class="brz-ai-banner-center" style="flex: 1 1 auto; position: relative; z-index: 1; max-width: 500px; min-width: 0; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 18px; width: 100%; max-width: 100%; box-sizing: border-box;">
                <li style="display: flex; align-items: flex-start; font-size: 16px; color: #4a4a4a; line-height: 1.6; width: 100%; max-width: 100%; box-sizing: border-box;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 14px; margin-top: 2px; flex-shrink: 0;">
                        <path d="M20 6L9 17l-5-5" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span style="flex: 1; min-width: 0; word-wrap: break-word; overflow-wrap: break-word;"><?php echo esc_html($l10n['aiBannerFeature1']); ?></span>
                </li>
                <li style="display: flex; align-items: flex-start; font-size: 16px; color: #4a4a4a; line-height: 1.6; width: 100%; max-width: 100%; box-sizing: border-box;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 14px; margin-top: 2px; flex-shrink: 0;">
                        <path d="M20 6L9 17l-5-5" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span style="flex: 1; min-width: 0; word-wrap: break-word; overflow-wrap: break-word;"><?php echo esc_html($l10n['aiBannerFeature2']); ?></span>
                </li>
                <li style="display: flex; align-items: flex-start; font-size: 16px; color: #4a4a4a; line-height: 1.6; width: 100%; max-width: 100%; box-sizing: border-box;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 14px; margin-top: 2px; flex-shrink: 0;">
                        <path d="M20 6L9 17l-5-5" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span style="flex: 1; min-width: 0; word-wrap: break-word; overflow-wrap: break-word;"><?php echo esc_html($l10n['aiBannerFeature3']); ?></span>
                </li>
            </ul>
        </div>

        <div class="brz-ai-banner-right" style="flex: 0 0 auto; position: relative; z-index: 1; box-sizing: border-box;">
            <a href="https://ai.brizy.io/" target="_blank" rel="noopener noreferrer" title="<?php echo esc_attr($l10n['aiBrizy']); ?>" class="brz-ai-logo-link" style="display: inline-block; line-height: 0;">
                <div class="brz-ai-logo-container" style="padding: 20px;">
                    <svg width="100px" height="38px" viewBox="0 0 113.968401 43.0000985" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;" role="img" aria-label="<?php echo esc_attr($l10n['aiLogoAlt']); ?>">
                        <title>AI Logo mark left</title>
                        <defs>
                            <linearGradient x1="20.7992038%" y1="10.9100695%" x2="78.7439783%" y2="89.0416553%" id="linearGradient-1">
                                <stop stop-color="#00C0FF" offset="0%"></stop>
                                <stop stop-color="#9D44FE" offset="100%"></stop>
                            </linearGradient>
                        </defs>
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Step-1" transform="translate(-70, -69.9999)" fill-rule="nonzero">
                                <g id="AI-Logo-mark-left" transform="translate(70, 69.9999)">
                                    <path d="M63.546009,33.9473263 C68.0643442,33.9473263 70.2391114,31.6041791 70.2391114,28.3488337 C70.2391114,25.5425014 68.5833754,23.7604805 66.2260563,23.1711507 L66.2261968,23.1151647 C68.3028826,22.2872967 69.2149406,20.3931627 69.2149406,18.5129201 C69.2149406,15.1871357 66.7871825,13.5315399 62.5778244,13.5315399 L55.4778039,13.5315399 L55.4778039,33.9473263 L63.546009,33.9473263 Z M62.2552364,21.9924912 L58.9437644,21.9924912 L58.9436242,16.6464283 L61.9043047,16.6464283 C64.584352,16.6325368 65.6789618,17.6849114 65.6789618,19.2843806 C65.6789618,21.2207498 63.9811308,21.9924912 62.2552364,21.9924912 Z M62.5219782,30.8321572 L58.9437644,30.8324377 L58.9437644,24.9951264 L62.5921366,24.9951264 C65.2439803,24.9951264 66.6190831,26.1457226 66.6190831,27.9698386 C66.6190831,29.8920359 64.9494556,30.8181256 62.5219782,30.8321572 Z M75.6573418,33.9473267 L75.6573418,27.2964595 C75.6573418,25.0233304 77.0464763,23.2692325 79.4879853,23.2692325 C79.7124919,23.2692325 80.0913467,23.2832642 80.4561699,23.3113275 L80.4561699,19.7332539 C80.3439166,19.7192222 80.2036,19.7192222 80.0632834,19.7192222 L80.0632834,19.7195027 C78.3514208,19.7195027 76.7939064,20.5473707 75.6992966,22.0345866 L75.6573418,22.0345866 L75.6573418,19.9298374 L72.4440914,19.9298374 L72.4440914,33.9473267 L75.6573418,33.9473267 Z M83.7268543,17.8392601 C84.9056541,17.8392601 85.8878704,16.8848265 85.8878704,15.7063072 C85.8878704,14.5416793 84.9056541,13.5734947 83.7268543,13.5734947 C82.5060998,13.5734947 81.5519468,14.5416793 81.5519468,15.7063072 C81.5519468,16.8848265 82.5060998,17.8392601 83.7268543,17.8392601 Z M85.312432,33.9474669 L85.312432,19.9299776 L82.0991816,19.9299776 L82.0991816,33.9474669 L85.312432,33.9474669 Z M99.0510166,33.9473267 L99.0510166,31.211293 L91.8387427,31.211293 L91.8387427,31.1693382 L99.1634101,22.1469801 L99.1634101,19.9299776 L87.9942078,19.9299776 L87.9942078,22.6661516 L94.7292649,22.6661516 L94.7292649,22.7081063 L87.5169911,31.6883695 L87.5169911,33.9473267 L99.0510166,33.9473267 Z M106.265159,39.6301493 L113.968401,19.9299776 L110.600662,19.9299776 L106.994805,29.3873173 L106.966742,29.3873173 L103.093863,19.9299776 L99.7123732,19.9299776 L105.409228,33.1618341 L102.883529,39.6301493 L106.265159,39.6301493 Z" id="Brizy" fill="#0E0736"></path>
                                    <path d="M8.82724047,9.85031397e-05 C13.8232172,0.0098553071 16.593583,0.0170149636 22.1558182,0.021788068 C23.4496113,0.021788068 24.385013,0.9632829 24.3921808,2.24486142 C24.4017379,3.68395239 24.3933754,5.04548039 24.3670934,6.32944547 C24.2452403,12.2039437 30.8360589,15.1036045 36.6850074,14.9711509 C38.1376872,14.9377391 39.5497495,14.9425123 40.9211942,14.9854702 C42.2114034,15.0248483 43.0034485,15.9985616 43.0000045,17.2336024 C42.9903073,22.6558489 42.9831395,29.3095564 42.9783611,35.0468278 C42.9747772,38.6660341 40.4230301,41.6874091 37.0039757,42.689761 C36.3141718,42.8915739 34.7780356,42.9950073 32.3955672,43.0000985 L32.0408717,43.0000985 C31.7402574,42.9995443 31.4270564,42.9975271 31.1012686,42.9940464 C23.9286612,42.9152902 16.5135422,42.9140971 8.85591179,42.9904666 C7.48924573,43.0047859 6.3388092,42.836534 5.4046022,42.4857108 C2.07514568,41.2399306 -0.00352468189,38.2865723 4.48675898e-06,34.710324 C0.012005614,25.9230388 0.0143948902,17.1274008 0.00722706137,8.32340982 C0.00364314694,4.69346396 2.09306525,1.66492924 5.50136789,0.462106943 C6.38301084,0.149468609 7.49163502,-0.00446400595 8.82724047,9.85031397e-05 Z M14.4829788,16.1754326 C9.37566924,17.3446545 6.76321319,22.4961341 8.57345201,27.5009216 C10.5054935,32.8594959 17.3600406,34.5378255 21.4719288,30.7065743 C21.5128345,30.6692357 21.5705447,30.6583277 21.6217097,30.6782636 C21.6728748,30.6981996 21.709025,30.7456794 21.715534,30.8014927 L21.8457368,32.6980855 C21.8681373,32.8994275 21.9773396,33.0000985 22.1733438,33.0000985 L24.6723975,32.995784 C24.8880021,32.995784 24.9958044,32.8836078 24.9958044,32.6592552 L25.0000045,15.7837731 C25.0000045,15.5795548 24.9006023,15.4774456 24.7017981,15.4774456 L22.2195448,15.4688167 C21.99554,15.4688167 21.8695373,15.5838692 21.8415367,15.8139744 L21.715534,17.9357372 C21.6959336,18.1284502 21.6119318,18.1658423 21.4635286,18.0479134 C21.2759246,17.8954687 21.0883206,17.7343951 20.9007165,17.5646926 C19.2710815,16.0848286 16.3772195,15.7396709 14.4829788,16.1754326 Z M31.9028045,16.0000985 L29.0972045,16.0000985 C29.0435224,16.0000985 29.0000045,16.0537075 29.0000045,16.1198376 L29.0000045,32.8803594 C29.0000045,32.9464894 29.0435224,33.0000985 29.0972045,33.0000985 L31.9028045,33.0000985 C31.9564865,33.0000985 32.0000045,32.9464894 32.0000045,32.8803594 L32.0000045,16.1198376 C32.0000045,16.0537075 31.9564865,16.0000985 31.9028045,16.0000985 Z M17.0000045,19.0000985 C19.7614282,19.0000985 22.0000045,21.2386748 22.0000045,24.0000985 C22.0000045,26.7615223 19.7614282,29.0000985 17.0000045,29.0000985 C14.2385807,29.0000985 12.0000045,26.7615223 12.0000045,24.0000985 C12.0000045,21.2386748 14.2385807,19.0000985 17.0000045,19.0000985 Z M38.0025638,7.0000985 L38.9511458,7.00266823 C39.1225246,7.00266823 39.2236385,7.08746948 39.2544863,7.25707198 C39.5081273,8.64986836 40.330746,9.47475327 41.7223428,9.73172675 C41.8843779,9.761669 42.0014735,9.90364923 42.0000045,10.068362 L41.9948351,10.9292233 C41.9936521,11.105422 41.8667197,11.255082 41.6940653,11.2838467 C40.3418855,11.5048439 39.4652825,12.4170998 39.257057,13.7379436 C39.2344555,13.8829781 39.1094928,13.9905152 38.9614287,13.9923473 L38.0925374,14.0000985 C37.8834553,14.0017697 37.7583486,13.8998369 37.7172179,13.6942581 C37.4361564,12.3220196 36.6083963,11.5116965 35.2339375,11.2632888 C35.0988402,11.2396006 35.0002262,11.1215242 35.0000045,10.9831877 L35.0000045,10.0606529 C34.9997776,9.89550538 35.1177132,9.75381849 35.2802097,9.72401755 C36.6649513,9.47560983 37.4781442,8.64729863 37.7197886,7.23908386 C37.743504,7.10135989 37.8627635,7.00056859 38.0025638,7.0000985 Z M29.9221211,9.85031397e-05 L32.0117107,0.00376955309 C32.2565366,0.00376955309 32.400984,0.124914202 32.4450526,0.367203498 C32.807395,2.35691257 33.6153207,3.16821461 35.6033076,3.53531962 C35.8347853,3.57809421 36.0020641,3.78092314 36.0000045,4.01622716 L35.9925809,5.98023888 C35.9908909,6.23195136 35.8095596,6.44575129 35.5629113,6.48684378 C33.6312344,6.80255407 32.7461886,7.73867181 32.448725,9.62559149 C32.4164372,9.83278371 32.2379195,9.98640805 32.0264002,9.98902543 L30.0506547,10.0000985 C29.751967,10.0024859 29.5732441,9.85686763 29.5144859,9.56318364 C29.1129712,7.60284296 28.2977008,6.81234352 26.3341966,6.45747538 C26.1412009,6.42363505 26.0003246,6.25495457 26.0000045,6.05733093 L26.0000045,4.00521401 C25.9996838,3.76928903 26.1681626,3.56687919 26.4002996,3.52430647 C28.3784934,3.1694383 29.1729536,2.35324152 29.5181582,0.341506149 C29.5520373,0.144757633 29.7224073,0.000770044637 29.9221211,9.85031397e-05 Z" id="AI-logo-Brizy" fill="url(#linearGradient-1)"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            </a>
        </div>
    </div>
    <!-- ai-core -->
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
            <a href="<?php echo admin_url( 'post.php?action=in-front-editor&post=' . get_option( 'page_on_front' ) ); ?>" class="button button-primary js-demo-data-close-modal brz-demo-modal-content-button js-demo-data-edit-homepage"> <?php echo $l10n['t15']; ?> </a>
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
