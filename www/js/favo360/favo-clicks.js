const favoClicks = {
	
	setPageFavoSiteClicks() {
		$('#liTimeline').on('click', () => {
			myHome.pushPage(PAGE_FAVO_TIMELINE);
		});
		$('#liOrders').on('click', () => {
			myHome.pushPage(PAGE_FAVO_ORDERS);
		});
		$('#liDeliveries').on('click', () => {
			myHome.pushPage(PAGE_FAVO_DELIVERIES);
		});
		$('#liCart').on('click', () => {
			myHome.pushPage(PAGE_FAVO_CART);
		});
		$('#liMyCompany').on('click', () => {
			myHome.pushPage(PAGE_FAVO_MY_COMPANY);
		});
		$('#liMyStore').on('click', () => {
			myHome.pushPage(PAGE_FAVO_MY_STORE);
		});
		$('#liFavorites').on('click', () => {
			myHome.pushPage(PAGE_FAVO_FAVORITES);
		});
		$('#liStatistics').on('click', () => {
			myHome.pushPage(PAGE_FAVO_STATISTICS);
		});
		$('#btnSearchFavoSite').on('click', () => {
			myHome.pushPage(PAGE_FAVO_SEARCH);
		});
		$('#liPrices').on('click', () => {
			myHome.pushPage(PAGE_FAVO_PRICES);
		});
		$('#liProducts').on('click', () => {
			myHome.pushPage(PAGE_FAVO_PRODUCTS);
		});
		$('#liPayment').on('click', () => {
			myHome.pushPage(PAGE_FAVO_PAYMENT);
		});
	},
	
	setRegisterForFavo360Button(btnText, page) {
		$('#btnFavoReg').text(btnText);
		$('#btnFavoReg').off('click');
		$('#btnFavoReg').on('click', () => {
			myHome.pushPage(page);
		});
	},
	
	setPageFavoRegClicks() {
		$('#inputCities').on('click', () => {
			const data = {
				inputElement: 'inputCities',
				countryCode: $('#inputCountry').attr('data-country-code')
			};
			myHome.pushPage(PAGE_FAVO_CITIES, data);
		});
		$('#inputCurrency').on('click', () => {
			const data = {
				inputElement: 'inputCurrency'
			};
			myHome.pushPage(PAGE_FAVO_CURRENCIES, data);
		});
		$('#btnRegister').on('click', () => {
			const cityId = $('#inputCities').attr('data-city-id');
			const currency = $('#inputCurrency').val();
			const company = $('#inputCompany').val();
			if (cityId && company && currency) {
				$('#pageFavoReg .title-loading').show();
				const address = $('#inputAddress').val();
				const data = {
					cityId: cityId,
					currency: currency,
					company: company,
					address: address
				};
				myAjax.sendFavoMerchantReg(data, response => {
					if (response[0].token) {
						myStorage.setFavoToken(response[0].token);
						myHome.replacePage(PAGE_FAVO_REG_MERCHANT_TYPE);
						const txt = myTranslations.getTranslation(TXT_COMPLETE_YOUR_REG);
						favoClicks.setRegisterForFavo360Button(txt, PAGE_FAVO_REG_MERCHANT_TYPE);
					} else {
						ons.notification.alert(response[0].error);
					}
					$('#pageFavoReg .title-loading').hide();
				});
			} else {
				ons.notification.alert(myTranslations.getTranslation(TXT_WARN_REG));
				$('#pageFavoReg .title-loading').hide();
			}
		});
	},
	
	setPageViewCompanyEvents() {
		$('#btnCompanyOpenSideMenu').on('click', () => {
			$('#sideViewCompany')[0].open();
		});
				
		$('.company-store:not(.scroll-attached)').on('scroll', infiniteScroller.getFavoScrollFunction());
		$('.company-store:not(.scroll-attached)').addClass('scroll-attached');
		$('#btnCartCompany').on('click', () => {
			myHome.pushPage(PAGE_FAVO_CART);
		});
		$('#btnContactCompany').on('click', () => {
			const data = {
				companyId: $('#pageFavoSiteViewCompany').attr('data-company-id')
			};
			myHome.pushPage(PAGE_FAVO_SEND_ENQUIRY, data);
			return false;
		});
		$('.side-company-sub-cat').on('click', function () {
			$('#store-nav')[0].scrollIntoView();
			$('.company-store').off('scroll');
			$('.company-store').removeClass('scroll-attached');
			const catId = this.dataset.catId;
			const companyId = $('#pageFavoSiteViewCompany').attr('data-company-id');
			favo360api.companyCategories(companyId, catId);
			$('#sideViewCompany')[0].close();
		});
	},
	
	setPageProductsEvents() {
		$('.list-companies-products').on('scroll', infiniteScroller.getFavoScrollFunction());
	},
	
	setPageTimelineEvents() {
		$('.load-timeline').on('scroll', infiniteScroller.getFavoScrollFunction());
	},
	
	setPageFavoCitiesEvents() {
		/*
		const filterElements = {
			filterAttributes: [
				'data-city-name'
			],
			list: 'listCities',
			listItem: 'city-list-item'
		};
		const searchFunc = mySearch.getSearchFunc(filterElements);
		$('#inputSearchCities').on('input', searchFunc);
		*/
		
		
		const cityClickFunc = function () {
			const cityId = this.dataset.cityId;
			const cityName = this.dataset.cityName;
			const inputElement = $('#pageFavoCities').attr('data-input-element');
			$('#' + inputElement).val(cityName);
			$('#' + inputElement).attr('data-city-id', cityId);
			myHome.popPage();
		};
		
		$('#inputSearchCities').on('input', function () {
			if (this.value) {
				$('#pageFavoCities .title-loading').show();
				$('#hintEnterName').hide();
				const countryCode = $('#pageFavoCities').attr('data-country-code');
				myAjax.searchFavoCity(this.value, countryCode, response => {
					if (response[0].noRes == 1) {
						$('#listCities').empty();
						$('.info-display').text(response[0].msg);
						$('.info-display').show();
					} else {
						$('.info-display').hide();
						let citiesList = '';
						for (const city of response) {
							citiesList += appender.getCityItem(city);
						}
						$('#listCities').html(citiesList);
						$('.city-list-item').on('click', cityClickFunc);
					}
					$('#pageFavoCities .title-loading').hide();
				});
			} else {
				$('#hintEnterName').show();
				$('#listCities').empty();
				$('.info-display').hide();
			}
		});
		
		/*
		$('.city-list-item').on('click', function () {
			const cityId = this.dataset.cityId;
			const cityName = this.dataset.cityName;
			const inputElement = $('#pageFavoCities').attr('data-input-element');
			$('#' + inputElement).val(cityName);
			$('#' + inputElement).attr('data-city-id', cityId);
			myHome.popPage();
		});
		*/
	},
	
	setPageFavoCurrenciesClicks() {
		$('.currency-list-item').on('click', function () {
			const inputElement = $('#pageFavoCurrencies').attr('data-input-element');
			const curCode = this.dataset.currencyCode;
			$('#' + inputElement).val(curCode);
			myHome.popPage();
		});
	},
	
	setPagePaymentEvents() {
		$('#btnBottomSavePaymentMethod').on('click', () => {
			const data = {
				bankName: $('#inputBankName').val(),
				iban: $('#inputIBAN').val(),
				bic: $('#inputBIC').val(),
				paypal: $('#inputPayPal').val(),
				alipay: $('#inputAliPay').val()
			};
			myAjax.saveCompanyPayment(data, response => {
				myToast.showLong(response.msg);
			});
		});
	},
	
	setPageOrderDetailsEvents() {
		$('#btnBottomOrderDetailsSendEnquiry').on('click', () => {
			const data = {
				companyId: $('.company-order').attr('data-companyid'),
				orderId: $('.company-order').attr('data-orderid')
			};
			myHome.pushPage(PAGE_FAVO_SEND_ENQUIRY, data);
		});
	},
	
	setPageDeliveryDetailsEvents() {
		$('#btnDeliveryDetailsSendEnquiry').on('click', () => {
			const data = {
				companyId: $('.company-order').attr('data-companyid'),
				orderId: $('.company-order').attr('data-orderid')
			};
			myHome.pushPage(PAGE_FAVO_SEND_ENQUIRY, data);
		});
	},
	
	setPageFavoRegMerchantTypeClicks() {
		$('.rwm-check').on('change', () => {
			const checkedBoxes = $('.rwm-check:checked').length;
			if (checkedBoxes > 0) {
				$('#btnConfirmMerchantType').prop('disabled', false);
			} else {
				$('#btnConfirmMerchantType').prop('disabled', true);
			}
		});
		$('#btnConfirmMerchantType').on('click', () => {
			myHome.replacePage(PAGE_FAVO_REG_MERCHANT_CATEGORIES);
			const txt = myTranslations.getTranslation(TXT_COMPLETE_YOUR_REG);
			favoClicks.setRegisterForFavo360Button(txt, PAGE_FAVO_REG_MERCHANT_CATEGORIES);
		});
	},
	
	setPageFavoRegCategoriesToolbarButton() {
		$('#btnToolbarCompleteFavoReg').on('click', () => {
			$('#loadingFavoRegCategories').show();
			$('#btnToolbarCompleteFavoReg').prop('disabled', true);
			$('.category-list-item').off('click');
			$('.sub-cat-list-item').off('click');
			myHome.popPage();
			favoPages.initPageFavoSite();
		});	
	},
	
	setPageMyCompanyClicks() {
		const myCompTabClickFunc = function () {
			const loadedTab = $('#pageFavoSiteMyCompany').attr('data-tab-loaded');
			const tab = this.dataset.tab;
			if (tab != loadedTab) {
				$('#tabCompanyInfo').toggle();
				$('#tabCompanyCategories').toggle();
				$('#pageFavoSiteMyCompany').attr('data-tab-loaded', tab);
			}
		};
		$('#tabMyCompanyInfo').on('click', myCompTabClickFunc);
		$('#tabMyCompanyCategories').on('click', myCompTabClickFunc);
		$('#btnBottomMyCompanyUpdateInfo').on('click', () => {
			const companyName = $('#inputCompanyName').val();
			const cityId = $('#inputCompanyCity').attr('data-city-id');
			const companyAddress = $('#inputCompanyAddress').val();
			const countryCode = $('#inputCompanyCountry').attr('data-country-code');
			const currency = $('#inputCompanyCurrency').val();
			const checkedMerchantTypes = $('.check-merch-type input:checked');
			const vat = $('#inputCompanyVAT').val();
			const categoriesLoaded = $('#pageFavoSiteMyCompany').attr('data-categories-loaded');
			let checkedCategoriesList = [];
			
			const confirmDialogFunc = function () {
				const txt = myTranslations.getTranslation(TXT_CONFIRM_CHANGES);
				ons.notification.confirm(txt, {
					callback: (id) => {
						if (id == 1) {
							$('#pageFavoSiteMyCompany .title-loading').show();
							const companyInfo = {
								companyName: companyName,
								cityId: cityId,
								companyAddress: companyAddress,
								countryCode: countryCode,
								currency: currency,
								vat: vat
							};
							let merchantTypeList = [];
							for (const type of checkedMerchantTypes) {
								merchantTypeList.push(type.id);
							}
							merchantTypeList = JSON.stringify(merchantTypeList);
							if (categoriesLoaded == 0) {
								checkedCategoriesList = JSON.parse(checkedCategoriesList);
								let formattedCategoriesList = [];
								for (const cat of checkedCategoriesList) {
									formattedCategoriesList.push(cat.catId);
								}
								checkedCategoriesList = JSON.stringify(formattedCategoriesList);
							}
							myAjax.updateCompanyInfo(companyInfo, merchantTypeList, checkedCategoriesList, response => {
								myToast.showLong(response[0].msg);
								$('#pageFavoSiteMyCompany .title-loading').hide();
							});
						}
					}
				});
			};
			
			if (companyName && cityId && countryCode && currency && checkedMerchantTypes.length > 0) {
				if (categoriesLoaded == 1) {
					const checkedCategories = $('.sub-cat-list-item:checked');
					if (checkedCategories.length > 0) {
						for (const checkedCat of checkedCategories) {																		
							checkedCategoriesList.push(checkedCat.dataset.catId);
						}
						checkedCategoriesList = JSON.stringify(checkedCategoriesList);
						confirmDialogFunc();
					} else {
						const txt = myTranslations.getTranslation(TXT_SELECT_AT_LEAST_ONE_CAT);
						ons.notification.alert(txt);
					}	
				} else {
					checkedCategoriesList = $('#pageFavoSiteMyCompany').attr('data-categories-string');
					confirmDialogFunc();
				}
			} else {
				const txt = myTranslations.getTranslation(TXT_WARN_REG);
				ons.notification.alert(txt);
			}
		});
		$('#inputCompanyCity').on('click', () => {
			const data = {
				inputElement: 'inputCompanyCity',
				countryCode: $('#inputCompanyCountry').attr('data-country-code')
			};
			myHome.pushPage(PAGE_FAVO_CITIES, data);
		});
		$('#inputCompanyCountry').on('click', () => {
			const data = {
				inputElement: 'inputCompanyCountry',
				cityInputElement: 'inputCompanyCity'
			};
			myHome.pushPage(PAGE_COUNTRY, data);
		});
		$('#inputCompanyCurrency').on('click', () => {
			const data = {
				inputElement: 'inputCompanyCurrency'
			};
			myHome.pushPage(PAGE_FAVO_CURRENCIES, data);
		});
	},
	
	setPageEditGroupEvents() {
		$('#btnBottomEditGroup').on('click', () => {
			const groupId = $('#pageFavoSiteEditGroup').attr('data-group-id');
			const groupName = $('#inputGroupName').val();
			myAjax.updateGroupName(groupId, groupName, response => {
				if (response.msg) {
					$('#pageFavoSiteFavorites .title-loading').show();
					myToast.showLong(response.msg);
					favo360api.groupsList();
					myHome.popPage();
				} else {
					myToast.showLong(response.error);
				}
			});
		});
		$('#inputGroupName').on('input', function () {
			if (this.value) {
				$('#btnBottomEditGroup').prop('disabled', false);
			} else {
				$('#btnBottomEditGroup').prop('disabled', true);
			}
		});
	},
	
	setPageMyStoreEvents() {
		const imagePickResultFunc = function (images) {
			if (images.length > 0) {
				$('#pageFavoSiteMyStore .title-loading').show();
				$('#pageFavoSiteMyStore').attr('data-picture-path', images);
				favo360api.addStoreItems('');
				// Callback in favo-api.js itemPictureForward()
			}
		};
		
		$('#btnTitleAddProductGallery').on('click', () => {
			myImagePicker.pickImages(1, imagePickResultFunc);
		});
		$('#btnTitleAddProductCamera').on('click', () => {
			myCamera.getPicture(imagePickResultFunc);
		});
		$('#btnMyStoreOpenSideMenu').on('click', () => {
			$('#sideMyStore')[0].open();
		});
		$('.list-store-items').on('scroll', infiniteScroller.getFavoScrollFunction());
		$('.side-company-sub-cat').on('click', function () {
			const catId = this.dataset.catId;
			const companyId = $('#pageFavoSiteMyStore').attr('data-company-id');
			favo360api.companyCategories(companyId, catId);
			$('#sideMyStore')[0].close();
		});
		$('#srch-prod-val').on('keyup', () => {
			const companyId = $('#pageFavoSiteMyStore').attr('data-company-id');
			favo360api.companyProdSearch(companyId, '', '');
		});
	},
	
	onEditGroupClick() {
		const data = {
			groupId: this.rel,
			groupName: this.dataset.name
		};
		myHome.pushPage(PAGE_FAVO_EDIT_GROUP, data);
	},
	
	setPageFavoritesClicks() {
		$('#btnTabFavorites').on('click', () => {
			$('.list-fav-comp').show();
			$('.list-groups').hide();
			$('#btnTitleAddGroup').hide();
		});
		$('#btnTabGroups').on('click', () => {
			$('.list-fav-comp').hide();
			$('.list-groups').show();
			$('#btnTitleAddGroup').show();
		});
		$('#btnTitleAddGroup').on('click', () => {
			myHome.pushPage(PAGE_FAVO_ADD_GROUP);
		});
	},
	
	setPageSearchEvents() {
		$('#inputKeyword').on('input', function () {
			const txt = this.value;
			const category = $('#inputCategory').val();
			const country = $('#inputCountry').val();
			if (txt || category || country) {
				$('#btnSearchInFavo').prop('disabled', false);
			} else {
				$('#btnSearchInFavo').prop('disabled', true);
			}
		});
		$('#inputCategory').on('click', () => {
			ons.createDialog(DIALOG_SEARCH_CATEGORY).then(dialog => {
				favoPagesLocalizations.translateDialogSearchCategory();
				favoClicks.setSearchDialogCategoryItemClicks();
				dialog.show();
			});
		});
		$('#inputCountry').on('click', () => {
			myHome.pushPage(PAGE_FAVO_COUNTRIES);
		});
		$('#btnSearchInFavo').on('click', () => {
			$('#pageFavoSiteSearch .title-loading').show();
			const data = {
				category: $('#inputCategory').attr('data-category-code'),
				country: $('#inputCountry').attr('data-country-code'),
				keyword: $('#inputKeyword').val()
			};
			myHome.pushPage(PAGE_FAVO_SEARCH_RESULTS, data);
		});
		$('#inputKeyword').on('keyup', event => {
			if(event.keyCode == 13){
				$('#btnSearchInFavo').trigger('click');
			}
		});
	},
	
	setPageFavoCountriesClicks() {
		const elementsSearch = {
			filterAttributes: [
				'data-country-code',
				'data-country-name'
			],
			list: 'listFavoCountries',
			listItem: 'favo-country-list-item'
		};
		const searchFunc = mySearch.getSearchFunc(elementsSearch);
		$('#inputSearchFavoCountries').on('input', searchFunc);
		
		$('.favo-country-list-item').on('click', function () {
			const countryName = this.dataset.countryName;
			const countryCode = this.dataset.countryCode;
			// update input on previous page and attr on Favo360 page
			$('#inputCountry').val(countryName);
			$('#inputCountry').attr('data-country-code', countryCode);
			$('#pageFavoSite').attr('data-country-name', countryName);
			$('#pageFavoSite').attr('data-country-code', countryCode);
			$('#btnSearchInFavo').prop('disabled', false);
			myHome.popPage();
		});	
	},
	
	setPageViewProductEvents() {
		$('#btnBottomViewProductOpenChat').on('click', () => {
			const data = {
				productId: $('#prod-gallery').attr('data-prod-id'),
				productImg: $('#prod-gallery').attr('data-img'),
				productImgId: $('#prod-gallery').attr('data-img-id'),
				companyId: $('#prod-gallery').attr('data-comp-id'),
			};
			myHome.pushPage(PAGE_FAVO_SEND_ENQUIRY, data);
		});
		$('#btnBottomViewProductCart').on('click', () => {
			myHome.pushPage(PAGE_FAVO_CART);
		});
		$('.visit-shop').on('click', function() {
			const data = {
				companyId: this.dataset.compId
			};
			myHome.bringPageToTop(PAGE_FAVO_VIEW_COMPANY, data);
		});
	},
	
	setPageOrdersClicks() {
		const loadOrdersFunc = function () {
			const tabLoaded = $('#pageFavoSiteOrders').attr('data-tab-loaded');
			const tabToLoad = this.dataset.tab;
			if (tabLoaded != tabToLoad) {
				$('#loadingFavoSiteOrders').show();
				favo360api.listOrders(tabToLoad);
				$('#pageFavoSiteOrders').attr('data-tab-loaded', tabToLoad);
			}
		};
		$('#btnOrdersOpened').on('click', loadOrdersFunc);
		$('#btnOrdersClosed').on('click', loadOrdersFunc);
	},
	
	setPageDeliveriesClicks() {
		const loadDeliveriesFunc = function () {
			const tabLoaded = $('#pageFavoSiteDeliveries').attr('data-tab-loaded');
			const tabToLoad = this.dataset.tab;
			if (tabLoaded != tabToLoad) {
				$('#loadingFavoSiteDeliveries').show();
				favo360api.listDeliveries(tabToLoad);
				$('#pageFavoSiteDeliveries').attr('data-tab-loaded', tabToLoad);
			}
		};
		$('#btnDeliveriesOpened').on('click', loadDeliveriesFunc);
		$('#btnDeliveriesClosed').on('click', loadDeliveriesFunc);	
	},
	
	setPageAddGroupEvents() {
		$('#inputGroupName').on('input', function () {
			if (this.value) {
				$('#btnAddGroup').prop('disabled', false);
			} else {
				$('#btnAddGroup').prop('disabled', true);
			}
		});
		$('#btnAddGroup').on('click', () => {
			$('#pageFavoSiteAddGroup .title-loading').show();
			const groupName = $('#inputGroupName').val();
			favo360api.groupAdd(groupName);
			// Callback in favo-api.js addGroupCompl()
		});
	},
	
	setPageSendEnquiryEvents() {
		$('#txtEnquiry').on('input', function () {
			if (this.value) {
				$('#btnSendEnquiry').prop('disabled', false);
			} else {
				$('#btnSendEnquiry').prop('disabled', true);
			}
		});
		$('#btnSendEnquiry').on('click', () => {
			$('#btnSendEnquiry').prop('disabled', true);
			$('#pageFavoSiteSendEnquiry .title-loading').show();
			const productId = $('#pageFavoSiteSendEnquiry').attr('data-product-id');
			const data = {
				txt: $('#txtEnquiry').val(),
				productId: productId,
				companyId: $('#pageFavoSiteSendEnquiry').attr('data-company-id'),
				productImgId: $('#pageFavoSiteSendEnquiry').attr('data-img-id'),
				orderId: $('#pageFavoSiteSendEnquiry').attr('data-order-id')
			};
			myAjax.sendEnquiry(data, response => {
				myToast.showLong(response.msg);
				if (!response.noRes) {
					favo360api.prodDetails(productId);
					myHome.popPage();
				}
				$('#btnSendEnquiry').prop('disabled', false);
				$('#pageFavoSiteSendEnquiry .title-loading').hide();
			});
		});
	},
	
	setPageEditProductEvents() {
		$('#btnProductUpdateInfo').on('click', () => {			
			const productName = $('#inputProductName').val();
			const productCode = $('#inputProductCode').val();
			const productMeasure = $('#inputProductMeasure').attr('data-measure-id');
			let productNoName;
			let productClear;
			let productNew;
			let productFeat;
			let productWeightType;
			let productPriceNegotiate;
			if ($('#inputSKUInsteadOfName').prop('checked')) {
				productNoName = 1;
			} else {
				productNoName = 0;
			}
			if ($('#inputClearance').prop('checked')) {
				productClear = 1;
			} else {
				productClear = 0;
			}
			if ($('#inputNewArrivals').prop('checked')) {
				productNew = 1;
			} else {
				productNew = 0;
			}
			if ($('#inputFeatured').prop('checked')) {
				productFeat = 1;
			} else {
				productFeat = 0;
			}
			if ($('#radioProductWeightTypeKg').prop('checked')) {
				productWeightType = 'kg';
			} else {
				productWeightType = 'gr';
			}
			if ($('#inputPriceNegotiate').prop('checked')) {
				productPriceNegotiate = 1;
			} else {
				productPriceNegotiate = 0;
			}

			let categories = '';
			let filters = '';

			const checkInfoFunc = function () {
				if (productName && productCode && productMeasure) {
					return true;
				} else {
					return false;
				}
			};
			
			const checkCatsFunc = function () {
				categories = $('#pageFavoSiteEditProduct').attr('data-selected-categories');
				if (categories == '[]') {
					return false;
				} else {
					return true;
				}
			};
			
			const checkFiltFunc = function () {
				filters = $('#pageFavoSiteEditProduct').attr('data-selected-filters');
				const requiredLists = $('.sub-filter-list.required');
				if (filters == '[]' && requiredLists.length != 0) {
					return false;
				} else {
					
					if (requiredLists.length != 0) {
						for (const list of requiredLists) {
							const checkedFilters = $('#' + list.id + '.sub-filter-list:checked');
							if (checkedFilters.length == 0) {
								return false;
							}
						}
						return true;
					} else {
						return true;
					}
				}
			};
			
			if (checkInfoFunc()) {
				// info ok, check categories
				if (checkCatsFunc()) {
					// categories ok, check filters
					if (checkFiltFunc()) {
						// filters ok, everything ok
						$('#pageFavoSiteEditProduct .title-loading').show();
						const data = {
							productName: productName,
							productCode: productCode,
							productNoName: productNoName,
							productClear: productClear,
							productNew: productNew,
							productFeat: productFeat,
							productId: $('#pageFavoSiteEditProduct').attr('data-item-id'),
							productVol: $('#inputProductVolume').val(),
							productWeight: $('#inputProductWeight').val(),
							productWeightType: productWeightType,
							productWidth: $('#inputProductWidth').val(),
							productHeight: $('#inputProductHeight').val(),
							productLength: $('#inputProductLength').val(),
							productMeasure: $('#inputProductMeasure').attr('data-measure-id'),
							productNegotiate: productPriceNegotiate,
							productPrice: $('#inputProductPrice').val(),
							productQty: $('#inputProductQuantity').val(),
							productComment: $('#inputProductComment').val(),
							productText: $('#inputProductText .ql-editor').html()

						};
						myAjax.updateProductInfo(data, categories, filters, (response) => {
							if (response[0].noRes) {
								ons.notification.alert(response[0].msg);
							} else {
								myToast.showLong(response[0].msg);
							}
							$('#pageFavoSiteEditProduct .title-loading').hide();
						});
					} else {
						// warn filters
						ons.notification.alert(myTranslations.getTranslation(TXT_SELECT_FILTERS));
					}
				} else {
					// warn categories
					ons.notification.alert(myTranslations.getTranslation(TXT_SELECT_PRODUCT_CAT));
				}
			} else {
				// warn info
				ons.notification.alert(myTranslations.getTranslation(TXT_COMPLETE_ALL_FIELDS));
			} 
		});
		$('#imgProduct').on('click', () => {
			const itemId = $('#pageFavoSiteEditProduct').attr('data-item-id');
			const data = {
				itemId: itemId
			};
			myHome.pushPage(PAGE_FAVO_EDIT_PRODUCT_IMAGES, data);
		});
		const switchTabFunc = function (element) {
			debugger;
			// tuka da se sloji tvoi klas
			$('.button-bar__item').removeClass('current');
			$(element).parent().addClass('current');
			$('.product-tab').hide();
		};
		$('#btnProductInfo').on('click', function () {
			switchTabFunc(this);
			$('#productTabInfo').show();
		});
		$('#btnProductCategories').on('click', function () {
			switchTabFunc(this);
			$('#productTabCategories').show();
		});
		$('#btnProductFilters').on('click', function () {
			switchTabFunc(this);
			$('#productTabFilters').show();
			let categories = $('#pageFavoSiteEditProduct').attr('data-selected-categories');
			if (categories != '[]') {
				$('#warnNoCategories').hide();
				$('#listProductFilters').show();
				if ($('#listProductFilters').is(':empty')) {
					$('#pageFavoSiteEditProduct .title-loading').show();
					myAjax.getProductFilters(categories, response => {
						let filterList = '';
						for (const filter of response) {
							filterList += appender.getProductFilterItem(filter);
						}
						$('#listProductFilters').html(filterList);
						
						let checkedFilters = $('#pageFavoSiteEditProduct').attr('data-selected-filters');
						if (checkedFilters != '[]') {
							checkedFilters = JSON.parse(checkedFilters);
							for (const filterId of checkedFilters) {
								$('[input-id="' + filterId + '"]').prop('checked', true);
								$('[input-id="' + filterId + '"]').addClass('checked');
							}
						}
						
						const requiredFilters = $('.filter-list-item.required');
						if (requiredFilters.length == 0) {
							$('#tabProductFilters .notification').text('');
						} else {
							for (const filterList of requiredFilters) {
								const checkedSubFilters = $('#' + filterList.id + '.sub-filter-list .sub-filter-list-item.checked');
								if (checkedSubFilters.length == 0) {
									$(filterList).find('.warning-product-filter').text('!');
									$(filterList).removeClass('is-checked');
								} else {
									$(filterList).find('.warning-product-filter').text('');
									$(filterList).addClass('is-checked');
								}
							}
							const checkedRequiredFilters = $('.filter-list-item.required.is-checked');
							if (requiredFilters.length == checkedRequiredFilters.length) {
								$('#tabProductFilters .notification').text('');
							} else {
								$('#tabProductFilters .notification').text('!');
							}
						}
						favoClicks.setFilterListItemsClicks();
						$('#pageFavoSiteEditProduct .title-loading').hide();
					});
				}
			} else {
				$('#warnNoCategories').show();
				$('#listProductFilters').hide();
			}
		});
		
		const checkRequiredInfoFunc = function () {
			const productName = $('#inputProductName').val();
			const productCode = $('#inputProductCode').val();
			const productMeasure = $('#inputProductMeasure').val();
			if (productName && productCode && productMeasure) {
				$('#tabProductInfo .notification').text('');
			}
		};
		$('#inputProductName').on('input', function () {
			if (this.value) {
				$('#warnProductName').text('');
				checkRequiredInfoFunc();
			} else {
				$('#warnProductName').text('!');
				$('#tabProductInfo .notification').text('!');
			}
		});
		$('#inputProductCode').on('input', function () {
			if (this.value) {
				$('#warnProductCode').text('');
				checkRequiredInfoFunc();
			} else {
				$('#warnProductCode').text('!');
				$('#tabProductInfo .notification').text('!');
			}
		});
		$('#inputProductMeasure').on('change', function () {
			if (this.value) {
				$('#warnProductCode').text('');
				checkRequiredInfoFunc();
			} else {
				$('#warnProductMeasure').text('!');
				$('#tabProductInfo .notification').text('!');
			}
		});
		$('#inputProductMeasure').on('click', () => {
			myHome.pushPage(PAGE_FAVO_MEASURE);
		});
	},
	
	setPageEditProductImagesClicks() {
		$('#btnFavoAddImages').on('click', () => {
			ons.createDialog(DIALOG_PRODUCT_PICTURE).then(dialog => {
				favoPagesLocalizations.translateDialogProductPicture();
				$('#btnCamera').on('click', favoClicks.onProductPictureCameraClick);
				$('#btnGallery').on('click', favoClicks.onProductPictureGalleryClick);
				dialog.show();
			});
		});	
	},
	
	setPageSendPdfEmailEvents() {
		$('#btnBottomSendEmail').on('click', () => {
			const emailAddress = $('#inputEmailAddress').val();
			// Simple test for correct email format, additional check is made in server as well
			const emailRegEx = /[^\s@]+@[^\s@]+\.[^\s@]+/;
			if (emailRegEx.test(emailAddress)) {
				const data = {
					emailAddress: emailAddress,
					emailText: $('#inputEmailText').find('.ql-editor').text(),
					orderType: $('#pageFavoSendPdfEmail').attr('data-type'),
					orderId: $('#pageFavoSendPdfEmail').attr('data-order-id')
				};
				myAjax.sendPdfEmail(data, response => {
					myToast.showLong(response.msg);
					if (!response.noRes) {
						myHome.popPage();
					}
				});
			} else {
				// error incorrect email address
				myHome.showOnsenError(myTranslations.getTranslation(TXT_EMAIL_INVALID));
			}
		});
	},
	
	onProductPictureCameraClick() {
		myHome.hideOnsenDialog();
		myCamera.getPicture(filePath => {
			$('#loadingEditProductImages').show();
			const itemId = $('#pageFavoSiteEditProductImages').attr('data-item-id');
			myAjax.uploadProductImg(itemId, filePath, () => {
				favo360api.listStoreItems('', '');
				favo360api.itemImages(itemId);
				myToast.showLong(myTranslations.getTranslation(TXT_ALL_IMAGES_UPLOAD_SUCCESS));
				$('#loadingEditProductImages').hide();
			});
		});
	},
	
	onProductPictureGalleryClick() {
		myHome.hideOnsenDialog();
		const openGalleryFunc = function () {
			// http://plugins.telerik.com/cordova/plugin/imagepicker
			const options = {
				maximumImagesCount: MAX_IMAGES_TO_SEND
			};
			imagePicker.getPictures(images => {
					if (images.length > 0 ) {
						$('#loadingEditProductImages').show();
						const itemId = $('#pageFavoSiteEditProductImages').attr('data-item-id');
						$('#titleEditProductImages').attr('data-is-uploading', 1);
						let index = 0;
						const uploadImgFunc = function (img) {
							$('#titleEditProductImages').text('Uploading ' + (index + 1) + '/' + images.length);
							myAjax.uploadProductImg(itemId, img, () => {
								favo360api.listStoreItems('', '');
								favo360api.itemImages(itemId);
								index++;
								if (images[index]) {
									uploadImgFunc(images[index]);
								} else {
									$('#titleEditProductImages').text('Edit Images');
									$('#titleEditProductImages').attr('data-is-uploading', 0);
									myToast.showLong(myTranslations.getTranslation(TXT_ALL_IMAGES_UPLOAD_SUCCESS));
									$('#loadingEditProductImages').hide();
								}
							});
						};
						uploadImgFunc(images[index]);
					}
				}, error => {
					ons.notification.alert('Error: ' + error);
				},
				options
			);
		};
		
		if (device.platform == 'Android') {
			myPerms.checkStoragePermission(status => {
				if (status == true) {
					openGalleryFunc();
				}
			});
		} else {
			openGalleryFunc();
		}
	},
	
	setSearchDialogCategoryItemClicks() {
		$('.dialog-list-item').on('click', function () {
			const categoryName = $(this).find('.label').text();
			const categoryCode = this.id;
			$('#inputCategory').val(categoryName);
			$('#inputCategory').attr('data-category-code', categoryCode);
			// Update attr on Favo360 page
			$('#pageFavoSite').attr('data-category-name', categoryName);
			$('#pageFavoSite').attr('data-category-code', categoryCode);
			$('#btnSearchInFavo').prop('disabled', false);
			$('#dialogCategory')[0].hide();
		});
	},
	
	onOpenPricesClick() {
		myHome.hideOnsenDialog();
		myHome.pushPage(PAGE_FAVO_PRICES);
	},
	
	onProductImageClick() {
		const data = {
			itemId: this.dataset.itemId
		};
		myHome.pushPage(PAGE_FAVO_EDIT_PRODUCT_IMAGES, data);
		return false;
	},
	
	onProductNameClick() {
		const data = {
			itemId: this.dataset.itemId
		};
		myHome.pushPage(PAGE_FAVO_EDIT_PRODUCT, data);
		return false;
	},
	
	onCompanyClick() {
		let companyId = this.rel;
		if (!companyId) {
			companyId = this.dataset.compId;
		}
		const data = {
			companyId: companyId
		};
		myHome.pushPage(PAGE_FAVO_VIEW_COMPANY, data);
		return false;
	},
	
	onFavoriteCompContactClick() {
		const data = {
			companyId: this.dataset.companyId
		};
		myHome.pushPage(PAGE_FAVO_SEND_ENQUIRY, data);
	},
	
	onCompanyProductItemClick() {
		const data = {
			productId: this.rel
		};
		if ($('#pageFavoSiteViewProduct').length > 0) {
			// Page View Product already initialized
			favoPages.initPageViewProduct(this.rel);
			$('#pageFavoSiteViewProduct .load-prod-details').empty();
			myHome.bringPageToTop(PAGE_FAVO_VIEW_PRODUCT, data);
		} else {
			myHome.pushPage(PAGE_FAVO_VIEW_PRODUCT, data);
		}
		return false;
	},
	
	setMerchantCategoryListItemClicks() {
		const catSelectFunc = myFavoCategories.getCategoryClickFunction();
		$('.category-list-item').on('click', catSelectFunc);
	},
	
	setMerchantSubCategoryListItemClicks() {
		$('.sub-cat-list-item').on('click', function () {
			$('#loadingFavoRegCategories').show();
			const checkedCats = $('.sub-cat-list-item:checked').length;
			if (checkedCats > 0) {
				$('#btnToolbarCompleteFavoReg').prop('disabled', false);
			} else {
				$('#btnToolbarCompleteFavoReg').prop('disabled', true);
			}
			const isChecked = this.checked;
			const categoryId = this.dataset.catId;
			myAjax.checkMerchantSubCategory(categoryId, isChecked, () => {
				$('#loadingFavoRegCategories').hide();
			});
		});
	},
	
	setFilterListItemsClicks() {
		$('.filter-list-item').on('click', function () {
			const expanded = this.dataset.expanded;
			const id = this.id;
			if (expanded == 0) {
				$('#' + id + '.sub-filter-list').show();
				$(this).find('.expand-icon').attr('icon', 'ion-chevron-down');
				$(this).attr('data-expanded', 1);
			} else {
				$('#' + id + '.sub-filter-list').hide();
				$(this).find('.expand-icon').attr('icon', 'ion-chevron-right');
				$(this).attr('data-expanded', 0);
			}
		});
		$('.sub-filter-list-item').on('click', function () {
			// Subfilters warning check
			const parentId = this.dataset.parentId;
			const checkedFilters = $('.sub-filter-list-item[data-parent-id="' + parentId + '"] :checked');
			if (checkedFilters.length > 0) {
				$('#' + parentId + '.warning-product-filter').text('');
				$('#' + parentId).addClass('is-checked');
			} else {
				$('#' + parentId + '.warning-product-filter').text('!');
				$('#' + parentId).removeClass('is-checked');
			}
			
			// All filters warning check
			const requiredFilters = $('.filter-list-item.required').length;
			const checkedRequiredFilters = $('.filter-list-item.required.is-checked').length;
			if (checkedRequiredFilters >= requiredFilters) {
				$('#tabProductFilters .notification').text('');
			} else {
				$('#tabProductFilters .notification').text('!');
			}
			
			// All selected filters check
			const allCheckedFilters = $('.sub-filter-list-item :checked');
			let selectedFilters = [];
			for (const filter of allCheckedFilters) {
				selectedFilters.push(filter.id);
			}
			selectedFilters = JSON.stringify(selectedFilters);
			$('#pageFavoSiteEditProduct').attr('data-selected-filters', selectedFilters);
		});
	},
	
	setMeasureListItemsClicks() {
		$('.measure-list-item').on('click', function () {
			const measureId = this.dataset.measureId;
			const measureName = this.dataset.measureName;
			$('#pageFavoSiteEditProduct').find('#inputProductMeasure').attr('data-measure-id', measureId);
			$('#pageFavoSiteEditProduct').find('#inputProductMeasure').val(measureName);
			$('#warnProductMeasure').text('');
			$('#inputProductMeasure').trigger('change');
			myHome.popPage();
		});
	},
	
	onOrderClick() {
		const data = {
			orderId: this.rel
		};
		myHome.pushPage(PAGE_FAVO_ORDER_DETAILS, data);
		return false;
	},
	
	onDeliveryClick() {
		const data = {
			deliveryId: this.rel
		};
		myHome.pushPage(PAGE_FAVO_DELIVERY_DETAILS, data);
		return false;
	},
	
	onProductCatClick() {
		const catId = this.id;
		const expanded = this.dataset.expanded;
		if (expanded == 0) {
			$(this).attr('data-expanded', 1);
			const subCatLoaded = $(this).attr('data-subcat-loaded');
			if (subCatLoaded == 0) {
				$('#pageFavoSiteEditProduct .title-loading').show();
				$('.category-list-item').off('click');
				myAjax.getProductSubCategories(catId, response => {
					if (response.length > 0) {
						let subCatList = '';
						for (const subCat of response) {
							subCatList += appender.getMerchantSubCategoryItem(subCat);
						}
						$('#' + catId + '.ons-sub-cat-list').append(subCatList);
						$('#' + catId + '.ons-sub-cat-list .sub-cat-list-item').on('click', favoClicks.onProductSubCatClick);
						let selectedCategories = $('#pageFavoSiteEditProduct').attr('data-selected-categories');
						if (selectedCategories != '[]') {
							selectedCategories = JSON.parse(selectedCategories);
							for (const subCat of selectedCategories) {
								$('.sub-cat-list-item[data-cat-id="' + subCat + '"]').prop('checked', true);
							}
						}
						$(this).attr('data-subcat-loaded', 1);
					}
					$('.category-list-item').on('click', favoClicks.onProductCatClick);
					$(this).find('.expand-icon').attr('icon', 'ion-chevron-down');
					$('#pageFavoSiteEditProduct .title-loading').hide();
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
	},
	
	onProductSubCatClick() {
		$('#listProductFilters').empty();
		$('#tabProductFilters .notification').text('!');
		if ($('.sub-cat-list-item:checked').length > 0) {
			$('#tabProductCategories .notification').text('');
		} else {
			$('#tabProductCategories .notification').text('!');
		}
		let categories = $('.sub-cat-list-item:checked');
		let newCatList = [];
		for (const cat of categories) {
			newCatList.push(cat.dataset.catId);
		}
		categories = JSON.stringify(newCatList);
		$('#pageFavoSiteEditProduct').attr('data-selected-categories', categories);
	},
	
	onCompanyGalleryClick() {
		const data = {
			companyId: this.rel
		};
		myHome.pushPage(PAGE_FAVO_COMPANY_GALLERY, data);
		return false;
	},
	
	onDeliveryDetailsPdfClick() {
		const url = $(this).find('.order-pdf-print').attr('data-url');
		cordova.InAppBrowser.open(url, '_system', 'location=no');
	},
	
	onPdfClick() {
		const orderId = this.dataset.orderId;
		const orderNum = this.dataset.orderNum;
		const type = this.dataset.type;
		const pdfUrl = this.dataset.url;
		ons.createDialog(DIALOG_PDF_CLICK).then(dialog => {
			$('#labelBtnBrowser').text(myTranslations.getTranslation(TXT_OPEN_IN_BROWSER));
			$('#labelBtnEmail').text(myTranslations.getTranslation(TXT_SEND_EMAIL));
			dialog.dataset.orderId = orderId;
			dialog.dataset.orderNum = orderNum;
			dialog.dataset.type = type;
			dialog.dataset.pdfUrl = pdfUrl;
			dialog.show();
		});
	},
	
	onPdfClickBrowser() {
		const url = $('#dialogPdfClick').attr('data-pdf-url');
		myHome.hideOnsenDialog();
		cordova.InAppBrowser.open(url, '_system', 'location=no');
	},
	
	onPdfClickEmail() {
		const data = {
			orderId: $('#dialogPdfClick').attr('data-order-id'),
			orderNum: $('#dialogPdfClick').attr('data-order-num'),
			type: $('#dialogPdfClick').attr('data-type')
		};
		myHome.hideOnsenDialog();
		myHome.pushPage(PAGE_FAVO_SEND_PDF_EMAIL, data);
	},
	
	onTimelineProductImgClick() {
		const data = {
			productId: this.dataset.id
		};
		myHome.pushPage(PAGE_FAVO_VIEW_PRODUCT, data);
		$.fancybox.close();
	}
};