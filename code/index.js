let server = require('./Server');
let router = require('./router');
let requestHandler = require('./requestHandler');

const mariadb = require('./Database/connect/mariadb');
// mariadb.connect();

server.start(router.route, requestHandler.handle); 