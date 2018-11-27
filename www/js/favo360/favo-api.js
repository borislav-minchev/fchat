function authMe(request) {
	const token = myStorage.getFavoToken();
	request.setRequestHeader('authentication', token);
}

/*
// Called when Favo Numbers is loaded
function favoNumbersLoaded() {
	const token = myStorage.getFavoToken();
	if (token) {
		myAjax.getCompanyInfo(token, (response) => {
			if (response.companyType.length == 0) {
				favoPages.showRegForFavoPage(myTranslations.getTranslation(TXT_COMPLETE_YOUR_REG), PAGE_FAVO_REG_MERCHANT_TYPE);
			} else if (response.companyCat.length == 0) {
				favoPages.showRegForFavoPage(myTranslations.getTranslation(TXT_COMPLETE_YOUR_REG), PAGE_FAVO_REG_MERCHANT_CATEGORIES);
			} else {
				// all ok
				favoPages.showFavo360();
			}
			$('#pageFavoSite').attr('data-favo-loaded', 1);
		});
	} else {
		const btnText = myTranslations.getTranslation(TXT_JOIN_NOW);
		favoPages.showRegForFavoPage(btnText, PAGE_FAVO_REG);
		$('#pageFavoSite').attr('data-favo-loaded', 1);
	}
}
*/

// Called after a group is successfully added on Favo360 server
function addGroupCompl() {
	$('#pageFavoSiteAddGroup .title-loading').hide();
	favo360api.favList();
	favo360api.groupsList();
	myHome.popPage();
}

// Called when a product is successfully added in My Store
function itemForward(itemId, error) {
	if (!error) {
		favo360api.listStoreItems('', '');
		myHome.popPage();
	} else {
		favoDialogs.showDialogPrices(error);
	}
	$('#pageFavoSiteMyStore .title-loading').hide();
}

// Called when Groups page is loaded
function groupsLoaded() {
	$('.edit-group').on('click', favoClicks.onEditGroupClick);
	$('#pageFavoSiteFavorites .title-loading').hide();
}

// Called when a product is successfully added without name in My Store
function itemPictureForward(itemId, error) {
	if (!error) {
		// test on iOS
		const filePath = $('#pageFavoSiteMyStore').attr('data-picture-path');
		$('#pageFavoSiteMyStore').attr('data-picture-path', '');
		myAjax.uploadProductImg(itemId, filePath, () => {
			favo360api.listStoreItems('', '');
			favo360api.itemImages(itemId);
			const txt = myTranslations.getTranslation(TXT_ALL_IMAGES_UPLOAD_SUCCESS);
			myToast.showLong(txt);
			$('#pageFavoSiteMyStore .title-loading').hide();
		});
	} else {
		favoDialogs.showDialogPrices(error);
		$('#pageFavoSiteMyStore .title-loading').hide();
	}
}

// Called when products in My Store are loaded
function itemLinksHookUp() {
	/*
	$('.edit-item-info').each(function () {
		const getId = $.grep(this.className.split(' '), function (v) {
			return v.indexOf('sel-itm') === 0;
		}).join().replace('sel-itm', '');
		if ($(this).hasClass('item-isImg')) {
			favoClicks.onProductImageClick(this, getId);
		}
		if ($(this).hasClass('item-isText')) {
			favoClicks.onProductNameClick(this, getId);
		}
	});
	*/

	$('.item-cell .img:not(.click-attached)').on('click', favoClicks.onProductImageClick);
	$('.item-cell .img:not(.click-attached)').addClass('click-attached');
	
	$('.item-cell .edit-item-info.item-isText:not(.click-attached)').on('click', favoClicks.onProductNameClick);
	$('.item-cell .edit-item-info.item-isText:not(.click-attached)').addClass('click-attached');
	
	if (!$('#pageFavoSiteMyStore').attr('data-company-id')) {
		// not initialized
		const companyId = $('.my-store-items').attr('data-compid');
		$('#pageFavoSiteMyStore').attr('data-company-id', companyId);
		myAjax.getCompanyCategoriesSideMenu(companyId, response => {
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
			$('#sideMyStoreCategories').append(sideListCategories);
			favoClicks.setPageMyStoreEvents();
			$('#pageFavoSiteMyStore .title-loading').hide();
		});
	} else {
		$('#pageFavoSiteMyStore .title-loading').hide();
	}
}

// Called when merchant type options are loaded in Favo360 registration
function typeIsChecked() {
	favoClicks.setPageFavoRegMerchantTypeClicks();
	favoPagesLocalizations.translatePageFavoRegMerchantType();
	const checkedBoxes = $('.rwm-check:checked').length;
	if (checkedBoxes > 0) {
		$('#btnConfirmMerchantType').prop('disabled', false);
	} else {
		$('#btnConfirmMerchantType').prop('disabled', true);
	}
	$('#pageFavoRegMerchantType .title-loading').hide();
}

// Called when companies are loaded after a search
function compListLoaded() {
	$('#pageFavoSiteSearch').remove();
	$('.view-comp-details').on('click', favoClicks.onCompanyClick);
	$('#pageFavoSiteSearchResults .title-loading').hide();
}

