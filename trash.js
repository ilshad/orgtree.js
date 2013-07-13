/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.trash
 */

var orgtree = (function (orgtree) {

    function load(col) {
	var econt = orgtree.columns.getEntriesContainer(col);
	orgtree.api.getTrash(function (r) {
	    var data;
	    for (var i=0; i < r.length; i++) {
		data = r[i];
		econt.appendChild(orgtree.entries.createEntryElement(data));
		econt.appendChild(orgtree.entries.createJumpElement(data.id));
	    };
	    orgtree.columns.setActive(col);
	});
    }

    function restore(el) {
	orgtree.dialog.confirmation({
	    message: 'Please, confirm to put this entry back.',
	    yes: function () {
		var col = orgtree.columns.getActive(),
		    econt = orgtree.columns.getEntriesContainer(col),
	            left = orgtree.columns.getLeft(col);
		orgtree.api.restoreFromTrash(el.dataset.id, function () {
		    var nextJump = el.nextElementSibling,
		        nextEntry = nextJump.nextElementSibling;
		    econt.removeChild(el);
		    econt.removeChild(nextJump);
		    if (left) entries.update(orgtree.columns.getEntryById(left, col.dataset.parentId));
		    orgtree.positions.setActive(nextEntry);
		});
	    }
	});
    }

    orgtree.trash = {
	load: load,
	restore: restore
    }

    return orgtree;
}(orgtree || {}));
