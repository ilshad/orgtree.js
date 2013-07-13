/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.script
 */

var orgtree = (function (orgtree) {

    function entryScriptsDialog(entryid, onready) {
	orgtree.dialog.ajaxDialog({
	    url: '/resources/entries/' + entryid + '/scripts',
	    onready: onready
	});
    }

    function showForm(el) {
	var id = el.dataset.id,
	    titleValue = el.innerHTML,
	    titleCont = document.getElementById('script-form-title-cont'),
	    titleElement = document.getElementById('script-form-title'),
	    form = document.getElementById('script-form-fieldset'),
	    listing = document.getElementById('scripts-listing'),
	    close = document.getElementById('script-form-fieldset-close'),
	    textarea = document.getElementById('script-form-textarea'),
	    save = document.getElementById('script-form-save'),
	    logs = document.getElementById('script-form-logs'),
	    run = document.getElementById('script-form-run'),
	    del = document.getElementById('script-form-delete');

	function hide() {
	    form.style.display = 'none';
	    listing.style.display = '';
	}

	function show() {
	    form.style.display = '';
	    listing.style.display = 'none';
	}

	function updateTitle() {
	    titleElement.innerHTML = titleValue;
	    el.innerHTML = titleValue;
	}

	orgtree.api.getScriptSource(id, function (source) {
	    textarea.value = source;
	});

	save.onclick = function () {
	    orgtree.api.putScriptSource(id, textarea.value);
	    return false;
	}

	logs.onclick = function () {
	    showLogs(el.parentNode.nextElementSibling.firstElementChild, true);
	    return false;
	}

	run.onclick = function () {
	    orgtree.api.runScript(id, showRunLog);
	    return false;
	}

	del.onclick = function () {
	    orgtree.api.delScript(id, function () {
		entryScriptsDialog(del.dataset.entryid);
	    });
	    return false;
	}

	titleElement.onclick = function () {
	    var input = document.createElement('input');

	    input.type = 'text';
	    input.className = 'script-form-title';
	    input.value = titleValue;

	    titleCont.innerHTML = '';
	    titleCont.appendChild(input);

	    var updated = false;

	    function change() {
		if (!updated) {
		    updated = true;
		    titleValue = input.value;
		    orgtree.api.putScriptTitle(id, titleValue, function () {
			titleCont.innerHTML = '';
			titleCont.appendChild(titleElement);
			updateTitle();
		    });
		}
	    }

	    input.focus();
	    input.onblur = change;
	    input.onchange = change;
	}

	close.onclick = function () {
	    hide();
	    return false;
	}

	// main
	show();
	updateTitle();
    }

    function showLogs(el, openFormWhenClose) {
	var id = el.dataset.id,
	    fieldset = document.getElementById('script-logs-fieldset'),
	    logs = document.getElementById('script-logs'),
	    listing = document.getElementById('scripts-listing'),
	    close = document.getElementById('script-logs-fieldset-close'),
	    scriptForm = document.getElementById('script-form-fieldset');

	function show() {
	    fieldset.style.display = '';
	    if (openFormWhenClose) {
		scriptForm.style.display = 'none';
	    } else {
		listing.style.display = 'none';
	    }
	}

	function hide() {
	    fieldset.style.display = 'none';
	    if (openFormWhenClose) {
		scriptForm.style.display = '';
	    } else {
		listing.style.display = '';
	    }
	    logs.innerHTML = '';
	}

	function logRow(item) {
	    var el = document.createElement('div');
	    el.className = 'log-item' + (item.error ? ' log-error' : '');
	    el.innerHTML = item.date + ' | ' + item.message;
	    return el;
	}

	function update() {
	    orgtree.api.getScriptLogs(id, function (data) {
		var r = data.logs;
		r.reverse();
		while (r.length > 0) {
		    logs.appendChild(logRow(r.pop()));
		}
	    });
	}

	close.onclick = function () {
	    hide();
	    return false;
	}

	// main
	show();
	update();
    }

    function showRunLog(data) {
	var fieldset = document.getElementById('script-run-log-fieldset'),
	    log = document.getElementById('script-run-log'),
	    close = document.getElementById('script-run-log-fieldset-close'),
	    scriptForm = document.getElementById('script-form-fieldset');

	function show() {
	    fieldset.style.display = '';
	    scriptForm.style.display = 'none';
	}

	function hide() {
	    fieldset.style.display = 'none';
	    scriptForm.style.display = '';
	    log.innerHTML = '';
	}

	function update() {
	    var el = document.createElement('div');
	    el.className = 'log-item' + (data.error ? ' log-error' : '');
	    el.innerHTML = data.message;
	    log.appendChild(el);
	}

	close.onclick = function () {
	    hide();
	    return false;
	}

	// main
	show();
	update();
    }

    function add(entryid) {
	var cont = document.getElementById('add-script-cont'),
	    action = document.getElementById('add-script-action'),
	    input = document.getElementById('add-script-title');

	function show() {
	    action.style.display = 'none';
	    input.style.display = '';
	    input.focus();
	}

	function hide() {
	    action.style.display = '';
	    input.style.display = 'none';
	    input.value = '';
	}

	var updated = false;

	function change() {
	    if (!updated) {
		if (input.value.trim()) {
		    updated = true;
		    orgtree.api.addScript(entryid, input.value, '', function () {
			hide();
			entryScriptsDialog(entryid);
		    });
		} else {
		    hide();
		}
	    }
	}
	
	input.onblur = change;
	input.onchange = change;

	// main
	show();
    }

    function overview() {
	orgtree.dialog.ajaxDialog({
	    url: '/scripts',
	    onclose: function () {
		orgtree.dialog.ajaxDialog({
		    url:'/dashboard.ajax'
		});
		return false;
	    }
	});
    }

    function find(scriptid, entryid) {
	window.location = '/#entry:' + entryid;
	orgtree.router.route();
	entryScriptsDialog(entryid, function () {
	    var el = document.getElementById('show-script-form-' + scriptid);
	    el.click();
	});
    }

    orgtree.script = {
	entryScriptsDialog: entryScriptsDialog,
	showForm: showForm,
	showLogs: showLogs,
	add: add,
	overview: overview,
	find: find
    }

    return orgtree;
}(orgtree || {}));
