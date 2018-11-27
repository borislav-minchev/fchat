const appender = {
	
	getLanguageItem(data) {
		const langItem = '<ons-list-item modifier="longdivider" class="lang-list-item" tappable data-lang-id="' +
			data.langId + '" data-img-src="' +
			data.langIcon + '"><div class="left"><img class="list__item__thumbnail" src="' +
			data.langIcon + '"></div><div class="center"><span class="list__item__title">' +
			data.langName + '</span></div></ons-list-item>';
		
		return langItem;
	},
	
	getCountryItem(data) {
		const countrySnippet = '<ons-list-item tappable modifier="longdivider" class="country-list-item" data-country-code="' +
			data.countryCode + '" data-country-name="' +
			data.countryName + '" + data-country-phone-code="+' +
			data.countryPhoneCode + '"><div class="left"><img class="list__item__thumbnail" src="' +
			data.countryFlag + '"></div><div class="center"><span class="list__item__title">' +
			data.countryName + '</span><span class="list__item__subtitle">+' +
			data.countryPhoneCode + '</span></div></ons-list-item>';
		
		const asd = 2 + 2;
		
		return countrySnippet;
	},
	
	getFavoCountryItem(country) {
		const countrySnippet = '<ons-list-item tappable modifier="longdivider" class="favo-country-list-item" data-country-code="' +
			country.countryCode + '" data-country-name="' +
			country.countryName + '"><div class="left"><img class="list__item__thumbnail" src="' +
			country.countryFlag + '"></div><div class="center"><span class="list__item__title">' +
			country.countryName + '</span><span class="list__item__subtitle">' +
			country.countryNum + ' Companies</span></div></ons-list-item>';
		
		return countrySnippet;
	},
	
	getCityItem(city) {
		const citySnippet = '<ons-list-item tappable modifier="longdivider" class="city-list-item" data-city-id="' +
			city.cityId + '" data-city-name="' +
			city.cityName + '"></div><div class="center"><span class="list__item__title">' +
			city.cityName + '</span></div></ons-list-item>';

		return citySnippet;
	},
	
	getCurrencyItem(currency) {
		const currencySnippet = '<ons-list-item tappable modifier="longdivider" class="currency-list-item" data-currency-code="' +
			currency.curCode + '" data-currency-name="' +
			currency.curName + '"></div><div class="center"><span class="list__item__title">' +
			'[' + currency.curCode + '] ' +  currency.curName + '</span></div></ons-list-item>';
		
		return currencySnippet;
	},
	
	getNoSearchResultItem() {
		const txt = myTranslations.getTranslation(TXT_NOTHING_FOUND);
		const snippet = '<ons-list-header class="no-result-item">' +
			  txt + '</ons-list-header>';
		
		return snippet;
	},
	
	getFoundFriendItem(data) {
		const foundFriendSnippet = '<ons-list-item modifier="longdivider" tappable id="liFoundFriend" data-user-id="' +
			  data.user + '"><div class="left"><img class="list__item__thumbnail" src="' +
			  data.avatar + '"></div><div class="center"><span class="list__item__title">' +
			  data.name + '</span><span class="list__item__subtitle">' +
			  data.company + '</span></div></ons-list-item>';
		
		return foundFriendSnippet;
	},
	
	getFriendListItem(data) {
		let classes = '';
		let userFavoStore = '';
		let title = '';
		let friendSnippet = '';
		if (data.official) {
			classes += 'official-account ';
		}
		if (data.compId != 0) {
			let userStoreLogo = '';
			if (data.compLogo) {
				userStoreLogo = '<img class="list__item__thumbnail" src="' +
					data.compLogo + '">';
			} else {
				userStoreLogo = '<i class="app-icon icon-store-link"><span class="icon-wrapper"></span></i>';
			}
			userFavoStore = '<div class="user-store-link" data-company-id="' +
				data.compId + '"><ons-button disable-auto-styling modifier="quiet">' +
				userStoreLogo + '</ons-button></div>';
		} else {
			classes += 'no-shop ';
		}
		if (data.isGroup == 1) {
			classes += 'is-group ';
		}
		if (data.comment) {
			title = data.comment;
		} else {
			title = data.company;
		}
		friendSnippet = '<ons-list-item class="friend-item ' +
			classes + '" data-con-id="' +
			data.conId + '" data-user-id="' +
			data.user + '" data-avatar="' +
			data.avatar + '" data-accepted="' +
			data.accepted + '" data-confirm-request="' +
			data.confirmRequest + '" data-name="' +
			data.name + '" data-company="' +
			data.company + '" modifier="longdivider"><div class="inner-link"><div class="left"><img class="list__item__thumbnail" src="' +
			data.avatar + '"></div><div class="center"><span class="list__item__title">' +
			data.name + '</span><span class="list__item__subtitle">' +
			title + '</span></div></div>' +
			userFavoStore + '</ons-list-item>';
		
		return friendSnippet;
	},
	
	getFriendToForwardMsgItem(friend) {
		const friendItem = '<ons-list-item data-con-id="' +
			  friend.conId + '" data-user-id="' +
			  friend.user + '" modifier="longdivider" class="friend-forward-list-item" tappable><label for="' +
			  friend.user + '" class="left"><img class="list__item__thumbnail" src="' +
			  friend.avatar + '"></label><label for="' +
			  friend.user + '" class="center">' +
			  friend.name + '</label><label class="right"><ons-input type="checkbox" class="forward-checkbox" input-id="' +
			  friend.user + '"></ons-input></label></ons-list-item>';
		
		return friendItem;
	},
	
	getFriendToCreateGroup(friend) {
		let friendItem = '';
		if (!friend) {
			// current user
			friendItem = '<ons-list-item modifier="longdivider" class="create-group-list-item"><label for="' +
				myHome.currentUserId + '" class="left"><img class="list__item__thumbnail" src="' +
				myStorage.getUserAvatar() + '"></label><label for="' +
				myHome.currentUserId + '" class="center">' +
				myStorage.getUserFullName() + '</label><label class="right">' +
				'<ons-input type="checkbox" class="create-chat-checkbox" input-id="' +
				myHome.currentUserId + '" disabled="true" checked></ons-input></label></ons-list-item>';
		} else {
			friendItem = '<ons-list-item data-user-id="' +
				friend.user + '" data-user-name="' +
				friend.name + '" data-user-comment="' + 
				friend.comment + '" modifier="longdivider" class="friend-create-group-list-item" tappable><label for="' +
				friend.user + '" class="left"><img class="list__item__thumbnail" src="' +
				friend.avatar + '"></label><label for="' +
				friend.user + '" class="center"><span class="list__item__title">' +
				friend.name + '</span><span class="list__item__subtitle">' +
				friend.comment + '</span></label><label class="right"><ons-input type="checkbox" class="create-chat-checkbox" input-id="' +
				friend.user + '"></ons-input></label>' +
				'</ons-list-item>';
		}
		
		return friendItem;
	},
	
	getRecentMsgSnippet(data) {
		let msgText = '';
		let classes = '';
		let userFavoStore = '';
		let recentSnippet = '';
		if (data.msgType == 'snd') {
			msgText = myTranslations.getTranslation(TXT_MSG_TYPE_VOICE);
		} else if (data.msgType == 'img') {
			msgText = myTranslations.getTranslation(TXT_MSG_TYPE_IMG);
		} else if (data.msgType == 'fil') {
			msgText = myTranslations.getTranslation(TXT_MSG_TYPE_FILE);
		} else {
			msgText = data.chatTxt;
		}
		if (data.isUnRead == 1) {
			classes += 'message-notify ';
		}
		if (data.official == 1) {
			classes += 'official-account ';
		}
		if (data.compId != 0) {
			let userStoreLogo = '';
			if (data.compLogo) {
				userStoreLogo = '<img class="list__item__thumbnail" src="' +
					data.compLogo + '">';
			} else {
				userStoreLogo = '<i class="app-icon icon-store-link"><span class="icon-wrapper"></span></i>';
			}
			userFavoStore = '<div class="user-store-link" data-company-id="' +
				data.compId + '"><ons-button disable-auto-styling modifier="quiet">' +
				userStoreLogo + '</ons-button></div>';
		} else {
			classes += 'no-shop ';
		}
		if (data.isGroup == 1) {
			classes += 'is-group ';
		}
		recentSnippet = '<ons-list-item class="recent-item ' +
			classes + '" data-chat-id="' +
			data.chatId + '" data-con-id="' +
			data.conId + '" data-user-id="' +
			data.user + '" data-name="' +
			data.name + '" data-chat-txt="' +
			msgText + '" modifier="longdivider"><div class="inner-link"><div class="left"><img class="list__item__thumbnail" src="' +
			data.avatar + '"></div><div class="center"><span class="list__item__title">' +
			data.name + '</span><span class="list__item__subtitle">' +
			msgText + '</span></div></div>' +
			userFavoStore + '</ons-list-item>';
		
		return recentSnippet;
	},
	
	getSideNotifItem(notification) {
		let msgText = '';
		if (notification.msgType == 'snd') {
			msgText = myTranslations.getTranslation(TXT_MSG_TYPE_VOICE);
		} else if (notification.msgType == 'img') {
			msgText = myTranslations.getTranslation(TXT_MSG_TYPE_IMG);
		} else if (notification.msgType == 'fil') {
			msgText = myTranslations.getTranslation(TXT_MSG_TYPE_FILE);
		} else {
			msgText = notification.chatTxt;
		}
		// chat stuff should be with inline click events
		const onClick = 'onclick="homeChatClicks.onSideNotificationClick(this)"';
		const notifSnippet = '<ons-list-item class="side-notif-item" modifier="longdivider" ' +
			onClick + ' tappable data-con-id="' +
			notification.conId + '" data-user-id="' +
			notification.user + '" data-name="' +
			notification.name + '"><div class="left"><img class="list__item__thumbnail" src="' +
			notification.avatar + '"></div><div class="center"><span class="list__item__title">' +
			notification.name + '</span><span class="list__item__subtitle">' +
			msgText + '</span></div>' +
			'</ons-list-item>';
		
		return notifSnippet;
	},
	
	getSingleGalleryImageItem(imgThumb, imgOrig) {
		// single-gallery-element - used to find all matching elements and attach gallery plugin, later is removed
		// is-single - used to tell the gallery plugin that it's a single image, and remove some elements from the gallery
		const galleryItem = '<div class="single-gallery-element is-single post-img"><div data-src="' +
			imgThumb + '"><img src="' +
			imgOrig + '"></div></div>';

		return galleryItem;
	},
	
	getGalleryImageItem(imgThumb, imgOrig) {
		const galleryItem = '<a class="full-img-element" href="' +
			  imgThumb + '"><img src="' +
			  imgOrig + '"/></a>';
		
		return galleryItem;
	},
	
	getPhoneContactItem(personName, personNumber) {
		// By default all contacts have Send SMS option in them
		// Later when servers tells if the contact has FavoChat or not, the right-field div is replaced
		const contactSnippet = '<ons-list-item modifier="longdivider" class="contact-list-item" data-person-name="' +
			  personName + '" data-person-number="' +
			  personNumber + '"><div class="center"><span class="list__item__title">' +
			  personName + '</span><span class="list__item__subtitle">' +
			  personNumber + '</span></div><div class="right right-field"><ons-button data-person-number="' +
			  personNumber + '" modifier="quiet" onclick="homeClicks.onPhoneContactSendSms(this)">' +
			  '<ons-icon size="30px" icon="ion-ios-email-outline"></ons-icon></ons-button>' +
			  '</div></ons-list-item>';
		
		return contactSnippet;
	},
	
	getPhoneContactOpenChatItem(person) {
		const openChatButtonItem = '<ons-button data-con-id="' +
			  person.conId + '" data-user-id="' +
			  person.user + '" data-user-name="' +
			  person.name + '" onclick="homeClicks.onPhoneContactOpenChatClick(this)">' +
			  '<ons-icon icon="ion-android-chat"></ons-icon></ons-button>';
		
		return openChatButtonItem;
	},
	
	getPhoneContactSendRequestItem(personNumber) {
		const onClick = 'onclick="homeClicks.onSendFriendContactClick(this)"';
		const sendRequestItem = '<ons-button class="btnContactSendFriend" data-person-number="' +
			  personNumber + '" ' +
			  onClick + '>' + '<ons-icon id="iconAdd" icon="ion-person-add"></ons-icon>' +
			  '<ons-icon id="iconChecked" style="display: none;" icon="ion-android-checkbox-outline">' +
			  '</ons-icon></ons-button>';
		
		return sendRequestItem;
	},
	
	getPhoneContactAlreadySharedItem() {
		const alreadySharedItem = '<ons-button disabled>' +
			  '<ons-icon id="iconChecked" icon="ion-android-checkbox-outline">' +
			  '</ons-icon></ons-button>';
		
		return alreadySharedItem;
	},
	
	getChatSideUser(user) {
		const sideUserItem = '<ons-list-item class="chat-side-list-item friend" data-user-id="' +
			  user.user + '"><div class="left"><img class="avatar" src="' +
			  user.avatar + '"></div><div class="center"><span class="name list-item__title">' +
			  user.name + '</span><span class="comment list-item__subtitle">' +
			  user.comment + '</span></div></ons-list-item>';
		
		return sideUserItem;
	},
	
	
	////////////////////////////////////////////////////////////////////////////
	////////////***********////// Favo360 Items ////////************////////////
	getMerchantCategoryItem(category) {
		// <ul> after every element to append the subcategories in for later
		const subCatList = '<ul class="ons-sub-cat-list list-unstyled" id="' +
			  category.catId + '"></ul>';
		
		const categorySnippet = '<ons-list-item class="category-list-item" modifier="longdivider" ' +
			  'tappable data-expanded="0" data-subcat-loaded="0" id="' +
			  category.catId + '"><div class="center"><span class="list__item__title">' +
			  category.catName + '</span></div><div class="right">' +
			  '<ons-icon class="expand-icon" icon="ion-chevron-right"></ons-icon></div></ons-list-item>' +
			  subCatList;

		return categorySnippet;
	},
	
	getMerchantSubCategoryItem(subCat) {
		const subCatSnippet = '<li><label class="checkbox checkbox--material">' +
			  '<input type="checkbox" data-cat-id="' +
			  subCat.catId + '" class="sub-cat-list-item checkbox__input checkbox--material__input">' +
			  '<div class="checkbox__checkmark checkbox--material__checkmark"></div><span class="label-text">' +
			  subCat.catName +
			  '</span></label></li>';
		
		
		return subCatSnippet;
	},
	
	getFavoMerchantTypeItem(type) {
		let isChecked = '';
		if (type.catChecked == 1) {
			isChecked = 'checked';
		}
		const merchantTypeSnippet = '<ons-list-item tappable><label class="left">' +
			  '<ons-input class="check-merch-type" type="checkbox" input-id="' +
			  type.catId + '" ' +
			  isChecked + '></ons-input></label><label for="' +
			  type.catId + '" class="center">' +
			  type.catName + '</label>' +
			  '</ons-list-item>';
		
		return merchantTypeSnippet;
	},
	
	getProductCategoryItem(category) {		
		// <ul> after every element to append the subcategories in for later
		const subCatList = '<ul class="ons-sub-cat-list list-unstyled" id="' +
			  category.catId + '"></ul>';
		
		const categorySnippet = '<ons-list-item class="category-list-item" ' +
			  ' modifier="longdivider" tappable data-expanded="0" data-subcat-loaded="0" id="' +
			  category.catId + '"><div class="center"><span class="list__item__title">' +
			  category.catName + '</span></div><div class="right">' +
			  '<ons-icon class="expand-icon" icon="ion-chevron-right"></ons-icon></div>' +
			  '</ons-list-item>' +
			  subCatList;
		
		return categorySnippet;
	},
	
	getProductFilterItem(filter) {
		let warnRequired = '';
		let classRequired = '';
		let subFilters = '';
		if (filter.filtReq == 2) {
			warnRequired = '<div class="left"><span id="' +
				filter.filtId + '" class="warning-product-filter notification">!</span></div>';
			classRequired = 'required';
		}
		if (filter.filtMulti == 1) {
			subFilters = appender.getSubFiltersCheckbox(filter);
		} else {
			subFilters = appender.getSubFiltersRadio(filter);
		}
		const filterSnippet = '<ons-list-item id="' +
			  filter.filtId + '" class="filter-list-item ' +
			  classRequired + '" data-expanded="0" modifier="longdivider" tappable>' +
			  warnRequired + '<div class="center">' +
			  filter.filtName + '</div><div class="right">' +
			  '<ons-icon class="expand-icon" icon="ion-chevron-right"></ons-icon></div></ons-list-item>' +
			  '<ons-list style="display: none;" id="' +
			  filter.filtId + '" class="sub-filter-list ' +
			  classRequired + '">' +
			  subFilters +
			  '</ons-list>';

		return filterSnippet;
	},
	
	getSubFiltersCheckbox(parentFilter) {
		let subFiltersList = '';
		for (const filter of parentFilter.filtSub) {
			subFiltersList += '<ons-list-item modifier="longdivider" tappable>' +
				'<label class="left"><ons-input data-parent-id="' +
				parentFilter.filtId + '" class="sub-filter-list-item checkbox" type="checkbox" input-id="' +
				filter.optId + '"></ons-input></label><label for="' +
				filter.optId + '" class="center">' +
				filter.optName + '</label>' +
				'</ons-list-item>';
		}
		return subFiltersList;
	},
	
	getSubFiltersRadio(parentFilter) {
		let subFiltersList = '';
		for (const filter of parentFilter.filtSub) {
			subFiltersList += '<ons-list-item modifier="longdivider" tappable><label class="left"><ons-input data-parent-id="' +
				parentFilter.filtId + '" class="sub-filter-list-item radio" type="radio" name="' +
				parentFilter.filtName + '" input-id="' +
				filter.optId + '"></ons-input></label><label for="' +
				filter.optId + '" class="center">' +
				filter.optName + '</label>' +
				'</ons-list-item>';
		}
		return subFiltersList;
	},
	
	getMeasureListItem(measure) {
		const measureSnippet = '<ons-list-item tappable class="measure-list-item" modifier="longdivider" data-measure-id="' +
			measure.measureId + '" data-measure-name="' +
			measure.measureName + '"></div><div class="center"><span class="list__item__title">' +
			measure.measureName + '</span></div>' +
			'</ons-list-item>';
		
		return measureSnippet;
	},
	
	getSideCompanyCategory(category) {
		const categorySnippet = '<ons-list-header data-cat-id="' +
			  category.catId + '">' +
			  category.catName + '</ons-list-header>';
		
		return categorySnippet;
	},
	
	getSideCompanySubCategory(subCat) {
		const subCatSnippet = '<ons-list-item class="side-company-sub-cat" data-cat-id="' +
			  subCat.catId + '" tappable>' +
			  subCat.catName + '</ons-list-item>';
		
		return subCatSnippet;
	},
	
	////////////////////////////////////////////////////////////////////////////
	/**----------------- Temporary Chat Message Item Snippets ---------------**/
	////////////////////////////////////////////////////////////////////////////
	getTempMessageTxtItem(chatTxt, localId) {
		const avatarSnippet = appender.getMessageAvatar(myStorage.getUserAvatar(), myHome.currentUserId);
		const txtSending = myTranslations.getTranslation(TXT_SENDING);
		const msgSnippet = '<div class="chat-item-right section section-message clear-fix msg-list-item" data-user-id="' +
			  myHome.currentUserId + '" data-local-id="' +
			  localId + '" data-chat-id=""><dl>' +
			  avatarSnippet + '<dt><div class="fL">' +
			  chatTxt + '</div><div class="fR time"></div></dt><dd class="info"><span class="status">' +
			  txtSending + '</span></dd></dl></div>';

		return msgSnippet;
	},
	
	
	////////////////////////////////////////////////////////////////////////////
	/**----------------------- Chat Message Item Snippets -------------------**/
	////////////////////////////////////////////////////////////////////////////
	getMessageAvatar(avatar, user) {
		const avatarClick = 'onclick="homeChatClicks.onChatAvatarClick(this)"';
		const avatarSnippet = '<dd class="img"><img src="' +
			  avatar + '" ' +
			  avatarClick + ' data-user-id="' +
			  user + '"></dd>';
		
		return avatarSnippet;
	},
	
	getMessageTxtItem(data, chatTimestamp, avatarPosition) {
		const avatarSnippet = appender.getMessageAvatar(data.avatar, data.user);
		let classes = '';
		if (data.official == 1) {
			classes += 'official-account ';
		}
		classes += avatarPosition + ' section section-message clear-fix msg-list-item';
		const msgSnippet = '<div class="' +
			  classes + '" data-user-id="' +
			  data.user + '" data-chat-id="' +
			  data.chatId + '"><dl>' +
			  avatarSnippet + '<dt><div class="fL">' +
			  data.chatTxt + '</div><div class="fR time">' +
			  chatTimestamp + '</div></dt><dd class="info"><span class="status"></span></dd></dl></div>';

		return msgSnippet;
	},
	
	getMessageImgItem(data, chatTimestamp, avatarPosition) {
		const avatarSnippet = appender.getMessageAvatar(data.avatar, data.user);
		const firstImg = data.fileArray[0].imgCrop;
		let classes = '';
		let fileCount = '';
		let atrDataImages = '';
		let index = 0;
		let imgElement = '';
		if (data.official == 1) {
			classes += 'official-account ';
		}
		if (data.fileCount > 1) {
			fileCount = '+' + (data.fileCount - 1);
		}
		if (data.fileArray.length == 1) {
			// Only 1 image, directly open lightGallery
			classes += 'is-single ';
			const files = data.fileArray[0];
			imgElement = appender.getSingleGalleryImageItem(files.imgOrig, files.imgCrop);
		} else {
			// Many images, open another screen
			classes += 'is-multiple ';			
			for (const file of data.fileArray) {
				atrDataImages += 'data-img-src-' + index + '="' +
					file.imgOrig + '" data-img-thumb-src-' + index + '="' + file.imgThumb + '" ';
				index++;
			}
			const imgClick = 'onclick="homeChatClicks.onImgElementClick(this)"';
			
			imgElement = '<div class="post-img"><img ' +
				atrDataImages + ' src="' +
				firstImg + '" ' +
				imgClick + '></div><div class="more-images"><span class="count">' +
				fileCount + '</span></div>';
		}
		// file count da se sloji vuv vytre6niq element
		classes += avatarPosition + ' section section-images clear-fix msg-list-item';
		const msgSnippet = '<div class="' +
			  classes + '" data-user-id="' +
			  data.user + '" data-chat-id="' +
			  data.chatId + '"><dl>' +
			  avatarSnippet + '<dt><div class="fL"><div class="post-img-wrapper">' +
			  imgElement + '</div></div><div class="fR time">' +
			  chatTimestamp + '</div></dt><dd class="info"><span class="status"></span></dd></dl></div>';
		
		return msgSnippet;
	},
	
	getMessageSndItem(data, chatTimestamp, avatarPosition) {
		const avatarSnippet = appender.getMessageAvatar(data.avatar, data.user);
		let classes = '';
		if (data.official == 1) {
			classes += 'official-account ';
		}
		classes += avatarPosition + ' section section-audio clear-fix unformatted msg-list-item';
		
		const oldAudio = '<audio src="' +
			  data.file + '" preload="auto"></audio>';
		
		const audioElement = '<audio width="300" height="32" controls="controls">' +
			  '<source src="' +
			  data.file + '" type="audio/mpeg"/></audio>';
		
		const msgSnippet = '<div class="' +
			  classes + '" data-chat-id="' +
			  data.chatId + '" data-user-id="' +
			  data.user + '"><dl>' +
			  avatarSnippet + '<dt><div class="fL">' +
			  oldAudio + '</div><div class="fR time">' +
			  chatTimestamp + '</div></dt><dd class="info"><span class="status"></span></dd></dl></div>';
		
		
		
		const testSnippet = '<div class="chat-item-right section section-audio clear-fix msg-list-item" data-chat-id="' +
			  data.chatId + '" data-user-id="' +
			  data.user + '" data-audio-src="' +
			  data.file + '"><dl><dd class="img"><img src="' +
			  data.avatar + '" onclick="homeChatClicks.onChatAvatarClick(this)" data-user-id="' +
			  data.user + '"></dd><dt><div class="fL"><div class="audioplayer audioplayer-novolume audioplayer-stopped">' +
			  '<div class="audioplayer-playpause" title="Pause"><a href="#">Pause</a></div>' +
			  '<div class="audioplayer-time audioplayer-time-current">00:05</div><div class="audioplayer-bar">' +
			  '<div class="audioplayer-bar-loaded" style="width: 98.2143%;"></div>' +
			  '<div class="audioplayer-bar-played" style="width: 100%;"></div></div></div></div><div class="fR time">' +
			  chatTimestamp + '</div></dt><dd class="info"><span class="status"></span></dd></dl></div>';

		return testSnippet;
	},
	
	getMessageFilItem(data, chatTimestamp, avatarPosition) {
		const avatarSnippet = appender.getMessageAvatar(data.avatar, data.user);
		const fileClick = 'onclick="homeChatClicks.onFileMsgItemClick(\'' + data.file + '\')"';
		let classes = '';
		if (data.official == 1) {
			classes += 'official-account ';
		}
		classes += avatarPosition + ' section section-file clear-fix msg-list-item';
		const msgSnippet = '<div class="' +
			  classes + '" data-user-id="' +
			  data.user + '" data-chat-id="' +
			  data.chatId + '"><dl>' +
			  avatarSnippet + '<dt ' +
			  fileClick + '><div class="fL"><i><img src="' +
			  data.icon + '"></i><span class="text">' +
			  data.fileName + '</span></div><div class="file-size">' +
			  data.size + '</div><div class="fR time">' +
			  chatTimestamp + '</div></dt><dd class="info"><span class="status"></span></dd></dl></div>';
		
		return msgSnippet;
	},
	
	
	////////////////////////////////////////////////////////////////////////////
	/**-------------------------- Outbox Item Snippets ----------------------**/
	////////////////////////////////////////////////////////////////////////////
	getOutboxImgItem(avatar, filePath, index) {
		/*
		const outboxItem = '<ons-list-item modifier="nodivider" class="outboxImgItem" data-current-src="' +
			  filePath + '"><div class="right"><img class="list__item__thumbnail" src="' +
			  avatar + '"></div><img id="currentPendingImg" style="height: 100px; padding-right: 10px;" src="' +
			  filePath + '"><div class="moreImages" id="moreImg">' +
			  index + '</div><ons-progress-circular style="height: 60px; width: 60px;" indeterminate></ons-progress-circular>' +
			  '</ons-list-item>';
		*/
		// DA SE PREPRAVQT KATO GORNITE
		const outboxItem = '<div class="chat-item-right section section-images is-single clear-fix" data-current-src="' +
			  filePath + '"><dl><dd class="img"><img class="user-avatar" src="' +
			  avatar + '"></dd><dt class="msg-list-item"><div class="fL"><div class="post-img-wrapper">' +
			  '<div class="post-img"><img id="currentPendingImg" src="' +
			  filePath + '"></div><div class="more-images"><span class="count">' +
			  index + '</span></div><div class="left">' +
			  '<ons-progress-circular class="outbox-loading" indeterminate></ons-progress-circular></div>' +
			  '</div></div></dt></dl></div>';
		
		
		return outboxItem;
	},
	
	getOutboxFileItem(file) {
		// DA SE PREPRAVQT KATO GORNITE
		const avatar = myStorage.getUserAvatar();
		const outboxItem = '<ons-list-item modifier="nodivider" class="outbox-file-item" data-file-name="' +
			  file.name + '"><div class="left"><ons-progress-circular style="height: 60px; width: 60px;" indeterminate>' +
			  '</ons-progress-circular></div><div class="center"><span class="list__item__subtitle">' +
			  file.name + '</span></div><div class="right"><img class="list__item__thumbnail" src="' +
			  avatar + '"></div>' +
			  '</ons-list-item>';
		
		debugger;
		return outboxItem;
	}
};