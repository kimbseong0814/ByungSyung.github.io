const mysql = require('mysql2');  

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',  
    database: 'portfolio_db',
    port: 3306
});

connection.connect(function(err) {
    if (err) {
        console.error('MySQL 연결 실패:', err.message);
        console.error('에러 코드:', err.code);
        return;
    }
    console.log('MySQL 연결 성공!');
});

connection.on('error', function(err) {
    console.error('MySQL 에러:', err);
});

module.exports = connection;