<?php
    header('Access-Control-Allow-Origin: http://s3-us-west-2.amazonaws.com');  
    header('Access-Control-Allow-Methods: GET');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
    require_once 'HTTP/Request.php';
                                
    $url = 'http://affiliate-api.dmm.com/?';
    $url .= 'api_id='.(string)$_GET["api_id"];
    $url .= '&affiliate_id='.(string)$_GET["affiliate_id"];
    $url .= '&operation='.(string)$_GET["operation"];
    $url .= '&version='.(string)$_GET["version"];
    $url .= '&offset='.(string)$_GET["offset"];
    $url .= '&service='.(string)$_GET["service"];
    $url .= '&floor='.(string)$_GET["floor"];
    $url .= '&sort='.(string)$_GET["sort"];
    $url .= '&site='.(string)$_GET["site"];
    $url .= '&hits='.(string)$_GET["hits"];
    $url .= '&keyword='.(string) $_GET["keyword"];
    $url .= '&timestamp='.(string)$_GET["timestamp"];
    $request = &new HTTP_Request();
    $request->setURL($url);

    $result = $request->sendRequest();
    if (!PEAR::isError($result)) {
        echo $request->getResponseBody();
    }
?>
