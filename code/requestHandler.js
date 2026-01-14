const fs = require('fs');
const querystring = require('querystring');

// HTML 파일 읽기
let login_view, signup_view, matches_view, match_detail_view, bookinglist_view, main_view, concerts_view;

try { login_view = fs.readFileSync('./login.html','utf-8'); } catch(e) { console.error('login.html 로드 실패'); }
try { signup_view = fs.readFileSync('./signup.html','utf-8'); } catch(e) { console.error('signup.html 로드 실패'); }
try { matches_view = fs.readFileSync('./matches.html','utf-8'); } catch(e) { console.error('matches.html 로드 실패'); }
try { match_detail_view = fs.readFileSync('./match_detail.html','utf-8'); } catch(e) { console.error('match_detail.html 로드 실패'); }
try { bookinglist_view = fs.readFileSync('./match_bookinglist.html','utf-8'); } catch(e) { console.error('match_bookinglist.html 로드 실패'); }
try { main_view = fs.readFileSync('./main.html','utf-8'); } catch(e) { console.error('main.html 로드 실패'); }
try { concerts_view = fs.readFileSync('./concerts.html','utf-8'); } catch(e) { console.error('concerts.html 로드 실패'); }

const mariadb = require('./Database/connect/mariadb');

// ========== 로그인 상태 관리 ==========
let loggedInUser = null;

// 메인 페이지 (포트폴리오)
function main(response) {
    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    response.write(main_view);
    response.end();
}

// 로그인 페이지
function login(response) {
    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    response.write(login_view);
    response.end();
}

// 로그인 처리
function loginProcess(response, body) {
    const params = querystring.parse(body);
    const email = params.email;
    const password = params.password;

    mariadb.query("SELECT * FROM users WHERE email = ? AND password = ?", 
        [email, password], 
        function(err, rows) {
            if (err) {
                console.error(err);
                response.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                response.write('<script>alert("로그인 중 오류가 발생했습니다."); history.back();</script>');
                response.end();
                return;
            }

            if (rows.length > 0) {
                loggedInUser = rows[0];
                console.log('로그인 성공:', loggedInUser.name);
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write('<script>alert("로그인 성공!"); location.href="/";</script>');
            } else {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write('<script>alert("이메일 또는 비밀번호가 잘못되었습니다."); history.back();</script>');
            }
            response.end();
        }
    );
}

// 로그아웃 처리
function logout(response) {
    loggedInUser = null;
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.write('<script>alert("로그아웃 되었습니다."); location.href="/";</script>');
    response.end();
}

// 회원가입 페이지
function signup(response) {
    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    response.write(signup_view);
    response.end();
}

// 회원가입 처리
function signupProcess(response, body) {
    const params = querystring.parse(body);
    const name = params.name;
    const email = params.email;
    const password = params.password;
    const password_confirm = params.password_confirm;

    if (password !== password_confirm) {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.write('<script>alert("비밀번호가 일치하지 않습니다."); history.back();</script>');
        response.end();
        return;
    }

    mariadb.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
        [name, email, password], 
        function(err, result) {
            if (err) {
                console.error(err);
                response.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                response.write('<script>alert("회원가입 중 오류가 발생했습니다."); history.back();</script>');
                response.end();
                return;
            }

            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.write('<script>alert("회원가입이 완료되었습니다!"); location.href="/login";</script>');
            response.end();
        }
    );
}

// 축구 경기 목록 페이지
function matches(response) {
    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    let html = matches_view;
    
    // 로그인 상태에 따라 버튼 변경
    if (loggedInUser) {
        html = html.replace(
            `<button class="check-btn inactive" onclick="location.href='/login'">로그인</button>`,
            `<span style="margin-right: 10px; font-weight: bold; color: #333;">${loggedInUser.name}님</span><button class="check-btn inactive" onclick="location.href='/logout'">로그아웃</button>`
        );
    }
    
    response.write(html);
    response.end();
}

// 경기 상세 페이지
function matchDetail(response, matchId) {
    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    mariadb.query("SELECT * FROM matches WHERE id = ?", [matchId], 
        function(err, rows) {
            if (err) {
                console.error(err);
            }
            response.write(match_detail_view);
            response.end();
        }
    );
}

// 예매 처리
function bookMatch(response, body) {
    if (!loggedInUser) {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.write('<script>alert("로그인이 필요합니다!"); location.href="/login";</script>');
        response.end();
        return;
    }
    
    const params = querystring.parse(body);
    const matchId = params.matchId;
    const quantity = parseInt(params.quantity);
    const userId = loggedInUser.id;

    mariadb.query(
        "SELECT price FROM matches WHERE id = ?", 
        [matchId], 
        function(err, rows) {
            if (err || rows.length === 0) {
                console.error(err);
                response.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                response.write('<script>alert("경기 정보를 찾을 수 없습니다."); history.back();</script>');
                response.end();
                return;
            }

            const totalPrice = rows[0].price * quantity;
            const bookingDate = new Date().toISOString().slice(0, 10);

            mariadb.query(
                "INSERT INTO match_bookings (user_id, match_id, quantity, total_price, booking_date) VALUES (?, ?, ?, ?, ?)", 
                [userId, matchId, quantity, totalPrice, bookingDate], 
                function(err, result) {
                    if (err) {
                        console.error(err);
                        response.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                        response.write('<script>alert("예매 중 오류가 발생했습니다."); history.back();</script>');
                        response.end();
                        return;
                    }

                    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    response.write('<script>alert("예매가 완료되었습니다!"); location.href="/matches";</script>');
                    response.end();
                }
            );
        }
    );
}

