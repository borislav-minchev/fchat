//--- CONTENTS ---//
// myTranslations - localization stuff
// myCountries - for saving the countries list locally
// myPerms - for requesting permissions
// dataValidation - phone number formatting and file type check
// webConnection - checking for internet connection
// fileHelper - stuff with files
// mySearch - search filter funcionality
// myToast - for showing native toast message
// myFavoCategories - for loading categories and subcategories with clicks
// myQuill - for showing Quill text editor // https://quilljs.com/
// myLocale - for working with user locale, languages, etc
// myLightGallery - for loading lightGallery view in an element // https://github.com/sachinchoolur/lightGallery
// myPhoneContacts - for working with local phone contacts
// myCamera - for taking pictures
// myClipboard - for copying text to device clipboard // https://github.com/ibnclaudius/CordovaClipboard
// myImagePicker - for choosing multiple images from phone gallery // http://plugins.telerik.com/cordova/plugin/imagepicker
// infiniteScroller - for getting function for detecting scrolling in element


//---------------------------- Translations ----------------------------------//
const myTranslations = {

	translator: {},

	loadTranslations(finalCallback) {
		const localTranslations = myStorage.getLocalTranslations();
		if (localTranslations) {
			myTranslations.translator = JSON.parse(localTranslations);
			finalCallback();
		} else {
			myTranslations.getNewTranslations(finalCallback);
		}
	},

	getNewTranslations(finalCallback) {
		const lang = myStorage.getLanguage();
		myAjax.getTranslations(lang, response => {
			const translations = response.textsList;
			let newTranslations = {};
			let index = '';
			for (const item of translations) {
				index = item.textId;
				newTranslations[index] = item.textString;
			}
			myTranslations.translator = newTranslations;
			const stringifiedTranslations = JSON.stringify(newTranslations);
			myStorage.setLocalTranslations(stringifiedTranslations);
			myStorage.setLanguageVersion(response.version);
			myStorage.setLanguageFlag(response.textFlag);
			finalCallback();
		});
	},

	getTranslation(translationId) {
		const text = this.translator[translationId];
		return text;
	}
};

const myCountries = {

	getCountriesList(callback) {
		const localCountries = myStorage.getLocalCountries();
		if (localCountries) {
			const countriesObj = JSON.parse(localCountries);
			callback(countriesObj);
		} else {
			myAjax.requestCountries((countriesObj) => {
				const stringifiedCountries = JSON.stringify(countriesObj);
				myStorage.setLocalCountries(stringifiedCountries);
				callback(countriesObj);
			});
		}
	}
};


//-------------------------- Permissions Apis --------------------------------//
// https://www.npmjs.com/package/cordova-plugin-android-permissions
const myPerms = {

	permissionsApi: {},

	checkAudioPermissions(finalCallback) {
		myPerms.permissionsApi = cordova.plugins.permissions;
		const permissionAudio = myPerms.permissionsApi.RECORD_AUDIO;
		const permissionWrite = myPerms.permissionsApi.WRITE_EXTERNAL_STORAGE;
		myPerms.hasPermission(permissionAudio, (status) => {
			if (status == true) {
				myPerms.hasPermission(permissionWrite, (status) => {
					if (status == true) {
						// both permissions granted
						finalCallback(true);
					} else {
						finalCallback(false);
					}
				});
			} else {
				finalCallback(false);
			}
		});
	},

	checkStoragePermission(finalCallback) {
		myPerms.permissionsApi = cordova.plugins.permissions;
		const permissionWrite = myPerms.permissionsApi.WRITE_EXTERNAL_STORAGE;
		myPerms.hasPermission(permissionWrite, (status) => {
			if (status == true) {
				finalCallback(true);
			} else {
				finalCallback(false);
			}
		});
	},

	checkContactsPermission(finalCallback) {
		myPerms.permissionsApi = cordova.plugins.permissions;
		const permissionContacts = myPerms.permissionsApi.READ_CONTACTS;
		myPerms.hasPermission(permissionContacts, (status) => {
			if (status == true) {
				finalCallback(true);
			} else {
				finalCallback(false);
			}
		});
	},

	hasPermission(permission, callback) {
		myPerms.permissionsApi.hasPermission(permission, (status) => {
			if (status.hasPermission) {
				callback(true);
			} else {
				// dont have permission, request it
				myPerms.requestPermission(permission, (status) => {
					if (status) {
						callback(true);
					} else {
						callback(false);
					}
				});
			}
		});
	},

	requestPermission(permission, callback) {
		myPerms.permissionsApi.requestPermission(permission, (status) => {
			if (status.hasPermission) {
				callback(true);
			} else {
				callback(false);
			}
		});
	}
};


