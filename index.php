<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

use chums\ui\WebUI2;
use chums\user\Groups;

require_once("autoload.inc.php");

$ui = new WebUI2([
    'contentFile' => 'body.inc.php',
    "bodyClassName" => 'container-fluid',
    "title" => 'Website Menus',
    'requiredRoles' => [Groups::WEB_ADMIN, Groups::ADMIN]
]);
$ui->addViteManifest()
    ->render();
