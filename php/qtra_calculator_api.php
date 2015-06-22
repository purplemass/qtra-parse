<?PHP

// QTRA_SECRET_KEY/DEBUG should be in a separate file not in the root of
// the webserver and included here instead as follows:
// require_once("../inc/qtra_calculator_api_config.php");

define("QTRA_SECRET_KEY", "hcd30l8#t8b)o57tyuo417!ullc5g60c!%s+my0pY7e)fvy=br");
define("DEBUG", true); // set this to false in production

//-----------------------------------------------------------------------------

/**
 * Validate user
 *
 * @param  String username
 * @param  String password
 * @return false for invalid users
 * @return expiray-date of user in an array e.g. array('expirydate' => '2020-01-01')
 */
function validateUser($username, $password) {
    // access database with $username/$password to return:
    // - expiray-date for valid users as an array: array('expirydate' =>'YYYY-MM-DD')
    // - false if users are not valid which is returned if:
    //   - username doesn't exist in the database
    //   - password is incorrect
    //   - password or username are empty (this is caught above)
    //
    // note: if a user's expirydate is in the past, return the result
    // as normal with the corrcet expirydate, the client will log the
    // user out and display error messages
    //
    // note2: use mysql_real_escape_string when needed

    /*********************************************************************
     * BELOW IS A MOCK-UP OF USER VALIDATION FOR TESTING
     * REPLACE THE CODE BELOW WITH YOUR CODE TO ACCESS THE DATABASE
     *********************************************************************/
    $mock_database = array(
        // valid user - plenty of time
        array(
            'user' => 'oliver',
            'password' => 'oliver',
            'expirydate' => '2016-01-01'
        ),
        // valid user - limited time
        array(
            'user' => 'bob',
            'password' => 'bob',
            'expirydate' => '2015-07-30'
        ),
        // valid user - expired already
        array(
            'user' => 'test',
            'password' => 'test',
            'expirydate' => '2015-05-01'
        ),
    );

    foreach ($mock_database as $record_in_db) {
        if ($record_in_db['user'] == $username AND $record_in_db['password'] == $password) {
            return array(
                'success' => true,
                'data' => $record_in_db['expirydate']
            );
        }
    }

    return array(
        'success' => false,
        'data' => "couldn't log in"
    );
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
    if ($response['success'] !== false) {
        $response = validateUser($response['data']['username'], $response['data']['password']);
        // add QSK to the output
        if ($response['success'] !== false) {
            $response = array_merge(
                array('success' => true, 'qsk' => convertQSK()),
                array('data' => $response['data'])
            );
        }
    }

    writeJSON($response);
}

/**
 * Returns json to client
 *
 * @param  String username
 */
function writeJSON($response) {
    if ( ! DEBUG AND $response['success'] === false) {
        $response['data'] = 'error message suppressed';
    }

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
    $error = false;

    // get json data sent by client
    $json_data = file_get_contents('php://input');
    $json_data = sanitize($json_data);
    $json_data = json_decode($json_data, true);

    if ( ! isset($json_data['params'])) return array('success' => false, 'data' => "invalid parameters");

    $json_data = $json_data['params'];

    if ( ! isset($json_data['qsk'])) return array('success' => false, 'data' => "no key");
    if ( ! isset($json_data['username'])) return array('success' => false, 'data' => "no username");
    if ( empty($json_data['username'])) return array('success' => false, 'data' => "no username");
    if ( ! isset($json_data['password'])) return array('success' => false, 'data' => "no password");
    if ( empty($json_data['password'])) return array('success' => false, 'data' => "no password");

    // check secret key here
    if ($json_data['qsk'] == convertqsk()) {
        return array('success' => true, 'data' => $json_data);
    } else {
        return array('success' => false, 'data' => "invalid key");
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
        $output  = cleanInput($input);
    }
    return $output;
}
