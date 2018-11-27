$(() => {
	document.addEventListener('deviceready', cordovaEvents.onDeviceReady);
});

const cordovaEvents = {
	
    onDeviceReady() {
		document.addEventListener('backbutton', cordovaEvents.onBackButton);
		document.addEventListener('init', onsenEvents.onInitEvent);
		document.addEventListener('show', onsenEvents.onShowEvent);
		document.addEventListener('preshow', onsenEvents.onPreShowDialog);
		document.addEventListener('posthide', onsenEvents.onPostHideDialog);
		myAjax.setupAjax();
		ons.forcePlatformStyling('android');
		webConnection.checkInternet(() => {
			myLocale.getLanguage(() => {
				myTranslations.loadTranslations(() => {
					myLogin.pushPage(PAGE_LOGIN_MAIN, '', 'none');
				});
			});
		});
    },

	onBackButton() {
		if (myLogin.isDialogShown) {
			$('.onsen-dialog')[0].hide();
		} else {
			const page = myLogin.visiblePage;
			if (page == 'pageRegistration' || page == 'pageConfirmCode') {
				loginOnsDialog.showExitReg();
			}
		}
	}
};

const onsenEvents = {
	
	onInitEvent(event) {
		const page = event.target.id;
		if (page == 'pageLogin') {
			loginLocalizations.translatePageLogin();
			loginClicks.setPageLoginClicks();
			myLogin.setLanguageButtonFlag();
			if (myStorage.isUnconfirmedReg()) {
				$('#btnConfirmSmsCode').show();
			}
			myAjax.getCurrentCountry(data => {
				if (data[0].countryName) {
					const countryName = data[0].countryName;
					const countryCode = data[0].countryCode;
					const countryPhoneCode = data[0].countryPhoneCode;
					$('#loginCountryCodeInput').val('(+' + countryPhoneCode + ')');
					$('#loginCountryCodeInput').attr('data-country-name', countryName);
					$('#loginCountryCodeInput').attr('data-country-code', countryCode);
					$('#loginCountryCodeInput').attr('data-phone-code', countryPhoneCode);
				}
				$('#modalLogin').hide();
				navigator.splashscreen.hide();
			});
		} else if (page == 'pageLanguage') {
			$('#pageLanguage .title-loading').show();
			loginLocalizations.translatePageLanguage();
			myAjax.getLanguages((response) => {
				let langList = '';
				for (const item of response) {
					langList += appender.getLanguageItem(item);
				}
				$('#listLanguages').append(langList);
				loginClicks.setPageLanguageEvents();
				$('#pageLanguage .title-loading').hide();
			});
		} else if (page == 'pageRegistration') {
			loginClicks.setPageRegisterClicks();
			loginLocalizations.translatePageReg();
			const countryName = $('#loginCountryCodeInput').attr('data-country-name');
			const countryCode = $('#loginCountryCodeInput').attr('data-country-code');
			const phoneCode = $('#loginCountryCodeInput').attr('data-phone-code');
			const text = $('#pageLogin').find('#loginCountryCodeInput').val();
			$('#regCountryInput').attr('data-country-code', countryCode);
			$('#regCountryInput').attr('data-phone-code', phoneCode);
			$('#regCountryInput').val(countryName + ' ' + text);
		} else if (page == 'pageConfirmCode') {
			loginClicks.setPageConfirmCodeEvents();
			loginLocalizations.translatePageConfirmCode();
		} else if (page == 'pageForgottenData') {
			loginClicks.setPageForgottenDataClicks();
			loginLocalizations.translagePageForgottenData();
			const countryName = $('#loginCountryCodeInput').attr('data-country-name');
			const countryCode = $('#loginCountryCodeInput').attr('data-country-code');
			const phoneCode = $('#loginCountryCodeInput').attr('data-phone-code');
			const text = $('#pageLogin').find('#loginCountryCodeInput').val();
			$('#inputForgottenDataCode').attr('data-country-code', countryCode);
			$('#inputForgottenDataCode').attr('data-phone-code', phoneCode);
			$('#inputForgottenDataCode').val(countryName + ' ' + text);
		} else if (page == 'pageCountry') {
			$('#pageCountry .title-loading').show();
			loginLocalizations.translatePageCountry();
			const inputElement = event.target.data.inputElement;
			$('#pageCountry').attr('data-input-element', inputElement);
			myCountries.getCountriesList(countriesObj => {
				let countriesList = '';
				for (const country of countriesObj) {
					countriesList += appender.getCountryItem(country);
				}
				$('#listCountries').append(countriesList);
				loginClicks.setPageCountryEvents();
				$('#pageCountry .title-loading').hide();
			});
		}
	},
	
	onShowEvent(event) {
		const visiblePage = event.target.id;
		if (visiblePage == 'pageRegistration') {
			ons.disableDeviceBackButtonHandler();
		} else if (visiblePage === 'pageConfirmCode') {
			ons.disableDeviceBackButtonHandler();
		} else {
			ons.enableDeviceBackButtonHandler();
		}
		myLogin.visiblePage = visiblePage;
	},
	
	onPreShowDialog(event) {
		//ons.disableDeviceBackButtonHandler();
		const dialog = event.target.id;
		if (dialog == 'dialogExitReg') {
			//ons.enableDeviceBackButtonHandler();
		}
		myLogin.isDialogShown = true;
	},
	
	onPostHideDialog(event) {
		//ons.enableDeviceBackButtonHandler();
		const dialog = event.target;
		dialog.remove();
		myLogin.isDialogShown = false;
	}
};

