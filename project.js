/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.project
 */

var orgtree = (function (orgtree) {

    function createProject(el) {
	orgtree.dialog.confirmation({
	    message: 'Are you sure you want to create project?',
	    yes: function() {
		orgtree.api.makeProject(el.dataset.id);
	    }
	});
    }

    orgtree.project = {
	createProject: createProject
    }

    return orgtree;
}(orgtree || {}));
