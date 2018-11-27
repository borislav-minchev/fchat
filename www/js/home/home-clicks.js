const homeClicks = {
	
	setPageHomeProfileClicks() {
		$('#btnHomeProfile .inner-link').on('click', () => {
			myHome.pushPage(PAGE_PROFILE);
		});
		$('#btnHomeSettings').on('click', () => {
			myHome.pushPage(PAGE_HOME_SETTINGS);
		});
		$('#btnHomeSupport').on('click', () => {
			// tuka ako moje ina4e da se napravi, da ne vzema stoinosti ot drug ekran
			const element = $('#pageFriends').find('.official-account');
			const userId = $(element).attr('data-user-id');
			const conId = $(element).attr('data-con-id');
			const name = $(element).attr('data-name');
			const data = {
				userId: userId,
				conId: conId,
				name: name
			};
			myHome.pushPage(PAGE_HOME_CHAT, data);
		});
		$('#btnHomeLegal').on('click', () => {
			myHome.pushPage(PAGE_LEGAL);
		});
		$('#btnHomeAbout').on('click', () => {
			myHome.pushPage(PAGE_ABOUT);
		}); 
		$('#btnHomeProfile .user-store-link').on('click', function () {
			const imgSrc = this.dataset.imgSrc;
			// open ons modal
			ons.createDialog(DIALOG_PROFILE_QR).then(dialog => {
				$(dialog).find('#imgQR').attr('src', imgSrc);
				dialog.show();
			});
		});
	},
	
	setDownloadAllImagesButton() {
		$('#btnDownloadAll').on('click', function () {
			const downloadAllImgFunc = function () {
				$('#btnDownloadAll').prop('disabled', true);
				const imagesSaved = $('#pageImageGallery').attr('data-images-saved');
				if (imagesSaved == 0) {
					$('#pageImageGallery .title-loading').show();
					let currentImg = 0;
					const images = $('.full-img-element');
					const downloadFunc = function () {
						const imgUrl = images[currentImg].href;
						fileHelper.downloadFile(imgUrl, () => {
							currentImg++;
							if (images[currentImg]) {
								downloadFunc();
							} else {
								myToast.showLong('All images downloaded successfully!');
								$('#pageImageGallery').attr('data-images-saved', 1);
								$('#btnDownloadAll').prop('disabled', false);
								$('#pageImageGallery .title-loading').hide();
							}
						});
					};
					downloadFunc();
				} else {
					myToast.showShort('Images already downloaded');
					$('#btnDownloadAll').prop('disabled', false);
				}
			};
			
			if (device.platform == 'Android') {
				myPerms.checkStoragePermission(status => {
					if (status == true) {
						downloadAllImgFunc();
					}
				});
			} else {
				downloadAllImgFunc();
			}
		});	
	},
	
	setSearchContactsInput() {
		const elements = {
			filterAttributes: [
				'data-person-name',
				'data-person-number'
			],
			list: 'listPhoneContacts',
			listItem: 'contact-list-item'
		};
		const searchFunc = mySearch.getSearchFunc(elements);
		$('#inputSearchContacts').on('input', searchFunc);
	},
	
	setHomeSwipeEvent() {
		const onsNav = $('#homeNavigator')[0];
		const gd = ons.GestureDetector(onsNav);
		gd.on('swipe', event => {
			if (myHome.visiblePage == 'pageRecent' || 
				myHome.visiblePage == 'pageFriends' || 
				myHome.visiblePage == 'pageFavoSite' || 
				myHome.visiblePage == 'pageHomeProfile')
			{
				let activeTab = $('#homeTabBar')[0].getActiveTabIndex();
				if (event.gesture.direction == 'left') {
					if (activeTab < 3) {
						const newTab = activeTab + 1;
						$('#homeTabBar')[0].setActiveTab(newTab);
					} else if (activeTab == 3) {
						$('#homeTabBar')[0].setActiveTab(0);
					}
				} else if (event.gesture.direction == 'right') {
					if (activeTab > 0) {
						const newTab = activeTab - 1;
						$('#homeTabBar')[0].setActiveTab(newTab);
					} else if (activeTab == 0) {
						$('#homeTabBar')[0].setActiveTab(3);
					}
				}
			}
		});
	},
	
	setPageCountryEvents() {
		const elements = {
			filterAttributes: [
				'data-country-code',
				'data-country-name',
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
			const inputElement = $('#pageCountry').attr('data-input-element');
			const inputEntry = countryName + ' (' + countryPhoneCode + ')';
			$('#' + inputElement).val(inputEntry);
			$('#' + inputElement).attr('data-country-code', countryCode);
			$('#' + inputElement).attr('data-phone-code', countryPhoneCode);
			const cityInputElement = $('#pageCountry').attr('data-city-input-element');
			if (cityInputElement) {
				$('#' + cityInputElement).val('');
				$('#' + cityInputElement).attr('data-city-id', '');
				$('#' + cityInputElement).prop('disabled', false);
			}
			myHome.popPage();
		});
	},
	
	setPageCreateGroupEvents() {
		const elements = {
			filterAttributes: [
				'data-user-name',
				'data-user-comment'
			],
			list: 'listFriendsToAdd',
			listItem: 'friend-create-group-list-item'
		};
		const searchFunc = mySearch.getSearchFunc(elements);
		$('#pageCreateGroup #inputSearchFriends').on('input', searchFunc);
		
		$('#btnTitleCreateGroup').on('click', function () {
			this.disabled = true;
			$('#pageCreateGroup .title-loading').show();
			const groupName = $('#inputGroupName').val();
			const selectedFriends = $('.friend-create-group-list-item.is-checked');
			let groupMembers = [];
			for (const friend of selectedFriends) {
				groupMembers.push(friend.dataset.userId);
			}
			groupMembers = JSON.stringify(groupMembers);
			myAjax.createGroupChat(groupMembers, groupName, response => {
				myHome.loadFriends();
				myHome.loadRecentChats();
				const data = {
					name: groupName,
					conId: response.conId
				};
				debugger;
				$('#pageCreateGroup .title-loading').hide();
				myHome.replacePage(PAGE_HOME_CHAT, data);
			});
		});
		
		const checkFieldsAndCheckboxesFunc = function () {
			const txt = $('#inputGroupName').val();
			const checkedBoxes = $('.friend-create-group-list-item.is-checked').length;
			if (txt && checkedBoxes > 0) {
				$('#btnTitleCreateGroup').prop('disabled', false);
			} else {
				$('#btnTitleCreateGroup').prop('disabled', true);
			}
		};
		
		$('.create-chat-checkbox').on('change', function () {
			const id = $(this).find('input')[0].id;
			if (this.checked == true) {
				$('.friend-create-group-list-item[data-user-id="' + id + '"]').addClass('is-checked');
			} else {
				$('.friend-create-group-list-item[data-user-id="' + id + '"]').removeClass('is-checked');
			}
			checkFieldsAndCheckboxesFunc();
		});
		$('#inputGroupName').on('input', checkFieldsAndCheckboxesFunc);
	},

	setPageFriendsClicks() {
		$('#btnTopMenu').on('click', () => {
			$('#topMenuFriends').toggle();
			$('#btnTopMenu .btn-icon').toggle();
			if ($('#btnTopMenu').hasClass('on')) {
				$('#btnTopMenu').removeClass('on');
			} else {
				$('#btnTopMenu').addClass('on');
			}
		});
		$('#liAddFriend').on('click', () => {
			myHome.pushPage(PAGE_ADD_FRIEND);
			$('#btnTopMenu').trigger('click');
		});
		$('#liCreateGroup').on('click', () => {
			myHome.pushPage(PAGE_CREATE_GROUP);
			$('#btnTopMenu').trigger('click');
		});
		$('#btnTopClearSearch').on('click', () => {
			// clears text, hdies keyboard, and shows all friends
			$('#inputSearchFriends').val('');
			$('#inputSearchFriends').blur();
			if (device.platform != 'browser') {
				cordova.plugins.Keyboard.close();
			}
			$('#inputSearchFriends').trigger('input');
		});
		
		$('#inputSearchFriends').on('input', mySearch.getFriendsSearchFunc());
		$('#headerFriendRequests').on('click', function () {
			const expanded = this.dataset.expanded;
			if (expanded == 0) {
				$(this).find('.expand-icon').attr('icon', 'ion-chevron-down');
				$('#listFriendRequests').show();
				$(this).attr('data-expanded', 1);
			} else {
				$(this).find('.expand-icon').attr('icon', 'ion-chevron-right');
				$('#listFriendRequests').hide();
				$(this).attr('data-expanded', 0);
			}
		});
	},
	
	setPageProfileClicks() {
		const avatarClickFunc = function () {
			$('#profileAvatar').off('click');
			const camera = navigator.camera;
			const cameraOptions = {
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			};
			camera.getPicture((imageData) => {
				$('#loadingProfile').show();
				myAjax.uploadAvatar(imageData, () => {
					$('#profileAvatar').on('click', avatarClickFunc);
					myHome.loadCurrentUserProfile();
				});
			}, (error) => {
				$('#profileAvatar').on('click', avatarClickFunc);
			}, cameraOptions);
		};
		$('#profileAvatar').on('click', avatarClickFunc);
		$('#btnEditUserInfo').on('click', () => {
			myHome.pushPage(PAGE_PROFILE_EDIT);
		});
		$('#btnProfileLogout').on('click', () => {
			myHome.logOutUser();
		});
	},
	
	setPageProfileEditClicks() {
		$('#btnSendNewPass').on('click', () => {
			$('#btnSendNewPass').prop('disabled', true);
			const oldPass = $('#inputOldPass').val();
			const newPass = $('#inputNewPass').val();
			const newPassAgain = $('#inputNewPassAgain').val();
			if (oldPass && newPass && newPassAgain) {
				if (newPass == newPassAgain) {
					$('#pageProfileEdit .title-loading').show();
					myAjax.sendNewPassword(oldPass, newPass, (response) => {
						if (response[0]) {
							ons.notification.alert('' + response[0].error);
						} else {
							const txt = myTranslations.getTranslation(TXT_PASS_CHANGE_SUCCESS);
							ons.notification.alert(txt);
							myHome.popPage();
						}
						$('#pageProfileEdit .title-loading').hide();
						$('#btnSendNewPass').prop('disabled', false);
					});
				} else {
					const txt = myTranslations.getTranslation(TXT_PASS_NO_MATCH);
					ons.notification.alert(txt);
					$('#btnSendNewPass').prop('disabled', false);
				}
			} else {
				const txt = myTranslations.getTranslation(TXT_WARN_REG);
				ons.notification.alert(txt);
				$('#btnSendNewPass').prop('disabled', false);
			}
		});
		$('#btnShowFields').on('click', function () {
			if ($(this).hasClass('on')) {
				$(this).removeClass('on').addClass('off');
				$('#iconPassShow').attr('icon', 'ion-eye-disabled');
				$('#inputFields ons-input').attr('type', 'text');
			} else {
				$(this).removeClass('off').addClass('on');
				$('#iconPassShow').attr('icon', 'ion-eye');
				$('#inputFields ons-input').attr('type', 'password');
			}
		});
	},
	
	setPageAddFriendsToGroupEvents() {
		$('.create-chat-checkbox').on('change', () => {
			if ($('.friend-create-group-list-item :checked').length > 0) {
				$('#btnAddFriends').attr('disabled', false);
			} else {
				$('#btnAddFriends').attr('disabled', true);
			}
		});

		const elements = {
			filterAttributes: [
				'data-user-name',
				'data-user-comment'
			],
			list: 'listFriendsToAdd',
			listItem: 'friend-create-group-list-item'
		};
		const searchFunc = mySearch.getSearchFunc(elements);
		$('#pageAddFriendsToGroup #inputSearchFriends').on('input', searchFunc);
		$('#btnAddFriends').on('click', function () {
			$('#pageAddFriendsToGroup .title-loading').show();
			this.disabled = true;
			$('.friend-create-group-list-item').attr('disabled', true);
			const checkedFriends = $('.friend-create-group-list-item :checked');
			let friendsToAdd = [];
			for (const friend of checkedFriends) {
				friendsToAdd.push(friend.id);
			}
			friendsToAdd = JSON.stringify(friendsToAdd);
			const conId = $('#pageAddFriendsToGroup').attr('data-con-id');
			myAjax.addFriendsToGroup(conId, friendsToAdd, response => {
				debugger;
				if (response.reqOK == 1) {
					
				} else {
					this.disabled = false;
					$('#pageAddFriendsToGroup .title-loading').hide();
					$('.friend-create-group-list-item').attr('disabled', false);
				}
			});
		});
	},
	
	setPageFriendProfileEvents() {
		$('#btnTitleFriendMore').on('click', () => {
			ons.createDialog(DIALOG_FRIEND_PROFILE_MORE).then(dialog => {
				homeLocalizations.translateDialogFriendProfileMore();
				dialog.show();
			});
		});
		$('#btnOpenChat').on('click', () => {
			let conId = $('#pageFriendProfile').attr('data-con-id');
			const userId = $('#pageFriendProfile').attr('data-user-id');
			const name = $('#pageFriendProfile .title-label').text();
			
			const openChatFunc = function () {
				const data = {
					userId: userId,
					conId: conId,
					name: name
				};
				myHome.bringPageToTop(PAGE_HOME_CHAT, data);
			};
			
			if (conId == 0) {
				$('#pageFriendProfile .title-loading').show();
				$('#btnOpenChat').attr('disabled', true);
				myAjax.connectToUser(userId, response => {
					if (response[0].conId) {
						conId = response[0].conId;
						$('#pageFriendProfile').attr('data-con-id', response[0].conId);
						openChatFunc();
					} else {
						// some error
					}
					$('#pageFriendProfile .title-loading').hide();
					$('#btnOpenChat').attr('disabled', false);
				});
			} else {
				openChatFunc();
			}
		});
		$('#btnCallFriend').on('click', () => {
			const data = {
				userId: $('#pageFriendProfile').attr('data-user-id'),
				conId: $('#pageFriendProfile').attr('data-con-id')
			};
			myHome.pushPage(PAGE_VIDEO_CALL, data);
		});
		$('#btnSendFriendRequest').on('click', () => {
			$('#pageFriendProfile .title-loading').show();
			$('.friend-profile-button').attr('disabled', true);
			const userId = $('#pageFriendProfile').attr('data-user-id');
			myAjax.sendFriendRequest(userId, response => {
				if (response[0]) {
					myHome.loadFriendProfile(userId);
					myHome.loadFriends();
					myHome.loadHomeNotifications();
				} else {
					$('#pageFriendProfile .title-loading').hide();
				}
			});
		});
		$('#btnAcceptFriendRequest').on('click', () => {
			$('#pageFriendProfile .title-loading').show();
			$('.friend-profile-button').attr('disabled', true);
			const conId = $('#pageFriendProfile').attr('data-con-id');
			const userId = $('#pageFriendProfile').attr('data-user-id');
			myAjax.acceptFriendRequest(conId, response => {
				if (response[0].confirmed) {
					//$('.friend-profile-button').attr('disabled', false);
					myHome.loadFriendProfile(userId);
					myHome.loadFriends();
					myHome.loadHomeNotifications();
					myToast.showLong('Friend request accepted.');
				} else {
					const error = response[0].error;
				}
				$('#pageFriendProfile .title-loading').hide();
			});
		});
		$('#btnDenyFriendRequest').on('click', this.onRemoveFriend);
		$('#btnCancelFriendRequest').on('click', this.onRemoveFriend);
		$('#friendCustomName, #friendComment').on('input', () => {
			// to fix empty space in bottom because of hidden toolbar
			$('#pageFriendProfile').addClass('page-with-bottom-toolbar');
			$('#botToolbarFriendProfile').show();
		});
		$('#btnUpdateFriendProfile').on('click', () => {
			const data = {
				targetUser: $('#pageFriendProfile').attr('data-user-id'),
				userFullNameChanged: $('#friendCustomName').val(),
				userComment: $('#friendComment').val()
			};
			myAjax.sendFriendChangedCustomData(data, (response) => {
				if (response.msg) {
					myToast.showLong(response.msg);
					$('#botToolbarFriendProfile').hide();
					myHome.loadFriends();
				} else {
					myToast.showLong(response.error);
				}
			});
		});
	},
	
	onRemoveFriend() {
		// Used for Removing a friend, Denying a friend request, or Canceling a sent friend request
		$('#pageFriendProfile .title-loading').show();
		$('.friend-profile-button').attr('disabled', true);
		const userId = $('#pageFriendProfile').attr('data-user-id');
		const conId = $('#pageFriendProfile').attr('data-con-id');
		myAjax.removeFriend(conId, response => {
			if (response.reqOK == 1) {
				myHome.loadFriendProfile(userId);
				myHome.loadFriends();
				$('#pageFriends').find('.friend-item[data-user-id="' + userId + '"]').remove();
			} else {
				$('#pageFriendProfile .title-loading').hide();
			}
			//$('.friend-profile-button').attr('disabled', false);
		});
		myHome.hideOnsenDialog();
	},
	
	setPageSettingsClicks() {
		$('#liChangeLanguage').on('click', () => {
			myHome.pushPage(PAGE_LANGUAGE);
		});
	},
	
	setLanguageItemsClicks() {
		$('.lang-list-item').on('click', function () {
			$('#pageLanguage .title-label').show();
			$('.lang-list-item').attr('disabled', true);
			const langId = this.dataset.langId;
			const flagImg = this.dataset.imgSrc;
			myStorage.setLanguage(langId);
			myStorage.setLanguageFlag(flagImg);
			myStorage.setLocalTranslations('');
			myTranslations.getNewTranslations(() => {
				homeLocalizations.translateHomeTabs();
				homeLocalizations.translatePageRecent();
				homeLocalizations.translatePageFriends();
				homeLocalizations.translatePageHomeProfile();
				homeLocalizations.translatePageProfile();
				homeLocalizations.translatePageSettings();
				favoPagesLocalizations.translatePageFavo360();
				favoPagesLocalizations.translatePageFavoReg();
				$('#pageSettings #imgFlag').attr('src', flagImg);
				$('#pageLanguage .title-label').hide();
				myHome.loadRecentChats();
				myHome.popPage();
			});
		});
	},
	
	setPageAddFriendClicks() {
		$('#inputPhoneCode').on('click', () => {
			const data = {
				inputElement: 'inputPhoneCode'
			};
			myHome.pushPage(PAGE_COUNTRY, data);
		});
		$('#inputPhoneNumber').on('input', function () {
			if (this.value) {
				$('#btnSearchFriend').prop('disabled', false);
			} else {
				$('#btnSearchFriend').prop('disabled', true);
			}
		});
		$('#btnSearchFriend').on('click', () => {
			$('#pageAddFriend .title-loading').show();
			$('#btnSearchFriend').prop('disabled', true);
			$('#btnOpenContacts').prop('disabled', true);
			$('#foundFriendField').hide();
			$('#listFoundFriends').empty();
			$('#btnSendRequest').show();
			const phoneCode = $('#inputPhoneCode').attr('data-phone-code');
			const phoneNumber = $('#inputPhoneNumber').val();
			const formattedPhone = dataValidation.formatPhoneNumber(phoneCode, phoneNumber);
			myAjax.searchFriend(formattedPhone, response => {
				if (response[0].error) {
					if (response[0].isValidNumber == 1) {
						ons.createDialog(DIALOG_SEND_SMS_INVITE).then(dialog => {
							homeLocalizations.translateDialogSendSmsInvite();
							$('#dialogText').text(response[0].error + ' +' + formattedPhone);
							$('#btnSendSms').attr('data-person-number', formattedPhone);
							$('#btnSendSms').on('click', homeClicks.onDialogSendSmsInviteClick);
							$('#btnCancel').on('click', myHome.hideOnsenDialog);
							dialog.show();
						});
					} else {
						ons.notification.alert('' + response[0].error);
					}
				} else {
					let listFriends = '';
					for (const user of response) {
						listFriends += appender.getFoundFriendItem(user);
					}
					$('#listFoundFriends').append(listFriends);
					$('#foundFriendField').show();
				}
				$('#btnSearchFriend').prop('disabled', false);
				$('#btnOpenContacts').prop('disabled', false);
				$('#pageAddFriend .title-loading').hide();
			});
		});
		$('#btnSendRequest').on('click', () => {
			$('#pageAddFriend .title-loading').show();
			$('#btnSearchFriend').prop('disabled', true);
			$('#btnSendRequest').prop('disabled', true);
			const user = $('#liFoundFriend').attr('data-user-id');
			myAjax.sendFriendRequest(user, response => {
				if (response[0].conId) {
					$('#btnSendRequest').hide();
					const txt = myTranslations.getTranslation(TXT_FRIEND_REQUEST_SENT);
					myToast.showLong(txt);
					myHome.loadFriends();
				} else {
					ons.notification.alert(response[0].error);
				}
				$('#pageAddFriend .title-loading').hide();
				$('#btnSearchFriend').prop('disabled', false);
				$('#btnSendRequest').prop('disabled', false);
			});
		});
		$('#btnOpenContacts').on('click', () => {
			if (device.platform == 'Android') {
				myPerms.checkContactsPermission(status => {
					if (status == true) {
						myHome.pushPage(PAGE_HOME_PHONE_CONTACTS);
					}
				});
			} else {
				myHome.pushPage(PAGE_HOME_PHONE_CONTACTS);
			}
		});
	},
	
	onDialogSendSmsInviteClick() {
		myHome.hideOnsenDialog();
		const data = {
			personNumber: this.dataset.personNumber
		};
		myHome.pushPage(PAGE_HOME_SMS_INVITE, data);
	},
	
	onSendFriendContactClick(element) {
		ons.createDialog(DIALOG_SEND_FRIEND_REQUEST).then(dialog => {
			homeLocalizations.translateDialogSendFriendRequest();
			const personNumber = element.dataset.personNumber;
			$(dialog).attr('data-person-number', personNumber);
			const personName = $('.contact-list-item[data-person-number="' + personNumber + '"]').attr('data-person-name');
			$('#dialogTextName').text(personName);
			$('#btnSendFriendRequest').on('click', homeClicks.onDialogSendFriendRequest);
			$('#btnCancel').on('click', myHome.hideOnsenDialog);
			dialog.show();
		});
	},
	
	onDialogSendFriendRequest() {
		$('.dialog-button').prop('disabled', true);
		$('#errorTextField').text('');
		$('#loadingDialogFriendRequest').show();
		const personNumber = $(this).parents('#dialogSendFriendRequest').attr('data-person-number');
		// tva da se fixne
		// phoneCode taken from previous page
		const phoneCode = $('#pageAddFriend #inputPhoneCode').attr('data-phone-code');
		const formattedPhone = dataValidation.formatPhoneNumber(phoneCode, personNumber);
		myAjax.searchFriend(formattedPhone, response => {
			if (response[0].error) {
				$('#errorTextField').text('' + response[0].error);
				$('#loadingDialogFriendRequest').hide();
				$('.dialog-button').prop('disabled', false);
			} else {
				const user = response[0].user;
				myAjax.sendFriendRequest(user, response => {
					if (response[0].conId) {
						$('.onsen-dialog')[0].hide();
						const buttonElement = $('.btnContactSendFriend[data-person-number="' + personNumber + '"]');
						$(buttonElement).prop('disabled', true);
						$(buttonElement).find('#iconAdd').hide();
						$(buttonElement).find('#iconChecked').show();
						const txt = myTranslations.getTranslation(TXT_FRIEND_REQUEST_SENT);
						myToast.showLong(txt);
						myHome.loadFriends();
					} else {
						$('#errorTextField').text('' + response[0].error);
						$('#loadingDialogFriendRequest').hide();
						$('.dialog-button').prop('disabled', false);
					}
				});
			}
		});
	},
	
	setFriendListItemClicks() {
		$('.friend-item:not(.is-group) .inner-link').on('click', function () {
			const data = {
				userId: $(this).parents('.friend-item').attr('data-user-id')
			};
			myHome.pushPage(PAGE_FRIEND_PROFILE, data);
		});
		$('.friend-item.is-group .inner-link').on('click', function () {
			const data = {
				conId: $(this).parents('.friend-item.is-group').attr('data-con-id'),
				name: $(this).parents('.friend-item.is-group').attr('data-name')
			};
			myHome.pushPage(PAGE_HOME_CHAT, data);
		});
		$('#pageFriends .user-store-link').on('click', function () {
			const data = {
				companyId: this.dataset.companyId
			};
			myHome.pushPage(PAGE_FAVO_VIEW_COMPANY, data);
		});
	},
	
	setRecentListItemClicks() {
		$('.recent-item .inner-link').on('click', function () {
			const data = {
				userId: $(this).parents('.recent-item').attr('data-user-id'),
				conId: $(this).parents('.recent-item').attr('data-con-id'),
				name: $(this).parents('.recent-item').attr('data-name')
			};
			myHome.pushPage(PAGE_HOME_CHAT, data);
		});
		$('.recent-item .inner-link').on('taphold', function () {
			navigator.vibrate(300);
			const chatId = $(this).parents('.recent-item').attr('data-chat-id');
			const conId = $(this).parents('.recent-item').attr('data-con-id');
			ons.createDialog(DIALOG_RECENT_TAPHOLD).then(dialog => {
				homeLocalizations.translateDialogRecentTaphold();
				homeClicks.setDialogRecentTapholdEvents();
				dialog.dataset.chatId = chatId;
				dialog.dataset.conId = conId;
				dialog.show();
			});
		});
		$('.recent-item .user-store-link').on('click', function () {
			const data = {
				companyId: this.dataset.companyId
			};
			myHome.pushPage(PAGE_FAVO_VIEW_COMPANY, data);
		});
	},
	
	setDialogRecentTapholdEvents() {
		$('#liDeleteRecentChat').on('click', () => {
			const chatId = $('#dialogRecentTaphold').attr('data-chat-id');
			const conId = $('#dialogRecentTaphold').attr('data-con-id');
			$('#pageRecent .title-loading').show();
			myAjax.deleteChatHistory(conId, chatId, response => {
				myHome.loadRecentChats();
				myToast.showLong(myTranslations.getTranslation(TXT_CHAT_HISTORY_DELETED));
				$('#pageRecent .title-loading').hide();
			});
			myHome.hideOnsenDialog();
		});
	},
	
	setPageChatForwardMsgEvents() {
		$('#btnTitleForwardMsg').on('click', function () {
			this.disabled = true;
			$('#loadingForwardMsg').show();
			const chatId = $('#pageChatForwardMsg').attr('data-chat-id');
			const selectedFriends = $('.friend-forward-list-item.is-checked');
			let checkedFriendsUserIds = [];
			for (const friend of selectedFriends) {
				checkedFriendsUserIds.push(friend.dataset.userId);
			}
			checkedFriendsUserIds = JSON.stringify(checkedFriendsUserIds);
			myAjax.forwardMsg(chatId, checkedFriendsUserIds, response => {
				$('#loadingForwardMsg').hide();
				myToast.showShort(myTranslations.getTranslation(TXT_MESSAGE_FORWARDED));
				myHome.loadRecentChats();
				myHome.popPage();
			});
		});
		$('.forward-checkbox').on('change', function () {
			if ($('.forward-checkbox :checked').length == 0) {
				$('#btnTitleForwardMsg').prop('disabled', true);
			} else {
				$('#btnTitleForwardMsg').prop('disabled', false);
			}
			const id = $(this).find('input')[0].id;
			if (this.checked == true) {
				$('.friend-forward-list-item[data-user-id="' + id + '"]').addClass('is-checked');
			} else {
				$('.friend-forward-list-item[data-user-id="' + id + '"]').removeClass('is-checked');
			}
			
		});
	},
	
	setPageSendSmsEvents() {
		$('#txtSms').on('input', () => {
			const txt = $('#txtSms').val();
			if (txt) {
				$('#btnSendSms').prop('disabled', false);
			} else {
				$('#btnSendSms').prop('disabled', true);
			}
		});
		$('#btnSendSms').on('click', function () {
			$(this).attr('disabled', true);
			$('#pageSendSms .title-loading').show();
			const number = $('#pageSendSms').attr('data-contact-number');
			const txt = $('#txtSms').val();
			myAjax.sendSmsInvitation(number, txt, response => {
				if (response.sent == 1) {
					const txtSent = myTranslations.getTranslation(TXT_MSG_SENT_SUCCESS);
					myToast.showLong(txtSent);
					$('#pagePhoneContacts').find('ons-button[data-person-number="' + number + '"]').prop('disabled', true);
					myHome.popPage();
				} else {
					$(this).attr('disabled', false);
					myToast.showLong(response.error);
				}
				$('#pageSendSms .title-loading').hide();
			});
		});
	},
	
	onPhoneContactOpenChatClick(element) {
		const data = {
			conId: element.dataset.conId,
			userId: element.dataset.userId,
			name: element.dataset.userName
		};
		myHome.bringPageToTop(PAGE_HOME_CHAT, data);
		
	},
	
	onPhoneContactSendSms(element) {
		const data = {
			personNumber: element.dataset.personNumber
		};
		myHome.pushPage(PAGE_HOME_SMS_INVITE, data);
	}
};


