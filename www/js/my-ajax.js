const myAjax = {
	
	setupAjax() {
		$.ajaxSetup({
			type: 'POST',
			crossDomain: true,
			dataType: 'JSON',
			cache: false
		});
	},
	
	getLanguages(callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'language'
			},
			success: callback
		});
	},
	
	requestCountries(callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'country'
			},
			success: callback
		});
	},
	
	getPasswordSms(phone, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'favoChatNewPass',
				phone: phone,
				langId: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	resendSmsCode(callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'resendSMS',
				user: myStorage.getCurrentUserId(),
				langId: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	sendNewPassword(oldPass, newPass, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'newPass',
				user: myHome.currentUserId,
				password: oldPass,
				passwordNew: newPass,
				langId: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	removeFriend(conId, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'removeFriend',
				user: myHome.currentUserId,
				conId: conId,
				langId: myStorage.getLanguage()
			},
			success: callback
		});	
	},
	
	requestCities(countryCode, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'cities',
				country: countryCode
			},
			success: callback
		});
	},
	
	getCurrencies(callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'favo360currency'
			},
			success: callback
		});	
	},
	
	getFavoCountries(callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'favo360Countries'
			},
			success: callback
		});	
	},
	
	sendFriendChangedCustomData(data, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'userCommentInsert',
				user: myHome.currentUserId,
				targetUser: data.targetUser,
				userFullNameChanged: data.userFullNameChanged,
				userComment: data.userComment,
				langId: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	getFriendsToAddToGroup(conId, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'getFriendsToAddToGroup',
				user: myHome.currentUserId,
				conId: conId
			},
			success: callback
		});
	},
	
	addFriendsToGroup(conId, groupMembers, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'groupAddUser',
				user: myHome.currentUserId,
				conId: conId,
				groupMembers: groupMembers
			},
			success: callback
		});
	},
	
	sendRegistration(data, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'register',
				country: data.countryCode,
				langId: data.langId,
				phone: data.phone,
				name: data.fullName,
				password: data.password
			},
			success: callback
		});
	},
	
	sendFavoMerchantReg(data, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'favo360newAccount',
				user: myHome.currentUserId,
				company: data.company,
				city: data.cityId,
				address: data.address,
				crncyId: data.currency,
				langId: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	createGroupChat(groupMembers, groupName, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'groupCreate',
				user: myHome.currentUserId,
				groupMembers: groupMembers,
				txt: groupName
			},
			success: callback
		});	
	},
	
	sendConfirmationCode(inputCode, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'checkCode',
				phone: myStorage.getUserPhone(),
				code: inputCode,
				user: myStorage.getCurrentUserId()
			},
			success: callback
		});
	},
	
	updateNewsfeedSubscription(newsfeedSubscription, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'newsSubUnsub',
				user: myStorage.getCurrentUserId(),
				news: newsfeedSubscription
			},
			success: callback
		});
	},
	
	logInUser(phone, password, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'login',
				phone: phone,
				password: password
			},
			success: callback
		});
	},
	
	logOutUser(userId, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'userLogout',
				user: userId
			},
			success: callback
		});	
	},
	
	getTranslations(language, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'texts',
				langId: language
			},
			success: callback
		});
	},
	
	getSmsInviteText(callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'favoChatShareTEXT',
				langId: myStorage.getLanguage()
			},
			success: callback
		});	
	},
	
	registerDeviceForPush(pushRegId, pushService) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'pushReg',
				user: myHome.currentUserId,
				pushRegId: pushRegId,
				pushService: pushService
			}
		});
	},
	
	loadHomeNotifications(callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'notify',
				user: myHome.currentUserId,
				langId: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	connectToUser(targetUser, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'friendConnect',
				user: myHome.currentUserId,
				userTo: targetUser
			},
			success: callback
		});
	},
	
	getCurrentCountry(callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'getCountry'
			},
			success: callback
		});
	},
	
	searchFriend(searchText, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'friendSearch',
				phone: searchText,
				user: myHome.currentUserId,
				langId: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	sendFriendRequest(requestedUserId, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'friendRequest',
				user: myHome.currentUserId,
				userTo: requestedUserId
			},
			success: callback
		});
	},
	
	acceptFriendRequest(conId, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'friendRequestOK',
				user: myHome.currentUserId,
				conId: conId
			},
			success: callback
		});
	},
	
	requestFriends(callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'friendsList',
				user: myHome.currentUserId
			},
			success: callback
		});
	},
	
	getCurrentUserInfo(userId, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'userInfo',
				user: userId,
				userSrch: userId
			},
			success: callback
		});
	},
	
	getUserInfo(targetUser, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'userInfo',
				user: myHome.currentUserId,
				userSrch: targetUser
			},
			success: callback
		});
	},
	
	checkPhoneContacts(contacts, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'phoneContacts',
				user: myHome.currentUserId,
				contacts: contacts
			},
			success: callback
		});
	},
	
	sendSmsInvitation(number, txt, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'favoChatShareSMS',
				user: myHome.currentUserId,
				phone: number,
				langId: myStorage.getLanguage(),
				txt: txt
			},
			success: callback
		});
	},
	
	deleteChatHistory(conId, chatId, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'delRecent',
				user: myHome.currentUserId,
				conId: conId,
				chatId: chatId
			},
			success: callback
		});
		
	},
	
	////////////////////////////////////////////////////////////////////////////
	////////////////////////// File Transfer Stuff /////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	getMultipleFileInsertPermission(conId, filesNumber, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'fileInsertTemp',
				conId: conId,
				filesNumber: filesNumber,
				user: myHome.currentUserId
			},
			success: callback
		});
	},
	
	sendFile(file, conId, callback) {
		let formData = new FormData();
		formData.append('enctype', 'multipart/form-data');
		formData.append('mode', 'fileInsert');
		formData.append('conId', conId);
		formData.append('user', myHome.currentUserId);
		formData.append('msgType', 'fil');
		formData.append('fileName', file.name);
		formData.append('file', file);
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: formData,
			contentType: false,
			processData: false,
			success: callback,
			error: callback
		});
	},
	
	sendImage(filePath, fileMerge, filesNumber, conId, callback) {
		const options = new FileUploadOptions();
		const fileName = filePath.split('/').pop();
		options.params = {
			mode: 'fileInsert',
			conId: conId,
			user: myHome.currentUserId,
			fileMerge: fileMerge,
			filesNumber: filesNumber,
			fileName: fileName,
			msgType: 'img'
		};
		myAjax.transferFile(filePath, options, callback);
	},
	
	sendSoundFile(filePath, conId, callback) {
		const options = new FileUploadOptions();
		options.params = {
			mode: 'fileInsert',
			conId: conId,
			user: myHome.currentUserId,
			filesNumber: 1,
			msgType: 'snd'
		};
		myAjax.transferFile(filePath, options, callback);
	},
	
	uploadAvatar(filePath, callback) {
		const options = new FileUploadOptions();
		options.params = {
			mode: 'userAvatar',
			user: myHome.currentUserId
		};
		myAjax.transferFile(filePath, options, callback);
	},
	
	transferFile(filePath, options, callback) {
		const ft = new FileTransfer();
		ft.upload(filePath, encodeURI(FAVO_CHAT_PHP_URL), response => {
				callback(response);
			}, (error) => {
				callback(error);
			},
			options
		);
	},
	
	
	////////////////////////////////////////////////////////////////////////////
	////////////////////////////// Send Message Stuff //////////////////////////
	////////////////////////////////////////////////////////////////////////////
	sendMessage(msg, conId, localId, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'commentInsert',
				conId: conId,
				user: myHome.currentUserId,
				txt: msg,
				localId: localId
			},
			success: callback
		});
	},
	
	getRecentMessages(callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'chatRecent',
				user: myHome.currentUserId,
				pushId: myStorage.getPushDeviceID()
			},
			success: callback
		});
	},
	
	getMessageHistory(conId, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'commentRead',
				conId: conId,
				user: myHome.currentUserId,
				usrTime: (-(new Date().getTimezoneOffset()/ 60)),
				pushId: myStorage.getPushDeviceID()
			},
			success: callback
		});
	},
	
	getNewMessages(conId) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'commentRead',
				conId: conId,
				user: myHome.currentUserId,
				offset: 'newerThan',
				chatId: favoChat.newestMsg,
				usrTime: (-(new Date().getTimezoneOffset()/ 60)),
				pushId: myStorage.getPushDeviceID()
			},
			success: favoChat.onNewMessages
		});
	},
	
	getOlderMessages(conId) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'commentRead',
				conId: conId,
				user: myHome.currentUserId,
				offset: 'olderThan',
				chatId: favoChat.oldestMsg,
				usrTime: (-(new Date().getTimezoneOffset()/ 60)),
				pushId: myStorage.getPushDeviceID()
			},
			success: favoChat.onOlderMessages
		});
	},
	
	deleteChatMsg(chatId, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'messageDelete',
				chatId: chatId,
				user: myHome.currentUserId
			},
			success: callback
		});	
	},
	
	forwardMsg(chatId, recipients, callback) {
		$.ajax({
			url: FAVO_CHAT_PHP_URL,
			data: {
				mode: 'broadcastMessage',
				chatId: chatId,
				user: myHome.currentUserId,
				recipients: recipients
			},
			success: callback
		});
	},
	
	
	//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//////////////////////////////////////////////////\\
	//|||||||||||\\\\\\\\\\\\\\\\\\\\\ TWILIO AUDIO VIDEO /////////////////////||||||||||||||||||\\
	//*******************************************************************************************\\
	
	getTwilioToken(userId, conId, callback) {
		$.ajax({
			url: FAVO_TWILIO_URL,
			data: {
				mode: 'getToken',
				user: userId,
				conId: conId
			},
			success: callback
		});
	},
	
	//************************************************************************//
	//---------------------------- Favo360 Requests --------------------------//
	//_____________________________****************___________________________//
	getCompanyInfo(token, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: token
			},
			data: {
				mode: 'companyInfo',
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	getMerchantCategories(callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'CompCategories',
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	getCompanyPayment(callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'companyPayments',
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	saveCompanyPayment(data, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'companyPaymentsSave',
				bankName: data.bankName,
				iban: data.iban,
				bic: data.bic,
				paypal: data.paypal,
				alipay: data.alipay,
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	getMerchantSubCategories(categoryId, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'prodCategoriesSubComp',
				cat: categoryId,
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	checkMerchantSubCategory(categoryId, isChecked, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'CompCheck',
				cat: categoryId,
				check: isChecked,
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	getProductInfo(itemId, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'itemEditInfoImg',
				itId: itemId,
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	getProductSubCategories(catId, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'prodCategoriesSubItem',
				cat: catId,
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	getCompanyCategoriesSideMenu(compId, callback) {
		// 
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'companyProdCat',
				compId: compId,
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	getMeasures(callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'itemMeasure',
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	sendEnquiry(data, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'contactSellerChat',
				lang: myStorage.getLanguage(),
				compId: data.companyId,
				prod: data.productId,
				imgId: data.productImgId,
				txt: data.txt,
				ordId: data.orderId
			},
			success: callback
		});
	},
	
	searchFavoCity(txt, countryCode, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'searchCity',
				lang: myStorage.getLanguage(),
				countryCode: countryCode,
				srch: txt
			},
			success: callback
		});
	},
	
	sendPdfEmail(data, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'orderForwardPdf',
				lang: myStorage.getLanguage(),
				type: data.orderType,
				email: data.emailAddress,
				txt: data.emailText,
				orderId: data.orderId
			},
			success: callback
		});
	},
			
	updateCompanyInfo(companyInfo, companyType, companyCat, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'compSaveInfo',
				companyName: companyInfo.companyName,
				countryCode: companyInfo.countryCode,
				cityId: companyInfo.cityId,
				companyAddress: companyInfo.companyAddress,
				currency: companyInfo.currency,
				vat: companyInfo.vat,
				companyType: companyType,
				companyCat: companyCat,
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	updateProductInfo(data, categories, filters, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'itemSaveInfo',
				lang: myStorage.getLanguage(),
				itId: data.productId,
				productName: data.productName,
				productCode: data.productCode,
				productNoName: data.productNoName,
				productClear: data.productClear,
				productNew: data.productNew,
				productFeat: data.productFeat,
				productCurrency: data.productCurrency,
				productMeasure: data.productMeasure,
				productQty: data.productQty,
				productComment: data.productComment,
				productVol: data.productVol,
				productWeight: data.productWeight,
				productWeightType: data.productWeightType,
				productWidth: data.productWidth,
				productLength: data.productLength,
				productHeight: data.productHeight,
				productNegotiate: data.productNegotiate,
				productPrice: data.productPrice,
				productText: data.productText,
				productCategories: categories,
				productFilters: filters
			},
			success: callback
		});
	},
	
	getProductFilters(categories, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'prodFilters',
				productCategories: categories,
				lang: myStorage.getLanguage()
			},
			success: callback
		});
	},
	
	updateGroupName(groupId, groupName, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'saveGroupName',
				lang: myStorage.getLanguage(),
				groupId: groupId,
				groupName: groupName
			},
			success: callback
		});
	},
	
	getCompanyGallery(companyId, callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'companyGallery',
				compId: companyId
			},
			success: callback
		});
	},
	
	getCartItemsNumber(callback) {
		$.ajax({
			url: FAVO_PRODUCTS_PHP_URL,
			headers: {
				authentication: myStorage.getFavoToken()
			},
			data: {
				mode: 'favo360store'
			},
			success: callback
		});	
	},
	
	uploadProductImg(itemId, filePath, callback) {
		const options = new FileUploadOptions();
		const fileName = filePath.split('/').pop();
		options.params = {
			mode: 'imgUpload',
			itId: itemId,
			fileName: fileName,
			lang: myStorage.getLanguage()
		};
		options.headers = {
			authentication: myStorage.getFavoToken()
		};
		const ft = new FileTransfer();
		ft.upload(filePath, encodeURI(FAVO_PRODUCTS_PHP_URL), (response) => {
				callback(response);
			}, (error) => {
				callback(error);
			},
			options
		);
	}
};