// CONTENTS //
// cordovaEvents - Cordova specific event handlers
// onsenEvents - OnsenUI event handlers
// myHome - functions for common Home tasks
// homeLocalizations - page translations

$(() => {
	document.addEventListener('deviceready', cordovaEvents.onDeviceReady);
});

const cordovaEvents = {
	
    onDeviceReady() {
		document.addEventListener('backbutton', cordovaEvents.onBackButton);
		document.addEventListener('resume', cordovaEvents.onResume);
		document.addEventListener('init', onsenEvents.onInitEvent);
		document.addEventListener('show', onsenEvents.onShowEvent);
		document.addEventListener('preshow', onsenEvents.onPreShowDialog);
		document.addEventListener('posthide', onsenEvents.onPostHideDialog);
		document.addEventListener('postclose', onsenEvents.onPostCloseSideMenu);
		document.addEventListener('postpush', onsenEvents.onPostPushPage);
		document.addEventListener('postchange', onsenEvents.onPostChangeTab);
		webConnection.checkInternet(() => {
			if (myStorage.isLoggedIn() && myStorage.getCurrentUserId()) {
				myHome.currentUserId = myStorage.getCurrentUserId();
				myAjax.setupAjax();
				myPush.initPush();
				pubNub.initService();
				ons.forcePlatformStyling('android');
				myHome.pushPage(PAGE_HOME_MAIN);
			} else {
				window.location = PAGE_LOGIN;
			}
		});
    },
	
	onBackButton() {
		// For closing lightGallery with Back button
		if (myHome.visiblePage == 'pageImageGallery' || myHome.visiblePage == 'subPageChat') {
			$('.lg-close').trigger('click');
		}
	},
	
	onResume() {
		if (device.platform == 'Android') {
			window.FirebasePlugin.clearAll();
		}
		myHome.loadRecentChats(() => {
			myHome.loadHomeNotifications();
		});
	}
};

