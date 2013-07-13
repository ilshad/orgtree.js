(function (orgtree) {

    function update() {
	//document.getElementById('main').style.width =
	//    document.body.scrollWidth - 40;
	//document.getElementById('main').style.height =
	//    document.body.scrollHeight - 80;
	var menu = document.getElementById('person-menu');
	if (menu) menu.style.paddingRight =
	    document.body.scrollWidth -
	    document.getElementById('sidebar').scrollWidth -
	    document.getElementById('main').scrollWidth - 40;
    };

    window.addEventListener('load', function(e) {
	orgtree.menu.personMenu();
	update();
    });

    window.addEventListener('resize', update);

    if (window.location.pathname == '/') {
	window.addEventListener('keydown', function (e) {
	    orgtree.state.keyhandler(e);
	}, true);
	orgtree.state.setMode(orgtree.state.NAVIGATION);
	orgtree.state.keyhandler = orgtree.keyhandlers.defaultKeyHandler;
	orgtree.router.route();

    } else if (window.location.pathname == '/trash') {
	window.addEventListener('keydown', function (e) {
	    orgtree.state.keyhandler(e);
	}, true);
	orgtree.state.setMode(orgtree.state.TRASH);
	orgtree.state.keyhandler = orgtree.keyhandlers.trashKeyHandler;
	orgtree.columns.add(undefined, function (col) {
	    orgtree.trash.load(col);
	}, 'TRASH');
    }

    document.addEventListener('touchmove', function (e) {
	e.preventDefault();
    });

}(orgtree));
