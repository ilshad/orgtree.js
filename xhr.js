/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.xhr
 */

var orgtree = (function (orgtree) {

    function XHR() {
	return new XMLHttpRequest();
    }

    function GET(data) {
	var url = data.url,
	    callback = data.callback;
	var xhr = XHR();
	orgtree.util.spinner(true);
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function () {
	    if (xhr.readyState == 4 && xhr.status == 200) {
		callback(xhr.responseText);
		orgtree.util.spinner(false);
	    }
	}
	xhr.send();
    }

    function PUT(data) {
	var url = data.url,
	    body = data.body,
	    contentType = data.contentType || 'text/plain;charset=UTF-8',
	    status = data.status || 200,
	    callback = data.callback || function () {};
	var xhr = XHR();
	xhr.open('PUT', url, true);
	xhr.setRequestHeader('content-type', contentType);
	xhr.onreadystatechange = function () {
	    if (xhr.readyState == 1) {
		orgtree.util.spinner(true);
	    } else if (xhr.readyState == 4 && xhr.status == status) {
		callback(xhr.responseText);
		orgtree.util.spinner(false);
	    }
	}
	xhr.send(body);
    }

    function POST(data) {
	var url = data.url,
	    body = data.body || '',
	    contentType = data.contentType || 'application/x-www-form-urlencoded;charset=UTF-8',
	    status = data.status || 200,
	    callback = data.callback || function () {};
	var xhr = XHR();
	orgtree.util.spinner(true);
	xhr.open('POST', url, true);
	xhr.setRequestHeader('content-type', contentType);
	xhr.onreadystatechange = function () {
	    if (xhr.readyState == 4 && xhr.status == status) {
		callback(xhr.responseText);
		orgtree.util.spinner(false);
	    }
	}
	xhr.send(body);
    }

    function DELETE(data) {
	var url = data.url,
	    callback = data.callback || function () {};
	var xhr = XHR();
	orgtree.util.spinner(true);
	xhr.open('DELETE', url, true);
	xhr.onreadystatechange = function () {
	    if (xhr.readyState == 4 && xhr.status == 204) {
		callback();
		orgtree.util.spinner(false);
	    }
	}
	xhr.send();
    }

    orgtree.xhr = {
	GET: GET,
	PUT: PUT,
	POST: POST,
	DELETE: DELETE
    }

    return orgtree;
}(orgtree || {}));
