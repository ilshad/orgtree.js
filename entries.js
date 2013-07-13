/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.entries
 */

var orgtree = (function (orgtree) {

    function moveUp(el) {
	var col = el.parentNode.parentNode,
	    econt = orgtree.columns.getEntriesContainer(col),
	    j = el.previousElementSibling,
	    p = j.previousElementSibling,
	    p2 = (p) ? p.previousElementSibling.previousElementSibling : null,
	    p2id = (p2) ? p2.dataset.id : null;
	if (!p) return;
	orgtree.api.updateEntryPrevious(el.dataset.id, p2id, function (r) {
	    buildEntryElement(el, r, el.className.indexOf('open') > -1);
	    econt.removeChild(j);
	    econt.insertBefore(el, p);
	    orgtree.util.insertAfter(econt, el, createJumpElement(el.dataset.id));
	    orgtree.positions.setActive(el);
	});
    }

    function moveDown(el) {
	var col = el.parentNode.parentNode,
	    econt = orgtree.columns.getEntriesContainer(col),
	    j = el.nextElementSibling,
	    n = j.nextElementSibling,
	    nj = (n) ? n.nextElementSibling : null,
	    nId = (n) ? n.dataset.id : null;
	if (!n) return;
	orgtree.api.updateEntryPrevious(el.dataset.id, nId, function (r) {
	    buildEntryElement(el, r, el.className.indexOf('open') > -1);
	    econt.removeChild(j);
	    orgtree.util.insertAfter(econt, nj, el);
	    orgtree.util.insertAfter(econt, el, createJumpElement(el.dataset.id));
	    orgtree.positions.setActive(el);
	});
    }

    function moveRight(el) {
	var current = el.parentNode.parentNode,
	    right = orgtree.columns.getRight(current),
	    left = orgtree.columns.getLeft(current),
	    prev = el.previousElementSibling.previousElementSibling,
	    prevId = (prev) ? prev.dataset.id : null;

	function updateParent() {
	    if (current.dataset.parentId != "null")
		update(orgtree.columns.getEntryById(left, current.dataset.parentId));
	    update(prev);
	}

	if (prevId) {
	    if (!right) {
		orgtree.columns.add(prevId, function (col) {
		    loadEntries(col, function () {
			moveTo(el, col, updateParent);
		    });
		});
	    } else if (right.dataset.parentId == prevId) {
		moveTo(el, right, updateParent);
	    } else {
		orgtree.columns.destroyRight(current);
		orgtree.columns.add(prevId, function (col) {
		    loadEntries(col, function () {
			moveTo(el, col, updateParent);
		    });
		});
	    }
	}
    }

    function moveLeft(el) {
	var current = el.parentNode.parentNode,
	    left = orgtree.columns.getLeft(current);

	function updateParent() {
	    update(orgtree.columns.getEntryById(left, current.dataset.parentId));
	    if (left.dataset.parentId != "null")
		update(orgtree.columns.getEntryById(
		    orgtree.columns.getLeft(left), left.dataset.parentId));
	}
	if (left) moveTo(el, left, updateParent);
    }

    function moveTo(el, col, callback) {
	var econt = orgtree.columns.getEntriesContainer(col);	
	orgtree.api.updateEntryParent(el.dataset.id, col.dataset.parentId, function (r) {
	    var j = el.nextElementSibling;
	    j.parentNode.removeChild(j);
	    buildEntryElement(el, r, false);
	    orgtree.util.insertAfter(econt, econt.firstElementChild, el);
	    orgtree.util.insertAfter(econt, el, createJumpElement(el.dataset.id));
	    orgtree.positions.setActive(el);
	    orgtree.columns.setActive(col);
	    if (callback) callback();
	    orgtree.state.setMode(orgtree.state.NAVIGATION);
	});
    }

    function getContent(el) {
	return el.children[1].innerHTML;
    }
    
    function showChildren(el) {
	var col = el.parentNode.parentNode,
	    econt = orgtree.columns.getEntriesContainer(col),
	    right = orgtree.columns.getRight(col),
	    rightId = right ? right.dataset.parentId : null;

	if (el.dataset.childrenLength > 0) {
	    if (right) {
		orgtree.columns.destroyRight(col);
		if (rightId == el.dataset.id) {
		    el.className = el.className.replace('open', '');
		    return;
		}
	    }
	    orgtree.columns.add(el.dataset.id, loadEntries);
	    for (var i in econt.children) {
		if (econt.children[i].className && econt.children[i].className.indexOf('open') > -1)
		    econt.children[i].className = econt.children[i].className.replace('open', '');
	    };
	    el.className += ' open';
	    if (el.parentNode.parentNode.parentNode.scrollLeft > 100)
		el.parentNode.parentNode.parentNode.scrollLeft =
		el.parentNode.parentNode.parentNode.scrollLeft + 100;
	}
    }
    
    function update(el) {
	var open = el.className.indexOf('open');
	orgtree.api.getEntry(el.dataset.id, function (r) {
	    el.dataset.childrenLength = r.children;
	    buildEntryElement(el, r, open);
	});
    }
    
    function getColumn(el) {
	return el.parentNode.parentNode;
    }
    
    function loadEntries(col, callback) {
	var parentId = col.dataset.parentId,
	    econt = orgtree.columns.getEntriesContainer(col);
	orgtree.api.getEntries(parentId, function (r) {
	    var data;
	    for (var i=0; i<r.length; i++) {
		data = r[i];
		econt.appendChild(createEntryElement(data));
		econt.appendChild(createJumpElement(data.id));
	    };
	    if (callback) callback(col);
	});
    }

    function createEntryElement(data) {
	var el = document.createElement('div');
	el.dataset.id = data.id;
	el.dataset.childrenLength = data.children;
	buildEntryElement(el, data, false);
	return el;
    }
    
    function buildEntryElement(el, data, isOpen) {
	var c;
	el.className = 'position entry';
	el.className += (el.dataset.childrenLength > 0) ? ' with-children' : ' childfree';
	if (isOpen) el.className += ' open';
	el.innerHTML = orgtree.template('display-entry', {content:data.content});
	el.children[1].onclick = function (e) {
	    if (orgtree.state.mode != orgtree.state.EDIT) {
		if (orgtree.state.mode == orgtree.state.CAPTURE)
		    orgtree.state.setMode(orgtree.state.NAVIGATION);
		orgtree.positions.setActive(orgtree.positions.find(e.target));
	    }
	}
	el.children[1].ondblclick = function (e) {
	    if (orgtree.state.mode != orgtree.state.EDIT && orgtree.state.mode != orgtree.state.TRASH) {
		if (orgtree.state.mode == orgtree.state.CAPTURE)
		    orgtree.state.setMode(orgtree.state.NAVIGATION);
		orgtree.state.entryForm = editEntry(orgtree.positions.find(e.target));
	    }
	}
	if (orgtree.state.mode != orgtree.state.TRASH) {
	    if (el.dataset.childrenLength > 0) {
		el.children[0].children[0].innerHTML = el.dataset.childrenLength;
		el.children[0].children[0].onclick = function (e) {
		    showChildren(el);
		    return false;
		}
	    }
	    addEntryToolbarAction(el, function (e) {
		orgtree.actions.panel(data.id);
	    }, 'open-panel-entry-action', '&nbsp;', 'Open panel');
	} else {
	    if (data.trash) addEntryToolbarAction(el, function (e) {
		orgtree.trash.restore(el);
	    }, 'restore-action', '&nbsp;', 'Restore');
	}
    }
    
    function addEntryToolbarAction(entryElement, onclick, className, content, title) {
	var ul = entryElement.children[2].children[0],
	    li = document.createElement('li'),
	    a = document.createElement('a');

	a.className = 'action ' + className;
	a.innerHTML = content;
	a.title = title;
	a.onclick = onclick;
	ul.appendChild(li);
	li.appendChild(a);
	return a;
    }

    function createJumpElement(previousId) {
	var el = document.createElement('div');
	el.className = 'position jump';
	el.dataset.id = previousId;
	el.onclick = function (e) {
	    if (orgtree.state.mode != orgtree.state.EDIT) orgtree.positions.setActive(e.target);
	}
	buildJumpElement(el);
	return el;
    }
    
    function buildJumpElement(el) {
	el.innerHTML = '&nbsp;';
    }
    
    function insertEntry(jump) {
	var source = orgtree.template('entry-form', {content:""}),
	    form,
	    textarea;
	
	jump.innerHTML = source;
	form = jump.children[0];
	textarea = form.children[0];
	
	textarea.addEventListener('keyup', function () {
	    this.style.height = 0;
	    this.style.height = (this.scrollHeight + 20) + 'px';
	}, false);
	
	function destroy() {
	    jump.removeChild(form);
	    orgtree.state.setMode(orgtree.state.NAVIGATION);
	    buildJumpElement(jump);
	}
	
	function send() {
	    var val = encodeURIComponent(textarea.value),
	        col = orgtree.columns.getActive(),
	        econt = orgtree.columns.getEntriesContainer(col),
	        parentId = col.dataset.parentId,
	        prevId = jump.dataset.id;

	    orgtree.api.insertEntry(val, prevId, parentId, function (r) {
		var el = createEntryElement(r);
		jumpNew = createJumpElement(r.id);
		destroy();
		orgtree.util.insertAfter(econt, jump, el);
		orgtree.util.insertAfter(econt, el, jumpNew);
		orgtree.positions.setActive(jumpNew);
		if (parentId != "null")
		    update(
			orgtree.columns.getEntryById(
			    orgtree.columns.getLeft(col),
			    parentId));
	    });	    
	    return false;
	}
	
	function cancel() {
	    if (textarea.value.trim().length == 0) {
		destroy();
	    } else {
		textarea.blur();
		orgtree.dialog.confirmation({
		    message: 'Please, confirm to destroy the text',
		    yes: destroy,
		    no: focus,
		});
	    }
	    return false;
	}
	
	function focus() {
	    setTimeout(function () {
		textarea.focus();
		var el = textarea,
	        y = (el.offsetTop + el.offsetHeight) -
		    (el.parentNode.parentNode.parentNode.parentNode.offsetTop +
		     el.parentNode.parentNode.parentNode.parentNode.offsetHeight);
		if (y > el.parentNode.scrollTop) el.parentNode.parentNode.parentNode.scrollTop = y + 200;
	    }, 100);
	}
	
	document.getElementById('entry-form-action-send').onclick = send;
	document.getElementById('entry-form-action-cancel').onclick = cancel;
	orgtree.state.setMode(orgtree.state.EDIT);
	focus();
	
	return {
	    send: send,
	    cancel: cancel
	}
    }

    function editEntry(el) {
	var content = getContent(el),
	    source = orgtree.template('entry-form', {content: content}),
	    form,
	    textarea;
	
	el.innerHTML = source;
	form = el.children[0];
	textarea = form.children[0];
	textarea.style.height = (textarea.scrollHeight + 20) + 'px';
	
	textarea.addEventListener('keyup', function () {
	    this.style.height = 0;
	    this.style.height = (this.scrollHeight + 20) + 'px';
	}, false);
	
	function destroy() {
	    el.removeChild(form);
	    orgtree.state.setMode(orgtree.state.NAVIGATION);
	    buildEntryElement(el, {content:content}, false);
	    orgtree.positions.setActive(el);
	}
	
	function send() {
	    orgtree.api.updateEntryContent(el.dataset.id, textarea.value, function (r) {
		content = r.content;
		destroy();
		orgtree.util.spinner(false);
		var rightColumn = orgtree.columns.getRight(getColumn(el));
		if (rightColumn && rightColumn.dataset.parentId == el.dataset.id)
		    orgtree.columns.updateColumnHeader(
			orgtree.columns.getColumnHeader(rightColumn),
			el.dataset.id)
	    });
	    return false;
	}
	
	function cancel() {
	    if (textarea.value.trim().length == 0) {
		destroy();
	    } else {
		textarea.blur();
		orgtree.dialog.confirmation({
		    message: 'Please, confirm to cancel changes',
		    yes: destroy,
		    no: focus,
		});
	    };
	    return false;
	}
	
	function focus() {
	    setTimeout(function () {
		textarea.focus();
		var el = textarea;
	        y = (el.offsetTop + el.offsetHeight) -
		    (el.parentNode.parentNode.parentNode.parentNode.offsetTop +
		     el.parentNode.parentNode.parentNode.parentNode.offsetHeight);
		if (y > el.parentNode.scrollTop) el.parentNode.parentNode.parentNode.scrollTop = y + 200;
	    }, 100);
	}
	
	document.getElementById('entry-form-action-send').onclick = send;
	document.getElementById('entry-form-action-cancel').onclick = cancel;
	orgtree.state.setMode(orgtree.state.EDIT);
	focus();
	
	return {
	    send: send,
	    cancel: cancel
	}
    }
    
    function editActiveEntry() {
	var el = document.getElementById('active-position');
	if (el.className.indexOf('entry') > -1) {
	    orgtree.state.entryForm = orgtree.entries.editEntry(el);
	    return true;
	}
	return false;
    }
    
    function deleteActiveEntry(isInstantly) {
	var el = document.getElementById('active-position');
	if (el.className.indexOf('entry') > -1) deleteEntry(el, isInstantly);
    }
    
    function deleteEntry(entryElement, isInstantly) {
	function del() {
	    var id = entryElement.dataset.id,
	        col = orgtree.columns.getActive(),
	        econt = orgtree.columns.getEntriesContainer(col),
	        left = orgtree.columns.getLeft(col),
	        right = orgtree.columns.getRight(col);

	    orgtree.api.trashEntry(id, function () {
		var nextJump = entryElement.nextElementSibling,
		    nextEntry = nextJump.nextElementSibling;
		econt.removeChild(entryElement);
		econt.removeChild(nextJump);
		if (left) update(orgtree.columns.getEntryById(left, col.dataset.parentId));
		if (right && right.dataset.parentId == id) orgtree.columns.destroyRight(col);
		orgtree.positions.setActive(nextEntry);
	    });
	}
	if (isInstantly) {
	    del();
	} else {
	    orgtree.dialog.confirmation({
		message: 'Please, confirm to delete entry',
		yes: del
	    });
	}
    }

    orgtree.entries = {
	moveUp: moveUp,
	moveDown: moveDown,
	moveRight: moveRight,
	moveLeft: moveLeft,
	getContent: getContent,
	showChildren: showChildren,
	update: update,
	getColumn: getColumn,
	loadEntries: loadEntries,
	createEntryElement: createEntryElement,
	createJumpElement: createJumpElement,
	insertEntry: insertEntry,
	editEntry: editEntry,
	editActiveEntry: editActiveEntry,
	deleteActiveEntry: deleteActiveEntry
    }
 
    return orgtree;
}(orgtree || {}));
