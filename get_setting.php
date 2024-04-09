<?php

@header("Cache-Control:no-cache");
@header("Expires:0");
@header("Pragma:no-cache");
@header("Content-Type:text/html;charset=utf-8");

$_COOKIE_DOMAIN = ".digeam.com";
function __result($code, $msg)
{
    echo json_encode(array('code' => $code, 'msg' => $msg));
    exit;
}

function __GetClientIp()
{
    if ($_SERVER["HTTP_CF_CONNECTING_IP"]) {
        $result = $_SERVER["HTTP_CF_CONNECTING_IP"];
    } else if (isset($_SERVER['HTTP_CLIENT_IP'])) {
        $result = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (isset($_SERVER['HTTP_FORWARDED_FOR'])) {
        $result = $_SERVER['HTTP_FORWARDED_FOR'];
    } elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $result = $_SERVER['REMOTE_ADDR'];
    } else {
        $result = '';
    }
    return $result;
}

function __SetPost($url, $data)
{
    $PostData = http_build_query($data);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $PostData);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

$PostData = array();
$PostData['user_ip'] = __GetClientIp();

$InputData1 = file_get_contents("php://input");
$InputData2 = json_decode($InputData1, true);
$PostData = array_merge($PostData, $InputData2);

$url = "https://webapi.digeam.com/nage/20240111";

$result = __SetPost($url, $PostData);
echo $result;
