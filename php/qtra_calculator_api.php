<?PHP

// this should be in a separate file not in the root of the webserver
// and included here instead:
// require_once("../inc/qtra_calculator_api_config.php");
define("QTRA_SECRET_KEY", "hcd30l8#t8b)o57tyuo417!ullc5g60c!%s+my0pY7e)fvy=br");

/**
 * Validate user
 *
 * param  json data consisting of username/password
 * return false for invalid users
 * return expiray-date of user in an array e.g. array('expiry-date' => '2020-01-01')
 */
function validateUser($json_data) {
    $username = $json_data['username'];
    $password = $json_data['password'];
    
    // access database with$username/$password to
    // get expiray-date for valid user
    // or return false if user is not valid
    //
    if ($username != $password) return false;
    if ($username == 'bob') {
        $ret = array('expiry-date' => '2015-12-22');
    } else if ($username == 'oliver') {
        $ret = array('expiry-date' => '2020-01-01');
    } else {
        $ret = false;
    }
    
    return $ret;
}

/*********************************************************************
 * DO NOT CHANGE ANYTHING BELOW
 *********************************************************************/

runApp();

/**
 * Runs this app
 *
 * exists the reponse returned by the other parts of the app as json
 */
function runApp() {
    $response = checkInput();
    
    if ($response !== false) {
        $response = validateUser($response);
        // add QSK to the output
        if ($response !== false) {
            $response = array_merge(array('qsk' => convertQSK()), $response);
        }
    }
    
    // return json to client
    $response = array('success' => $response);
    header('Content-type: application/json');
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
 * @return array of parameters for valid POST parameters
 * @return false for invalid POST parameters
 */
function checkInput() {
    // get json data sent by client
    $json_data = json_decode(file_get_contents('php://input'), true);
    
    if ( ! isset($json_data['params'])) return false;
    
    $json_data = $json_data['params'];

    if ( ! isset($json_data['qsk'])) return false;
    if ( ! isset($json_data['username'])) return false;
    if ( ! isset($json_data['password'])) return false;
    
    // check secret key here
    if ($json_data['qsk'] == convertqsk()) {
        $ret = $json_data;
    } else {
        $ret = false;
    }
    
    return $ret;
}
