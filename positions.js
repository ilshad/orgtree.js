/*
 * orgtree.positions
 */

var orgtree = (function (orgtree) {

    function getActive() {
	var el = document.getElementById('active-position');
	if (!el) {
	    el = orgtree.columns.getEntriesContainer(orgtree.columns.getActive()).firstElementChild;
	    el.id = 'active-position';
	};
	return el;
    }

    function remember(el) {
	var col = column(el);
	col.dataset.lastPositionId = el.dataset.id;
	col.dataset.lastPositionType = (el.className.indexOf('entry') > -1) ?
	    'entry' : 'jump';
    }

    function column(el) {
	return el.parentNode.parentNode;
    }
    
    function recall(col) {
	var open = null,
	    econt = orgtree.columns.getEntriesContainer(col);
	if (col.dataset.lastPositionType == 'entry') {
	    for (var i in econt.children) {
		if (econt.children[i].dataset &&
		    econt.children[i].dataset.id == col.dataset.lastPositionId) {
		    return econt.children[i];
		};
		if (!open && econt.children[i].className.indexOf('open') > -1) {
		    open = econt.children[i];
		}
	    }
	} else if (col.dataset.lastPositionType == 'jump') {
	    for (var i in econt.children) {
		if (econt.children[i].dataset &&
		    econt.children[i].dataset.id == col.dataset.lastPositionId) {
		    return econt.children[i];
		};
		if (!open && econt.children[i].className.indexOf('open') > -1) {
		    open = econt.children[i];
		}
	    }
	};
	return open ? open : (econt.children[1] ? econt.children[1] : econt.children[0]);
    }
    
    function up() {
	setActive(getActive().previousElementSibling);
    }
    
    function down() {
	setActive(getActive().nextElementSibling);
    }
    
    function right() {
	var c = getActive().parentNode.parentNode,
	    cr = orgtree.columns.getRight(c);
	if (cr) {
	    setActive(recall(cr));
	    orgtree.columns.setActive(cr);
	}
    }
    
    function left() {
	var cl = orgtree.columns.getLeft(getActive().parentNode.parentNode);
	if (cl) {
	    setActive(recall(cl));
	    orgtree.columns.setActive(cl);
	}
    }
    
    function find(el) {
	if (el) {
	    while (el.className.indexOf('position') == -1) {
		el = el.parentElement;
	    };
	    return el;
	}
    }
    
    function setActive(el) {
	if (!el || el.className.indexOf('column-header') > -1) return;
	
	var previous = getActive();
	var x1, x2, y1, y2;
	
	if (previous != undefined) previous.removeAttribute('id');
	el.id = 'active-position';
	
	x1 = el.offsetLeft;
	x2 = el.parentNode.parentNode.scrollWidth;
	
	if (x1 > x2) {
	    el.parentNode.parentNode.parentNode.parentNode.scrollLeft = x1 - 100;
	} else {
	    el.parentNode.parentNode.parentNode.parentNode.scrollLeft = 0;
	}
	
	y1 = el.offsetTop - el.parentNode.offsetTop;
	y2 = (el.offsetTop + el.offsetHeight) - (el.parentNode.offsetTop + el.parentNode.offsetHeight);
	
	if (y1 < el.parentNode.scrollTop + 200) {
	    el.parentNode.scrollTop = y1 - 200;
	} else if (y2 > el.parentNode.scrollTop - 200) {
	    el.parentNode.scrollTop = y2 + 200;
	}

	remember(el);
	orgtree.router.locate(el);
    }

    function activeEntry() {
	var el = getActive();
	return (el.className.indexOf('entry') > -1) ? el : undefined;
    }

    orgtree.positions = {
	up: up,
	down: down,
	right: right,
	left: left,
	find: find,
	setActive: setActive,
	activeEntry: activeEntry,
	column: column
    }

    return orgtree;
}(orgtree || {}));
