const loginClicks = {
	
	setPageLoginClicks() {
		$('#loginCountryCodeInput').on('click', () => {
			// inputElement: used to tell which element to edit when a country is selected
			const data = {
				inputElement: 'loginCountryCodeInput'
			};
			myLogin.pushPage(PAGE_COUNTRY, data);
		});
		$('#loginPhoneInput').on('keyup', event => {
			if(event.keyCode == 13){
				$('#btnLogin').trigger('click');
			}
		});
		$('#loginPasswordInput').on('keyup', event => {
			if(event.keyCode == 13){
				$('#btnLogin').trigger('click');
			}
		});
		$('#btnLogin').on('click', () => {
			const phoneCode = $('#loginCountryCodeInput').attr('data-phone-code');
			const phone = $('#loginPhoneInput').val();
			const password = $('#loginPasswordInput').val();			
			if (phoneCode && phone && password) {
				myLogin.logInUser(phoneCode, phone, password);
			} else {
				loginOnsDialog.showAlertDialog(myTranslations.getTranslation(TXT_WARN_REG));
			}
		});
		$('#btnConfirmSmsCode').on('click', () => {
			myLogin.pushPage(PAGE_LOGIN_CONFIRM);
		});
		$('#btnRegister').on('click', () => {
			myLogin.pushPage(PAGE_LOGIN_REG);
		});
		$('#btnForgottenData').on('click', () => {
			myLogin.pushPage(PAGE_LOGIN_FORGOTTEN_DATA);
		});
		$('#btnLoginLanguage').on('click', () => {
			myLogin.pushPage(PAGE_LANGUAGE);
		});
		$('#btnLoginFavo').on('click', () => {
			//alert('Favo360 website');
			cordova.InAppBrowser.open('https://www.google.bg/', '_system', 'location=yes');
		});
	},
	
	setPageCountryEvents() {
		const elements = {
			filterAttributes: [
				'data-country-name',
				'data-country-code',
				'data-country-phone-code'
			],
			list: 'listCountries',
			listItem: 'country-list-item'
		};
		const searchFunc = mySearch.getSearchFunc(elements);
		$('#inputSearchCountry').on('input', searchFunc);
		
		$('.country-list-item').on('click', function () {
			const countryCode = this.dataset.countryCode;
			const countryName = this.dataset.countryName;
			const countryPhoneCode = this.dataset.countryPhoneCode;
			const target = $('#pageCountry').attr('data-input-element');
			let inputEntry = '';
			if (target == 'loginCountryCodeInput') {
				inputEntry = '(' + countryPhoneCode + ')';
			} else {
				inputEntry = countryName + ' (' + countryPhoneCode + ')';
			}
			$('#' + target).val(inputEntry);
			$('#' + target).attr('data-country-code', countryCode);
			$('#' + target).attr('data-country-name', countryName);
			$('#' + target).attr('data-phone-code', countryPhoneCode);
			myLogin.popPage();
		});
	},
	
	setPageForgottenDataClicks() {
		$('#inputForgottenDataCode').on('click', () => {
			const data = {
				inputElement: 'inputForgottenDataCode'
			};
			myLogin.pushPage(PAGE_COUNTRY, data);
		});
		$('#btnRequestHelp').on('click', () => {
			const code = $('#inputForgottenDataCode').attr('data-phone-code');
			const phone = $('#inputForgottenDataPhone').val();
			if (code && phone) {
				$('#btnRequestHelp').attr('disabled', true);
				const formattedPhone = dataValidation.formatPhoneNumber(code, phone);
				loginOnsDialog.showSendForgottenPassword(formattedPhone);
			}
		});
	},
	
	setPageLanguageEvents() {
		$('.lang-list-item').on('click', function () {
			$('#pageLanguage .title-loading').show();
			$('.lang-list-item').attr('disabled', true);
			myStorage.setLanguage(this.dataset.langId);
			myStorage.setLanguageFlag(this.dataset.imgSrc);
			myLogin.setLanguageButtonFlag();
			myTranslations.getNewTranslations(() => {
				$('.lang-list-item').attr('disabled', false);
				$('#pageLanguage .title-loading').hide();
				loginLocalizations.translatePageLogin();
				myLogin.popPage();
			});
		});
	},
	
	setPageRegisterClicks() {
		$('#regCountryInput').on('click', () => {
			// inputElement: used to tell which element to edit when a country is selected
			const data = {
				inputElement: 'regCountryInput'
			};
			myLogin.pushPage(PAGE_COUNTRY, data);
			return false;
		});
		$('#btnCompleteRegistration').on('click', () => {
			const fullName = $('#regNameInput').val();
			const countryCode = $('#regCountryInput').attr('data-country-code');
			const langId = myStorage.getLanguage();
			const phoneNumber = $('#regPhoneInput').val();
			const password = $('#regPasswordInput').val();
			const confirmPassword = $('#regConfirmPasswordInput').val();
			if (fullName && phoneNumber && password && confirmPassword) {
				if (password == confirmPassword) {
					const phoneCode = $('#regCountryInput').attr('data-phone-code');
					const formattedPhoneNumber = dataValidation.formatPhoneNumber(phoneCode, phoneNumber);
					const regData = {
						countryCode: countryCode,
						langId: langId,
						phone: formattedPhoneNumber,
						fullName: fullName,
						password: password
					};
					loginOnsDialog.showSendActivationSms(regData);
				} else {
					loginOnsDialog.showAlertDialog(myTranslations.getTranslation(TXT_PASS_NO_MATCH));
				}
			} else {
				loginOnsDialog.showAlertDialog(myTranslations.getTranslation(TXT_WARN_REG));
			}
		});
		$('#btnBackToLogin').on('click', () => {
			myLogin.popPage();
		});
	},
	
	setPageConfirmCodeEvents() {
		$('#btnConfirmCode').on('click', () => {
			$('#btnConfirmCode').prop('disabled', true);
			$('#pageConfirmCode .title-loading').show();
			const inputCode = $('#confirmCodeInput').val();
			myAjax.sendConfirmationCode(inputCode, response => {
				if (response[0].checked) {
					myStorage.setUnconfirmedReg(false);
					loginOnsDialog.showCodeConfirmed();
				} else {
					loginOnsDialog.showAlertDialog(response[0].error);
					$('#btnConfirmCode').attr('disabled', false);
				}
			});
		});
		$('#confirmCodeInput').on('input', function () {
			if (this.value) {
				$('#btnConfirmCode').attr('disabled', false);
			} else {
				$('#btnConfirmCode').attr('disabled', true);
			}
		});
		$('#btnConfirmTitleBack').on('click', () => {
			loginOnsDialog.showExitReg();
		});
		$('#btnResendCode').on('click', () => {
			loginOnsDialog.showResendActivationSms();
		});
	}
};

const loginDialogClicks = {
	
	setExitRegClick() {
		$('#btnExitReg').on('click', () => {
			$('.onsen-dialog')[0].hide();
			myLogin.resetToPage(PAGE_LOGIN_MAIN);
		});
	},
	
	setCloseDialogClick() {
		$('#btnCloseDialog').on('click', () => {
			$('.onsen-dialog')[0].hide();
		});
	}
};