////////////////////////////////////////////////////////////////////////////////
//-------------//----------- Favo Chat Page Clicks ----------//---------------//
////////////////////////////////////////////////////////////////////////////////
const homeChatClicks = {
	
	setPageChatEvents() {
		$('#btnChatSideMenu').on('click', () => {
			$('#sideMenu')[0].open();
		});	
		// http://plugins.telerik.com/cordova/plugin/keyboard
		// To detect when keyboard is opened, so it scrolls to bottom
		window.addEventListener('native.keyboardshow', () => {
			favoChat.scrollToBottom();
		});
		$('#btnOpenRecording').on('click', () => {
            //$('#btnOpenKeyboard').hide();
			if (device.platform == 'Android') {
				myPerms.checkAudioPermissions(status => {
					if (status == true) {
						// all permissions are ok show voice record row
						$('#rowChat').hide();
						$('#rowVoice').show();
					}
				});
			} else {
				$('#rowChat').hide();
				$('#rowVoice').show();
			}
		});
		$('#btnOpenKeyboard').on('click', () => {
			$('#rowVoice').hide();
			$('#rowChat').show();
		});
		
		// http://www.jacklmoore.com/autosize/
		autosize($('#inputMessage'));
		$('#inputMessage').on('input', function () {
			if (this.value) {
				$('#btnMore').hide();
				$('#btnSendMsg').show();
			} else {
				$('#btnMore').show();
				$('#btnSendMsg').hide();
			}
		});
		$('#inputMessage').on('keyup', event => {
			if(event.keyCode == 13){
				$('#btnSendMsg').trigger('click');
			}
		});
		$('#btnMore').on('click', () => {
			favoChat.toggleMorePanel();
			favoChat.scrollToElement($('#morePanel')[0]);
		});
		$('#btnMorePanelCamera').on('click', () => {
			favoChat.takePhoto();
			favoChat.toggleMorePanel();
		});
		$('#btnMorePanelImages').on('click', () => {
			if (device.platform == 'Android') {
				myPerms.checkStoragePermission(status => {
					if (status == true) {
						favoChat.toggleMorePanel();
						myImagePicker.pickImages(MAX_IMAGES_TO_SEND, favoChat.prepareImagesToSend);
					}
				});
			} else {
				favoChat.toggleMorePanel();
				myImagePicker.pickImages(MAX_IMAGES_TO_SEND, favoChat.prepareImagesToSend);
			}
		});
		$('#btnMorePanelFile').on('click', () => {
			$('#inputFileAttachment').trigger('click');
			favoChat.toggleMorePanel();
		});
		$('#inputFileAttachment').on('change', function () {
			favoChat.checkFileToSend(this.files);
		});
		$('#btnRecordSound').on('touchstart', () => {
			$('#slideup-to-cancel').show();
			$('#slideup-to-cancel').addClass('on');
			$('#btnRecordSound').text(myTranslations.getTranslation(TXT_RELEASE_TO_SEND));
			$('#btnRecordSound').addClass('on');
			$('#btnRecordSound').attr('data-sliding-mode', 'slideup-to-cancel');
			favoChat.startSoundRecording();
		});
        $('#btnRecordSound').on('touchmove', () => {
			if ($('#btnRecordSound').attr('data-sliding-mode') != 'not-holded') {
				const touch = event.touches[0];
				const x = touch.clientX;
				const y = touch.clientY;
				const pw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
				const ph = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
				// TODO da se prepravi
				if (!(y - ph > -63)) {
					$('#btnRecordSound').text(myTranslations.getTranslation(TXT_RELEASE_TO_CANCEL));
					$('#slideup-to-cancel').hide();
					$('#slideup-to-cancel').removeClass('on');
					$('#release-to-cancel').show();
					$('#release-to-cancel').addClass('on');
					$('#btnRecordSound').attr('data-sliding-mode', 'release-to-cancel');
				} else {
					$('#btnRecordSound').text(myTranslations.getTranslation(TXT_RELEASE_TO_SEND));
					$('#slideup-to-cancel').show();
					$('#slideup-to-cancel').addClass('on');
					$('#release-to-cancel').hide();
					$('#release-to-cancel').removeClass('on');
					$('#btnRecordSound').attr('data-sliding-mode', 'slideup-to-cancel');
				}
			}
		});
		$('#btnRecordSound').on('touchend', () => {
			if ($('#btnRecordSound').attr('data-sliding-mode') == 'slideup-to-cancel') {
				favoChat.isRecordingStopped = false;
			} else if ($('#btnRecordSound').attr('data-sliding-mode') == 'release-to-cancel') {
				favoChat.isRecordingStopped = true;
			}
			favoChat.completeSoundRecording();
		});
		$('#btnSendMsg').on('click', () => {
			const msg = $('#inputMessage').val();
			const conId = $('#pageChat').attr('data-con-id');
			const localId = new Date().getTime();
			favoChat.insertTempMsg(msg, localId);
			$('#inputMessage').val('');
			$('#inputMessage').focus();
			$('#btnMore').show();
			$('#btnSendMsg').hide();
			myAjax.sendMessage(msg, conId, localId, response => {
				const txtSent = myTranslations.getTranslation(TXT_SENT);
				$('.msg-list-item[data-local-id="' + response.localId + '"] .status').text(txtSent);
			});
		});
		$('#btnScrollBottom').on('click', favoChat.scrollToBottom);
	},
	
	onFileMsgItemClick(url) {
		const target = '_system';
		const options = 'location=yes,hidden=yes';
		cordova.InAppBrowser.open(url, target, options);
	},
	
	onImgElementClick(elem) {
		const dataset = elem.dataset;
		let images = {};
		let index = 0;
		do {
			let obj = {};
			obj[0] = dataset['imgSrc-' + index];
			obj[1] = dataset['imgThumbSrc-' + index];
			images[index] = obj;
			index++;
		} while (dataset['imgSrc-' + index]);
		myHome.pushPage(PAGE_IMG_GALLERY, images, 'fade');
	},
	
	onChatAvatarClick(elem) {
		const userId = elem.dataset.userId;
		if (userId == myHome.currentUserId) {
			myHome.pushPage(PAGE_PROFILE);
		} else {
			const data = {
				userId: userId
			};
			myHome.bringPageToTop(PAGE_FRIEND_PROFILE, data);
		}
	},
	
	onChatProfileLinkClick() {
		const userId = this.dataset.userId;
		if (userId == myHome.currentUserId) {
			myHome.pushPage(PAGE_PROFILE);
		} else {
			const data = {
				userId: userId
			};
			myHome.bringPageToTop(PAGE_FRIEND_PROFILE, data);
		}
		return false;
	},
	
	setChatSideEvents() {
		$('.chat-side-list-item.friend').on('click', function () {
			const data = {
				userId: this.dataset.userId
			};
			myHome.bringPageToTop(PAGE_FRIEND_PROFILE, data);
			$('#sideMenu')[0].close();
		});
		$('#sideAddFriends').on('click', () => {
			const data = {
				conId: $('#pageChat').attr('data-con-id')
			};
			myHome.pushPage(PAGE_ADD_FRIENDS_TO_GROUP, data);
		});
		$('#sideLeaveGroup').on('click', () => {
			
		});
		$('#sideDeleteChat').on('click', () => {
			ons.createAlertDialog(DIALOG_DELETE_CHAT_HISTORY).then(dialog => {
				homeLocalizations.translateDialogDeleteChatHistory();
				$('#dialogDeleteChatHistory #btnDeleteHistory').on('click', homeChatClicks.onDeleteChatHistoryClick);
				$('#dialogDeleteChatHistory #btnCancel').on('click', myHome.hideOnsenDialog);
				dialog.show();
			});
		});
		$('#sideUserProfile').on('click', () => {
			myHome.pushPage(PAGE_PROFILE);
			$('#sideMenu')[0].close();
		});
		$('#sideViewFriendShop').on('click', function () {
			const data = {
				companyId: this.dataset.companyId
			};
			myHome.pushPage(PAGE_FAVO_VIEW_COMPANY, data);
			$('#sideMenu')[0].close();
		});
	},
	
	onDeleteChatHistoryClick() {
		myHome.hideOnsenDialog();
		const conId = $('#pageChat').attr('data-con-id');
		myAjax.deleteChatHistory(conId, favoChat.newestMsg, response => {
			myToast.showLong(myTranslations.getTranslation(TXT_CHAT_HISTORY_DELETED));
			myHome.loadRecentChats();
			$('#chatWindow').empty();
		});
	},
	
	onChatOrderLinkClick() {
		const data = {
			orderId: this.dataset.orderid
		};
		myHome.pushPage(PAGE_FAVO_ORDER_DETAILS, data);
		return false;
	},
	
	onSideNotificationClick(element) {
		$('#sideMenu')[0].close();
		$('#chatWindow').off('scroll');
		favoChat.initChatPage(element.dataset);
		favoChat.loadChatHistory(element.dataset.conId);
	},
	
	onChatMsgTaphold(element) {
		const elementUserId = element.currentTarget.dataset.userId;
		const elementChatId = element.currentTarget.dataset.chatId;
		ons.createDialog(DIALOG_CHAT_TAPHOLD).then(dialog => {
			// Remove "Delete" option if msg is not yours
			if (elementUserId != myHome.currentUserId) {
				$('#dialogChatTaphold #dialogItemDelete').remove();
			}
			// Remove "Copy to clipboard" option if msg is not text
			if (!$(element.currentTarget).hasClass('section-message')) {
				$('#dialogChatTaphold #dialogItemCopy').remove();
			}
			homeLocalizations.translateChatTapholdDialog();
			navigator.vibrate(50);
			dialog.dataset.chatId = elementChatId;
			dialog.show();
		});
	},
	
	onDialogTapholdForward() {
		const data = {
			chatId: $('#dialogChatTaphold').attr('data-chat-id')
		};
		myHome.pushPage(PAGE_CHAT_FORWARD_MSG, data);
		myHome.hideOnsenDialog();
	},
	
	onDialogTapholdDelete() {
		const chatId = $('#dialogChatTaphold').attr('data-chat-id');
		myAjax.deleteChatMsg(chatId, response => {
			if (response[0].reqOK != 1) {
				myToast.showShort('Failed to delete message');
			}
		});
		myHome.hideOnsenDialog();
	},
	
	onDialogTapholdCopy() {
		const chatId = $('#dialogChatTaphold').attr('data-chat-id');
		const text = $('.msg-list-item[data-chat-id="' + chatId + '"] .fL').text();
		myClipboard.copyText(text);
		myToast.showShort(myTranslations.getTranslation(TXT_COPIED_CLIPBOARD));
		myHome.hideOnsenDialog();
	},
	
	onAudioMessageElementClick() {
		// click event is on inner audio element
		// "on" class must be set on the msg-list-item parent
		const msgListItem = $(this).parents('.section-audio');
		if (!msgListItem.hasClass('on')) {
			msgListItem.addClass('on');
		}
	},
	
	onAudioPlaying() {
		// select play button of audio
		$(this).siblings('.audioplayer-playpause').addClass('on');
	},
	
	onAudioEnded() {
		// select play button of audio
		$(this).siblings('.audioplayer-playpause').removeClass('on');
	}
};