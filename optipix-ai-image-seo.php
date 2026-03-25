<?php
/**
 * Plugin Name: OptiPix AI Image SEO
 * Plugin URI:  https://github.com/kabeer-qureshi/ai-media-auto-tagger/
 * Description: Automatically generate SEO-optimized Alt Text, Titles, and Descriptions for uploaded images using Google Gemini Vision AI.
 * Version:     1.0.0
 * Author:      Abdul Kabeer
 * Author URI:  https://www.linkedin.com/in/abdul-kabeer-b959682b4/
 * License:     GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: optipix-ai-image-seo
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit( 'Direct access is not allowed.' );
}

define( 'OPTIPIX_VERSION', '1.0.0' );
define( 'OPTIPIX_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'OPTIPIX_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

class OPTIPIX_Plugin_Init {
    public function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }

    private function load_dependencies() {
        require_once OPTIPIX_PLUGIN_DIR . 'includes/class-optipix-settings.php';
        require_once OPTIPIX_PLUGIN_DIR . 'includes/class-optipix-api.php';
        require_once OPTIPIX_PLUGIN_DIR . 'includes/class-optipix-core.php';
    }

    private function init_hooks() {
        add_action( 'plugins_loaded', array( $this, 'init_plugin_classes' ) );
    }

    public function init_plugin_classes() {
        new OPTIPIX_Settings();
        new OPTIPIX_Core();
    }
}
new OPTIPIX_Plugin_Init();