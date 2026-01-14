let http = require('http');
let url = require('url');

let server;

function start(route, handle) {

    function onRequest(request, response) {
        let pathname = url.parse(request.url).pathname;
        let queryData = url.parse(request.url, true).query;
        
        // POST 요청 처리
        if (request.method === 'POST') {
            let body = '';
            
            request.on('data', function(data) {
                body += data;
            });
            
            request.on('end', function() {
                // POST 요청인 경우 body 데이터 전달
                if (pathname === '/login') {
                    route('/loginProcess', handle, response, null, body);
                } else if (pathname === '/signup') {
                    route('/signupProcess', handle, response, null, body);
                } else if (pathname === '/bookMatch') {
                    route('/bookMatch', handle, response, null, body);
                } else {
                    route(pathname, handle, response, queryData.productId || queryData.matchId, body);
                }
            });
        } else {
            // GET 요청 처리
            route(pathname, handle, response, queryData.productId || queryData.matchId);
        }
    }

    server = http.createServer(onRequest);
    server.listen(8888);
    console.log('======================================');
    console.log('축구 경기 예매 서버 시작!');
    console.log('포트: 8888');
    console.log('http://localhost:8888');
    console.log('======================================');
}

// Ctrl+C (SIGINT) 감지
process.on('SIGINT', function() {
    console.log('\n\n======================================');
    console.log('서버를 종료합니다...');
    console.log('브라우저 창을 직접 닫아주세요!');
    console.log('======================================');
    
    server.close(function() {
        console.log('서버가 완전히 종료되었습니다.');
        process.exit(0);
    });
    
    // 3초 후 강제 종료 (연결이 끊기지 않는 경우를 위해)
    setTimeout(function() {
        console.log('강제 종료합니다.');
        process.exit(0);
    }, 3000);
});

exports.start = start;