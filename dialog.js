/*
 * orgtree.dialog
 */

var orgtree = (function (orgtree) {

    /* Helpers */
    function createFader() {
	var fader = document.createElement('div');
	fader.id = 'dialog-fader';
	fader.className = 'dialog-fader';
	fader.style.height = document.body.scrollHeight;
	document.body.insertBefore(fader, document.getElementById('footer'));
	return fader;
    }
	
    function destroyDialog() {
	var shelve = document.getElementById('shelve'),
	    dialog = shelve.firstElementChild,
	    fader = document.getElementById('dialog-fader');
	if (dialog != null) shelve.removeChild(dialog);
	if (fader != null) document.body.removeChild(fader);
	orgtree.state.nextkeyhandler = undefined;
    }

    function dialogDone() {
	destroyDialog();
	orgtree.state.keyhandler = orgtree.keyhandlers.defaultKeyHandler;
	return false;
    }
    /* -- end -- */
	
    function confirmation(data) {
	var callback_yes = data.yes,
	    callback_no = data.no,
	    message = data.message,
	    ID = 'confirmation',
	    formerKeyHandler = orgtree.state.nextkeyhandler || orgtree.state.keyhandler;

	destroyDialog();
	createFader();
	document.getElementById('shelve').innerHTML = orgtree.template('confirmation', {message:message});
	document.getElementById('confirmation-form').style.zIndex = 999;
	orgtree.channel.subscribe('yes', ID, function () {done(true);});
	orgtree.channel.subscribe('no', ID, function () {done(false);});
	
	function done(r) {
	    orgtree.channel.unsubscribe('yes', ID);
	    orgtree.channel.unsubscribe('no', ID);
	    destroyDialog();
	    orgtree.state.keyhandler = formerKeyHandler;
	    if (r) {callback_yes && callback_yes()}
	    else {callback_no && callback_no()};
	    return false;
	}

	orgtree.state.keyhandler = orgtree.keyhandlers.confirmationKeyHandler;
	document.getElementById('confirmation-yes').onclick = function (e) {
	    return done(true);
	}
	document.getElementById('confirmation-no').onclick = function (e) {
	    return done(false);
	}
    }
    
    function copyForm(cssClass, title, message, value) {
	destroyDialog();
	createFader();
	document.getElementById('shelve').innerHTML = orgtree.template(
	    'copyform',
	    {cssClass:cssClass, title:title, message:message, value:value});
	document.getElementById('copyform').style.zIndex = 999;
	orgtree.state.keyhandler = orgtree.keyhandlers.dialogKeyHandler;
	document.getElementById('copyform-close').onclick = dialogDone;
	document.getElementById('copyform-value').onfocus = function (e) {
	    e.target.select();
	}
    }
    
    function simpleDialog(templateId, data) {
	destroyDialog();
	createFader();
	document.getElementById('shelve').innerHTML = orgtree.template(templateId, data || {});
	document.getElementById('simple-dialog').style.zIndex = 999;
	orgtree.state.keyhandler = orgtree.keyhandlers.dialogKeyHandler;
	document.getElementById('simple-dialog-close').onclick = dialogDone;
    }
    
    function ajaxDialog(data) {
	/* Args: url, keyhandler, onready, onclose, left, top
	 */
	destroyDialog();
	createFader();

	orgtree.xhr.GET({
	    url: data.url,
	    callback: function (r) {
		var d = document.createElement('div');
		d.className = 'dialog';
		d.innerHTML = r;
		d.style.zIndex = 999;
		d.style.top = data.top || '15%';
		d.style.left = data.left || '10%';
		document.getElementById('shelve').appendChild(d);
		orgtree.state.keyhandler = data.keyhandler || orgtree.keyhandlers.dialogKeyHandler;
		var close = document.getElementById('simple-dialog-close');
		if (close) close.onclick = data.onclose || dialogDone;
		if (data.onready) data.onready(d);
	    }
	});

	return false;
    }

    orgtree.dialog = {
	destroyDialog: destroyDialog,
	dialogDone: dialogDone,
	confirmation: confirmation,
	copyForm: copyForm,
	simpleDialog: simpleDialog,
	ajaxDialog: ajaxDialog
    }

    return orgtree;
}(orgtree || {}));
