<?PHP

/**
 * Validate user
 *  access the database with username/password to return array:
 *  - for valid users:
 *    - 'success' set to true
 *    - 'data' set to expiray-date (YYYY-MM-DD):
 *       e.g. array('success' => true, 'data => "2016-01-01")
 *  - for invalid users:
 *    - 'success' set to false
 *    - 'data' set to an error message:
 *       e.g. array('success' => false, 'data => "user doesn't exist")
 *
 *  Invalid users when:
 *     - username doesn't exist in the database
 *     - password is incorrect
 *     - password or username are empty (this is caught above)
 *
 *  note: if a user's expiry-date is in the past, return the result
 *  as normal with the correct expiry-date, the code on the other end
 *  will log the user out and display appropriate error messages
 *
 *  use mysql_real_escape_string when needed
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
