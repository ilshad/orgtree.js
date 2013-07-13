/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.actions
 */

var orgtree = (function (orgtree) {

    var active;
	
    function setActive(el) {
	active = el;
	active.focus();
    }
    
    function up() {
	setActive(active.parentNode.previousElementSibling.firstElementChild);		    
    }
    
    function down() {
	setActive(active.parentNode.nextElementSibling.firstElementChild);		    
    }
    
    function panel(id) {
	orgtree.dialog.ajaxDialog({
	    url: '/resources/entries/' + id + '/actions',
	    keyhandler: orgtree.keyhandlers.actionsPanelKeyHandler,
	    onready: function (el) {
		setActive(document.getElementById('entry-actions-list').firstElementChild.firstElementChild);
		orgtree.state.nextkeyhandler = orgtree.keyhandlers.defaultKeyHandler;
	    }
	});
    }

    orgtree.actions = {
	up: up,
	down: down,
	panel: panel
    }

    return orgtree;
}(orgtree || {}));
