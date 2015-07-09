(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/accounts_ui.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (!Accounts.ui){                                                                                                     // 1
	Accounts.ui = {};                                                                                                     // 2
}                                                                                                                      // 3
                                                                                                                       // 4
if (!Accounts.ui._options) {                                                                                           // 5
	Accounts.ui._options = {                                                                                              // 6
		extraSignupFields: [],                                                                                               // 7
		requestPermissions: {},                                                                                              // 8
		requestOfflineToken: {},                                                                                             // 9
		forceApprovalPrompt: {},                                                                                             // 10
		forceEmailLowercase: false,                                                                                          // 11
		forceUsernameLowercase: false,                                                                                       // 12
		forcePasswordLowercase: false                                                                                        // 13
	};                                                                                                                    // 14
}                                                                                                                      // 15
                                                                                                                       // 16
Accounts.ui.navigate = function (route, hash) {                                                                        // 17
	// if router is iron-router                                                                                           // 18
	if (window.Router && _.isFunction(Router.go)) {                                                                       // 19
		Router.go(route, hash);                                                                                              // 20
	}                                                                                                                     // 21
}                                                                                                                      // 22
                                                                                                                       // 23
Accounts.ui.config = function(options) {                                                                               // 24
	// validate options keys                                                                                              // 25
	var VALID_KEYS = ['passwordSignupFields', 'extraSignupFields', 'forceEmailLowercase', 'forceUsernameLowercase','forcePasswordLowercase',
					  'requestPermissions', 'requestOfflineToken', 'forceApprovalPrompt'];                                            // 27
                                                                                                                       // 28
	_.each(_.keys(options), function(key) {                                                                               // 29
		if (!_.contains(VALID_KEYS, key)){                                                                                   // 30
			throw new Error("Accounts.ui.config: Invalid key: " + key);                                                         // 31
		}                                                                                                                    // 32
	});                                                                                                                   // 33
	                                                                                                                      // 34
	options.extraSignupFields = options.extraSignupFields || [];                                                          // 35
	                                                                                                                      // 36
	// deal with `passwordSignupFields`                                                                                   // 37
	if (options.passwordSignupFields) {                                                                                   // 38
		if (_.contains([                                                                                                     // 39
			"USERNAME_AND_EMAIL_CONFIRM",                                                                                       // 40
			"USERNAME_AND_EMAIL",                                                                                               // 41
			"USERNAME_AND_OPTIONAL_EMAIL",                                                                                      // 42
			"USERNAME_ONLY",                                                                                                    // 43
			"EMAIL_ONLY"                                                                                                        // 44
		], options.passwordSignupFields)) {                                                                                  // 45
			if (Accounts.ui._options.passwordSignupFields){                                                                     // 46
				throw new Error("Accounts.ui.config: Can't set `passwordSignupFields` more than once");                            // 47
			} else {                                                                                                            // 48
				Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;                                          // 49
			}                                                                                                                   // 50
		} else {                                                                                                             // 51
			throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);  // 52
		}                                                                                                                    // 53
	}                                                                                                                     // 54
                                                                                                                       // 55
	Accounts.ui._options.forceEmailLowercase = options.forceEmailLowercase;                                               // 56
	Accounts.ui._options.forceUsernameLowercase = options.forceUsernameLowercase;                                         // 57
	Accounts.ui._options.forcePasswordLowercase = options.forcePasswordLowercase;                                         // 58
                                                                                                                       // 59
	// deal with `requestPermissions`                                                                                     // 60
	if (options.requestPermissions) {                                                                                     // 61
		_.each(options.requestPermissions, function(scope, service) {                                                        // 62
			if (Accounts.ui._options.requestPermissions[service]) {                                                             // 63
				throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);               // 64
			} else if (!(scope instanceof Array)) {                                                                             // 65
				throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");                            // 66
			} else {                                                                                                            // 67
				Accounts.ui._options.requestPermissions[service] = scope;                                                          // 68
			}                                                                                                                   // 69
		});                                                                                                                  // 70
	}                                                                                                                     // 71
	if (typeof options.extraSignupFields !== 'object' || !options.extraSignupFields instanceof Array) {                   // 72
		throw new Error("Accounts.ui.config: `extraSignupFields` must be an array.");                                        // 73
	} else {                                                                                                              // 74
		if (options.extraSignupFields) {                                                                                     // 75
			_.each(options.extraSignupFields, function(field, index) {                                                          // 76
				if (!field.fieldName || !field.fieldLabel){                                                                        // 77
					throw new Error("Accounts.ui.config: `extraSignupFields` objects must have `fieldName` and `fieldLabel` attributes.");
				}                                                                                                                  // 79
				if (typeof field.visible === 'undefined'){                                                                         // 80
					field.visible = true;                                                                                             // 81
				}                                                                                                                  // 82
				Accounts.ui._options.extraSignupFields[index] = field;                                                             // 83
			});                                                                                                                 // 84
		}                                                                                                                    // 85
	}                                                                                                                     // 86
                                                                                                                       // 87
	// deal with `requestOfflineToken`                                                                                    // 88
	if (options.requestOfflineToken) {                                                                                    // 89
		_.each(options.requestOfflineToken, function (value, service) {                                                      // 90
			if (service !== 'google'){                                                                                          // 91
				throw new Error("Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.");       // 92
			}                                                                                                                   // 93
			if (Accounts.ui._options.requestOfflineToken[service]) {                                                            // 94
				throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);              // 95
			} else {                                                                                                            // 96
				Accounts.ui._options.requestOfflineToken[service] = value;                                                         // 97
			}                                                                                                                   // 98
		});                                                                                                                  // 99
	}                                                                                                                     // 100
                                                                                                                       // 101
	// deal with `forceApprovalPrompt`                                                                                    // 102
	if (options.forceApprovalPrompt) {                                                                                    // 103
		_.each(options.forceApprovalPrompt, function (value, service) {                                                      // 104
			if (service !== 'google'){                                                                                          // 105
				throw new Error("Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.");       // 106
			}                                                                                                                   // 107
			if (Accounts.ui._options.forceApprovalPrompt[service]) {                                                            // 108
				throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);              // 109
			} else {                                                                                                            // 110
				Accounts.ui._options.forceApprovalPrompt[service] = value;                                                         // 111
			}                                                                                                                   // 112
		});                                                                                                                  // 113
	}                                                                                                                     // 114
};                                                                                                                     // 115
                                                                                                                       // 116