//---------------------------- Data Validation -------------------------------//
const dataValidation = {

	formatPhoneNumber(phoneCode, phoneNumber) {
		let formattedPhone = '';

		while (phoneCode.charAt(0) === '+') {
			phoneCode = phoneCode.substr(1);
		}
		while (phoneNumber.charAt(0) === '+') {
			phoneNumber = phoneNumber.substr(1);
		}
		while (phoneNumber.charAt(0) === '0') {
			phoneNumber = phoneNumber.substr(1);
		}
		if (phoneNumber.startsWith(phoneCode)) {
			phoneNumber = phoneNumber.substring(phoneCode.length);
			// proverka ako po4va s 0
			while (phoneNumber.charAt(0) === '0') {
				phoneNumber = phoneNumber.substr(1);
			}
		}
		formattedPhone = phoneCode + phoneNumber;
		return formattedPhone;
	},

	formatNumberFromContacts(code, number) {
		let formattedNumber = '';
		// to remove all characters that arent numbers
		number = number.replace(/\D/g, '');
		if (number.startsWith('0')) {
			number = number.substr(1);
			formattedNumber = code + number;
			return formattedNumber;
		} else {
			return number;
		}
	},

	checkFileType(fileType) {
		const allowedFileTypes = [
			'doc',
			'xls',
			'pdf',
			'docx',
			'xlsx'
		];
		for (const type of allowedFileTypes) {
			if (fileType == type) {
				return true;
			}
		}
		return false;
	}
};


//---------------------------- Web Connection --------------------------------//
const webConnection = {

	checkInternet(finalCallback) {
		const txt = myTranslations.getTranslation(TXT_NO_INTERNET);
		const checkInternetFunc = function () {
			const internetConnection = navigator.connection.type;
			if (internetConnection == 'none') {
				navigator.splashscreen.hide();
				ons.createAlertDialog(DIALOG_NO_INTERNET).then((dialog) => {
					$(dialog).find('#dialogText').text(txt);
					$(dialog).find('#btnInternetRetry').on('click', () => {
						dialog.remove();
						checkInternetFunc();
					});
					dialog.show();
				});
			} else {
				finalCallback();
			}
		};
		checkInternetFunc();
	}
};


//------------------------------ File Helper ---------------------------------//
const fileHelper = {

	deleteFile(filePath) {
		window.resolveLocalFileSystemURL(filePath, fileEntry => {
			fileEntry.remove(success => {
				//debugger;
			}, error => {
				//debugger;
			});
		});
	},

	createFile(fileName, callback) {
		let directory;
		if (device.platform == 'Android') {
			directory = cordova.file.externalCacheDirectory;
		} else {
			directory = cordova.file.tempDirectory;
		}
		window.resolveLocalFileSystemURL(directory, dirEntry => {
			dirEntry.getFile(fileName, {
				create: true,
				exclusive: false
			}, fileEntry => {
				callback(fileEntry.nativeURL);
			}, error => {
				callback(error);
				console.log('error creating file: ' + error);
			});
		});
	},

	iOSReadFile(fileName, callback) {
		window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, fs => {
			fs.root.getFile(fileName, {
				create: false,
				exclusive: false
			}, fileEntry => {
				callback(fileEntry.nativeURL);
			}, error => {
				console.log('error create file: ' + error);
			});
		}, error => {
			console.log('error loading file system: ' + error);
		});
	},

	createDirectory(dirEntry, callback) {
		dirEntry.getDirectory(IMG_SAVE_FOLDER, {
			create: true
		}, (dirEntry) => {
			callback(dirEntry);
		}, (error) => {
			callback();
			console.log('error creating directory: ' + error);
		});
	},

	downloadFile(imgUrl, callback) {
		const fileTransfer = new FileTransfer();
		const fileName = imgUrl.split('/').pop();
		fileHelper.createImageFile(fileName, (fileEntry) => {
			fileTransfer.download(imgUrl, fileEntry, () => {
				// To refresh Android media // https://github.com/lotterfriends/refreshgallery
				refreshMedia.refresh(fileEntry);
				callback();
			});
		});
	},

	createImageFile(fileName, callback) {
		const directory = cordova.file.externalRootDirectory;
		window.resolveLocalFileSystemURL(directory, (dirEntry) => {
			fileHelper.createDirectory(dirEntry, (newDirEntry) => {
				newDirEntry.getFile(fileName, {
					create: true,
					exclusive: false
				}, (fileEntry) => {
					callback(fileEntry.nativeURL);
				}, (error) => {
					callback(error);
					console.log('error creating file: ' + error);
				});
			});
		});
	}
};

