/*
 * Copyright (c) 2013 Ilshad Khabibullin, ilshad.com
 * Licensed under the MIT license.
 *
 * orgtree.menu
 */

var orgtree = (function (orgtree) {

    function personMenu() {
	orgtree.xhr.GET({
	    url: '/person',
	    callback: function (r) {
		var d = document.createElement('div'),
		    data = JSON.parse(r),
		    h = (data.roles.indexOf('anonymous') > -1) ?
		        orgtree.template('person-anonymous', {}) :
		        orgtree.template('person-authenticated', {title:data.title});
		var personAnonymousId,
		    personAnonymousSecretKey,
		    personAnonymousSignup,
		    personAnonymousLogin,
		    personPullSession,
		    personProfile;
		d.id = 'person-menu';
		d.innerHTML = h;
		document.getElementById('header').appendChild(d);
		d.style.paddingRight =
		    document.body.scrollWidth -
		    document.getElementById('sidebar').scrollWidth -
		    document.getElementById('main').scrollWidth - 40;
		personAnonymousId = document.getElementById('person-anonymous-id');
		if (personAnonymousId) {
		    personAnonymousId.onclick = function (e) {
			orgtree.xhr.GET({
			    url: '/person-id',
			    callback: function (r) {
				var data = JSON.parse(r);
				orgtree.dialog.copyForm('copyform-anonym-id',
						      'Get Anonymous Session ID',
						      'This ID is public. Give this ID to your coworkers ' +
						      'and then you can participate in projects without registration.',
						      data.id);
			    }
			});
			return false;
		    }
		}
		personAnonymousSecretKey = document.getElementById('person-anonymous-secret-key');
		if (personAnonymousSecretKey) {
		    personAnonymousSecretKey.onclick = function (e) {
			orgtree.xhr.GET({
			    url: '/person-asecret',
			    callback: function (r) {
				var data = JSON.parse(r);
				orgtree.dialog.copyForm('copyform-anonym-secret-key',
						      'Secret Key',
						      'Save this secret key into your local computer. ' +
						      'Use the key to access to current anonymous session from ' +
						      'other computers or merge this session into some other ' +
						      'authenticated session.',
						      data.asecret);
			    }
			});
			return false;
		    }
		}
		personAnonymousSignup = document.getElementById('person-anonymous-signup');
		if (personAnonymousSignup) {
		    personAnonymousSignup.onclick = function (e) {
			return orgtree.dialog.ajaxDialog({
			    url: '/signup',
			    onready: function (div) {
				document.getElementById('signup-form-submit').onclick = function (e) {
				    var email = document.getElementById('signup-form-email'),
			                msg = document.getElementById('signup-form-message');
				    msg.innerHTML = '';
				    if (email.value) {
					orgtree.xhr.POST({
					    url: '/signup',
					    body: 'email=' + email.value,
					    callback: function (r) {
						if (JSON.parse(r).success) {
						    orgtree.dialog.simpleDialog('message-dialog', {
							message: "We've sent you a confirmation code! Please check your email."
						    });
						} else {
						    msg.appendChild(document.createTextNode('This email address is already in use.'));
						}
					    }
					});
				    } else {
					email.className = 'warn';
					email.onfocus = function (e) {email.className = ''}
				    };
				    return false;
				}
			    }
			});
		    }
		}
		personAnonymousLogin = document.getElementById('person-anonymous-login');
		if (personAnonymousLogin) {
		    personAnonymousLogin.onclick = function (e) {
			return orgtree.dialog.ajaxDialog({
			    url: '/loginform',
			    onready: function (div) {
				document.getElementById('login-form-submit').onclick = function (e) {
				    var email = document.getElementById('login-form-email'),
			                password = document.getElementById('login-form-password'),
			                msg = document.getElementById('login-form-message');
				    msg.innerHTML = '';
				    if (email.value) {
					orgtree.xhr.POST({
					    url: '/loginform',
					    body: 'email=' + email.value + '&password=' + password.value,
					    callback: function (r) {
						if (JSON.parse(r).success) document.location = '/';
					    }
					});
				    };
				    return false;
				}
			    }
			});
		    }
		}
		personPullSession = document.getElementById('person-pull-session');
		if (personPullSession) {
		    personPullSession.onclick = function (e) {
			return orgtree.dialog.ajaxDialog({url: '/pull-session'})
		    }
		}
		personProfile = document.getElementById('person-profile');
		if (personProfile) {
		    personProfile.onclick = function (e) {
			return orgtree.dialog.ajaxDialog({
			    url: '/profile',
			    onready: function (div) {
				document.getElementById('profile-submit').onclick = function (e) {
				    var firstname = document.getElementById('profile-firstname'),
			                lastname = document.getElementById('profile-lastname');
				    orgtree.xhr.POST({
					url: '/profile',
					status: 204,
					body: 'firstname=' + firstname.value + '&lastname=' + lastname.value,
					callback: function () {
				            document.location = '/';
					}
				    });
				    return false;
				}
			    }
			});
		    }
		};
	    }
	});
    }
    
    orgtree.menu = {
	personMenu: personMenu
    }

    return orgtree;
}(orgtree || {}));