// Called when images for a product are loaded
function imgLoaded() {
	if ($('#titleEditProductImages').attr('data-is-uploading') != 1) {
		$('#pageFavoSiteEditProductImages .title-loading').hide();
	}
}

// Called when images of a product have been re-ordered
function imgListRefresh() {
	favo360api.listStoreItems('', '');
}

// Called when a company info is loaded
function companyInfoLoaded() {
	$('.company-store:not(.scroll-attached)').on('scroll', infiniteScroller.getFavoScrollFunction());
	$('.company-store:not(.scroll-attached)').addClass('scroll-attached');
	$('.view-item-info:not(.click-attached)').on('click', favoClicks.onCompanyProductItemClick);
	$('.view-item-info:not(.click-attached)').addClass('click-attached');
	$('#pageFavoSiteViewCompany .title-loading').hide();
}

// Called when Favorite companies are loaded
function favListLodaded() {
	$('#pageFavoSiteFavorites .view-comp-details').on('click', favoClicks.onCompanyClick);
	$('#pageFavoSiteFavorites .view-item-details').on('click', favoClicks.onCompanyClick);
	$('#pageFavoSiteFavorites .open-chat').on('click', favoClicks.onFavoriteCompContactClick);
}

// Called when a company product is loaded
function prodIsLoaded(isOwnCompany) {
	if (isOwnCompany) {
		$('#botToolbarProduct').hide();
		$('#pageFavoSiteViewProduct').removeClass('page-with-bottom-toolbar');
	} else {
		$('#botToolbarProduct').show();
	}
	favoClicks.setPageViewProductEvents();
	$('#pageFavoSiteViewProduct .title-loading').hide();
}

// Called when New Products in Company are loaded
function newItemsLoaded() {
	$('.comp-new-prod-load .view-item-info:not(.click-attached)').on('click', favoClicks.onCompanyProductItemClick);
	$('.comp-new-prod-load .view-item-info:not(.click-attached)').addClass('click-attached');
}

// Called when page cart is loaded
function cartIsLoaded() {
	$('#pageFavoSiteCart .title-loading').hide();
}

// Called when page orders is loaded
function ordersLoaded() {
	$('.view-order-details').on('click', favoClicks.onOrderClick);
	$('#pageFavoSiteOrders .title-loading').hide();
}

// Called when page deliveries is loaded
function deliveriesLoaded() {
	$('.view-delivery-details').on('click', favoClicks.onDeliveryClick);
	$('#pageFavoSiteDeliveries .title-loading').hide();
}

// Called when order details are loaded
function orderIsLoaded() {
	$('.order-pdf-print, .freight-pdf-print').on('click', favoClicks.onPdfClick);
	$('#pageFavoSiteOrderDetails .title-loading').hide();
}

// Called when a change is made to the cart
function cartUpdated() {
	myHome.loadHomeNotifications(() => {
		favo360api.shoppingCart();
	});
}

// Called when Products page is loaded
function companiesProductsLoaded() {
	$('.view-item-info').on('click', favoClicks.onCompanyProductItemClick);
	$('#pageFavoSiteProducts .title-loading').hide();
}

// Called when a product is added to the cart
function addedToCart() {
	myHome.loadHomeNotifications(() => {
		myHome.updateBottomCartNotification();
	});
}

// Called when order is finished
function orderFinished() {
	myHome.loadHomeNotifications(() => {
		const txt = myTranslations.getTranslation(TXT_ORDER_COMPLETED);
		myToast.showLong(txt);
		myHome.popPage();
	});
}

// Called when delivery details are loaded
function deliveryIsLoaded() {
	$('.order-pdf-print, .freight-pdf-print').on('click', favoClicks.onPdfClick);
	$('#pageFavoSiteDeliveryDetails .title-loading').hide();
}

// Called when a product image is deleted
function imgDeleted() {
	favo360api.listStoreItems('', '');
}

// Called when timeline following is loaded
function timelineLoaded() {
	$('#pageFavoSiteTimeline .title-loading').hide();
}

// Called when clicked on Timeline product
function timePostLoaded() {
	$('.wall-post-item:not(.click-attached)').on('click', favoClicks.onTimelineProductImgClick);
	$('.wall-post-item').addClass('click-attached');
}

// Called when Statistics are loaded
function statsLoaded() {
	$('#pageFavoSiteStatistics .title-loading').hide();
}

// Called when Prices page is loaded
function pricesLoaded() {
	$('#pageFavoSitePrices .title-loading').hide();
}

// Called when Favo Group details are loaded
function favListGropLodaded() {
	$('#pageFavoSiteEditGroup .view-comp-details').on('click', favoClicks.onCompanyClick);
	$('#pageFavoSiteEditGroup .view-item-details').on('click', favoClicks.onCompanyClick);
	$('#pageFavoSiteEditGroup .open-chat').on('click', favoClicks.onFavoriteCompContactClick);
}


//****************** Server calls ******************//
function checkIsIOS() {
	if (device.platform == 'iOS') {
		return true;
	} else {
		return false;
	}
}

function userLang() {
	return myStorage.getLanguage();
}

function srvShowLongToast(txt) {
	myToast.showLong(txt);
}

function srvShowShortToast(txt) {
	myToast.showShort(txt);
}