const mySearch = {

	getSearchFunc(elements) {
		const searchFunc = function () {
			const searchText = this.value.trim();
			if (searchText) {
				$('#' + elements.list + ' .no-result-item').remove();
				$('.' + elements.listItem).hide();
				$('.' + elements.listItem).filter(function () {
					let match = '';
					for (const filterAttr of elements.filterAttributes) {
						match = this.attributes[filterAttr].value.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
						if (match) {
							break;
						}
					}
					return match;
				}).show();
				const results = $('.' + elements.listItem + ':visible');
				if (results.length == 0) {
					$('#' + elements.list).append(appender.getNoSearchResultItem());
				}
			} else {
				$('.' + elements.listItem).show();
			}
		};
		return searchFunc;
	},

	getFriendsSearchFunc() {
		const filterAttributes = [
			'data-name',
			'data-company'
		];
		const searchFunc = function () {
			const searchText = this.value.trim();
			if (searchText) {
				$('#btnTopMenu').hide();
				$('#btnTopClearSearch').show();
				$('.friends-label').hide();
				$('#listFriendRequests').show();
				$('.friend-item').hide();
				$('#listFriendRequests .no-result-item').remove();
				$('.friend-item').filter(function () {
					let match = '';
					for (const filterAttr of filterAttributes) {
						match = this.attributes[filterAttr].value.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
						if (match) {
							break;
						}
					}
					return match;
				}).show();
				const results = $('.friend-item:visible');
				if (results.length == 0) {
					$('#listFriendRequests').append(appender.getNoSearchResultItem());
				}
			} else {
				$('#btnTopMenu').show();
				$('#btnTopClearSearch').hide();
				$('.friend-item').show();
				$('.friends-label:not(.is-hidden)').show();
				if ($('#headerFriendRequests').attr('data-expanded') == 1) {
					$('#listFriendRequests').show();
				} else {
					$('#listFriendRequests').hide();
				}
			}
		};
		return searchFunc;
	}
};


// http://plugins.telerik.com/cordova/plugin/toast
const myToast = {

	showLong(message) {
		if (message) {
			window.plugins.toast.showLongBottom(message);
		}
	},

	showShort(message) {
		if (message) {
			window.plugins.toast.showShortBottom(message);
		}
	}
};

const myFavoCategories = {

	////////////////////////////////////////////////////////////////////////////
	//////////////////////***** Company Categories ****/////////////////////////
	////////////////////////////////////////////////////////////////////////////
	loadFavoCategories(listElement, page, selectedCategories, finalCallback) {
		myAjax.getMerchantCategories(response => {
			if (response.length > 0) {
				let categoriesList = '';
				for (const category of response) {
					categoriesList += appender.getMerchantCategoryItem(category);
				}
				$('#' + listElement).append(categoriesList);
				favoClicks.setMerchantCategoryListItemClicks();
				if (selectedCategories) {
					myFavoCategories.loadFavoSubCategories(page, selectedCategories, finalCallback);
				} else {
					if (finalCallback) {
						finalCallback();
					} else {
						$('.title-loading').hide();
					}
				}
			}
		});
	},

	loadFavoSubCategories(page, selectedCategories, finalCallback) {
		let currentSubCat = 0;

		const subCatIndexIncrementFunc = function (currentSubCatId) {
			$('.sub-cat-list-item[data-cat-id="' + currentSubCatId + '"]').prop('checked', true);
			currentSubCat++;
			if (selectedCategories[currentSubCat]) {
				loadSubCatsFunc(selectedCategories[currentSubCat]);
			} else {
				// finish							
				$('#' + page).attr('data-categories-loaded', 1);
				if (finalCallback) {
					finalCallback();
				} else {
					$('.title-loading').hide();
				}
			}
		};

		const loadSubCatsFunc = function (subCat) {
			const subListLength = $('#' + subCat.catParent + '.ons-sub-cat-list')[0].children.length;
			if (subListLength == 0) {
				myAjax.getMerchantSubCategories(subCat.catParent, response => {
					if (response) {
						let subCatList = '';
						for (const subCat of response) {
							subCatList += appender.getMerchantSubCategoryItem(subCat);
						}
						$('#' + subCat.catParent + '.ons-sub-cat-list').append(subCatList);
						$('#' + subCat.catParent).find('.expand-icon').attr('icon', 'ion-chevron-down');
						$('#' + subCat.catParent).attr('data-subcat-loaded', 1);
						$('#' + subCat.catParent).attr('data-expanded', 1);
						$('#' + subCat.catParent + '.ons-sub-cat-list').show();
						subCatIndexIncrementFunc(subCat.catId);
					}
				});
			} else {
				subCatIndexIncrementFunc(subCat.catId);
			}
		};

		loadSubCatsFunc(selectedCategories[currentSubCat]);
	},

	getCategoryClickFunction() {
		const catClickFunc = function () {
			const catId = this.id;
			const expanded = this.dataset.expanded;
			if (expanded == 0) {
				$(this).attr('data-expanded', 1);
				const subCatLoaded = $(this).attr('data-subcat-loaded');
				if (subCatLoaded == 0) {
					$('.title-loading').show();
					$('.category-list-item').off('click');
					myAjax.getMerchantSubCategories(catId, (response) => {
						if (response.length > 0) {
							let subCatList = '';
							for (const subCat of response) {
								subCatList += appender.getMerchantSubCategoryItem(subCat);
							}
							$('#' + catId + '.ons-sub-cat-list').append(subCatList);
							$('#' + catId + '.ons-sub-cat-list').show();
							// Check if we are on Favo360 Registration page clicks are needed only there
							if ($('#pageFavoRegMerchantCategories').length) {
								favoClicks.setMerchantSubCategoryListItemClicks();
							}
							$(this).attr('data-subcat-loaded', 1);
						}
						$('.category-list-item').on('click', catClickFunc);
						$(this).find('.expand-icon').attr('icon', 'ion-chevron-down');
						$('.title-loading').hide();
					});
				} else {
					$(this).find('.expand-icon').attr('icon', 'ion-chevron-down');
					$('#' + catId + '.ons-sub-cat-list').show();
				}
			} else {
				$(this).find('.expand-icon').attr('icon', 'ion-chevron-right');
				$(this).attr('data-expanded', 0);
				$('#' + catId + '.ons-sub-cat-list').hide();
			}
		};
		return catClickFunc;
	}
};