const onsenEvents = {
	
	onInitEvent(event) {
		const page = event.target.id;
		if (page == 'pageHome') {
			homeClicks.setHomeSwipeEvent();
			myTranslations.loadTranslations(() => {
				homeLocalizations.translateHomeTabs();
			});
		} else if (page == 'pageRecent') {
			// Added because of bug in Onsen
			const pageInitialized = $('#pageRecent').attr('data-initialized');
			if (pageInitialized != 1) {
				homeLocalizations.translatePageRecent();
				$('#pageRecent').attr('data-initialized', 1);
				myHome.loadRecentChats();
				navigator.splashscreen.hide();
			}
		} else if (page == 'pageFriends') {
			// Added because of bug in Onsen
			const pageInitialized = $('#pageFriends').attr('data-initialized');
			if (pageInitialized != 1) {
				$('#pageFriends').attr('data-initialized', 1);
				homeLocalizations.translatePageFriends();
				homeClicks.setPageFriendsClicks();
				myHome.loadFriends(() => {
					myHome.loadHomeNotifications(() => {
						$('#pageFriends .title-loading').hide();
					});
				});
			}
		} else if (page == 'pageFavoSite') {
			// Added because of bug in Onsen
			const pageInitialized = $('#pageFavoSite').attr('data-initialized');
			if (pageInitialized != 1) {
				$('#pageFavoSite').attr('data-initialized', 1);
				favoPages.initPageFavoSite();
			}
		} else if (page == 'pageHomeProfile') {
			const pageInitialized = $('#pageHomeProfile').attr('data-initialized');
			if (pageInitialized != 1) {
				homeClicks.setPageHomeProfileClicks();
				homeLocalizations.translatePageHomeProfile();
				$('#homeProfileImg').attr('src', myStorage.getUserAvatar());
				$('#homeProfileName').text(myStorage.getUserFullName());
				const qrUrl = FAVO_QR_URL + myHome.currentUserId + '.png';
				$('#btnProfileQR').attr('data-img-src', qrUrl);
				$('#pageHomeProfile').attr('data-initialized', 1);
			}
		} else if (page == 'pageImageGallery') {
			homeLocalizations.translatePageImageGallery();
			homeClicks.setDownloadAllImagesButton();
			const images = event.target.data;
			let imgList = '';
			$.each(images, (key, item) => {
				const imageItem = appender.getGalleryImageItem(item[0], item[1]);
				imgList += imageItem;
			});
			$('#lightgallery').append(imgList);
			myLightGallery.loadGallery('#lightgallery');
		}  else if (page == 'pageProfile') {
			homeClicks.setPageProfileClicks();
			homeLocalizations.translatePageProfile();
			myHome.loadCurrentUserProfile();
		} else if (page == 'pageProfileEdit') {
			homeClicks.setPageProfileEditClicks();
			homeLocalizations.translatePageEditProfile();
			$('#pageProfileEdit .title-loading').hide();
		} else if (page == 'pageCreateGroup') {
			$('#pageCreateGroup .title-loading').show();
			homeLocalizations.translatePageCreateGroup();
			myAjax.requestFriends(response => {
				let friendsToCreateGroup = '';
				friendsToCreateGroup += appender.getFriendToCreateGroup();
				for (const friend of response) {
					// Only accepted friends who are not a group, and not official account
					if (friend.accepted == 1 && friend.confirmRequest == 0 && friend.isGroup == '' && !friend.official) {
						friendsToCreateGroup += appender.getFriendToCreateGroup(friend);
					}
				}
				$('#listFriendsToAdd').append(friendsToCreateGroup);
				homeClicks.setPageCreateGroupEvents();
				$('#pageCreateGroup .title-loading').hide();
			});
		} else if (page == 'pageAddFriendsToGroup') {
			$('#pageAddFriendsToGroup .title-loading').show();
			homeLocalizations.translatePageAddFriendsToGroup();
			const conId = event.target.data.conId;
			$('#pageAddFriendsToGroup').attr('data-con-id', conId);
			myAjax.getFriendsToAddToGroup(conId, response => {
				let friendsToAddToGroup = '';
				for (const friend of response) {
					friendsToAddToGroup += appender.getFriendToCreateGroup(friend);
				}
				$('#listFriendsToAdd').append(friendsToAddToGroup);
				
				
				homeClicks.setPageAddFriendsToGroupEvents();
				$('#pageAddFriendsToGroup .title-loading').hide();
			});
			
			
			
		} else if (page == 'pageChat') {
			// Initial data loading for smoother transition
			homeLocalizations.translatePageChat();
			const data = event.target.data;
			favoChat.initChatPage(data);
			homeChatClicks.setPageChatEvents();
		} else if (page == 'pageChatForwardMsg') {
			homeLocalizations.translatePageChatForwardMsg();
			const chatId = event.target.data.chatId;
			$('#pageChatForwardMsg').attr('data-chat-id', chatId);
			myAjax.requestFriends(response => {
				let listFriendsToForward = '';
				for (const friend of response) {
					listFriendsToForward += appender.getFriendToForwardMsgItem(friend);
				}
				$('#listForwardToFriends').append(listFriendsToForward);
				homeClicks.setPageChatForwardMsgEvents();
				$('#pageChatForwardMsg .title-loading').hide();
			});
		} else if (page == 'pageSettings') {
			homeLocalizations.translatePageSettings();
			$('#imgFlag').attr('src', myStorage.getLanguageFlag());
			homeClicks.setPageSettingsClicks();
		} else if (page == 'pageLanguage') {
			$('#pageLanguage .title-loading').show();
			homeLocalizations.translatePageLanguage();
			myAjax.getLanguages(response => {
				let langList = '';
				for (const item of response) {
					langList += appender.getLanguageItem(item);
				}
				$('#listLanguages').append(langList);
				homeClicks.setLanguageItemsClicks();
				$('#pageLanguage .title-loading').hide();
			});
		} else if (page == 'pageFriendProfile') {
			// passed on from previous page
			const userId = event.target.data.userId;
			homeClicks.setPageFriendProfileEvents();
			homeLocalizations.translatePageFriendProfile();
			myHome.loadFriendProfile(userId);
		} else if (page == 'pageAddFriend') {
			homeLocalizations.translatePageAddFriend();
			homeClicks.setPageAddFriendClicks();
			const countryPhoneCode = myStorage.getUserCountryPhoneCode();
			const countryName = myStorage.getUserCountryName();
			let inputEntry = countryName + ' (+' + countryPhoneCode + ')';
			$('#inputPhoneCode').val(inputEntry);
			$('#inputPhoneCode').attr('data-phone-code', countryPhoneCode);
		} else if (page == 'pagePhoneContacts') {
			$('#pagePhoneContacts .title-loading').show();
			homeLocalizations.translatePagePhoneContacts();
			homeClicks.setSearchContactsInput();
			myPhoneContacts.loadContacts();
		} else if (page == 'pageSendSms') {
			$('#pageSendSms .title-loading').show();
			homeLocalizations.translatePageSendSms();
			homeClicks.setPageSendSmsEvents();
			const personNumber = event.target.data.personNumber;
			$('#textSmsNumber').text('+' + personNumber);
			$('#pageSendSms').attr('data-contact-number', personNumber);
			myAjax.getSmsInviteText(response => {
				$('#textSmsTextContent').text(response[0].text);
				$('#pageSendSms .title-loading').hide();
			});
		} else if (page == 'pageCountry') {
			$('#pageCountry .title-loading').show();
			homeLocalizations.translatePageCountry();
			const pageData = event.target.data;
			$('#pageCountry').attr('data-input-element', pageData.inputElement);
			$('#pageCountry').attr('data-city-input-element', pageData.cityInputElement);
			myCountries.getCountriesList(countriesObj => {
				let countriesList = '';
				for (const country of countriesObj) {
					countriesList += appender.getCountryItem(country);
				}
				$('#listCountries').append(countriesList);
				homeClicks.setPageCountryEvents();
				$('#pageCountry .title-loading').hide();
			});
		} else if (page == 'pageFavoSiteMyStore') {
			favoPages.initPageMyStore();
		} else if (page == 'pageFavoSiteFavorites') {
			favoPages.initPageFavorites();
		} else if (page == 'pageFavoSiteStatistics') {
			favoPages.initPageStatistics();
		} else if (page == 'pageFavoSiteSearch') {
			favoPages.initPageSearch();
		} else if (page == 'pageFavoSiteSearchResults') {
			favoPages.initPageSearchResults(event.target.data);
		} else if (page == 'pageFavoSiteCountries') {
			favoPages.initPageFavoCountries();
		} else if (page == 'pageFavoReg') {
			favoPages.initPageFavoReg();
		} else if (page == 'pageFavoCities') {
			favoPages.initPageFavoCities(event.target.data);
		} else if (page == 'pageFavoCurrencies') {
			favoPages.initPageFavoCurrencies(event.target.data.inputElement);
		} else if (page == 'pageFavoSiteTimeline') {
			favoPages.initPageTimeline();
		} else if (page == 'pageFavoRegMerchantType') {
			favoPages.initPageFavoRegMerchantType();
		} else if (page == 'pageFavoRegMerchantCategories') {
			favoPages.initPageFavoRegCategories();
		} else if (page == 'pageFavoSiteMyCompany') {
			favoPages.initPageMyCompany();
		} else if (page == 'pageFavoSiteAddGroup') {
			favoPages.initPageAddGroup();
		} else if (page == 'pageFavoSiteEditProduct') {
			favoPages.initPageEditProduct(event.target.data.itemId);
		} else if (page == 'pageFavoSiteEditProductImages') {
			favoPages.initPageEditProductImages(event.target.data.itemId);
		} else if (page == 'pageFavoSiteViewCompany') {
			favoPages.initPageViewCompany(event.target.data.companyId);
		} else if (page == 'pageFavoSiteViewProduct') {
			favoPages.initPageViewProduct(event.target.data.productId);
		} else if (page == 'pageFavoSiteMeasure') {
			favoPages.initPageMeasure();
		} else if (page == 'pageFavoSiteCart') {
			favoPages.initPageCart();
		} else if (page == 'pageFavoSiteDeliveries') {
			favoPages.initPageDeliveries();
		} else if (page == 'pageFavoSiteOrders') {
			favoPages.initPageOrders();
		} else if (page == 'pageFavoSitePayment') {
			favoPages.initPagePayment();
		} else if (page == 'pageFavoSiteOrderDetails') {
			favoPages.initPageOrderDetails(event.target.data.orderId);
		} else if (page == 'pageFavoSiteProducts') {
			favoPages.initPageProducts();
		} else if (page == 'pageFavoSiteDeliveryDetails') {
			favoPages.initPageDeliveryDetails(event.target.data.deliveryId);
		} else if (page == 'pageFavoSiteSendEnquiry') {
			favoPages.initPageSendEnquiry(event.target.data);
		} else if (page == 'pageFavoSiteCompanyGallery') {
			favoPages.initPageCompanyGallery(event.target.data.companyId);
		} else if (page == 'pageFavoSendPdfEmail') {
			favoPages.initPageSendPdfEmail(event.target.data);
		} else if (page == 'pageFavoSiteEditGroup') {
			favoPages.initPageEditGroup(event.target.data);
		} else if (page == 'pageFavoSitePrices') {
			favoPages.initPagePrices();
		}
	},
	
	onShowEvent(event) {
		const page = event.target.id;
		if (page == 'pageChat') {
			const data = event.target.data;
			const loaded = $('#pageChat').attr('data-chat-loaded');
			const currentConId = $('#pageChat').attr('data-con-id');
			const incomingConId = data.conId;
			if (loaded == 0) {
				favoChat.loadChatHistory(incomingConId);
			} else if (loaded == 1 && currentConId != incomingConId) {
				// reload chat page
				favoChat.initChatPage(data);
				favoChat.loadChatHistory(incomingConId);
			}
		} else if (page == 'pageFavoSiteOrders') {
			favoPages.loadPageOrders();
		}
		myHome.visiblePage = page;
	},
	
	onPostPushPage(event) {
		if (event.enterPage.id == 'pageFavoSiteViewCompany' && event.leavePage.id == 'pageFriendProfile') {
			$('#pageFriendProfile').remove();
			$('#pageChat').remove();
			$('#homeTabBar')[0].setActiveTab(2);
		}
	},
	
	onPreShowDialog(event) {
		const dialog = event.target.id;
		if (dialog == 'dialogError') {
			homeDialogClicks.setCloseButtonClick(dialog);
		}
	},
	
	onPostHideDialog(event) {
		event.target.remove();
	},
	
	onPostCloseSideMenu() {
		$('#sideMenu #noNotifHeader').show();
		$('#sideMenu #sideNotifList').empty();
	},
	
	onPostChangeTab() {
		//debugger;
		if ($('#headerFriendRequests').attr('data-expanded') == 1) {
			$('#headerFriendRequests').trigger('click');
		}
		if ($('#btnTopMenu').hasClass('on')) {
			$('#btnTopMenu').trigger('click');
		}
	}
};


