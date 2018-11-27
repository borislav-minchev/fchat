const pubNub = {
	
	pubnub: {},

	initService() {
		this.pubnub = new PubNub({
			publishKey: PUBNUB_PUBLISH_KEY,
			subscribeKey: PUBNUB_SUBSCRIBE_KEY
		});
		this.connectToOwnChannel();
	},
	
	connectToOwnChannel() {
		const ownChannel = 'private-' + myHome.currentUserId;
		this.pubnub.subscribe({
			channels: [ownChannel]
		});
		this.pubnub.addListener({
			message: pubNub.onPrivateMessage
		});
	},
	
	onPrivateMessage(msg) {
		const signal = msg.message.signal;
		if (signal == SIGNAL_REFRESH_COMPANY) {
			if (myHome.visiblePage == 'pageFavoSiteViewCompany') {
				const msgCompanyId = msg.message.compId;
				const companyId = $('#pageFavoSiteViewCompany').attr('data-company-id');
				if (companyId == msgCompanyId) {
					$('.title-loading').show();
					favo360api.companyInfo(companyId);
				}
			}
		} else if (signal == SIGNAL_DELETE_MSG) {
			if ($('#pageChat').length == 1) {
				const conId = msg.message.conId;
				const currentConId = $('#pageChat').attr('data-con-id');
				if (conId == currentConId) {
					favoChat.deleteComment(msg.message.chatId);
				}
			}
		} else if (signal == SIGNAL_SEEN_MSG) {
			if ($('#pageChat').length == 1) {
				const conId = msg.message.conId;
				const seenId = msg.message.seenId;
				const currentConId = $('#pageChat').attr('data-con-id');
				if (conId == currentConId) {
					favoChat.checkForSeen(seenId);
				}
			}
		} else if (signal == SIGNAL_DELETED_FRIEND) {
			myHome.loadFriends();
			myHome.loadHomeNotifications();
		}
	}
};