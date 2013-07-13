/*
 * orgtree.columns
 */

var orgtree = (function (orgtree) {

    var COLUMN_WIDTH = 620,
        ENTRIES_EXT = 20;

    function add(parentId, callback, title) {
	var col = document.createElement('div'),
	    econt = document.createElement('div'),
	    ccont = document.getElementById('columns-container'),
	    ext = document.getElementById('extender');

	col.className = 'column';
	col.dataset.parentId = parentId;
	col.dataset.lastPositionId = null;
	col.dataset.lastPositionType = null;
	col.style.width = COLUMN_WIDTH;
	
	ccont.style.width = ccont.scrollWidth + COLUMN_WIDTH;
	ccont.insertBefore(col, ext);
	
	col.appendChild(createColumnHeader(parentId, title));
	col.appendChild(econt);
	
	econt.className = 'entries-container';
	econt.style.width = COLUMN_WIDTH - ENTRIES_EXT;
	econt.appendChild(orgtree.entries.createJumpElement(null));
	
	if (callback) callback(col);
    }

    function createColumnHeader(parentId, title) {
	var el = document.createElement('div');
	el.className = 'column-header';
	if (parentId) {
	    updateColumnHeader(el, parentId);
	} else if (title) {
	    el.innerHTML = title;
	} else {
	    el.innerHTML = '&nbsp;';
	};
	return el;
    }
    
    function updateColumnHeader(el, parentId) {
	orgtree.api.getEntry(parentId, function (data) {
	    var text = data.content.split('\n').slice(0,1)[0];
	    if (text.length > 30) text = text.slice(0, 50) + '...';
	    el.innerHTML = text;
	});
    }
    
    function getColumnHeader(col) {
	return col.firstElementChild;
    }
    
    function getEntriesContainer(col) {
	return col.children[1];
    }
    
    function getActive() {
	return document.getElementById('active-column');
    }
    
    function setActive(col) {
	var c = getActive();
	if (c) c.removeAttribute('id');
	col.id = 'active-column';
    }
    
    function getRight(col) {
	var r = col.nextElementSibling;
	return (r && r.className.indexOf('column') > -1) ? r : null;
    }
    
    function getLeft(col) {
	var l = col.previousElementSibling;
	return (l && l.className.indexOf('column') > -1) ? l : null;
    }
    
    function destroyRight(col) {
	var container = col.parentNode,
	    el = col,
	    els = [];
	while (el = el.nextElementSibling) {
	    els.push(el);
	};
	for (var i in els.slice(0,-1)) {
	    container.removeChild(els[i]);
	    container.style.width = container.scrollWidth - COLUMN_WIDTH;
	}
    }

    function destroyColumns() {
	var cnt = document.getElementById('columns-container'),
	    chldr = cnt.children,
	    c = [],
	    el;
	for (var i=0; i<chldr.length; i++) c.push(chldr[i]);
	c.reverse();
	while (el=c.pop()) {
	    if (el.className.indexOf('column') > -1) cnt.removeChild(el);
	}
    }
    
    function getEntryById(col, id) {
	var econt = getEntriesContainer(col);
	for (var i=0; i<econt.children.length; i++) {
	    if (econt.children[i].dataset.id == id)
		return econt.children[i];
	}
    }
    
    orgtree.columns = {
	add: add,
	getActive: getActive,
	setActive: setActive,
	getRight: getRight,
	getLeft: getLeft,
	destroyRight: destroyRight,
	getEntryById: getEntryById,
	getEntriesContainer: getEntriesContainer,
	getColumnHeader: getColumnHeader,
	updateColumnHeader: updateColumnHeader,
	destroyColumns: destroyColumns
    }

    return orgtree;
}(orgtree || {}));