/**-------------------------------- myHome ----------------------------------**/
const myHome = {
	
	visiblePage: '',
	
	currentUserId: '',
		
	isAppInitialized: false,
		
	/** Onsen Navigator Functions **/
	pushPage(page, pageData, animation) {
		const navigator = $('#homeNavigator')[0];
		navigator.pushPage(page, {
			animation: animation,
			data: pageData
		});
	},
	
	replacePage(page, pageData, animation) {
		const navigator = $('#homeNavigator')[0];
		navigator.replacePage(page, {
			data: pageData,
			animation: animation
		});
	},
	
	popPage() {
		const navigator = $('#homeNavigator')[0];
		navigator.popPage();
	},
	
	bringPageToTop(page, data) {
		const navigator = $('#homeNavigator')[0];
		navigator.bringPageTop(page, {
			data: data
		});
	},
	
	showOnsenError(error) {
		ons.createAlertDialog(DIALOG_ONSEN_ERROR).then(dialog => {
			$('#dialogTitle').text('Error');
			$('#dialogText').text(error);
			dialog.show();
		});	
	},
	
	hideOnsenDialog() {
		if ($('.onsen-dialog')[0]) {
			$('.onsen-dialog')[0].hide();
		}
	},
	
	loadRecentChats(finalCallback) {
		let cachedRecentsJson;
		
		const loadRecentsListFunc = function (recents) {
			let recentChats = '';
			for (const item of recents) {
				recentChats += appender.getRecentMsgSnippet(item);
			}
			$('#listRecent').html(recentChats);
			homeClicks.setRecentListItemClicks();
		};
		
		const getRecentsFromServerFunc = function (callback) {
			myAjax.getRecentMessages(response => {
				if (!response[0].error) {
					if (!myHome.isAppInitialized) {
						let currentNewestChatId = '';
						const serverNewestChatId = response[0].chatId;
						if (cachedRecentsJson && cachedRecentsJson[0].chatId) {
							currentNewestChatId = cachedRecentsJson[0].chatId;
						}
						if (currentNewestChatId != serverNewestChatId) {
							myStorage.setCacheRecentChats(JSON.stringify(response));
							loadRecentsListFunc(response);
						}
					} else {
						myStorage.setCacheRecentChats(JSON.stringify(response));
						loadRecentsListFunc(response);
					}
				}
				myHome.isAppInitialized = true;
				if (callback) {
					callback();
				}
			});
		};
		
		if (!myHome.isAppInitialized) {
			// try to load from cache first
			const cacheRecents = myStorage.getCacheRecentChats();
			if (cacheRecents) {
				cachedRecentsJson = JSON.parse(cacheRecents);
				loadRecentsListFunc(cachedRecentsJson);
				if (finalCallback) {
					finalCallback();
				}
				getRecentsFromServerFunc();
			} else {
				getRecentsFromServerFunc(finalCallback);
			}
		} else {
			// app already initialized, get data only from server
			getRecentsFromServerFunc(finalCallback);
		}
		
	},

	loadFriends(callback) {
		$('#pageFriends .title-loading').show();
		myAjax.requestFriends(response => {
			if (response.length > 0) {
				let pendingFriends = '';
				let friends = '';
				let groups = '';
				for (const friend of response) {
					const listItem = appender.getFriendListItem(friend);
					if (friend.accepted == 1 && !friend.isGroup) {
						friends += listItem;
					} else if (friend.accepted == 1 && friend.isGroup == 1) {
						groups += listItem;   
					} else if (friend.accepted == 0) {
						pendingFriends += listItem;
					}
				}
				if (pendingFriends) {
					$('#headerFriendRequests').show();
					$('#headerFriendRequests').removeClass('is-hidden');
					$('#listFriendRequests').html(pendingFriends);
					$('.friend-requests-field').show();
					const numFriendRequests = $('#listFriendRequests .friend-item').length;
					$('#headerFriendRequests .notification').text(numFriendRequests);
				} else {
					$('#labelFriends').hide();
					$('#headerFriendRequests').hide();
					$('#headerFriendRequests').addClass('is-hidden');
					$('#listFriendRequests').hide();
					$('#listFriendRequests').empty();
					$('.friend-requests-field').hide();
					$('.friend-requests-field').addClass('hide');
				}
				if (groups) {
					$('#labelGroups').show();
					$('#labelGroups').removeClass('is-hidden');
					$('#listGroups').html(groups);
				} else {
					$('#labelGroups').addClass('is-hidden');
				}
				if (friends) {
					if (pendingFriends || groups) {
						$('#labelFriends').show();
						$('#labelFriends').removeClass('is-hidden');
					} else if (!pendingFriends && !groups) {
						$('#labelFriends').addClass('is-hidden');
					}
					$('#listFriends').html(friends);
					// For placing official account on the last position in Friends
					const favoAccount = $('#listFriends').find('.official-account')[0];
					if (favoAccount) {
						$('#listFriends').append(favoAccount.outerHTML);
						favoAccount.remove();
					}
				} else {
					$('#labelFriends').addClass('is-hidden');
				}
				homeClicks.setFriendListItemClicks();
			} else {
				$('#labelFriends').hide();
				$('#labelGroups').hide();
				$('#headerFriendRequests').hide();
			}
			if (callback) {
				callback();
			}
			$('#pageFriends .title-loading').hide();
		});
	},
	
	loadFriendProfile(userId) {
		$('#pageFriendProfile .title-loading').show();
		myAjax.getUserInfo(userId, response => {
			const user = response[0];
			if (user) {
				const confirmRequest = user.confirmRequest;
				if (confirmRequest == 0) {
					//** Not Friends and no requests **//
					$('.friend-profile-button').hide();
					$('#btnTitleFriendMore').hide();
					$('#btnSendFriendRequest').show();
				} else if (confirmRequest == 1) {
					//** Sent Friend Request **//
					$('.friend-profile-button').hide();
					$('#btnTitleFriendMore').hide();
					$('#btnCancelFriendRequest').show();
				} else if (confirmRequest == 2) {
					//** Received Friend Request **//
					$('.friend-profile-button').hide();
					$('#btnTitleFriendMore').hide();
					$('#btnAcceptFriendRequest').show();
					$('#btnDenyFriendRequest').show();
				} else if (confirmRequest == 3) {
					//** Already Friends **//
					$('.friend-profile-button').hide();
					$('#btnTitleFriendMore').show();
				}
				$('.friend-profile-button').attr('disabled', false);
				$('#pageFriendProfile .title-label').text(user.userFullName);
				$('#pageFriendProfile').attr('data-user-id', user.user);
				$('#pageFriendProfile').attr('data-con-id', user.conId);	
				$('#friendAvatar').attr('src', user.avatar);
				$('#friendFullName').text(user.userFullName);
				$('#friendCountry').text(user.countryName);
				$('#friendCountry').attr('data-country-code', user.countryCode);
				$('#friendCustomName').val(user.userFullNameChanged);
				$('#friendComment').val(user.userComment);
				// to fix empty space in bottom because of hidden toolbar
				$('#pageFriendProfile').removeClass('page-with-bottom-toolbar');
				if (user.isOfficial) {
					$('#barItemCallFriend').hide();
					$('#barItemUserCompany').hide();
					$('#barItemOpenChat').addClass('only-child');
				} else if (user.compId == 0) {
					$('#barItemUserCompany').hide();
				} else {
					$('#barItemUserCompany').show();
					$('#barItemOpenChat').removeClass('only-child');
					$('#btnUserCompany').attr('data-comp-id', user.compId);
					$('#btnUserCompany').on('click', favoClicks.onCompanyClick);
				}
			}
			$('#pageFriendProfile .title-loading').hide();
		});
	},
	
	loadHomeNotifications(finalCallback) {
		myAjax.loadHomeNotifications(response => {
			const notifications = response.notifications;
			if (notifications) {
				let unreadChats = notifications.unreadChats;
				let pendingFriendRequests = notifications.pendingFriendRequests;
				if (unreadChats == 0) {
					unreadChats = '';
				}
				if (pendingFriendRequests == 0) {
					pendingFriendRequests = '';
				}
				if (notifications.favo360) {
					let notifFavoTotal = notifications.favo360.numDocs;
					let notifFavoOrders = notifications.favo360.inOrder;
					let notifFavoCart = notifications.favo360.inCart;
					if (notifFavoTotal == 0) {
						notifFavoTotal = '';
					}
					if (notifFavoOrders == 0) {
						notifFavoOrders = '';
					}
					if (notifFavoCart == 0) {
						notifFavoCart = '';
					}
					$('#tabFavo .notification').text(notifFavoTotal);
					$('#notificationFavoMenu').text(notifFavoTotal);
					$('#liOrders .notification').text(notifFavoOrders);
					$('#liCart .notification').text(notifFavoCart);
				}
				// if explicitly empty string - no subscription ever
				if (notifications.news === '') {
					myPush.subscribeToTopic('timeline');
					myPush.subscribeToTopic('newsfeed');
					myAjax.updateNewsfeedSubscription(1, response => {
						// da se testva
					});
				} else {
					if (notifications.news == 1) {
						// subscribed
						myStorage.setNewsfeedSubscription(1);
					} else {
						// unsubscribed
						myStorage.setNewsfeedSubscription(0);
					}
				}
				$('#tabRecents .notification').text(unreadChats);
				$('#tabFriends .notification').text(pendingFriendRequests);
				const localLanguageVersion = myStorage.getLanguageVersion();
				if (localLanguageVersion !== notifications.langVersion) {
					myTranslations.getNewTranslations(() => {
						homeLocalizations.translateHomeTabs();
						if (finalCallback) {
							finalCallback();
						}
					});
				} else {
					if (!myTranslations.translator[1]) {
						myTranslations.loadTranslations(() => {
							homeLocalizations.translateHomeTabs();
							finalCallback();
						});
					} else {
						if (finalCallback) {
							finalCallback();
						}
					}
				}
			} else {
				if (finalCallback) {
					finalCallback();
				}
			}
		});
	},

	loadCurrentUserProfile() {
		$('#pageProfile .title-loading').show();
		myAjax.getCurrentUserInfo(myHome.currentUserId, response => {
			const userData = response[0];
			if (userData) {
				$('#profileAvatar').attr('src', userData.avatar);
				$('#userCountry').text(userData.countryName);
				$('#userCountry').attr('data-country-code', userData.countryCode);
				$('#userCountryPhoneCode').text(userData.countryPhoneCode);
				$('#userPhone').text(userData.userPhone);
				$('#userFullName').text(userData.userFullName);
				const avatar = userData.avatar.split('/').pop();
				if (avatar == 'avatar.png') {
					$('.edit-icon').show();
				} else {
					$('.edit-icon').hide();
				}
				myStorage.updateUserData(userData);
				$('#homeProfileImg').attr('src', userData.avatar);
			}
			$('#pageProfile .title-loading').hide();
		});
	},
	
	updateBottomCartNotification() {
		myAjax.getCartItemsNumber(response => {
			let notifCart = response.inCart;
			if (notifCart == 0) {
				notifCart = '';
			}
			$('.cart-notification').text(notifCart);
		});
	},
	
	logOutUser() {
		myStorage.clearUserData();
		myAjax.logOutUser(myHome.currentUserId, () => {
			window.location = PAGE_LOGIN;
		});
	}
};

