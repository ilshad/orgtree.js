/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.api
 */

var orgtree = (function (orgtree) {

    function path(id, callback) {
	orgtree.xhr.GET({
	    url: '/resources/entries/' + id + '/path',
	    callback: function (r) {
		callback(JSON.parse(r));
	    }
	});
    }

    function getEntry(id, callback) {
	orgtree.xhr.GET({
	    url: '/resources/entries/' + id,
	    callback: function (r) {
		callback(JSON.parse(r));
	    }
	});
    }

    function getEntries(parentId, callback) {
	orgtree.xhr.GET({
	    url: '/resources/entries?parent=' + parentId,
	    callback: function (r) {
		callback(JSON.parse(r));
	    }
	});
    }

    function insertEntry(content, prevId, parentId, callback) {
	orgtree.xhr.POST({
	    url: '/resources/entries',
	    body: 'content=' + content + '&previous=' + prevId + '&parent=' + parentId,
	    callback: function (r) {
		callback(JSON.parse(r));
	    }
	});
    }

    function updateEntryContent(id, content, callback) {
	orgtree.xhr.PUT({
	    url: '/resources/entries/' + id + '/content',
	    body: content,
	    callback: function (r) {
		callback(JSON.parse(r));
	    }
	});
    }

    function updateEntryPrevious(id, previousId, callback) {
	orgtree.xhr.PUT({
	    url: '/resources/entries/' + id + '/previous',
	    body: previousId,
	    callback: function (r) {
		callback(JSON.parse(r));
	    }
	});
    }

    function updateEntryParent(id, parentId, callback) {
	orgtree.xhr.PUT({
	    url: '/resources/entries/' + id + '/parent',
	    body: parentId,
	    callback: function (r) {
		callback(JSON.parse(r));
	    }
	});
    }

    function trashEntry(id, callback) {
	orgtree.xhr.DELETE({
	    url: '/resources/entries/' + id,
	    callback: callback
	});
    }

    function restoreFromTrash(id, callback) {
	orgtree.xhr.DELETE({
    url: '/resources/trash/' + id,
	    callback: callback
	});
    }

    function getTrash(callback) {	
	orgtree.xhr.GET({
	    url: '/resources/trash',
	    callback: function (r) {
		callback(JSON.parse(r));
	    }
	});
    }

    function makeProject(id) {
	orgtree.xhr.PUT({
	    url: '/resources/entries/' + el.dataset.id + '/project',
	    body: 'create=true',
	    callback: function (r) {
		var res = JSON.parse(r);
	    }
	});
    }

    function addScript(entryid, title, source, callback) {
	orgtree.xhr.POST({
	    url: '/resources/scripts',
	    body: 'entryid=' + entryid + '&title=' + title + '&source=' + source,
	    status: 204,
	    callback: callback
	});
    }

    function getScriptSource(id, callback) {
	orgtree.xhr.GET({
	    url: '/resources/scripts/' + id + '/source',
	    callback: function (source) {
		callback(source);
	    }
	});
    }

    function putScriptSource(id, source) {
	orgtree.xhr.PUT({
	    url: '/resources/scripts/' + id + '/source',
	    body: source,
	    status: 204
	});
    }

    function putScriptTitle(id, title, callback) {
	orgtree.xhr.PUT({
	    url: '/resources/scripts/' + id + '/title',
	    body: title,
	    status: 204,
	    callback: function () {
		callback();
	    }
	});
    }

    function getScriptLogs(id, callback) {
	orgtree.xhr.GET({
	    url: '/resources/scripts/' + id + '/logs',
	    callback: function (r) {
		callback(JSON.parse(r));
	    }
	});
    }

    function runScript(id, callback) {
	orgtree.xhr.POST({
	    url: '/resources/scripts/' + id,
	    callback: function (r) {
		callback(JSON.parse(r));
	    }
	});
    }

    function delScript(id, callback) {
	orgtree.xhr.DELETE({
	    url: '/resources/scripts/' + id,
	    callback: callback
	});
    }

    orgtree.api = {
	path: path,
	getEntry: getEntry,
	getEntries: getEntries,
	insertEntry: insertEntry,
	updateEntryContent: updateEntryContent,
	updateEntryPrevious: updateEntryPrevious,
	updateEntryParent: updateEntryParent,
	trashEntry: trashEntry,
	restoreFromTrash: restoreFromTrash,
	getTrash: getTrash,
	makeProject: makeProject,
	addScript: addScript,
	getScriptSource: getScriptSource,
	putScriptSource: putScriptSource,
	putScriptTitle: putScriptTitle,
	getScriptLogs: getScriptLogs,
	runScript: runScript,
	delScript: delScript
    };

    return orgtree;
}(orgtree || {}));