Accounts.ui._passwordSignupFields = function() {                                                                       // 117
	return Accounts.ui._options.passwordSignupFields || "EMAIL_ONLY";                                                     // 118
};                                                                                                                     // 119
                                                                                                                       // 120
                                                                                                                       // 121
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/en.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("en", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Reset your password",                                                                                        // 3
		newPassword: "New password",                                                                                         // 4
		newPasswordAgain: "New Password (again)",                                                                            // 5
		cancel: "Cancel",                                                                                                    // 6
		submit: "Set password"                                                                                               // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Choose a password",                                                                                          // 10
		newPassword: "New password",                                                                                         // 11
		newPasswordAgain: "New Password (again)",                                                                            // 12
		cancel: "Close",                                                                                                     // 13
		submit: "Set password"                                                                                               // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "Email address verified",                                                                                  // 17
		dismiss: "Dismiss"                                                                                                   // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Dismiss",                                                                                                  // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Change password",                                                                                         // 24
		signOut: "Sign out"                                                                                                  // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Sign in",                                                                                                   // 28
		up: "Join"                                                                                                           // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "or"                                                                                                             // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Create",                                                                                                    // 35
		signIn: "Sign in",                                                                                                   // 36
		forgot: "Forgot password?",                                                                                          // 37
		createAcc: "Create account"                                                                                          // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "Email",                                                                                                      // 41
		reset: "Reset password",                                                                                             // 42
		invalidEmail: "Invalid email"                                                                                        // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Cancel"                                                                                                       // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Change password",                                                                                           // 49
		cancel: "Cancel"                                                                                                     // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Sign in with",                                                                                          // 53
		configure: "Configure",                                                                                              // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Sign out"                                                                                                  // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "No login services configured"                                                                      // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Username or Email",                                                                                // 63
		username: "Username",                                                                                                // 64
		email: "Email",                                                                                                      // 65
		password: "Password"                                                                                                 // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Username",                                                                                                // 69
		email: "Email",                                                                                                      // 70
		emailOpt: "Email (optional)",                                                                                        // 71
		password: "Password",                                                                                                // 72
		passwordAgain: "Password (again)"                                                                                    // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Current Password",                                                                                 // 76
		newPassword: "New Password",                                                                                         // 77
		newPasswordAgain: "New Password (again)"                                                                             // 78
	},                                                                                                                    // 79
	infoMessages : {                                                                                                      // 80
		emailSent: "Email sent",                                                                                             // 81
		passwordChanged: "Password changed"                                                                                  // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "User not found",                                                                                      // 85
		invalidEmail: "Invalid email",                                                                                       // 86
		incorrectPassword: "Incorrect password",                                                                             // 87
		usernameTooShort: "Username must be at least 3 characters long",                                                     // 88
		passwordTooShort: "Password must be at least 6 characters long",                                                     // 89
		passwordsDontMatch: "Passwords don't match",                                                                         // 90
		newPasswordSameAsOld: "New and old passwords must be different",                                                     // 91
		signupsForbidden: "Signups forbidden"                                                                                // 92
	}                                                                                                                     // 93
});                                                                                                                    // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/es.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("es", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Restablece tu contraseña",                                                                                   // 3
		newPassword: "Nueva contraseña",                                                                                     // 4
		newPasswordAgain: "Nueva contraseña (otra vez)",                                                                     // 5
		cancel: "Cancelar",                                                                                                  // 6
		submit: "Guardar"                                                                                                    // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Escribe una contraseña",                                                                                     // 10
		newPassword: "Nueva contraseña",                                                                                     // 11
		newPasswordAgain: "Nueva contraseña (otra vez)",                                                                     // 12
		cancel: "Cerrar",                                                                                                    // 13
		submit: "Guardar contraseña"                                                                                         // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "Correo electrónico verificado",                                                                           // 17
		dismiss: "Cerrar"                                                                                                    // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Cerrar",                                                                                                   // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Cambiar contraseña",                                                                                      // 24
		signOut: "Cerrar sesión"                                                                                             // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Iniciar sesión",                                                                                            // 28
		up: "registrarse"                                                                                                    // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "o"                                                                                                              // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Crear",                                                                                                     // 35
		signIn: "Iniciar sesión",                                                                                            // 36
		forgot: "¿Ha olvidado su contraseña?",                                                                               // 37
		createAcc: "Registrarse"                                                                                             // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "Correo electrónico",                                                                                         // 41
		reset: "Restablecer contraseña",                                                                                     // 42
		invalidEmail: "Correo electrónico inválido"                                                                          // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Cancelar"                                                                                                     // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Cambiar contraseña",                                                                                        // 49
		cancel: "Cancelar"                                                                                                   // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Inicia sesión con",                                                                                     // 53
		configure: "Configurar",                                                                                             // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Cerrar sesión"                                                                                             // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "No hay ningún servicio configurado"                                                                // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Usuario o correo electrónico",                                                                     // 63
		username: "Usuario",                                                                                                 // 64
		email: "Correo electrónico",                                                                                         // 65
		password: "Contraseña"                                                                                               // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Usuario",                                                                                                 // 69
		email: "Correo electrónico",                                                                                         // 70
		emailOpt: "Correo elect. (opcional)",                                                                                // 71
		password: "Contraseña",                                                                                              // 72
		passwordAgain: "Contraseña (otra vez)"                                                                               // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Contraseña Actual",                                                                                // 76
		newPassword: "Nueva Contraseña",                                                                                     // 77
		newPasswordAgain: "Nueva Contraseña (otra vez)"                                                                      // 78
	},                                                                                                                    // 79
	infoMessages: {                                                                                                       // 80
		sent: "Email enviado",                                                                                               // 81
		passwordChanged: "Contraseña modificada"                                                                             // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "El usuario no existe",                                                                                // 85
		invalidEmail: "Correo electrónico inválido",                                                                         // 86
		incorrectPassword: "Contraseña incorrecta",                                                                          // 87
		usernameTooShort: "El nombre de usuario tiene que tener 3 caracteres como mínimo",                                   // 88
		passwordTooShort: "La contraseña tiene que tener 6 caracteres como mínimo",                                          // 89
		passwordsDontMatch: "Las contraseñas no son iguales",                                                                // 90
		newPasswordSameAsOld: "La contraseña nueva y la actual no pueden ser iguales"                                        // 91
	}                                                                                                                     // 92
});                                                                                                                    // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/ca.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("ca", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Restablir la contrasenya",                                                                                   // 3
		newPassword: "Nova contrasenya",                                                                                     // 4
		newPasswordAgain: "Nova contrasenya (un altre cop)",                                                                 // 5
		cancel: "Cancel·lar",                                                                                                // 6
		submit: "Guardar"                                                                                                    // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Escriu una contrasenya",                                                                                     // 10
		newPassword: "Nova contrasenya",                                                                                     // 11
		newPasswordAgain: "Nova contrasenya (un altre cop)",                                                                 // 12
		cancel: "Tancar",                                                                                                    // 13
		submit: "Guardar contrasenya"                                                                                        // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "Adreça electrònica verificada",                                                                           // 17
		dismiss: "Tancar"                                                                                                    // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Tancar",                                                                                                   // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Canviar contrasenya",                                                                                     // 24
		signOut: "Tancar sessió"                                                                                             // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Iniciar sessió",                                                                                            // 28
		up: "Registrar-se"                                                                                                   // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "o bé"                                                                                                           // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Crear",                                                                                                     // 35
		signIn: "Iniciar sessió",                                                                                            // 36
		forgot: "Ha oblidat la contrasenya?",                                                                                // 37
		createAcc: "Registrar-se"                                                                                            // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "Adreça electrònica",                                                                                         // 41
		reset: "Restablir contrasenya",                                                                                      // 42
		invalidEmail: "Adreça invàlida"                                                                                      // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Cancel·lar"                                                                                                   // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Canviar contrasenya",                                                                                       // 49
		cancel: "Cancel·lar"                                                                                                 // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Inicia sessió amb",                                                                                     // 53
		configure: "Configurar"                                                                                              // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Tancar sessió"                                                                                             // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "No hi ha cap servei configurat"                                                                    // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Usuari o correu electrònic",                                                                       // 63
		username: "Usuari",                                                                                                  // 64
		email: "Adreça electrònica",                                                                                         // 65
		password: "Contrasenya"                                                                                              // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Usuari",                                                                                                  // 69
		email: "Adreça electrònica",                                                                                         // 70
		emailOpt: "Adreça elect. (opcional)",                                                                                // 71
		password: "Contrasenya",                                                                                             // 72
		passwordAgain: "Contrasenya (un altre cop)"                                                                          // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Contrasenya Actual",                                                                               // 76
		newPassword: "Nova Contrasenya",                                                                                     // 77
		newPasswordAgain: "Nova Contrasenya (un altre cop)"                                                                  // 78
	},                                                                                                                    // 79
	infoMessages: {                                                                                                       // 80
		sent: "Email enviat",                                                                                                // 81
		passwordChanged: "Contrasenya canviada"                                                                              // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "L'usuari no existeix",                                                                                // 85
		invalidEmail: "Adreça invàlida",                                                                                     // 86
		incorrectPassword: "Contrasenya incorrecta",                                                                         // 87
		usernameTooShort: "El nom d'usuari ha de tenir 3 caracters com a mínim",                                             // 88
		passwordTooShort: "La contrasenya ha de tenir 6 caracters como a mínim",                                             // 89
		passwordsDontMatch: "Les contrasenyes no són iguals",                                                                // 90
		newPasswordSameAsOld: "La contrasenya nova i l'actual no poden ser iguals"                                           // 91
	}                                                                                                                     // 92
});                                                                                                                    // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/fr.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("fr", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Réinitialiser mon mot de passe",                                                                             // 3
		newPassword: "Nouveau mot de passe",                                                                                 // 4
		newPasswordAgain: "Nouveau mot de passe (confirmation)",                                                             // 5
		cancel: "Annuler",                                                                                                   // 6
		submit: "Définir le mot de passe"                                                                                    // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Choisir un mot de passe",                                                                                    // 10
		newPassword: "Nouveau mot de passe",                                                                                 // 11
		newPasswordAgain: "Nouveau mot de passe (confirmation)",                                                             // 12
		cancel: "Fermer",                                                                                                    // 13
		submit: "Définir le mot de passe"                                                                                    // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "L'adresse email a été vérifiée",                                                                          // 17
		dismiss: "Fermer"                                                                                                    // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Fermer",                                                                                                   // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Changer le mot de passe",                                                                                 // 24
		signOut: "Déconnexion"                                                                                               // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Connexion",                                                                                                 // 28
		up: "Inscription"                                                                                                    // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "ou"                                                                                                             // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Créer",                                                                                                     // 35
		signIn: "Connexion",                                                                                                 // 36
		forgot: "Mot de passe oublié ?",                                                                                     // 37
		createAcc: "Inscription"                                                                                             // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "Email",                                                                                                      // 41
		reset: "Réinitialiser le mot de passe",                                                                              // 42
		invalidEmail: "L'adresse email est invalide"                                                                         // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Annuler"                                                                                                      // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Changer le mot de passe",                                                                                   // 49
		cancel: "Annuler"                                                                                                    // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Se connecter avec",                                                                                     // 53
		configure: "Configurer",                                                                                             // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Déconnexion"                                                                                               // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "Aucun service d'authentification n'est configuré"                                                  // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Nom d'utilisateur ou email",                                                                       // 63
		username: "Nom d'utilisateur",                                                                                       // 64
		email: "Email",                                                                                                      // 65
		password: "Mot de passe"                                                                                             // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Nom d'utilisateur",                                                                                       // 69
		email: "Email",                                                                                                      // 70
		emailOpt: "Email (optionnel)",                                                                                       // 71
		password: "Mot de passe",                                                                                            // 72
		passwordAgain: "Mot de passe (confirmation)"                                                                         // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Mot de passe actuel",                                                                              // 76
		newPassword: "Nouveau mot de passe",                                                                                 // 77
		newPasswordAgain: "Nouveau mot de passe (confirmation)"                                                              // 78
	},                                                                                                                    // 79
	infoMessages: {                                                                                                       // 80
		sent: "Email envoyé",                                                                                                // 81
		passwordChanged: "Mot de passe modifié"                                                                              // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "Utilisateur non trouvé",                                                                              // 85
		invalidEmail: "L'adresse email est invalide",                                                                        // 86
		incorrectPassword: "Mot de passe incorrect",                                                                         // 87
		usernameTooShort: "Le nom d'utilisateur doit comporter au moins 3 caractères",                                       // 88
		passwordTooShort: "Le mot de passe doit comporter au moins 6 caractères",                                            // 89
		passwordsDontMatch: "Les mots de passe ne sont pas identiques",                                                      // 90
		newPasswordSameAsOld: "Le nouveau et le vieux mot de passe doivent être différent"                                   // 91
	}                                                                                                                     // 92
});                                                                                                                    // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/de.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("de", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Passwort zurücksetzen",                                                                                      // 3
		newPassword: "Neues Passwort",                                                                                       // 4
		newPasswordAgain: "Neues Passwort (wiederholen)",                                                                    // 5
		cancel: "Abbrechen",                                                                                                 // 6
		submit: "Passwort ändern"                                                                                            // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Passwort wählen",                                                                                            // 10
		newPassword: "Neues Passwort",                                                                                       // 11
		newPasswordAgain: "Neues Passwort (wiederholen)",                                                                    // 12
		cancel: "Schließen",                                                                                                 // 13
		submit: "Passwort ändern"                                                                                            // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "Email Adresse verifiziert",                                                                               // 17
		dismiss: "Schließen"                                                                                                 // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Schließen"                                                                                                 // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Passwort ändern",                                                                                         // 24
		signOut: "Abmelden"                                                                                                  // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Anmelden",                                                                                                  // 28
		up: "Registrieren"                                                                                                   // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "oder"                                                                                                           // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Erstellen",                                                                                                 // 35
		signIn: "Anmelden",                                                                                                  // 36
		forgot: "Passwort vergessen?",                                                                                       // 37
		createAcc: "Account erstellen"                                                                                       // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "Email",                                                                                                      // 41
		reset: "Passwort zurücksetzen",                                                                                      // 42
		invalidEmail: "Ungültige Email Adresse"                                                                              // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Abbrechen"                                                                                                    // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Passwort ändern",                                                                                           // 49
		cancel: "Abbrechen"                                                                                                  // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Anmelden mit",                                                                                          // 53
		configure: "Konfigurieren",                                                                                          // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Abmelden"                                                                                                  // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "Keine Anmelde Services konfiguriert"                                                               // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Benutzername oder Email",                                                                          // 63
		username: "Benutzername",                                                                                            // 64
		email: "Email",                                                                                                      // 65
		password: "Passwort"                                                                                                 // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Benutzername",                                                                                            // 69
		email: "Email",                                                                                                      // 70
		emailOpt: "Email (freiwillig)",                                                                                      // 71
		password: "Passwort",                                                                                                // 72
		passwordAgain: "Passwort (wiederholen)"                                                                              // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Aktuelles Passwort",                                                                               // 76
		newPassword: "Neues Passwort",                                                                                       // 77
		newPasswordAgain: "Neues Passwort (wiederholen)"                                                                     // 78
	},                                                                                                                    // 79
	infoMessages : {                                                                                                      // 80
		sent: "Email gesendet",                                                                                              // 81
		passwordChanged: "Passwort geändert"                                                                                 // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "Benutzer nicht gefunden",                                                                             // 85
		invalidEmail: "Ungültige Email Adresse",                                                                             // 86
		incorrectPassword: "Falsches Passwort",                                                                              // 87
		usernameTooShort: "Der Benutzername muss mindestens 3 Buchstaben lang sein",                                         // 88
		passwordTooShort: "Passwort muss mindestens 6 Zeichen lang sein",                                                    // 89
		passwordsDontMatch: "Die Passwörter stimmen nicht überein",                                                          // 90
		newPasswordSameAsOld: "Neue und aktuelle Passwörter müssen unterschiedlich sein"                                     // 91
	}                                                                                                                     // 92
});                                                                                                                    // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/it.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("it", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Reimposta la password",                                                                                      // 3
		newPassword: "Nuova password",                                                                                       // 4
		newPasswordAgain: "Nuova password (di nuovo)",                                                                       // 5
		cancel: "Annulla",                                                                                                   // 6
		submit: "Imposta password"                                                                                           // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Scegli una password",                                                                                        // 10
		newPassword: "Nuova password",                                                                                       // 11
		newPasswordAgain: "Nuova password (di nuovo)",                                                                       // 12
		cancel: "Chiudi",                                                                                                    // 13
		submit: "Imposta password"                                                                                           // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "Indirizzo email verificato",                                                                              // 17
		dismiss: "Chiudi"                                                                                                    // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Chiudi",                                                                                                   // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Cambia password",                                                                                         // 24
		signOut: "Esci"                                                                                                      // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Accedi",                                                                                                    // 28
		up: "Registrati"                                                                                                     // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "oppure"                                                                                                         // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Crea",                                                                                                      // 35
		signIn: "Accedi",                                                                                                    // 36
		forgot: "Password dimenticata?",                                                                                     // 37
		createAcc: "Crea un account"                                                                                         // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "Email",                                                                                                      // 41
		reset: "Reimposta la password",                                                                                      // 42
		invalidEmail: "Email non valida"                                                                                     // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Cancella"                                                                                                     // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Cambia password",                                                                                           // 49
		cancel: "Annulla"                                                                                                    // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Accedi con",                                                                                            // 53
		configure: "Configura",                                                                                              // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Esci"                                                                                                      // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "Nessun servizio di accesso configurato"                                                            // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Username o Email",                                                                                 // 63
		username: "Username",                                                                                                // 64
		email: "Email",                                                                                                      // 65
		password: "Password"                                                                                                 // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Username",                                                                                                // 69
		email: "Email",                                                                                                      // 70
		emailOpt: "Email (opzionale)",                                                                                       // 71
		password: "Password",                                                                                                // 72
		passwordAgain: "Password (di nuovo)"                                                                                 // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Password corrente",                                                                                // 76
		newPassword: "Nuova password",                                                                                       // 77
		newPasswordAgain: "Nuova password (di nuovo)"                                                                        // 78
	},                                                                                                                    // 79
	infoMessages: {                                                                                                       // 80
		sent: "Email inviata",                                                                                               // 81
		passwordChanged: "Password changed"                                                                                  // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "User not found",                                                                                      // 85
		invalidEmail: "Email non valida",                                                                                    // 86
		incorrectPassword: "Incorrect password",                                                                             // 87
		usernameTooShort: "La Username deve essere almeno di 3 caratteri",                                                   // 88
		passwordTooShort: "La Password deve essere almeno di 6 caratteri",                                                   // 89
		passwordsDontMatch: "Le password non corrispondono",                                                                 // 90
		newPasswordSameAsOld: "New and old passwords must be different"                                                      // 91
	}                                                                                                                     // 92
});                                                                                                                    // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/pt-PT.i18n.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
ptPT = {                                                                                                               // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Esqueci-me da palavra-passe",                                                                                // 3
		newPassword: "Nova palavra-passe",                                                                                   // 4
		newPasswordAgain: "Nova palavra-passe (confirmacao)",                                                                // 5
		cancel: "Cancelar",                                                                                                  // 6
		submit: "Alterar palavra-passe"                                                                                      // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Introduza a nova palavra-passe",                                                                             // 10
		newPassword: "Nova palavra-passe",                                                                                   // 11
		newPasswordAgain: "Nova palavra-passe (confirmacao)",                                                                // 12
		cancel: "Fechar",                                                                                                    // 13
		submit: "Alterar palavra-passe"                                                                                      // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "E-mail verificado!",                                                                                      // 17
		dismiss: "Ignorar"                                                                                                   // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Ignorar"                                                                                                   // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Mudar palavra-passe",                                                                                     // 24
		signOut: "Sair"                                                                                                      // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Entrar",                                                                                                    // 28
		up: "Registar"                                                                                                       // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "ou"                                                                                                             // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Criar",                                                                                                     // 35
		signIn: "Entrar",                                                                                                    // 36
		forgot: "Esqueci-me da palavra-passe",                                                                               // 37
		createAcc: "Registar"                                                                                                // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "E-mail",                                                                                                     // 41
		reset: "Alterar palavra-passe",                                                                                      // 42
		sent: "E-mail enviado",                                                                                              // 43
		invalidEmail: "E-mail inválido"                                                                                      // 44
	},                                                                                                                    // 45
	loginButtonsBackToLoginLink: {                                                                                        // 46
		back: "Cancelar"                                                                                                     // 47
	},                                                                                                                    // 48
	loginButtonsChangePassword: {                                                                                         // 49
		submit: "Mudar palavra-passe",                                                                                       // 50
		cancel: "Cancelar"                                                                                                   // 51
	},                                                                                                                    // 52
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 53
		signInWith: "Entrar com",                                                                                            // 54
		configure: "Configurar"                                                                                              // 55
	},                                                                                                                    // 56
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 57
		signOut: "Sair"                                                                                                      // 58
	},                                                                                                                    // 59
	loginButtonsLoggedOut: {                                                                                              // 60
		noLoginServices: "Nenhum servico de login configurado"                                                               // 61
	},                                                                                                                    // 62
	loginFields: {                                                                                                        // 63
		usernameOrEmail: "Utilizador ou E-mail",                                                                             // 64
		username: "Utilizador",                                                                                              // 65
		email: "E-mail",                                                                                                     // 66
		password: "Palavra-passe"                                                                                            // 67
	},                                                                                                                    // 68
	signupFields: {                                                                                                       // 69
		username: "Utilizador",                                                                                              // 70
		email: "E-mail",                                                                                                     // 71
		emailOpt: "E-mail (opcional)",                                                                                       // 72
		password: "Palavra-passe",                                                                                           // 73
		passwordAgain: "Palavra-passe (confirmacão)"                                                                         // 74
	},                                                                                                                    // 75
	changePasswordFields: {                                                                                               // 76
		currentPassword: "Palavra-passe atual",                                                                              // 77
		newPassword: "Nova palavra-passe",                                                                                   // 78
		newPasswordAgain: "Nova palavra-passe (confirmacao)"                                                                 // 79
	},                                                                                                                    // 80
	infoMessages: {                                                                                                       // 81
		sent: "E-mail enviado",                                                                                              // 82
		passwordChanged: "Palavra-passe alterada"                                                                            // 83
	},                                                                                                                    // 84
	errorMessages: {                                                                                                      // 85
		usernameTooShort: "Utilizador precisa de ter mais de 3 caracteres",                                                  // 86
		invalidEmail: "E-mail inválido",                                                                                     // 87
		passwordTooShort: "Palavra-passe precisa ter mais de 6 caracteres",                                                  // 88
		passwordsDontMatch: "As Palavras-passe estão diferentes",                                                            // 89
		userNotFound: "Utilizador não encontrado",                                                                           // 90
		incorrectPassword: "Palavra-passe incorreta",                                                                        // 91
		newPasswordSameAsOld: "A nova palavra-passe tem de ser diferente da antiga"                                          // 92
	}                                                                                                                     // 93
};                                                                                                                     // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/pt-BR.i18n.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
ptBR = {                                                                                                               // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Esqueceu sua senha?",                                                                                        // 3
		newPassword: "Nova senha",                                                                                           // 4
		newPasswordAgain: "Nova senha (confirmacao)",                                                                        // 5
		cancel: "Cancelar",                                                                                                  // 6
		submit: "Alterar senha"                                                                                              // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Digite a nova senha",                                                                                        // 10
		newPassword: "Nova senha",                                                                                           // 11
		newPasswordAgain: "Nova senha (confirmacao)",                                                                        // 12
		cancel: "Fechar",                                                                                                    // 13
		submit: "Alterar senha"                                                                                              // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "E-mail verificado!",                                                                                      // 17
		dismiss: "Ignorar"                                                                                                   // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Ignorar"                                                                                                   // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Mudar senha",                                                                                             // 24
		signOut: "Sair"                                                                                                      // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Entrar",                                                                                                    // 28
		up: "Cadastrar"                                                                                                      // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "ou"                                                                                                             // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Criar",                                                                                                     // 35
		signIn: "Login",                                                                                                     // 36
		forgot: "Esqueceu sua senha?",                                                                                       // 37
		createAcc: "Cadastrar"                                                                                               // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "E-mail",                                                                                                     // 41
		reset: "Alterar senha",                                                                                              // 42
		invalidEmail: "E-mail inválido"                                                                                      // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Cancelar"                                                                                                     // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Mudar senha",                                                                                               // 49
		cancel: "Cancelar"                                                                                                   // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Logar com",                                                                                             // 53
		configure: "Configurar",                                                                                             // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Sair"                                                                                                      // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "Nenhum servico de login configurado"                                                               // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Usuário ou E-mail",                                                                                // 63
		username: "Usuário",                                                                                                 // 64
		email: "E-mail",                                                                                                     // 65
		password: "Senha"                                                                                                    // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Usuário",                                                                                                 // 69
		email: "E-mail",                                                                                                     // 70
		emailOpt: "E-mail (opcional)",                                                                                       // 71
		password: "Senha",                                                                                                   // 72
		passwordAgain: "Senha (confirmacão)"                                                                                 // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Senha atual",                                                                                      // 76
		newPassword: "Nova Senha",                                                                                           // 77
		newPasswordAgain: "Nova Senha (confirmacao)"                                                                         // 78
	},                                                                                                                    // 79
	infoMessages: {                                                                                                       // 80
		sent: "E-mail enviado",                                                                                              // 81
		passwordChanged: "Senha alterada"                                                                                    // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "Usuário não encontrado",                                                                              // 85
		invalidEmail: "E-mail inválido",                                                                                     // 86
		incorrectPassword: "Senha incorreta",                                                                                // 87
		usernameTooShort: "Usuário precisa ter mais de 3 caracteres",                                                        // 88
		passwordTooShort: "Senha precisa ter mais de 6 caracteres",                                                          // 89
		passwordsDontMatch: "Senhas estão diferentes",                                                                       // 90
		newPasswordSameAsOld: "A nova senha tem de ser diferente da antiga"                                                  // 91
	}                                                                                                                     // 92
};                                                                                                                     // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/pt.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map('pt', ptPT);                                                                                                  // 1
i18n.map('pt-PT', ptPT);                                                                                               // 2
i18n.map('pt-BR', ptBR);                                                                                               // 3
                                                                                                                       // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/ru.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("ru", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Сбросить пароль",                                                                                            // 3
		newPassword: "Новый пароль",                                                                                         // 4
		newPasswordAgain: "Новый пароль (еще раз)",                                                                          // 5
		cancel: "Отмена",                                                                                                    // 6
		submit: "Сохранить пароль"                                                                                           // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Выбрать пароль",                                                                                             // 10
		newPassword: "Новый пароль",                                                                                         // 11
		newPasswordAgain: "Новый пароль (еще раз)",                                                                          // 12
		cancel: "Отмена",                                                                                                    // 13
		submit: "Сохранить пароль"                                                                                           // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "Email подтвержден",                                                                                       // 17
	    dismiss: "Закрыть"                                                                                                // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
	    dismiss: "Закрыть"                                                                                                // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Изменить пароль",                                                                                         // 24
		signOut: "Выйти"                                                                                                     // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Войти",                                                                                                     // 28
		up: "Зарегистрироваться"                                                                                             // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "или"                                                                                                            // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Создать",                                                                                                   // 35
		signIn: "Войти",                                                                                                     // 36
		forgot: "Забыли пароль?",                                                                                            // 37
		createAcc: "Создать аккаунт"                                                                                         // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "Email",                                                                                                      // 41
		reset: "Сбросить пароль",                                                                                            // 42
		invalidEmail: "Некорректный email"                                                                                   // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Отмена"                                                                                                       // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Изменить пароль",                                                                                           // 49
		cancel: "Отмена"                                                                                                     // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Войти через",                                                                                           // 53
		configure: "Настроить вход через",                                                                                   // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Выйти"                                                                                                     // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "Сервис для входа не настроен"                                                                      // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Имя пользователя или email",                                                                       // 63
		username: "Имя пользователя",                                                                                        // 64
		email: "Email",                                                                                                      // 65
		password: "Пароль"                                                                                                   // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Имя пользователя",                                                                                        // 69
		email: "Email",                                                                                                      // 70
		emailOpt: "Email (необязательный)",                                                                                  // 71
		password: "Пароль",                                                                                                  // 72
		passwordAgain: "Пароль (еще раз)"                                                                                    // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Текущий пароль",                                                                                   // 76
		newPassword: "Новый пароль",                                                                                         // 77
		newPasswordAgain: "Новый пароль (еще раз)"                                                                           // 78
	},                                                                                                                    // 79
	infoMessages : {                                                                                                      // 80
		sent: "Вам отправлено письмо",                                                                                       // 81
		passwordChanged: "Пароль изменён"                                                                                    // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "Пользователь не найден",                                                                              // 85
		invalidEmail: "Некорректный email",                                                                                  // 86
		incorrectPassword: "Неправильный пароль",                                                                            // 87
		usernameTooShort: "Имя пользователя должно быть длиной не менее 3-х символов",                                       // 88
		passwordTooShort: "Пароль должен быть длиной не менее 6-ти символов",                                                // 89
		passwordsDontMatch: "Пароли не совпадают",                                                                           // 90
		newPasswordSameAsOld: "Новый и старый пароли должны быть разными"                                                    // 91
	}                                                                                                                     // 92
});                                                                                                                    // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/el.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("el", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Ακύρωση κωδικού",                                                                                            // 3
		newPassword: "Νέος κωδικός",                                                                                         // 4
		newPasswordAgain: "Νέος Κωδικός (ξανά)",                                                                             // 5
		cancel: "Ακύρωση",                                                                                                   // 6
		submit: "Ορισμός κωδικού"                                                                                            // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Επιλέξτε κωδικό",                                                                                            // 10
		newPassword: "Νέος κωδικός",                                                                                         // 11
		newPasswordAgain: "Νέος Κωδικός (ξανά)",                                                                             // 12
		cancel: "Ακύρωση",                                                                                                   // 13
		submit: "Ορισμός κωδικού"                                                                                            // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "Ο λογαριασμός ηλεκτρονικού ταχυδρομείου έχει επιβεβαιωθεί",                                               // 17
		dismiss: "Κλείσιμο"                                                                                                  // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Κλείσιμο",                                                                                                 // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Αλλαγή κωδικού",                                                                                          // 24
		signOut: "Αποσύνδεση"                                                                                                // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Είσοδος",                                                                                                   // 28
		up: "Εγγραφή"                                                                                                        // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "ή"                                                                                                              // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Δημιουργία",                                                                                                // 35
		signIn: "Είσοδος",                                                                                                   // 36
		forgot: "Ξεχάσατε τον κωδικό σας;",                                                                                  // 37
		createAcc: "Δημιουργία λογαριασμού"                                                                                  // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "Ηλεκτρονικό ταχυδρομείο (email)",                                                                            // 41
		reset: "Ακύρωση κωδικού",                                                                                            // 42
		invalidEmail: "Μη έγκυρος λογαριασμός ηλεκτρονικού ταχυδρομείου (email)"                                             // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Επιστροφή"                                                                                                    // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Αλλαγή κωδικού",                                                                                            // 49
		cancel: "Ακύρωση"                                                                                                    // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Είσοδος με",                                                                                            // 53
		configure: "Διαμόρφωση",                                                                                             // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Αποσύνδεση"                                                                                                // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "Δεν έχουν διαμορφωθεί υπηρεσίες εισόδου"                                                           // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Όνομα χρήστη ή Λογαριασμός Ηλεκτρονικού Ταχυδρομείου",                                             // 63
		username: "Όνομα χρήστη",                                                                                            // 64
		email: "Ηλεκτρονικό ταχυδρομείο (email)",                                                                            // 65
		password: "Κωδικός"                                                                                                  // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Όνομα χρήστη",                                                                                            // 69
		email: "Ηλεκτρονικό ταχυδρομείο (email)",                                                                            // 70
		emailOpt: "Ηλεκτρονικό ταχυδρομείο (προαιρετικό)",                                                                   // 71
		password: "Κωδικός",                                                                                                 // 72
		passwordAgain: "Κωδικός (ξανά)"                                                                                      // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Ισχύων Κωδικός",                                                                                   // 76
		newPassword: "Νέος Κωδικός",                                                                                         // 77
		newPasswordAgain: "Νέος Κωδικός (ξανά)"                                                                              // 78
	},                                                                                                                    // 79
	infoMessages: {                                                                                                       // 80
		emailSent: "Το email έχει αποσταλεί",                                                                                // 81
		passwordChanged: "Password changed"                                                                                  // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "User not found",                                                                                      // 85
		invalidEmail: "Μη έγκυρος λογαριασμός ηλεκτρονικού ταχυδρομείου (email)",                                            // 86
		incorrectPassword: "Incorrect password",                                                                             // 87
		usernameTooShort: "Το όνομα χρήστη πρέπει να είναι τουλάχιστον 3 χαρακτήρες",                                        // 88
		passwordTooShort: "Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες",                                              // 89
		passwordsDontMatch: "Οι κωδικοί δεν ταιριάζουν",                                                                     // 90
		newPasswordSameAsOld: "New and old passwords must be different"                                                      // 91
	}                                                                                                                     // 92
});                                                                                                                    // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/ko.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("ko", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "비밀번호 초기화하기",                                                                                                 // 3
		newPassword: "새로운 비밀번호",                                                                                             // 4
		newPasswordAgain: "새로운 비밀번호 (확인)",                                                                                   // 5
		cancel: "취소",                                                                                                        // 6
		submit: "변경"                                                                                                         // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "비밀번호를 입력해주세요",                                                                                               // 10
		newPassword: "새로운 비밀번호",                                                                                             // 11
		newPasswordAgain: "새로운 비밀번호 (확인)",                                                                                   // 12
		cancel: "닫기",                                                                                                        // 13
		submit: "변경"                                                                                                         // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "이메일 주소가 인증되었습니다",                                                                                         // 17
		dismiss: "취소"                                                                                                        // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "취소",                                                                                                       // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "비밀번호 변경하기",                                                                                               // 24
		signOut: "로그아웃"                                                                                                      // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "로그인",                                                                                                       // 28
		up: "계정 만들기"                                                                                                         // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "또는"                                                                                                             // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "만들기",                                                                                                       // 35
		signIn: "로그인",                                                                                                       // 36
		forgot: "비밀번호를 잊어버리셨나요?",                                                                                            // 37
		createAcc: "계정 만들기"                                                                                                  // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "이메일 주소",                                                                                                     // 41
		reset: "비밀번호 초기화하기",                                                                                                 // 42
		invalidEmail: "올바르지 않은 이메일 주소입니다"                                                                                    // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "취소"                                                                                                           // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "비밀번호 변경하기",                                                                                                 // 49
		cancel: "취소"                                                                                                         // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "다음으로 로그인하기:",                                                                                           // 53
		configure: "설정",                                                                                                     // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "로그아웃"                                                                                                      // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "사용 가능한 로그인 서비스가 없습니다"                                                                              // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "사용자 이름 또는 이메일 주소",                                                                                 // 63
		username: "사용자 이름",                                                                                                  // 64
		email: "이메일 주소",                                                                                                     // 65
		password: "비밀번호"                                                                                                     // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "사용자 이름",                                                                                                  // 69
		email: "이메일 주소",                                                                                                     // 70
		emailOpt: "이메일 주소 (선택)",                                                                                             // 71
		password: "비밀번호",                                                                                                    // 72
		passwordAgain: "비밀번호 (확인)"                                                                                           // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "현재 비밀번호",                                                                                          // 76
		newPassword: "새로운 비밀번호",                                                                                             // 77
		newPasswordAgain: "새로운 비밀번호 (확인)"                                                                                    // 78
	},                                                                                                                    // 79
	infoMessages: {                                                                                                       // 80
		sent: "이메일이 발송되었습니다",                                                                                                // 81
		passwordChanged: "비밀번호가 변경되었습니다"                                                                                     // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "찾을 수 없는 회원입니다",                                                                                       // 85
		invalidEmail: "잘못된 이메일 주소",                                                                                          // 86
		incorrectPassword: "비밀번호가 틀렸습니다",                                                                                    // 87
		usernameTooShort: "사용자 이름은 최소 3글자 이상이어야 합니다",                                                                        // 88
		passwordTooShort: "비밀번호는 최소 6글자 이상이어야 합니다",                                                                          // 89
		passwordsDontMatch: "비밀번호가 같지 않습니다",                                                                                 // 90
		newPasswordSameAsOld: "새 비밀번호와 기존 비밀번호는 달라야합니다"                                                                      // 91
	}                                                                                                                     // 92
});                                                                                                                    // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/ar.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("ar", {                                                                                                       // 1
  resetPasswordDialog: {                                                                                               // 2
    title: "استرجع كلمة المرور",                                                                                       // 3
    newPassword: "كلمة المرور الجديدة",                                                                                // 4
    newPasswordAgain: "أعد كتابة كلمة السر الجديدة",                                                                   // 5
    cancel: "إلغ",                                                                                                     // 6
    submit: "تم"                                                                                                       // 7
  },                                                                                                                   // 8
  enrollAccountDialog: {                                                                                               // 9
    title: "اختر كلمة سر",                                                                                             // 10
    newPassword: "كلمة السر",                                                                                          // 11
    newPasswordAgain: "أعد كتابة كلمة السر الجديدة",                                                                   // 12
    cancel: "أغلق",                                                                                                    // 13
    submit: "تم"                                                                                                       // 14
  },                                                                                                                   // 15
  justVerifiedEmailDialog: {                                                                                           // 16
    verified: "تم تأكيد البريد",                                                                                       // 17
    dismiss:  "حسنًا"                                                                                                  // 18
  },                                                                                                                   // 19
  loginButtonsMessagesDialog: {                                                                                        // 20
    dismiss: "حسنًا"                                                                                                   // 21
  },                                                                                                                   // 22
  loginButtonsLoggedInDropdownActions: {                                                                               // 23
    password: "غير كلمة السر",                                                                                         // 24
    signOut: "تسجيل الخروج"                                                                                            // 25
  },                                                                                                                   // 26
  loginButtonsLoggedOutDropdown: {                                                                                     // 27
    signIn: "دخول",                                                                                                    // 28
    up: "إنشاء حساب"                                                                                                   // 29
  },                                                                                                                   // 30
  loginButtonsLoggedOutPasswordServiceSeparator: {                                                                     // 31
    or: "أو"                                                                                                           // 32
  },                                                                                                                   // 33
  loginButtonsLoggedOutPasswordService: {                                                                              // 34
    create: "أنشئ",                                                                                                    // 35
    signIn: "دخول",                                                                                                    // 36
    forgot: "نسيت كلمة السر؟",                                                                                         // 37
    createAcc: "أنشئ حسابا"                                                                                            // 38
  },                                                                                                                   // 39
  forgotPasswordForm: {                                                                                                // 40
    email: "البريد",                                                                                                   // 41
    reset: "إعادة تعين كلمة السر",                                                                                     // 42
    invalidEmail: "البريد خاطئ"                                                                                        // 43
  },                                                                                                                   // 44
  loginButtonsBackToLoginLink: {                                                                                       // 45
    back: "إلغ"                                                                                                        // 46
  },                                                                                                                   // 47
  loginButtonsChangePassword: {                                                                                        // 48
    submit: "غير كلمة السر",                                                                                           // 49
    cancel: "إلغ"                                                                                                      // 50
  },                                                                                                                   // 51
  loginButtonsLoggedOutSingleLoginButton: {                                                                            // 52
    signInWith: "سجل الدخول عبر",                                                                                      // 53
    configure: "تعيين"                                                                                                 // 54
  },                                                                                                                   // 55
  loginButtonsLoggedInSingleLogoutButton: {                                                                            // 56
    signOut: "اخرج"                                                                                                    // 57
  },                                                                                                                   // 58
  loginButtonsLoggedOut: {                                                                                             // 59
    noLoginServices: "لا يوجد خدمة دخول مفعله"                                                                         // 60
  },                                                                                                                   // 61
  loginFields: {                                                                                                       // 62
    usernameOrEmail: "اسم المستخدم او عنوان البريد",                                                                   // 63
    username: "اسم المستخدم",                                                                                          // 64
    email: "البريد",                                                                                                   // 65
    password: "كلمة السر"                                                                                              // 66
  },                                                                                                                   // 67
  signupFields: {                                                                                                      // 68
    username: "اسم المستخدم",                                                                                          // 69
    email: "البريد",                                                                                                   // 70
    emailOpt: "-اختياري- البريد",                                                                                      // 71
    password: "كلمة السر",                                                                                             // 72
    passwordAgain: "أعد كتابة كلمة السر"                                                                               // 73
  },                                                                                                                   // 74
  changePasswordFields: {                                                                                              // 75
    currentPassword: "كلمة السر الحالية",                                                                              // 76
    newPassword: "كلمة السر الجديدة",                                                                                  // 77
    newPasswordAgain: "أعد كتابة كلمة السر الجديدة"                                                                    // 78
  },                                                                                                                   // 79
  infoMessages : {                                                                                                     // 80
    emailSent: "تم الارسال",                                                                                           // 81
    passwordChanged: "تمت إعادة تعيين كلمة السر"                                                                       // 82
  },                                                                                                                   // 83
  errorMessages: {                                                                                                     // 84
    userNotFound: "المستخدم غير موجود",                                                                                // 85
    invalidEmail: "بريد خاطئ",                                                                                         // 86
    incorrectPassword: "كلمة السر خطأ",                                                                                // 87
    usernameTooShort: "اسم المستخدم لابد ان يكون علي الاقل ٣ حروف",                                                    // 88
    passwordTooShort: "كلمة السر لابد ان تكون علي الاقل ٦ احرف",                                                       // 89
    passwordsDontMatch: "كلمة السر غير متطابقة",                                                                       // 90
    newPasswordSameAsOld: "لابد من اختيار كلمة سر مختلفة عن السابقة",                                                  // 91
    signupsForbidden: "التسجيل مغلق"                                                                                   // 92
  }                                                                                                                    // 93
});                                                                                                                    // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/pl.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("pl", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Resetuj hasło",                                                                                              // 3
		newPassword: "Nowe hasło",                                                                                           // 4
		newPasswordAgain: "Nowe hasło (powtórz)",                                                                            // 5
		cancel: "Anuluj",                                                                                                    // 6
		submit: "Ustaw hasło"                                                                                                // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Wybierz hasło",                                                                                              // 10
		newPassword: "Nowe hasło",                                                                                           // 11
		newPasswordAgain: "Nowe hasło (powtórz)",                                                                            // 12
		cancel: "Zamknij",                                                                                                   // 13
		submit: "Ustaw hasło"                                                                                                // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "Adres email został zweryfikowany",                                                                        // 17
		dismiss: "Odrzuć"                                                                                                    // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Odrzuć"                                                                                                    // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Zmień hasło",                                                                                             // 24
		signOut: "Wyloguj się"                                                                                               // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Zaloguj się",                                                                                               // 28
		up: "Zarejestruj się"                                                                                                // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "lub"                                                                                                            // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Stwórz",                                                                                                    // 35
		signIn: "Zaloguj się ",                                                                                              // 36
		forgot: "Nie pamiętasz hasła?",                                                                                      // 37
		createAcc: "Utwórz konto"                                                                                            // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "Email",                                                                                                      // 41
		reset: "Resetuj hasło",                                                                                              // 42
		invalidEmail: "Niepoprawny email"                                                                                    // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Anuluj"                                                                                                       // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Zmień hasło",                                                                                               // 49
		cancel: "Anuluj"                                                                                                     // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Zaloguj się przez",                                                                                     // 53
		configure: "Configure"                                                                                               // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Wyloguj się"                                                                                               // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "Nie skonfigurowano usługi logowania"                                                               // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Nazwa użytkownika lub email",                                                                      // 63
		username: "Nazwa użytkownika",                                                                                       // 64
		email: "Email",                                                                                                      // 65
		password: "Hasło"                                                                                                    // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Nazwa użytkownika",                                                                                       // 69
		email: "Email",                                                                                                      // 70
		emailOpt: "Email (opcjonalnie)",                                                                                     // 71
		password: "Hasło",                                                                                                   // 72
		passwordAgain: "Hasło (powtórz)"                                                                                     // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Obecne hasło",                                                                                     // 76
		newPassword: "Nowe hasło",                                                                                           // 77
		newPasswordAgain: "Nowe hasło (powtórz)"                                                                             // 78
	},                                                                                                                    // 79
	infoMessages : {                                                                                                      // 80
		emailSent: "Wysłano email",                                                                                          // 81
		passwordChanged: "Hasło zostało zmienione"                                                                           // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "Nie znaleziono użytkownika",                                                                          // 85
		invalidEmail: "Niepoprawny email",                                                                                   // 86
		incorrectPassword: "Niepoprawne hasło",                                                                              // 87
		usernameTooShort: "Nazwa użytkowika powinna mieć przynajmniej 3 znaki",                                              // 88
		passwordTooShort: "Hasło powinno składać się przynajmnej z 6 znaków",                                                // 89
		passwordsDontMatch: "Hasło są różne",                                                                                // 90
		newPasswordSameAsOld: "Nowe hasło musi się różnić od starego",                                                       // 91
		signupsForbidden: "Rejstracja wyłączona"                                                                             // 92
	}                                                                                                                     // 93
});                                                                                                                    // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/zh-CN.i18n.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
zhCN = {                                                                                                               // 1
    resetPasswordDialog: {                                                                                             // 2
        title: "重置密码",                                                                                                 // 3
        newPassword: "新密码",                                                                                            // 4
        newPasswordAgain: "重复新密码",                                                                                     // 5
        cancel: "取消",                                                                                                  // 6
        submit: "确定"                                                                                                   // 7
    },                                                                                                                 // 8
    enrollAccountDialog: {                                                                                             // 9
        title: "选择一个密码",                                                                                               // 10
        newPassword: "新密码",                                                                                            // 11
        newPasswordAgain: "重复新密码",                                                                                     // 12
        cancel: "取消",                                                                                                  // 13
        submit: "确定"                                                                                                   // 14
    },                                                                                                                 // 15
    justVerifiedEmailDialog: {                                                                                         // 16
        verified: "Email地址验证",                                                                                         // 17
        dismiss: "失败"                                                                                                  // 18
    },                                                                                                                 // 19
    loginButtonsMessagesDialog: {                                                                                      // 20
        dismiss: "失败"                                                                                                  // 21
    },                                                                                                                 // 22
    loginButtonsLoggedInDropdownActions: {                                                                             // 23
        password: "更改密码",                                                                                              // 24
        signOut: "退出"                                                                                                  // 25
    },                                                                                                                 // 26
    loginButtonsLoggedOutDropdown: {                                                                                   // 27
        signIn: "登录",                                                                                                  // 28
        up: "注册"                                                                                                       // 29
    },                                                                                                                 // 30
    loginButtonsLoggedOutPasswordServiceSeparator: {                                                                   // 31
        or: "或"                                                                                                        // 32
    },                                                                                                                 // 33
    loginButtonsLoggedOutPasswordService: {                                                                            // 34
        create: "新建",                                                                                                  // 35
        signIn: "登陆",                                                                                                  // 36
        forgot: "忘记密码?",                                                                                               // 37
        createAcc: "新建用户"                                                                                              // 38
    },                                                                                                                 // 39
    forgotPasswordForm: {                                                                                              // 40
        email: "Email",                                                                                                // 41
        reset: "重置密码",                                                                                                 // 42
        invalidEmail: "email格式不正确"                                                                                     // 43
    },                                                                                                                 // 44
    loginButtonsBackToLoginLink: {                                                                                     // 45
        back: "取消"                                                                                                     // 46
    },                                                                                                                 // 47
    loginButtonsChangePassword: {                                                                                      // 48
        submit: "更改密码",                                                                                                // 49
        cancel: "取消"                                                                                                   // 50
    },                                                                                                                 // 51
    loginButtonsLoggedOutSingleLoginButton: {                                                                          // 52
        signInWith: "登陆以",                                                                                             // 53
        configure: "配置"                                                                                                // 54
    },                                                                                                                 // 55
    loginButtonsLoggedInSingleLogoutButton: {                                                                          // 56
        signOut: "退出"                                                                                                  // 57
    },                                                                                                                 // 58
    loginButtonsLoggedOut: {                                                                                           // 59
        noLoginServices: "没有配置登录服务"                                                                                    // 60
    },                                                                                                                 // 61
    loginFields: {                                                                                                     // 62
        usernameOrEmail: "用户名或者Email",                                                                                 // 63
        username: "用户名",                                                                                               // 64
        email: "Email",                                                                                                // 65
        password: "密码"                                                                                                 // 66
    },                                                                                                                 // 67
    signupFields: {                                                                                                    // 68
        username: "用户名",                                                                                               // 69
        email: "Email",                                                                                                // 70
        emailOpt: "Email (可选)",                                                                                        // 71
        password: "密码",                                                                                                // 72
        passwordAgain: "重复密码"                                                                                          // 73
    },                                                                                                                 // 74
    changePasswordFields: {                                                                                            // 75
        currentPassword: "当前密码",                                                                                       // 76
        newPassword: "新密码",                                                                                            // 77
        newPasswordAgain: "重复新密码"                                                                                      // 78
    },                                                                                                                 // 79
    infoMessages: {                                                                                                    // 80
        emailSent: "发送Email",                                                                                          // 81
        passwordChanged: "密码更改成功"                                                                                      // 82
    },                                                                                                                 // 83
    errorMessages: {                                                                                                   // 84
        userNotFound: "用户不存在",                                                                                         // 85
        invalidEmail: "Email格式不正确",                                                                                    // 86
        incorrectPassword: "密码错误",                                                                                     // 87
        usernameTooShort: "用户名必需大于3位",                                                                                 // 88
        passwordTooShort: "密码必需大于6位",                                                                                  // 89
        passwordsDontMatch: "密码输入不一致",                                                                                 // 90
        newPasswordSameAsOld: "新密码和旧的不能一样",                                                                            // 91
        signupsForbidden: "没有权限"                                                                                       // 92
    }                                                                                                                  // 93
};                                                                                                                     // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/zh-TW.i18n.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
zhTW = {                                                                                                               // 1
    resetPasswordDialog: {                                                                                             // 2
        title: "重設密碼",                                                                                                 // 3
        newPassword: "新密碼",                                                                                            // 4
        newPasswordAgain: "重複新密碼",                                                                                     // 5
        cancel: "取消",                                                                                                  // 6
        submit: "確定"                                                                                                   // 7
    },                                                                                                                 // 8
    enrollAccountDialog: {                                                                                             // 9
        title: "選擇一個密碼",                                                                                               // 10
        newPassword: "新密碼",                                                                                            // 11
        newPasswordAgain: "重複新密碼",                                                                                     // 12
        cancel: "取消",                                                                                                  // 13
        submit: "確定"                                                                                                   // 14
    },                                                                                                                 // 15
    justVerifiedEmailDialog: {                                                                                         // 16
        verified: "Email驗證",                                                                                           // 17
        dismiss: "失敗"                                                                                                  // 18
    },                                                                                                                 // 19
    loginButtonsMessagesDialog: {                                                                                      // 20
        dismiss: "失敗"                                                                                                  // 21
    },                                                                                                                 // 22
    loginButtonsLoggedInDropdownActions: {                                                                             // 23
        password: "更改密碼",                                                                                              // 24
        signOut: "登出"                                                                                                  // 25
    },                                                                                                                 // 26
    loginButtonsLoggedOutDropdown: {                                                                                   // 27
        signIn: "登入",                                                                                                  // 28
        up: "註冊"                                                                                                       // 29
    },                                                                                                                 // 30
    loginButtonsLoggedOutPasswordServiceSeparator: {                                                                   // 31
        or: "或"                                                                                                        // 32
    },                                                                                                                 // 33
    loginButtonsLoggedOutPasswordService: {                                                                            // 34
        create: "新建",                                                                                                  // 35
        signIn: "登入",                                                                                                  // 36
        forgot: "忘记密碼?",                                                                                               // 37
        createAcc: "新建用户"                                                                                              // 38
    },                                                                                                                 // 39
    forgotPasswordForm: {                                                                                              // 40
        email: "Email",                                                                                                // 41
        reset: "重設密碼",                                                                                                 // 42
        invalidEmail: "email格式不正確"                                                                                     // 43
    },                                                                                                                 // 44
    loginButtonsBackToLoginLink: {                                                                                     // 45
        back: "取消"                                                                                                     // 46
    },                                                                                                                 // 47
    loginButtonsChangePassword: {                                                                                      // 48
        submit: "更改密碼",                                                                                                // 49
        cancel: "取消"                                                                                                   // 50
    },                                                                                                                 // 51
    loginButtonsLoggedOutSingleLoginButton: {                                                                          // 52
        signInWith: "登入以",                                                                                             // 53
        configure: "設定"                                                                                                // 54
    },                                                                                                                 // 55
    loginButtonsLoggedInSingleLogoutButton: {                                                                          // 56
        signOut: "退出"                                                                                                  // 57
    },                                                                                                                 // 58
    loginButtonsLoggedOut: {                                                                                           // 59
        noLoginServices: "沒有設定登入服务"                                                                                    // 60
    },                                                                                                                 // 61
    loginFields: {                                                                                                     // 62
        usernameOrEmail: "用户名或者Email",                                                                                 // 63
        username: "用户名",                                                                                               // 64
        email: "Email",                                                                                                // 65
        password: "密碼"                                                                                                 // 66
    },                                                                                                                 // 67
    signupFields: {                                                                                                    // 68
        username: "用户名",                                                                                               // 69
        email: "Email",                                                                                                // 70
        emailOpt: "Email (可選)",                                                                                        // 71
        password: "密碼",                                                                                                // 72
        passwordAgain: "重複密碼"                                                                                          // 73
    },                                                                                                                 // 74
    changePasswordFields: {                                                                                            // 75
        currentPassword: "目前密碼",                                                                                       // 76
        newPassword: "新密碼",                                                                                            // 77
        newPasswordAgain: "重複新密碼"                                                                                      // 78
    },                                                                                                                 // 79
    infoMessages: {                                                                                                    // 80
        emailSent: "發送Email",                                                                                          // 81
        passwordChanged: "密碼更改成功"                                                                                      // 82
    },                                                                                                                 // 83
    errorMessages: {                                                                                                   // 84
        userNotFound: "用户不存在",                                                                                         // 85
        invalidEmail: "Email格式不正確",                                                                                    // 86
        incorrectPassword: "密碼错误",                                                                                     // 87
        usernameTooShort: "用户名必需大于3位",                                                                                 // 88
        passwordTooShort: "密碼必需大于6位",                                                                                  // 89
        passwordsDontMatch: "密碼输入不一致",                                                                                 // 90
        newPasswordSameAsOld: "新密碼和舊的不能一樣",                                                                            // 91
        signupsForbidden: "沒有權限"                                                                                       // 92
    }                                                                                                                  // 93
};                                                                                                                     // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/zh.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("zh", zhCN);                                                                                                  // 1
i18n.map("zh-CN", zhCN);                                                                                               // 2
i18n.map("zh-TW", zhTW);                                                                                               // 3
                                                                                                                       // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/nl.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("nl", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "Wachtwoord resetten",                                                                                        // 3
		newPassword: "Nieuw wachtwoord",                                                                                     // 4
		newPasswordAgain: "Nieuw wachtwoord (opnieuw)",                                                                      // 5
		cancel: "Annuleren",                                                                                                 // 6
		submit: "Wachtwoord instellen"                                                                                       // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "Stel een wachtwoord in",                                                                                     // 10
		newPassword: "Nieuw wachtwoord",                                                                                     // 11
		newPasswordAgain: "Nieuw wachtwoord (opnieuw)",                                                                      // 12
		cancel: "Sluiten",                                                                                                   // 13
		submit: "Wachtwoord instellen"                                                                                       // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "E-mailadres geverifieerd",                                                                                // 17
		dismiss: "Sluiten"                                                                                                   // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "Sluiten",                                                                                                  // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "Wachtwoord veranderen",                                                                                   // 24
		signOut: "Afmelden"                                                                                                  // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "Aanmelden",                                                                                                 // 28
		up: "Registreren"                                                                                                    // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "of"                                                                                                             // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "Aanmaken",                                                                                                  // 35
		signIn: "Aanmelden",                                                                                                 // 36
		forgot: "Wachtwoord vergeten?",                                                                                      // 37
		createAcc: "Account aanmaken"                                                                                        // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "E-mailadres",                                                                                                // 41
		reset: "Wachtwoord opnieuw instellen",                                                                               // 42
		invalidEmail: "Ongeldig e-mailadres"                                                                                 // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "Annuleren"                                                                                                    // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "Wachtwoord veranderen",                                                                                     // 49
		cancel: "Annuleren"                                                                                                  // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "Aanmelden via",                                                                                         // 53
		configure: "Instellen",                                                                                              // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "Afmelden"                                                                                                  // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "Geen aanmelddienst ingesteld"                                                                      // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "Gebruikersnaam of e-mailadres",                                                                    // 63
		username: "Gebruikersnaam",                                                                                          // 64
		email: "E-mailadres",                                                                                                // 65
		password: "Wachtwoord"                                                                                               // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "Gebruikersnaam",                                                                                          // 69
		email: "E-mailadres",                                                                                                // 70
		emailOpt: "E-mailadres (niet verplicht)",                                                                            // 71
		password: "Wachtwoord",                                                                                              // 72
		passwordAgain: "Wachtwoord (opnieuw)"                                                                                // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "Huidig wachtwoord",                                                                                // 76
		newPassword: "Nieuw wachtwoord",                                                                                     // 77
		newPasswordAgain: "Nieuw wachtwoord (opnieuw)"                                                                       // 78
	},                                                                                                                    // 79
	infoMessages : {                                                                                                      // 80
		emailSent: "E-mail verstuurd",                                                                                       // 81
		passwordChanged: "Wachtwoord veranderd"                                                                              // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "Gebruiker niet gevonden",                                                                             // 85
		invalidEmail: "Ongeldig e-mailadres",                                                                                // 86
		incorrectPassword: "Onjuist wachtwoord",                                                                             // 87
		usernameTooShort: "De gebruikersnaam moet minimaal uit 3 tekens bestaan",                                            // 88
		passwordTooShort: "Het wachtwoord moet minimaal uit 6 tekens bestaan",                                               // 89
		passwordsDontMatch: "De wachtwoorden komen niet overeen",                                                            // 90
		newPasswordSameAsOld: "Het oude en het nieuwe wachtwoord mogen niet hetzelfde zijn",                                 // 91
		signupsForbidden: "Aanmeldingen niet toegestaan"                                                                     // 92
	}                                                                                                                     // 93
});                                                                                                                    // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/ja.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("ja", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "パスワードを再設定する",                                                                                                // 3
		newPassword: "新しいパスワード",                                                                                             // 4
		newPasswordAgain: "新しいパスワード (確認)",                                                                                   // 5
		cancel: "キャンセル",                                                                                                     // 6
		submit: "パスワードを設定"                                                                                                   // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "パスワードを決める",                                                                                                  // 10
		newPassword: "新しいパスワード",                                                                                             // 11
		newPasswordAgain: "新しいパスワード (確認)",                                                                                   // 12
		cancel: "閉じる",                                                                                                       // 13
		submit: "パスワードを設定"                                                                                                   // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "メールアドレス菅確認されました",                                                                                         // 17
		dismiss: "閉じる"                                                                                                       // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "閉じる",                                                                                                      // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "パスワードを変える",                                                                                               // 24
		signOut: "サインアウト"                                                                                                    // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "サインイン",                                                                                                     // 28
		up: "参加"                                                                                                             // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "または"                                                                                                            // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "作成",                                                                                                        // 35
		signIn: "サインイン",                                                                                                     // 36
		forgot: "パスワードを忘れましたか?",                                                                                             // 37
		createAcc: "アカウントを作成"                                                                                                // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "メール",                                                                                                        // 41
		reset: "パスワードを再設定する",                                                                                                // 42
		invalidEmail: "無効なメール"                                                                                               // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "キャンセル"                                                                                                        // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "パスワードを変える",                                                                                                 // 49
		cancel: "キャンセル"                                                                                                      // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "サインインする",                                                                                               // 53
		configure: "設定する",                                                                                                   // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "サインアウト"                                                                                                    // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "ログインサービスが設定されていません"                                                                                // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "ユーザー名またはメール",                                                                                      // 63
		username: "ユーザー名",                                                                                                   // 64
		email: "メール",                                                                                                        // 65
		password: "パスワード"                                                                                                    // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "ユーザー名",                                                                                                   // 69
		email: "メール",                                                                                                        // 70
		emailOpt: "メール (オプション)",                                                                                             // 71
		password: "パスワード",                                                                                                   // 72
		passwordAgain: "パスワード (確認)"                                                                                          // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "現在のパスワード",                                                                                         // 76
		newPassword: "新しいパスワード",                                                                                             // 77
		newPasswordAgain: "新しいパスワード (確認)"                                                                                    // 78
	},                                                                                                                    // 79
	infoMessages : {                                                                                                      // 80
		emailSent: "メールを送りました",                                                                                              // 81
		passwordChanged: "パスワードが変わりました"                                                                                      // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "ユーザーが見つかりません",                                                                                        // 85
		invalidEmail: "無効なメール",                                                                                              // 86
		incorrectPassword: "無効なパスワード",                                                                                       // 87
		usernameTooShort: "ユーザー名は3文字以上でなければいけません",                                                                           // 88
		passwordTooShort: "パスワードは6文字以上でなければいけません",                                                                           // 89
		passwordsDontMatch: "パスワードが一致しません",                                                                                  // 90
		newPasswordSameAsOld: "新しいパスワードは古いパスワードと違っていなければいけません",                                                              // 91
		signupsForbidden: "サインアップが許可されませんでした"                                                                                // 92
	}                                                                                                                     // 93
});                                                                                                                    // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n/he.i18n.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.map("he", {                                                                                                       // 1
	resetPasswordDialog: {                                                                                                // 2
		title: "איפוס סיסמא",                                                                                                // 3
		newPassword: "סיסמא חדשה",                                                                                           // 4
		newPasswordAgain: "סיסמא חדשה (שוב)",                                                                                // 5
		cancel: "ביטול",                                                                                                     // 6
		submit: "קביעת סיסמא"                                                                                                // 7
	},                                                                                                                    // 8
	enrollAccountDialog: {                                                                                                // 9
		title: "בחירת סיסמא",                                                                                                // 10
		newPassword: "סיסמא חדשה",                                                                                           // 11
		newPasswordAgain: "סיסמא חדשה (שוב)",                                                                                // 12
		cancel: "סגירה",                                                                                                     // 13
		submit: "קביעת סיסמא"                                                                                                // 14
	},                                                                                                                    // 15
	justVerifiedEmailDialog: {                                                                                            // 16
		verified: "כתובת דואר אלקטרוני אומתה",                                                                               // 17
		dismiss: "סגירה"                                                                                                     // 18
	},                                                                                                                    // 19
	loginButtonsMessagesDialog: {                                                                                         // 20
		dismiss: "סגירה",                                                                                                    // 21
	},                                                                                                                    // 22
	loginButtonsLoggedInDropdownActions: {                                                                                // 23
		password: "שינוי סיסמא",                                                                                             // 24
		signOut: "יציאה"                                                                                                     // 25
	},                                                                                                                    // 26
	loginButtonsLoggedOutDropdown: {                                                                                      // 27
		signIn: "כניסה",                                                                                                     // 28
		up: "רישום"                                                                                                          // 29
	},                                                                                                                    // 30
	loginButtonsLoggedOutPasswordServiceSeparator: {                                                                      // 31
		or: "או"                                                                                                             // 32
	},                                                                                                                    // 33
	loginButtonsLoggedOutPasswordService: {                                                                               // 34
		create: "יצירה",                                                                                                     // 35
		signIn: "התחברות",                                                                                                   // 36
		forgot: "סיסמא נשכחה?",                                                                                              // 37
		createAcc: "יצירת חשבון"                                                                                             // 38
	},                                                                                                                    // 39
	forgotPasswordForm: {                                                                                                 // 40
		email: "דואר אלקטרוני (אימייל)",                                                                                     // 41
		reset: "איפוס סיסמא",                                                                                                // 42
		invalidEmail: "כתובת דואר אלקטרוני לא חוקית"                                                                         // 43
	},                                                                                                                    // 44
	loginButtonsBackToLoginLink: {                                                                                        // 45
		back: "ביטול"                                                                                                        // 46
	},                                                                                                                    // 47
	loginButtonsChangePassword: {                                                                                         // 48
		submit: "שינוי סיסמא",                                                                                               // 49
		cancel: "ביטול"                                                                                                      // 50
	},                                                                                                                    // 51
	loginButtonsLoggedOutSingleLoginButton: {                                                                             // 52
		signInWith: "התחברות עםh",                                                                                           // 53
		configure: "הגדרות",                                                                                                 // 54
	},                                                                                                                    // 55
	loginButtonsLoggedInSingleLogoutButton: {                                                                             // 56
		signOut: "התנתקות"                                                                                                   // 57
	},                                                                                                                    // 58
	loginButtonsLoggedOut: {                                                                                              // 59
		noLoginServices: "שירותים התחברות נוספים לא הוגדרו"                                                                  // 60
	},                                                                                                                    // 61
	loginFields: {                                                                                                        // 62
		usernameOrEmail: "שם משתמש או כתובת דואר אלקטרוני",                                                                  // 63
		username: "שם משתמש",                                                                                                // 64
		email: "דואר אלקטרוני",                                                                                              // 65
		password: "סיסמא"                                                                                                    // 66
	},                                                                                                                    // 67
	signupFields: {                                                                                                       // 68
		username: "שם משתמש",                                                                                                // 69
		email: "דואר אלקטרוני",                                                                                              // 70
		emailOpt: "דואר אלקטרוני (לא חובה)",                                                                                 // 71
		password: "סיסמא",                                                                                                   // 72
		passwordAgain: "סיסמא (שוב)"                                                                                         // 73
	},                                                                                                                    // 74
	changePasswordFields: {                                                                                               // 75
		currentPassword: "סיסמא נוכחית",                                                                                     // 76
		newPassword: "סיסמא חדשה",                                                                                           // 77
		newPasswordAgain: "סיסמא חדשה (שוב)"                                                                                 // 78
	},                                                                                                                    // 79
	infoMessages : {                                                                                                      // 80
		emailSent: "דואר אלקטרוני נשלח",                                                                                     // 81
		passwordChanged: "סיסמא שונתה"                                                                                       // 82
	},                                                                                                                    // 83
	errorMessages: {                                                                                                      // 84
		userNotFound: "משתמש/ת לא קיים/מת",                                                                                  // 85
		invalidEmail: "כתובת דואר אלקטרוני לא חוקי",                                                                         // 86
		incorrectPassword: "סיסמא שגויה",                                                                                    // 87
		usernameTooShort: "שם משתמש חייב להיות בן 3 תוים לפחות",                                                             // 88
		passwordTooShort: "סיסמא חייבת להיות בת 6 תווים לפחות",                                                              // 89
		passwordsDontMatch: "סיסמאות לא תואמות",                                                                             // 90
		newPasswordSameAsOld: "סיסמא חדשה וישנה חייבות להיות שונות",                                                         // 91
		signupsForbidden: "אין אפשרות לרישום"                                                                                // 92
	}                                                                                                                     // 93
});                                                                                                                    // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/i18n.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
i18n.setDefaultLanguage('en')                                                                                          // 1
                                                                                                                       // 2
