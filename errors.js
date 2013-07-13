/*
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
