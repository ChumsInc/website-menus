<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

require_once ("autoload.inc.php");
require_once ('access.inc.php');

$bodyPath = "apps/website-menus";
$title = "Website Menus";
$description = "";

$ui = new WebUI($bodyPath, $title, $description, true, true);
$ui->version = "2019-03-08";
$ui->bodyClassName = 'container-fluid';
$ui->AddCSS("public/css/styles.css");
$ui->addManifest('public/js/manifest.json');
/**
 * Changelog:
 */


$ui->Send();
