//** CONTENTS **//
// favoPages - for initial loading of pages in the Favo360 section
// favoPagesLocalizations - for pages translations

const favoPages = {
	
	initPageFavoSite() {
		favoPagesLocalizations.translatePageFavo360();
		//favo360api.favoNumbers();
		// Initialization and callback function in favo-api.js favoNumbersLoaded()
		const token = myStorage.getFavoToken();
		if (token) {
			myAjax.getCompanyInfo(token, response => {
				if (response.companyType.length == 0) {
					favoPages.disableFavo360(myTranslations.getTranslation(TXT_COMPLETE_YOUR_REG), PAGE_FAVO_REG_MERCHANT_TYPE);
				} else if (response.companyCat.length == 0) {
					favoPages.disableFavo360(myTranslations.getTranslation(TXT_COMPLETE_YOUR_REG), PAGE_FAVO_REG_MERCHANT_CATEGORIES);
				} else {
					// all ok
					favoPages.enableFavo360();
				}
				$('#pageFavoSite').attr('data-favo-loaded', 1);
			});
		} else {
			const btnText = myTranslations.getTranslation(TXT_JOIN_NOW);
			favoPages.disableFavo360(btnText, PAGE_FAVO_REG);
			$('#pageFavoSite').attr('data-favo-loaded', 1);
		}
	},
	
	disableFavo360(btnText, page) {
		favoClicks.setRegisterForFavo360Button(btnText, page);
		$('.favo-join-now').show();
		$('.favo-item:not(.inactive)').attr('disabled', true);
		$('.favo-item:not(.inactive)').addClass('disabled');
		$('#pageFavoSite .title-loading').hide();
	},
	
	enableFavo360() {
		favoClicks.setPageFavoSiteClicks();
		$('.favo-item:not(.inactive)').attr('disabled', false);
		$('.favo-item:not(.inactive)').removeClass('disabled');
		$('.favo-join-now').hide();
		$('#pageFavoSite .title-loading').hide();
	},
	
	initPageFavoReg() {
		favoClicks.setPageFavoRegClicks();
		favoPagesLocalizations.translatePageFavoReg();
		$('#inputName').val(myStorage.getUserFullName());
		$('#inputPhone').val(myStorage.getUserCountryPhoneCode() + myStorage.getUserPhone());
		$('#inputCountry').val(myStorage.getUserCountryName());
		$('#inputCountry').attr('data-country-code', myStorage.getUserCountryCode());
		$('#pageFavoReg .title-loading').hide();
	},
	
	initPageFavoCities(data) {
		$('#pageFavoCities').attr('data-input-element', data.inputElement);
		$('#pageFavoCities').attr('data-country-code', data.countryCode);
		favoPagesLocalizations.translatePageFavoCities();
		favoClicks.setPageFavoCitiesEvents();
		$('#pageFavoCities .title-loading').hide();
		/*
		myAjax.requestCities(data.countryCode, response => {
			let citiesList = '';
			for (const city of response) {
				citiesList += appender.getCityItem(city);
			}
			$('#listCities').append(citiesList);
			
			$('#pageFavoCities .title-loading').hide();
		});
		*/
	},
	
	initPageFavoCurrencies(inputElement) {
		$('#pageFavoCurrencies').attr('data-input-element', inputElement);
		favoPagesLocalizations.translatePageCurrencies();
		myAjax.getCurrencies((response) => {
			let currenciesList = '';
			for (const currency of response) {
				currenciesList += appender.getCurrencyItem(currency);
			}
			$('#listCurrencies').append(currenciesList);
			favoClicks.setPageFavoCurrenciesClicks();
			$('#pageFavoCurrencies .title-loading').hide();
		});
	},
	
	initPageFavoRegMerchantType() {
		favo360api.companyType();
		// success callback in favo-api.js function typeIsChecked()
	},
	
	initPageFavoRegCategories() {
		favoPagesLocalizations.translatePageFavoRegMerchantCategories();
		favoClicks.setPageFavoRegCategoriesToolbarButton();
		const listElement = 'listMerchantCategories';
		myFavoCategories.loadFavoCategories(listElement);
	},
	
	initPageMyCompany() {
		favoClicks.setPageMyCompanyClicks();
		favoPagesLocalizations.translatePageMyCompany();
		myAjax.getCompanyInfo(myStorage.getFavoToken(), response => {
			// Tab Info
			const companyInfo = response.companyInfo[0];
			const companyType = response.companyType;
			const companyCategory = response.companyCat;
			$('#inputCompanyName').val(companyInfo.companyName);
			$('#inputCompanyCity').val(companyInfo.companyCityName);
			$('#inputCompanyCity').attr('data-city-id', companyInfo.companyCityId);
			$('#inputCompanyAddress').val(companyInfo.companyAddress);
			$('#inputCompanyCountry').val(companyInfo.companyCountryName);
			$('#inputCompanyCountry').attr('data-country-code', companyInfo.companyCountryCode);
			$('#inputCompanyCurrency').val(companyInfo.companyCurrency);
			$('#inputCompanyVAT').val(companyInfo.companyVAT);
			let merchantTypesList = '';
			for (const type of companyType) {
				merchantTypesList += appender.getFavoMerchantTypeItem(type);
			}
			$('#checkboxField').append(merchantTypesList);
			// Tab Categories
			const page = 'pageFavoSiteMyCompany';
			const list = 'listCompanyInfoCategories';
			myFavoCategories.loadFavoCategories(list, page, companyCategory, () => {
				$('#pageFavoSiteMyCompany .title-loading').hide();
			});
		});
	},
	
	initPageTimeline() {
		favoPagesLocalizations.translatePageTimeline();
		favoClicks.setPageTimelineEvents();
		favo360api.loadTimeline();
		// Callback in favo-api.js timelineLoaded()
	},
	
	initPageMyStore() {
		favoPagesLocalizations.translatePageMyStore();
		favo360api.listStoreItems('', '');
		// Callback and clicks in favo-api.js itemLinksHookUp()
	},
	
	initPageFavorites() {
		favoPagesLocalizations.translatePageFavorites();
		favoClicks.setPageFavoritesClicks();
		favo360api.favList();
		favo360api.groupsList();
		// Callback in favo-api.js groupsLoaded()
	},
	
	initPageProducts() {
		favoPagesLocalizations.translatePageProducts();
		favoClicks.setPageProductsEvents();
		favo360api.companiesProducts('','','');
		// Callback in favo-api.js companiesProductsLoaded()
	},
	
	initPageStatistics() {
		favoPagesLocalizations.translatePageStatistics();
		favo360api.listStats();
		// Callback in favo-api.js statsLoaded()
	},
	
	initPageSearch() {
		favoClicks.setPageSearchEvents();
		favoPagesLocalizations.translatePageSearch();
		const categoryName = $('#pageFavoSite').attr('data-category-name');
		const categoryCode = $('#pageFavoSite').attr('data-category-code');
		const countryName = $('#pageFavoSite').attr('data-country-name');
		const countryCode = $('#pageFavoSite').attr('data-country-code');
		if (categoryCode || countryCode) {
			$('#btnSearchInFavo').prop('disabled', false);
		}
		$('#inputCategory').val(categoryName);
		$('#inputCategory').attr('data-category-code', categoryCode);
		$('#inputCountry').val(countryName);
		$('#inputCountry').attr('data-country-code', countryCode);
		$('#pageFavoSiteSearch .title-loading').hide();
	},
	
	initPageSearchResults(data) {
		favoPagesLocalizations.translatePageSearchResults();
		favo360api.listComp(data.category, data.country, data.keyword);
		// Callback in favo-api.js compListLoaded()	
	},
	
	initPageFavoCountries() {
		favoPagesLocalizations.translatePageFavoCountries();
		myAjax.getFavoCountries((response) => {
			if (response[0]) {
				let countriesList = '';
				for (const country of response) {
					countriesList += appender.getFavoCountryItem(country);
				}
				$('#listFavoCountries').append(countriesList);
				favoClicks.setPageFavoCountriesClicks();
			}
			$('#pageFavoSiteCountries .title-loading').hide();
		});
	},
	
	initPageAddGroup() {
		favoPagesLocalizations.translatePageAddGroup();
		favoClicks.setPageAddGroupEvents();
		$('#pageFavoSiteAddGroup .title-loading').hide();
	},
	
	initPagePayment() {
		favoPagesLocalizations.translatePagePayment();
		favoClicks.setPagePaymentEvents();
		myAjax.getCompanyPayment(response => {
			$('#inputBankName').val(response.payments.bankName);
			$('#inputIBAN').val(response.payments.iban);
			$('#inputBIC').val(response.payments.bic);
			$('#inputPayPal').val(response.payments.paypal);
			$('#inputAliPay').val(response.payments.alipay);
			$('#imgPayPal').attr('src', response.img.paypal);
			$('#imgAliPay').attr('src', response.img.alipay);
			$('#pageFavoSitePayment .title-loading').hide();
		});
	},
	
	initPageEditProduct(itemId) {
		favoPagesLocalizations.translatePageEditProduct();
		favoClicks.setPageEditProductEvents();
		$('#pageFavoSiteEditProduct').attr('data-item-id', itemId);
		myQuill.load('.quill-editor');
		myAjax.getProductInfo(itemId, response => {
			const data = response.itemInfo[0];
			const images = response.itemImages[0];
			const categories = response.itemCat;
			
			//--------------------------- Product Info -----------------------//
			$('#imgProduct').attr('src', images.imgIm);
			if (data.itemNoName == 1) {
				$('#inputSKUInsteadOfName').prop('checked', true);
			} else {
				$('#inputSKUInsteadOfName').prop('checked', false);
			}
			if (data.itemFeat == 1) {
				$('#inputFeatured').prop('checked', true);
			} else {
				$('#inputFeatured').prop('checked', false);
			}
			if (data.itemNew == 1) {
				$('#inputNewArrivals').prop('checked', true);
			} else {
				$('#inputNewArrivals').prop('checked', false);
			}
			if (data.itemClear == 1) {
				$('#inputClearance').prop('checked', true);
			} else {
				$('#inputClearance').prop('checked', false);
			}
			
			$('#inputProductName').val(data.itemName);
			if (!data.itemCode) {
				$('#warnProductCode').text('!');
				$('#tabProductInfo .notification').text('!');
			} else {
				$('#inputProductCode').val(data.itemCode);
			}
			if (!data.itemMeasure) {
				$('#warnProductMeasure').text('!');
				$('#tabProductInfo .notification').text('!');
			} else {
				$('#inputProductMeasure').attr('data-measure-id', data.itemMeasure);
				$('#inputProductMeasure').val(data.itemMeasureText);
			}
			if (!data.itemWeightType) {
				$('#radioProductWeightTypeKg').prop('checked', true);
			} else {
				if (data.itemWeightType == 'kg') {
					$('#radioProductWeightTypeKg').prop('checked', true);
				} else if (data.itemWeightType == 'gr') {
					$('#radioProductWeightTypeGr').prop('checked', true);
				}
			}
			if (data.itemNegotiate == 0) {
				$('#inputPriceNegotiate').prop('checked', false);
			} else {
				$('#inputPriceNegotiate').prop('checked', true);
			}

			$('#inputProductWeight').val(data.itemWeight);
			$('#inputProductVolume').val(data.itemVol);
			$('#inputProductWidth').val(data.itemWidth);
			$('#inputProductHeight').val(data.itemHeight);
			$('#inputProductLength').val(data.itemLength);
			$('#inputProductCurrency').val(data.itemCrncy);
			$('#inputProductPrice').val(data.itemPrice);
			$('#inputProductText .ql-editor').html(data.itemText);
			$('#inputProductQuantity').val(data.itemQty);
			$('#inputProductComment').val(data.itemComment);
			
			//************************* Product Categories *************************//
			let selectedCategories = response.itemCatSubSelected;
			if (selectedCategories.length == 0) {
				$('#tabProductCategories .notification').text('!');
			} else {
				let newSelectedCatList = [];
				for (const cat of selectedCategories) {
					newSelectedCatList.push(cat.catId);
				}
				selectedCategories = JSON.stringify(newSelectedCatList);
				$('#pageFavoSiteEditProduct').attr('data-selected-categories', selectedCategories);
			}
			let categoriesList = '';
			for (const category of categories) {
				categoriesList += appender.getProductCategoryItem(category);
			}
			$('#listProductCategories').append(categoriesList);
			$('.category-list-item').on('click', favoClicks.onProductCatClick);

			//************************* Product Filters *************************//
			let selectedFilters = response.itemFiltSelected;
			if (selectedFilters.length != 0) {
				let newSelectedFiltList = [];
				for (const filter of selectedFilters) {
					newSelectedFiltList.push(filter.filtId);
				}
				selectedFilters = JSON.stringify(newSelectedFiltList);
				$('#pageFavoSiteEditProduct').attr('data-selected-filters', selectedFilters);
			}
			$('#pageFavoSiteEditProduct .title-loading').hide();
		});
	},
	
	initPageEditGroup(data) {
		favoPagesLocalizations.translatePageEditGroup();
		favoClicks.setPageEditGroupEvents();
		$('#pageFavoSiteEditGroup').attr('data-group-id', data.groupId);
		$('#inputGroupName').val(data.groupName);
		$('#pageFavoSiteEditGroup .title-loading').hide();
		favo360api.companiesInGroup(data.groupId);
		// Callback in favo-api.js favListGropLodaded()
	},
	
	initPageEditProductImages(itemId) {
		favoPagesLocalizations.translatePageEditProductImages();
		$('#pageFavoSiteEditProductImages').attr('data-item-id', itemId);
		favoClicks.setPageEditProductImagesClicks();
		favo360api.itemImages(itemId);
		// Callback in favo-api.js imgLoaded()
		// Callback for re-ordering imgListRefresh()
	},
	
	initPageViewCompany(companyId) {
		favoPagesLocalizations.translatePageViewCompany();
		$('#pageFavoSiteViewCompany').attr('data-company-id', companyId);
		myHome.updateBottomCartNotification();
		favo360api.companyInfo(companyId);
		// Callback in favo-api.js companyInfoLoaded()
		
		myAjax.getCompanyCategoriesSideMenu(companyId, response => {
			//debugger;
			let sideListCategories = '';
			for (const category of response) {
				sideListCategories += appender.getSideCompanyCategory(category);
				for (const subCat of category.catSub) {
					sideListCategories += appender.getSideCompanyCategory(subCat);
					for (const subSubCat of subCat.catSub) {
						sideListCategories += appender.getSideCompanySubCategory(subSubCat);
					}
				}
			}
			
			$('#sideCompanyCategories').append(sideListCategories);
			favoClicks.setPageViewCompanyEvents();
			// 
		});
		
		
		// FOR TESTING	
		$('#inputSearchCompany').on('keyup', function () {
			let txt = this.value;
			let clear = 0;
			if (!txt) {
				clear = 1;
			}
			
			const compId = $('#pageFavoSiteViewCompany').attr('data-company-id');
			favo360api.companyProdSearch(compId, txt, clear);
		});
		const newId = 'srch-prod-pub-val-' + companyId;	
		$('#inputSearchCompany').attr('id', newId);
		// FOR TESTING	
	},
	
	initPageViewProduct(productId) {
		$('#pageFavoSiteViewProduct .title-loading').show();
		favoPagesLocalizations.translatePageViewProduct();
		$('#pageFavoSiteViewCompany').attr('data-product-id', productId);
		myHome.updateBottomCartNotification();
		favo360api.prodDetails(productId);
		// Callback in favo-api.js prodIsLoaded()
	},
	
	initPageMeasure() {
		favoPagesLocalizations.translatePageMeasure();
		myAjax.getMeasures(response => {
			let measures = '';
			for (const measure of response) {
				measures += appender.getMeasureListItem(measure);
			}
			$('#listMeasures').append(measures);
			favoClicks.setMeasureListItemsClicks();
			$('#pageFavoSiteMeasure .title-loading').hide();
		});
	},
	
	initPageCart() {
		favoPagesLocalizations.translatePageCart();
		favo360api.shoppingCart();
		// Callback in favo-api.js cartIsLoaded()
	},
	
	initPagePrices() {
		favoPagesLocalizations.translatePagePrices();
		favo360api.listPrices();
		// Callback in favo-api.js pricesLoaded()
	},
	
	initPageDeliveries() {
		favoPagesLocalizations.translatePageDeliveries();
		favo360api.listDeliveries(1);
		favoClicks.setPageDeliveriesClicks();
		// Callback in favo-api.js deliveriesLoaded()
	},
	
	initPageOrders() {
		favoPagesLocalizations.translatePageOrders();
		favoClicks.setPageOrdersClicks();
	},
	
	loadPageOrders() {
		const ordersTabLoaded = $('#pageFavoSiteOrders').attr('data-tab-loaded');
		favo360api.listOrders(ordersTabLoaded);
		// Callback in favo-api.js ordersLoaded()
	},
	
	initPageOrderDetails(orderId) {
		favoPagesLocalizations.translatePageOrderDetails();
		favoClicks.setPageOrderDetailsEvents();
		favo360api.orderDetails(orderId);
		// Callback in favo-api.js orderIsLoaded()
	},
	
	initPageDeliveryDetails(deliveryId) {
		$('#loadingOrderDetails').show();
		favoPagesLocalizations.translatePageDeliveryDetails();
		favoClicks.setPageDeliveryDetailsEvents();
		favo360api.deliveryDetails(deliveryId);
		// Callback in favo-api.js deliveryIsLoaded()
	},
	
	initPageSendEnquiry(data) {
		favoClicks.setPageSendEnquiryEvents();
		favoPagesLocalizations.translatePageSendEnquiry();
		if (data.productImg) {
			// Enquiry about product
			$('#imgProductSendEnquiry').attr('src', data.productImg);
			$('#pageFavoSiteSendEnquiry').attr('data-img-id', data.productImgId);
			$('#pageFavoSiteSendEnquiry').attr('data-product-id', data.productId);
		} else if (data.orderId) {
			// Enquiry about order
			$('#pageFavoSiteSendEnquiry').attr('data-order-id', data.orderId);
		}
		$('#pageFavoSiteSendEnquiry').attr('data-company-id', data.companyId);
		$('#pageFavoSiteSendEnquiry .title-loading').hide();
	},
	
	initPageCompanyGallery(companyId) {
		favoPagesLocalizations.translatePageCompanyGallery();
		myAjax.getCompanyGallery(companyId, response => {
			let imgList = '';
			for (const img of response) {
				const imageItem = appender.getGalleryImageItem(img.imgTh, img.imgOr);
				imgList += imageItem;
			}
			$('#lightgallery').append(imgList);
			myLightGallery.loadGallery('#lightgallery');
			$('#pageFavoSiteCompanyGallery .title-loading').hide();
		});
	},
	
	initPageSendPdfEmail(data) {
		favoPagesLocalizations.translatePageSendPdfEmail();
		favoClicks.setPageSendPdfEmailEvents();
		$('#pageFavoSendPdfEmail').attr('data-order-id', data.orderId);
		$('#pageFavoSendPdfEmail').attr('data-order-num', data.orderNum);
		$('#pageFavoSendPdfEmail').attr('data-type', data.type);
		$('#inputEmailOrderNum').val(data.orderNum);
		$('#attachmentItem .label').text(data.type + '-' + data.orderNum + '.pdf');
		myQuill.load('.quill-editor');
		$('#pageFavoSendPdfEmail .title-loading').hide();
	}
};