accountsUIBootstrap3 = {                                                                                               // 3
	setLanguage: function (lang) {                                                                                        // 4
		return i18n.setLanguage(lang)                                                                                        // 5
	},                                                                                                                    // 6
	getLanguage: function () {                                                                                            // 7
		return i18n.getLanguage()                                                                                            // 8
	},                                                                                                                    // 9
	map: function (lang, obj) {                                                                                           // 10
		return i18n.map(lang, obj)                                                                                           // 11
	}                                                                                                                     // 12
}                                                                                                                      // 13
                                                                                                                       // 14
                                                                                                                       // 15
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/template.login_buttons.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("_loginButtons");                                                                                 // 2
Template["_loginButtons"] = new Template("Template._loginButtons", (function() {                                       // 3
  var view = this;                                                                                                     // 4
  return Blaze.If(function() {                                                                                         // 5
    return Spacebars.call(view.lookup("currentUser"));                                                                 // 6
  }, function() {                                                                                                      // 7
    return [ "\n		", Blaze.Unless(function() {                                                                         // 8
      return Spacebars.call(view.lookup("loggingIn"));                                                                 // 9
    }, function() {                                                                                                    // 10
      return [ "\n			", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedIn")), "\n		" ];                     // 11
    }), "\n	" ];                                                                                                       // 12
  }, function() {                                                                                                      // 13
    return [ "\n		", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOut")), "\n	" ];                        // 14
  });                                                                                                                  // 15
}));                                                                                                                   // 16
                                                                                                                       // 17
Template.__checkName("_loginButtonsLoggedIn");                                                                         // 18
Template["_loginButtonsLoggedIn"] = new Template("Template._loginButtonsLoggedIn", (function() {                       // 19
  var view = this;                                                                                                     // 20
  return Spacebars.include(view.lookupTemplate("_loginButtonsLoggedInDropdown"));                                      // 21
}));                                                                                                                   // 22
                                                                                                                       // 23
Template.__checkName("_loginButtonsLoggedOut");                                                                        // 24
Template["_loginButtonsLoggedOut"] = new Template("Template._loginButtonsLoggedOut", (function() {                     // 25
  var view = this;                                                                                                     // 26
  return Blaze.If(function() {                                                                                         // 27
    return Spacebars.call(view.lookup("services"));                                                                    // 28
  }, function() {                                                                                                      // 29
    return [ " \n		", Blaze.If(function() {                                                                            // 30
      return Spacebars.call(view.lookup("configurationLoaded"));                                                       // 31
    }, function() {                                                                                                    // 32
      return [ "\n			", Blaze.If(function() {                                                                          // 33
        return Spacebars.call(view.lookup("dropdown"));                                                                // 34
      }, function() {                                                                                                  // 35
        return [ " \n				", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutDropdown")), "\n			" ];       // 36
      }, function() {                                                                                                  // 37
        return [ "\n				", Spacebars.With(function() {                                                                 // 38
          return Spacebars.call(view.lookup("singleService"));                                                         // 39
        }, function() {                                                                                                // 40
          return [ " \n					", Blaze.Unless(function() {                                                               // 41
            return Spacebars.call(view.lookup("logginIn"));                                                            // 42
          }, function() {                                                                                              // 43
            return [ "\n						", HTML.DIV({                                                                            // 44
              "class": "navbar-form"                                                                                   // 45
            }, "\n							", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutSingleLoginButton")), "\n						"), "\n					" ];
          }), "\n				" ];                                                                                              // 47
        }), "\n			" ];                                                                                                 // 48
      }), "\n		" ];                                                                                                    // 49
    }), "\n	" ];                                                                                                       // 50
  }, function() {                                                                                                      // 51
    return [ "\n		", HTML.DIV({                                                                                        // 52
      "class": "no-services"                                                                                           // 53
    }, Blaze.View("lookup:i18n", function() {                                                                          // 54
      return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedOut.noLoginServices");                         // 55
    })), "\n	" ];                                                                                                      // 56
  });                                                                                                                  // 57
}));                                                                                                                   // 58
                                                                                                                       // 59
Template.__checkName("_loginButtonsMessages");                                                                         // 60
Template["_loginButtonsMessages"] = new Template("Template._loginButtonsMessages", (function() {                       // 61
  var view = this;                                                                                                     // 62
  return [ Blaze.If(function() {                                                                                       // 63
    return Spacebars.call(view.lookup("errorMessage"));                                                                // 64
  }, function() {                                                                                                      // 65
    return [ "\n		", HTML.DIV({                                                                                        // 66
      "class": "alert alert-danger"                                                                                    // 67
    }, Blaze.View("lookup:errorMessage", function() {                                                                  // 68
      return Spacebars.mustache(view.lookup("errorMessage"));                                                          // 69
    })), "\n	" ];                                                                                                      // 70
  }), "\n	", Blaze.If(function() {                                                                                     // 71
    return Spacebars.call(view.lookup("infoMessage"));                                                                 // 72
  }, function() {                                                                                                      // 73
    return [ "\n		", HTML.DIV({                                                                                        // 74
      "class": "alert alert-success no-margin"                                                                         // 75
    }, Blaze.View("lookup:infoMessage", function() {                                                                   // 76
      return Spacebars.mustache(view.lookup("infoMessage"));                                                           // 77
    })), "\n	" ];                                                                                                      // 78
  }) ];                                                                                                                // 79
}));                                                                                                                   // 80
                                                                                                                       // 81
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/template.login_buttons_single.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("_loginButtonsLoggedOutSingleLoginButton");                                                       // 2
Template["_loginButtonsLoggedOutSingleLoginButton"] = new Template("Template._loginButtonsLoggedOutSingleLoginButton", (function() {
  var view = this;                                                                                                     // 4
  return Blaze.If(function() {                                                                                         // 5
    return Spacebars.call(view.lookup("configured"));                                                                  // 6
  }, function() {                                                                                                      // 7
    return [ "\n		", HTML.BUTTON({                                                                                     // 8
      "class": function() {                                                                                            // 9
        return [ "login-button btn btn-block btn-", Spacebars.mustache(view.lookup("capitalizedName")) ];              // 10
      }                                                                                                                // 11
    }, Blaze.View("lookup:i18n", function() {                                                                          // 12
      return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedOutSingleLoginButton.signInWith");             // 13
    }), " ", Blaze.View("lookup:capitalizedName", function() {                                                         // 14
      return Spacebars.mustache(view.lookup("capitalizedName"));                                                       // 15
    })), "\n	" ];                                                                                                      // 16
  }, function() {                                                                                                      // 17
    return [ "\n		", HTML.BUTTON({                                                                                     // 18
      "class": "login-button btn btn-block configure-button btn-danger"                                                // 19
    }, Blaze.View("lookup:i18n", function() {                                                                          // 20
      return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedOutSingleLoginButton.configure");              // 21
    }), " ", Blaze.View("lookup:capitalizedName", function() {                                                         // 22
      return Spacebars.mustache(view.lookup("capitalizedName"));                                                       // 23
    })), "\n	" ];                                                                                                      // 24
  });                                                                                                                  // 25
}));                                                                                                                   // 26
                                                                                                                       // 27
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/template.login_buttons_dropdown.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("_loginButtonsLoggedInDropdown");                                                                 // 2
Template["_loginButtonsLoggedInDropdown"] = new Template("Template._loginButtonsLoggedInDropdown", (function() {       // 3
  var view = this;                                                                                                     // 4
  return HTML.LI({                                                                                                     // 5
    id: "login-dropdown-list",                                                                                         // 6
    "class": "dropdown"                                                                                                // 7
  }, "\n		", HTML.A({                                                                                                  // 8
    "class": "dropdown-toggle",                                                                                        // 9
    "data-toggle": "dropdown"                                                                                          // 10
  }, "\n			", Blaze.View("lookup:displayName", function() {                                                            // 11
    return Spacebars.mustache(view.lookup("displayName"));                                                             // 12
  }), "\n			", Spacebars.With(function() {                                                                             // 13
    return Spacebars.call(view.lookup("user_profile_picture"));                                                        // 14
  }, function() {                                                                                                      // 15
    return [ "\n				", HTML.IMG({                                                                                      // 16
      src: function() {                                                                                                // 17
        return Spacebars.mustache(view.lookup("."));                                                                   // 18
      },                                                                                                               // 19
      width: "30px",                                                                                                   // 20
      height: "30px",                                                                                                  // 21
      "class": "img-circle",                                                                                           // 22
      alt: "#"                                                                                                         // 23
    }), "\n			" ];                                                                                                     // 24
  }), "\n			", HTML.Raw('<b class="caret"></b>'), "\n		"), "\n		", HTML.DIV({                                          // 25
    "class": "dropdown-menu"                                                                                           // 26
  }, "\n			", Blaze.If(function() {                                                                                    // 27
    return Spacebars.call(view.lookup("inMessageOnlyFlow"));                                                           // 28
  }, function() {                                                                                                      // 29
    return [ "\n				", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n			" ];                     // 30
  }, function() {                                                                                                      // 31
    return [ "\n				", Blaze.If(function() {                                                                           // 32
      return Spacebars.call(view.lookup("inChangePasswordFlow"));                                                      // 33
    }, function() {                                                                                                    // 34
      return [ "\n					", Spacebars.include(view.lookupTemplate("_loginButtonsChangePassword")), "\n				" ];           // 35
    }, function() {                                                                                                    // 36
      return [ "\n					", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedInDropdownActions")), "\n				" ];  // 37
    }), "\n			" ];                                                                                                     // 38
  }), "\n		"), "\n	");                                                                                                 // 39
}));                                                                                                                   // 40
                                                                                                                       // 41
Template.__checkName("_loginButtonsLoggedInDropdownActions");                                                          // 42
Template["_loginButtonsLoggedInDropdownActions"] = new Template("Template._loginButtonsLoggedInDropdownActions", (function() {
  var view = this;                                                                                                     // 44
  return [ Blaze.If(function() {                                                                                       // 45
    return Spacebars.call(view.lookup("additionalLoggedInDropdownActions"));                                           // 46
  }, function() {                                                                                                      // 47
    return [ "\n		", Spacebars.include(view.lookupTemplate("_loginButtonsAdditionalLoggedInDropdownActions")), "\n	" ];
  }), "\n\n	", Blaze.If(function() {                                                                                   // 49
    return Spacebars.call(view.lookup("allowChangingPassword"));                                                       // 50
  }, function() {                                                                                                      // 51
    return [ "\n		", HTML.BUTTON({                                                                                     // 52
      "class": "btn btn-default btn-block",                                                                            // 53
      id: "login-buttons-open-change-password"                                                                         // 54
    }, Blaze.View("lookup:i18n", function() {                                                                          // 55
      return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedInDropdownActions.password");                  // 56
    })), "\n	" ];                                                                                                      // 57
  }), "\n\n	", HTML.BUTTON({                                                                                           // 58
    "class": "btn btn-block btn-primary",                                                                              // 59
    id: "login-buttons-logout"                                                                                         // 60
  }, Blaze.View("lookup:i18n", function() {                                                                            // 61
    return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedInDropdownActions.signOut");                     // 62
  })) ];                                                                                                               // 63
}));                                                                                                                   // 64
                                                                                                                       // 65
Template.__checkName("_loginButtonsLoggedOutDropdown");                                                                // 66
Template["_loginButtonsLoggedOutDropdown"] = new Template("Template._loginButtonsLoggedOutDropdown", (function() {     // 67
  var view = this;                                                                                                     // 68
  return HTML.LI({                                                                                                     // 69
    id: "login-dropdown-list",                                                                                         // 70
    "class": "dropdown"                                                                                                // 71
  }, "\n		", HTML.A({                                                                                                  // 72
    "class": "dropdown-toggle",                                                                                        // 73
    "data-toggle": "dropdown"                                                                                          // 74
  }, Blaze.View("lookup:i18n", function() {                                                                            // 75
    return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedOutDropdown.signIn");                            // 76
  }), Blaze.Unless(function() {                                                                                        // 77
    return Spacebars.call(view.lookup("forbidClientAccountCreation"));                                                 // 78
  }, function() {                                                                                                      // 79
    return [ " / ", Blaze.View("lookup:i18n", function() {                                                             // 80
      return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedOutDropdown.up");                              // 81
    }) ];                                                                                                              // 82
  }), " ", HTML.Raw('<b class="caret"></b>')), "\n		", HTML.DIV({                                                      // 83
    "class": "dropdown-menu"                                                                                           // 84
  }, "\n			", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutAllServices")), "\n		"), "\n	");            // 85
}));                                                                                                                   // 86
                                                                                                                       // 87
Template.__checkName("_loginButtonsLoggedOutAllServices");                                                             // 88
Template["_loginButtonsLoggedOutAllServices"] = new Template("Template._loginButtonsLoggedOutAllServices", (function() {
  var view = this;                                                                                                     // 90
  return Blaze.Each(function() {                                                                                       // 91
    return Spacebars.call(view.lookup("services"));                                                                    // 92
  }, function() {                                                                                                      // 93
    return [ "\n	", Blaze.Unless(function() {                                                                          // 94
      return Spacebars.call(view.lookup("hasPasswordService"));                                                        // 95
    }, function() {                                                                                                    // 96
      return [ "\n		", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n	" ];                       // 97
    }), "\n		", Blaze.If(function() {                                                                                  // 98
      return Spacebars.call(view.lookup("isPasswordService"));                                                         // 99
    }, function() {                                                                                                    // 100
      return [ "\n			", Blaze.If(function() {                                                                          // 101
        return Spacebars.call(view.lookup("hasOtherServices"));                                                        // 102
      }, function() {                                                                                                  // 103
        return [ " \n				", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutPasswordServiceSeparator")), "\n			" ];
      }), "\n			", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutPasswordService")), "\n		" ];          // 105
    }, function() {                                                                                                    // 106
      return [ "\n			", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutSingleLoginButton")), "\n		" ];   // 107
    }), "\n	" ];                                                                                                       // 108
  });                                                                                                                  // 109
}));                                                                                                                   // 110
                                                                                                                       // 111
Template.__checkName("_loginButtonsLoggedOutPasswordServiceSeparator");                                                // 112
Template["_loginButtonsLoggedOutPasswordServiceSeparator"] = new Template("Template._loginButtonsLoggedOutPasswordServiceSeparator", (function() {
  var view = this;                                                                                                     // 114
  return HTML.DIV({                                                                                                    // 115
    "class": "or"                                                                                                      // 116
  }, HTML.Raw('\n		<span class="hline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>\n		'), HTML.SPAN({
    "class": "or-text"                                                                                                 // 118
  }, Blaze.View("lookup:i18n", function() {                                                                            // 119
    return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedOutPasswordServiceSeparator.or");                // 120
  })), HTML.Raw('\n		<span class="hline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>\n	'));    // 121
}));                                                                                                                   // 122
                                                                                                                       // 123
Template.__checkName("_loginButtonsLoggedOutPasswordService");                                                         // 124
Template["_loginButtonsLoggedOutPasswordService"] = new Template("Template._loginButtonsLoggedOutPasswordService", (function() {
  var view = this;                                                                                                     // 126
  return Blaze.If(function() {                                                                                         // 127
    return Spacebars.call(view.lookup("inForgotPasswordFlow"));                                                        // 128
  }, function() {                                                                                                      // 129
    return [ "\n		", Spacebars.include(view.lookupTemplate("_forgotPasswordForm")), "\n	" ];                           // 130
  }, function() {                                                                                                      // 131
    return [ "\n		", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n		", Blaze.Each(function() {  // 132
      return Spacebars.call(view.lookup("fields"));                                                                    // 133
    }, function() {                                                                                                    // 134
      return [ "\n			", Spacebars.include(view.lookupTemplate("_loginButtonsFormField")), "\n		" ];                    // 135
    }), "\n		", HTML.BUTTON({                                                                                          // 136
      "class": "btn btn-primary col-xs-12 col-sm-12",                                                                  // 137
      id: "login-buttons-password",                                                                                    // 138
      type: "button"                                                                                                   // 139
    }, "\n			", Blaze.If(function() {                                                                                  // 140
      return Spacebars.call(view.lookup("inSignupFlow"));                                                              // 141
    }, function() {                                                                                                    // 142
      return [ "\n				", Blaze.View("lookup:i18n", function() {                                                        // 143
        return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedOutPasswordService.create");                 // 144
      }), "\n			" ];                                                                                                   // 145
    }, function() {                                                                                                    // 146
      return [ "\n				", Blaze.View("lookup:i18n", function() {                                                        // 147
        return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedOutPasswordService.signIn");                 // 148
      }), "\n			" ];                                                                                                   // 149
    }), "\n		"), "\n		", Blaze.If(function() {                                                                         // 150
      return Spacebars.call(view.lookup("inLoginFlow"));                                                               // 151
    }, function() {                                                                                                    // 152
      return [ "\n			", HTML.DIV({                                                                                     // 153
        id: "login-other-options"                                                                                      // 154
      }, "\n			", Blaze.If(function() {                                                                                // 155
        return Spacebars.call(view.lookup("showForgotPasswordLink"));                                                  // 156
      }, function() {                                                                                                  // 157
        return [ "\n				", HTML.A({                                                                                    // 158
          id: "forgot-password-link",                                                                                  // 159
          "class": "pull-left"                                                                                         // 160
        }, Blaze.View("lookup:i18n", function() {                                                                      // 161
          return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedOutPasswordService.forgot");               // 162
        })), "\n			" ];                                                                                                // 163
      }), "\n			", Blaze.If(function() {                                                                               // 164
        return Spacebars.call(view.lookup("showCreateAccountLink"));                                                   // 165
      }, function() {                                                                                                  // 166
        return [ "\n				", HTML.A({                                                                                    // 167
          id: "signup-link",                                                                                           // 168
          "class": "pull-right"                                                                                        // 169
        }, Blaze.View("lookup:i18n", function() {                                                                      // 170
          return Spacebars.mustache(view.lookup("i18n"), "loginButtonsLoggedOutPasswordService.createAcc");            // 171
        })), "\n			" ];                                                                                                // 172
      }), "\n			"), "\n		" ];                                                                                          // 173
    }), "\n		", Blaze.If(function() {                                                                                  // 174
      return Spacebars.call(view.lookup("inSignupFlow"));                                                              // 175
    }, function() {                                                                                                    // 176
      return [ "\n			", Spacebars.include(view.lookupTemplate("_loginButtonsBackToLoginLink")), "\n		" ];              // 177
    }), "\n	" ];                                                                                                       // 178
  });                                                                                                                  // 179
}));                                                                                                                   // 180
                                                                                                                       // 181
Template.__checkName("_forgotPasswordForm");                                                                           // 182
Template["_forgotPasswordForm"] = new Template("Template._forgotPasswordForm", (function() {                           // 183
  var view = this;                                                                                                     // 184
  return HTML.DIV({                                                                                                    // 185
    "class": "login-form"                                                                                              // 186
  }, "\n		", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n		", HTML.DIV({                       // 187
    id: "forgot-password-email-label-and-input"                                                                        // 188
  }, " \n			", HTML.INPUT({                                                                                            // 189
    id: "forgot-password-email",                                                                                       // 190
    type: "email",                                                                                                     // 191
    placeholder: function() {                                                                                          // 192
      return Spacebars.mustache(view.lookup("i18n"), "forgotPasswordForm.email");                                      // 193
    },                                                                                                                 // 194
    "class": "form-control"                                                                                            // 195
  }), "\n		"), "\n		", HTML.BUTTON({                                                                                   // 196
    "class": "btn btn-primary login-button-form-submit col-xs-12 col-sm-12",                                           // 197
    id: "login-buttons-forgot-password"                                                                                // 198
  }, Blaze.View("lookup:i18n", function() {                                                                            // 199
    return Spacebars.mustache(view.lookup("i18n"), "forgotPasswordForm.reset");                                        // 200
  })), "\n		", Spacebars.include(view.lookupTemplate("_loginButtonsBackToLoginLink")), "\n	");                         // 201
}));                                                                                                                   // 202
                                                                                                                       // 203
Template.__checkName("_loginButtonsBackToLoginLink");                                                                  // 204
Template["_loginButtonsBackToLoginLink"] = new Template("Template._loginButtonsBackToLoginLink", (function() {         // 205
  var view = this;                                                                                                     // 206
  return HTML.BUTTON({                                                                                                 // 207
    id: "back-to-login-link",                                                                                          // 208
    "class": "btn btn-default col-xs-12 col-sm-12"                                                                     // 209
  }, Blaze.View("lookup:i18n", function() {                                                                            // 210
    return Spacebars.mustache(view.lookup("i18n"), "loginButtonsBackToLoginLink.back");                                // 211
  }));                                                                                                                 // 212
}));                                                                                                                   // 213
                                                                                                                       // 214
Template.__checkName("_loginButtonsFormField");                                                                        // 215
Template["_loginButtonsFormField"] = new Template("Template._loginButtonsFormField", (function() {                     // 216
  var view = this;                                                                                                     // 217
  return Blaze.If(function() {                                                                                         // 218
    return Spacebars.call(view.lookup("visible"));                                                                     // 219
  }, function() {                                                                                                      // 220
    return [ "\n		", HTML.Comment(" TODO: Implement more input types "), "\n		", Blaze.If(function() {                 // 221
      return Spacebars.dataMustache(view.lookup("equals"), view.lookup("inputType"), "checkbox");                      // 222
    }, function() {                                                                                                    // 223
      return [ "\n			", HTML.DIV({                                                                                     // 224
        "class": "checkbox"                                                                                            // 225
      }, "\n				", HTML.LABEL(HTML.INPUT({                                                                             // 226
        type: "checkbox",                                                                                              // 227
        id: function() {                                                                                               // 228
          return [ "login-", Spacebars.mustache(view.lookup("fieldName")) ];                                           // 229
        },                                                                                                             // 230
        name: function() {                                                                                             // 231
          return [ "login-", Spacebars.mustache(view.lookup("fieldName")) ];                                           // 232
        },                                                                                                             // 233
        value: "true"                                                                                                  // 234
      }), "\n				", Blaze.View("lookup:fieldLabel", function() {                                                       // 235
        return Spacebars.makeRaw(Spacebars.mustache(view.lookup("fieldLabel")));                                       // 236
      })), "\n			"), "\n		" ];                                                                                         // 237
    }), "\n\n		", Blaze.If(function() {                                                                                // 238
      return Spacebars.dataMustache(view.lookup("equals"), view.lookup("inputType"), "select");                        // 239
    }, function() {                                                                                                    // 240
      return [ "\n			", HTML.DIV({                                                                                     // 241
        "class": "select-dropdown"                                                                                     // 242
      }, "\n			", Blaze.If(function() {                                                                                // 243
        return Spacebars.call(view.lookup("showFieldLabel"));                                                          // 244
      }, function() {                                                                                                  // 245
        return [ "\n				", HTML.LABEL(Blaze.View("lookup:fieldLabel", function() {                                     // 246
          return Spacebars.mustache(view.lookup("fieldLabel"));                                                        // 247
        })), HTML.BR(), "\n			" ];                                                                                     // 248
      }), "\n			", HTML.SELECT({                                                                                       // 249
        id: function() {                                                                                               // 250
          return [ "login-", Spacebars.mustache(view.lookup("fieldName")) ];                                           // 251
        }                                                                                                              // 252
      }, "\n				", Blaze.If(function() {                                                                               // 253
        return Spacebars.call(view.lookup("empty"));                                                                   // 254
      }, function() {                                                                                                  // 255
        return [ "\n					", HTML.OPTION({                                                                              // 256
          value: ""                                                                                                    // 257
        }, Blaze.View("lookup:empty", function() {                                                                     // 258
          return Spacebars.mustache(view.lookup("empty"));                                                             // 259
        })), "\n				" ];                                                                                               // 260
      }), "\n				", Blaze.Each(function() {                                                                            // 261
        return Spacebars.call(view.lookup("data"));                                                                    // 262
      }, function() {                                                                                                  // 263
        return [ "\n					", HTML.OPTION({                                                                              // 264
          value: function() {                                                                                          // 265
            return Spacebars.mustache(view.lookup("value"));                                                           // 266
          }                                                                                                            // 267
        }, Blaze.View("lookup:label", function() {                                                                     // 268
          return Spacebars.mustache(view.lookup("label"));                                                             // 269
        })), "\n				" ];                                                                                               // 270
      }), "\n			"), "\n			"), "\n		" ];                                                                                // 271
    }), "\n\n		", Blaze.If(function() {                                                                                // 272
      return Spacebars.dataMustache(view.lookup("equals"), view.lookup("inputType"), "radio");                         // 273
    }, function() {                                                                                                    // 274
      return [ "\n	    ", HTML.DIV({                                                                                   // 275
        "class": "radio"                                                                                               // 276
      }, "\n	      ", Blaze.If(function() {                                                                            // 277
        return Spacebars.call(view.lookup("showFieldLabel"));                                                          // 278
      }, function() {                                                                                                  // 279
        return [ "\n				", HTML.LABEL(Blaze.View("lookup:fieldLabel", function() {                                     // 280
          return Spacebars.mustache(view.lookup("fieldLabel"));                                                        // 281
        })), HTML.BR(), "\n				" ];                                                                                    // 282
      }), "\n				", Blaze.Each(function() {                                                                            // 283
        return Spacebars.call(view.lookup("data"));                                                                    // 284
      }, function() {                                                                                                  // 285
        return [ "\n					", HTML.LABEL(HTML.INPUT(HTML.Attrs({                                                         // 286
          type: "radio",                                                                                               // 287
          id: function() {                                                                                             // 288
            return [ "login-", Spacebars.mustache(Spacebars.dot(view.lookup(".."), "fieldName")), "-", Spacebars.mustache(view.lookup("id")) ];
          },                                                                                                           // 290
          name: function() {                                                                                           // 291
            return [ "login-", Spacebars.mustache(Spacebars.dot(view.lookup(".."), "fieldName")) ];                    // 292
          },                                                                                                           // 293
          value: function() {                                                                                          // 294
            return Spacebars.mustache(view.lookup("value"));                                                           // 295
          }                                                                                                            // 296
        }, function() {                                                                                                // 297
          return Spacebars.attrMustache(view.lookup("checked"));                                                       // 298
        })), " ", Blaze.View("lookup:label", function() {                                                              // 299
          return Spacebars.mustache(view.lookup("label"));                                                             // 300
        })), "\n					", Blaze.If(function() {                                                                          // 301
          return Spacebars.dataMustache(view.lookup("equals"), Spacebars.dot(view.lookup(".."), "radioLayout"), "vertical");
        }, function() {                                                                                                // 303
          return [ "\n						", HTML.BR(), "\n					" ];                                                                 // 304
        }), "\n				" ];                                                                                                // 305
      }), "\n	    "), "\n		" ];                                                                                        // 306
    }), "\n\n		", Blaze.If(function() {                                                                                // 307
      return Spacebars.call(view.lookup("inputTextual"));                                                              // 308
    }, function() {                                                                                                    // 309
      return [ "\n			", HTML.INPUT({                                                                                   // 310
        id: function() {                                                                                               // 311
          return [ "login-", Spacebars.mustache(view.lookup("fieldName")) ];                                           // 312
        },                                                                                                             // 313
        type: function() {                                                                                             // 314
          return Spacebars.mustache(view.lookup("inputType"));                                                         // 315
        },                                                                                                             // 316
        placeholder: function() {                                                                                      // 317
          return Spacebars.mustache(view.lookup("fieldLabel"));                                                        // 318
        },                                                                                                             // 319
        "class": "form-control"                                                                                        // 320
      }), "\n		" ];                                                                                                    // 321
    }), "\n	" ];                                                                                                       // 322
  });                                                                                                                  // 323
}));                                                                                                                   // 324
                                                                                                                       // 325
Template.__checkName("_loginButtonsChangePassword");                                                                   // 326
Template["_loginButtonsChangePassword"] = new Template("Template._loginButtonsChangePassword", (function() {           // 327
  var view = this;                                                                                                     // 328
  return [ Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n	", Blaze.Each(function() {             // 329
    return Spacebars.call(view.lookup("fields"));                                                                      // 330
  }, function() {                                                                                                      // 331
    return [ "\n		", Spacebars.include(view.lookupTemplate("_loginButtonsFormField")), "\n	" ];                        // 332
  }), "\n	", HTML.BUTTON({                                                                                             // 333
    "class": "btn btn-block btn-primary",                                                                              // 334
    id: "login-buttons-do-change-password"                                                                             // 335
  }, Blaze.View("lookup:i18n", function() {                                                                            // 336
    return Spacebars.mustache(view.lookup("i18n"), "loginButtonsChangePassword.submit");                               // 337
  })), "\n	", HTML.BUTTON({                                                                                            // 338
    "class": "btn btn-block btn-default",                                                                              // 339
    id: "login-buttons-cancel-change-password"                                                                         // 340
  }, Blaze.View("lookup:i18n", function() {                                                                            // 341
    return Spacebars.mustache(view.lookup("i18n"), "loginButtonsChangePassword.cancel");                               // 342
  })) ];                                                                                                               // 343
}));                                                                                                                   // 344
                                                                                                                       // 345
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/template.login_buttons_dialogs.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.body.addContent((function() {                                                                                 // 2
  var view = this;                                                                                                     // 3
  return [ Spacebars.include(view.lookupTemplate("_resetPasswordDialog")), "\n	", Spacebars.include(view.lookupTemplate("_enrollAccountDialog")), "\n	", Spacebars.include(view.lookupTemplate("_justVerifiedEmailDialog")), "\n	", Spacebars.include(view.lookupTemplate("_configureLoginServiceDialog")), "\n\n	\n	", Spacebars.include(view.lookupTemplate("_loginButtonsMessagesDialog")) ];
}));                                                                                                                   // 5
Meteor.startup(Template.body.renderToDocument);                                                                        // 6
                                                                                                                       // 7
Template.__checkName("_resetPasswordDialog");                                                                          // 8
Template["_resetPasswordDialog"] = new Template("Template._resetPasswordDialog", (function() {                         // 9
  var view = this;                                                                                                     // 10
  return Blaze.If(function() {                                                                                         // 11
    return Spacebars.call(view.lookup("inResetPasswordFlow"));                                                         // 12
  }, function() {                                                                                                      // 13
    return [ "\n		", HTML.DIV({                                                                                        // 14
      "class": "modal",                                                                                                // 15
      id: "login-buttons-reset-password-modal"                                                                         // 16
    }, "\n			", HTML.DIV({                                                                                             // 17
      "class": "modal-dialog"                                                                                          // 18
    }, "\n				", HTML.DIV({                                                                                            // 19
      "class": "modal-content"                                                                                         // 20
    }, "\n					", HTML.DIV({                                                                                           // 21
      "class": "modal-header"                                                                                          // 22
    }, "\n						", HTML.BUTTON({                                                                                       // 23
      type: "button",                                                                                                  // 24
      "class": "close",                                                                                                // 25
      "data-dismiss": "modal",                                                                                         // 26
      "aria-hidden": "true"                                                                                            // 27
    }, HTML.CharRef({                                                                                                  // 28
      html: "&times;",                                                                                                 // 29
      str: "×"                                                                                                         // 30
    })), "\n						", HTML.H4({                                                                                         // 31
      "class": "modal-title"                                                                                           // 32
    }, Blaze.View("lookup:i18n", function() {                                                                          // 33
      return Spacebars.mustache(view.lookup("i18n"), "resetPasswordDialog.title");                                     // 34
    })), "\n					"), "\n					", HTML.DIV({                                                                             // 35
      "class": "modal-body"                                                                                            // 36
    }, "\n						", HTML.INPUT({                                                                                        // 37
      id: "reset-password-new-password",                                                                               // 38
      "class": "form-control",                                                                                         // 39
      type: "password",                                                                                                // 40
      placeholder: function() {                                                                                        // 41
        return Spacebars.mustache(view.lookup("i18n"), "resetPasswordDialog.newPassword");                             // 42
      }                                                                                                                // 43
    }), HTML.BR(), "\n                        ", HTML.INPUT({                                                          // 44
      id: "reset-password-new-password-again",                                                                         // 45
      "class": "form-control",                                                                                         // 46
      type: "password",                                                                                                // 47
      placeholder: function() {                                                                                        // 48
        return Spacebars.mustache(view.lookup("i18n"), "resetPasswordDialog.newPasswordAgain");                        // 49
      }                                                                                                                // 50
    }), HTML.BR(), "\n						", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n					"), "\n					", HTML.DIV({
      "class": "modal-footer"                                                                                          // 52
    }, "\n						", HTML.A({                                                                                            // 53
      "class": "btn btn-default",                                                                                      // 54
      id: "login-buttons-cancel-reset-password"                                                                        // 55
    }, Blaze.View("lookup:i18n", function() {                                                                          // 56
      return Spacebars.mustache(view.lookup("i18n"), "resetPasswordDialog.cancel");                                    // 57
    })), "\n						", HTML.BUTTON({                                                                                     // 58
      "class": "btn btn-primary",                                                                                      // 59
      id: "login-buttons-reset-password-button"                                                                        // 60
    }, "\n							", Blaze.View("lookup:i18n", function() {                                                             // 61
      return Spacebars.mustache(view.lookup("i18n"), "resetPasswordDialog.submit");                                    // 62
    }), "\n						"), "\n					"), "\n				"), HTML.Comment(" /.modal-content "), "\n			"), HTML.Comment(" /.modal-dalog "), "\n		"), HTML.Comment(" /.modal "), "\n	" ];
  });                                                                                                                  // 64
}));                                                                                                                   // 65
                                                                                                                       // 66
Template.__checkName("_enrollAccountDialog");                                                                          // 67
Template["_enrollAccountDialog"] = new Template("Template._enrollAccountDialog", (function() {                         // 68
  var view = this;                                                                                                     // 69
  return Blaze.If(function() {                                                                                         // 70
    return Spacebars.call(view.lookup("inEnrollAccountFlow"));                                                         // 71
  }, function() {                                                                                                      // 72
    return [ "\n		", HTML.DIV({                                                                                        // 73
      "class": "modal",                                                                                                // 74
      id: "login-buttons-enroll-account-modal"                                                                         // 75
    }, "\n			", HTML.DIV({                                                                                             // 76
      "class": "modal-dialog"                                                                                          // 77
    }, "\n				", HTML.DIV({                                                                                            // 78
      "class": "modal-content"                                                                                         // 79
    }, "\n					", HTML.DIV({                                                                                           // 80
      "class": "modal-header"                                                                                          // 81
    }, "\n						", HTML.BUTTON({                                                                                       // 82
      type: "button",                                                                                                  // 83
      "class": "close",                                                                                                // 84
      "data-dismiss": "modal",                                                                                         // 85
      "aria-hidden": "true"                                                                                            // 86
    }, HTML.CharRef({                                                                                                  // 87
      html: "&times;",                                                                                                 // 88
      str: "×"                                                                                                         // 89
    })), "\n						", HTML.H4({                                                                                         // 90
      "class": "modal-title"                                                                                           // 91
    }, Blaze.View("lookup:i18n", function() {                                                                          // 92
      return Spacebars.mustache(view.lookup("i18n"), "enrollAccountDialog.title");                                     // 93
    })), "\n					"), "\n					", HTML.DIV({                                                                             // 94
      "class": "modal-body"                                                                                            // 95
    }, "\n						", HTML.INPUT({                                                                                        // 96
      id: "enroll-account-password",                                                                                   // 97
      "class": "form-control",                                                                                         // 98
      type: "password",                                                                                                // 99
      placeholder: function() {                                                                                        // 100
        return Spacebars.mustache(view.lookup("i18n"), "enrollAccountDialog.newPassword");                             // 101
      }                                                                                                                // 102
    }), HTML.BR(), "\n                        ", HTML.INPUT({                                                          // 103
      id: "enroll-account-password-again",                                                                             // 104
      "class": "form-control",                                                                                         // 105
      type: "password",                                                                                                // 106
      placeholder: function() {                                                                                        // 107
        return Spacebars.mustache(view.lookup("i18n"), "enrollAccountDialog.newPasswordAgain");                        // 108
      }                                                                                                                // 109
    }), HTML.BR(), "\n						", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n					"), "\n					", HTML.DIV({
      "class": "modal-footer"                                                                                          // 111
    }, "\n						", HTML.A({                                                                                            // 112
      "class": "btn btn-default",                                                                                      // 113
      id: "login-buttons-cancel-enroll-account-button"                                                                 // 114
    }, Blaze.View("lookup:i18n", function() {                                                                          // 115
      return Spacebars.mustache(view.lookup("i18n"), "enrollAccountDialog.cancel");                                    // 116
    })), "\n						", HTML.BUTTON({                                                                                     // 117
      "class": "btn btn-primary",                                                                                      // 118
      id: "login-buttons-enroll-account-button"                                                                        // 119
    }, "\n							", Blaze.View("lookup:i18n", function() {                                                             // 120
      return Spacebars.mustache(view.lookup("i18n"), "enrollAccountDialog.submit");                                    // 121
    }), "\n						"), "\n					"), "\n				"), HTML.Comment(" /.modal-content "), "\n			"), HTML.Comment(" /.modal-dalog "), "\n		"), HTML.Comment(" /.modal "), "\n	" ];
  });                                                                                                                  // 123
}));                                                                                                                   // 124
                                                                                                                       // 125
Template.__checkName("_justVerifiedEmailDialog");                                                                      // 126
Template["_justVerifiedEmailDialog"] = new Template("Template._justVerifiedEmailDialog", (function() {                 // 127
  var view = this;                                                                                                     // 128
  return Blaze.If(function() {                                                                                         // 129
    return Spacebars.call(view.lookup("visible"));                                                                     // 130
  }, function() {                                                                                                      // 131
    return [ "\n		", HTML.DIV({                                                                                        // 132
      "class": "modal",                                                                                                // 133
      id: "login-buttons-email-address-verified-modal"                                                                 // 134
    }, "\n			", HTML.DIV({                                                                                             // 135
      "class": "modal-dialog"                                                                                          // 136
    }, "\n				", HTML.DIV({                                                                                            // 137
      "class": "modal-content"                                                                                         // 138
    }, "\n					", HTML.DIV({                                                                                           // 139
      "class": "modal-body"                                                                                            // 140
    }, "\n						", HTML.H4(HTML.B(Blaze.View("lookup:i18n", function() {                                               // 141
      return Spacebars.mustache(view.lookup("i18n"), "justVerifiedEmailDialog.verified");                              // 142
    }))), "\n					"), "\n					", HTML.DIV({                                                                            // 143
      "class": "modal-footer"                                                                                          // 144
    }, "\n						", HTML.BUTTON({                                                                                       // 145
      "class": "btn btn-primary login-button",                                                                         // 146
      id: "just-verified-dismiss-button",                                                                              // 147
      "data-dismiss": "modal"                                                                                          // 148
    }, Blaze.View("lookup:i18n", function() {                                                                          // 149
      return Spacebars.mustache(view.lookup("i18n"), "justVerifiedEmailDialog.dismiss");                               // 150
    })), "\n					"), "\n				"), "\n			"), "\n		"), "\n	" ];                                                            // 151
  });                                                                                                                  // 152
}));                                                                                                                   // 153
                                                                                                                       // 154
Template.__checkName("_configureLoginServiceDialog");                                                                  // 155
Template["_configureLoginServiceDialog"] = new Template("Template._configureLoginServiceDialog", (function() {         // 156
  var view = this;                                                                                                     // 157
  return Blaze.If(function() {                                                                                         // 158
    return Spacebars.call(view.lookup("visible"));                                                                     // 159
  }, function() {                                                                                                      // 160
    return [ "\n	", HTML.DIV({                                                                                         // 161
      "class": "modal",                                                                                                // 162
      id: "configure-login-service-dialog-modal"                                                                       // 163
    }, "\n			", HTML.DIV({                                                                                             // 164
      "class": "modal-dialog"                                                                                          // 165
    }, "\n					", HTML.DIV({                                                                                           // 166
      "class": "modal-content"                                                                                         // 167
    }, "\n							", HTML.DIV({                                                                                         // 168
      "class": "modal-header"                                                                                          // 169
    }, "\n									", HTML.H4({                                                                                        // 170
      "class": "modal-title"                                                                                           // 171
    }, "Configure Service"), "\n							"), "\n							", HTML.DIV({                                                     // 172
      "class": "modal-body"                                                                                            // 173
    }, "\n									", HTML.DIV({                                                                                       // 174
      id: "configure-login-service-dialog",                                                                            // 175
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 176
    }, "\n											", Spacebars.include(view.lookupTemplate("configurationSteps")), "\n											", HTML.P("\n											Now, copy over some details.\n											"), "\n											", HTML.P("\n											", HTML.TABLE("\n													", HTML.COLGROUP("\n															", HTML.COL({
      span: "1",                                                                                                       // 178
      "class": "configuration_labels"                                                                                  // 179
    }), "\n															", HTML.COL({                                                                                // 180
      span: "1",                                                                                                       // 181
      "class": "configuration_inputs"                                                                                  // 182
    }), "\n													"), "\n													", Blaze.Each(function() {                                                 // 183
      return Spacebars.call(view.lookup("configurationFields"));                                                       // 184
    }, function() {                                                                                                    // 185
      return [ "\n													", HTML.TR("\n															", HTML.TD("\n																	", HTML.LABEL({             // 186
        "for": function() {                                                                                            // 187
          return [ "configure-login-service-dialog-", Spacebars.mustache(view.lookup("property")) ];                   // 188
        }                                                                                                              // 189
      }, Blaze.View("lookup:label", function() {                                                                       // 190
        return Spacebars.mustache(view.lookup("label"));                                                               // 191
      })), "\n															"), "\n															", HTML.TD("\n																	", HTML.INPUT({                      // 192
        id: function() {                                                                                               // 193
          return [ "configure-login-service-dialog-", Spacebars.mustache(view.lookup("property")) ];                   // 194
        },                                                                                                             // 195
        type: "text"                                                                                                   // 196
      }), "\n															"), "\n													"), "\n													" ];                                               // 197
    }), "\n											"), "\n											"), "\n											", HTML.P({                                                  // 198
      "class": "new-section"                                                                                           // 199
    }, "\n												Choose the login style:\n											"), "\n											", HTML.P("\n												", HTML.CharRef({ // 200
      html: "&emsp;",                                                                                                  // 201
      str: " "                                                                                                         // 202
    }), HTML.INPUT({                                                                                                   // 203
      id: "configure-login-service-dialog-popupBasedLogin",                                                            // 204
      type: "radio",                                                                                                   // 205
      checked: "checked",                                                                                              // 206
      name: "loginStyle",                                                                                              // 207
      value: "popup"                                                                                                   // 208
    }), "\n												", HTML.LABEL({                                                                                 // 209
      "for": "configure-login-service-dialog-popupBasedLogin"                                                          // 210
    }, "Popup-based login (recommended for most applications)"), "\n\n												", HTML.BR(), HTML.CharRef({         // 211
      html: "&emsp;",                                                                                                  // 212
      str: " "                                                                                                         // 213
    }), HTML.INPUT({                                                                                                   // 214
      id: "configure-login-service-dialog-redirectBasedLogin",                                                         // 215
      type: "radio",                                                                                                   // 216
      name: "loginStyle",                                                                                              // 217
      value: "redirect"                                                                                                // 218
    }), "\n												", HTML.LABEL({                                                                                 // 219
      "for": "configure-login-service-dialog-redirectBasedLogin"                                                       // 220
    }, "\n												Redirect-based login (special cases explained\n												", HTML.A({                           // 221
      href: "https://github.com/meteor/meteor/wiki/OAuth-for-mobile-Meteor-clients#popup-versus-redirect-flow",        // 222
      target: "_blank"                                                                                                 // 223
    }, "here"), ")\n												"), "\n											"), "\n									"), "\n							"), "\n							", HTML.DIV({            // 224
      "class": "modal-footer new-section"                                                                              // 225
    }, "\n									", HTML.DIV({                                                                                       // 226
      "class": "login-button btn btn-danger configure-login-service-dismiss-button"                                    // 227
    }, "\n											I'll do this later\n									"), "\n									", HTML.DIV({                                        // 228
      "class": function() {                                                                                            // 229
        return [ "login-button login-button-configure btn btn-success ", Blaze.If(function() {                         // 230
          return Spacebars.call(view.lookup("saveDisabled"));                                                          // 231
        }, function() {                                                                                                // 232
          return "login-button-disabled";                                                                              // 233
        }) ];                                                                                                          // 234
      },                                                                                                               // 235
      id: "configure-login-service-dialog-save-configuration"                                                          // 236
    }, "\n											Save Configuration\n									"), "\n							"), "\n					"), "\n			"), "\n	"), "\n	" ];             // 237
  });                                                                                                                  // 238
}));                                                                                                                   // 239
                                                                                                                       // 240
Template.__checkName("_loginButtonsMessagesDialog");                                                                   // 241
Template["_loginButtonsMessagesDialog"] = new Template("Template._loginButtonsMessagesDialog", (function() {           // 242
  var view = this;                                                                                                     // 243
  return Blaze.If(function() {                                                                                         // 244
    return Spacebars.call(view.lookup("visible"));                                                                     // 245
  }, function() {                                                                                                      // 246
    return [ "\n		", HTML.DIV({                                                                                        // 247
      "class": "accounts-dialog accounts-centered-dialog",                                                             // 248
      id: "login-buttons-message-dialog"                                                                               // 249
    }, "\n			", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n			", HTML.DIV({                   // 250
      "class": "login-button",                                                                                         // 251
      id: "messages-dialog-dismiss-button"                                                                             // 252
    }, Blaze.View("lookup:i18n", function() {                                                                          // 253
      return Spacebars.mustache(view.lookup("i18n"), "loginButtonsMessagesDialog.dismiss");                            // 254
    })), "\n		"), "\n	" ];                                                                                             // 255
  });                                                                                                                  // 256
}));                                                                                                                   // 257
                                                                                                                       // 258
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/login_buttons_session.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function () {                                                                                                         // 1
	var VALID_KEYS = [                                                                                                    // 2
		'dropdownVisible',                                                                                                   // 3
                                                                                                                       // 4
		// XXX consider replacing these with one key that has an enum for values.                                            // 5
		'inSignupFlow',                                                                                                      // 6
		'inForgotPasswordFlow',                                                                                              // 7
		'inChangePasswordFlow',                                                                                              // 8
		'inMessageOnlyFlow',                                                                                                 // 9
                                                                                                                       // 10
		'errorMessage',                                                                                                      // 11
		'infoMessage',                                                                                                       // 12
                                                                                                                       // 13
		// dialogs with messages (info and error)                                                                            // 14
		'resetPasswordToken',                                                                                                // 15
		'enrollAccountToken',                                                                                                // 16
		'justVerifiedEmail',                                                                                                 // 17
                                                                                                                       // 18
		'configureLoginServiceDialogVisible',                                                                                // 19
		'configureLoginServiceDialogServiceName',                                                                            // 20
		'configureLoginServiceDialogSaveDisabled'                                                                            // 21
	];                                                                                                                    // 22
                                                                                                                       // 23
	var validateKey = function (key) {                                                                                    // 24
		if (!_.contains(VALID_KEYS, key)){                                                                                   // 25
			throw new Error("Invalid key in loginButtonsSession: " + key);                                                      // 26
		}                                                                                                                    // 27
	};                                                                                                                    // 28
                                                                                                                       // 29
	var KEY_PREFIX = "Meteor.loginButtons.";                                                                              // 30
                                                                                                                       // 31
	// XXX we should have a better pattern for code private to a package like this one                                    // 32
	Accounts._loginButtonsSession = {                                                                                     // 33
		set: function(key, value) {                                                                                          // 34
			validateKey(key);                                                                                                   // 35
			if (_.contains(['errorMessage', 'infoMessage'], key)){                                                              // 36
				throw new Error("Don't set errorMessage or infoMessage directly. Instead, use errorMessage() or infoMessage().");  // 37
			}                                                                                                                   // 38
                                                                                                                       // 39
			this._set(key, value);                                                                                              // 40
		},                                                                                                                   // 41
                                                                                                                       // 42
		_set: function(key, value) {                                                                                         // 43
			Session.set(KEY_PREFIX + key, value);                                                                               // 44
		},                                                                                                                   // 45
                                                                                                                       // 46
		get: function(key) {                                                                                                 // 47
			validateKey(key);                                                                                                   // 48
			return Session.get(KEY_PREFIX + key);                                                                               // 49
		},                                                                                                                   // 50
                                                                                                                       // 51
		closeDropdown: function () {                                                                                         // 52
			this.set('inSignupFlow', false);                                                                                    // 53
			this.set('inForgotPasswordFlow', false);                                                                            // 54
			this.set('inChangePasswordFlow', false);                                                                            // 55
			this.set('inMessageOnlyFlow', false);                                                                               // 56
			this.set('dropdownVisible', false);                                                                                 // 57
			this.resetMessages();                                                                                               // 58
		},                                                                                                                   // 59
                                                                                                                       // 60
		infoMessage: function(message) {                                                                                     // 61
			this._set("errorMessage", null);                                                                                    // 62
			this._set("infoMessage", message);                                                                                  // 63
			this.ensureMessageVisible();                                                                                        // 64
		},                                                                                                                   // 65
                                                                                                                       // 66
		errorMessage: function(message) {                                                                                    // 67
			this._set("errorMessage", message);                                                                                 // 68
			this._set("infoMessage", null);                                                                                     // 69
			this.ensureMessageVisible();                                                                                        // 70
		},                                                                                                                   // 71
                                                                                                                       // 72
		// is there a visible dialog that shows messages (info and error)                                                    // 73
		isMessageDialogVisible: function () {                                                                                // 74
			return this.get('resetPasswordToken') ||                                                                            // 75
				this.get('enrollAccountToken') ||                                                                                  // 76
				this.get('justVerifiedEmail');                                                                                     // 77
		},                                                                                                                   // 78
                                                                                                                       // 79
		// ensure that somethings displaying a message (info or error) is                                                    // 80
		// visible.  if a dialog with messages is open, do nothing;                                                          // 81
		// otherwise open the dropdown.                                                                                      // 82
		//                                                                                                                   // 83
		// notably this doesn't matter when only displaying a single login                                                   // 84
		// button since then we have an explicit message dialog                                                              // 85
		// (_loginButtonsMessageDialog), and dropdownVisible is ignored in                                                   // 86
		// this case.                                                                                                        // 87
		ensureMessageVisible: function () {                                                                                  // 88
			if (!this.isMessageDialogVisible()){                                                                                // 89
				this.set("dropdownVisible", true);                                                                                 // 90
			}                                                                                                                   // 91
		},                                                                                                                   // 92
                                                                                                                       // 93
		resetMessages: function () {                                                                                         // 94
			this._set("errorMessage", null);                                                                                    // 95
			this._set("infoMessage", null);                                                                                     // 96
		},                                                                                                                   // 97
                                                                                                                       // 98
		configureService: function (name) {                                                                                  // 99
			this.set('configureLoginServiceDialogVisible', true);                                                               // 100
			this.set('configureLoginServiceDialogServiceName', name);                                                           // 101
			this.set('configureLoginServiceDialogSaveDisabled', true);                                                          // 102
			setTimeout(function(){                                                                                              // 103
				$('#configure-login-service-dialog-modal').modal();                                                                // 104
			}, 500)                                                                                                             // 105
		}                                                                                                                    // 106
	};                                                                                                                    // 107
}) ();                                                                                                                 // 108
                                                                                                                       // 109
                                                                                                                       // 110
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/login_buttons.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function() {                                                                                                          // 1
	if (!Accounts._loginButtons){                                                                                         // 2
		Accounts._loginButtons = {};                                                                                         // 3
	}                                                                                                                     // 4
                                                                                                                       // 5
	// for convenience                                                                                                    // 6
	var loginButtonsSession = Accounts._loginButtonsSession;                                                              // 7
                                                                                                                       // 8
	UI.registerHelper("loginButtons", function() {                                                                        // 9
		return Template._loginButtons;                                                                                       // 10
	});                                                                                                                   // 11
                                                                                                                       // 12
	// shared between dropdown and single mode                                                                            // 13
	Template._loginButtons.events({                                                                                       // 14
		'click #login-buttons-logout': function() {                                                                          // 15
			Meteor.logout(function(error) {                                                                                     // 16
				loginButtonsSession.closeDropdown();                                                                               // 17
				if (typeof accountsUIBootstrap3.logoutCallback === 'function') {                                                   // 18
					accountsUIBootstrap3.logoutCallback(error);                                                                       // 19
				}                                                                                                                  // 20
			});                                                                                                                 // 21
		}                                                                                                                    // 22
	});                                                                                                                   // 23
                                                                                                                       // 24
	//                                                                                                                    // 25
	// loginButtonLoggedOut template                                                                                      // 26
	//                                                                                                                    // 27
	Template._loginButtonsLoggedOut.helpers({                                                                             // 28
		dropdown: function() {                                                                                               // 29
			return Accounts._loginButtons.dropdown();                                                                           // 30
		},                                                                                                                   // 31
		services: function() {                                                                                               // 32
			return Accounts._loginButtons.getLoginServices();                                                                   // 33
		},                                                                                                                   // 34
		singleService: function() {                                                                                          // 35
			var services = Accounts._loginButtons.getLoginServices();                                                           // 36
			if (services.length !== 1){                                                                                         // 37
				throw new Error(                                                                                                   // 38
					"Shouldn't be rendering this template with more than one configured service");                                    // 39
			}                                                                                                                   // 40
			return services[0];                                                                                                 // 41
		},                                                                                                                   // 42
		configurationLoaded: function() {                                                                                    // 43
			return Accounts.loginServicesConfigured();                                                                          // 44
		}                                                                                                                    // 45
	});                                                                                                                   // 46
                                                                                                                       // 47
                                                                                                                       // 48
                                                                                                                       // 49
	//                                                                                                                    // 50
	// loginButtonsLoggedIn template                                                                                      // 51
	//                                                                                                                    // 52
                                                                                                                       // 53
	// decide whether we should show a dropdown rather than a row of                                                      // 54
	// buttons                                                                                                            // 55
	Template._loginButtonsLoggedIn.helpers({                                                                              // 56
		dropdown: function() {                                                                                               // 57
			return Accounts._loginButtons.dropdown();                                                                           // 58
		},                                                                                                                   // 59
		displayName: function() {                                                                                            // 60
			return Accounts._loginButtons.displayName();                                                                        // 61
		}                                                                                                                    // 62
	})                                                                                                                    // 63
                                                                                                                       // 64
                                                                                                                       // 65
                                                                                                                       // 66
	//                                                                                                                    // 67
	// loginButtonsMessage template                                                                                       // 68
	//                                                                                                                    // 69
                                                                                                                       // 70
	Template._loginButtonsMessages.helpers({                                                                              // 71
		errorMessage: function() {                                                                                           // 72
			return loginButtonsSession.get('errorMessage');                                                                     // 73
		},                                                                                                                   // 74
		infoMessage: function() {                                                                                            // 75
			return loginButtonsSession.get('infoMessage');                                                                      // 76
		}                                                                                                                    // 77
	});                                                                                                                   // 78
                                                                                                                       // 79
                                                                                                                       // 80
                                                                                                                       // 81
	//                                                                                                                    // 82
	// helpers                                                                                                            // 83
	//                                                                                                                    // 84
                                                                                                                       // 85
	Accounts._loginButtons.displayName = function() {                                                                     // 86
		var user = Meteor.user();                                                                                            // 87
		if (!user){                                                                                                          // 88
			return '';                                                                                                          // 89
		}                                                                                                                    // 90
                                                                                                                       // 91
		if (user.profile && user.profile.name){                                                                              // 92
			return user.profile.name;                                                                                           // 93
		}                                                                                                                    // 94
		if (user.username){                                                                                                  // 95
			return user.username;                                                                                               // 96
		}                                                                                                                    // 97
		if (user.emails && user.emails[0] && user.emails[0].address){                                                        // 98
			return user.emails[0].address;                                                                                      // 99
		}                                                                                                                    // 100
                                                                                                                       // 101
		return '';                                                                                                           // 102
	};                                                                                                                    // 103
                                                                                                                       // 104
	Accounts._loginButtons.getLoginServices = function() {                                                                // 105
		// First look for OAuth services.                                                                                    // 106
		var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];                                       // 107
                                                                                                                       // 108
		// Be equally kind to all login services. This also preserves                                                        // 109
		// backwards-compatibility. (But maybe order should be                                                               // 110
		// configurable?)                                                                                                    // 111
		services.sort();                                                                                                     // 112
                                                                                                                       // 113
		// Add password, if it's there; it must come last.                                                                   // 114
		if (this.hasPasswordService()){                                                                                      // 115
			services.push('password');                                                                                          // 116
		}                                                                                                                    // 117
                                                                                                                       // 118
		return _.map(services, function(name) {                                                                              // 119
			return {                                                                                                            // 120
				name: name                                                                                                         // 121
			};                                                                                                                  // 122
		});                                                                                                                  // 123
	};                                                                                                                    // 124
                                                                                                                       // 125
	Accounts._loginButtons.hasPasswordService = function() {                                                              // 126
		return !!Package['accounts-password'];                                                                               // 127
	};                                                                                                                    // 128
                                                                                                                       // 129
	Accounts._loginButtons.dropdown = function() {                                                                        // 130
		return this.hasPasswordService() || Accounts._loginButtons.getLoginServices().length > 1;                            // 131
	};                                                                                                                    // 132
                                                                                                                       // 133
	// XXX improve these. should this be in accounts-password instead?                                                    // 134
	//                                                                                                                    // 135
	// XXX these will become configurable, and will be validated on                                                       // 136
	// the server as well.                                                                                                // 137
	Accounts._loginButtons.validateUsername = function(username) {                                                        // 138
		if (username.length >= 3) {                                                                                          // 139
			return true;                                                                                                        // 140
		} else {                                                                                                             // 141
			loginButtonsSession.errorMessage(i18n('errorMessages.usernameTooShort'));                                           // 142
			return false;                                                                                                       // 143
		}                                                                                                                    // 144
	};                                                                                                                    // 145
	Accounts._loginButtons.validateEmail = function(email) {                                                              // 146
		if (Accounts.ui._passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === ''){                          // 147
			return true;                                                                                                        // 148
		}                                                                                                                    // 149
                                                                                                                       // 150
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                                                                                                       // 152
		if (re.test(email)) {                                                                                                // 153
			return true;                                                                                                        // 154
		} else {                                                                                                             // 155
			loginButtonsSession.errorMessage(i18n('errorMessages.invalidEmail'));                                               // 156
			return false;                                                                                                       // 157
		}                                                                                                                    // 158
	};                                                                                                                    // 159
	Accounts._loginButtons.validatePassword = function(password, passwordAgain) {                                         // 160
		if (password.length >= 6) {                                                                                          // 161
			if (passwordAgain && (password != passwordAgain)) {                                                                 // 162
				loginButtonsSession.errorMessage(i18n('errorMessages.passwordsDontMatch'));                                        // 163
				return false;                                                                                                      // 164
			}                                                                                                                   // 165
			return true;                                                                                                        // 166
		} else {                                                                                                             // 167
			loginButtonsSession.errorMessage(i18n('errorMessages.passwordTooShort'));                                           // 168
			return false;                                                                                                       // 169
		}                                                                                                                    // 170
	};                                                                                                                    // 171
                                                                                                                       // 172
	Accounts._loginButtons.rendered = function() {                                                                        // 173
		debugger;                                                                                                            // 174
	};                                                                                                                    // 175
                                                                                                                       // 176
})();                                                                                                                  // 177
                                                                                                                       // 178
                                                                                                                       // 179
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/login_buttons_single.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function() {                                                                                                          // 1
	// for convenience                                                                                                    // 2
	var loginButtonsSession = Accounts._loginButtonsSession;                                                              // 3
                                                                                                                       // 4
	Template._loginButtonsLoggedOutSingleLoginButton.events({                                                             // 5
		'click .login-button': function() {                                                                                  // 6
			var serviceName = this.name;                                                                                        // 7
			loginButtonsSession.resetMessages();                                                                                // 8
			var callback = function(err) {                                                                                      // 9
				if (!err) {                                                                                                        // 10
					loginButtonsSession.closeDropdown();                                                                              // 11
				} else if (err instanceof Accounts.LoginCancelledError) {                                                          // 12
					// do nothing                                                                                                     // 13
				} else if (err instanceof Accounts.ConfigError) {                                                                  // 14
					loginButtonsSession.configureService(serviceName);                                                                // 15
				} else {                                                                                                           // 16
					loginButtonsSession.errorMessage(err.reason || "Unknown error");                                                  // 17
				}                                                                                                                  // 18
			};                                                                                                                  // 19
                                                                                                                       // 20
	    // XXX Service providers should be able to specify their                                                          // 21
	    // `Meteor.loginWithX` method name.                                                                               // 22
	    var loginWithService = Meteor["loginWith" +                                                                       // 23
	                                  (serviceName === 'meteor-developer' ?                                               // 24
	                                   'MeteorDeveloperAccount' :                                                         // 25
	                                   capitalize(serviceName))];                                                         // 26
                                                                                                                       // 27
	    var options = {}; // use default scope unless specified                                                           // 28
	    if (Accounts.ui._options.requestPermissions[serviceName])                                                         // 29
	      options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];                              // 30
	    if (Accounts.ui._options.requestOfflineToken[serviceName])                                                        // 31
	      options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];                            // 32
	    if (Accounts.ui._options.forceApprovalPrompt[serviceName])                                                        // 33
	      options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];                            // 34
                                                                                                                       // 35
			loginWithService(options, callback);                                                                                // 36
		}                                                                                                                    // 37
	});                                                                                                                   // 38
                                                                                                                       // 39
	Template._loginButtonsLoggedOutSingleLoginButton.helpers({                                                            // 40
		configured: function() {                                                                                             // 41
			return !!Accounts.loginServiceConfiguration.findOne({                                                               // 42
				service: this.name                                                                                                 // 43
			});                                                                                                                 // 44
		},                                                                                                                   // 45
		capitalizedName: function() {                                                                                        // 46
			if (this.name === 'github'){                                                                                        // 47
			// XXX we should allow service packages to set their capitalized name                                               // 48
				return 'GitHub';                                                                                                   // 49
			} else {                                                                                                            // 50
				return capitalize(this.name);                                                                                      // 51
			}                                                                                                                   // 52
		}                                                                                                                    // 53
	});                                                                                                                   // 54
                                                                                                                       // 55
                                                                                                                       // 56
	// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js                                        // 57
	var capitalize = function(str) {                                                                                      // 58
		str = (str == null) ? '' : String(str);                                                                              // 59
		return str.charAt(0).toUpperCase() + str.slice(1);                                                                   // 60
	};                                                                                                                    // 61
})();                                                                                                                  // 62
                                                                                                                       // 63
                                                                                                                       // 64
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/login_buttons_dropdown.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function() {                                                                                                          // 1
                                                                                                                       // 2
	// for convenience                                                                                                    // 3
	var loginButtonsSession = Accounts._loginButtonsSession;                                                              // 4
                                                                                                                       // 5
	// events shared between loginButtonsLoggedOutDropdown and                                                            // 6
	// loginButtonsLoggedInDropdown                                                                                       // 7
	Template._loginButtons.events({                                                                                       // 8
		'click input, click .radio, click .checkbox, click option, click select': function(event) {                          // 9
			event.stopPropagation();                                                                                            // 10
		},                                                                                                                   // 11
		'click #login-name-link, click #login-sign-in-link': function(event) {                                               // 12
			event.stopPropagation();                                                                                            // 13
			loginButtonsSession.set('dropdownVisible', true);                                                                   // 14
			Meteor.flush();                                                                                                     // 15
		},                                                                                                                   // 16
		'click .login-close': function() {                                                                                   // 17
			loginButtonsSession.closeDropdown();                                                                                // 18
		},                                                                                                                   // 19
		'click .dropdown-toggle': function(event) {                                                                          // 20
			event.stopPropagation();                                                                                            // 21
			Template._loginButtons.toggleDropdown();                                                                            // 22
		}                                                                                                                    // 23
	});                                                                                                                   // 24
                                                                                                                       // 25
	Template._loginButtons.toggleDropdown = function() {                                                                  // 26
		toggleDropdown();                                                                                                    // 27
		focusInput();                                                                                                        // 28
	};                                                                                                                    // 29
                                                                                                                       // 30
	//                                                                                                                    // 31
	// loginButtonsLoggedInDropdown template and related                                                                  // 32
	//                                                                                                                    // 33
                                                                                                                       // 34
	Template._loginButtonsLoggedInDropdown.events({                                                                       // 35
		'click #login-buttons-open-change-password': function(event) {                                                       // 36
			event.stopPropagation();                                                                                            // 37
			loginButtonsSession.resetMessages();                                                                                // 38
			loginButtonsSession.set('inChangePasswordFlow', true);                                                              // 39
			Meteor.flush();                                                                                                     // 40
		}                                                                                                                    // 41
	});                                                                                                                   // 42
                                                                                                                       // 43
	Template._loginButtonsLoggedInDropdown.helpers({                                                                      // 44
		displayName: function() {                                                                                            // 45
			return Accounts._loginButtons.displayName();                                                                        // 46
		},                                                                                                                   // 47
                                                                                                                       // 48
		inChangePasswordFlow: function() {                                                                                   // 49
			return loginButtonsSession.get('inChangePasswordFlow');                                                             // 50
		},                                                                                                                   // 51
                                                                                                                       // 52
		inMessageOnlyFlow: function() {                                                                                      // 53
			return loginButtonsSession.get('inMessageOnlyFlow');                                                                // 54
		},                                                                                                                   // 55
                                                                                                                       // 56
		dropdownVisible: function() {                                                                                        // 57
			return loginButtonsSession.get('dropdownVisible');                                                                  // 58
		}                                                                                                                    // 59
	});                                                                                                                   // 60
                                                                                                                       // 61
                                                                                                                       // 62
	Template._loginButtonsLoggedInDropdownActions.helpers({                                                               // 63
		allowChangingPassword: function() {                                                                                  // 64
			// it would be more correct to check whether the user has a password set,                                           // 65
			// but in order to do that we'd have to send more data down to the client,                                          // 66
			// and it'd be preferable not to send down the entire service.password document.                                    // 67
			//                                                                                                                  // 68
			// instead we use the heuristic: if the user has a username or email set.                                           // 69
			var user = Meteor.user();                                                                                           // 70
			return user.username || (user.emails && user.emails[0] && user.emails[0].address);                                  // 71
		},                                                                                                                   // 72
		additionalLoggedInDropdownActions: function() {                                                                      // 73
			return Template._loginButtonsAdditionalLoggedInDropdownActions !== undefined;                                       // 74
		}                                                                                                                    // 75
	});                                                                                                                   // 76
                                                                                                                       // 77
                                                                                                                       // 78
	//                                                                                                                    // 79
	// loginButtonsLoggedOutDropdown template and related                                                                 // 80
	//                                                                                                                    // 81
                                                                                                                       // 82
	Template._loginButtonsLoggedOutAllServices.events({                                                                   // 83
		'click #login-buttons-password': function(event) {                                                                   // 84
			event.stopPropagation();                                                                                            // 85
			loginOrSignup();                                                                                                    // 86
		},                                                                                                                   // 87
                                                                                                                       // 88
		'keypress #forgot-password-email': function(event) {                                                                 // 89
			event.stopPropagation();                                                                                            // 90
			if (event.keyCode === 13){                                                                                          // 91
				forgotPassword();                                                                                                  // 92
			}                                                                                                                   // 93
		},                                                                                                                   // 94
                                                                                                                       // 95
		'click #login-buttons-forgot-password': function(event) {                                                            // 96
			event.stopPropagation();                                                                                            // 97
			forgotPassword();                                                                                                   // 98
		},                                                                                                                   // 99
                                                                                                                       // 100
		'click #signup-link': function(event) {                                                                              // 101
			event.stopPropagation();                                                                                            // 102
			loginButtonsSession.resetMessages();                                                                                // 103
                                                                                                                       // 104
			// store values of fields before swtiching to the signup form                                                       // 105
			var username = trimmedElementValueById('login-username');                                                           // 106
			var email = trimmedElementValueById('login-email');                                                                 // 107
			var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                           // 108
			// notably not trimmed. a password could (?) start or end with a space                                              // 109
			var password = elementValueById('login-password');                                                                  // 110
                                                                                                                       // 111
			loginButtonsSession.set('inSignupFlow', true);                                                                      // 112
			loginButtonsSession.set('inForgotPasswordFlow', false);                                                             // 113
                                                                                                                       // 114
			// force the ui to update so that we have the approprate fields to fill in                                          // 115
			Meteor.flush();                                                                                                     // 116
                                                                                                                       // 117
			// update new fields with appropriate defaults                                                                      // 118
			if (username !== null){                                                                                             // 119
				document.getElementById('login-username').value = username;                                                        // 120
			} else if (email !== null){                                                                                         // 121
				document.getElementById('login-email').value = email;                                                              // 122
			} else if (usernameOrEmail !== null){                                                                               // 123
				if (usernameOrEmail.indexOf('@') === -1){                                                                          // 124
					document.getElementById('login-username').value = usernameOrEmail;                                                // 125
				} else {                                                                                                           // 126
					document.getElementById('login-email').value = usernameOrEmail;                                                   // 127
				}                                                                                                                  // 128
			}                                                                                                                   // 129
		},                                                                                                                   // 130
		'click #forgot-password-link': function(event) {                                                                     // 131
			event.stopPropagation();                                                                                            // 132
			loginButtonsSession.resetMessages();                                                                                // 133
                                                                                                                       // 134
			// store values of fields before swtiching to the signup form                                                       // 135
			var email = trimmedElementValueById('login-email');                                                                 // 136
			var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                           // 137
                                                                                                                       // 138
			loginButtonsSession.set('inSignupFlow', false);                                                                     // 139
			loginButtonsSession.set('inForgotPasswordFlow', true);                                                              // 140
                                                                                                                       // 141
			// force the ui to update so that we have the approprate fields to fill in                                          // 142
			Meteor.flush();                                                                                                     // 143
			//toggleDropdown();                                                                                                 // 144
                                                                                                                       // 145
			// update new fields with appropriate defaults                                                                      // 146
			if (email !== null){                                                                                                // 147
				document.getElementById('forgot-password-email').value = email;                                                    // 148
			} else if (usernameOrEmail !== null){                                                                               // 149
				if (usernameOrEmail.indexOf('@') !== -1){                                                                          // 150
					document.getElementById('forgot-password-email').value = usernameOrEmail;                                         // 151
				}                                                                                                                  // 152
			}                                                                                                                   // 153
		},                                                                                                                   // 154
		'click #back-to-login-link': function(event) {                                                                       // 155
			event.stopPropagation();                                                                                            // 156
			loginButtonsSession.resetMessages();                                                                                // 157
                                                                                                                       // 158
			var username = trimmedElementValueById('login-username');                                                           // 159
			var email = trimmedElementValueById('login-email') || trimmedElementValueById('forgot-password-email'); // Ughh. Standardize on names?
                                                                                                                       // 161
			loginButtonsSession.set('inSignupFlow', false);                                                                     // 162
			loginButtonsSession.set('inForgotPasswordFlow', false);                                                             // 163
                                                                                                                       // 164
			// force the ui to update so that we have the approprate fields to fill in                                          // 165
			Meteor.flush();                                                                                                     // 166
                                                                                                                       // 167
			if (document.getElementById('login-username')){                                                                     // 168
				document.getElementById('login-username').value = username;                                                        // 169
			}                                                                                                                   // 170
			if (document.getElementById('login-email')){                                                                        // 171
				document.getElementById('login-email').value = email;                                                              // 172
			}                                                                                                                   // 173
			// "login-password" is preserved thanks to the preserve-inputs package                                              // 174
			if (document.getElementById('login-username-or-email')){                                                            // 175
				document.getElementById('login-username-or-email').value = email || username;                                      // 176
			}                                                                                                                   // 177
		},                                                                                                                   // 178
		'keypress #login-username, keypress #login-email, keypress #login-username-or-email, keypress #login-password, keypress #login-password-again': function(event) {
			if (event.keyCode === 13){                                                                                          // 180
				loginOrSignup();                                                                                                   // 181
			}                                                                                                                   // 182
		}                                                                                                                    // 183
	});                                                                                                                   // 184
                                                                                                                       // 185
	Template._loginButtonsLoggedOutDropdown.helpers({                                                                     // 186
	  forbidClientAccountCreation: function() {                                                                           // 187
	    return Accounts._options.forbidClientAccountCreation;                                                             // 188
    }                                                                                                                  // 189
  });                                                                                                                  // 190
                                                                                                                       // 191
	Template._loginButtonsLoggedOutAllServices.helpers({                                                                  // 192
		// additional classes that can be helpful in styling the dropdown                                                    // 193
		additionalClasses: function() {                                                                                      // 194
			if (!Accounts.password) {                                                                                           // 195
				return false;                                                                                                      // 196
			} else {                                                                                                            // 197
				if (loginButtonsSession.get('inSignupFlow')) {                                                                     // 198
					return 'login-form-create-account';                                                                               // 199
				} else if (loginButtonsSession.get('inForgotPasswordFlow')) {                                                      // 200
					return 'login-form-forgot-password';                                                                              // 201
				} else {                                                                                                           // 202
					return 'login-form-sign-in';                                                                                      // 203
				}                                                                                                                  // 204
			}                                                                                                                   // 205
		},                                                                                                                   // 206
                                                                                                                       // 207
		dropdownVisible: function() {                                                                                        // 208
			return loginButtonsSession.get('dropdownVisible');                                                                  // 209
		},                                                                                                                   // 210
                                                                                                                       // 211
		services: function() {                                                                                               // 212
			return Accounts._loginButtons.getLoginServices();                                                                   // 213
		},                                                                                                                   // 214
                                                                                                                       // 215
		isPasswordService: function() {                                                                                      // 216
			return this.name === 'password';                                                                                    // 217
		},                                                                                                                   // 218
                                                                                                                       // 219
		hasOtherServices: function() {                                                                                       // 220
			return Accounts._loginButtons.getLoginServices().length > 1;                                                        // 221
		},                                                                                                                   // 222
                                                                                                                       // 223
		hasPasswordService: function() {                                                                                     // 224
			return Accounts._loginButtons.hasPasswordService();                                                                 // 225
		}                                                                                                                    // 226
	});                                                                                                                   // 227
                                                                                                                       // 228
                                                                                                                       // 229
	Template._loginButtonsLoggedOutPasswordService.helpers({                                                              // 230
		fields: function() {                                                                                                 // 231
			var loginFields = [{                                                                                                // 232
				fieldName: 'username-or-email',                                                                                    // 233
				fieldLabel: i18n('loginFields.usernameOrEmail'),                                                                   // 234
				visible: function() {                                                                                              // 235
					return _.contains(                                                                                                // 236
						["USERNAME_AND_EMAIL_CONFIRM", "USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL"],                             // 237
						Accounts.ui._passwordSignupFields());                                                                            // 238
				}                                                                                                                  // 239
			}, {                                                                                                                // 240
				fieldName: 'username',                                                                                             // 241
				fieldLabel: i18n('loginFields.username'),                                                                          // 242
				visible: function() {                                                                                              // 243
					return Accounts.ui._passwordSignupFields() === "USERNAME_ONLY";                                                   // 244
				}                                                                                                                  // 245
			}, {                                                                                                                // 246
				fieldName: 'email',                                                                                                // 247
				fieldLabel: i18n('loginFields.email'),                                                                             // 248
				inputType: 'email',                                                                                                // 249
				visible: function() {                                                                                              // 250
					return Accounts.ui._passwordSignupFields() === "EMAIL_ONLY";                                                      // 251
				}                                                                                                                  // 252
			}, {                                                                                                                // 253
				fieldName: 'password',                                                                                             // 254
				fieldLabel: i18n('loginFields.password'),                                                                          // 255
				inputType: 'password',                                                                                             // 256
				visible: function() {                                                                                              // 257
					return true;                                                                                                      // 258
				}                                                                                                                  // 259
			}];                                                                                                                 // 260
                                                                                                                       // 261
			var signupFields = [{                                                                                               // 262
				fieldName: 'username',                                                                                             // 263
				fieldLabel: i18n('signupFields.username'),                                                                         // 264
				visible: function() {                                                                                              // 265
					return _.contains(                                                                                                // 266
						["USERNAME_AND_EMAIL_CONFIRM", "USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],            // 267
						Accounts.ui._passwordSignupFields());                                                                            // 268
				}                                                                                                                  // 269
			}, {                                                                                                                // 270
				fieldName: 'email',                                                                                                // 271
				fieldLabel: i18n('signupFields.email'),                                                                            // 272
				inputType: 'email',                                                                                                // 273
				visible: function() {                                                                                              // 274
					return _.contains(                                                                                                // 275
						["USERNAME_AND_EMAIL_CONFIRM", "USERNAME_AND_EMAIL", "EMAIL_ONLY"],                                              // 276
						Accounts.ui._passwordSignupFields());                                                                            // 277
				}                                                                                                                  // 278
			}, {                                                                                                                // 279
				fieldName: 'email',                                                                                                // 280
				fieldLabel: i18n('signupFields.emailOpt'),                                                                         // 281
				inputType: 'email',                                                                                                // 282
				visible: function() {                                                                                              // 283
					return Accounts.ui._passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL";                                     // 284
				}                                                                                                                  // 285
			}, {                                                                                                                // 286
				fieldName: 'password',                                                                                             // 287
				fieldLabel: i18n('signupFields.password'),                                                                         // 288
				inputType: 'password',                                                                                             // 289
				visible: function() {                                                                                              // 290
					return true;                                                                                                      // 291
				}                                                                                                                  // 292
			}, {                                                                                                                // 293
				fieldName: 'password-again',                                                                                       // 294
				fieldLabel: i18n('signupFields.passwordAgain'),                                                                    // 295
				inputType: 'password',                                                                                             // 296
				visible: function() {                                                                                              // 297
					// No need to make users double-enter their password if                                                           // 298
					// they'll necessarily have an email set, since they can use                                                      // 299
					// the "forgot password" flow.                                                                                    // 300
					return _.contains(                                                                                                // 301
						["USERNAME_AND_EMAIL_CONFIRM", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],                                  // 302
						Accounts.ui._passwordSignupFields());                                                                            // 303
				}                                                                                                                  // 304
			}];                                                                                                                 // 305
                                                                                                                       // 306
			signupFields = signupFields.concat(Accounts.ui._options.extraSignupFields);                                         // 307
                                                                                                                       // 308
			return loginButtonsSession.get('inSignupFlow') ? signupFields : loginFields;                                        // 309
		},                                                                                                                   // 310
                                                                                                                       // 311
		inForgotPasswordFlow: function() {                                                                                   // 312
			return loginButtonsSession.get('inForgotPasswordFlow');                                                             // 313
		},                                                                                                                   // 314
                                                                                                                       // 315
		inLoginFlow: function() {                                                                                            // 316
			return !loginButtonsSession.get('inSignupFlow') && !loginButtonsSession.get('inForgotPasswordFlow');                // 317
		},                                                                                                                   // 318
                                                                                                                       // 319
		inSignupFlow: function() {                                                                                           // 320
			return loginButtonsSession.get('inSignupFlow');                                                                     // 321
		},                                                                                                                   // 322
                                                                                                                       // 323
		showForgotPasswordLink: function() {                                                                                 // 324
			return _.contains(                                                                                                  // 325
				["USERNAME_AND_EMAIL_CONFIRM", "USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"],                 // 326
				Accounts.ui._passwordSignupFields());                                                                              // 327
		},                                                                                                                   // 328
                                                                                                                       // 329
		showCreateAccountLink: function() {                                                                                  // 330
			return !Accounts._options.forbidClientAccountCreation;                                                              // 331
		}                                                                                                                    // 332
	});                                                                                                                   // 333
                                                                                                                       // 334
	Template._loginButtonsFormField.helpers({                                                                             // 335
		equals: function(a, b) {                                                                                             // 336
			return (a === b);                                                                                                   // 337
		},                                                                                                                   // 338
		inputType: function() {                                                                                              // 339
			return this.inputType || "text";                                                                                    // 340
		},                                                                                                                   // 341
        inputTextual: function() {                                                                                     // 342
          return !_.contains(["radio", "checkbox", "select"], this.inputType);                                         // 343
        }                                                                                                              // 344
	});                                                                                                                   // 345
                                                                                                                       // 346
	//                                                                                                                    // 347
	// loginButtonsChangePassword template                                                                                // 348
	//                                                                                                                    // 349
	Template._loginButtonsChangePassword.events({                                                                         // 350
		'keypress #login-old-password, keypress #login-password, keypress #login-password-again': function(event) {          // 351
			if (event.keyCode === 13){                                                                                          // 352
				changePassword();                                                                                                  // 353
			}                                                                                                                   // 354
		},                                                                                                                   // 355
		'click #login-buttons-do-change-password': function(event) {                                                         // 356
			event.stopPropagation();                                                                                            // 357
			changePassword();                                                                                                   // 358
		},                                                                                                                   // 359
		'click #login-buttons-cancel-change-password': function(event) {                                                     // 360
			event.stopPropagation();                                                                                            // 361
			loginButtonsSession.resetMessages();                                                                                // 362
			Accounts._loginButtonsSession.set('inChangePasswordFlow', false);                                                   // 363
			Meteor.flush();                                                                                                     // 364
		}                                                                                                                    // 365
	});                                                                                                                   // 366
                                                                                                                       // 367
	Template._loginButtonsChangePassword.helpers({                                                                        // 368
		fields: function() {                                                                                                 // 369
			return [{                                                                                                           // 370
				fieldName: 'old-password',                                                                                         // 371
				fieldLabel: i18n('changePasswordFields.currentPassword'),                                                          // 372
				inputType: 'password',                                                                                             // 373
				visible: function() {                                                                                              // 374
					return true;                                                                                                      // 375
				}                                                                                                                  // 376
			}, {                                                                                                                // 377
				fieldName: 'password',                                                                                             // 378
				fieldLabel: i18n('changePasswordFields.newPassword'),                                                              // 379
				inputType: 'password',                                                                                             // 380
				visible: function() {                                                                                              // 381
					return true;                                                                                                      // 382
				}                                                                                                                  // 383
			}, {                                                                                                                // 384
				fieldName: 'password-again',                                                                                       // 385
				fieldLabel: i18n('changePasswordFields.newPasswordAgain'),                                                         // 386
				inputType: 'password',                                                                                             // 387
				visible: function() {                                                                                              // 388
					// No need to make users double-enter their password if                                                           // 389
					// they'll necessarily have an email set, since they can use                                                      // 390
					// the "forgot password" flow.                                                                                    // 391
					return _.contains(                                                                                                // 392
						["USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],                                                                // 393
						Accounts.ui._passwordSignupFields());                                                                            // 394
				}                                                                                                                  // 395
			}];                                                                                                                 // 396
		}                                                                                                                    // 397
	});                                                                                                                   // 398
                                                                                                                       // 399
	//                                                                                                                    // 400
	// helpers                                                                                                            // 401
	//                                                                                                                    // 402
                                                                                                                       // 403
	var elementValueById = function(id) {                                                                                 // 404
		var element = document.getElementById(id);                                                                           // 405
		if (!element){                                                                                                       // 406
			return null;                                                                                                        // 407
		} else {                                                                                                             // 408
			return element.value;                                                                                               // 409
		}                                                                                                                    // 410
	};                                                                                                                    // 411
                                                                                                                       // 412
	var elementValueByIdForRadio = function(fieldIdPrefix, radioOptions) {                                                // 413
    var value = null;                                                                                                  // 414
    for (i in radioOptions) {                                                                                          // 415
      var element = document.getElementById(fieldIdPrefix + '-' + radioOptions[i].id);                                 // 416
			if (element && element.checked){                                                                                    // 417
				value =  element.value;                                                                                            // 418
			}                                                                                                                   // 419
    }                                                                                                                  // 420
    return value;                                                                                                      // 421
  };                                                                                                                   // 422
                                                                                                                       // 423
	var elementValueByIdForCheckbox = function(id) {                                                                      // 424
		var element = document.getElementById(id);                                                                           // 425
		return element.checked;                                                                                              // 426
  };                                                                                                                   // 427
                                                                                                                       // 428
	var trimmedElementValueById = function(id) {                                                                          // 429
		var element = document.getElementById(id);                                                                           // 430
		if (!element){                                                                                                       // 431
			return null;                                                                                                        // 432
		} else {                                                                                                             // 433
			return element.value.replace(/^\s*|\s*$/g, ""); // trim;                                                            // 434
		}                                                                                                                    // 435
	};                                                                                                                    // 436
                                                                                                                       // 437
	var loginOrSignup = function() {                                                                                      // 438
		if (loginButtonsSession.get('inSignupFlow')){                                                                        // 439
			signup();                                                                                                           // 440
		} else {                                                                                                             // 441
			login();                                                                                                            // 442
		}                                                                                                                    // 443
	};                                                                                                                    // 444
                                                                                                                       // 445
	var login = function() {                                                                                              // 446
		loginButtonsSession.resetMessages();                                                                                 // 447
                                                                                                                       // 448
		var username = trimmedElementValueById('login-username');                                                            // 449
		if (username && Accounts.ui._options.forceUsernameLowercase) {                                                       // 450
			username = username.toLowerCase();                                                                                  // 451
		}                                                                                                                    // 452
		var email = trimmedElementValueById('login-email');                                                                  // 453
		if (email && Accounts.ui._options.forceEmailLowercase) {                                                             // 454
			email = email.toLowerCase();                                                                                        // 455
		}                                                                                                                    // 456
		var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                            // 457
		if (usernameOrEmail && Accounts.ui._options.forceEmailLowercase && Accounts.ui._options.forceUsernameLowercase) {    // 458
			usernameOrEmail = usernameOrEmail.toLowerCase();                                                                    // 459
		}                                                                                                                    // 460
                                                                                                                       // 461
		// notably not trimmed. a password could (?) start or end with a space                                               // 462
		var password = elementValueById('login-password');                                                                   // 463
		if (password && Accounts.ui._options.forcePasswordLowercase) {                                                       // 464
			password = password.toLowerCase();                                                                                  // 465
		}                                                                                                                    // 466
                                                                                                                       // 467
		var loginSelector;                                                                                                   // 468
		if (username !== null) {                                                                                             // 469
			if (!Accounts._loginButtons.validateUsername(username)){                                                            // 470
				return;                                                                                                            // 471
			} else {                                                                                                            // 472
				loginSelector = {                                                                                                  // 473
					username: username                                                                                                // 474
				};                                                                                                                 // 475
			}                                                                                                                   // 476
		} else if (email !== null) {                                                                                         // 477
			if (!Accounts._loginButtons.validateEmail(email)){                                                                  // 478
				return;                                                                                                            // 479
			} else {                                                                                                            // 480
				loginSelector = {                                                                                                  // 481
					email: email                                                                                                      // 482
				};                                                                                                                 // 483
			}                                                                                                                   // 484
		} else if (usernameOrEmail !== null) {                                                                               // 485
			// XXX not sure how we should validate this. but this seems good enough (for now),                                  // 486
			// since an email must have at least 3 characters anyways                                                           // 487
			if (!Accounts._loginButtons.validateUsername(usernameOrEmail)){                                                     // 488
				return;                                                                                                            // 489
			} else {                                                                                                            // 490
				loginSelector = usernameOrEmail;                                                                                   // 491
			}                                                                                                                   // 492
		} else {                                                                                                             // 493
			throw new Error("Unexpected -- no element to use as a login user selector");                                        // 494
		}                                                                                                                    // 495
                                                                                                                       // 496
		Meteor.loginWithPassword(loginSelector, password, function(error, result) {                                          // 497
			if (error) {                                                                                                        // 498
				if (error.reason == 'User not found'){                                                                             // 499
					loginButtonsSession.errorMessage(i18n('errorMessages.userNotFound'))                                              // 500
				} else if (error.reason == 'Incorrect password'){                                                                  // 501
					loginButtonsSession.errorMessage(i18n('errorMessages.incorrectPassword'))                                         // 502
				} else {                                                                                                           // 503
					loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                // 504
				}                                                                                                                  // 505
			} else {                                                                                                            // 506
				loginButtonsSession.closeDropdown();                                                                               // 507
			}                                                                                                                   // 508
		});                                                                                                                  // 509
	};                                                                                                                    // 510
                                                                                                                       // 511
	var toggleDropdown = function() {                                                                                     // 512
		$("#login-dropdown-list").toggleClass("open");                                                                       // 513
	}                                                                                                                     // 514
                                                                                                                       // 515
	var focusInput = function() {                                                                                         // 516
		setTimeout(function() {                                                                                              // 517
			$("#login-dropdown-list input").first().focus();                                                                    // 518
		}, 0);                                                                                                               // 519
	};                                                                                                                    // 520
                                                                                                                       // 521
	var signup = function() {                                                                                             // 522
		loginButtonsSession.resetMessages();                                                                                 // 523
                                                                                                                       // 524
		// to be passed to Accounts.createUser                                                                               // 525
		var options = {};                                                                                                    // 526
		if(typeof accountsUIBootstrap3.setCustomSignupOptions === 'function') {                                              // 527
			options = accountsUIBootstrap3.setCustomSignupOptions();                                                            // 528
			if (!(options instanceof Object)){ options = {}; }                                                                  // 529
		}                                                                                                                    // 530
                                                                                                                       // 531
		var username = trimmedElementValueById('login-username');                                                            // 532
		if (username && Accounts.ui._options.forceUsernameLowercase) {                                                       // 533
			username = username.toLowerCase();                                                                                  // 534
		}                                                                                                                    // 535
		if (username !== null) {                                                                                             // 536
			if (!Accounts._loginButtons.validateUsername(username)){                                                            // 537
				return;                                                                                                            // 538
			} else {                                                                                                            // 539
				options.username = username;                                                                                       // 540
			}                                                                                                                   // 541
		}                                                                                                                    // 542
                                                                                                                       // 543
		var email = trimmedElementValueById('login-email');                                                                  // 544
		if (email && Accounts.ui._options.forceEmailLowercase) {                                                             // 545
			email = email.toLowerCase();                                                                                        // 546
		}                                                                                                                    // 547
		if (email !== null) {                                                                                                // 548
			if (!Accounts._loginButtons.validateEmail(email)){                                                                  // 549
				return;                                                                                                            // 550
			} else {                                                                                                            // 551
				options.email = email;                                                                                             // 552
			}                                                                                                                   // 553
		}                                                                                                                    // 554
                                                                                                                       // 555
		// notably not trimmed. a password could (?) start or end with a space                                               // 556
		var password = elementValueById('login-password');                                                                   // 557
		if (password && Accounts.ui._options.forcePasswordLowercase) {                                                       // 558
			password = password.toLowerCase();                                                                                  // 559
		}                                                                                                                    // 560
		if (!Accounts._loginButtons.validatePassword(password)){                                                             // 561
			return;                                                                                                             // 562
		} else {                                                                                                             // 563
			options.password = password;                                                                                        // 564
		}                                                                                                                    // 565
                                                                                                                       // 566
		if (!matchPasswordAgainIfPresent()){                                                                                 // 567
			return;                                                                                                             // 568
		}                                                                                                                    // 569
                                                                                                                       // 570
		// prepare the profile object                                                                                        // 571
		// it could have already been set through setCustomSignupOptions                                                     // 572
		if (!(options.profile instanceof Object)){                                                                           // 573
			options.profile = {};                                                                                               // 574
		}                                                                                                                    // 575
                                                                                                                       // 576
		// define a proxy function to allow extraSignupFields set error messages                                             // 577
		var errorFunction = function(errorMessage) {                                                                         // 578
			Accounts._loginButtonsSession.errorMessage(errorMessage);                                                           // 579
		};                                                                                                                   // 580
                                                                                                                       // 581
		var invalidExtraSignupFields = false;                                                                                // 582
		// parse extraSignupFields to populate account's profile data                                                        // 583
		_.each(Accounts.ui._options.extraSignupFields, function(field, index) {                                              // 584
            var value = null;                                                                                          // 585
            var elementIdPrefix = 'login-';                                                                            // 586
                                                                                                                       // 587
            if (field.inputType === 'radio') {                                                                         // 588
              value = elementValueByIdForRadio(elementIdPrefix + field.fieldName, field.data);                         // 589
            } else if (field.inputType === 'checkbox') {                                                               // 590
            	value = elementValueByIdForCheckbox(elementIdPrefix + field.fieldName);                                   // 591
            } else {                                                                                                   // 592
              value = elementValueById(elementIdPrefix + field.fieldName);                                             // 593
            }                                                                                                          // 594
                                                                                                                       // 595
			if (typeof field.validate === 'function') {                                                                         // 596
				if (field.validate(value, errorFunction)) {                                                                        // 597
					if (typeof field.saveToProfile !== 'undefined' && !field.saveToProfile){                                          // 598
						options[field.fieldName] = value;                                                                                // 599
					} else {                                                                                                          // 600
						options.profile[field.fieldName] = value;                                                                        // 601
					}                                                                                                                 // 602
				} else {                                                                                                           // 603
					invalidExtraSignupFields = true;                                                                                  // 604
				}                                                                                                                  // 605
			} else {                                                                                                            // 606
				options.profile[field.fieldName] = value;                                                                          // 607
			}                                                                                                                   // 608
		});                                                                                                                  // 609
                                                                                                                       // 610
		if (invalidExtraSignupFields){                                                                                       // 611
			return;                                                                                                             // 612
		}                                                                                                                    // 613
                                                                                                                       // 614
		Accounts.createUser(options, function(error) {                                                                       // 615
			if (error) {                                                                                                        // 616
				if (error.reason == 'Signups forbidden'){                                                                          // 617
					loginButtonsSession.errorMessage(i18n('errorMessages.signupsForbidden'))                                          // 618
				} else {                                                                                                           // 619
					loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                // 620
				}                                                                                                                  // 621
			} else {                                                                                                            // 622
				loginButtonsSession.closeDropdown();                                                                               // 623
			}                                                                                                                   // 624
		});                                                                                                                  // 625
	};                                                                                                                    // 626
                                                                                                                       // 627
	var forgotPassword = function() {                                                                                     // 628
		loginButtonsSession.resetMessages();                                                                                 // 629
                                                                                                                       // 630
		var email = trimmedElementValueById("forgot-password-email");                                                        // 631
		if (email.indexOf('@') !== -1) {                                                                                     // 632
			Accounts.forgotPassword({                                                                                           // 633
				email: email                                                                                                       // 634
			}, function(error) {                                                                                                // 635
				if (error) {                                                                                                       // 636
					if (error.reason == 'User not found'){                                                                            // 637
						loginButtonsSession.errorMessage(i18n('errorMessages.userNotFound'))                                             // 638
					} else {                                                                                                          // 639
						loginButtonsSession.errorMessage(error.reason || "Unknown error");                                               // 640
					}                                                                                                                 // 641
				} else {                                                                                                           // 642
					loginButtonsSession.infoMessage(i18n('infoMessages.emailSent'));                                                  // 643
				}                                                                                                                  // 644
			});                                                                                                                 // 645
		} else {                                                                                                             // 646
			loginButtonsSession.errorMessage(i18n('forgotPasswordForm.invalidEmail'));                                          // 647
		}                                                                                                                    // 648
	};                                                                                                                    // 649
	var changePassword = function() {                                                                                     // 650
		loginButtonsSession.resetMessages();                                                                                 // 651
		// notably not trimmed. a password could (?) start or end with a space                                               // 652
		var oldPassword = elementValueById('login-old-password');                                                            // 653
		// notably not trimmed. a password could (?) start or end with a space                                               // 654
		var password = elementValueById('login-password');                                                                   // 655
                                                                                                                       // 656
		if (password == oldPassword) {                                                                                       // 657
			loginButtonsSession.errorMessage(i18n('errorMessages.newPasswordSameAsOld'));                                       // 658
			return;                                                                                                             // 659
		}                                                                                                                    // 660
                                                                                                                       // 661
		if (!Accounts._loginButtons.validatePassword(password)){                                                             // 662
			return;                                                                                                             // 663
		}                                                                                                                    // 664
                                                                                                                       // 665
		if (!matchPasswordAgainIfPresent()){                                                                                 // 666
			return;                                                                                                             // 667
		}                                                                                                                    // 668
                                                                                                                       // 669
		Accounts.changePassword(oldPassword, password, function(error) {                                                     // 670
			if (error) {                                                                                                        // 671
				if (error.reason == 'Incorrect password'){                                                                         // 672
					loginButtonsSession.errorMessage(i18n('errorMessages.incorrectPassword'))                                         // 673
				} else {                                                                                                           // 674
					loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                // 675
				}                                                                                                                  // 676
			} else {                                                                                                            // 677
				loginButtonsSession.infoMessage(i18n('infoMessages.passwordChanged'));                                             // 678
                                                                                                                       // 679
				// wait 3 seconds, then expire the msg                                                                             // 680
				Meteor.setTimeout(function() {                                                                                     // 681
					loginButtonsSession.resetMessages();                                                                              // 682
				}, 3000);                                                                                                          // 683
			}                                                                                                                   // 684
		});                                                                                                                  // 685
	};                                                                                                                    // 686
                                                                                                                       // 687
	var matchPasswordAgainIfPresent = function() {                                                                        // 688
		// notably not trimmed. a password could (?) start or end with a space                                               // 689
		var passwordAgain = elementValueById('login-password-again');                                                        // 690
		if (passwordAgain !== null) {                                                                                        // 691
			// notably not trimmed. a password could (?) start or end with a space                                              // 692
			var password = elementValueById('login-password');                                                                  // 693
			if (password !== passwordAgain) {                                                                                   // 694
				loginButtonsSession.errorMessage(i18n('errorMessages.passwordsDontMatch'));                                        // 695
				return false;                                                                                                      // 696
			}                                                                                                                   // 697
		}                                                                                                                    // 698
		return true;                                                                                                         // 699
	};                                                                                                                    // 700
})();                                                                                                                  // 701
                                                                                                                       // 702
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ian:accounts-ui-bootstrap-3/login_buttons_dialogs.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function() {                                                                                                          // 1
	// for convenience                                                                                                    // 2
	var loginButtonsSession = Accounts._loginButtonsSession;                                                              // 3
                                                                                                                       // 4
                                                                                                                       // 5
	//                                                                                                                    // 6
	// populate the session so that the appropriate dialogs are                                                           // 7
	// displayed by reading variables set by accounts-urls, which parses                                                  // 8
	// special URLs. since accounts-ui depends on accounts-urls, we are                                                   // 9
	// guaranteed to have these set at this point.                                                                        // 10
	//                                                                                                                    // 11
                                                                                                                       // 12
	if (Accounts._resetPasswordToken) {                                                                                   // 13
		loginButtonsSession.set('resetPasswordToken', Accounts._resetPasswordToken);                                         // 14
	}                                                                                                                     // 15
                                                                                                                       // 16
	if (Accounts._enrollAccountToken) {                                                                                   // 17
		loginButtonsSession.set('enrollAccountToken', Accounts._enrollAccountToken);                                         // 18
	}                                                                                                                     // 19
                                                                                                                       // 20
	// Needs to be in Meteor.startup because of a package loading order                                                   // 21
	// issue. We can't be sure that accounts-password is loaded earlier                                                   // 22
	// than accounts-ui so Accounts.verifyEmail might not be defined.                                                     // 23
	Meteor.startup(function() {                                                                                           // 24
		if (Accounts._verifyEmailToken) {                                                                                    // 25
			Accounts.verifyEmail(Accounts._verifyEmailToken, function(error) {                                                  // 26
				Accounts._enableAutoLogin();                                                                                       // 27
				if (!error){                                                                                                       // 28
					loginButtonsSession.set('justVerifiedEmail', true);                                                               // 29
				}                                                                                                                  // 30
				// XXX show something if there was an error.                                                                       // 31
			});                                                                                                                 // 32
		}                                                                                                                    // 33
	});                                                                                                                   // 34
                                                                                                                       // 35
	//                                                                                                                    // 36
	// resetPasswordDialog template                                                                                       // 37
	//                                                                                                                    // 38
                                                                                                                       // 39
	Template._resetPasswordDialog.events({                                                                                // 40
		'click #login-buttons-reset-password-button': function(event) {                                                      // 41
			event.stopPropagation();                                                                                            // 42
			resetPassword();                                                                                                    // 43
		},                                                                                                                   // 44
		'keypress #reset-password-new-password': function(event) {                                                           // 45
			if (event.keyCode === 13){                                                                                          // 46
				resetPassword();                                                                                                   // 47
			}                                                                                                                   // 48
		},                                                                                                                   // 49
		'click #login-buttons-cancel-reset-password': function(event) {                                                      // 50
			event.stopPropagation();                                                                                            // 51
			loginButtonsSession.set('resetPasswordToken', null);                                                                // 52
			Accounts._enableAutoLogin();                                                                                        // 53
			$('#login-buttons-reset-password-modal').modal("hide");                                                             // 54
		}                                                                                                                    // 55
	});                                                                                                                   // 56
                                                                                                                       // 57
	var resetPassword = function() {                                                                                      // 58
		loginButtonsSession.resetMessages();                                                                                 // 59
		var newPassword = document.getElementById('reset-password-new-password').value;                                      // 60
		var passwordAgain= document.getElementById('reset-password-new-password-again').value;                               // 61
		if (!Accounts._loginButtons.validatePassword(newPassword,passwordAgain)){                                            // 62
			return;                                                                                                             // 63
		}                                                                                                                    // 64
                                                                                                                       // 65
		Accounts.resetPassword(                                                                                              // 66
			loginButtonsSession.get('resetPasswordToken'), newPassword,                                                         // 67
			function(error) {                                                                                                   // 68
				if (error) {                                                                                                       // 69
					loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                // 70
				} else {                                                                                                           // 71
					loginButtonsSession.set('resetPasswordToken', null);                                                              // 72
					Accounts._enableAutoLogin();                                                                                      // 73
					$('#login-buttons-reset-password-modal').modal("hide");                                                           // 74
				}                                                                                                                  // 75
			});                                                                                                                 // 76
	};                                                                                                                    // 77
                                                                                                                       // 78
	Template._resetPasswordDialog.helpers({                                                                               // 79
		inResetPasswordFlow: function() {                                                                                    // 80
			return loginButtonsSession.get('resetPasswordToken');                                                               // 81
		}                                                                                                                    // 82
	});                                                                                                                   // 83
                                                                                                                       // 84
	Template._resetPasswordDialog.rendered = function() {                                                                 // 85
		var $modal = $(this.find('#login-buttons-reset-password-modal'));                                                    // 86
		if (!_.isFunction($modal.modal)) {                                                                                   // 87
			console.error("You have to add a Bootstrap package, i.e. meteor add twbs:bootstrap");                               // 88
		} else {                                                                                                             // 89
			$modal.modal();                                                                                                     // 90
		}                                                                                                                    // 91
	};                                                                                                                    // 92
                                                                                                                       // 93
	//                                                                                                                    // 94
	// enrollAccountDialog template                                                                                       // 95
	//                                                                                                                    // 96
                                                                                                                       // 97
	Template._enrollAccountDialog.events({                                                                                // 98
		'click #login-buttons-enroll-account-button': function() {                                                           // 99
			enrollAccount();                                                                                                    // 100
		},                                                                                                                   // 101
		'keypress #enroll-account-password': function(event) {                                                               // 102
			if (event.keyCode === 13){                                                                                          // 103
				enrollAccount();                                                                                                   // 104
			}                                                                                                                   // 105
		},                                                                                                                   // 106
		'click #login-buttons-cancel-enroll-account-button': function() {                                                    // 107
			loginButtonsSession.set('enrollAccountToken', null);                                                                // 108
			Accounts._enableAutoLogin();                                                                                        // 109
			$modal.modal("hide");                                                                                               // 110
		}                                                                                                                    // 111
	});                                                                                                                   // 112
                                                                                                                       // 113
	var enrollAccount = function() {                                                                                      // 114
		loginButtonsSession.resetMessages();                                                                                 // 115
		var password = document.getElementById('enroll-account-password').value;                                             // 116
		var passwordAgain= document.getElementById('enroll-account-password-again').value;                                   // 117
		if (!Accounts._loginButtons.validatePassword(password,passwordAgain)){                                               // 118
			return;                                                                                                             // 119
		}                                                                                                                    // 120
                                                                                                                       // 121
		Accounts.resetPassword(                                                                                              // 122
			loginButtonsSession.get('enrollAccountToken'), password,                                                            // 123
			function(error) {                                                                                                   // 124
				if (error) {                                                                                                       // 125
					loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                // 126
				} else {                                                                                                           // 127
					loginButtonsSession.set('enrollAccountToken', null);                                                              // 128
					Accounts._enableAutoLogin();                                                                                      // 129
					$modal.modal("hide");                                                                                             // 130
				}                                                                                                                  // 131
			});                                                                                                                 // 132
	};                                                                                                                    // 133
                                                                                                                       // 134
	Template._enrollAccountDialog.helpers({                                                                               // 135
		inEnrollAccountFlow: function() {                                                                                    // 136
			return loginButtonsSession.get('enrollAccountToken');                                                               // 137
		}                                                                                                                    // 138
	});                                                                                                                   // 139
                                                                                                                       // 140
	Template._enrollAccountDialog.rendered = function() {                                                                 // 141
		$modal = $(this.find('#login-buttons-enroll-account-modal'));                                                        // 142
		if (!_.isFunction($modal.modal)) {                                                                                   // 143
			console.error("You have to add a Bootstrap package, i.e. meteor add twbs:bootstrap");                               // 144
		} else {                                                                                                             // 145
			$modal.modal();                                                                                                     // 146
		}                                                                                                                    // 147
	};                                                                                                                    // 148
                                                                                                                       // 149
	//                                                                                                                    // 150
	// justVerifiedEmailDialog template                                                                                   // 151
	//                                                                                                                    // 152
                                                                                                                       // 153
	Template._justVerifiedEmailDialog.events({                                                                            // 154
		'click #just-verified-dismiss-button': function() {                                                                  // 155
			loginButtonsSession.set('justVerifiedEmail', false);                                                                // 156
		}                                                                                                                    // 157
	});                                                                                                                   // 158
                                                                                                                       // 159
	Template._justVerifiedEmailDialog.helpers({                                                                           // 160
		visible: function() {                                                                                                // 161
			if (loginButtonsSession.get('justVerifiedEmail')) {                                                                 // 162
				setTimeout(function() {                                                                                            // 163
					$('#login-buttons-email-address-verified-modal').modal()                                                          // 164
				}, 500)                                                                                                            // 165
			}                                                                                                                   // 166
			return loginButtonsSession.get('justVerifiedEmail');                                                                // 167
		}                                                                                                                    // 168
	});                                                                                                                   // 169
                                                                                                                       // 170
                                                                                                                       // 171
	//                                                                                                                    // 172
	// loginButtonsMessagesDialog template                                                                                // 173
	//                                                                                                                    // 174
                                                                                                                       // 175
	// Template._loginButtonsMessagesDialog.rendered = function() {                                                       // 176
	//   var $modal = $(this.find('#configure-login-service-dialog-modal'));                                              // 177
	// 	 if (!_.isFunction($modal.modal)) {                                                                               // 178
	// 	 	console.error("You have to add a Bootstrap package, i.e. meteor add twbs:bootstrap");                           // 179
	// 	 } else {                                                                                                         // 180
	// 	 	$modal.modal();                                                                                                 // 181
	// 	 }                                                                                                                // 182
	// }                                                                                                                  // 183
                                                                                                                       // 184
	Template._loginButtonsMessagesDialog.events({                                                                         // 185
		'click #messages-dialog-dismiss-button': function() {                                                                // 186
			loginButtonsSession.resetMessages();                                                                                // 187
		}                                                                                                                    // 188
	});                                                                                                                   // 189
                                                                                                                       // 190
	Template._loginButtonsMessagesDialog.helpers({                                                                        // 191
		visible: function() {                                                                                                // 192
			var hasMessage = loginButtonsSession.get('infoMessage') || loginButtonsSession.get('errorMessage');                 // 193
			return !Accounts._loginButtons.dropdown() && hasMessage;                                                            // 194
		}                                                                                                                    // 195
	});                                                                                                                   // 196
                                                                                                                       // 197
                                                                                                                       // 198
	//                                                                                                                    // 199
	// configureLoginServiceDialog template                                                                               // 200
	//                                                                                                                    // 201
                                                                                                                       // 202
	Template._configureLoginServiceDialog.events({                                                                        // 203
		'click .configure-login-service-dismiss-button': function(event) {                                                   // 204
			event.stopPropagation();                                                                                            // 205
			loginButtonsSession.set('configureLoginServiceDialogVisible', false);                                               // 206
			$('#configure-login-service-dialog-modal').modal('hide');                                                           // 207
		},                                                                                                                   // 208
		'click #configure-login-service-dialog-save-configuration': function() {                                             // 209
			if (loginButtonsSession.get('configureLoginServiceDialogVisible') &&                                                // 210
				!loginButtonsSession.get('configureLoginServiceDialogSaveDisabled')) {                                             // 211
				// Prepare the configuration document for this login service                                                       // 212
				var serviceName = loginButtonsSession.get('configureLoginServiceDialogServiceName');                               // 213
				var configuration = {                                                                                              // 214
					service: serviceName                                                                                              // 215
				};                                                                                                                 // 216
				_.each(configurationFields(), function(field) {                                                                    // 217
					configuration[field.property] = document.getElementById(                                                          // 218
						'configure-login-service-dialog-' + field.property).value                                                        // 219
						.replace(/^\s*|\s*$/g, ""); // trim;                                                                             // 220
				});                                                                                                                // 221
                                                                                                                       // 222
				configuration.loginStyle =                                                                                         // 223
				$('#configure-login-service-dialog input[name="loginStyle"]:checked')                                              // 224
				.val();                                                                                                            // 225
                                                                                                                       // 226
				// Configure this login service                                                                                    // 227
				Meteor.call("configureLoginService", configuration, function(error, result) {                                      // 228
					if (error){                                                                                                       // 229
						Meteor._debug("Error configuring login service " + serviceName, error);                                          // 230
					} else {                                                                                                          // 231
						loginButtonsSession.set('configureLoginServiceDialogVisible', false);                                            // 232
					}                                                                                                                 // 233
					$('#configure-login-service-dialog-modal').modal('hide');                                                         // 234
				});                                                                                                                // 235
			}                                                                                                                   // 236
		},                                                                                                                   // 237
		// IE8 doesn't support the 'input' event, so we'll run this on the keyup as                                          // 238
		// well. (Keeping the 'input' event means that this also fires when you use                                          // 239
		// the mouse to change the contents of the field, eg 'Cut' menu item.)                                               // 240
		'input, keyup input': function(event) {                                                                              // 241
			// if the event fired on one of the configuration input fields,                                                     // 242
			// check whether we should enable the 'save configuration' button                                                   // 243
			if (event.target.id.indexOf('configure-login-service-dialog') === 0){                                               // 244
				updateSaveDisabled();                                                                                              // 245
			}                                                                                                                   // 246
		}                                                                                                                    // 247
	});                                                                                                                   // 248
                                                                                                                       // 249
	// check whether the 'save configuration' button should be enabled.                                                   // 250
	// this is a really strange way to implement this and a Forms                                                         // 251
	// Abstraction would make all of this reactive, and simpler.                                                          // 252
	var updateSaveDisabled = function() {                                                                                 // 253
		var anyFieldEmpty = _.any(configurationFields(), function(field) {                                                   // 254
			return document.getElementById(                                                                                     // 255
				'configure-login-service-dialog-' + field.property).value === '';                                                  // 256
		});                                                                                                                  // 257
                                                                                                                       // 258
		loginButtonsSession.set('configureLoginServiceDialogSaveDisabled', anyFieldEmpty);                                   // 259
	};                                                                                                                    // 260
                                                                                                                       // 261
	// Returns the appropriate template for this login service.  This                                                     // 262
	// template should be defined in the service's package                                                                // 263
	var configureLoginServiceDialogTemplateForService = function() {                                                      // 264
		var serviceName = loginButtonsSession.get('configureLoginServiceDialogServiceName');                                 // 265
		return Template['configureLoginServiceDialogFor' + capitalize(serviceName)];                                         // 266
	};                                                                                                                    // 267
                                                                                                                       // 268
	var configurationFields = function() {                                                                                // 269
		var template = configureLoginServiceDialogTemplateForService();                                                      // 270
		return template.fields();                                                                                            // 271
	};                                                                                                                    // 272
                                                                                                                       // 273
	Template._configureLoginServiceDialog.helpers({                                                                       // 274
		configurationFields: function() {                                                                                    // 275
			return configurationFields();                                                                                       // 276
		},                                                                                                                   // 277
                                                                                                                       // 278
		visible: function() {                                                                                                // 279
			return loginButtonsSession.get('configureLoginServiceDialogVisible');                                               // 280
		},                                                                                                                   // 281
                                                                                                                       // 282
		configurationSteps: function() {                                                                                     // 283
			// renders the appropriate template                                                                                 // 284
			return configureLoginServiceDialogTemplateForService();                                                             // 285
		},                                                                                                                   // 286
                                                                                                                       // 287
		saveDisabled: function() {                                                                                           // 288
			return loginButtonsSession.get('configureLoginServiceDialogSaveDisabled');                                          // 289
		}                                                                                                                    // 290
	});                                                                                                                   // 291
                                                                                                                       // 292
                                                                                                                       // 293
	;                                                                                                                     // 294
                                                                                                                       // 295
                                                                                                                       // 296
                                                                                                                       // 297
	// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js                                        // 298
	var capitalize = function(str) {                                                                                      // 299
		str = str == null ? '' : String(str);                                                                                // 300
		return str.charAt(0).toUpperCase() + str.slice(1);                                                                   // 301
	};                                                                                                                    // 302
                                                                                                                       // 303
})();                                                                                                                  // 304
                                                                                                                       // 305
                                                                                                                       // 306
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