const myLogin = {
	
	visiblePage: '',
		
	isDialogShown: false,
		
	//*** Onsen Navigator ***//
	pushPage(page, data, animation) {
		const navigator = $('#loginNavigator')[0];
		navigator.pushPage(page, {
			animation: animation,
			data: data
		});
	},
	
	popPage() {
		const navigator = $('#loginNavigator')[0];
		navigator.popPage();
	},
	
	resetToPage(page) {
		const navigator = $('#loginNavigator')[0];
		navigator.resetToPage(page);
	},
	
	setLanguageButtonFlag() {
		let langFlag = myStorage.getLanguageFlag();
		if (!langFlag) {
			langFlag = LANG_FLAG_DEFAULT;
		}
		$('#imgFlag').attr('src', langFlag);	
	},
	
	logInUser(phoneCode, phone, password) {
		$('#modalLogin').show();
		$('.login-input').attr('disabled', true);
		const formattedPhone = dataValidation.formatPhoneNumber(phoneCode, phone);
		myAjax.logInUser(formattedPhone, password, response => {
			$('#modalLogin').hide();
			if (response[0].user) {
				myLocale.getDateFormat(() => {
					myStorage.updateUserData(response[0]);
					myStorage.setLoggedIn(true);
					myStorage.setUnconfirmedReg(false);
					window.location = PAGE_HOME;
				});
			} else {
				const error = response[0].error;
				let errorText = '';
				if (error == 10) {
					errorText = myTranslations.getTranslation(TXT_WRONG_LOGIN_DATA);
				} else if (error == 11) {
					errorText = myTranslations.getTranslation(TXT_ACC_NOT_ACTIVATED);
				} else {
					errorText = 'Error. Please contact support';
				}
				$('.login-input').attr('disabled', false);
				loginOnsDialog.showAlertDialog(errorText);
			}
		});
	}
};

const loginOnsDialog = {
	
	showExitReg() {
		ons.createAlertDialog(DIALOG_EXIT_REG).then(dialog => {
			loginLocalizations.translageDialogExitReg();
			loginDialogClicks.setExitRegClick();
			loginDialogClicks.setCloseDialogClick();
			dialog.show();
		});
	},
	
	showSendActivationSms(regData) {
		const txt = myTranslations.getTranslation(TXT_SEND_SMS_TO);
		ons.notification.confirm(txt + ' ' + regData.phone + ' ?', {
			callback: (id) => {
				if (id == 1) {
					$('#loadingReg').show();
					$('#btnCompleteRegistration').prop('disabled', true);
					myAjax.sendRegistration(regData, (data) => {
						if (data[0].user) {
							const userFromServer = data[0].user;
							myStorage.setCurrentUserId(userFromServer);
							myStorage.setUserPhone(regData.phone);
							myStorage.setUnconfirmedReg(true);
							myLogin.pushPage(PAGE_LOGIN_CONFIRM);
							$('#loadingReg').hide();
						} else {
							let errorMessage = '';
							$.each(data[0].error, (key, value) => {
								const er = value;
								errorMessage += er + '\n';
							});
							$('#btnCompleteRegistration').prop('disabled', false);
							loginOnsDialog.showAlertDialog(errorMessage);
						}
						$('#loadingReg').hide();
					});
				}
			}
		});
	},
	
	showResendActivationSms() {
		const txt = myTranslations.getTranslation(TXT_RESEND_ACTIVATION_SMS_TO);
		const phone = myStorage.getUserPhone();
		const resentTxt = myTranslations.getTranslation(TXT_MSG_SENT_SUCCESS);
		ons.notification.confirm(txt + ' +' + phone + ' ?', {
			callback: (id) => {
				if (id == 1) {
					$('.title-loading').show();
					$('#btnResendCode').prop('disabled', true);
					myAjax.resendSmsCode(response => {
						myToast.showLong(resentTxt);
						$('.title-loading').hide();
					});
				}
			}
		});
	},
	
	showSendForgottenPassword(formattedPhone) {
		const txt = myTranslations.getTranslation(TXT_FORGOTTEN_DATA_SMS);
		ons.notification.confirm(txt + ' +' + formattedPhone + '?', {
			callback: (id) => {
				if (id == 1) {
					$('#pageForgottenData .title-loading').show();
					myAjax.getPasswordSms(formattedPhone, response => {
						if (response[0]) {
							const txt = myTranslations.getTranslation(TXT_PHONE_NOT_REGISTERED);
							loginOnsDialog.showAlertDialog(txt);
						} else {
							loginOnsDialog.showAlertDialog('Password sent');
							myLogin.popPage();
						}
						$('#pageForgottenData .title-loading').hide();
						$('#btnRequestHelp').prop('disabled', false);
					});
				} else {
					$('#btnRequestHelp').prop('disabled', false);
				}
			}
		});
	},
	
	showCodeConfirmed() {
		const txt = myTranslations.getTranslation(TXT_CODE_CONFIRMED);
		ons.notification.alert(txt, {
			callback: () => {
				$('#pageConfirmCode .title-loading').show();
				const userId = myStorage.getCurrentUserId();
				myAjax.getCurrentUserInfo(userId, response => {
					if (response[0]) {
						myLocale.getDateFormat(() => {
							myStorage.updateUserData(response[0]);
							myStorage.setLoggedIn(true);
							myStorage.setUnconfirmedReg(false);
							$('#pageConfirmCode .title-loading').hide();
							window.location = PAGE_HOME;
						});
					}
				});
			}
		});
	},
	
	showAlertDialog(text) {
		ons.notification.alert(text);
	}
};

