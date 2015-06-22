<?PHP

// if possible, move these files outside of the root of the webserver
require_once("api_config.php");
require_once("api_service.php");

runApp();

/**
 * Runs this app
 *
 * runs checks on user input (POST data), runs database service
 * returnes JSON response
 */
function runApp() {
    $response = checkInput();
    if ($response['statusCode'] === 200) {
        $response = validateUser(
            $response['data']['username'],
            $response['data']['password']
        );
        // add QSK to the output
        if ($response['statusCode'] === 200) {
            $response['qsk'] = convertQSK();
        } else {
            $response['statusCode'] = 401;
        }
    }

    writeJSON($response);
}

/**
 * Returns JSON to client
 *
 * @param  String username
 */
function writeJSON($response) {
    $statusCode = $response['statusCode'];
    unset($response['statusCode']);

    switch ($statusCode) {
        case 200:
            $statusMessage = "OK";
            break;

        case 400:
            $statusMessage = "Bad Request";
            break;

        case 401:
            $statusMessage = "Unauthorized";
            break;

        case 403:
            $statusMessage = "Forbidden";
            break;

        case 404:
            $statusMessage = "Not Found";
            break;

        case 500:
            $statusMessage = "Internal Server Error";
            break;
    }

    if ( ! DEBUG AND $statusCode != 200) {
        $response = $statusMessage;
    }

    // parse.com requires the response to have a 'success' parameter
    $response = array('success' => $response);
    header('Content-type: application/json');

    // http_response_code is only supported from PHP 5.4
    // another way is to use header as follows:
    // header($_SERVER['SERVER_PROTOCOL'] . $statusCode . " " . $statusMessage, true, $statusCode);
    // but this doesn't always work depending on the server set-up
    //
    http_response_code($statusCode);

    exit(json_encode($response));
}

/**
 * Converts the qsk POST parameter to one that can be validated
 *
 * @return converted QSK
 */
function convertQSK() {
    $qsk = sha1(QTRA_SECRET_KEY);
    return $qsk;
}

/**
 * Check client's request for valid POST parameters (json)
 * Valid POST parameters are:
 *  - username
 *  - password
 *  - qsk
 *
 * @return array with 'ok' set to true/false and 'data' set
 *         to error message or json data
 */
function checkInput() {
    $error = false;

    // get json data sent by client
    $json_data = file_get_contents('php://input');
    $json_data = sanitize($json_data);
    $json_data = json_decode($json_data, true);

    if ( ! isset($json_data['params'])) {
        return array(
            'data' => "invalid parameters"
        );
    }

    $json_data = $json_data['params'];

    if ( ! isset($json_data['qsk'])) {
        return array(
            'statusCode' => 400,
            'data' => "no key"
        );
    }
    if ( ! isset($json_data['username'])) {
        return array(
            'statusCode' => 400,
            'data' => "no username"
        );
    }
    if ( empty($json_data['username'])) {
        return array(
            'statusCode' => 400,
            'data' => "no username"
        );
    }
    if ( ! isset($json_data['password'])) {
        return array(
            'statusCode' => 400,
            'data' => "no password"
        );
    }
    if ( empty($json_data['password'])) {
        return array(
            'statusCode' => 400,
            'data' => "no password"
        );
    }

    // check secret key here
    if ($json_data['qsk'] == convertqsk()) {
        return array(
            'statusCode' => 200,
            'data' => $json_data
        );
    } else {
        return array(
            'statusCode' => 400,
            'data' => "invalid key"
        );
    }
}

/**
 * Cleans input data by removing harmful characters
 *
 * @param  value
 * @return cleaned value
 */
function cleanInput($input) {
    $search = array(
        '@<script[^>]*?>.*?</script>@si',   // Strip out javascript
        '@<[\/\!]*?[^<>]*?>@si',            // Strip out HTML tags
        '@<style[^>]*?>.*?</style>@siU',    // Strip style tags properly
        '@<![\s\S]*?--[ \t\n\r]*>@'         // Strip multi-line comments
    );

    $output = preg_replace($search, '', $input);
    return $output;
}

/**
 * Sanitizes user input for safe insersion into MySQL
 *
 * @param  array or value
 * @return array or value depending on input
 */
function sanitize($input) {
    if (is_array($input)) {
        foreach ($input as $var=>$val) {
            $output[$var] = sanitize($val);
        }
    } else {
        if (get_magic_quotes_gpc()) {
            $input = stripslashes($input);
        }
        $output = cleanInput($input);
    }
    return $output;
}