// 예매 내역 페이지
function bookinglist(response) {
    if (!loggedInUser) {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.write('<script>alert("로그인이 필요합니다!"); location.href="/login";</script>');
        response.end();
        return;
    }
    
    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    mariadb.query(`
        SELECT 
            b.id,
            m.name as match_name,
            b.booking_date,
            b.quantity,
            b.total_price,
            u.name as user_name,
            u.email as user_email
        FROM match_bookings b
        JOIN matches m ON b.match_id = m.id
        JOIN users u ON b.user_id = u.id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
    `, [loggedInUser.id], function(err, rows) {
        if (err) {
            console.error(err);
            response.write(bookinglist_view);
            response.end();
            return;
        }
        
        let tableRows = '';
        let totalQuantity = 0;
        let totalPrice = 0;
        let userInfo = `${loggedInUser.name}<br>${loggedInUser.email}`;
        
        if (rows.length > 0) {
            rows.forEach(booking => {
                tableRows += `
                    <tr>
                        <td>${booking.id}</td>
                        <td>${booking.match_name}</td>
                        <td>${booking.booking_date}</td>
                        <td>${booking.quantity}장</td>
                        <td>${booking.total_price.toLocaleString()}원</td>
                    </tr>
                `;
                totalQuantity += booking.quantity;
                totalPrice += booking.total_price;
            });
        } else {
            tableRows = '<tr><td colspan="5" class="no-data">예매 내역이 없습니다.</td></tr>';
        }
        
        let html = bookinglist_view;
        
        html = html.replace(
            '<tbody id="bookingList">',
            `<tbody id="bookingList">${tableRows}`
        );
        
        html = html.replace(
            '<div class="summary-value" style="font-size: 16px;" id="userInfo">-</div>',
            `<div class="summary-value" style="font-size: 16px;" id="userInfo">${userInfo}</div>`
        );
        
        html = html.replace(
            '<div class="summary-value" id="totalQuantity">0장</div>',
            `<div class="summary-value" id="totalQuantity">${totalQuantity}장</div>`
        );
        
        html = html.replace(
            '<div class="summary-value" id="totalPrice">0원</div>',
            `<div class="summary-value" id="totalPrice">${totalPrice.toLocaleString()}원</div>`
        );
        
        response.write(html);
        response.end();
    });
}

// 공연 예매 페이지
function concerts(response) {
    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    response.write(concerts_view);
    response.end();
}

function concertImage(response) {
    fs.readFile('./img/concert.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

function publicLibraryImage(response) {
    fs.readFile('./img/public-library.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

function soccerImage(response) {
    fs.readFile('./img/soccer.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

// 축구 경기 이미지들
function match1Image(response) {
    fs.readFile('./img/match1.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

function match2Image(response) {
    fs.readFile('./img/match2.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

function match3Image(response) {
    fs.readFile('./img/match3.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

function match4Image(response) {
    fs.readFile('./img/match4.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

// 공연 이미지들
function orchestraImage(response) {
    fs.readFile('./img/orchestra.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

function musicalImage(response) {
    fs.readFile('./img/musical.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

function jazzImage(response) {
    fs.readFile('./img/jazz.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

function balletImage(response) {
    fs.readFile('./img/ballet.jpg', function(err, data) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.write(data);
        response.end();
    });
}

// 핸들러 매핑
let handles = {};
handles['/'] = main;
handles['/login'] = login;
handles['/loginProcess'] = loginProcess;
handles['/logout'] = logout;
handles['/signup'] = signup;
handles['/signupProcess'] = signupProcess;
handles['/matches'] = matches;
handles['/match'] = matchDetail;
handles['/bookMatch'] = bookMatch;
handles['/bookinglist'] = bookinglist;
handles['/concerts'] = concerts;

// 이미지
handles['/img/concert.jpg'] = concertImage;
handles['/img/public-library.jpg'] = publicLibraryImage;
handles['/img/soccer.jpg'] = soccerImage;
handles['/img/match1.jpg'] = match1Image;
handles['/img/match2.jpg'] = match2Image;
handles['/img/match3.jpg'] = match3Image;
handles['/img/match4.jpg'] = match4Image;
handles['/img/match4.png'] = match4Image;
handles['/img/orchestra.jpg'] = orchestraImage;
handles['/img/musical.jpg'] = musicalImage;
handles['/img/jazz.jpg'] = jazzImage;
handles['/img/ballet.jpg'] = balletImage;

exports.handle = handles;