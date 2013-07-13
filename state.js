/*
 * orgtree.state
 */

var orgtree = (function (orgtree) {

    orgtree.state = {
	NAVIGATION: 'navigation',
        CAPTURE: 'capture',
        EDIT: 'edit',
        TRASH: 'trash',
	mode: undefined,
	keyhandler: undefined,
	nextkeyhandler: undefined,
	entryForm: undefined,
	setMode: function (mode) {
	    switch (mode) {
	    case this.NAVIGATION:
		document.body.className = 'navigation-mode';
		break;
	    case this.CAPTURE:
		document.body.className = 'capture-mode';
		break;
	    case this.EDIT:
		document.body.className = 'edit-mode';
		break;
	    case this.TRASH:
		document.body.className = 'trash-mode';
		break;
	    };
	    this.mode = mode;
	}
    }

    return orgtree;
}(orgtree || {}));
