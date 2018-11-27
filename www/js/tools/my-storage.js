// CONTENTS //
// myStorage - for webview localstorage
// mySharedPrefs - for Android native shared preferences data saving // https://www.npmjs.com/package/cordova-plugin-sharedpreferences

const myStorage = {
	
	updateUserData(data) {
		myStorage.setCurrentUserId(data.user);
		const updateDataFunc = function () {
			myStorage.setUserFullName(data.userFullName);
			myStorage.setUserPhone(data.userPhone);
			myStorage.setUserAvatar(data.avatar);
			myStorage.setUserCountryPhoneCode(data.countryPhoneCode);
			myStorage.setUserCountryCode(data.countryCode);
			myStorage.setUserCountryName(data.countryName);
			if (data.token) {
				myStorage.setFavoToken(data.token);
			}
		};
		if (device.platform == 'Android') {
			// Android specific data saving to shared preference, used for push notifications
			mySharedPrefs.putString('userId', data.user, () => {
				updateDataFunc();
			});
		} else {
			updateDataFunc();
		}
	},
	
	clearUserData() {
		this.setCurrentUserId('');
		this.setUserFullName('');
		this.setUserPhone('');
		this.setUserAvatar('');
		this.setUserCountryPhoneCode('');
		this.setUserCountryCode('');
		this.setUserCountryName('');
		this.setFavoToken('');
		this.setCacheRecentChats('');
		this.setUnconfirmedReg(false);
		this.setLoggedIn(false);
	},
	
	setLoggedIn(isLoggedIn) {
		const localStorage = window.localStorage;
		localStorage.setItem('isLoggedIn', isLoggedIn);
	},
	
	isLoggedIn() {
		const localStorage = window.localStorage;
		let isLoggedIn = localStorage.getItem('isLoggedIn');
		if (isLoggedIn == 'true') {
			isLoggedIn = true;
		} else {
			isLoggedIn = false;
		}
		return isLoggedIn;
	},
	
	setUnconfirmedReg(unconfirmedReg) {
		const localStorage = window.localStorage;
		localStorage.setItem('unconfirmedReg', unconfirmedReg);
	},
	
	isUnconfirmedReg() {
		const localStorage = window.localStorage;
		let unconfirmedReg = localStorage.getItem('unconfirmedReg');
		if (unconfirmedReg == 'true') {
			unconfirmedReg = true;
		} else {
			unconfirmedReg = false;
		}
		return unconfirmedReg;
	},
	
	setLanguage(langId) {
		const localStorage = window.localStorage;
		localStorage.setItem('language', langId);
	},
	
	getLanguage() {
		const localStorage = window.localStorage;
		const langId = localStorage.getItem('language');
		return langId;
	},
	
	setLanguageVersion(langVersion) {
		const localStorage = window.localStorage;
		localStorage.setItem('langVersion', langVersion);
	},
	
	getLanguageVersion() {
		const localStorage = window.localStorage;
		const langVersion = localStorage.getItem('langVersion');
		return langVersion;
	},
	
	setLanguageFlag(flag) {
		const localStorage = window.localStorage;
		localStorage.setItem('langFlag', flag);
	},
	
	getLanguageFlag() {
		const localStorage = window.localStorage;
		const flag = localStorage.getItem('langFlag');
		return flag;
	},
	
	setCurrentUserId(currentUserId) {
		const localStorage = window.localStorage;
		localStorage.setItem('currentUserId', currentUserId);
	},
	
	getCurrentUserId() {
		const localStorage = window.localStorage;
		const userId = localStorage.getItem('currentUserId');
		return userId;
	},
	
	setUserFullName(userFullName) {
		const localStorage = window.localStorage;
		localStorage.setItem('userFullName', userFullName);
	},
	
	getUserFullName() {
		const localStorage = window.localStorage;
		const userFullName = localStorage.getItem('userFullName');
		return userFullName;
	},
	
	setUserPhone(userPhone) {
		const localStorage = window.localStorage;
		localStorage.setItem('userPhone', userPhone);
	},
	
	getUserPhone() {
		const localStorage = window.localStorage;
		const userPhone = localStorage.getItem('userPhone');
		return userPhone;
	},
	
	setUserCountryPhoneCode(userCountryPhoneCode) {
		const localStorage = window.localStorage;
		localStorage.setItem('userCountryPhoneCode', userCountryPhoneCode);
	},
	
	getUserCountryPhoneCode() {
		const localStorage = window.localStorage;
		const userCountryPhoneCode = localStorage.getItem('userCountryPhoneCode');
		return userCountryPhoneCode;
	},
		
	setUserCountryCode(userCountryCode) {
		const localStorage = window.localStorage;
		localStorage.setItem('userCountryCode', userCountryCode);
	},
	
	getUserCountryCode() {
		const localStorage = window.localStorage;
		const userCountryCode = localStorage.getItem('userCountryCode');
		return userCountryCode;
	},
	
	setUserCountryName(userCountryName) {
		const localStorage = window.localStorage;
		localStorage.setItem('userCountryName', userCountryName);
	},
	
	getUserCountryName() {
		const localStorage = window.localStorage;
		const userCountryName = localStorage.getItem('userCountryName');
		return userCountryName;
	},
	
	setUserAvatar(userAvatar) {
		const localStorage = window.localStorage;
		localStorage.setItem('userAvatar', userAvatar);
	},
	
	getUserAvatar() {
		const localStorage = window.localStorage;
		const userAvatar = localStorage.getItem('userAvatar');
		return userAvatar;
	},
	
	setPushDeviceID(pushDeviceID) {
		const localStorage = window.localStorage;
		localStorage.setItem('pushDeviceID', pushDeviceID);
	},
	
	getPushDeviceID() {
		const localStorage = window.localStorage;
		const pushDeviceID = localStorage.getItem('pushDeviceID');
		return pushDeviceID;
	},
	
	getLocalCountries() {
		const localStorage = window.localStorage;
		const countries = localStorage.getItem('localCountries');
		return countries;
	},
	
	setLocalCountries(countries) {
		const localStorage = window.localStorage;
		localStorage.setItem('localCountries', countries);
	},
	
	getLocalTranslations() {
		const localStorage = window.localStorage;
		const translations = localStorage.getItem('localTranslations');
		return translations;
	},
	
	setLocalTranslations(translations) {
		const localStorage = window.localStorage;
		localStorage.setItem('localTranslations', translations);
	},
	
	setFavoToken(favoToken) {
		const localStorage = window.localStorage;
		localStorage.setItem('favoToken', favoToken);
	},
	
	getFavoToken() {
		const localStorage = window.localStorage;
		const favoToken = localStorage.getItem('favoToken');
		return favoToken;
	},
	
	setDateFormat(dateFormat) {
		const localStorage = window.localStorage;
		localStorage.setItem('dateFormat', dateFormat);
	},
	
	getDateFormat() {
		const localStorage = window.localStorage;
		const dateFormat = localStorage.getItem('dateFormat');
		return dateFormat;
	},
	
	// Caching stuff for faster loading //
	setCacheRecentChats(recents) {
		const localStorage = window.localStorage;
		localStorage.setItem('cacheRecents', recents);
	},
	
	getCacheRecentChats() {
		const localStorage = window.localStorage;
		const recents = localStorage.getItem('cacheRecents');
		return recents;
	},
	
	setNewsfeedSubscription(newsfeedSubscription) {
		const localStorage = window.localStorage;
		localStorage.setItem('newsfeedSubscription', newsfeedSubscription);
	},
	
	getNewsfeedSubscription() {
		const localStorage = window.localStorage;
		const newsfeedSubscription = localStorage.getItem('newsfeedSubscription');
		return newsfeedSubscription;
	}
};


// https://www.npmjs.com/package/cordova-plugin-sharedpreferences
const mySharedPrefs = {
	
	putString(pref, value, finalCallback) {
		try {
			sharedpreferences.getSharedPreferences('shared_preferences', 'MODE_PRIVATE', () => {
				sharedpreferences.putString(pref, value, finalCallback, finalCallback);
			}, (error) => {
				finalCallback();
			});
		} catch (error) {
			finalCallback();
		}
	},
	
	getString(pref, finalCallback) {
		try {
			sharedpreferences.getSharedPreferences('shared_preferences', 'MODE_PRIVATE', () => {
				sharedpreferences.getString(pref, '', finalCallback, finalCallback);
			}, (error) => {
				finalCallback('');
			});
		} catch (error) {
			finalCallback();
			
		}
	}
};