const loginLocalizations = {
	
	translatePageLogin() {
		$('#btnLogin').text(myTranslations.getTranslation(TXT_LOG_IN));
		$('#btnRegister').text(myTranslations.getTranslation(TXT_SIGN_UP));
		$('#btnConfirmSmsCode').text(myTranslations.getTranslation(TXT_ENTER_SMS_CODE));
		$('#btnForgottenData').text(myTranslations.getTranslation(TXT_FORGOT_PASSWORD));
		$('#loginCountryCodeInput').attr('placeholder', myTranslations.getTranslation(TXT_CODE));
		$('#loginPhoneInput').attr('placeholder', myTranslations.getTranslation(TXT_PHONE_NUMBER));
		$('#loginPasswordInput').attr('placeholder', myTranslations.getTranslation(TXT_PASSWORD));
	},
	
	translatePageLanguage() {
		$('#pageLanguage .title-label').text(myTranslations.getTranslation(TXT_LANGUAGE));
	},
	
	translatePageCountry() {
		$('#inputSearchCountry').attr('placeholder', myTranslations.getTranslation(TXT_SEARCH));
	},
	
	translatePageReg() {
		$('#regNameInput').attr('placeholder', myTranslations.getTranslation(TXT_FULL_NAME));
		$('#regCountryInput').attr('placeholder', myTranslations.getTranslation(TXT_COUNTRY));
		$('#regPhoneInput').attr('placeholder', myTranslations.getTranslation(TXT_PHONE_NUMBER));
		$('#regPasswordInput').attr('placeholder', myTranslations.getTranslation(TXT_PASSWORD));
		$('#regConfirmPasswordInput').attr('placeholder', myTranslations.getTranslation(TXT_CONFIRM_PASS));
		$('#btnCompleteRegistration').text(myTranslations.getTranslation(TXT_SIGN_UP));
		$('#btnBackToLogin').text(myTranslations.getTranslation(TXT_HAVE_ACCOUNT_LOG_IN));
	},
	
	translatePageConfirmCode() {
		$('#pageConfirmCode .title-loading').text(myTranslations.getTranslation(TXT_CONFIRM_SMS_CODE));
		$('#confirmCodeInput').attr('placeholder', myTranslations.getTranslation(TXT_ENTER_CODE));
		$('#btnConfirmCode').text(myTranslations.getTranslation(TXT_CONFIRM));
		$('#btnResendCode').text(myTranslations.getTranslation(TXT_RESEND_CODE));
	},
	
	translagePageForgottenData() {
		$('#pageForgottenData .title-label').text(myTranslations.getTranslation(TXT_CONFIRM));
		$('#inputForgottenDataCode').attr('placeholder', myTranslations.getTranslation(TXT_CODE));
		$('#inputForgottenDataPhone').attr('placeholder', myTranslations.getTranslation(TXT_PHONE_NUMBER));
		$('#btnRequestHelp').text(myTranslations.getTranslation(TXT_RESET_PASS));
	},
	
	translageDialogExitReg() {
		$('#dialogTitle').text(myTranslations.getTranslation(TXT_WARNING));
		$('#dialogText').text(myTranslations.getTranslation(TXT_CANCEL_REG));
		$('#btnExitReg').text(myTranslations.getTranslation(TXT_YES));
		$('#btnCloseDialog').text(myTranslations.getTranslation(TXT_NO));
	}
};