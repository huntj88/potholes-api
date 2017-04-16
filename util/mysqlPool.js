var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'potholes',
    password: 'Q7OR0YLQmhjVWcim',
    database: 'potholes'
});

module.exports =
    {

        getConnection: function (callback) {
            pool.getConnection(function (err, conn) {
                if (err) {
                    console.log("Error is in mysqlPool");
                    return callback(err);
                }
                callback(err, conn);
            });
        }
    };
/**
 * Created by James on 4/12/2017.
 */