// https://quilljs.com/
const myQuill = {

	load(element) {
		const quillOptions = {
			modules: {
				toolbar: [
					[{ header: [1, 2, false] }],
					['bold', 'italic', 'underline'],
					['code-block']
				]
			},
			placeholder: myTranslations.getTranslation(TXT_DESCRIPTION),
			theme: 'snow'
		};
		new Quill(element, quillOptions);
	}
};

const myLocale = {

	getLanguage(callback) {
		const langId = myStorage.getLanguage();
		if (langId) {
			callback();
		} else {
			navigator.globalization.getPreferredLanguage(success => {
				let langId = success.value.substring(0, 2);
				myStorage.setLanguage(langId);
				callback();
			}, (error) => {
				myStorage.setLanguage('EN');
				callback();
			});
		}
	},

	getDateFormat(callback) {
		navigator.globalization.getDatePattern(success => {
			myStorage.setDateFormat(success.pattern);
			callback();
		}, error => {
			myStorage.setDateFormat('');
			callback();
		}, {
				formatLength: 'short',
				selector: 'date'
			});
	}
};

// https://github.com/sachinchoolur/lightGallery
const myLightGallery = {

	loadGallery(element) {
		$(element).lightGallery({
			loop: false,
			controls: false
		});
		$(element).on('onBeforeOpen.lg', () => {
			ons.disableDeviceBackButtonHandler();
		});
		$(element).on('onCloseAfter.lg', () => {
			ons.enableDeviceBackButtonHandler();
		});
		$(element).on('onAfterOpen.lg', function () {
			if (this.classList.contains('is-single')) {
				$('#lg-counter').remove();
			}
			$('#lg-actual-size').remove();
			$('#lg-download').on('click', function () {
				// za vseki slu4ai da se proveri na nqkoi telefoni da ne svalq 2 pyti kartinkata
				fileHelper.downloadFile(this.href, () => {
					myToast.showLong('Image downloaded');
				});
			});
		});
	}
};

