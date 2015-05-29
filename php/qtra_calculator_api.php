<?PHP

// QTRA_SECRET_KEY should be in a separate file not in the root of
// the webserver and included here instead as follows:
// require_once("../inc/qtra_calculator_api_config.php");

define("QTRA_SECRET_KEY", "hcd30l8#t8b)o57tyuo417!ullc5g60c!%s+my0pY7e)fvy=br");

/**
 * Validate user
 *
 * param  String username
 * param  String password
 * return false for invalid users
 * return expiray-date of user in an array e.g. array('expiry-date' => '2020-01-01')
 */
function validateUser($username, $password) {
    if (empty($username) OR empty($password)) return false;

    // access database with $username/$password to return:
    // - expiray-date for valid users as an array: array('expiry-date' =>'YYYY-MM-DD')
    // - false if users are not valid which is returned if:
    //   - username doesn't exist in the database
    //   - password is incorrect
    //   - password or username are empty (this is caught above)
    //
    // note: if a user's expiry-date is in the past, return the result
    // as normal with the corrcet expiry-date, the client will log the
    // user out and display error messages

    /*********************************************************************
     * BELOW IS A MOCK-UP OF USER VALIDATION FOR TESTING
     * REPLACE THE CODE BELOW WITH YOUR CODE TO ACCESS THE DATABASE
     *********************************************************************/
    $mock_database = array(
        // valid user - plenty of time
        array(
            'user' => 'oliver',
            'password' => 'oliver',
            'expiry-date' => '2016-01-01'
        ),
        // valid user - limited time
        array(
            'user' => 'bob',
            'password' => 'bob',
            'expiry-date' => '2015-06-30'
        ),
        // valid user - expired already
        array(
            'user' => 'pop',
            'password' => 'pop',
            'expiry-date' => '2015-05-01'
        ),
    );

    foreach ($mock_database as $record_in_db) {
        if ($record_in_db['user'] == $username AND $record_in_db['password'] == $password) {
            return array('expiry-date' => $record_in_db['expiry-date']);
        }
    }

    return false;
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
        $response = validateUser($response['username'], $response['password']);
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
