const favoChat = {
		
	newestMsg: '',
	
	oldestMsg: '',
	
	lastSender: '',
	
	lastTimestamp: {
		year: '',
		day: '',
		hours: '',
		mins: ''
	},
	
	dateFormat: '',
	
	isInBottom: true,
	
	isLoadingHistory: false,
	
	soundRecord: '',
	
	soundRecordTimeout: '',
	
	isRecordingStopped: false,
	
	isRecording: false,
	
	// Init and load are different func because of smoother page transitions
	initChatPage(data) {
		// for iOS
		if (device.platform != 'Android') {
			$('#morePanelColFile').remove();
			$('#morePanelColCamera').attr('width', '50%');
			$('#morePanelColImages').attr('width', '50%');
		}
		favoChat.showLoading();
		favoChat.resetChatPage();
		$('#pageChat .title-label').text(data.name);
		$('#pageChat').attr('data-user-id', data.userId);
		$('#pageChat').attr('data-con-id', data.conId);
		$('#sideUserProfile .avatar').attr('src', myStorage.getUserAvatar());
		$('#sideUserProfile .label').text(myStorage.getUserFullName());
	},
	
	loadChatHistory(conId) {
		myAjax.getMessageHistory(conId, response => {
			favoChat.setSideMenu(response.participants);
			favoChat.onNewMessages(response);
			favoChat.scrollToBottom();
			$('#chatWindow').on('scroll', favoChat.onScroll);
			$('#pageChat').attr('data-chat-loaded', 1);
			// Update Recents to remove red dot
			myHome.loadRecentChats();
			myHome.loadHomeNotifications();
		});
	},
	
	showLoading() {
		$('#loadingHistory').show();
	},
	
	hideLoading() {
		$('#loadingHistory').hide();
	},
	
	resetChatPage() {
		this.newestMsg = '';
		this.oldestMsg = '';
		this.isInBottom = true;
		this.isLoadingHistory = false;
		this.soundRecord = null;
		this.isRecording = false;
		this.lastSender = '';
		this.lastTimestamp.year = '';
		this.lastTimestamp.day = '';
		this.lastTimestamp.hours = '';
		this.lastTimestamp.mins = '';
		this.dateFormat = myStorage.getDateFormat();
		$('#chatWindow').empty();
		$('.chat-side-participants').empty();
		$('#sideViewFriendShop').hide();
		$('#sideViewFriendShop').off('click');
		$('#sideUserProfile').off('click');
		$('#noNotifHeader').text(myTranslations.getTranslation(TXT_NO_NEW_NOTIF));
	},
	
	toggleMorePanel() {
		if ($('#morePanel').is(':visible')) {
			$('#morePanel').hide();
			$('#openPanelIcon').show();
			$('#closePanelIcon').hide();
		} else {
			$('#morePanel').show();
			$('#openPanelIcon').hide();
			$('#closePanelIcon').show();
		}
		if ($('#btnScrollBottom').hasClass('push-bottom')) {
			$('#btnScrollBottom').removeClass('push-bottom');
		} else {
			$('#btnScrollBottom').addClass('push-bottom');
		}
	},
	
	hideMorePanel() {
		if ($('#morePanel').is(':visible')) {
			$('#morePanel').hide();
			$('#openPanelIcon').show();
			$('#closePanelIcon').hide();
			$('#btnScrollBottom').removeClass('push-bottom');
		}
	},
	
	
	/**---------------------------** Scrolling **----------------------------**/
	onScroll() {
		favoChat.hideMorePanel();
		const chatWindow = $('#chatWindow');
		const scrollTop = chatWindow.scrollTop();
		const scrollHeight = chatWindow[0].scrollHeight;
		//const clientHeight = chatWindow[0].clientHeight;
		const clientHeight = chatWindow[0].getBoundingClientRect().height;
		if (scrollTop <= 0) {
			favoChat.isInBottom = false;
			if (favoChat.oldestMsg != 1) {
				if (!favoChat.isLoadingHistory) {
					favoChat.isLoadingHistory = true;
					favoChat.showLoading();
					const conId = $('#pageChat').attr('data-con-id');
					myAjax.getOlderMessages(conId);
				}
			}
		} else if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
			favoChat.isInBottom = true;
			$('#btnScrollBottom').removeClass('new-message');
			$('#btnScrollBottom').hide();
		} else {
			favoChat.isInBottom = false;
			$('#btnScrollBottom').show();
		}
	},
	
	scrollToBottom() {
		const chatWindow = $('#chatWindow');
		chatWindow.scrollTop(chatWindow.prop('scrollHeight'));
	},
	
	scrollToElement(element) {
		element.scrollIntoView();
	},
	
	checkFileToSend(files) {
		if (files.length != 1) {
			return;
		}
		const file = files[0];
		const fileType = file.name.split('.').pop();
		if (dataValidation.checkFileType(fileType)) {
			if (file.size > MAXIMUM_FILE_TO_SEND_SIZE) {
				const fileSize = myTranslations.getTranslation(TXT_FILE_SIZE_EXCEED);
				alert(fileSize);
			} else {
				const conId = $('#pageChat').attr('data-con-id');
				const outboxFileItem = appender.getOutboxFileItem(file);
				$('#chatWindow').append(outboxFileItem);
				favoChat.scrollToBottom();
				myAjax.sendFile(file, conId, () => {
					$('.outbox-file-item[data-file-name="' + file.name + '"]').remove();
				});
			}
		} else {
			const acceptedTypes = myTranslations.getTranslation(TXT_ACCEPTED_FILE_TYPES);
			ons.notification.alert(acceptedTypes);
		}
	},
	
	
	//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**
	/**----------------------------Image Picker -----------------------------**/
	prepareImagesToSend(images) {
		if (images.length > 0 ) {
			const conId = $('#pageChat').attr('data-con-id');
			const avatar = myStorage.getUserAvatar();
			myAjax.getMultipleFileInsertPermission(conId, images.length, (response) => {
				const fileMerge = response[0].fileMerge;
				const filesNumber = images.length;
				let index = 0;
				let currentImgSrc = images[0];
				const outboxImgItem = appender.getOutboxImgItem(avatar, currentImgSrc, 1);
				$('#chatWindow').append(outboxImgItem);
				favoChat.scrollToBottom();
				const sendFileFunc = (filePath) => {
					$('[data-current-src="' + currentImgSrc + '"]').attr('data-current-src', filePath);
					$('[data-current-src="' + filePath + '"] #currentPendingImg').attr('src', filePath);
					$('[data-current-src="' + filePath + '"] #moreImg').text(index + 1);
					currentImgSrc = filePath;
					myAjax.sendImage(filePath, fileMerge, filesNumber, conId, () => {
						index++;
						if (images[index]) {
							sendFileFunc(images[index]);
						} else {
							$('[data-current-src="' + filePath + '"]').remove();
						}
					});
				};
				sendFileFunc(images[index]);
			});
		}
	},
	
	
	/**--------------**--------------- CAMERA ----------------**-------------**/
	//https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/

	/* Android uses intents to launch the camera activity on the device to
	capture images, and on phones with low memory, the Cordova activity may
	be killed. In this scenario, the result from the plugin call will be
	delivered via the resume event. See the Android Lifecycle guide for more
	information. The pendingResult.result value will contain the value that 
	would be passed to the callbacks (either the URI/URL or an error 
	message). Check the pendingResult.pluginStatus to determine whether or 
	not the call was successful.*/
	
	takePhoto() {
		const camera = navigator.camera;
		const cameraOptions = {
			quality: 50,
			correctOrientation: true
		};
		camera.getPicture((filePath) => {
			const conId = $('#pageChat').attr('data-con-id');
			const avatar = myStorage.getUserAvatar();
			const outboxImgItem = appender.getOutboxImgItem(avatar, filePath, 1);
			$('#chatWindow').append(outboxImgItem);
			favoChat.scrollToBottom();
			myAjax.sendImage(filePath, 0, 1, conId, (response) => {
				$('[data-current-src="' + filePath + '"]').remove();
				if (response.response == 'OK') {
					fileHelper.deleteFile(filePath);
				} else {
					ons.notification.alert('Error: ' + response);
				}
			});
		}, () => {
		}, cameraOptions);
	},
	
	
	/**--------------------------- SOUND RECORDING --------------------------**/
	startSoundRecording() {
		if (!favoChat.isRecording) {
			
			const finishedRecordingFunc = function (filePath) {
				const conId = $('#pageChat').attr('data-con-id');
				myAjax.sendSoundFile(filePath, conId, result => {
					if (result.response == 'OK') {
						fileHelper.deleteFile(filePath);
					} else {
						ons.notification.alert('Error: ' + result.response);
					}
				});
			};
			
			const soundRecFunc = function (filePath) {
				favoChat.soundRecord = new Media(filePath, () => {
					if (!favoChat.isRecordingStopped) {
						if (device.platform == 'Android') {
							finishedRecordingFunc(filePath);
						} else {
							fileHelper.iOSReadFile(filePath, fileEntry => {
								finishedRecordingFunc(fileEntry);
							});
						}
					}
				}, error => {
					console.log(error);
				});
				favoChat.soundRecord.startRecord();
				favoChat.isRecording = true;
				favoChat.soundRecordTimeout = setTimeout(favoChat.completeSoundRecording, VOICE_RECORDING_LIMIT);
			};

			let fileName = Date.now();
			if (device.platform == 'Android') {
				fileName = fileName + '.acc';
				fileHelper.createFile(fileName, filePath => {
					soundRecFunc(filePath);
				});
			} else {
				fileName = fileName + '.wav';
				
				fileHelper.createFile(fileName, result => {
					fileHelper.iOSReadFile(result, fileUrl => {
						soundRecFunc(fileUrl);
					});
				});
				
				
				
			}
		}
	},

	completeSoundRecording() {
		clearTimeout(favoChat.soundRecordTimeout);
		$('#btnRecordSound').removeClass('on');
		$('#btnRecordSound').attr('data-sliding-mode', 'not-holded');
		$('.sound-rec-img').hide();
		$('#btnRecordSound').text(myTranslations.getTranslation(TXT_HOLD_TO_TALK));
		if (favoChat.isRecording && !favoChat.isRecordingStopped) {
			$('#audioRecFinish').trigger('play');
			favoChat.isRecording = false;
			favoChat.isRecordingStopped = false;
			favoChat.soundRecord.stopRecord();
        }
	},
	
	////////////////////////////////////////////////////////////////////////////
	/**---------------------** TEMPORARY MESSAGES **-------------------------**/
	////////////////////////////////////////////////////////////////////////////
	insertTempMsg(msg, localId) {
		const tempTxtMsg = appender.getTempMessageTxtItem(msg, localId);
		$('#chatWindow').append(tempTxtMsg);
		favoChat.scrollToBottom();
	},
	
	////////////////////////////////////////////////////////////////////////////
	/**----------------------** RECEIVED MESSAGES **-------------------------**/
	////////////////////////////////////////////////////////////////////////////
	onIncomingMessage(notiMsg) {
		if ($('#pageChat')[0]) {
			// pageChat is initialized
			const currentConId = $('#pageChat').attr('data-con-id');
			if (currentConId == notiMsg.conId) {
				myAjax.getNewMessages(notiMsg.conId);	
			} else {
				const notifSnippet = appender.getSideNotifItem(notiMsg);
				$('#sideNotifList .side-notif-item[data-con-id="' + notiMsg.conId + '"]').remove();
				$('#sideNotifList').prepend(notifSnippet);
				$('#noNotifHeader').hide();
				const notifNumber = $('#sideNotifList .side-notif-item').length;
				$('#btnChatSideMenu .notification').text(notifNumber);
				navigator.vibrate(300);
			}	
		}
		myHome.loadHomeNotifications(() => {
			myHome.loadRecentChats();
		});
	},
	
	onOlderMessages(data) {
		const currentConId = $('#pageChat').attr('data-con-id');
		if (currentConId != data.conId) {
			favoChat.hideLoading();
			return;
		}
		if (!data[0]) {
			let chatList = data.chatList;
			chatList.reverse();
			const chatOuter = data.chatOuter;
			const currentOldestMsg = favoChat.oldestMsg;
			favoChat.oldestMsg = chatOuter.chatIdFirst;
			if (chatOuter.isLast) {
				favoChat.oldestMsg = 1;
			}
			$('#chatWindow').prepend(favoChat.prepareMessageList(chatList));
			const positionInChat = $('.msg-list-item[data-chat-id="' + currentOldestMsg + '"]');
			favoChat.scrollToElement(positionInChat[0]);
			favoChat.checkForFriendProfileLinks();
			favoChat.checkForSingleGalleryElements();
			//favoChat.checkForAudioElements();
			favoChat.checkForOrderLink();
			favoChat.attachTapholdEvents();
		}
		favoChat.isLoadingHistory = false;
		favoChat.hideLoading();
	},
	
	onNewMessages(data) {
		const currentConId = $('#pageChat').attr('data-con-id');
		if (currentConId != data.conId) {
			favoChat.hideLoading();
			return;
		}
		if (!data[0]) {
			const chatOuter = data.chatOuter;
			if (favoChat.newestMsg != chatOuter.chatIdLast) {
				favoChat.newestMsg = chatOuter.chatIdLast;
				let chatList = data.chatList;
				chatList.reverse();
				if (favoChat.oldestMsg != 1) {
					if (chatOuter.isLast) {
						favoChat.oldestMsg = 1;
					} else {
						favoChat.oldestMsg = chatOuter.chatIdFirst;
					}
				}
				$('#chatWindow').append(favoChat.prepareMessageList(chatList));
				favoChat.checkForFriendProfileLinks();
				favoChat.checkForSingleGalleryElements();
				//favoChat.checkForAudioElements();
				
				
				//testing
				$('.audioplayer-playpause:not(.click-attached)').on('click', function () {
					$(this).parents('.msg-list-item').addClass('on');
					const audioSrc = $(this).parents('.msg-list-item').attr('data-audio-src');
					
					$('#audioMsgContainer').trigger('pause');
					$('#audioMsgContainer').attr('src', audioSrc);
					$('#audioMsgContainer').trigger('play');
				});
				$('.audioplayer-playpause:not(.click-attached)').addClass('click-attached');
				
				
				favoChat.checkForOrderLink();
				favoChat.checkForSeen(data.seenId);
				favoChat.attachTapholdEvents();
				favoChat.attachImgLoadEvents();
				if (favoChat.isInBottom) {
					favoChat.scrollToBottom();
				} else {
					$('#btnScrollBottom').addClass('new-message');
				}
			}
		}
		favoChat.hideLoading();
	},
	
	checkForFriendProfileLinks() {
		$('.profile-link-notify:not(.click-attached)').on('click', homeChatClicks.onChatProfileLinkClick);
		$('.profile-link-notify:not(.click-attached)').addClass('click-attached');
	},
	
	checkForSeen(chatId) {
		// Clear all other Seens
		$('.status').text('');
		// Add Seen only on passed id
		const txt = myTranslations.getTranslation(TXT_SEEN);
		$('.msg-list-item[data-chat-id="' + chatId + '"] .status').text(txt);
	},
	
	attachImgLoadEvents() {
		$('.section-images .post-img').find('img').on('load', favoChat.scrollToBottom);
		// check for emoji message
		$('.section-message').find('img').on('load', favoChat.scrollToBottom);
	},
	
	checkForAudioElements() {
		// Select all audio elements that don't have player plugin as parent
		const audioElements = $('#chatWindow').find('audio').not('.audioplayer audio');
		if (audioElements.length > 0) {
			audioElements.audioPlayer();
			// Select all audio players with applied plugin
			let audioPlayers = $('.audioplayer').not('.audioplayer-novolume');
			//audioPlayers.css('width', '100%');
			audioPlayers.addClass('audioplayer-novolume');			
		}
		const unformattedAudioElements = $('.section-audio.unformatted');
		// attach the click event on the play button
		unformattedAudioElements.find('.audioplayer-time-duration').remove();
		unformattedAudioElements.find('.audioplayer-playpause').on('click', homeChatClicks.onAudioMessageElementClick);
		unformattedAudioElements.find('audio').on('playing', homeChatClicks.onAudioPlaying);
		unformattedAudioElements.find('audio').on('ended pause', homeChatClicks.onAudioEnded);
		unformattedAudioElements.removeClass('unformatted');
	},
	
	checkForOrderLink() {
		$('.order-link:not(.click-attached)').on('click', homeChatClicks.onChatOrderLinkClick);
		$('.order-link:not(.click-attached)').addClass('click-attached');
	},
	
	checkForSingleGalleryElements() {
		if ($('.single-gallery-element').length > 0) {
			myLightGallery.loadGallery('.single-gallery-element');
			$('.single-gallery-element').removeClass('single-gallery-element');
		}
	},
	
	attachTapholdEvents() {
		// taphold event - https://github.com/benmajor/jQuery-Touch-Events
		$('.msg-list-item:not(.taphold-attached, .is-deleted)').on('taphold', homeChatClicks.onChatMsgTaphold);
		$('.msg-list-item:not(.taphold-attached)').addClass('taphold-attached');
	},
	
	deleteComment(chatId) {
		$('.msg-list-item[data-chat-id="' + chatId + '"]').remove();
	},
	
	setSideMenu(participants) {
		$('#sideUserProfile .avatar').attr('src', myStorage.getUserAvatar());
		$('#sideUserProfile .label').text(myStorage.getUserFullName());
		let sideUsers = '';
		if (participants.length == 1) {
			// single user
			sideUsers += appender.getChatSideUser(participants[0]);
			if (participants[0].compId) {
				$('#sideViewFriendShop').attr('data-company-id', participants[0].compId);
				
				$('#sideViewFriendShop').show();
			}
		} else {
			// group
			for (const user of participants) {
				sideUsers += appender.getChatSideUser(user);
			}
		}
		$('.chat-side-participants').html(sideUsers);
		homeChatClicks.setChatSideEvents();
	},
	
	prepareMessageList(chatList) {
		let messages = '';
		let avatarPosition = '';
		let msgItem = '';
		let chatTimestamp = '';
		let showTimestamp = 0;
		for (const item of chatList) {
			// Check if item with such localId exists
			const localId = '' + item.localId;
			$('.msg-list-item[data-local-id="' + localId + '"]').remove();
			
			if (item.user == myHome.currentUserId) {
				// Current user always on right
				avatarPosition = 'chat-item-right';
			} else if (item.user == favoChat.lastSender) {
				// next comment of another user
				avatarPosition = 'chat-item-left next-comment';
			} else {
				// new user in conversation
				avatarPosition = 'chat-item-left';
			}
			if (!favoChat.lastSender) {
				favoChat.lastSender = item.user;
			} else {
				if (item.user == favoChat.lastSender) {
					showTimestamp = 0;
				} else {
					showTimestamp = 1;
				}
				favoChat.lastSender = item.user;
			}
			// For showing timestamp on comments
			chatTimestamp = favoChat.getMessageTimestamp(item.chatTime, showTimestamp);
			if (item.msgType == 'txt') {
				msgItem = appender.getMessageTxtItem(item, chatTimestamp, avatarPosition);
			} else if (item.msgType == 'img') {
				msgItem = appender.getMessageImgItem(item, chatTimestamp, avatarPosition);
			} else if (item.msgType == 'snd') {
				msgItem = appender.getMessageSndItem(item, chatTimestamp, avatarPosition);
			} else if (item.msgType == 'fil') {
				msgItem = appender.getMessageFilItem(item, chatTimestamp, avatarPosition);
			}
			messages += msgItem;
		}
		return messages;
	},
	
	getMessageTimestamp(chatTime, showTimestamp) {
		let chatTimestamp = '';
		if (chatTime == 0) {
			chatTimestamp = '';
		} else {
			const msgHours = chatTime.hour;
			const msgMins = chatTime.min;
			const msgDayOfMonth = chatTime.day;
			const msgMonth = chatTime.month;
			const msgYear = chatTime.year;
			
			const showTimeFunc = function () {
				const time = new Date();
				const currentYear = '' + time.getFullYear();
				const currentMonth = ('0' + (time.getMonth() + 1)).slice(-2);
				const currentDayOfMonth = ('0' + time.getDate()).slice(-2);
				let dayAndMonth = '';
			
				if (favoChat.dateFormat && favoChat.dateFormat.startsWith('M')) {
					dayAndMonth = msgMonth + '.' + msgDayOfMonth;
				} else {
					dayAndMonth = msgDayOfMonth + '.' + msgMonth;
				}

				if (currentYear != msgYear) {
					// different year
					chatTimestamp = msgYear + ', ' + dayAndMonth + ', ' + msgHours + ':' + msgMins;
				} else {
					// same year
					if (currentDayOfMonth == msgDayOfMonth && currentMonth == msgMonth) {
						// today
						chatTimestamp = msgHours + ':' + msgMins;
					} else if (currentDayOfMonth - msgDayOfMonth == 1 && currentMonth == msgMonth) {
						// yesterday
						const txt = myTranslations.getTranslation(TXT_YESTERDAY);
						chatTimestamp = txt + ', ' + msgHours + ':' + msgMins;
					} else {
						// any other day
						chatTimestamp = dayAndMonth + ', ' + msgHours + ':' + msgMins;
					}
				}
			};
			
			if (favoChat.lastTimestamp.year != msgYear ||
				favoChat.lastTimestamp.day != msgDayOfMonth ||
				favoChat.lastTimestamp.hours != msgHours ||
				favoChat.lastTimestamp.mins != msgMins ||
			   	showTimestamp == 1) {
				showTimeFunc();
			}
			
			favoChat.lastTimestamp.hours = msgHours;
			favoChat.lastTimestamp.mins = msgMins;
			favoChat.lastTimestamp.day = msgDayOfMonth;
			favoChat.lastTimestamp.year = msgYear;
		}
		return chatTimestamp;
	}
};