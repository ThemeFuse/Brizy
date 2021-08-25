#!/usr/bin/env php
<?php
$url = 'https://api.wordpress.org/core/version-check/1.7/';
$response = file_get_contents($url);

$obj = json_decode($response);
$testedUpTo = $obj->offers[0]->version;
$minPhpVersion = $obj->offers[0]->php_version;

function error($message,$code) {
  $fh = fopen('php://stderr','a');
  fwrite($fh,$message);
  fclose($fh);
  exit($code);
}

//small validation
if( !isset($argv[1]) ) {
  error('First filename argument not provided',0);
}

if( !file_exists($argv[1]) ) {
  error('First filename not exists',0);
}

if( !isset($argv[2]) ) {
  error('Second filename argument not provided',1);
}

if( !file_exists($argv[2]) ) {
  error('Second filename argument not exists',1);
}


// README.md
$content = file_get_contents($argv[1]);
$content= preg_replace("/Tested up to: (.[0-9\.]+)<br>/m","Tested up to: {$testedUpTo}<br>",$content);
$content= preg_replace("/Requires PHP: (.[0-9\.]+)<br>/m","Requires PHP: {$minPhpVersion}<br>",$content);
file_put_contents($argv[1],$content);

// readme.txt
$content = file_get_contents($argv[2]);
$content= preg_replace("/Tested up to: (.[0-9\.]+)/m","Tested up to: {$testedUpTo}",$content);
$content= preg_replace("/Requires PHP: (.[0-9\.]+)/m","Requires PHP: {$minPhpVersion}",$content);
file_put_contents($argv[2],$content);

exit(0);
?>