const homeLocalizations = {
	
	// Initial translations with the 4 main tabs
	translateHomeTabs() {
		$('#tabHomeProfile .label').text(myTranslations.getTranslation(TXT_MY_PROFILE));
		$('#tabRecents .label').text(myTranslations.getTranslation(TXT_CHATS));
		$('#tabFriends .label').text(myTranslations.getTranslation(TXT_FRIENDS));
		$('#tabFavo .label').text(myTranslations.getTranslation(TXT_FAVO_360));
	},
	
	translatePageRecent() {
		$('#pageRecent .title-label').text(myTranslations.getTranslation(TXT_RECENTS));
	},
	
	translatePageFriends() {
		$('#labelTitleFriends').text(myTranslations.getTranslation(TXT_FRIENDS));
		$('#labelFriends').text(myTranslations.getTranslation(TXT_FRIENDS));
		$('#labelGroups').text(myTranslations.getTranslation(TXT_GROUPS));
		$('#headerFriendRequests .label').text(myTranslations.getTranslation(TXT_FRIEND_REQUESTS));
		$('#liAddFriend .label').text(myTranslations.getTranslation(TXT_ADD_FRIEND));
		$('#liCreateGroup .label').text(myTranslations.getTranslation(TXT_CREATE_GROUP));
		$('#inputSearchFriends').attr('placeholder', myTranslations.getTranslation(TXT_SEARCH_FRIENDS));
	},
	
	translatePageHomeProfile() {
		$('#pageHomeProfile .title-label').text(myTranslations.getTranslation(TXT_MY_PROFILE));
		$('#labelSettings').text(myTranslations.getTranslation(TXT_SETTINGS));
		$('#labelSupport').text(myTranslations.getTranslation(TXT_CONTACT_SUPPORT));
	},
	
	translatePageProfile() {
		$('#pageProfile .title-label').text(myTranslations.getTranslation(TXT_MY_PROFILE));
		$('#labelUserFullName').text(myTranslations.getTranslation(TXT_FULL_NAME));
		$('#labelUserCountry').text(myTranslations.getTranslation(TXT_COUNTRY));
		$('#labelUserCountryPhoneCode').text(myTranslations.getTranslation(TXT_CODE));
		$('#labelUserPhone').text(myTranslations.getTranslation(TXT_PHONE_NUMBER));
		$('#btnProfileLogout').text(myTranslations.getTranslation(TXT_LOG_OUT));
	},
	
	translatePageCountry() {
		$('#inputSearchCountry').attr('placeholder', myTranslations.getTranslation(TXT_SEARCH));
	},
	
	translatePageEditProfile() {
		$('#pageProfileEdit .title-label').text(myTranslations.getTranslation(TXT_EDIT_PROFILE));
		$('#inputOldPass').attr('placeholder', myTranslations.getTranslation(TXT_OLD_PASS));
		$('#inputNewPass').attr('placeholder', myTranslations.getTranslation(TXT_NEW_PASS));
		$('#inputNewPassAgain').attr('placeholder', myTranslations.getTranslation(TXT_CONFIRM_PASS));
		$('#btnSendNewPass').text(myTranslations.getTranslation(TXT_SAVE));
	},
	
	translatePageFriendProfile() {
		$('#btnUpdateFriendProfile').text(myTranslations.getTranslation(TXT_SAVE));
		$('#labelFriendFullName').text(myTranslations.getTranslation(TXT_FULL_NAME));
		$('#labelFriendCountry').text(myTranslations.getTranslation(TXT_COUNTRY));
		$('#friendCustomName').attr('placeholder', myTranslations.getTranslation(TXT_CUSTOM_NAME));
		$('#friendComment').attr('placeholder', myTranslations.getTranslation(TXT_COMMENT));
		$('#btnSendFriendRequest').text(myTranslations.getTranslation(TXT_BTN_SEND_FRIEND_REQUEST));
		$('#btnAcceptFriendRequest').text(myTranslations.getTranslation(TXT_BTN_ACCEPT_FRIEND_REQUEST));
		$('#btnDenyFriendRequest').text(myTranslations.getTranslation(TXT_BTN_DENY_FRIEND_REQUEST));
		$('#btnCancelFriendRequest').text(myTranslations.getTranslation(TXT_BTN_CANCEL_FRIEND_REQUEST));
	},
	
	translatePageSettings() {
		$('#pageSettings .title-label').text(myTranslations.getTranslation(TXT_SETTINGS));
		$('#liChangeLanguage .label').text(myTranslations.getTranslation(TXT_LANGUAGE));
	},
	
	translatePageLanguage() {
		$('#pageLanguage .title-label').text(myTranslations.getTranslation(TXT_LANGUAGE));
	},
	
	translatePageAddFriend() {
		$('#pageAddFriend .title-label').text(myTranslations.getTranslation(TXT_ADD_CONTACT));
		$('#inputPhoneCode').attr('placeholder', myTranslations.getTranslation(TXT_CODE));
		$('#inputPhoneNumber').attr('placeholder', myTranslations.getTranslation(TXT_PHONE_NUMBER));
		$('#btnSearchFriend').text(myTranslations.getTranslation(TXT_SEARCH));
		$('#btnOpenContacts').text(myTranslations.getTranslation(TXT_PHONE_CONTACTS));
		$('#btnSendRequest').text(myTranslations.getTranslation(TXT_SEND_FRIEND_REQUEST));
	},
	
	translatePageChat() {
		$('#inputMessage').attr('placeholder', myTranslations.getTranslation(TXT_TYPE_MSG));
		$('#btnRecordSound').text(myTranslations.getTranslation(TXT_HOLD_TO_TALK));
		$('#sideViewFriendShop .label').text(myTranslations.getTranslation(TXT_VIEW_STORE));
		$('#btnMorePanelFile .label').text(myTranslations.getTranslation(TXT_SEND_FILE));
		$('#btnMorePanelImages .label').text(myTranslations.getTranslation(TXT_PHOTO_GALLERY));
		$('#btnMorePanelCamera .label').text(myTranslations.getTranslation(TXT_TAKE_PHOTO));
		$('#sideAddFriends .label').text(myTranslations.getTranslation(TXT_ADD_FRIENDS));
		$('#sideLeaveGroup .label').text(myTranslations.getTranslation(TXT_LEAVE_GROUP));
		$('#sideDeleteChat .label').text(myTranslations.getTranslation(TXT_DELETE_CHAT));
		$('#slideup-to-cancel').text(myTranslations.getTranslation(TXT_SLIDE_UP_TO_CANCEL));
		$('#release-to-cancel').text(myTranslations.getTranslation(TXT_RELEASE_TO_CANCEL));
	},
	
	translateDialogDeleteChatHistory() {
		$('#dialogDeleteChatHistory .alert-dialog-title').text(myTranslations.getTranslation(TXT_WARNING));
		$('#dialogDeleteChatHistory .alert-dialog-content').text(myTranslations.getTranslation(TXT_CONFIRM_CHAT_DELETE));
		$('#dialogDeleteChatHistory #btnDeleteHistory').text(myTranslations.getTranslation(TXT_DELETE));
		$('#dialogDeleteChatHistory #btnCancel').text(myTranslations.getTranslation(TXT_CANCEL));
	},
	
	translatePageSendSms() {
		$('#textSmsInvitation').text(myTranslations.getTranslation(TXT_SEND_FREE_SMS_INVITE));
		$('#btnSendSms').text(myTranslations.getTranslation(TXT_SEND));
		$('#pageSendSms .title-label').text(myTranslations.getTranslation(TXT_SEND_SMS));
	},
	
	translateDialogSendFriendRequest() {
		$('#dialogText').text(myTranslations.getTranslation(TXT_SEND_FRIEND_REQUEST));
		$('#btnSendFriendRequest').text(myTranslations.getTranslation(TXT_SEND));
		$('#btnCancel').text(myTranslations.getTranslation(TXT_CANCEL));
	},
	
	translatePagePhoneContacts() {
		$('#inputSearchContacts').attr('placeholder', myTranslations.getTranslation(TXT_SEARCH_CONTACTS));
	},
	
	translateChatTapholdDialog() {
		$('#labelBtnForward').text(myTranslations.getTranslation(TXT_FORWARD));
		$('#labelBtnDelete').text(myTranslations.getTranslation(TXT_DELETE));
		$('#labelBtnCopy').text(myTranslations.getTranslation(TXT_COPY_TEXT));
	},
	
	translateDialogSendSmsInvite() {
		$('#btnSendSms').text(myTranslations.getTranslation(TXT_SEND));
		$('#btnCancel').text(myTranslations.getTranslation(TXT_CANCEL));
	},
	
	translatePageCreateGroup() {
		$('#pageCreateGroup #inputSearchFriends').attr('placeholder', myTranslations.getTranslation(TXT_SEARCH));
		$('#btnTitleCreateGroup').text(myTranslations.getTranslation(TXT_CREATE_GROUP));
		$('#inputGroupName').attr('placeholder', myTranslations.getTranslation(TXT_GROUP_NAME));
	},
	
	translatePageChatForwardMsg() {
		$('#pageChatForwardMsg .title-label').text(myTranslations.getTranslation(TXT_FORWARD_TO));
	},
	
	translatePageImageGallery() {
		$('#pageImageGallery .title-label').text(myTranslations.getTranslation(TXT_IMAGES));
	},
	
	translateDialogRecentTaphold() {
		$('#liDeleteRecentChat .label').text(myTranslations.getTranslation(TXT_DELETE_CHAT));
	},
	
	translateDialogFriendProfileMore() {
		$('#liDeleteFriend .label').text(myTranslations.getTranslation(TXT_REMOVE_FRIEND));
	},
	
	translatePageAddFriendsToGroup() {
		$('#pageAddFriendsToGroup #inputSearchFriends').attr('placeholder', myTranslations.getTranslation(TXT_SEARCH));
		$('#btnAddFriends').text(myTranslations.getTranslation(TXT_ADD_FRIENDS));
	}
};