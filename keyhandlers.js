/*
 * orgtree.keyhandlers
 */

var orgtree = (function (orgtree) {

    function navigationKeyHandlerGeneric(options) {
	/* Arguments (callables): up, down, left, right
	 */
	return function (e) {
	    switch (e.keyCode) {
		
	    case 38: // [up]
		if (!e.ctrlKey) {e.preventDefault(); options.up(); return true;};
	    case 40: // [down]
		if (!e.ctrlKey) {e.preventDefault(); options.down(); return true;};
	    case 37: // [left]
		if (!e.ctrlKey) {e.preventDefault(); options.left(); return true;};
	    case 39: // [right]
		if (!e.ctrlKey) {e.preventDefault(); options.right(); return true;};
		
	    case 75: // [k] vim up
		if (!e.ctrlKey) {e.preventDefault(); options.up(); return true;};
	    case 74: // [j] vim down
		if (!e.ctrlKey) {e.preventDefault(); options.down(); return true;};
	    case 72: // [h] vim left
		if (!e.ctrlKey) {e.preventDefault(); options.left(); return true;};
	    case 76: // [l] vim right
		if (!e.ctrlKey) {e.preventDefault(); options.right(); return true;};
		
	    case 80: // [Ctrl+p] emacs up
		if (e.ctrlKey) {e.preventDefault(); options.up(); return true;};
	    case 78: // [Ctrl+n] -- emacs down
		if (e.ctrlKey) {e.preventDefault(); options.down(); return true;};
	    case 66: // [Ctrl+p] emacs left
		if (e.ctrlKey) {e.preventDefault(); options.left(); return true;};
	    case 70: // [Ctrl+n] emacs right
		if (e.ctrlKey) {e.preventDefault(); options.right(); return true;};
		
	    default:
		return false;
	    }
	}
    }
	
    function navigationKeyHandlerBase(e) {
	navigationKeyHandlerGeneric({
	    up: orgtree.positions.up,
	    down: orgtree.positions.down,
	    left: orgtree.positions.left,
	    right: orgtree.positions.right
	})(e) || (function (e) {
	    var el;
	    switch (e.keyCode) {
	    case 9:  // Tab
		e.preventDefault();
		el = document.getElementById('active-position');
		if (el && el.className.indexOf('entry') != -1)
		    if (!e.ctrlKey) orgtree.entries.showChildren(el);
  		return true;
	    case 65: // [a]
		e.preventDefault();
		el = document.getElementById('active-position');
		if (!e.ctrlKey && el && el.className.indexOf('entry') != -1)
		    orgtree.actions.panel(el.dataset.id)
		return true;
	    default:
		return false;
	    }
	})(e);
    }
    
    function navigationKeyHandlerExtended(e) {
	var el;
	switch (e.keyCode) {
	case 13: // Enter
	    el = document.getElementById('active-position');
	    e.preventDefault();
	    if (el && el.className.indexOf('entry') != -1) {
		if (!e.ctrlKey) orgtree.state.setMode(orgtree.state.CAPTURE);
	    } else if (el && el.className.indexOf('jump') != -1) {
		if (!e.ctrlKey) orgtree.state.entryForm = orgtree.entries.insertEntry(el);
	    };
	    return true;
	case 68: // [d] delete (Ctrl+d - delete instantly)
	    e.preventDefault();
	    orgtree.entries.deleteActiveEntry(e.ctrlKey);
	    return true;
	default:
	    return false;
	}
    }
    
    function captureKeyHandler(e) {
	navigationKeyHandlerGeneric({
	    up: function () {
		el = document.getElementById('active-position');
		if (el.className.indexOf('entry') > -1) orgtree.entries.moveUp(el);
	    },
	    down: function () {
		el = document.getElementById('active-position');
		if (el.className.indexOf('entry') > -1) orgtree.entries.moveDown(el);
	    },
	    left: function () {
		el = document.getElementById('active-position');
		if (el.className.indexOf('entry') > -1) orgtree.entries.moveLeft(el);
	    },
	    right: function () {
		el = document.getElementById('active-position');
		if (el.className.indexOf('entry') > -1) orgtree.entries.moveRight(el);
	    }
	})(e) || (function (e) {
	    var el;
	    switch (e.keyCode) {
	    case 13: // Enter
		e.preventDefault();
		if (!e.ctrlKey) {
		    return orgtree.entries.editActiveEntry();
		};
		break;
	    case 9:  // Tab
		e.preventDefault();
		el = document.getElementById('active-position');
		if (el && el.className.indexOf('entry') != -1)
		    if (!e.ctrlKey) orgtree.entries.showChildren(el);
		return true;
	    case 27: // Esc
		e.preventDefault();
		if (!e.ctrlKey) orgtree.state.setMode(orgtree.state.NAVIGATION);
		return true;
	    default:
		return false;
	    }
	})(e);
    }
    
    function editKeyHandler(e) {
	var el;
	switch (e.keyCode) {
	case 13: // Enter
	    if (e.ctrlKey) {
		e.preventDefault();
		orgtree.state.entryForm.send();
	    };
	    return true;
	case 27: // Esc
	    e.preventDefault();
	    orgtree.state.entryForm.cancel();
	    return true;
	default:
	    return false;
	}
    }
    
    function trashKeyHandler(e) {
	navigationKeyHandlerBase(e) || (function (e) {
	    var el;
	    switch (e.keyCode) {
	    case 13: // Enter
		el = document.getElementById('active-position');
		e.preventDefault();
		if (el && el.className.indexOf('entry') != -1) orgtree.trash.restore(el);
		break;
	    }
	})(e);
    }
    
    function dialogKeyHandler(e) {
	switch (e.keyCode) {
	case 27: // Esc
	    e.preventDefault();
	    orgtree.dialog.dialogDone();
	    return true;
	case 81: // [Ctrl+q]
	    if (e.ctrlKey) {
		e.preventDefault();
		orgtree.dialog.dialogDone();
		return true;
	    };
	    break;
	default:
	    return false;
	}
    }

    function confirmationKeyHandler(e) {
	switch (e.keyCode) {
	case 89: // [y]
	    e.preventDefault();
	    if (!e.ctrlKey) orgtree.channel.publish('yes');
	    break;
	case 78: // [n]
	    e.preventDefault();
	    if (!e.ctrlKey) orgtree.channel.publish('no');
	    break;
	}
    }
    
    function actionsPanelKeyHandler(e) {
	orgtree.keyhandlers.navigationKeyHandlerGeneric({
	    up: orgtree.actions.up,
	    down: orgtree.actions.down,
	    left: function () {},
	    right: function () {}
	})(e) || orgtree.keyhandlers.dialogKeyHandler(e);
    }
    
    function defaultKeyHandler(e) {
	switch (orgtree.state.mode) {
	case orgtree.state.NAVIGATION:
	    navigationKeyHandlerBase(e) || navigationKeyHandlerExtended(e);
	    break;
	case orgtree.state.CAPTURE:
	    captureKeyHandler(e);
	    break;
	case orgtree.state.EDIT:
	    editKeyHandler(e);
	    break;
	}
    }
    
    orgtree.keyhandlers = {
	navigationKeyHandlerGeneric: navigationKeyHandlerGeneric,
	navigationKeyHandlerBase: navigationKeyHandlerBase,
	navigationKeyHandlerExtended: navigationKeyHandlerExtended,
	captureKeyHandler: captureKeyHandler,
	editKeyHandler: editKeyHandler,
	trashKeyHandler: trashKeyHandler,
	dialogKeyHandler: dialogKeyHandler,
	confirmationKeyHandler: confirmationKeyHandler,
	actionsPanelKeyHandler: actionsPanelKeyHandler,
	defaultKeyHandler: defaultKeyHandler
    }

    return orgtree;
}(orgtree || {}));
