/*
 * orgtree.channel
 */

var orgtree = (function (orgtree) {

    var events = {}

    function subscribe(name, id, fn) {
	if (!events[name])
	    events[name] = [];
	events[name].push({id:id, callback:fn});
    }

    function unsubscribe(name, id) {
	var t = events[name];
	events[name] = t.filter(function (i) {
	    return i.id != id;
	});
    }

    function publish(name, data) {
	var t = events[name];
	if (t) {
	    for (var i=0, len=t.length; i<len; i++) {
		t[i].callback(data);
	    }
	}
    }

    orgtree.channel = {
	subscribe: subscribe,
	unsubscribe: unsubscribe,
	publish: publish
    }

    return orgtree;
}(orgtree || {}));
