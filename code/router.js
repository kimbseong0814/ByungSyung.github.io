function route(pathname, handle, response, paramId, body) {
  // 이미지 요청은 로그 생략
  const isImageRequest = pathname.startsWith('/img/');
  
  if (!isImageRequest) {
    console.log('요청:', pathname);
  }

  if (typeof handle[pathname] === 'function') {
    if (body !== undefined) {
      handle[pathname](response, body);  
    } else {
      handle[pathname](response, paramId);  
    }
  } else {
    console.log('404 - 페이지 없음:', pathname);
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.write('찾으시는 페이지가 없습니다.');
    response.end();
  }
}

exports.route = route;