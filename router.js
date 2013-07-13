/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.router
 */

var orgtree = (function (orgtree) {

    function route() {
	var h = window.location.hash,
	    aa = h.slice(1, h.length).split(':');
	aa.reverse();
	switch (aa.pop()) {
	case 'entry':
	    orgtree.api.path(aa.pop(), walk);
	    break;
	case 'jump':
	    orgtree.api.path(aa.pop(), function (path) {
		walk(path, function (col, entry) {
		    if (entry) orgtree.positions.setActive(entry.nextElementSibling);
		});
	    });
	    break;
	default:
	    walk([]);
	}
    }

    function walk(path, callback, parentId) {
	var id = path.pop();
	loadColumn(parentId || null, function (col) {
	    var entry = setActiveEntry(col, id);
	    if (path.length > 0) {
		markEntryAsOpenParent(col, id);
		walk(path, callback, id);
	    } else {
		callback && callback(col, entry);
	    }
	});
    }

    function loadColumn(parentId, callback) {
	orgtree.columns.add(parentId, function (col) {
	    orgtree.entries.loadEntries(col, callback);
	});
    }

    function setActiveEntry(col, id) {
	orgtree.columns.setActive(col);
	if (id) {
	    var entry = orgtree.columns.getEntryById(col, id);
	    orgtree.positions.setActive(entry);
	    return entry;
	} else {
	    orgtree.positions.setActive(col.children[1].firstElementChild);
	    return null;
	}
    }

    function markEntryAsOpenParent(col, id) {
	orgtree.columns.getEntryById(col, id).className += ' open';
    }

    function locate(el) {
	window.location.hash = ((el.className.indexOf('entry') > -1) ? 'entry:' : 'jump:') + el.dataset.id;
    }

    orgtree.router = {
	route: route,
	locate: locate
    }

    return orgtree;
}(orgtree || {}));
