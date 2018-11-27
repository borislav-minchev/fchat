const myPush = {
	
	initPush() {
		// Different plugins
		if (device.platform == 'Android') {
			// cordova-plugin-firebase
			window.FirebasePlugin.onTokenRefresh(this.onTokenRefresh);
			window.FirebasePlugin.onNotificationOpen(this.onNotification);
		} else if (device.platform == 'iOS') {
			// cordova-plugin-fcm
			FCMPlugin.onTokenRefresh(this.onTokenRefresh);
			FCMPlugin.onNotification(this.onNotification);
		}
		const token = myStorage.getPushDeviceID();
		if (token) {
			myPush.registerForPush(token);
		}
	},
	
	registerForPush(token) {
		let pushService = '';
		if (device.platform == 'Android') {
			pushService = 'gcm';
		} else {
			pushService = 'apns';
		}
		myAjax.registerDeviceForPush(token, pushService);
	},
	
	subscribeToTopic(topic) {
		window.FirebasePlugin.subscribe(topic);	
	},
	
	unsubscribeToTopic(topic) {
		window.FirebasePlugin.unsubscribe(topic);	
	},
	
	onTokenRefresh(token) {
        if (token) {
            myStorage.setPushDeviceID(token);
            myPush.registerForPush(token);
        }
	},
	
	onNotification(push) {
		let signal;
		let title;
		let text;
		let isTapped = false;
		if (device.platform == 'Android') {
			signal = push.signal;
			title = push.title;
			text = push.text;
			isTapped = push.tap;
		} else {
			signal = push['gcm.notification.signal'];
			title = push.aps.alert.title;
			text = push.aps.alert.body;
			if (push.wasTapped) {
				isTapped = true;
			}
		}
		if (isTapped) {
			if (signal == SIGNAL_NEW_MESSAGE) {
				let notiMsg;
				if (device.platform == 'Android') {
					notiMsg = JSON.parse(push.notiMsg)[0];
				} else {
					notiMsg = JSON.parse(push['gcm.notification.notiMsg'])[0];
				}
 				const data = {
					conId: notiMsg.conId,
					name: title,
					userId: notiMsg.user
				};
				if (myHome.visiblePage == 'subPageChat') {
					favoChat.initChatPage(data);
					favoChat.loadChatHistory(notiMsg.conId);
				} else {
					myHome.bringPageToTop(PAGE_HOME_CHAT, data);
				}
			} else if (signal == SIGNAL_FRIEND_REQUEST || signal == SIGNAL_CONFIRMED_FRIEND_REQUEST) {
				let userId;
				if (device.platform == 'Android') {
					userId = push.user;
				} else {
					userId = push['gcm.notification.user'];
				}
				if (myHome.visiblePage == 'pageFriendProfile') {
					myHome.loadFriendProfile(userId);
				} else {
					const data = {
						userId: userId	
					};
					myHome.bringPageToTop(PAGE_FRIEND_PROFILE, data);
				}
			} else if (signal == SIGNAL_NEW_ORDER || signal == SIGNAL_COMPLETED_ORDER) {
				myHome.bringPageToTop(PAGE_FAVO_ORDERS);
				$('#homeTabBar')[0].setActiveTab(2);
			} else if (signal == SIGNAL_ACCEPTED_ORDER) {
				debugger;
				myHome.bringPageToTop(PAGE_FAVO_DELIVERIES);
			} else if (signal == SIGNAL_TIMELINE) {
				//debugger;
				// da se otvori stenata
				myHome.bringPageToTop(PAGE_FAVO_TIMELINE);
			} else if (signal == SIGNAL_ADDED_TO_GROUP) {
				debugger;
				const data = {
					conId: asd,
					name: asd
				};
				myHome.bringPageToTop(PAGE_HOME_CHAT, data);
			}
		} else {
			if (signal == SIGNAL_NEW_MESSAGE) {
				let notiMsg;
				if (device.platform == 'Android') {
					notiMsg = JSON.parse(push.notiMsg)[0];
				} else {
					notiMsg = JSON.parse(push['gcm.notification.notiMsg'])[0];
				}
				favoChat.onIncomingMessage(notiMsg);
			} else if (signal == SIGNAL_FRIEND_REQUEST || signal == SIGNAL_CONFIRMED_FRIEND_REQUEST) {
				myToast.showLong(text);
				myHome.loadHomeNotifications(() => {
					myHome.loadFriends();
				});
			} else if (signal == SIGNAL_NEW_ORDER || signal == SIGNAL_COMPLETED_ORDER) {
				myHome.loadHomeNotifications();
				myToast.showLong(title + ': ' + text);
				if ($('#pageFavoSiteOrders')[0]) {
					favoPages.loadPageOrders();
				}
			} else if (signal == SIGNAL_ACCEPTED_ORDER) {
				// pri prieta poru4ka pri otvoren app
				debugger;
				myToast.showLong(title + ': ' + text);
			} else if (signal == SIGNAL_ADDED_TO_GROUP) {
				myHome.loadHomeNotifications(() => {
					myHome.loadFriends();
					myHome.loadRecentChats();
				});
			}
		}
	}
};