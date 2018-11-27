
var favo360api = {
    
	setLang: function()
	{
		if(typeof lang !== 'undefined') { var crntLang = lang; }
		else  
		{ 
			if (typeof userLang !== 'undefined' && $.isFunction(userLang)) var crntLang = userLang();
			else var crntLang = 'en'; 
		}
		return crntLang;
	},
			
	baseApiUrl: function()
	{
		return "http://ww1.favo360.com";
	},
		
	loadingSm: function()
	{
		return "http://ww1.favo360.com/_s/loading-sm.gif";
	},
	
	
	loadingBig: function()
	{
		var burl = favo360api.baseApiUrl();
		return burl+"/_s/floader.gif";
	},
	
	noImage: function()
	{
		var burl = favo360api.baseApiUrl();
		return burl+'/_s/no-image.png';
	},
	
	favoAjax: function(query) 
	{	
		var burl = favo360api.baseApiUrl();
		
		return	$.ajax({type: "POST", data: query, url: burl+"/jsong/index.php", crossDomain: true, dataType: "JSON",  beforeSend: function(request) { if (typeof authMe !== 'undefined' && $.isFunction(authMe)) authMe(request); },
			error: function (jqXHR, textStatus, errorThrown) { alert("Error textStatus="+textStatus+" errorThrown="+errorThrown); }, cache: false
		});
		
	},
	
	companyType: function()
	{
		var thisLang = favo360api.setLang();
		var mkReq = favo360api.favoAjax("mode=companyType");
		
		$.when(mkReq).done(function(data) 
		{
			var rwm = '<ul class="list-unstyled">';
			
			$.each(data, function(key, val) 
			{						
				if(val.noRes != 1) rwm += '<li><input type="checkbox" class="rwm-check" name="rwm" id="rwm-t'+val.catId+'"'+val.catChecked+'><label for="rwm-t'+val.catId+'">'+val.catName+'</label></li>';
			});	
			
			rwm += '</ul>';
			
			$(".comp-rwm").html(rwm);	
			
			$(".rwm-check").on("click", function(){
				
				var rwmc = this.id.replace('rwm-t', '');
				var rwmccheck = this.checked;
				var rReq = favo360api.favoAjax("mode=companyTypeCheck&check="+rwmccheck+"&itId="+rwmc+"&lang="+thisLang);
				
				$.when(rReq).done(function(data) 
				{
					$.each(data, function(key, val) 
					{						
						if(val.catCheck == 0) $("#rwm-t"+rwmc).removeClass("success-bgr");
						else $("#rwm-t"+rwmc).addClass("success-bgr");
					});		
				});		
				
			});
			
			if (typeof typeIsChecked !== 'undefined' && $.isFunction(typeIsChecked)) typeIsChecked();
		});	
	},

	addEditCategory: function(catMode) 
	{
		
		$(".add-edit-cat").on("click", function(){
		
			var itId = this.id.replace('opr', '');

			favo360api.getCategories(itId, catMode);
			
			return false;
		});
		////////////////////////////
	},	
	
	getCategories: function(itId, catMode) 
	{
		
		var thisLang = favo360api.setLang();
		var loadSm = favo360api.loadingSm();
		var mkReq = favo360api.favoAjax("mode="+catMode+"Categories&lang="+thisLang);
		
		$(".add-edit-cat").after('<img src="'+loadSm+'" id="req-preloader" />');

		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 
				var pca = "";
				
				$.each(data, function(key, val) 
				{						
					if(val.noRes == 1) {alert(val.msg); }
					else { pca += '<li><a href="#" class="text-left this-cat" id="pr-cat'+val.catId+'">'+val.catName+'</a></li>'; }
				});

				$(".col-cat").html('<ul class="nav-y underline-false clear-fix list-cat-check">'+pca+'</ul>');
					
				$.fancybox({height: "40%", minHeight: '350px', autoScale: true, autoSize: false, type: 'inline', href: '#show-prod-cat', 
				
				beforeShow: function(){

				   setTimeout(function(){ 

				   //this.width = $('.filters-all-dialog').outerWidth();
				   //this.height = $('.filters-all-dialog').outerHeight();
	
					}, 2000);
				},
				
					afterShow: function() {
							
						 $(".list-cat-check:first-child a")[0].click(); 
							
						},
				
				afterClose : function(){
					if (typeof itemCatLoad !== 'undefined' && $.isFunction(itemCatLoad)) window.location.reload(false); ///itemCatLoad();
				 }});
 
				favo360api.getSubCategories(catMode, itId);

				$("#req-preloader").remove();
			}
		});	
	},
	
	
	getSubCategories: function(catMode, itId) 
	{
		
		if(!$("#crntCatSel").length) { $(".col-cat-sub").after('<input type="hidden" id="crntCatSel" value="" /> '); }
		
		var btnStyle = 'current';
		var crntBtn = $("#crntCatSel").val();
		var thisLang = favo360api.setLang();
		var loadSm = favo360api.loadingSm();
		
		$('#pr-cat'+crntBtn).parent().addClass(btnStyle);
		
		$(".this-cat").on("click", function(){
				
			var prcat = this.id.replace('pr-cat', '');
			
			$("#crntCatSel").val(prcat);
			
			$(".col-cat-sub").html('<img src="'+loadSm+'" id="req-preloader" />');
			
			$(".this-cat").parent().removeClass(btnStyle);
			$(this).parent().addClass(btnStyle);
						
			var mkReq = favo360api.favoAjax("mode=prodCategoriesSub"+catMode+"&cat="+prcat+"&lang="+thisLang);
			
			$.when(mkReq).done(function(data) 
			{
				if(data != "") 
				{ 
					var sca = "";
								
					$.each(data, function(key, val) 
					{						
						if (typeof val.catId != 'undefined') sca += '<input type="checkbox" name="chkt" id="chkt'+val.catId+'" class="check-this-cat"><label for="chkt'+val.catId+'"><span id="cat-chkt'+val.catId+'">'+val.catName+'</span></label><br>';
					});
					
					$(".col-cat-sub").html(sca);
					favo360api.getChecked(catMode, itId);
					favo360api.setChecked(catMode, itId);
				}
			});
			
			return false;
		});
	},
	
	getChecked: function(catMode, itId)
	{		
		var mkReq = favo360api.favoAjax("mode="+catMode+"IsChecked&itId="+itId);
		
		$.when(mkReq).done(function(data) 
		{
			var ccheck = '';
			
			$.each(data, function(key, val) 
			{						
				if(val.noRes != 1) ccheck += '#chkt'+val.catId+',';
			});										
			
			if(ccheck != '') { $(ccheck.slice(0,-1)).attr("checked", true); }
		});		
	},
	
	setChecked: function(catMode, itId)
	{
		$(".check-this-cat").on("click", function(){
									
			var subcat = this.id.replace('chkt', '');
			var subcheck = this.checked;
			var mkReq = favo360api.favoAjax("mode="+catMode+"Check&cat="+subcat+"&check="+subcheck+"&itId="+itId);
		
			$.when(mkReq).done(function(data) 
			{
				$.each(data, function(key, val) 
				{						
					if(val.catCheck == 0) $("#cat-chkt"+subcat).removeClass("current success-bgr");
					else $("#cat-chkt"+subcat).addClass("current success-bgr");
				});	
			});	
			
		});
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Translate TXT ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	translateText: function(tText)
	{
		var thisLang = favo360api.setLang();	
		var mkReq = favo360api.favoAjax("mode=trText&wht="+tText+"&lang="+thisLang);
		var msg = '';
		var dff = $.Deferred();
		
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 
				var msg = data.msg;
				
				var result = {
				  'trt' : msg
				};
				
			}

			dff.resolve(result);
		});	
		
		var dfp = dff.promise();
		console.log(dfp);
		return dfp;
	},	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Translate TXT ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Store JS pages //////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	storeJsNav: function(compId, prCat, selp, cmode) 
	{	
		if(selp != 1)
		{	
			$('.list-comp-cat')[0].scrollIntoView({
				behavior: "smooth", // or "auto" or "instant"
				block: "start" // or "end"
			});
		}
		
		$(".sel-store-page option[value="+selp+"]").attr('selected','selected');
		
		$(".sel-store-page").on("change", function()
		{
			var sP = $(this).val();					
			//favo360api.companyProd(compId, prCat, sP);
			
			if(cmode == 'pub') favo360api.companyProdMore(compId, prCat, sP);
			else favo360api.listStoreItemsMore(prCat, sP);
			
			return false;
		}); 
		
		var crntp = parseInt($(".sel-store-page").val());
		var allp = parseInt($(".sel-store-page").attr("rel"));
		
		if(crntp == 1) 
		{
			$(".btn-store-prev-nav").off('click').attr("disabled", true);
			$(".btn-store-prev-nav").removeClass("btn-warning").addClass("btn-default");
		}
		
		if(crntp == allp) 
		{
			$(".btn-store-next-nav").off('click').attr("disabled", true);
			$(".btn-store-next-nav").removeClass("btn-warning").addClass("btn-default");
		}
		
		
		$(".store-browse-pages").on("click", function()
		{			
			var np = 1;
			if($(this).hasClass("btn-store-prev-nav")) 	var bp = crntp-1;
			if($(this).hasClass("btn-store-next-nav")) 	var bp = crntp+1;
						
			if(bp >= 1 && bp <= allp) np = bp;

			
			if(cmode == 'pub') favo360api.companyProdMore(compId, prCat, np);
			else favo360api.listStoreItemsMore(prCat, np);
			
			return false;
		}); 
		

		$(".store-go-top").on("click", function()
		{
			$('.list-comp-cat')[0].scrollIntoView({
				behavior: "smooth", // or "auto" or "instant"
				block: "start" // or "end"
			});
			
			return false;
		}); 
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Store JS pages //////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Items //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	listStoreItems: function(prCat, page)
	{
		//var thisLang = favo360api.setLang();	
		//var loadBig = favo360api.loadingBig();
		//var mkReq = favo360api.favoAjax("mode=listStoreItems&itId="+prCat+"&lang="+thisLang);
		
		$(".list-store-items").html('<div class="store-view-hdr"></div><div class="store-view-body"></div>');
		
		//if($('#sEnv').length == 0) favo360api.catFiltWidget(0, 'int');
		
		favo360api.listStoreItemsMore(prCat, page);
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Items //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Items More /////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// 2017
	
	listStoreItemsMore: function(prCat, page)
	{
		var thisLang = favo360api.setLang();
		var selflt = (!$("#filt-sel").val() ? '' : $("#filt-sel").val());
		var srchVal = (!$("#srch-prod-val").val() ? '' : $("#srch-prod-val").val());
		if(prCat != '') srchVal = '';	
		
		var mkReq = favo360api.favoAjax("mode=listStoreItems&itId="+prCat+"&page="+page+"&lang="+thisLang+"&srch="+srchVal);
		var loadBig = favo360api.loadingBig();
		
		//debugger;
		if($(".show-loading").length) $(".store-view-body").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
		//else $('.title-loading').show();
		
		//if(!$(".store-view-body").hasClass("searching")) 
		//{

			$.when(mkReq).done(function(data) 
			{
							
				$(".store-view-body").removeClass("searching");
				$(".loading-tmp").remove();
				
				if(data != "") 
				{ 												
					var selp = '';
					var lit = '';
					var sure = '';
					//console.log(data);
					if(data.noRes == 1) $(".store-view-body").html('<div class="info-display warning-bgr">'+data.msg+'</div>');
					else
					{								
						//console.log(data);
						//lit += '<div class="srch-word-show"></div><h6 id="store-top-res">'+data.storeRes+'</h6>'; 
						var selp = parseInt(data.currentPage);
						var np = parseInt(data.storePages);
						var noimg = favo360api.noImage();
						var nomore = data.nomore;
						var compId = data.compId;
						var sure = data.sure;
						//console.log(data.storePages);		
									
						if(!$(".my-store-items").length) lit += '<div class="my-store-items item-content" data-compid="'+compId+'" rel="">'; 
						
						$.each(data.storeItems, function(key, val) 
						{
							var itmClass = 'sel-itm'+val.itemId;

							if (typeof val.itemId != 'undefined') 
							{
								var cf = (val.itemCats == '' ? '' : '<img src="'+val.itemCats+'" /> ');
								var iv = (val.itemVisSt == 0 ? ' item-danger danger-bgr' : '');
							
								lit += '<div class="section lst-item-my" id="itmDisp'+val.itemId+'"><div class="item-cell"><dl>';
								lit += '<dd class="img" data-item-id="'+val.itemId+'"><a href="#" class="edit edit-item-info item-isText '+itmClass+'" data-item-id="'+val.itemId+'">&nbsp;</a><a href="#" class="edit-item-info item-isImg '+itmClass+'" data-item-id="'+val.itemId+'"><img src="'+val.itemImgCrop+'" alt=""></a></dd>';
								lit += '<dt><a href="#" class="edit-item-info item-isText '+itmClass+'" title="'+val.itemNameFull+'" data-item-id="'+val.itemId+'"><span class="block">'+val.itemSkuTxt+': <strong>'+val.itemSku+'</strong></span></a><div class="price"><strong>'+val.itemPrice+'</strong></div></dt>';
								lit += '<dd class="info"><div class="qty">'+val.itemQtyTxt+' <input type="number" min="0" step="1" name="itmqty" class="txt size-s item-qty" id="itmqty'+val.itemId+'" style="width: 30px;" value="'+val.itemQty+'"></div></dd>';
								lit += '<dd class="list-options"><div class="form-elements dropdown-select dd-sv fL" id="siv'+val.itemId+'"><div class="form-group"><a href="#" class="drop-link drop-sel-vis'+iv+'" data-item-id="'+val.itemId+'" id="dsv'+val.itemId+'">'+val.itemVis+'</a><div class="dropdown-content" id="ddc'+val.itemId+'"></div></div></div>'; // item-danger danger-bgr
								lit += '<a href="#" class="icon icon-delete item-delete" id="itmdel'+val.itemId+'"><span class="icon-wrapper">Delete</span></a></dd></dl></div></div>';	
							}
						});
						
						if(selp == 1 && np > 1 && !$("#crntpge").length) lit += '<input type="hidden" id="crntpge" value="'+selp+'">';
						
						if(!$(".my-store-items").length) lit += '</div>'; 
					}
					
					if(selp == 1)  
					{
						//if(srchVal != '') 
						if(!$(".my-store-items").length) $(".store-view-body").html(lit);
						else $(".my-store-items").html(lit);
						$(".my-store-items").attr("rel", prCat);
						
					}
					else $("#crntpge").before(lit);
					
					if(np == 1) $('.lst-item-my:last').after('<input type="hidden" class="no-more-pages">');
					
					if(selp == np && np > 1)
					{
						//$(".store-view-body").before('<div class="info-display warning-bgr no-more-pages">No more pages</div>');	
						$('.lst-item-my:last').after('<hr></span><div class="no-more-pages info-display" style="width: 100%">'+nomore+'</div>');
					}

					$("#crntpge").val(selp); /// update current page
				}
				
				///////// events
				
					favo360api.plusMinus(".item-qty");
				
					$(".item-qty").on("click", function()
					{	
						var isIOS = false;
						
						if (typeof checkIsIOS !== 'undefined' && $.isFunction(checkIsIOS)) var isIOS = checkIsIOS();
						
						if (isIOS == true) $(this).get(0).setSelectionRange(0,9999);
						else this.select();
					});
					
					$(".item-qty").on("input", function()
					{
						var itd = this.id.replace('itmqty', '');
						var iqt = $(this).val();
						var qReq = favo360api.favoAjax("mode=itmQty&itId="+itd+"&qty="+iqt+"&lang="+thisLang);
						
						$.when(qReq).done(function(data) 
						{
							if(data != "") 
							{ 
								$.each(data, function(key, val) 
								{	
									if(val.noRes == 1) {alert(val.msg); }
									//else { $("#itmDisp"+itd).fadeOut("slow"); }
								});
							}
						});
					}); 

					$(".item-delete").on("click", function()
					{					
						if(confirm(sure)) 
						{
							var itd = this.id.replace('itmdel', '');
							var dReq = favo360api.favoAjax("mode=itmDel&itId="+itd+"&lang="+thisLang);
							
							$.when(dReq).done(function(data) 
							{
								if(data != "") 
								{ 
									$.each(data, function(key, val) 
									{	
										if(val.noRes == 1) {alert(val.msg); }
										else { $("#itmDisp"+itd).fadeOut("slow"); }
									});
								}
							});
						}
						
						return false;
					}); 
					
					$(".drop-sel-vis").on("click", function()
					{
						var itd = this.id.replace('dsv', '');
						$(".dd-sv").not("#siv"+itd).removeClass("on");
						$("#siv"+itd).toggleClass("on");
						$(".drop-sel-vis").removeClass("expanding");
						$("#dsv"+itd).addClass("expanding");
						
							
						var vReq = favo360api.favoAjax("mode=itmVis&itId="+itd+"&lang="+thisLang);
						
						$.when(vReq).done(function(data) 
						{
							if(data != "") 
							{ 
								var vsop = '';
								
								$.each(data, function(key, val) 
								{	
									vsop += val.itmVisOpt;
								});
								
								$("#ddc"+itd).html(vsop);
								
								var rval = $('input[name=iv'+itd+']:checked').val();
						
								$(".item-check"+itd).on("click", function()
								{
									var chv = parseInt($(this).val());
									var vsReq = favo360api.favoAjax("mode=itmVisSel&itId="+itd+"&page="+chv);
									
									if(chv == 2) 
									{
										$(".group-check"+itd).attr("disabled", false);
										$("#grshow"+itd).show();
									}
									else
									{
										$(".group-check"+itd).attr("checked", false);
										$(".group-check"+itd).attr("disabled", true);	
										$("#grshow"+itd).hide();
										//$(".dd-sv").removeClass("on");
									}

									$.when(vsReq).done(function(data) 
									{
										if(data != "") 
										{ 
											if(data.selVisRe == 0) $("#dsv"+itd).addClass("item-danger danger-bgr");
											else  $("#dsv"+itd).removeClass("item-danger danger-bgr");
											console.log('-- '+data.selVisRe);
											//if(data.selVisRe != 2) $(".dd-sv").removeClass("on");
											//if(!$("#dsv"+itd).hasClass("expanding") && data.selVisRe != 2) $(".dd-sv").removeClass("on");
										}
									});
									
									$("#dsv"+itd).html($(this).attr('rel'));
								}); 
									
								$(".group-check"+itd).on("click", function()
								{
									var gch = this.checked;
									var grId = $(this).val();
									var grReq = favo360api.favoAjax("mode=itmGroupSel&itId="+itd+"&check="+gch+"&page="+grId);
									
									$.when(grReq).done(function(data) 
									{
										$.each(data, function(key, val) 
										{						
					
										});		
									});		
								});
								
								$("#iv"+itd+rval).trigger('click');
								
								$("#dsv"+itd).removeClass("expanding");
							}
						});
						
						
						return false;
					});
				
				

				favo360api.storeSrchTitle();
				
				if (typeof itemLinksHookUp !== 'undefined' && $.isFunction(itemLinksHookUp)) itemLinksHookUp();
			});	
		
		//}
		
	},


	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Items More /////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	storeSrchTitle: function()
	{
		if($("#st-srch-word").length)
		{
			$(".srch-word-show").html($("#st-srch-word").val());
		}
	},	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Categories and Filters //////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	catFiltWidget: function(cid, cmode)
	{
		var thisLang = favo360api.setLang();
		var qReq = favo360api.favoAjax("mode=companyProdCatWidget&itId="+cid+"&lang="+thisLang);
		
		$.when(qReq).done(function(data) 
		{
			if(data != "") 
			{ 					
				var scf = '';

				$.each(data.catList, function(i, object) 
				{
					scf += '<li class="nav-heading toggle"><a href="#" id="cat-tog-'+object.catId+'" class="toggle-level">'+object.catName+'</a><ul class="hide top-nav-hide" id="ctog'+object.catId+'">';
					
					$.each(object.catSub, function(key, val) 
					{
						scf += '<li class="prod-cat-tree"><a href="#" id="cat-tog-'+val.catId+'" class="toggle-level">'+val.catName+'</a><ul class="hide" id="ctog'+val.catId+'">';
						
						$.each(val.catSub, function(keyS, valS) 
						{
							scf += '<li class="prod-cat-tree"><a href="#" class="cat-end-point" rel="'+valS.catName+'" id="cep'+valS.catId+'">'+valS.catName+' [<strong>'+valS.catNum+'</strong>]</a></li>';
						});
						
						scf += '</ul></li>';
					});
					
					scf += '</ul></li>';
				});
				
				//if(cmode == 'pub')  &#128269;
				var storeSrch = '<div class="store-search"><input type="text" name="srch-prod-wt" id="srch-prod-wt" class="txt" placeholder="'+data.catTxtSrch+'"> <button class="btn btn-warning btn-serch-store icon ion-ios-search-strong">&nbsp;</button> <button class="btn btn-danger btn-serch-clear" disabled>X</button></div>';
				//else var storeSrch = '<div class="store-search"><input type="text" name="srch-prod-pr" id="srch-prod-pr" class="txt" placeholder="'+data.catTxtSrch+'"> <button class="btn btn-success btn-serch-store-pr">&#128269;</button> <button class="btn btn-danger btn-serch-clear-pr" disabled>X</button></div>';
				
				$(".list-comp-cat").html(storeSrch+'<div class="expandable-nav"><ul class="nav-y level-1">'+scf+'</ul></div>');
				
				if(cmode == 'pub')
				{		
					if($('#srch-prod-pub-val-'+cid).val() != '')  $(".btn-serch-clear").attr("disabled", false);
				}
				else
				{
					if($('#srch-prod-val').val() != '')  $(".btn-serch-clear").attr("disabled", false);	
				}
				
				$("#srch-prod-wt").on("input", function()
				{
					var srchVal = $("#srch-prod-wt").val();
					
					if(srchVal != '') $(".btn-serch-clear").attr("disabled", false);
					else $(".btn-serch-clear").attr("disabled", true);
					
					if(cmode == 'pub')
					{
						if(!$('#srch-prod-pub-val-'+cid).length) $('body').append('<input type="hidden" id="srch-prod-pub-val-'+cid+'" value="" />');
						$("#srch-prod-pub-val-"+cid).val(srchVal);
					}
					else
					{
						if(!$('#srch-prod-val').length) $('body').append('<input type="hidden" id="srch-prod-val" value="" />');
						$("#srch-prod-val").val(srchVal);
					}
				});
				
				$(".btn-serch-clear").on("click", function()
				{
					$(".btn-serch-clear").attr("disabled", true);
					
					if(cmode == 'pub')
					{
						$("#srch-prod-wt, #srch-prod-pub-val-"+cid).val('');
						favo360api.companyProdMore(cid, '', '');
					}
					else
					{
						$("#srch-prod-wt, #srch-prod-val").val('');
						favo360api.listStoreItemsMore('', 1);
					}
				});
				
				$(".btn-serch-store").on("click", function()
				{
					//var srchValRec = $("#srch-prod-pub-val").val()
					if(cmode == 'pub') favo360api.companyProdMore(cid, '', '');
					else favo360api.listStoreItemsMore('', 1);
				});
				
				$(".toggle-level").on("click", function()
				{
					var lc = this.id.replace('cat-tog-', '');
					$("#ctog"+lc).slideToggle(100);
					$(this).parent().toggleClass("on");	
					return false;
				});
				
				//// favo360api.companyProd(compId, prCat, sP);
				
				$(".cat-end-point").on("click", function()
				{
					$('#srch-prod-pub-val-'+cid).val('');
					$('#srch-prod-wt').val('');
					$(".btn-serch-clear").attr("disabled", true);
					
					var catNameShow = $(this).attr("rel");
					var catId = this.id.replace('cep', '');
					if(cmode == 'pub') 
					{
						favo360api.companyProdMore(cid, catId, 0);
						favo360api.catFilters(cid, catId, ".list-cat-filt");
					}
					else 
					{
						favo360api.listStoreItemsMore(catId, 1);
					}
					
					$(".prod-cat-tree").removeClass("current");
					$(this).parent().addClass("current");
					
					$('#st-srch-word').val(catNameShow);
					
					$('.list-comp-cat')[0].scrollIntoView({
						behavior: "smooth", // or "auto" or "instant"
						block: "start" // or "end"
					});
					
					$(".nav-heading").removeClass("on");
					$(".top-nav-hide").hide();
					
					return false;
				});
				
			}

		});	

	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Categories and Filters //////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Edit Items //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	editStoreItems: function(itId, itName, itCode, itPrice, itCrncy, itDesc)
	{
		var loadBig = favo360api.loadingBig();
		var thisLang = favo360api.setLang();
		var mkReq = favo360api.favoAjax("mode=editStoreItems&itId="+itId+"&itname="+itName+"&itcode="+itCode+"&itprice="+itPrice+"&itcrncy="+itCrncy+"&itdesc="+itDesc+"&lang="+thisLang);

		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 
				if(val.noRes == 1) {alert(val.msg); }
				else 
				{ 
					if (typeof itemUpdated !== 'undefined' && $.isFunction(itemUpdated)) itemUpdated();
				}
			}
		});	
		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Edit Items //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Add Item on Complete ////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	addStoreItemsOnComplete: function(ifwd, itemName, txt)
	{
		if(itemName == '')
		{
			if (typeof itemPictureForward !== 'undefined' && $.isFunction(itemPictureForward)) itemPictureForward(ifwd, txt);
			else alert("Undefined function: itemPictureForward");

		}
		else
		{
			if (typeof itemForward !== 'undefined' && $.isFunction(itemForward)) itemForward(ifwd, txt);
			else alert("Undefined function: itemForward");
		}
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Add Item on Complete ////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Add Item ////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	addStoreItems: function(itemName)
	{
		var thisLang = favo360api.setLang();		
		var mkReq = favo360api.favoAjax("mode=addItem&itemName="+itemName+"&lang="+thisLang);
		
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 
				var ifwd = 0;
				
				if(data.noRes == 1) 
				{ 
					favo360api.addStoreItemsOnComplete(0, itemName, data.msg);
					//alert(data.msg); 
				}
				else
				{		
					$.each(data, function(key, val) 
					{												
						//console.log('---'+itemName);
						ifwd = val.itemId; 
						
						favo360api.addStoreItemsOnComplete(ifwd, itemName, '');
						/*
						if(itemName == '')
						{
							if (typeof itemPictureForward !== 'undefined' && $.isFunction(itemPictureForward)) itemPictureForward(ifwd);
							else alert("Undefined function: itemPictureForward");
	
						}
						else
						{
							if (typeof itemForward !== 'undefined' && $.isFunction(itemForward)) itemForward(ifwd);
							else alert("Undefined function: itemForward");
						}
						*/
					});
				}
			}
		});	
		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Add Item ////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Item Categories ////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	listItemCategories: function(catMode, itmId)
	{
		var loadBig = favo360api.loadingBig();
		var thisLang = favo360api.setLang();		
		var mkReq = favo360api.favoAjax("mode="+catMode+"InCat&lang="+thisLang+'&itId='+itmId);
		
		$("#crntCat").html('<img src="'+loadBig+'" />');
		
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 
				var icl = '';
				
				if(data.noRes == 1) {icl += '<div class="info-display danger-bgr">'+data.msg+'</div>'; }
				else
				{
					icl += '<ul>';
								
					$.each(data, function(key, val) 
					{												
						icl += '<li>'+val.catName+'</li>';
					});
					
					icl += '</ul>';
				}
				
				$("#crntCat").html(icl);
			}
		});	
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Item Categories ////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Favourites Manage ///////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	favManage: function(favId, check)
	{
		var thisLang = favo360api.setLang();		
		var mkReq = favo360api.favoAjax("mode=manageFav&itId="+favId+"lang="+thisLang+"&check="+check);
		
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 		
				if (typeof srvShowShortToast !== 'undefined' && $.isFunction(srvShowShortToast)) srvShowShortToast(data.msg);
			}
		});	
	},
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Favourites Manage ///////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Following Manage ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	followManage: function(fwId, check)
	{
		var thisLang = favo360api.setLang();		
		var mkReq = favo360api.favoAjax("mode=manageFollow&itId="+fwId+"lang="+thisLang+"&check="+check);
		
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 		
				
				if (typeof srvShowShortToast !== 'undefined' && $.isFunction(srvShowShortToast)) srvShowShortToast(data.msg);
			}
		});	
	},
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Following Manage ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Favourites List /////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	favList: function()
	{
		var thisLang = favo360api.setLang();
		var burl = favo360api.baseApiUrl();
		var loadBig = favo360api.loadingBig();
		var thisLang = favo360api.setLang();
		var noimg = favo360api.noImage();
		var filtFav = 0;
		var listClass = '.list-fav-comp';
		
		if($("#filt-group").length) 
		{
			filtFav = $("#filt-group").attr("rel");
			listClass = '.list-group-companies';
		}
		
		var mkReq = favo360api.favoAjax("mode=listFav&itId="+filtFav+"&lang="+thisLang);
				
		$(listClass).html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
			
		$.when(mkReq).done(function(data) 
		{
			var compList = data.compList;
			if(typeof data.tabHeader != "undefined") 
			{
				var tabHdrC = data.tabHeader;
				//var fcom = '<hr><table class="mp-table" width="100%"><thead><tr><th>'+tabHdrC.name+'</th><th>'+tabHdrC.city+'</th><th>'+tabHdrC.group+'</th><th>&nbsp;</th></tr></thead><tbody>';
				var fcom = '';
				//// '+tabHdrC.country+' <th>&nbsp;</th>
			}
			
			if(compList != "") 
			{ 								
				var sure = '';
				if(compList.noRes == 1) { fcom = '<div class="info-display danger-bgr">'+compList.msg+'</div>'; }
				else
				{
					var sure = data.sure;
					
					$.each(compList, function(key, val) 
					{												
						fcom += '<div id="rfc'+val.companyId+'" class="section no-image"><div class="item-cell"><dl><dt><a href="#" class="view-comp-details" rel="'+val.companyId+'">'+val.companyName+'</a></dt>';
						fcom += '<dd class="img"><a href="#" class="view-item-details" rel="'+val.companyId+'"><img src="'+val.companyLogo+'" alt=""></a></dd><dd class="info"><ul class="nav-x nav-sep size-l underline-hover clear-fix tint-bgr-5">';
						fcom += '<li><img src="'+burl+'/_s/flags/32/'+val.countryCode+'.png" title="'+val.countryName+'"> '+val.cityName+', <strong>'+val.countryName+'</strong></li>';
						fcom += '<li><label for="coid'+val.companyId+'">'+tabHdrC.group+'</label> <select name="coid" id="coid'+val.companyId+'" class="form-control chng-group">'+val.groupSel+'</select></li>';
						fcom += '<li><label for="alco'+val.companyId+'">'+tabHdrC.allow+'</label> <input type="checkbox" name="checkbox" id="alco'+val.companyId+'" class="allow-access" rel="'+val.companyId+'"'+val.isChecked+'></li>';
						fcom += '</ul> '+val.openChat+' </dd><dd class="list-options"><a href="#" class="icon icon-delete item-delete remove-fav" id="dfc'+val.companyId+'"><span class="icon-wrapper">Delete</span></a></dd></dl> </div> </div>'; 
					});
				}

				//if(typeof data.tabHeader != "undefined") fcom += '</tbody></table>';
				
				$(listClass).html(fcom);
				
				if(!$(".list-group-companies").length)
				{
					if(typeof favListLodaded !== 'undefined' && $.isFunction(favListLodaded)) favListLodaded();
					//console.log(1);
				}
				else
				{
					if(typeof favListGropLodaded !== 'undefined' && $.isFunction(favListGropLodaded)) favListGropLodaded();	
					//console.log(2);
				}

				$(".chng-group").on("change", function()
				{
					var grid = $(this).val();
					var coid = this.id.replace("coid", "");
					var gReq = favo360api.favoAjax("mode=changeGroup&itId="+coid+"&wht="+grid+"&lang="+thisLang);
					
					$.when(gReq).done(function(data) 
					{
						if(data != "") 
						{ 		
							$.each(data, function(key, val) 
							{												
								if(val.noRes == 1) { alert(val.msg); }
								//else { $("#rfc"+remf).fadeOut("slow") }
							});
						}
					});	
				});
				
				

				$(".remove-fav").on("click", function()
				{
					if(confirm(sure)) 
					{
						var remf = this.id.replace("dfc", "");
						var chReq = favo360api.favoAjax("mode=remFav&itId="+remf+"&lang="+thisLang);
						
						$.when(chReq).done(function(data) 
						{
							if(data != "") 
							{ 		
								$.each(data, function(key, val) 
								{												
									if(val.noRes == 1) { alert(val.msg); }
									else { $("#rfc"+remf).fadeOut("slow"); }
								});
							}
						});	
        			}

					return false;
				});
				
				$(".allow-access").on("click", function()
				{
					var ala = $(this).attr("rel");		
					var ach = this.checked;					
					var chReq = favo360api.favoAjax("mode=allowCopy&itId="+ala+"&lang="+thisLang+"&check="+ach);
					
					$.when(chReq).done(function(data) 
					{
						if(data != "") 
						{ 		
							if(data.noRes == 1) { alert(data.msg); }
							else
							{
								$.each(data, function(key, val) 
								{												

								});
							}
						}
					});	
				});
				
				
			}
		});	
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Favourites List /////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Groups List /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	groupsList: function()
	{
		var loadBig = favo360api.loadingBig();
		var thisLang = favo360api.setLang();	
		
		$(".list-groups").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
		
		var mkReq = favo360api.favoAjax("mode=listGroups&lang="+thisLang);
		
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 					
				var groupsList = data.groupsList;
				if(typeof data.tabHeader != "undefined")
				{
					var tabHdrG = data.tabHeader;
 					//var lgr = '<table class="mp-table" width="100%"><thead><tr><th>'+tabHdrG.name+'</th><th>'+tabHdrG.discount+'</th><th>'+tabHdrG.fsite+'</th><th>'+tabHdrG.fchat+'</th><th>'+tabHdrG.numCom+'</th><th>&nbsp;</th></tr></thead><tbody>';
					var lgr = '';
				}
				
				if(groupsList != "") 
				{ 
					$.each(groupsList, function(key, val) 
					{												
						if(val.noRes == 1) {lgr = '<div class="info-display danger-bgr">'+val.msg+'</div>'; }
						else 
						{ 							
							var steCheck = (val.groupSite == 1 ? ' checked="checked"' : '');
							var chaCheck = (val.groupChat == 1 ? ' checked="checked"' : '');
							var grId = val.groupId;
							
							//lgr += '<tr id="rgc'+val.groupId+'"><td>'+val.groupName+'</td><td class="text-center"><input type="text" class="form-control disc-perc" style="width: 40px;" id="gds'+val.groupId+'" value="'+val.groupDiscount+'"> %</td><td class="text-center"><input type="checkbox" class="gr-check check-site" name="grcheck" id="sich'+val.groupId+'"'+steCheck+'></td><td class="text-center"><input type="checkbox" class="gr-check check-chat" name="grcheck" id="sich'+val.groupId+'"'+chaCheck+'></td><td class="text-center">'+val.groupNum+'</td><td class="text-center"><a href="#" id="dgc'+val.groupId+'" class="btn btn-danger size-xxs remove-group">X</a></td></tr>'; 
						
							lgr += '<div id="rgc'+grId+'" class="section no-image"><div class="item-cell"><dl><dt><a href="#" class="edit-group underline-true" rel="'+grId+'" data-name="'+val.groupName+'">'+val.groupName+'</a>, '+tabHdrG.numCom+': '+val.groupNum+'</dt>';
							lgr += '<dd class="info"><ul class="nav-x nav-sep size-l underline-hover clear-fix tint-bgr-5">';
							//lgr += '<li class="" id="scd'+val.groupId+'">'+tabHdrG.discount+' <input type="number" class="form-control disc-perc" style="width: 40px;" id="gds'+val.groupId+'" value="'+val.groupDiscount+'"> %</li>';
							//lgr += '<li><input type="checkbox" class="gr-check check-site selg'+grId+'" name="grcheck" id="sich'+grId+'"'+steCheck+'> <label for="sich'+grId+'">'+tabHdrG.fsite+'</label></li>';
							//lgr += '<li><input type="checkbox" class="gr-check check-chat selg'+grId+'" name="grcheck" id="cich'+grId+'"'+chaCheck+'> <label for="cich'+grId+'">'+tabHdrG.fchat+'</label></li>';
							lgr += '</ul> </dd><dd class="list-options"><a href="#" class="icon icon-delete item-delete remove-group" id="dgc'+grId+'"><span class="icon-wrapper">Delete</span></a></dd></dl> </div> </div>'; 
							
						}
					});		
										
					$(".list-groups").html('<div class="col-100 items item-list item-left company-list gutter-xs item-clear outer-space inner-space-s"><div class="item-content">'+lgr+'</div></div>');
					
					if (typeof groupsLoaded !== 'undefined' && $.isFunction(groupsLoaded)) groupsLoaded();
					
					if (typeof deskNum !== 'undefined' && $.isFunction(deskNum)) deskNum();
					
					//$(".list-groups").html(lgr);
					
					$(".disc-perc").on("input", function(){
								
						var dv = this.id.replace("gds", "");
						
						this.value = this.value.replace(/\D/g,"");
						
						var dval = $(this).val();
						
						var dReq = favo360api.favoAjax("mode=saveDisk&itId="+dv+"&page="+dval);
						
						$.when(dReq).done(function(data) 
						{
							if(data != "") 
							{ 					
								$.each(data, function(key, val) 
								{												
									if (typeof infoSavedMessage !== 'undefined' && $.isFunction(infoSavedMessage)) infoSavedMessage(val.msg);
								});
							}
						});	

					});
					
					$(".gr-check").on("click", function(){
        
						var chth = this.checked;
						
						var whtId = $.grep(this.className.split(" "), function(v, i)
						{
						return v.indexOf("selg") === 0;
						}).join().replace("selg", "");
						
						if($(this).hasClass('check-site')) var chWht = 'siteCheck';
					
						if($(this).hasClass('check-chat')) var chWht = 'chatCheck';
						
						var chReq = favo360api.favoAjax("mode="+chWht+"&itId="+whtId+"&check="+chth);
						
						$.when(chReq).done(function(data) 
						{
							$.each(data, function(key, val) 
							{												
								if (typeof infoSavedMessage !== 'undefined' && $.isFunction(infoSavedMessage)) infoSavedMessage(val.msg);
							});
						});	
					});
					
					$(".remove-group").on("click", function(){
        
						var rgr = this.id.replace("dgc", "");						

						if(confirm("Are you sure?")) 
						{
							var rReq = favo360api.favoAjax("mode=remGroup&itId="+rgr);
							
							$.when(rReq).done(function(data) 
							{
								if(data != "") 
								{ 		
									$.each(data, function(key, val) 
									{												
										if(val.noRes == 1) { alert(val.msg); }
										else { $("#rgc"+rgr).fadeOut("slow") }
									});
								}
							});	
						}

						return false;
					});
					
					$(".edit-group").on("click", function(){
        
						var grid = $(this).attr("rel");
						var grh = $(this).html();
						
						if (typeof editGroup !== 'undefined' && $.isFunction(editGroup)) editGroup(grid, grh);

						return false;
					});

				}
			}
		});	
				
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Groups List /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Companies in group //////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	companiesInGroup: function(grId)
	{
		// list-group-companies list-common-items
		
		if(!$("#filt-group").length) $(".list-group-companies").append('<div id="filt-group" rel="'+grId+'"></div>');
		$("#filt-group").attr("rel", grId);
		$(".list-group-companies").addClass('list-fav-comp');
		favo360api.favList(grId);
	},
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Companies in group //////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Group Add ///////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	groupAdd: function(groupName)
	{
		var thisLang = favo360api.setLang();
		var mkReq = favo360api.favoAjax("mode=addGroup&groupName="+groupName+"&lang="+thisLang);
			
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 					
				if (typeof addGroupCompl !== 'undefined' && $.isFunction(addGroupCompl)) addGroupCompl();
			}
		});	
	},
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Group Add ///////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Sort Images /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	sortImages: function(itmId)
	{
		var burl = favo360api.baseApiUrl();
		
		$(".list-item-images").sortable({
			handle : '.move-image',
			stop:function(event, ui) {
			  $.ajax({
				type: "POST",
				url: burl+"/jsonp.json",
				data: { "prod": itmId, "mode": "imageSort", "images": $(".list-item-images").sortable("serialize")},
				beforeSend: function(request) { if (typeof authMe !== 'undefined' && $.isFunction(authMe)) authMe(request); },
				success: function(){
				   if (typeof imgListRefresh !== 'undefined' && $.isFunction(imgListRefresh)) imgListRefresh();
				}
			  });
			}
		});	
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Sort Images /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Sort Gallery Images /////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	sortGalleryImages: function()
	{
		var burl = favo360api.baseApiUrl();
		
		$(".list-gallery-images").sortable({
			handle : '.move-image',
			stop:function(event, ui) {
			  $.ajax({
				type: "POST",
				url: burl+"/jsonp.json",
				data: { "mode": "imageGallerySort", "images": $(".list-gallery-images").sortable("serialize")},
				beforeSend: function(request) { if (typeof authMe !== 'undefined' && $.isFunction(authMe)) authMe(request); },
				success: function(){
				   if (typeof imgListRefresh !== 'undefined' && $.isFunction(imgListRefresh)) imgListRefresh();
				}
			  });
			}
		});	
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Sort Gallery Images /////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Item Images /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	itemImages: function(itmId)
	{
		var thisLang = favo360api.setLang();	
		var mkReq = favo360api.favoAjax("mode=itemImages&itId="+itmId+"&lang="+thisLang);
		var loadBig = favo360api.loadingBig();	
		var burl = favo360api.baseApiUrl();
		
		$(".list-item-images").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
			
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 					
				var lim = '';
				$.each(data, function(key, val) 
				{												
					if(val.noRes == 1) {lim = '<div class="info-display danger-bgr">'+val.msg+'</div>'; }
					else 
					{ 													
						//lim += '<tr id="rgc'+val.groupId+'"><td>'+val.groupName+'</td><td class="text-center"><input type="checkbox" class="gr-check check-site" name="grcheck" id="sich'+val.groupId+'"'+steCheck+'></td><td class="text-center"><input type="checkbox" class="gr-check check-chat" name="grcheck" id="sich'+val.groupId+'"'+chaCheck+'></td><td class="text-center">'+val.groupNum+'</td><td class="text-center"><a href="#" id="dgc'+val.groupId+'" class="btn btn-danger size-xxs remove-group">X</a></td></tr>'; 
					
						lim += '<div class="section" id="imw_'+val.imgId+'"><div class="item-cell p-xs imgdel'+val.imgId+'"><dl><dd class="img-sort"><a href="'+burl+val.imgOr+'" id="imlnk'+val.imgId+'" target="_blank" title="'+val.imgName+'" data-fancybox="group'+itmId+'" class="fancygall" rel="gallery'+itmId+'"><img src="'+burl+val.imgCr+'" id="imed'+val.imgId+'" class="move-image"></a></dd><dd class="info rd-image"><a href="#" class="btn size-xxs rotate-cw" id="iro'+val.imgId+'">'+val.imgRotateTxt+'</a> <span class="sep-line size-s"> | </span> <a href="#" class="icon icon-delete image-delete" id="imgdel'+val.imgId+'"><span class="icon-wrapper">Delete</span></a></dd></dl></div></div>';
					
					}					
				});	
				
				$(".list-item-images").html(lim);
				
				favo360api.sortImages(itmId);
				
				//if (typeof imgSort !== 'undefined' && $.isFunction(imgSort)) imgSort();
				
				if (typeof imgLoaded !== 'undefined' && $.isFunction(imgLoaded)) imgLoaded();
				
				$(".rotate-cw").on("click", function()
				{
					var imro = this.id.replace('iro', '');
					favo360api.imageRotate(imro, 'item');
					return false;
				}); 
				
				favo360api.delImage("imgDelItm"); 
			}
		});	
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Item Images /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Galery Images ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	galleryImages: function(itmId)
	{
		var thisLang = favo360api.setLang();	
		var mkReq = favo360api.favoAjax("mode=galleryImages&lang="+thisLang);
		var loadBig = favo360api.loadingBig();	
		var burl = favo360api.baseApiUrl();
		
		$(".list-gallery-images").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
			
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 					
				var lim = '';
				$.each(data, function(key, val) 
				{												
					if(val.noRes == 1) {lim = '<div class="info-display danger-bgr">'+val.msg+'</div>'; }
					else 
					{ 													
						//lim += '<tr id="rgc'+val.groupId+'"><td>'+val.groupName+'</td><td class="text-center"><input type="checkbox" class="gr-check check-site" name="grcheck" id="sich'+val.groupId+'"'+steCheck+'></td><td class="text-center"><input type="checkbox" class="gr-check check-chat" name="grcheck" id="sich'+val.groupId+'"'+chaCheck+'></td><td class="text-center">'+val.groupNum+'</td><td class="text-center"><a href="#" id="dgc'+val.groupId+'" class="btn btn-danger size-xxs remove-group">X</a></td></tr>'; 
					
						lim += '<div class="section" id="imw_'+val.imgId+'"><div class="item-cell p-xs imgdel'+val.imgId+'"><dl><dd class="img-sort"><a href="'+burl+val.imgOr+'" id="imlnk'+val.imgId+'" target="_blank" title="'+val.imgName+'" class="fancygall" rel="gallery'+itmId+'"><img src="'+burl+val.imgCr+'" id="imed'+val.imgId+'" class="move-image"></a></dd><dd class="info rd-image"><a href="#" class="btn size-xxs rotate-cw" id="iro'+val.imgId+'">'+val.imgRotateTxt+'</a> <span class="sep-line size-s"> | </span> <a href="#" class="icon icon-delete image-delete" id="imgdel'+val.imgId+'"><span class="icon-wrapper">Delete</span></a></dd></dl></div></div>';
					
					}					
				});	
				
				$(".list-gallery-images").html(lim);
				
				favo360api.sortGalleryImages();

				if (typeof imgLoaded !== 'undefined' && $.isFunction(imgLoaded)) imgLoaded();
				
				$(".rotate-cw").on("click", function()
				{
					var imro = this.id.replace('iro', '');
					favo360api.imageRotate(imro, 'gallery');
					return false;
				}); 
				
				favo360api.delImage("imgDelGall"); 
			}
		});	
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Galery Images ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Delete Image ////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	delImage: function(mode)
	{
		var thisLang = favo360api.setLang();

		$(".image-delete").on("click", function()
		{					
			if(confirm("Are you sure?")) 
			{
				var imd = this.id.replace('imgdel', '');
				var dReq = favo360api.favoAjax("mode="+mode+"&itId="+imd+"&lang="+thisLang);
				
				$.when(dReq).done(function(data) 
				{
					if(data != "") 
					{ 
						if(data.noRes == 1) {alert(data.msg); }
						else 
						{ 
							$("#imw_"+imd).fadeOut("slow"); 
							if (typeof imgDeleted !== 'undefined' && $.isFunction(imgDeleted)) imgDeleted();
						}
					}
				});
			}

			return false;
		}); 
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Delete Image ////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Rotate Images ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	imageRotate: function(imId, mode)
	{
		var thisLang = favo360api.setLang();	
		var burl = favo360api.baseApiUrl();
		var mkReq = favo360api.favoAjax("mode=imageRotate&itId="+imId+"&lang="+thisLang+"&wht="+mode);
		
		$("#imed"+imId).attr('style', 'opacity: .25;');
			
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 					
				$.each(data, function(key, val) 
				{												
					if(val.noRes == 1) {lim = alert(val.msg); }
					else 
					{ 													
						$("#imlnk"+imId).attr('href', burl+'/'+val.imDone);
						$("#imed"+imId).attr('src', burl+'/'+val.crDone);
						$("#imed"+imId).attr('style', 'opacity: 1;');					
					}					
				});	
				
				if (typeof imgListRefresh !== 'undefined' && $.isFunction(imgListRefresh)) imgListRefresh();
			}
		});	
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Rotate Images ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Companies //////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	listComp: function(comCat, comCnt, comStr)
	{
		var thisLang = favo360api.setLang();	
		var mkReq = favo360api.favoAjax("mode=listComp&itId="+comCat+"&wht="+comStr+"&cnt="+comCnt+"&lang="+thisLang);
		var burl = favo360api.baseApiUrl();
		var loadBig = favo360api.loadingBig();	
		
		//if(comStr == '') $(".list-companies").html('<img src="'+loadBig+'" />');
			
		//if(comStr == '')
		//{
		//	$(".list-companies").html('<img src="'+loadBig+'" />');
		//	$(".list-companies").addClass("favo-in-numbers");
		//	favo360api.favoNumbers();
		//}
		//else
		//{	
			$.when(mkReq).done(function(data) 
			{
				if(data != "") 
				{ 					
					var lcom = '';
					$.each(data, function(key, val) 
					{												
						if(val.noRes == 1) {lcom += '<div class="info-display danger-bgr">'+val.msg+'</div>'; }
						else 
						{ 													
							var isFav = (val.compIsFav == 0 ? '' : ' on');
							
							//lco += '<div class="dropdown-line"><a href="#"><span class="img"><img src="'+burl+val.compImg+'" alt="" width="90"></span>'+val.compName+'<br> <img src="'+burl+'/_s/flags/16/'+val.compCountryCode+'.png">  '+val.compCountry+', '+val.compCity+'</a> <br> <a href="#" class="icon icon-fav size-24 fav-manage'+isFav+'" rel="'+val.compId+'"><span class="icon-wrapper">&nbsp;</span><span class="dtop">Favorite company</span></a></div>';
							lcom += '<div class="section"><div class="item-cell"><dl>';
							lcom += '<dd class="img"><a href="#" class="view-comp-details" rel="'+val.compId+'"><img src="'+burl+val.compImg+'" alt=""></a></dd>';
							lcom += '<dt><a href="#" class="view-comp-details comp-title" rel="'+val.compId+'">'+val.compName+'</a></dt>'; 
							lcom += '<dd class="info"><div class="company-meta"><div class="fL">'+val.compType+': '+val.compTypeTxt+'</div>';
							lcom += '<div class="fR">'+val.compTypeCont+'</div>'; 
							lcom += '</div><span class="country"><img src="'+burl+'/_s/flags/32/'+val.compCountryCode+'.png"> '+val.compCity+', <strong>'+val.compCountry+'</strong></span> </dd></dl> </div> </div>';
						}					
					});	
					
					$(".list-companies").html('<div class="col-100 items item-list item-left company-list gutter-xs item-clear outer-space inner-space-s"><div class="item-content">'+lcom+'</div></div>');
					
					if (typeof compListLoaded !== 'undefined' && $.isFunction(compListLoaded)) compListLoaded();
					
					$(".fav-manage").on("click", function(){
						
						var fcom = $(this).attr("rel");
						
						if($(this).hasClass("on")) { var chkd = "false"; }
						else var chkd = "true";
						
						favo360api.favManage(fcom, chkd);
						
						$(this).toggleClass("on");
						
						return false;
					}); 
				}
			});	
		//}
	},
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Companies //////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Info ////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	companyInfo: function(compId)
	{
		//$(".company-store").html(lim);
		// 2017
		var thisLang = favo360api.setLang();	
		var mkReq = favo360api.favoAjax("mode=companyStore&itId="+compId+"&lang="+thisLang);
		var burl = favo360api.baseApiUrl();
			$(".company-store").addClass("list-store-items");
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 					
				var npr;
				var nprTxt = '';
											
				if(data.noRes == 1) { var lcoi = '<div class="info-display danger-bgr">'+data.msg+'</div>';  }
				else 
				{ 																			
					npr = data.companyProd;
					nprTxt = data.companyProdTxt;
					
					var compDesc = data.companyDesc;
					
					var cLogo = (data.companyLogo == 0 ? '' : '<div class="img"><img src="'+data.companyLogo+'" alt=""></div>');
					//var cGall = (data.companyGallery == 0 ? '' : '<dt><a href="#" class="company-gallery btn btn-primary size-xxs" rel="'+compId+'">'+data.companyGallery+'</a></dt>');
					var cGall = '';
					
					if(data.companyGallery != 0)
					{
						$.each(data.companyGallery, function(key, val) 
						{							
							cGall += '<img src="'+val.imgIm+'" style="width: 100%;" alt=""/>';	

						});
					}

					var compInfo = '<div class="company-profile"><div class="wrapper clear-fix"><dl><dt>'+data.companyName+'</dt><dd class="info">';
					compInfo += '<div class="company-meta"><div class="fL">'+data.companyType+'</div></div>';
					compInfo += '<span class="country"><img src="'+burl+'/_s/flags/32/'+data.countryCode+'.png"> '+data.cityName+', <strong>'+data.countryName+'</strong></span><h5>'+data.contactInfoTxt+'</h5><address>'+data.contactInfo+'</address>'+compDesc+'</dd></dl></div></div>';
				
					var lcoi = '<div class="item-graphic"><div class="wrapper"><img src="'+data.companyCover+'" alt="" class="">'+cLogo+'</div>';
			  
              		lcoi += '<div class="company-meta"><a href="#" class="icon icon-fav size-24 fav-manage fav-manage '+data.companyFavOn+'"><span class="icon-wrapper">&nbsp;</span><span class="dtop">'+data.companyFavTxt+'</span></a><a href="#" class="icon icon-following size-24 fw-manage '+data.companyFwOn+'"><span class="icon-wrapper">&nbsp;</span><span class="dtop">'+data.companyFwTxt+'</span></a></div></div>';
            
            		lcoi += '<ul class="nav-x main-nav"><li class="current store-list-tabs" id="home"><a href="#" rel="home" class="sw-store-tabs"><span>'+data.companyNav.home+'</span></a></li><li class="store-list-tabs" id="details"><a href="#" class="sw-store-tabs" rel="details"><span>'+data.companyNav.details+'</span></a></li><li class="store-list-tabs" id="new"><a href="#" class="sw-store-tabs" rel="new"><span>'+data.companyNav.new+'</span></a></li></ul>';

				}					
				
				if(npr == 0) 
				{ 
					var cpro = '<h5>'+nprTxt+'</h5>'; 
					if (typeof companyInfoLoaded !== 'undefined' && $.isFunction(companyInfoLoaded)) companyInfoLoaded();
				}
				else var cpro = '';
				
				$(".company-store").html('<div>'+lcoi+'</div><div class="list-store-items"><span class="load-comp-prod" id="comPrList">'+cpro+'</span><span class="load-comp-info">'+compInfo+cGall+'</span><span class="load-comp-new"></span></div>');
				
				$(".load-comp-new, .load-comp-info").hide();
				
				$(".sw-store-tabs").on("click", function(){

					var ctab = $(this).attr("rel");
					$(".store-list-tabs").removeClass("current");
					$("#"+ctab).addClass("current");
						
					switch(ctab)
					{
						case 'home':
						
						$(".load-comp-prod").show();
						$(".load-comp-new, .load-comp-info").hide();
						
						break;
						
						case 'details':
						
						$(".load-comp-info").show();
						$(".load-comp-prod, .load-comp-new").hide();
	
						break;
						
						
						case 'new':
						
						$(".load-comp-new").show();
						$(".load-comp-prod, .load-comp-info").hide();
						
						if(!$(".comp-new-prod-load").length) favo360api.compNewProd(compId);

						break;
					}
										
					return false;
				}); 
				
				$(".fav-manage").on("click", function(){

					if($(this).hasClass("on")) { var chkd = "false"; }
					else var chkd = "true";
					
					favo360api.favManage(compId, chkd);
					
					$(this).toggleClass("on");
										
					return false;
				}); 
				
				
				$(".fw-manage").on("click", function(){

					if($(this).hasClass("on")) { var chkd = "false"; }
					else var chkd = "true";
					
					favo360api.followManage(compId, chkd);
					
					$(this).toggleClass("on");
										
					return false;
				}); 
				
				if(cpro == '') favo360api.companyProd(compId, 0, 1);
			}
		});	
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Info ////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company New Products ////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	compNewProd: function(compId)
	{
		// list-pices list-common-items
		
		var thisLang = favo360api.setLang();
		var qReq = favo360api.favoAjax("mode=compNewProd&lang="+thisLang+"&itId="+compId);
		var loadBig = favo360api.loadingBig();
		$(".load-comp-new").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
		
		$.when(qReq).done(function(data) 
		{
			if(data != "") 
			{ 									
				///// load-comp-new
				
				var lit = '<div class="comp-new-prod-load items item-list item-col-3 items-public-store main-items"><div class="item-content">';
				
				//<div class="items item-list item-col-3 main-items items-public-store tab-home"><div class="item-content">
				
				$.each(data.storeItems, function(key, val) 
				{					
					lit += '<section class="lst-item"><div class="item-cell"><a href="#" class="view-item-info" rel="'+val.itemId+'"><img src="'+val.itemImgCrop+'" alt=""/><h1>'+val.itemName+'</h1><div class="price cB">'+val.itemPrice+'</div></a></div></section>';	
				});
				
				lit += '</div></div>';
				
				$(".load-comp-new").html(lit);
				
				if (typeof newItemsLoaded !== 'undefined' && $.isFunction(newItemsLoaded)) newItemsLoaded();
			
			}
		});	
			
	},
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company New Products ////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Category filters ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	catFilters: function(comId, catId, loadIn)
	{
		var thisLang = favo360api.setLang();
		
		var modHtml = '<section class="cd-section">';
		modHtml += '<div class="cd-modal-action"><a href="#" class="btn" data-type="modal-trigger" id="show-filters">&nbsp;</a> <span class="cd-modal-bg"></span></div><a href="#" class="icon icon-close" id="clear-all-filters">&nbsp;<span class="icon-wrapper">&nbsp;</span></a>';
		modHtml += '<div class="cd-modal"><div class="cd-modal-content"><div id="crnt-filters">&nbsp;</div></div></div><a href="#" class="cd-modal-apply">Apply</a> <a href="#" class="cd-modal-close">Close</a></section>';
		
		if(!$(".filter-is-web").length) var modHtml = '';
		
		$(loadIn).html(modHtml);
		
		var qReq = favo360api.favoAjax("mode=catCompFilt&itId="+comId+"&flt="+catId+"&lang="+thisLang);
		
		$.when(qReq).done(function(data) 
		{
			if(data != "") 
			{ 					
				//console.log(data);			
				
				var fList = '';
				
				if(data.noRes == 1) {fList += '<div class="info-display warning-bgr">'+data.msg+'</div>'; }
				else
				{					
					$("#show-filters").html(data.filtTxt);
					$("#clear-all-filters").html(data.filtClearTxt);
					
					$.each(data.filters, function(i, object) 
					{							
						fList += '<div class="mini-nav"><ul class="clear-fix"><li class="sub-menu"><a href="#" class="clear-fix select-mock-filt-srch mock-sel-more sel-filt" id="showf'+object.parId+'" >'+object.parName+'</a><div class="inner"><ul id="slfi'+object.parId+'">';
						
						$.each(object.subc, function(key, val) 
						{
					
							fList += '<li><label for="sopt_'+val.filtId+'"><input type="checkbox" name="sopt" class="chck-filt" value="'+val.filtId+'" id="sopt_'+val.filtId+'">'+val.filtName+'</label></li>';
						
						});
						
						fList += '</ul></div></li></ul></div>';
					});
				}
				
				$("#crnt-filters").html(fList);
				
				if(typeof trFilt !== 'undefined' && $.isFunction(trFilt)) trFilt();
				
				////
				
				$(".select-mock-filt-srch").on("click", function(event)
				{
					
					$(".select-mock-filt-srch").not(this).parent().removeClass("on");
					
					$(this).parent().toggleClass("on");
							
					event.stopPropagation();
					return false;
				});
				
				$(".chck-filt").on("click", function()
				{
					var fs = $(this).val(); 
					
				});
				
				$("#clear-all-filters").on("click", function()
				{
					postVal(document.URL, {clfi: 1})
					
				});
			}
		});	
		
		favo360api.fireModal();
		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Category filters ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Apply Filters ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	catFiltersApply: function()
	{
		// "filt-sel"	
		var filArr = [];
		   $(".chck-filt:checkbox:checked").each(function(){
				
				var fc = $("#filt-sel").val();
				
				$("#filt-sel").val($("#filt-sel").val()+',');
				
				filArr.push($(this).val());
				
			});
			
			if(!$('#filt-sel').length) $('body').append('<input type="hidden" name="filt-sel" id="filt-sel" value="" />');
	
			$("#filt-sel").val(filArr);
			
			if(typeof applyFilters !== 'undefined' && $.isFunction(applyFilters)) applyFilters();
			else
			{
				var compId = $(".store-view-hdr").data("compid");
				var prCat = $(".store-view-hdr").data("cat");
				var np = $(".store-view-hdr").data("page");
				
				//favo360api.companyProdMore(compId, prCat, np);
			}
			
			//var fsr = filArr.serializeArray();
			
			//alert(filArr);
		
		//	var qReq = favo360api.favoAjax("mode=wtf&wtf="+JSON.stringify(filArr));
		
		/*
		$.when(qReq).done(function(data) 
		{
			
		});
		*/
		
	},

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Apply Filters ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Products ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	companyProd: function(compId, prCat, page)
	{
		var crntc = $(".store-view-hdr").data("compid");
		//
		$("#comPrList").html('<div class="store-view-hdr" data-compid="'+compId+'" data-cat="'+prCat+'" data-page="'+page+'"></div><div class="list-comp-cat"></div><div class="list-cat-filt"></div><div class="store-view-body"></div><div class="store-view-pages"></div><input type="hidden" name="st-srch-word" id="st-srch-word"><input type="hidden" name="crnt-cat" id="crnt-cat">');
		// fireModal
		//debugger;
		favo360api.companyProdMore(compId, prCat, page);

		//if($('#sEnv').length == 0) favo360api.catFiltWidget(compId, 'pub');
	},

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Products ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Products search  ////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////// Public
	
	
	companyProdSearch: function(compId, str, clear)
	{
		//console.log(compId+' - '+str+' - '+clear);	
		if($(".my-store-items").length)	
		{
			favo360api.listStoreItemsMore('', 1);
			console.log(compId);
		}
		else 
		{
			favo360api.initHome();
			favo360api.companyProdMore(compId, '', 1);
		}
	},
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Products search  ////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Categories  /////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 
	 
	companyCategories: function(compId, catId)
	{
		//console.log(compId+' - '+catId);
		if($(".my-store-items").length)
		{
			$("#srch-prod-val input").val('')
			favo360api.listStoreItemsMore(catId, 1);
		}
		else
		{
			$("#srch-prod-pub-val-"+compId+" input").val('');
			favo360api.initHome();
			favo360api.companyProdMore(compId, catId, 1);
		}
	},
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Categories  /////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////// Public
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Init Home Button ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////// Public
	
	initHome: function()
	{
		$(".store-list-tabs").removeClass("current");
		$("#home").addClass("current");
		$(".load-comp-prod").show();
		$(".load-comp-new, .load-comp-info").hide();
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Init Home Button ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Products More  //////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////// Public
	
	companyProdMore: function(compId, prCat, page)
	{
		var thisLang = favo360api.setLang();
		var selflt = (!$("#filt-sel").val() ? '' : $("#filt-sel").val());
		//var srchVal = (!$("#srch-prod-pub-val-"+compId).val() ? '' : $("#srch-prod-pub-val-"+compId).val());
		
		var srchVal = (!$("#srch-prod-pub-val-"+compId+" input").val() ? '' : $("#srch-prod-pub-val-"+compId+" input").val());
		if(prCat != '') srchVal = '';	
		
		var mkReq = favo360api.favoAjax("mode=companyProducts&itId="+compId+"&cat="+prCat+"&page="+page+"&lang="+thisLang+"&fitm="+selflt+"&srch="+srchVal);
		var loadBig = favo360api.loadingBig();

		$(".store-view-pages").html('');
		//$(".store-view-body").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');

		//debugger;
		if($(".show-loading").length) $(".store-view-body").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
		//else $('.title-loading').show();
		
		//if(!$(".store-view-body").hasClass("searching")) 
		//{

			$.when(mkReq).done(function(data) 
			{
							
				$(".store-view-body").removeClass("searching");
				$(".loading-tmp").remove();
				
				if(data != "") 
				{ 												
					var selp = '';
					var lit = '';
					//console.log(data);
					if(data.noRes == 1) 
					{
						//lit +=  '<div class="info-display warning-bgr">'+data.msg+'</div>'; 
						$(".store-view-body").html('<div class="info-display warning-bgr">'+data.msg+'</div>');
						//$(".bottom-bar").addClass("hide");
					}
					else
					{								
						//console.log(data);
						//lit += '<div class="srch-word-show"></div><h6 id="store-top-res">'+data.storeRes+'</h6>'; 
						var selp = parseInt(data.currentPage);
						var np = parseInt(data.storePages);
						var noimg = favo360api.noImage();
						var nomore = data.nomore;
						//console.log(data.storePages);		
									
						if(!$(".items-public-store").length) lit += '<div class="items item-list item-col-3 main-items items-public-store tab-home" rel=""><div class="item-content srch-results-pub">'; 
						
						$.each(data.storeItems, function(key, val) 
						{
							/*
							lit += '<div class="section load-comp-prod" id="itmDisp'+val.itemId+'"><div class="item-cell"><dl>';
							lit += '<dd class="img"><a href="#" class="view-item-info" rel="'+val.itemId+'"><img src="'+val.itemImgCrop+'" alt=""></a></dd>';
							lit += '<dt><a href="#" class="view-item-info item-isText" title="'+val.itemNameFull+'" rel="'+val.itemId+'">'+val.itemSkuTxt+': <strong>'+val.itemSku+'</strong>'+val.itemName+'</a></dt><dd class="list-options"></dd>';
							lit += '<dd class="info"><div class="price cB"><a href="#" class="view-item-info" rel="'+val.itemId+'"><strong class="text-danger">'+val.itemPrice+'</strong></a></div></dd>'; // 
							lit += '</dl></div></div>';	
							*/
							
							lit += '<section class="lst-item"><div class="item-cell"><a href="#" class="view-item-info" rel="'+val.itemId+'"><img src="'+val.itemImgCrop+'" alt=""/><h1>'+val.itemName+'</h1><div class="price cB">'+val.itemPrice+'</div></a></div></section>';	
							
						});
						
						if(selp == 1 && np > 1 && !$("#crntpge").length) lit += '<input type="hidden" id="crntpge" value="'+selp+'">';
						
						if(!$(".items-public-store").length) lit += '  </div></div>'; 
											

						//console.log(np);
	
						/*
						if(np > 1)
						{
							//$(".bottom-bar").removeClass("hide");
							
							var spg = '<div class="fL">'+data.storePagesTxt+'<select name="scpage" class="sel-store-page txt" rel="'+np+'">';
		
							for (var i = 0; i < np; i++) 
							{
								spg += '<option value="'+(i+1)+'">'+(i+1)+'</option>';
							}
							spg += '</select> </div>'; // <a href="#store-top-res" class="store-go-top">Top</a>
							spg += '<div class="fR"><button class="btn btn-warning btn-store-prev-nav store-browse-pages">&#10094;</button> <button class="btn btn-warning btn-store-next-nav store-browse-pages">&#10095;</button></div>';	
							
							$(".store-view-pages").html(spg);
							//$(".pagination-bar").html(spg);
							//$(".bottom-bar, .page__background").remove();
							
							favo360api.storeJsNav(compId, prCat, selp, 'pub');
						}
						//else $(".bottom-bar").addClass("hide");
						*/
					}
					
					if(selp == 1)  
					{
						//if(srchVal != '') 
						if(!$(".items-public-store").length) $(".store-view-body").html(lit);
						else $(".srch-results-pub").html(lit);
						$(".items-public-store").attr("rel", prCat);
						//else $(".store-view-body").html(lit);
					}
					else $("#crntpge").before(lit);
					
					if(np == 1) $('.lst-item:last').after('<input type="hidden" class="no-more-pages">');
					
					if(selp == np && np > 1)
					{
						//$(".store-view-body").before('<div class="info-display warning-bgr no-more-pages">No more pages</div>');	
						$('.lst-item:last').after('<div class="info-display no-more-pages" style="width: 100%">'+nomore+'</div>');
					}
					
					
					
					$("#crntpge").val(selp); /// update current page
				}

				favo360api.storeSrchTitle();
				
				if (typeof companyInfoLoaded !== 'undefined' && $.isFunction(companyInfoLoaded)) companyInfoLoaded();
			});	
		
		//}
		
	},

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Products More  //////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Scroll Handler //////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	scrollHandler: function()
	{
		//console.log('End of the line');
		var loadSm = favo360api.loadingSm();
		var loading = '<div class="loading-tmp" style="display: block; margin: 0 auto;"><img src="'+loadSm+'" style="margin-top: 10px;" /></div>';
		var page;
		
		if(!$("#crntpge").length) page = 1;
		else page = parseInt($("#crntpge").val());
		var nexp = page+1;
		
		if($(".items-public-store").length)
		{
			//console.log('Public Store');
			
			if(!$(".store-view-body").hasClass("searching")) 
			{
				if(!$(".no-more-pages").length)
				{
					var crntc = $(".store-view-hdr").data("compid");
					var thiscat = $(".items-public-store").attr("rel");
					$(".store-view-body").addClass("searching");
					$("#crntpge").before(loading);
					
					favo360api.companyProdMore(crntc, thiscat, nexp);
				}
			}
		}
		
		if($(".items-all-prod").length)
		{			
			if(!$(".list-companies-products").hasClass("searching")) 
			{
				if(!$(".no-more-pages").length)
				{
					$(".list-companies-products").addClass("searching");
					$("#crntpge").before(loading);
					
					favo360api.companiesProducts('', '', nexp);
				}
			}
		}
		
		if($(".my-store-items").length)
		{
			//console.log('My Store');
			if(!$(".store-view-body").hasClass("searching")) 
			{
				if(!$(".no-more-pages").length)
				{
					var thiscat = $(".my-store-items").attr("rel");
					$(".store-view-body").addClass("searching");
					$("#crntpge").before(loading);
					
					favo360api.listStoreItemsMore(thiscat, nexp);
				}
			}
		}
	},
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Scroll Handler //////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Products from companies  ////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	

	companiesProducts: function(country, prCat, page)
	{
		var thisLang = favo360api.setLang();
		var srchVal = '';

		if(prCat != '') srchVal = '';	
		
		var mkReq = favo360api.favoAjax("mode=favo360products&cat="+prCat+"&page="+page+"&lang="+thisLang+"&srch="+srchVal);
		var loadBig = favo360api.loadingBig();
		var burl = favo360api.baseApiUrl();
			
		//if(!$('.store-view-pages').length) $(".list-companies-products").after('<div class="store-view-pages"></div>');
		
		$(".store-view-pages").html('');

		if($(".show-loading").length) $(".store-view-body").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
		//else $('.title-loading').show();
		
		$.when(mkReq).done(function(data) 
		{
			$(".list-companies-products").removeClass("searching");
			$(".loading-tmp").remove();
			
			if(data != "") 
			{ 												
				var selp = '';
				var lit = '';
				
				if(!$(".items-all-prod").length) lit += '<img src="'+burl+'/_s/f360hdr.jpg" />';
				
				if(data.noRes == 1) lit += '<div class="info-display warning-bgr">'+data.msg+'</div>'; 
				else
				{								
					//console.log(data);
					//lit += '<div class="srch-word-show"></div><h6 id="store-top-res">'+data.storeRes+'</h6>'; 
					var np = parseInt(data.storePages);
					var selp = parseInt(data.currentPage);
					var noimg = favo360api.noImage();
					var nomore = data.nomore;
					
					if(!$(".items-all-prod").length) lit += '<div class="items item-list item-col-3 main-items items-all-prod"><div class="item-content">'; 
					
					$.each(data.storeItems, function(key, val) 
					{						
						lit += '<section class="lst-item"><div class="item-cell"><a href="#" class="view-item-info" rel="'+val.itemId+'"><img src="'+val.itemImgCrop+'" alt=""/><h1>'+val.itemName+'</h1><div class="price cB">'+val.itemPrice+'</div></a></div></section>';	
					});
					
					if(!$(".items-all-prod").length) lit += '<input type="hidden" id="crntpge" value="'+selp+'"></div></div>'; 

					
					//console.log(np);
	

				}
				
				//$(".list-companies-products").html(lit); // list-companies-products
				
				if(selp == 1)  $(".list-companies-products").html(lit);
				else $("#crntpge").before(lit);
				
				if(selp == np && np > 1)
				{
					//$(".store-view-body").before('<div class="info-display warning-bgr no-more-pages">No more pages</div>');	
					$('.lst-item:last').after('<div class="info-display no-more-pages" style="width: 100%">'+nomore+'</div>');
				}
				
				$("#crntpge").val(selp);
				
			}
			
			if (typeof companiesProductsLoaded !== 'undefined' && $.isFunction(companiesProductsLoaded)) companiesProductsLoaded();
			
		});	
		
	},

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Products from companies  ////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Categories //////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/*
	
	companyCat: function(compId)
	{
		var thisLang = favo360api.setLang();	
		var mkReq = favo360api.favoAjax("mode=companyProdCat&itId="+compId+"&lang="+thisLang);
			
		$.when(mkReq).done(function(data) 
		{
			var cpc = '';
			
			if(data != "") 
			{ 									
				cpc += '<select id="filt-prod"><option>All</option>';							

				$.each(data, function(i, object) 
				{
					cpc += '<optgroup label="'+object.catName+'">';
					
					$.each(object.catSub, function(key, val) 
					{
						cpc += '<option value="'+val.catId+'">'+val.catName+'</option>';
					});
					
					cpc += '</optgroup>';
				});	
				
				cpc += '</select>';
				
			}
			
			
			
			$(".list-store-items").prepend('<div>'+cpc+'</div><hr>');
			
			
			    $("#filt-prod").on("change", function(){
        
					var prCat = $(this).val();
					
					$("#comPrList").html('');
					
					favo360api.companyProd(compId, prCat, 0);
					
					return false;
					
				}); 
			
		});	
		
	},
	
	*/
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Company Categories //////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Save filters ////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	saveProdFilt: function(itId, filtArr)
	{
		var mkReq = favo360api.favoAjax("mode=saveProdFilt&productFilters="+filtArr+"&itId="+itId);
			
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 									
				var cpc = '';
				
				$.each(data, function(key, val)
				{
					//$("#of"+val.optCh).attr("checked", true);
					
				});	
				
			}
						
		});	
		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Save filters ////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Product Details /////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	prodDetails: function(itId)
	{
		var thisLang = favo360api.setLang();			
		var mkReq = favo360api.favoAjax("mode=prodDetailsLoad&itId="+itId+"&lang="+thisLang);
		var noimg = favo360api.noImage();
		
		//$(".list-common-items").toggleClass("list-common-items item-description");
			
		$.when(mkReq).done(function(data) 
		{													
			var cpd = '';	
			
			if(data != "") 
			{ 									
				var prodCompId = data.prodCompId;
				var isown = (data.prodIsOwn == 1 ? true : false);
				//debugger;
				cpd += '<div class="prod-gallery" id="prod-gallery" data-img-id="" data-img="" data-prod-id="'+data.prodProdId+'" data-comp-id="'+data.prodCompId+'">';							

				$.each(data.prodImg, function(key, val) 
				{
					//alert(val.iCrop);
					cpd += '<div id="slic'+val.imId+'"><img src="'+val.iIm+'" class="is-slick" id="sli'+val.imId+'" data-img="'+val.iCrop+'" style="width: 100%;" />'+val.itemBuy+'</div>'; // <button>Add to cart '+val.imId+'</button>					
				});
				
				cpd += '</div><div class="item-info">';
				
				$.each(data.prodInfo, function(key, val) 
				{
					//alert(val.iCrop);
					cpd += '<h4>'+val.itemName+'</h4><div class="price cB"><strong class="text-danger">'+val.itemPrice+'</strong></div>';
					cpd += '<button class="btn btn-default visit-shop" data-comp-id="'+data.prodCompId+'">'+data.visitTxt+'</button>';
						
					if(val.canCopy == 1) cpd += '<div class="cy-prod fR"></div>';
					if(val.itemDesc != '') cpd += '<div class="cB">'+val.itemDesc+'</div>';
				});
				
				//cpd += '<hr><div>'+data.prodDim+'</div>';
				cpd += '</div>';
				if(data.prodFilters != '') cpd += '<div class="item-specifics">'+data.prodFilters+'</div>';
				
			}	

			$(".load-prod-details").html(cpd);
			
			favo360api.copyProd(prodCompId, itId);
			favo360api.plusMinus(".upd-qty");
			
			var fsl = $("#prod-gallery").children().first().attr("id").replace("slic", "");
			$("#prod-gallery").attr("data-img-id", fsl);
			$("#prod-gallery").attr("data-img", $("#sli"+fsl).attr("data-img"));

			if($('.prod-gallery').length)
			{										
				$('.is-slick:first').on('load', function()
				{
					setTimeout(function(){ $('#prod-gallery').not('.slick-initialized').slick({infinite: true, dots: true, arrows: false, adaptiveHeight: true}); }, 30); // , lazyLoad: 'progressive'
					
				});
				
				
				$('#prod-gallery').on('afterChange', function(event, slick, currentSlide, nextSlide){
				  
				  var crns = $(slick.$slides.get(currentSlide)).attr('id').replace("slic", "");
				  $("#prod-gallery").attr("data-img-id", crns);
				  $("#prod-gallery").attr("data-img", $("#sli"+crns).attr("data-img"));
				  //console.log(crns);
				});
				
				//favo360api.addToCart(itId, imId, qty);
				
			}
			else alert("Gallery not loaded");
			
			favo360api.selectQty();
						
			$('.add-cart-item').on('click', function()
			{
				var imgId = $(this).attr('rel');
				var itemId = $('#itmOrd'+imgId).attr('rel');
				var itmQty = $('#itmOrd'+imgId).val();
				
				if(itmQty == '' || itmQty == 0) itmQty = 1;
				//alert("clicks");
				favo360api.addToCart(itemId, imgId, itmQty);
				return false;
			});
			
			if (typeof prodIsLoaded !== 'undefined' && $.isFunction(prodIsLoaded)) prodIsLoaded(isown);
		});	
		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Product Details /////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Shopping Cart ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	shoppingCart: function()
	{
		var thisLang = favo360api.setLang();			
		var mkReq = favo360api.favoAjax("mode=shoppingCart&lang="+thisLang);
		var loadBig = favo360api.loadingBig();	
		
		$(".list-shopping-cart").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
			
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 									
				//// .list-shopping-cart if(val.noRes == 1) {sca += '<div class="info-display warning-bgr">'+val.msg+'</div>'; }
				
				var usc = '';
				var uhd = '';
				var cHtml = '';
				var sure = '';
							
				if(data.noRes == 1) { $(".list-shopping-cart").html('<div class="info-display">'+data.msg+'</div>'); }
				else
				{			
					var sure = data.sure;
					var pay = data.pay;
					var deliv = data.deliv;
					var save = data.save;
					
					uhd = '<div id="doc-id" data-doc-id="'+data.docid+'"><h3>'+data.storeInfo.company+'</h3><p><span class="warning-bgr"><span class="cart-vol">'+data.storeVol+'</span> m<sup>3</sup></span> - '+data.storeInfo.total+'</p> <button id="ord-compl" class="btn btn-default">'+data.storeInfo.complete+'</button> <button id="ord-cancel" class="btn btn-default">'+data.storeInfo.cancel+'</button></div> <hr>';
					
					$.each(data.storeItems, function(key, val) 
					{
						usc += '<div class="section clear-fix" id="itmDisp'+val.stmId+'"><div class="item-cell"><dl>';
						usc += '<dt>'+val.stmProdName+'</dt>';
                        usc += '<dd class="img"><a href="#" class="view-item-details" rel="'+val.stmProdId+'"><img src="'+val.stmProdImg+'" alt=""></a></dd>'; // view-comp-details
                        usc += '<dd class="list-options"><a href="#" class="icon icon-delete item-delete" id="itmdel'+val.stmId+'"><span class="icon-wrapper">Delete</span></a></dd>';
                        usc += '<dd class="info"><div class="form-elements clear-fix form-inline fR text-right">';
                        usc += '<div class="price cB">'+val.stmProdPrice+'</div><div class="form-group qty">'+val.stmProdQty+'</div>';
                        usc += '<hr class="size-xs"><div class="volume fL">'+val.stmProdVol+' m<sup>3</sup></div> <div class="price amount fR">'+val.stmProdAm+'</div></div></dd></dl></div></div>';
					});
					
					
					var cHtml = '<div class="col-100 items item-list item-left company-list gutter-xs item-clear outer-space inner-space-s"><div class="item-content">'+uhd+' '+usc+' '+pay+' '+deliv+'</div></div>';
					
					$(".list-shopping-cart").html(cHtml);
				}

				favo360api.selectQty();
				favo360api.updateQty();
				favo360api.plusMinus(".upd-qty");
								
				$(".item-delete").on("click", function(){
										
					if(confirm(sure)) 
					{
						var itd = this.id.replace('itmdel', '');
						var dReq = favo360api.favoAjax("mode=docDelRow&itId="+itd+"&lang="+thisLang);
						
						$.when(dReq).done(function(data) 
						{
							if(data != "") 
							{ 								
								if(data.noRes == 1) {alert(data.msg); }
								else { $("#itmDisp"+itd).fadeOut("slow"); }
								$(".st-doc-sum").html(data.storeSum);		
								//$("#stam"+siq).html(data.stmAm);	
								if($('#qty-in-basket').length) $('#qty-in-basket').html(data.storeNum);
							}
						});
					}
					
					return false;
				}); 
				
				$(".delivery-addr").on("input", function(){

					if(!$('.save-addr').length) $(".cart-delivery").before('<button type="submit" class="btn btn-primary fR save-addr">'+save+'</button>');
					
						$(".save-addr").off().on("click", function(){
												
							var cartid = $("#doc-id").data("doc-id");
							var addr = $(".delivery-addr").val();
							var dReq = favo360api.favoAjax("mode=docUpdAddr&itId="+cartid+"&wht="+addr+"&lang="+thisLang);
							
							$.when(dReq).done(function(data) 
							{
								if(data != "") 
								{ 								
									if(data.noRes == 1) {alert(data.msg); }
									else { $(".save-addr").remove(); }
								}
							});
							
							return false;
						});
				}); 
				
				$("#ord-cancel").on("click", function(){
										
					if(confirm(sure)) 
					{
						var dReq = favo360api.favoAjax("mode=ordCancel&lang="+thisLang);
						
						$.when(dReq).done(function(data) 
						{
							if(data != "") 
							{ 								
								$.each(data, function(key, val) 
								{	
									if(val.noRes == 1) {alert(val.msg); }
									else 
									{	
									 //favo360api.shoppingCart(); 
									 
									 if (typeof cartUpdated !== 'undefined' && $.isFunction(cartUpdated)) cartUpdated();	
									}
								});
							}
						});
					}
					
					return false;
				}); 
				
				$("#ord-compl").on("click", function(){
										
					if(confirm(sure)) 
					{
						var cReq = favo360api.favoAjax("mode=ordCompl&lang="+thisLang);
						
						$.when(cReq).done(function(data) 
						{
							if(data != "") 
							{ 								
								$.each(data, function(key, val) 
								{	
									if(val.noRes == 1) {alert(val.msg); }
									else 
									{ 
										//favo360api.shoppingCart(); 
										if (typeof cartUpdated !== 'undefined' && $.isFunction(cartUpdated)) cartUpdated();
									}
								});
							}
						});
					}
					
					return false;
				}); 
				
			}
			
			if (typeof cartIsLoaded !== 'undefined' && $.isFunction(cartIsLoaded)) cartIsLoaded();
						
		});	
		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Shopping Cart ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Add to Cart /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	addToCart: function(prod, imId, qty)
	{
		var thisLang = favo360api.setLang();			
		var mkReq = favo360api.favoAjax("mode=addToCart&prod="+prod+"&itId="+imId+"&qty="+qty+"&lang="+thisLang);
			
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 									
				if(data.noRes == 1) alert(data.msg);
				else alert(data.added);
			}
			
			if(typeof addedToCart !== 'undefined' && $.isFunction(addedToCart)) addedToCart();
						
		});		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Add to Cart /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		

	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Orders /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	listOrders: function(ordMode) //// 1 => opened orders, 2 => closed orders
	{
		var thisLang = favo360api.setLang();			
		var mkReq = favo360api.favoAjax("mode=listOrders&itId="+ordMode+"&lang="+thisLang);
		var loadBig = favo360api.loadingBig();	
		
		$(".list-orders").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
			
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 									
				//// .list-orders
				
				$(".list-orders").addClass("list-fav-comp");
				
				if(data != "") 
				{ 													
					var udev = '';
					
					if(data.noRes == 1) { udev += '<div class="info-display warning-bgr">'+data.msg+'</div>'; }
					else
					{
						$.each(data, function(key, val) 
						{						
							udev += '<div id="rfc'+val.docId+'" class="section no-image"><div class="item-cell"><dl><dt><a href="#" class="view-order-details" rel="'+val.docId+'">'+val.docCompany+'</a></dt>';
							udev += '<dd class="img"><a href="#" class="view-order-details" rel="'+val.docId+'"><img src="'+val.companyLogo+'" alt=""></a></dd><dd class="info"><ul class="nav-x nav-sep size-l underline-hover clear-fix tint-bgr-5"><li># '+val.docNum+'</li><li>'+val.docSum+'</li></ul></dd></dl></div></div>'; 
						});
					}
					
					$(".list-orders").html(udev);
										
				}
				
			}
			
			if (typeof ordersLoaded !== 'undefined' && $.isFunction(ordersLoaded)) ordersLoaded();			
		});	
		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Orders /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Deliveries /////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	listDeliveries: function(delMode) //// 1 => opened orders, 2 => closed orders
	{
		var thisLang = favo360api.setLang();			
		var mkReq = favo360api.favoAjax("mode=listDeliveries&itId="+delMode+"&lang="+thisLang);
		var loadBig = favo360api.loadingBig();	
		
		$(".list-deliveries").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
			
		$.when(mkReq).done(function(data) 
		{

			$(".list-deliveries").addClass("list-fav-comp");
			
			if(data != "") 
			{ 													
				var udev = '';
				
				if(data.noRes == 1) { udev += '<div class="info-display warning-bgr">'+data.msg+'</div>'; }
				else
				{
					$.each(data, function(key, val) 
					{						
						udev += '<div id="rfc'+val.docId+'" class="section no-image"><div class="item-cell"><dl><dt><a href="#" class="view-delivery-details" rel="'+val.docId+'">'+val.docCompany+'</a></dt>';
						udev += '<dd class="img"><a href="#" class="view-delivery-details" rel="'+val.docId+'"><img src="'+val.companyLogo+'" alt=""></a></dd><dd class="info"><ul class="nav-x nav-sep size-l underline-hover clear-fix tint-bgr-5"><li># '+val.docNum+'</li><li>'+val.docSum+'</li></ul></dd></dl></div></div>'; 
					});
				}
				
				$(".list-deliveries").html(udev);
				
				$(".remove-deliver").on("click", function(){

					return false;
				}); 
				
			}
			
			if (typeof deliveriesLoaded !== 'undefined' && $.isFunction(deliveriesLoaded)) deliveriesLoaded();			
		});	
		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// List Deliveries /////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Delivery Details ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	deliveryDetails: function(ordId)
	{
		var thisLang = favo360api.setLang();			
		var mkReq = favo360api.favoAjax("mode=deliveryDetails&itId="+ordId+"&lang="+thisLang);
		var loadBig = favo360api.loadingBig();	
		var siteUrl = favo360api.baseApiUrl();
		
		$(".list-delivery-details").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
			
		$.when(mkReq).done(function(data) 
		{
			
			//// $(".list-order-details").html(udev);

			var usc = '';
			var uhd = '';
			var cHtml = '';
						
			if(data.noRes == 1) {uhd += '<div class="info-display warning-bgr">'+data.msg+'</div>'; }
			else
			{			
				
				uhd = '<h3>'+data.storeInfo.company+'</h3><p><span class="warning-bgr"><span class="cart-vol">'+data.storeVol+'</span> m<sup>3</sup></span> - '+data.storeInfo.total+'</p> <hr> <span class="order-pdf" rel="'+ordId+'" data-lang="'+thisLang+'"></span>'; 

				$.each(data.storeItems, function(key, val) 
				{
					
					usc += '<div class="section" id="itmDisp'+val.stmId+'"><div class="item-cell"><dl>';
					usc += '<dd class="img"><a href="#" class="view-item-info" rel="'+val.stmProdId+'"><img src="'+val.stmProdImg+'" alt=""></a></dd>';
					usc += '<dt>'+val.stmProdName+'</dt>';
					usc += '<dd class="info"><div class="form-elements clear-fix form-inline fR text-right">';
					usc += '<div class="price form-group cB">'+val.stmProdPrice+'</div>';
					usc += '<div class="form-group qty">'+val.stmProdQty+'</div>';
					usc += '<hr class="size-xs"><div class="price amount">'+val.stmProdAm+'</div></div></dd></dl></div></div>';
					
				});
			}

			var cHtml = '<div class="col-100 items item-list item-left company-list gutter-xs item-clear outer-space inner-space-s company-order"><div class="item-content" data-companyid="'+data.storeCompId+'" data-orderid="'+ordId+'">'+uhd+' '+usc+'</div></div>';
			
			$(".list-delivery-details").html(cHtml);
			
			//favo360api.printPDF(ordId);
			
			$(".order-pdf").html('<span class="order-pdf-print" data-order-id="'+ordId+'" data-order-num="'+data.storeNum+'" data-type="order" data-url="'+siteUrl+'/download/order/'+ordId+'/'+thisLang.toLowerCase()+'/">'+data.storeInfo.order+' <img src="'+siteUrl+'/_s/icon-pdf.png" /></span> | <span class="freight-pdf-print" data-order-id="'+ordId+'" data-order-num="'+data.storeNum+'" data-type="freight" data-url="'+siteUrl+'/download/freight/'+ordId+'/'+thisLang.toLowerCase()+'/">'+data.storeInfo.freight+' <img src="'+siteUrl+'/_s/icon-pdf.png" /></span>');
																
			if (typeof deliveryIsLoaded !== 'undefined' && $.isFunction(deliveryIsLoaded)) deliveryIsLoaded();			
		});	
		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Delivery Details ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Select Qty //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	selectQty: function()
	{
		$(".upd-qty, .upd-price").on("click", function()
		{	
			this.select();
		});
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Select Qty //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Favo360 Numbers /////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	favoNumbers: function()
	{
		var thisLang = favo360api.setLang();
		var mkReq = favo360api.favoAjax("mode=favoNumbers&lang="+thisLang);

		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 													
				var finf = '<div class="content-section figures cB clear-fix p-xxs m-b-m">'+data.msg+'</div>';
				$(".favo-in-numbers").html(finf);
				
				if(!$('.content-section.figures').hasClass('scrcount')) 
				{
					$('.count').each(function () {
					$(this).prop('Counter',0).animate({
						Counter: $(this).text()
					}, {
						duration: 2000,
						easing: 'swing',
						step: function (now) {
							$(this).text(Math.ceil(now));
						}
					});
					});
				}
				
				$(".content-section.figures").addClass('scrcount');
				
				if (typeof favoNumbersLoaded !== 'undefined' && $.isFunction(favoNumbersLoaded)) favoNumbersLoaded();
			}
		});	
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Favo360 Numbers /////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Update Qty //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	updateQty: function()
	{
		$(".upd-qty").on("input", function(){
				
		var siq = this.id.replace("qty", "");
		var sqv = $(this).val();
		var thisLang = favo360api.setLang();
		
		var qReq = favo360api.favoAjax("mode=docUpdQty&qty="+sqv+"&itId="+siq+"&lang="+thisLang);
		
		$.when(qReq).done(function(data) 
		{
			if(data != "") 
			{ 					
				$(".st-doc-sum").html(data.storeSum);		
				$("#stam"+siq).html(data.stmAm);	
				$(".cart-vol").html(data.stmVol);						
				if($('#qty-in-basket').length) $('#qty-in-basket').html(data.storeNum);
			}
		});	

	  });
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Update Qty //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Print PDFs //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	printPDF: function(ordId)
	{
		var thisLang = favo360api.setLang();
		var siteUrl = favo360api.baseApiUrl();
		
		$(".order-pdf").html('<span class="order-pdf-print" data-url="'+siteUrl+'/download/order/'+ordId+'/'+thisLang.toLowerCase()+'/"><img src="'+siteUrl+'/_s/icon-pdf.png" /></span>');
		
		//$(".order-pdf").html('<span class="order-pdf-print" data-order-id="'+ordId+'" data-order-num="'+data.storeNum+'" data-type="order" data-url="'+siteUrl+'/download/order/'+ordId+'/'+thisLang.toLowerCase()+'/">'+data.storeInfo.order+' <img src="'+siteUrl+'/_s/icon-pdf.png" /></span> | <span class="freight-pdf-print" data-order-id="'+ordId+'" data-order-num="'+data.storeNum+'" data-type="freight" data-url="'+siteUrl+'/download/freight/'+ordId+'/'+thisLang.toLowerCase()+'/">'+data.storeInfo.freight+' <img src="'+siteUrl+'/_s/icon-pdf.png" /></span>');
						
		/*
		$(".order-pdf-print").on("click", function(){
			
			var docid = $(this).parent().attr("rel");
						
			document.location.href = siteUrl+'/download/order/'+ordId+'/'+thisLang.toLowerCase()+'/';
			
			return false;
		});
		*/
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Print PDFs //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Order Details ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	orderDetails: function(ordId)
	{
		var thisLang = favo360api.setLang();			
		var mkReq = favo360api.favoAjax("mode=orderDetails&itId="+ordId+"&lang="+thisLang);
		var loadBig = favo360api.loadingBig();	
		var siteUrl = favo360api.baseApiUrl();
		
		$(".list-order-details").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
			
		$.when(mkReq).done(function(data) 
		{
			
			//// $(".list-order-details").html(udev);

				var usc = '';
				var uhd = '';
				var cHtml = '';
							
				if(data.noRes == 1) { $(".list-order-details").html('<div class="info-display warning-bgr">'+data.msg+'</div>'); }
				else
				{			
						var sure = data.storeInfo.sure;
						
						uhd = '<h3>'+data.storeInfo.company+'</h3><p><span class="warning-bgr"><span class="cart-vol">'+data.storeVol+'</span> m<sup>3</sup></span> - '+data.storeInfo.total+'</p>'; 
	
						if(typeof data.storeInfo.complete !== "undefined")  
						{
							var hideCompl = '';
							
							if(data.storeInfo.accept == 0) 
							{
								hideCompl = 'hide';
								uhd += '<div class="ord-accept"><button id="ord-accept" rel="'+ordId+'" class="btn btn-default">'+data.storeInfo.acceptTxt+'</button><hr></div>'; 
								$(".upd-price, .upd-qty").attr("disabled", true);
								$(".icon-delete").hide();
							}
													
							uhd += '<div class="'+hideCompl+'"><button id="ord-compl" class="btn btn-default">'+data.storeInfo.complete+'</button> <button id="ord-cancel" class="btn btn-danger">'+data.storeInfo.cancel+'</button> <hr> <span class="order-pdf" rel="'+ordId+'" data-lang="'+thisLang+'"></span></div>';
						}
							
						$.each(data.storeItems, function(key, val) 
						{
							/*
							usc += '<div class="section" id="itmDisp'+val.stmId+'"><div class="item-cell"><dl>';
							usc += '<dd class="img"><a href="#" class="view-item-info" rel="'+val.stmProdId+'"><img src="'+val.stmProdImg+'" alt=""></a></dd>';
							usc += '<dt>'+val.stmProdName+'</dt>';
							if(typeof data.storeInfo.complete !== "undefined") usc += '<dd class="list-options"><a href="#" class="icon icon-delete item-delete" id="itmdel'+val.stmId+'"><span class="icon-wrapper">Delete</span></a></dd>';
							usc += '<dd class="info"><div class="form-elements clear-fix form-inline fR text-right">';
							usc += '<div class="price form-group cB">'+val.stmProdPrice+'</div>';
							usc += '<div class="form-group qty">'+val.stmProdQty+'</div>';
							usc += '<hr class="size-xs"><div class="price amount">'+val.stmProdAm+'</div></div></dd></dl></div></div>';
							*/
							//////
							
							usc += '<div class="section clear-fix" id="itmDisp'+val.stmId+'"><div class="item-cell"><dl>';
							usc += '<dt>'+val.stmProdName+'</dt>';
							usc += '<dd class="img"><a href="#" class="view-item-info" rel="'+val.stmProdId+'"><img src="'+val.stmProdImg+'" alt=""></a></dd>';
							if(typeof data.storeInfo.complete !== "undefined") usc += '<dd class="list-options"><a href="#" class="icon icon-delete item-delete" id="itmdel'+val.stmId+'"><span class="icon-wrapper">Delete</span></a></dd>';
							usc += '<dd class="info"><div class="form-elements clear-fix form-inline fR text-right">';
							usc += '<div class="price cB">'+val.stmProdPrice+'</div><div class="form-group qty">'+val.stmProdQty+'</div>';
							usc += '<hr class="size-xs"><div class="volume fL">'+val.stmProdVol+' m<sup>3</sup></div> <div class="price amount fR">'+val.stmProdAm+'</div></div></dd></dl></div></div>';
							
						});
						
						var cHtml = '<div class="col-100 items item-list item-left company-list gutter-xs item-clear outer-space inner-space-s company-order"><div class="item-content" data-companyid="'+data.storeCompId+'" data-orderid="'+ordId+'">'+uhd+' '+usc+'</div></div>';
												
						$(".list-order-details").html(cHtml);
						
						if(data.storeInfo.accept == 0) 
						{
							$(".upd-price, .upd-qty").attr("disabled", true);
							$(".icon-delete").hide();
						}
						else
						{				
							favo360api.selectQty();
							favo360api.updateQty();
							favo360api.plusMinus(".upd-price, .upd-qty");
							//favo360api.plusMinus(".upd-qty");
						}
						
						//favo360api.printPDF(ordId);
						
						$(".order-pdf").html('<span class="order-pdf-print" data-order-id="'+ordId+'" data-order-num="'+data.storeNum+'" data-type="order" data-url="'+siteUrl+'/download/order/'+ordId+'/'+thisLang.toLowerCase()+'/">'+data.storeInfo.order+' <img src="'+siteUrl+'/_s/icon-pdf.png" /></span> | <span class="freight-pdf-print" data-order-id="'+ordId+'" data-order-num="'+data.storeNum+'" data-type="freight" data-url="'+siteUrl+'/download/freight/'+ordId+'/'+thisLang.toLowerCase()+'/">'+data.storeInfo.freight+' <img src="'+siteUrl+'/_s/icon-pdf.png" /></span>');
						
						/*
						
						$(".order-pdf-print").on("click", function(){
							
							var docid = $(this).parent().attr("rel");
										
							document.location.href = siteUrl+'/download/order/'+ordId+'/'+thisLang.toLowerCase()+'/';
							
							return false;
						});
						
						$(".freight-pdf-print").on("click", function(){
							
							var docid = $(this).parent().attr("rel");
										
							document.location.href = siteUrl+'/download/freight/'+ordId+'/'+thisLang.toLowerCase()+'/';
							
							return false;
						});
							
						*/				
						
						$(".upd-price").on("input", function()
						{	
							var sip = this.id.replace("pri", "");
							var spv = $(this).val();
							var thisLang = favo360api.setLang();
							
							var pReq = favo360api.favoAjax("mode=docUpdPrice&price="+spv+"&itId="+sip+"&lang="+thisLang);
							
							$.when(pReq).done(function(data) 
							{
								if(data != "") 
								{ 					
									$(".st-doc-sum").html(data.storeSum);		
									$("#stam"+sip).html(data.stmAm);									
								}
							});	
						});
						
						
						$("#ord-cancel").on("click", function()
						{					
		
							if(confirm(sure)) 
							{
								
								var dReq = favo360api.favoAjax("mode=ordDelete&itId="+ordId+"&lang="+thisLang);
								
								$.when(dReq).done(function(data) 
								{
									if(data != "") 
									{ 								
										$.each(data, function(key, val) 
										{	
											if(val.noRes == 1) {alert(val.msg); }
											else { favo360api.orderDetails(); }
										});
									}
								});
								
								if (typeof orderFinished !== 'undefined' && $.isFunction(orderFinished)) orderFinished();
							}
							
							return false;
						}); 
						
						$("#ord-compl").on("click", function(){
												
							if(confirm(sure)) 
							{
								var cReq = favo360api.favoAjax("mode=ordFinish&itId="+ordId+"&lang="+thisLang);
								
								$.when(cReq).done(function(data) 
								{
									if(data != "") 
									{ 								
										$.each(data, function(key, val) 
										{	
											if(val.noRes == 1) {alert(val.msg); }
											else 
											{ 
												//favo360api.shoppingCart(); 
												if (typeof orderFinished !== 'undefined' && $.isFunction(orderFinished)) orderFinished();
											}
										});
									}
								});
							}
							
							return false;
						}); 
						
						// ord-accept
						
						$("#ord-accept").on("click", function(){
												
							if(confirm(sure)) 
							{
								var cReq = favo360api.favoAjax("mode=ordAccept&itId="+ordId+"&lang="+thisLang);
								
								$.when(cReq).done(function(data) 
								{
									if(data != "") 
									{ 								
										$.each(data, function(key, val) 
										{	
											if(val.noRes == 1) {alert(val.msg); }
											else favo360api.orderDetails(ordId); 
										});
									}
								});
							}
							
							return false;
						}); 
						
				}
			
			if (typeof orderIsLoaded !== 'undefined' && $.isFunction(orderIsLoaded)) orderIsLoaded();	
					
		});	
		
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Order Details ///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Statistics //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	listStats: function()
	{
		// list-store-stats
		
		var thisLang = favo360api.setLang();
		var qReq = favo360api.favoAjax("mode=storeStats&lang="+thisLang);
		var loadBig = favo360api.loadingBig();	
		
		$(".list-store-stats").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
		
		$.when(qReq).done(function(data) 
		{
			if(data != "") 
			{ 					
				var allp = data.prodAll;
				var prodCat = data.prodByCat;
				var prodInventory = data.prodAllQty;

				$(".list-store-stats").html(allp+prodInventory+prodCat);
				
				if (typeof statsLoaded !== 'undefined' && $.isFunction(statsLoaded)) statsLoaded();
			}
		});	
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Statistics //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Copy Product ////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	copyProd: function(itId, prod)
	{
		var thisLang = favo360api.setLang();
		var mkReq = favo360api.favoAjax("mode=copyProductStatus&itId="+itId+"&prod="+prod+"&lang="+thisLang);
		
		$.when(mkReq).done(function(data) 
		{
			if(data != "") 
			{ 
				if(data.noRes != 1)
				{				
					var prcl = (data.prodCopy == 0 ? '<button type="submit" class="btn-copy-to btn btn-primary">'+data.prodCopyTxt+'</button>' : '<div class="success-bgr" style="padding: 5px;">'+data.prodCopyTxt+'</div> ');
					//var prco = '<button type="submit" class="btn-copy-to btn btn-'+prcl+'">'+data.prodCopyTxt+'</button>';
					$(".cy-prod").html(prcl);
					
					$(".btn-copy-to").on("click", function()
					{
						var cReq = favo360api.favoAjax("mode=copyProduct&itId="+itId+"&prod="+prod+"&lang="+thisLang);
						
						$(".btn-copy-to").attr("disabled", true).off('click');
						
						$.when(cReq).done(function(data) 
						{
							if(data != "") 
							{ 	
								if(data.noRes == 1) { alert(data.msg); }
								else
								{
									favo360api.copyProd(itId, prod);
									//$(".btn-copy-to").attr("disabled", false);
								}
							}
						});		
					});
					
				}
			}
		});
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Copy Product ////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Modal window ////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	fireModal: function()
	{


		$('[data-type="modal-trigger"]').on('click', function(){
			var actionBtn = $(this),
				scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));
			
			actionBtn.addClass('to-circle');
			actionBtn.next('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
			});
	
			//if browser doesn't support transitions...
			if(actionBtn.parents('.no-csstransitions').length > 0 ) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
			
			return false;
		});
	
		//trigger the animation - close modal window
		$('.cd-section .cd-modal-close').on('click', function(){
			closeModal();
			return false;
		});
		
		$('.cd-modal-apply').on('click', function(){
			favo360api.catFiltersApply();
			closeModal();
			return false;
		});
		
		$(document).keyup(function(event){
			if(event.which=='27') closeModal();
		});
	
		$(window).on('resize', function(){
			//on window resize - update cover layer dimention and position
			if($('.cd-section.modal-is-visible').length > 0) window.requestAnimationFrame(updateLayer);
		});
	
		function retrieveScale(btn) 
		{
			var btnRadius = btn.width()/2,
				left = btn.offset().left + btnRadius,
				top = btn.offset().top + btnRadius - $(window).scrollTop(),
				scale = scaleValue(top, left, btnRadius, $(window).height()*5, $(window).width());
	
			btn.css('position', 'fixed').velocity({
				top: top - btnRadius,
				left: left - btnRadius,
				translateX: 0,
			}, 0);
	
			return scale;
		}
	
		function scaleValue( topValue, leftValue, radiusValue, windowW, windowH) 
		{
			var maxDistHor = ( leftValue > windowW/2) ? leftValue : (windowW - leftValue),
				maxDistVert = ( topValue > windowH/2) ? topValue : (windowH - topValue);
			return Math.ceil(Math.sqrt( Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2) )/radiusValue);
		}
	
		function animateLayer(layer, scaleVal, bool) 
		{
			layer.velocity({ scale: scaleVal }, 100, function(){
				$('body').toggleClass('overflow-hidden', bool);
				(bool) 
					? layer.parents('.cd-section').addClass('modal-is-visible').end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend')
					: layer.removeClass('is-visible').removeAttr( 'style' ).siblings('[data-type="modal-trigger"]').removeClass('to-circle');
			});
		}
	
		function updateLayer() 
		{
			var layer = $('.cd-section.modal-is-visible').find('.cd-modal-bg'),
				layerRadius = layer.width()/2,
				layerTop = layer.siblings('.btn').offset().top + layerRadius - $(window).scrollTop(),
				layerLeft = layer.siblings('.btn').offset().left + layerRadius,
				scale = scaleValue(layerTop, layerLeft, layerRadius, $(window).height(), $(window).width());
			
			layer.velocity({
				top: layerTop - layerRadius,
				left: layerLeft - layerRadius,
				scale: scale,
			}, 0);
		}
	
		function closeModal() 
		{
			var section = $('.cd-section.modal-is-visible');
			section.removeClass('modal-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				animateLayer(section.find('.cd-modal-bg'), 1, false);
			});
			//if browser doesn't support transitions...
			if(section.parents('.no-csstransitions').length > 0 ) animateLayer(section.find('.cd-modal-bg'), 1, false);
		}
	},
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Modal window ////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Plus minus //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	plusMinus: function(elem)
	{
		
		//$(elem).before('<button class="btn btn-default qty-minus">-</button>');
		//$(elem).after('<button class="btn btn-default qty-plus">+</button>');
		
		$(".qty-minus, .qty-plus").remove();
		
		$(elem).each(function() 
		{
			$(this).before('<button class="btn btn-default qty-minus">-</button>');
			$(this).after('<button class="btn btn-default qty-plus">+</button>');
		});
		
        $('.qty-plus').on('click', function(e)
		{
            e.preventDefault();
          
            var cv = parseInt($(this).prev().val());
			var nv = cv + 1;				
            $(this).prev().val(nv).trigger("input");						
        });
   
		$(".qty-minus").on('click', function(e)
		{
			e.preventDefault();
		  
			var cv = parseInt($(this).next().val());
			var nv = cv - 1;
			if(nv < 0) nv = 0;	
	
			$(this).next().val(nv).trigger("input");
	
		});
			
	},
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Plus minus //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Prices //////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	listPrices: function()
	{
		// list-pices list-common-items
		
		var thisLang = favo360api.setLang();
		var qReq = favo360api.favoAjax("mode=listPrices&lang="+thisLang);
		var loadBig = favo360api.loadingBig();
		$(".list-pices").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
		
		$.when(qReq).done(function(data) 
		{
			if(data != "") 
			{ 									
				var cplan = data.prices.cplan;
				var prl = '<div class="col-100 items item-list item-left price-list gutter-xs item-clear outer-space inner-space-s"><div class="item-content">'+data.prices.plans+'</div></div>';
				$(".list-pices").html(prl);
				
				if (typeof pricesLoaded !== 'undefined' && $.isFunction(pricesLoaded)) pricesLoaded();
			}
		});	
			
	},
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Prices //////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Timeline ////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	loadTimeline: function()
	{
		
		// load-timeline
		
		var thisLang = favo360api.setLang();
		var qReq = favo360api.favoAjax("mode=loadTimeline&lang="+thisLang);
		var loadBig = favo360api.loadingBig();
		var burl = favo360api.baseApiUrl();
		$(".load-timeline").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
		
		$.when(qReq).done(function(data) 
		{
			var tl = '';
			if(data != "") 
			{ 									
				if(data.noRes == 1) tl += '<div class="info-display warning-bgr">'+data.msg+'</div>'; 
				else
				{	
					
					tl += '<div class="app-wrapper"><div class="timeline">';
					
					$.each(data.posts, function(key, val) 
					{						
						//tl += '<section class="lst-item"><div class="item-cell"><a href="#" class="view-item-info" rel="'+val.itemId+'"><img src="'+val.itemImgCrop+'" alt=""/><h1>'+val.itemName+'</h1><div class="price cB">'+val.itemPrice+'</div></a></div></section>';
						
						var nimg = parseInt(val.num);
						var img = '';
						var more = (nimg == 2 ? '' : '<span class="count"><strong>+'+(nimg-2)+'</strong></span>');
						var like = parseInt(val.numLike);
						var liked = (val.liked == 1 ? ' on' : '');
						
						if(nimg == 1) img += '<li><a href="#"><img src="'+burl+'/itemimg/'+val.imid+'-6450.jpg" alt=""/></a></li>';
						else
						{
							if(nimg == 2) img += '<li><a href="#"><img src="'+burl+'/itemimg/'+val.imid+'-6450.jpg" alt=""/></a></li><li><a href="#"><img src="'+burl+'/itemimg/'+val.imid2+'-2175.jpg" alt=""/></a></li>';
							else
							{
								img += '<li><a href="#"><img src="'+burl+'/itemimg/'+val.imid+'-6450.jpg" alt=""/></a></li><li><a href="#"><img src="'+burl+'/itemimg/'+val.imid2+'-2175.jpg" alt=""/></a></li><li><a href="#">'+more+'<img src="'+burl+'/itemimg/'+val.imid3+'-2175.jpg" alt=""/></a></li>';
							}
						}

						tl += '<section><header><div class="avatar"><a href="#"><img src="'+val.avatar+'" alt=""/></a></div><h1>'+val.name+'</h1><p class="author">'+val.title+'</p></header>';
						tl += '<ul class="gallery view-wall-post" rel="'+val.wallid+'">'+img+'</ul>';
						tl += '<footer><span style="float: left;" class="post-date">'+val.postDate+'</span> <a href="#" class="icon icon-like like-btn wp'+val.wallid+''+liked+'" rel="'+val.wallid+'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><path d="M36.1 66c0 0-0.1 0-0.1 0 -0.5-0.1-3.1-0.7-11.8-3.1 -0.9-0.2-1.7-0.5-2.4-0.7 -0.2 0.7-0.9 1.4-2.3 2 -0.2 0.1-0.4 0.1-0.6 0.1h-11c-0.2 0-0.4 0-0.6-0.1C5.8 63.5 5 62.6 5 61.4V34.3c0-0.8 0.5-1.7 1.2-2.3 0.6-0.5 1.2-0.7 1.9-0.6h10.8c0.8-0.1 1.7 0.2 2.3 0.9 0.2 0.2 0.3 0.4 0.4 0.6 2-1.6 5.2-4.1 7.6-6 1.7-1.3 2.9-2.3 3-2.4 0 0 0.1-0.1 0.1-0.1 0 0 0.6-0.5 1-1.4 0.6-1.3 6.9-14.9 7.2-15.4 0.3-0.6 0.8-1 1.4-1.3 0.2-0.1 1-0.4 2-0.4 2.1 0 5.6 1.2 5.6 5.9l0 4.4c0 3.2 0 6.8 0 9.6h10.6c4.3 0 6.9 2.5 6.9 6.6 0 2-0.8 3.9-2.2 5.2 0.7 1.1 1 2.3 1 3.6 0 2.2-1 4.2-2.7 5.5 0.5 1 0.8 2.1 0.8 3.3 0 2.2-1 4.2-2.7 5.5 0.5 1 0.8 2.1 0.8 3.3 0 3.8-3.1 7-6.9 7.1L36.1 66 36.1 66z" class="a"/><line x1="21.4" y1="31.2" x2="21.4" y2="63.2" class="a"/></svg><span class="count like'+val.wallid+'">'+like+'</span></a></footer>';
						tl += '</section>';	
					});
					
					tl += '</div></div>';
					
				}
			}
			
			$(".load-timeline").html(tl);
			
			if(!$(".wall-post-more").length) $(".load-timeline").prepend('<div class="wall-post-more" style="width: 85%; max-height: 90%; overflow: scroll;"><div class="load-post"></div></div>');
			$(".wall-post-more").hide();
			
			$(".like-btn").on("click", function(){

				var lid = $(this).attr("rel");
				var rReq = favo360api.favoAjax("mode=likePost&itId="+lid);
				
				$.when(rReq).done(function(data) 
				{
					$.each(data, function(key, val) 
					{						
						$(".like"+lid).html(data.likes);
						$(".wp"+lid).toggleClass("on");
					});		
				});		
				
				return false;
			});
			
			
			
			$(".view-wall-post").on("click", function(){

				var vwp = $(this).attr("rel");
					
				//$.fancybox.open('<div class="message"><h2>Hello!</h2><p>You are awesome!</p></div>');
				$.fancybox.open({
				src  : '.wall-post-more',
				type : 'inline',
				toolbar  : true,
				opts : {
				afterShow : function() {
						//console.info( vwp+' done!' );
						
						var pReq = favo360api.favoAjax("mode=postImages&itId="+vwp+"&lang="+thisLang);
						
						$(".load-post").html('<img src="'+loadBig+'" style="display: block; margin: 0 auto;" />');
						
						$.when(pReq).done(function(data) 
						{
							var listPost = '';
							
							$.each(data, function(key, val) 
							{						
								listPost += '<div class="wall-post-item" data-id="'+val.itmid+'"><img src="'+burl+'/img/'+val.imid+'" /><div><button class="btn btn-default">'+val.viewTxt+'</button></div></div>';
							});	
							
							$(".load-post").html(listPost);	
							
							if (typeof timePostLoaded !== 'undefined' && $.isFunction(timePostLoaded)) timePostLoaded();
						});
						
					}
				}
			});
				
					
			//console.log(vwp);
			return false;
			});
			

		});	
		
		if (typeof timelineLoaded !== 'undefined' && $.isFunction(timelineLoaded)) timelineLoaded();
	},
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// Timeline ////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// NewsFeed ////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	loadNewsFeed: function()
	{
		
		// load-newsfeed
		
		if (typeof newsfeedLoaded !== 'undefined' && $.isFunction(newsfeedLoaded)) newsfeedLoaded();
	}
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////// NewsFeed ////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
		
}



