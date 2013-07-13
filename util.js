/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.util
 */

var orgtree = (function (orgtree) {

    orgtree.util = {

	spinner: (function () {
	    var c = 0;
	    return function (isShow) {
		c = (isShow) ? c + 1 : c -1;
		c = (c < 0) ? 0 : c;
		document.getElementById('spinner').style.display = (c > 0) ? 'block' : 'none';
	    }
	}()),

	insertAfter: function (parent, ref, el) {
	    var next = ref.nextSibling;
	    if (next) {
		return parent.insertBefore(el, next);
	    } else {
		return parent.appendChild(el);
	    }
	}
    }

    return orgtree;
}(orgtree || {}));
