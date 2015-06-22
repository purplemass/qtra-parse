<?PHP

/**
 * Validate user
 *
 *  Access the database with username/password to return array:
 *  - for valid users:
 *    - 'statusCode' set to 200
 *    - 'data' set to expiray-date (YYYY-MM-DD):
 *       e.g. array('statusCode' => true, 'data => "2016-01-01")
 *  - for invalid users:
 *    - 'statusCode' set to 401 (Unauthorized) or 403 (Forbidden)
 *    - 'data' set to an error message:
 *       e.g. array('statusCode' => 401, 'data => "password is incorrect")
 *
 *  Invalid users when:
 *     - username doesn't exist in the database (401)
 *     - password is incorrect (401)
 *     - user is a member but has not paid to use the QTRA calculaor (403)
 *
 *  Note1: If a user's expiry-date is in the past, return the result
 *  as normal with the correct expiry-date. The code on the other end
 *  will log the user out and display appropriate error messages
 *
 *  Note2: Use mysql_real_escape_string when needed
 *
 * @param  String username
 * @param  String password
 * @return array
 */
function validateUser($username, $password) {
    /*********************************************************************
     * BELOW IS A MOCK-UP OF USER VALIDATION FOR TESTING
     * REPLACE THE CODE BELOW WITH YOUR CODE TO ACCESS THE DATABASE
     *********************************************************************/
    $mock_database = array(
        // valid user - plenty of time
        array(
            'user' => 'oliver',
            'password' => 'oliver',
            'can_access_calculator' => true,
            'expirydate' => '2016-01-01'
        ),
        // valid user - limited time
        array(
            'user' => 'bob',
            'password' => 'bob',
            'can_access_calculator' => true,
            'expirydate' => '2015-07-30'
        ),
        // invalid user - expired already
        array(
            'user' => 'expired',
            'password' => 'expired',
            'can_access_calculator' => true,
            'expirydate' => '2015-01-01'
        ),
        // invalid user - should not have access
        array(
            'user' => 'invalid',
            'password' => 'invalid',
            'can_access_calculator' => false,
            'expirydate' => '2017-01-01'
        ),
    );

    foreach ($mock_database as $record_in_db) {
        if ($record_in_db['user'] == $username AND
                $record_in_db['password'] == $password) {

            if ($record_in_db['can_access_calculator']) {
                return array(
                    'statusCode' => 200,
                    'data' => $record_in_db['expirydate']
                );
            } else {
                return array(
                    'statusCode' => 403,
                    'data' => "no access allowed"
                );
            }
        }
    }

    return array(
        'statusCode' => 401,
        'data' => "incorrect username or password"
    );
}
