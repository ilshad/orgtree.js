/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.errors
 */

var orgtree = (function (orgtree) {

    function Unauthorized() {
	this.name = 'Unauthorized';
    }

    orgtree.errors = {
	Unauthorized: Unauthorized
    }

    return orgtree;
}(orgtree || {}));