const favoDialogs = {
	
	showDialogPrices(error) {
		ons.createDialog(DIALOG_OPEN_PRICES).then(dialog => {
			favoPagesLocalizations.translateDialogProductPicture();
			$(dialog).find('#dialogText').text(error);
			$(dialog).find('#btnOpenPrices').text('Open prices');
			$(dialog).find('#btnClose').text(myTranslations.getTranslation(TXT_CANCEL));
			dialog.show();
		});
	}
};

const favoPagesLocalizations = {
	
	translatePageFavo360() {
		$('#pageFavoSite .title-label').text(myTranslations.getTranslation(TXT_FAVO_360));
		$('#liTimeline .label').text(myTranslations.getTranslation(TXT_TIMELINE));
		$('#liMyCompany .label').text(myTranslations.getTranslation(TXT_MY_COMPANY));
		$('#liProducts .label').text(myTranslations.getTranslation(TXT_PRODUCTS));
		$('#liMyStore .label').text(myTranslations.getTranslation(TXT_MY_STORE));
		$('#liFavorites .label').text(myTranslations.getTranslation(TXT_FAVORITES));
		$('#liOrders .label').text(myTranslations.getTranslation(TXT_ORDERS));
		$('#liDeliveries .label').text(myTranslations.getTranslation(TXT_DELIVERIES));
		$('#liCart .label').text(myTranslations.getTranslation(TXT_CART));
		$('#liPrices .label').text(myTranslations.getTranslation(TXT_PRICES));
		$('#liStatistics .label').text(myTranslations.getTranslation(TXT_STATISTICS));
		$('#liPayment .label').text(myTranslations.getTranslation(TXT_PAYMENT));
	},
	
	translatePageFavoReg() {
		$('#pageFavoReg .title-label').text(myTranslations.getTranslation(TXT_REGISTRATION));
		$('#inputName').attr('placeholder', myTranslations.getTranslation(TXT_FULL_NAME));
		$('#inputPhone').attr('placeholder', myTranslations.getTranslation(TXT_PHONE_NUMBER));
		$('#inputCountry').attr('placeholder', myTranslations.getTranslation(TXT_COUNTRY));
		$('#inputCities').attr('placeholder', myTranslations.getTranslation(TXT_CITY));
		$('#inputAddress').attr('placeholder', myTranslations.getTranslation(TXT_ADDRESS));
		$('#inputCompany').attr('placeholder', myTranslations.getTranslation(TXT_COMPANY));
		$('#inputCurrency').attr('placeholder', myTranslations.getTranslation(TXT_CURRENCY));
		$('#btnRegister').text(myTranslations.getTranslation(TXT_SIGN_UP));
	},
	
	translatePageFavoRegMerchantType() {
		$('#pageFavoRegMerchantType .title-label').text(myTranslations.getTranslation(TXT_MERCHANT_TYPE));
		$('[for="rwm-t15"]').text(myTranslations.getTranslation(TXT_RETAIL));
		$('[for="rwm-t16"]').text(myTranslations.getTranslation(TXT_WHOLESALE));
		$('[for="rwm-t17"]').text(myTranslations.getTranslation(TXT_MANUFACTURERS));
		$('#btnConfirmMerchantType').text(myTranslations.getTranslation(TXT_CONFIRM));
	},
	
	translatePageFavoRegMerchantCategories() {
		$('#pageFavoRegMerchantCategories .title-label').text(myTranslations.getTranslation(TXT_CATEGORIES));
		$('#btnToolbarCompleteFavoReg').text(myTranslations.getTranslation(TXT_SAVE));
	},
	
	translatePageSearch() {
		$('#pageFavoSiteSearch .title-label').text(myTranslations.getTranslation(TXT_SEARCH));
		$('#inputCategory').attr('placeholder', myTranslations.getTranslation(TXT_CATEGORY));
		$('#inputCountry').attr('placeholder', myTranslations.getTranslation(TXT_COUNTRY));
		$('#inputKeyword').attr('placeholder', myTranslations.getTranslation(TXT_KEYWORD));
		$('#btnSearchInFavo').text(myTranslations.getTranslation(TXT_SEARCH));
	},
	
	translateDialogSearchCategory() {
		$('#labelRetail').text(myTranslations.getTranslation(TXT_RETAIL));
		$('#labelWholesale').text(myTranslations.getTranslation(TXT_WHOLESALE));
		$('#labelManufacturers').text(myTranslations.getTranslation(TXT_MANUFACTURERS));
	},
	
	translatePageMyCompany() {
		$('#pageFavoSiteMyCompany .title-label').text(myTranslations.getTranslation(TXT_MY_COMPANY));
		$('#labelMyCompanyInfo').text(myTranslations.getTranslation(TXT_INFO));
		$('#labelMyCompanyCategories').text(myTranslations.getTranslation(TXT_CATEGORIES));
		$('#inputCompanyName').attr('placeholder', myTranslations.getTranslation(TXT_BUSINESS_NAME));
		$('#inputCompanyCity').attr('placeholder', myTranslations.getTranslation(TXT_CITY));
		$('#inputCompanyAddress').attr('placeholder', myTranslations.getTranslation(TXT_ADDRESS));
		$('#inputCompanyCountry').attr('placeholder', myTranslations.getTranslation(TXT_COUNTRY));
		$('#inputCompanyCurrency').attr('placeholder', myTranslations.getTranslation(TXT_CURRENCY));
		$('#inputCompanyVAT').attr('placeholder', myTranslations.getTranslation(TXT_VAT));
		$('#labelRetail').text(myTranslations.getTranslation(TXT_RETAIL));
		$('#labelWholesale').text(myTranslations.getTranslation(TXT_WHOLESALE));
		$('#labelManufacturer').text(myTranslations.getTranslation(TXT_MANUFACTURERS));
		$('#labelSelectActivity').text(myTranslations.getTranslation(TXT_SELECT_ACTIVITY));
		$('#btnBottomMyCompanyUpdateInfo').text(myTranslations.getTranslation(TXT_SAVE));
	},
	
	translatePageEditProduct() {
		$('#labelSKUInsteadOfName').text(myTranslations.getTranslation(TXT_SHOW_SKU_INSTEAD_OF_NAME));
		$('#labelClearance').text(myTranslations.getTranslation(TXT_CLEARANCE));
		$('#labelNewArrivals').text(myTranslations.getTranslation(TXT_NEW_ARRIVALS));
		$('#labelFeatured').text(myTranslations.getTranslation(TXT_FEATURED));
		$('#inputProductWeight').attr('placeholder', myTranslations.getTranslation(TXT_WEIGHT));
		$('#inputProductName').attr('placeholder', myTranslations.getTranslation(TXT_NAME));
		$('#inputProductCode').attr('placeholder', myTranslations.getTranslation(TXT_SKU_CODE));
		$('#inputProductVolume').attr('placeholder', myTranslations.getTranslation(TXT_VOLUME_OF_BOX) + ' m³');
		$('#inputProductWidth').attr('placeholder', myTranslations.getTranslation(TXT_WIDTH) + ' cm');
		$('#inputProductHeight').attr('placeholder', myTranslations.getTranslation(TXT_HEIGHT) + ' cm');
		$('#inputProductLength').attr('placeholder', myTranslations.getTranslation(TXT_LENGTH) + ' cm');
		$('#inputProductCurrency').attr('placeholder', myTranslations.getTranslation(TXT_CURRENCY));
		$('#labelPriceNegotiate').text(myTranslations.getTranslation(TXT_PRICE_NEGOTIABLE));
		$('#inputProductPrice').attr('placeholder', myTranslations.getTranslation(TXT_PRICE));
		$('#pageFavoSiteEditProduct .title-label').text(myTranslations.getTranslation(TXT_EDIT_PRODUCT));
		$('#inputProductQuantity').attr('placeholder', myTranslations.getTranslation(TXT_QUANTITY));
		$('#inputProductMeasure').attr('placeholder', myTranslations.getTranslation(TXT_MEASURE));
		$('#inputProductComment').attr('placeholder', myTranslations.getTranslation(TXT_COMMENT_PRODUCT));
		$('#labelProductDescription').text(myTranslations.getTranslation(TXT_DESCRIPTION));
		$('#tabProductInfo .label').text(myTranslations.getTranslation(TXT_INFO));
		$('#tabProductCategories .label').text(myTranslations.getTranslation(TXT_CATEGORIES));
		$('#tabProductFilters .label').text(myTranslations.getTranslation(TXT_FILTERS));
		$('#btnProductUpdateInfo').text(myTranslations.getTranslation(TXT_SAVE));
		$('#warnNoCategories').text(myTranslations.getTranslation(TXT_SELECT_CATEGORIES_FIRST));
		$('#stepOneTitle span').text(myTranslations.getTranslation(TXT_REQUIRED_FIELDS));
		$('#stepTwoTitle span').text(myTranslations.getTranslation(TXT_OPTIONAL_FIELDS));
		$('#stepThreeTitle span').text(myTranslations.getTranslation(TXT_PRIVATE_INFO));
	},
	
	translatePageOrders() {
		$('#pageFavoSiteOrders .title-label').text(myTranslations.getTranslation(TXT_ORDERS));
		$('#btnLabelOrdersPending').text(myTranslations.getTranslation(TXT_PENDING));
		$('#btnLabelOrdersCompleted').text(myTranslations.getTranslation(TXT_COMPLETED));
	},
	
	translatePageCart() {
		$('#pageFavoSiteCart .title-label').text(myTranslations.getTranslation(TXT_CART));
	},
	
	translatePageDeliveries() {
		$('#pageFavoSiteDeliveries .title-label').text(myTranslations.getTranslation(TXT_DELIVERIES));
		$('#labelTabPending').text(myTranslations.getTranslation(TXT_PENDING));
		$('#labelTabCompleted').text(myTranslations.getTranslation(TXT_COMPLETED));
	},
	
	translatePageFavorites() {
		$('#pageFavoSiteFavorites .title-label').text(myTranslations.getTranslation(TXT_FAVORITES));
		$('#btnLabelFavorites').text(myTranslations.getTranslation(TXT_FAVORITES));
		$('#btnLabelGroups').text(myTranslations.getTranslation(TXT_GROUPS));
	},
	
	translatePageStatistics() {
		$('#pageFavoSiteStatistics .title-label').text(myTranslations.getTranslation(TXT_STATISTICS));
	},
	
	translatePageViewProduct() {
		$('#pageFavoSiteViewProduct .title-label').text(myTranslations.getTranslation(TXT_PRODUCT));
		$('#btnBottomViewProductOpenChat .btn-text').text(myTranslations.getTranslation(TXT_CHAT));
		$('#btnBottomViewProductCart .btn-text').text(myTranslations.getTranslation(TXT_CART));
	},
	
	translatePageMyStore() {
		$('#pageFavoSiteMyStore .title-label').text(myTranslations.getTranslation(TXT_MY_STORE));
		$('#srch-prod-val').attr('placeholder', myTranslations.getTranslation(TXT_SEARCH_IN_STORE));
	},
	
	translatePageOrderDetails() {
		$('#pageFavoSiteOrderDetails .title-label').text(myTranslations.getTranslation(TXT_ORDER));
		$('#btnBottomOrderDetailsSendEnquiry').text(myTranslations.getTranslation(TXT_SEND_MSG));
	},
	
	translatePageDeliveryDetails() {
		$('#pageFavoSiteDeliveryDetails .title-label').text(myTranslations.getTranslation(TXT_DELIVERY));
		$('#btnDeliveryDetailsSendEnquiry').text(myTranslations.getTranslation(TXT_SEND_MSG));
	},
	
	translatePageSendEnquiry() {
		$('#pageFavoSiteSendEnquiry .title-label').text(myTranslations.getTranslation(TXT_SEND_ENQUIRY));
		$('#btnSendEnquiry').text(myTranslations.getTranslation(TXT_SEND));
	},
	
	translatePageCompanyGallery() {
		$('#pageFavoSiteCompanyGallery .title-label').text(myTranslations.getTranslation(TXT_GALLERY));
	},
	
	translatePageViewCompany() {
		$('#btnContactCompany .btn-text').text(myTranslations.getTranslation(TXT_CHAT));
		$('#btnCartCompany .btn-text').text(myTranslations.getTranslation(TXT_CART));
		$('#inputSearchCompany').attr('placeholder', myTranslations.getTranslation(TXT_SEARCH_IN_STORE));
	},
	
	translateDialogProductPicture() {
		$('#labelBtnCamera').text(myTranslations.getTranslation(TXT_CAMERA));
		$('#labelBtnGallery').text(myTranslations.getTranslation(TXT_GALLERY));
	},
	
	translatePageEditProductImages() {
		$('#pageFavoSiteEditProductImages .title-label').text(myTranslations.getTranslation(TXT_PRODUCT_IMAGES));
	},
	
	translatePageSearchResults() {
		$('#pageFavoSiteSearchResults .title-label').text(myTranslations.getTranslation(TXT_SEARCH_RESULTS));
	},
	
	translatePageSendPdfEmail() {
		$('#pageFavoSendPdfEmail .title-label').text(myTranslations.getTranslation(TXT_SEND_EMAIL));
		$('#btnBottomSendEmail').text(myTranslations.getTranslation(TXT_SEND));
		$('#inputEmailOrderNum').attr('placeholder', myTranslations.getTranslation(TXT_ORDER_NUMBER));
		$('#inputEmailAddress').attr('placeholder', myTranslations.getTranslation(TXT_EMAIL));
	},
	
	translatePagePrices() {
		$('#pageFavoSitePrices .title-label').text(myTranslations.getTranslation(TXT_PRICES));
	},
	
	translatePageEditGroup() {
		$('#inputGroupName').attr('placeholder', myTranslations.getTranslation(TXT_GROUP_NAME));
		$('#btnBottomEditGroup').text(myTranslations.getTranslation(TXT_SAVE));
		$('#pageFavoSiteEditGroup .title-label').text(myTranslations.getTranslation(TXT_EDIT_GROUP));
	},
	
	translatePageProducts() {
		$('#pageFavoSiteProducts .title-label').text(myTranslations.getTranslation(TXT_PRODUCTS));
	},
	
	translatePageAddGroup() {
		$('#inputGroupName').attr('placeholder', myTranslations.getTranslation(TXT_GROUP_NAME));
		$('#pageFavoSiteAddGroup .title-label').text(myTranslations.getTranslation(TXT_ADD_GROUP));
		$('#btnAddGroup').text(myTranslations.getTranslation(TXT_ADD_GROUP));
	},
	
	translatePagePayment() {
		$('#inputBankName').attr('placeholder', myTranslations.getTranslation(TXT_BANK_NAME));
		$('#pageFavoSitePayment .title-label').text(myTranslations.getTranslation(TXT_PAYMENT));
		$('#btnBottomSavePaymentMethod').text(myTranslations.getTranslation(TXT_SAVE));
		$('#labelWireTransfer').text(myTranslations.getTranslation(TXT_WIRE_TRANSFER));
	},
	
	translatePageTimeline() {
		$('#labelSubscribeToNewsfeed').text(myTranslations.getTranslation(TXT_SUBSCRIBE_TO_NEWSFEED));
		$('#pageFavoSiteTimeline .title-label').text(myTranslations.getTranslation(TXT_TIMELINE));
	},
	
	translatePageMeasure() {
		$('#pageFavoSiteMeasure .title-label').text(myTranslations.getTranslation(TXT_SELECT_MEASUREMENT));
	},
	
	translatePageFavoCountries() {
		$('#inputSearchFavoCountries').attr('placeholder', myTranslations.getTranslation(TXT_COUNTRY));
	},
	
	translatePageCurrencies() {
		$('#pageFavoCurrencies .title-label').text(myTranslations.getTranslation(TXT_CURRENCY));
	},
	
	translatePageFavoCities() {
		$('#inputSearchCities').attr('placeholder', myTranslations.getTranslation(TXT_CITY));
		$('#hintEnterName').text(myTranslations.getTranslation(TXT_ENTER_CITY_NAME));
	}
};