const myPhoneContacts = {

	loadContacts() {
		const options = new ContactFindOptions();
		options.multiple = true;
		options.hasPhoneNumber = true;
		const fields = ['phoneNumbers'];
		navigator.contacts.find(fields, contacts => {
			contacts.sort((a, b) => {
				if (a.displayName < b.displayName) {
					return -1;
				}
				if (a.displayName > b.displayName) {
					return 1;
				}
				return 0;
			});
			myPhoneContacts.prepareContactsForServer(contacts);
		}, (error) => {
			// error function
		}, options);
	},

	prepareContactsForServer(contacts) {
		let personName = '';
		let personNumber = '';
		let lastNumber = '';
		let contactsForServer = [];
		//let formattedContactsForServer = [];
		let contactsList = [];
		const userPhoneCode = myStorage.getUserCountryPhoneCode();
		for (const person of contacts) {
			personName = person.name.formatted;
			if (personName && person.phoneNumbers) {
				for (const numberObject of person.phoneNumbers) {
					personNumber = numberObject.value;
					const formattedNumber = dataValidation.formatNumberFromContacts(userPhoneCode, personNumber);
					if (formattedNumber != lastNumber && formattedNumber.length > MIN_CONTACT_NUMBER_LENGTH) {
						lastNumber = formattedNumber;
						contactsList[personName] = formattedNumber;
						//contactsForServer[formattedNumber] = formattedNumber;
						contactsForServer.push(formattedNumber);
						contactsList += appender.getPhoneContactItem(personName, formattedNumber);
					}
				}
			}
		}
		$('#listPhoneContacts').append(contactsList);
		// To remove duplicates in the array
		contactsForServer = Array.from(new Set(contactsForServer));
		contactsForServer = JSON.stringify(contactsForServer);
		myAjax.checkPhoneContacts(contactsForServer, myPhoneContacts.onResponseContacts);
	},

	onResponseContacts(response) {
		if (response.length > 0) {
			let favoContactsFriends = '';
			let favoContactsNotFriends = '';
			let rightFieldItem = '';
			for (const person of response) {
				const contacts = $('.contact-list-item[data-person-number="' + person.phone + '"]');
				for (const contactItem of contacts) {
					if (person.isShared == 1) {
						// add disabled buton for already sent invitation
						rightFieldItem = appender.getPhoneContactAlreadySharedItem();
					} else {
						if (person.isFriend == 1) {
							// add button Open Chat
							rightFieldItem = appender.getPhoneContactOpenChatItem(person);
						} else {
							// add button to send request
							rightFieldItem = appender.getPhoneContactSendRequestItem(person.phone);
						}
					}
					$(contactItem).find('.right-field').html(rightFieldItem);
					$(contactItem).attr('data-have-favo-chat', 1);
					$(contactItem).attr('data-is-friend', person.isFriend);
					if (person.isFriend == 1) {
						favoContactsFriends += $(contactItem)[0].outerHTML;
					} else {
						favoContactsNotFriends += $(contactItem)[0].outerHTML;
						//asd
					}
					$(contactItem).remove();
				}
			}
			$('#listPhoneContacts').prepend(favoContactsNotFriends);
			$('#listPhoneContacts').prepend(favoContactsFriends);
		}
		$('#listPhoneContacts').show();
		$('#pagePhoneContacts .title-loading').hide();
	}
};

const myCamera = {

	getPicture(callback) {
		const openCameraFunc = function () {
			const camera = navigator.camera;
			const cameraOptions = {
				quality: 50,
				correctOrientation: true
			};
			camera.getPicture(callback, error => {
				console.log('Camera error:' + error);
			}, cameraOptions);
		};

		if (device.platform == 'Android') {
			myPerms.checkStoragePermission(status => {
				if (status == true) {
					openCameraFunc();
				} else {
					callback();
				}
			});
		} else {
			openCameraFunc();
		}
	}
};

// https://github.com/ibnclaudius/CordovaClipboard
const myClipboard = {
	copyText(txt) {
		cordova.plugins.clipboard.copy(txt);
	}
};

// http://plugins.telerik.com/cordova/plugin/imagepicker
const myImagePicker = {

	pickImages(imagesNumber, callback) {
		const pickImagesFunc = function () {
			// http://plugins.telerik.com/cordova/plugin/imagepicker
			const options = {
				maximumImagesCount: imagesNumber
			};
			imagePicker.getPictures(callback, error => {
				ons.notification.alert('Error: ' + error);
			},
				options
			);
		};

		if (device.platform == 'Android') {
			myPerms.checkStoragePermission(status => {
				if (status == true) {
					pickImagesFunc();
				} else {
					callback();
				}
			});
		} else {
			pickImagesFunc();
		}
	}
};

const infiniteScroller = {

	getScrollFunction(element) {
		const scrollFunc = function () {

		};

		return scrollFunc;
	},

	getFavoScrollFunction() {
		const scrollFunc = function () {
			const scrollTop = $(this).scrollTop();
			const scrollHeight = $(this)[0].scrollHeight;
			const clientHeight = $(this)[0].getBoundingClientRect().height;
			if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
				// scroll is on bottom
				favo360api.scrollHandler();
			}
		};

		return scrollFunc;
	}
};