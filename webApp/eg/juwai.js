var emailRegexp = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/i;
var phoneRegexp = /^\d+$/;
var currentSearchPropertyPage = 1;
var currentNewPropertyPage = 1;
var currentLuxePropertyPage = 1;
var currentFavouritePage = 1;
var currentAgentTeamPage = 1;
var regionsData = [];
var currentRegionIndex = 0;
var currentNewsPage = 1;
var currentAgentPropertyPage = 1;

var VisitorIP = '';
var now = new Date();
var fullYear = now.getFullYear();
var month = now.getMonth();
var day = now.getDate();
var hours = now.getHours();
var minutes = now.getMinutes();
var seconds = now.getSeconds();
var VisitTime=fullYear+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;

//when the page loaded get the the visitor's ip address and visit time
function initIpAndTime()
{
	var ip = sessionStorage.getItem('VisitorIP') ;
	if(ip){
		VisitorIP = ip;
	}else{
		$.ajax({
			type: "GET",
			url: apiPrefix+"/base/getIpAddr/",
			dataType: "jsonp",
			success:function(data){
				if(data){
					VisitorIP = data.data.cip;
					sessionStorage.setItem('VisitorIP', VisitorIP);
				}
			}
		});
	}
}

$(document).ready(function(){
	initIpAndTime();
});

function isLogin()
{
	var vars = getGlobalVars();
	if (vars.userId){
		$('#me').html('<a href="javascript:void(0);" onclick="toAccount()">我的居外</a>');
	} else {
		$('#me').html('<a href="javascript:void(0);" onclick="toLogin()">登录</a>');
	}
}
function toLogin()
{
	ga('send', 'event', 'Account', 'click', '登录', {'hitCallback':function () {
		redirect('login.html');
	}});
}
function toAccount()
{
	ga('send', 'event', 'Account', 'click', '我的居外', {'hitCallback':function () {
		redirect('myaccount.html');
	}});
}
function login()
{
	var email = $("#email").val();
	var password = $("#password").val();
	if (!email) {
		alert('请输入Email');
		return;
	}

	if (!emailRegexp.test(email)) {
		alert('请输入有效的Email地址');
		return;
	}

	var emailMD5 = hex_md5(email);
	var passwordMD5 = hex_md5(password);
	var url = apiPrefix+"/user/login/?email="+emailMD5+"&password="+passwordMD5;

	ga('send', 'event', 'Account', 'submit', '登录', {'hitCallback':function () {
		$.ajax({
			type: "GET",
			url: url,
			dataType: "jsonp",
			success:function(data){
				if(data.status != 0){
					if (data.status == '1000'){
						alert('Email或密码错误');
					}else{
						alert(data.error);
					}
				}else{
					var vars = getGlobalVars();
					vars.userId = data.data.userid;
					vars.userName = data.data.user;
					vars.userEmail = email;
					vars.userPassword = password;
					saveGlobalVars(vars);
					var referrer = document.referrer;
					if(referrer){
						redirect(referrer);
					}else{
						redirect('index.html');
					}
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(textStatus);
			}
		});
	}});
}
function logout()
{
	var vars = getGlobalVars();
	vars.userId = '';
	vars.userName = '';
	vars.userEmail = '';
	vars.userPassword = '';
	saveGlobalVars(vars);
	ga('send', 'event', 'Account', 'click', '退出登录', {'hitCallback':function () {
		redirect('index.html');
	}});
}

function toFavourites()
{
	ga('send', 'event', 'Account', 'click', '我的收藏', {'hitCallback':function () {
		redirect('mycollect.html');
	}});
}
function toHistory()
{
	ga('send', 'event', 'Account', 'click', '浏览记录', {'hitCallback':function () {
		redirect('myrecord.html');
	}});
}
function register()
{
	ga('send', 'event', 'Account', 'submit', '注册', {'nonInteraction': 1});
	var name = $("#name").val();
	var email = $("#email-f").val();
	var url = apiPrefix+"/user/register/?user="+name+"&email="+email+"&reg_from=4";
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		success:function(data){
			if(data.status != 0){
				alert(data.error);
				return;
			}else{
				alert("注册成功！");
				redirect("login.html");
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}


function clickNewPropertiesTab()
{
	ga('send', 'event', 'Tab', 'click', 'New Projects', {'nonInteraction': 1});
}

function clickLuxePropertiesTab()
{
	ga('send', 'event', 'Tab', 'click', 'Luxe', {'nonInteraction': 1});
}

function clickNewsTab()
{
	ga('send', 'event', 'Tab', 'click', 'News', {'nonInteraction': 1});
}

function redirect(url)
{
	window.location.href=url;
}

function goBack()
{
	var ref=document.referrer;
	if (ref){
		history.go(-1);
	}else{
		redirect('index.html');
	}
}

function propertyDetail(id)
{
	redirect("detailed.html?propertyid="+id);
}

function getNewProperties()
{
	$.ajax({
		type: "GET",
		url: apiPrefix+"/property/getnewsproperty/?pageno="+currentNewPropertyPage+"&pagesize=10",
		dataType: "jsonp",
		success:function(data){
			buildNewProperties(data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function getMoreNewProperties()
{
	currentNewPropertyPage += 1;
	getNewProperties();
}

function buildNewProperties(data)
{
	if(data.status != 0){
		alert(data.error);
		return;
	}
	for(var i=0; i<data.data[1].properties.length; i++){
		var html = "";
		var price = "";
		var title = "";
		var size = "";

		if(data.data[1].properties[i].price == null){
			price = "询价";
		} else {
			price = data.data[1].properties[i].price;
		}

		if(data.data[1].properties[i].property_name){
			title = data.data[1].properties[i].property_name;
		}else if(data.data[1].properties[i].title){
			title = data.data[1].properties[i].title;
		}else{
			var title_country=data.data[1].properties[i].country?data.data[1].properties[i].country:'';
			var title_region=data.data[1].properties[i].region?data.data[1].properties[i].region:'';
			if(title_country == title_region){
				title =  title_country + '的新建房产';
			}else{
				title =  title_country + title_region + '的新建房产';
			}
		}

		if(data.data[1].properties[i].size == 0){
			size = " &nbsp;";
		} else {
			size = data.data[1].properties[i].size+"平米";
		}

		html += '<li class="indexClass ui-li ui-li-static" onclick="propertyDetail(' + data.data[1].properties[i].propertyid+');">'
		+ '<div style="float:left;"><img id="image" src="'+encodeURI(decodeURI(data.data[1].properties[i].imageurl))+'"></div>'
		+ '<h3 class="tt">'+title+"</h3>"
		+ '<p>'+data.data[1].properties[i].country+'&nbsp;'+data.data[1].properties[i].region +'</p>'
		+ '<p class="ui-listview-inset">'+size+'<span>'+price+'</span></p>'
		+ '</li>';
		if(i == data.data[1].properties.length-1){
			if(data.data[1].properties.length==10){
				html += '<li id="get-more-new-properties">'
				+ '加载更多</li>';
			}
		}
		$("li").remove("#get-more-new-properties");
		$("#list-new-properties").append(html);
	}

	$("#get-more-new-properties").bind("click", function(){
		getMoreNewProperties();
	});
}

function getLuxeProperties()
{
	$.ajax({
		type: "GET",
		url: apiPrefix+"/property/getluxeproperty/?pageno="+currentLuxePropertyPage+"&pagesize=10",
		dataType: "jsonp",
		success:function(data){
			buildLuxeProperties(data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function getMoreLuxeProperties()
{
	currentLuxePropertyPage += 1;
	getLuxeProperties();
}

function buildLuxeProperties(data)
{
	if(data.status != 0){
		alert(data.error);
		return;
	}
	for(var i=0; i<data.data[1].properties.length; i++){
		var html = '';
		html += '<div class="bigDiv" onclick="propertyDetail('+data.data[1].properties[i].propertyid+')">'
		+ '<img src="'+encodeURI(decodeURI(data.data[1].properties[i].image_url))+'">'
		+ '<div class="tt">'+data.data[1].properties[i].title+'</div>'
		+ '<div class="stt">'+data.data[1].properties[i].country +'</div>'
		+ '<div class="smallDiv"></div>'
		+ '</div>';
		if(i == data.data[1].properties.length-1){
			if(data.data[1].properties.length == 10){
				html += '<div id="get-more-luxe-properties" class="more ui-li ui-li-static ui-btn-up-c ui-last-child" onclick="getMoreLuxeProperties();">加载更多</div>';
			}
		}
		$("div").remove("#get-more-luxe-properties");
		$("#list-luxe-properties").append(html);
	}
}

function getNewsList()
{
	var category=getParamByName('category');
	$.ajax({
		type: "GET",
		url: apiPrefix+"/news/getallnews/?pageno="+currentNewsPage+"&pagesize=10&category="+category,
		dataType: "jsonp",
		success:function(data){
			buildNewsList(data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function getMoreNews()
{
	currentNewsPage += 1;
	getNewsList();
}

function buildNewsList(data)
{
	if(data.status != 0){
		alert(data.error);
		return;
	}
	var newsList = [];
	if (currentNewsPage > 1) {
		newsList = getNewsListFromCache();
	}

	for(var i=0; i<data.data.news_list.length; i++){
		newsList.push(data.data.news_list[i].id);

		var html = '';
		if(i == 0 && currentNewsPage == 1){
			html += '<li class="ui-li ui-li-static ui-btn-up-c ui-li-has-thumb ui-first-child" onclick="newsDetail('+ data.data.news_list[i].id+')">';
		}else{
			html += '<li class="newsli ui-li ui-li-has-thumb ui-li-static ui-btn-up-c" onclick="newsDetail('+ data.data.news_list[i].id+')">';
		}
		html += '<img class="newsimg ui-li-thumb" src="'+encodeURI(decodeURI(data.data.news_list[i].image))+'">'
		+ '<h3 class="tt ui-li-heading">'+data.data.news_list[i].title+"</h3>"
		+ '<p class="ui-li-desc">'+data.data.news_list[i].content+"</p>"+"</li>";
		if(i == data.data.news_list.length-1){
			if(data.data.news_list.length == 10){
				html += '<li id="get-more-news" class="more ui-li ui-li-static ui-btn-up-c ui-last-child" onclick="getMoreNews()" style="text-align:center;">加载更多</li>';
			}
		}
		$("li").remove("#get-more-news");
		$("#list-news").append(html);
	}
	saveNewsListToCache(newsList);
}

function clickCountry(countryCode, countryName, obj)
{
	$(obj).attr('style','background:#484848;border-top:none;font-weight:lighter;font-size:13px; color:#FFF;border-color:#484848;');

	ga('send', 'event', 'CountrySelect', 'select', countryName, {'hitCallback':function () {
		redirect('listings.html?country='+countryCode);
	}});
}

function buildHotCountries(data)
{
	//var data=getHotCountries();
	//console.log(data);
	//if (!data) {
	//	return;
	//}

	var _space = "&nbsp;";
	var html = "";
	var size = 0;

	if(data.length%3 == 0){
		size = data.length;
	}else{
		size = (Math.floor(data.length/3)+1)*3;
	}

	for(var i=0; i<size; i++){
		if(i == 0){
			html += '<ul class="ul1 ui-grid-b">';
		}else if(i%3 == 0){
			html += '<ul class="ul2 ui-grid-b">';
		}

		if(i > data.length-1 && i%3 == 2){
			html +=  '<li class="ui-block-c">'
			+ '<a data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-theme="c"'
			+ ' data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
			+ '<span class="ui-btn-inner"><span class="ui-btn-text">'+_space+'</span></span></a></li>';
		}else if(i > data.length-1 && i%3 == 0){
			html += '<li class="ui-block-b"><a data-corners="false" data-shadow="false" data-iconshadow="true"'
			+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline'
			+ ' ui-btn-up-c"><span class="ui-btn-inner"><span class="ui-btn-text">'+_space+'</span></span></a></li>';
		}else if(i%3 == 1){
			html += '<li class="ui-block-b"><a data-corners="false" data-shadow="false" data-iconshadow="true"'
			+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
			+ '<span class="ui-btn-inner" onclick="clickCountry(\''+data[i].code+'\',\''+data[i].name+'\',this)">'
			+ '<span class="ui-btn-text">'+data[i].name+'</span></span></a></li>';
		}else if(i%3 == 2){
			html += '<li class="ui-block-c"><a data-corners="false" data-shadow="false" data-iconshadow="true"'
			+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
			+ '<span class="ui-btn-inner" onclick="clickCountry(\''+data[i].code+'\',\''+data[i].name+'\',this)">'
			+ '<span class="ui-btn-text">'+data[i].name+'</span></span></a></li>';
		}else if(i%3 == 0){
			html += '<li class="ui-block-a"><a data-corners="false" data-shadow="false" data-iconshadow="true"'
			+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
			+ '<span class="ui-btn-inner" onclick="clickCountry(\''+data[i].code+'\',\''+data[i].name+'\',this)">'
			+ '<span class="ui-btn-text">'+data[i].name+'</span></span></a></li>';
		}
		if((i+1)%3 == 0){
			html += "</ul>";
		}
	}
	$("#hot-countries").append(html);
}

function getHotCountries()
{
	 var hotCountries=localStorage.getItem("hotCountries");
	 if (hotCountries) {
		 try{
			 //var countries = JSON.parse(hotCountries);
			 //buildHotCountries(countries);
			 //return;
		 }catch(e){
			 console.error("Parsing hot countries from cache error:", e);
			 return null;
		 }
	 }

	$.ajax({
		type: "GET",
		url: apiPrefix+"/base/getHotCountry/?callback=?",
		dataType: "jsonp",
		contentType:"text/html",
		success:function(data){
			var countries = data.data;
			var hotCountries = JSON.stringify(countries);
			localStorage.setItem("hotCountries",hotCountries);
			buildHotCountries(countries);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function buildAllCountries(data)
{
	//var data = getAllCountries();
	//if (! data){
	//	return;
	//}

	var _space = "&nbsp;";

	for(var i=data.data.countries.length-1; i>=0; i--){
		var continentLength=data.data.countries[i].children.length;
		var html = "";
		var size = 0;
		if(i != 0){
			html += '<li class="listview ui-li ui-li-static ui-btn-up-c">'
			+ data.data.countries[i].name + '</li>'
			+ '<div data-role="navbar" class="list-view ui-navbar ui-mini" role="navigation">';
		}else{
			html += '<li class="listview ui-li ui-li-static ui-btn-up-c ui-last-child">'
			+ data.data.countries[i].name + '</li>'
			+ '<div data-role="navbar" class="list-view ui-navbar ui-mini" role="navigation">';
		}

		if(data.data.countries[i].children != null){
			if(continentLength % 3 == 0){
				size = continentLength;
			}else{
				size = (Math.floor(continentLength/3)+1)*3;
			}
		}

		if(size != 0){
			html += '<ul class="ul1 ui-grid-b">';
		}

		for(var j =0; j<size; j++){
			var countriesLength=data.data.countries[i].children.length;
			if(j%3==1){
				if(j>countriesLength-1){
					html += '<li class="ui-block-b">'
					+ '<a data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="span"'
					+ ' data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
					+ '<span class="ui-btn-inner">'
					+ '<span class="ui-btn-text">'
					+ _space + '</span></span></a></li>';
				}else{
					html += '<li class="ui-block-b">'
					+ '<a data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="span"'
					+ ' data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c"'
					+ ' onclick="clickCountry(\''+data.data.countries[i].children[j].code+'\',\''+data.data.countries[i].children[j].name+'\',this)">'
					+ '<span class="ui-btn-inner">'
					+ '<span class="ui-btn-text">' + data.data.countries[i].children[j].name + '</span></span></a></li>';
				}
			}else if(j%3==2){

				if(j>countriesLength-1){
					html += '<li class="ui-block-c"><a data-corners="false" data-shadow="false" data-iconshadow="true"'
					+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
					+ '<span class="ui-btn-inner"><span class="ui-btn-text">'
					+ _space + '</span></span></a></li>';

				}else{
					html += '<li class="ui-block-c"><a data-corners="false" data-shadow="false" data-iconshadow="true"'
					+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c"'
					+ ' onclick="clickCountry(\'' + data.data.countries[i].children[j].code + '\',\'' + data.data.countries[i].children[j].name + '\',this)">'
					+ '<span class="ui-btn-inner">'
					+ '<span class="ui-btn-text">' + data.data.countries[i].children[j].name
					+ '</span></span></a></li>';
				}
			}else if(j%3==0){
				if(j>countriesLength-1){
					html += '<li class="ui-block-b"><a data-corners="false" data-shadow="false" data-iconshadow="true"'
					+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
					+ '<span class="ui-btn-inner"><span class="ui-btn-text">'+_space+'</span></span></a></li>';
				}else{
					html += '<li class="ui-block-a"><a id="coun" data-corners="false" data-shadow="false" data-iconshadow="true"'
					+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c"'
					+ ' onclick="clickCountry(\'' + data.data.countries[i].children[j].code + '\',\'' + data.data.countries[i].children[j].name+ '\',this)">'
					+ '<span class="ui-btn-inner">'
					+ '<span class="ui-btn-text">' + data.data.countries[i].children[j].name
					+ '</span></span></a></li>';
				}
			}
			if((j+1)%3 == 0){
				html += '</ul><ul class="ul2 ui-grid-b">';
			}
		}
		html += '</ul></div>';
		$("#hot-countries").after(html);
	}
}

function getAllCountries()
{
	var allCountries=localStorage.getItem("allCountries");
	if (allCountries) {
		 try{
			//var countries = JSON.parse(allCountries);
			//buildAllCountries(countries);
			//return;
		}catch(e){
			console.error("Parsing all countries from cache error:", e);
			return null;
		}
	}

	$.ajax({
		type: "GET",
		url: apiPrefix+"/base/getcountries/?callback=?",
		dataType: "jsonp",
		contentType: "text/html",
		success:function(data){
			if (data.status==0){
				localStorage.setItem("allCountries",JSON.stringify(data));
				buildAllCountries(data);
			}else{
				alert(data.error);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function addRecordProperty(propertyId)
{
	var vars = getGlobalVars();
	var userId = vars.userId;
	var password = vars.userPassword;
	if (!userId){
		return;
	}
	var ts = Math.ceil(Math.random()*10);
	var token = hex_md5(userId+password+ts);
	var url = apiPrefix+"/user/addRecordProperty/?userid="+userId+"&propertyid="+propertyId+"&token="+token+"&ts="+ts;
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		success:function(data){
			//nothing to do
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			//alert(textStatus);
		}
	});
}

function getMyRecords()
{
	var vars = getGlobalVars();
	var userId = vars.userId;
	var password = vars.userPassword;
	if (!userId){
		redirect('login.html');
		return;
	}
	var ts = Math.ceil(Math.random()*10);
	var token = hex_md5(userId+password+ts);
	$.ajax({
		type: "GET",
		url: apiPrefix+"/user/getRecordProperty/?userid="+userId+"&token="+token+"&ts="+ts,
		dataType: "jsonp",
		success:function(data){
			if(data.status != 0){
				alert(data.error);
				return;
			}else{
				buildMyRecords(data);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function buildMyRecords(data)
{
	for(var i=0; i<data.data.length; i++){
		var propertyid = data.data[i].propertyid;
		var html = '';
		var country = data.data[i].country == null ? '' : data.data[i].country;
		var city = data.data[i].city == null ? '' : data.data[i].city;
		var price = data.data[i].price == null ? '询价' : data.data[i].price;
		var title = data.data[i].title == null ? '&nbsp;' : data.data[i].title;
		var size = data.data[i].size == 0 ? '&nbsp;' : data.data[i].size + "平米";
		var img = encodeURI(decodeURI(data.data[i].imageurl));

		if(i == 0){
			html += '<li class="ui-li ui-btn-up-c ui-li-has-thumb ui-first-child" onclick="propertyDetail('+propertyid+')">';
		}else if(i == data.data.length-1){
			html += '<li class="ui-li ui-btn-up-c ui-li-has-thumb ui-last-child" onclick="propertyDetail('+propertyid+')">';
		}else{
			html += '<li class="ui-li ui-btn-up-c ui-li-has-thumb" onclick="propertyDetail('+propertyid+')">';
		}
		html += '<div><img id="imagef" src=' + img + '></div><h3 class="tt ui-li-heading">'
		+ title + '</h3><p class="ui-li-desc">'
		+ country+'&nbsp;'
		+ city+'</p><p class="ui-listview-inset ui-li-desc">'
		+ size + '<span>'+price+'</span></p></li>';
		$("#list_standard").append(html);
	}
}

function addFavourite(propertyId)
{
	var vars = getGlobalVars();
	var userId = vars.userId;
	var password = vars.userPassword;
	if (!userId){
		redirect("login.html");
		return;
	}

	var ts = Math.ceil(Math.random()*10) ;
	var token = hex_md5(userId+password+ts);

	ga('send', 'event', 'Add favourite', 'click', propertyId, {'nonInteraction': 1});

	$.ajax({
		type: "GET",
		url: apiPrefix+"/user/addFavouriteProperty/?userid="+userId+"&propertyid="+propertyId+"&token="+token+"&ts="+ts,
		dataType: "jsonp",
		contentType:"text/html",
		success:function(data){
			if(data.status != 0){
				alert(data.error);
				return;
			}else{
				$("#collectimg").attr('src','css/images/btn_collected.png');
				$('#btn-add-favourite').attr('id','btn-remove-favourite');
				alert("收藏成功");
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}
//remove favourite property
function removeFavourite(propertyId){
	
	var vars = getGlobalVars();
	var userId = vars.userId;
	var password = vars.userPassword;
	if(!userId){
		redirect('login.html');
		return;
	}
	
	var ts=Math.ceil(Math.random()*10);
	var token= hex_md5(userId+password+ts);
	$.ajax({
		type: 'GET',
		url: apiPrefix+"/user/delFavouriteProperty/?userid="+userId+"&propertyid="+propertyId+"&token="+token+"&ts="+ts,
		dataType: 'jsonp',
		contentType: "text/html",
		success:function(data){
			if(data.status != 0){
				alert(data.error);
				return;
			}else{
				$("#collectimg").attr('src','css/images/btn_collect.png');
				$('#btn-remove-favourite').attr('id','btn-add-favourite');
				alert('您已取消收藏');
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
	
}
function getFavourites()
{
	var vars = getGlobalVars();
	var userId = vars.userId;
	var password = vars.userPassword;
	if (!userId){
		redirect("login.html");
		return;
	}
	var ts = Math.ceil(Math.random()*10) ;
	var token = hex_md5(userId+password+ts);
	$.ajax({
		type: "GET",
		url: apiPrefix+"/user/getFavouriteProperty/?userid="+userId+"&pageno="+currentFavouritePage+"&pagesize=10&token="+token+"&ts="+ts,
		dataType: "jsonp",
		success:function(data){
			if(data.status != 0){
				alert(data.error);
				return;
			}else{
				buildFavourites(data);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}
function getMoreFavourites()
{
	currentFavouritePage += 1;
	getFavourites();
}

function buildFavourites(data){
	for(var i=0; i<data.data.searchs.length; i++){
		var html = "";
		var country = data.data.searchs[i].country == null ? '' : data.data.searchs[i].country;
		var city = data.data.searchs[i].city == null ? '' : data.data.searchs[i].city;
		var title = data.data.searchs[i].title == null ? '&nbsp' : data.data.searchs[i].title;
		var price = data.data.searchs[i].salechangeto == null? '询价' : data.data.searchs[i].salechangeto;
		var size = data.data.searchs[i].size == 0 ? '&nbsp' : data.data.searchs[i].size+'平米';
		var img = encodeURI(decodeURI(data.data.searchs[i].imageurl));

		if(i==0  && currentFavouritePage == 1){
			html += '<li onclick="propertyDetail('
			+ data.data.searchs[i].propertyid
			+ ')" class="ui-li  ui-btn-up-c ui-li-has-thumb ui-first-child">';
		}else{
			html += '<li onclick="propertyDetail('
			+ data.data.searchs[i].propertyid
			+ ')" class="ui-li  ui-btn-up-c ui-li-has-thumb">';
		}
		html += '<div><img id="imagef" src="'+ img+'"></div><h3 class="tt ui-li-heading">'
		+ title+'</h3><p class="ui-li-desc">'
		+ country+' '+city+'</p>'
		+ '<p class="ui-listview-inset ui-li-desc">'
		+ size+'<span>'+price+'</span></p></li>';
		$("#list_standard").append(html);
	}
}


function setMoreCondition(id, obj, code)
{
	var ul = $(id).children();
	ul.each(function(index, element) {
		var li = $(element).children();
		li.each(function(index, elements) {
			$($(elements).children()[0]).removeAttr("class");
			$($(elements).children()[0]).attr("class","ui-btn ui-btn-up-c ui-btn-inline");
		});
	});
	$(obj).attr("class","ui-btn ui-btn-up-c ui-btn-inline ui-btn-active");

	if('#rooms' == id){
		params.room=code;
	}
	if("#indoors" == id){
		params.indoor=code;
	}
	if("#outdoors" == id){
		params.outdoor=code;
	}
}

function moreConditions()
{
	var params=parseSearchPropertyUrl();
	var url=buildSearchPropertyParamsForUrl(params);
	ga('send', 'event', 'Filter', 'select', '更多', {'hitCallback':function () {
		redirect('more.html?'+url);
	}});
}

function buildMoreConditions(data, target)
{
	var _space = "&nbsp;";
	var html = "";
	var size = 0;
	if(data.length>0){
		if(data.length % 3 == 0){
			size = data.length;
		}else{
			size = (Math.floor(data.length/3)+1)*3;
		}
		for(var i=0; i<size; i++){
			if(i == 0){
				html += '<ul class="ui-grid-b">';
			}else if(i%3 == 0){
				html += '<ul class="ui-grid-b">';
			}
			if(i%3 == 2){
				if(i > data.length-1){
					html += '<li class="ui-block-c"><a onclick="setMoreCondition(\''
					+ target+'\',this,\'\')" data-corners="false" data-shadow="false" data-iconshadow="true"'
					+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
					+ '<span class="ui-btn-inner"><span class="ui-btn-text">'+_space+'</span></span></a></li>';
				}else{
					html += '<li class="ui-block-c"><a onclick="setMoreCondition(\''
					+ target+'\',this,\''+data[i].code+'\')" data-corners="false" data-shadow="false" data-iconshadow="true"'
					+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
					+ '<span class="ui-btn-inner"><span class="ui-btn-text">'
					+ data[i].name+'</span></span></a></li>';
				}
			}
			if(i%3 == 1){
				if(i > data.length-1){
					html += '<li class="ui-block-c"><a onclick="setMoreCondition(\''
					+ target+'\',this,\'\')" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="span"'
					+ ' data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
					+ '<span class="ui-btn-inner"><span class="ui-btn-text">'+_space+'</span></span></a></li>';
				}else{
					html += '<li class="ui-block-b"><a onclick="setMoreCondition(\''
					+ target+'\',this,\''+data[i].code+'\')" data-corners="false" data-shadow="false" data-iconshadow="true"'
					+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
					+ '<span class="ui-btn-inner" ><span class="ui-btn-text">'
					+ data[i].name+'</span></span></a></li>';
				}
			}

			if(i%3 == 0){
				if(i > data.length-1){
					html += '<li class="ui-block-b"><a onclick="setMoreCondition(\''
					+ target+'\',this,\'\')" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="span"'
					+ ' data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
					+ '<span class="ui-btn-inner"><span class="ui-btn-text">'
					+ _space+'</span></span></a></li>';
				}else{
					html += '<li class="ui-block-a"><a onclick="setMoreCondition(\''
					+ target+'\',this,\''+data[i].code+'\')" data-corners="false" data-shadow="false" data-iconshadow="true"'
					+ ' data-wrapperels="span" data-theme="c" data-inline="true" class="ui-btn ui-btn-inline ui-btn-up-c">'
					+ '<span class="ui-btn-inner"><span class="ui-btn-text">'
					+ data[i].name+'</span></span></a></li>';
				}
			}

			if((i+1) % 3 == 0){
				html += "</ul>";
			}
		}
	}
	$(target).append(html);
}

function search(kw)
{
	ga('send', 'event', 'Search', 'submit', kw, {'hitCallback':function () {
		redirect('search.html?kw='+kw);
	}});
}

function postAgentForm(){
	var slug = $('#slug').val();
	var name = $('#name').val();
	var phone = $('#phone').val();
	var email = $('#email').val();
	var description = $('#description').val();

	if(slug == ""){
		alert("agent 信息还没有加载完，先稍等");
		return;
	}
	if(name == ""){
		alert("请输入您的姓名!");
		$("#name").focus();
		return;
	}
	if(!phoneRegexp.test(phone)){
		alert("请输入有效的电话!");
		$("#phone").focus();
		return;
	}
	if(!emailRegexp.test(email)){
		alert("请输入有效的邮箱!");
		$("#email").focus();
		return;
	}
	if(description == ""){
		alert("请输入您的留言!");
		$("#description").focus();
		return;
	}

	var data = {};
	data.slug = slug;
	data.email = email;
	data.name = name;
	data.contact_no = phone;
	data.description = description;
	data.cas11 = 'HTML5';

	ga('send', 'event', 'Agent_Enquiry_Submit', 'submit', {'nonInteraction': 1});

	$.ajax({
		type: "GET",
		url: apiPrefix+"/agent/getagentform/",
		data: data,
		dataType: "jsonp",
		success:function(data){
			if(data.status != 0){
				alert(data.error);
				return;
			}
			alert("提交成功");
			redirect("./agentprofile.html?slug="+slug);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function postFeedback()
{
	var vars = getGlobalVars();
	var userId = vars.userId;

	var orgid = '00D90000000lh7N';
	var type = 'Consumer Suggestion HTML5';
	var subject = 'Consumer Suggestion HTML5';
	var _00N90000006vyDW = '';
	var reason = $('#reason').val();
	var description = $('#description').val();
	var _00N90000006GMcP = $('#_00N90000006GMcP').val(); // 感兴趣的内容
	var email = $('#email').val();
	var name = $('#name').val();
	var foot_user_type = $('input:radio[name=foot_user_type]:checked').val();
	foot_user_type = foot_user_type==undefined?'':foot_user_type;


	if(description == ""){
		alert("请输入您遇到的问题!");
		$("#description").focus();
		return;
	}

	if(!emailRegexp.test(email)){
		alert("请输入有效的邮箱!");
		$("#email").focus();
		return;
	}

	if(name == ""){
		alert("请输入您的姓名!");
		$("#name").focus();
		return;
	}

	if(_00N90000006GMcP == ""){
		alert("请选择感兴趣的内容!");
		$("#_00N90000006GMcP").focus();
		return;
	}

	var data = {};
	data.orgid = orgid;
	data.type = type;
	data.subject = subject;
	data['00N90000006vyDW'] = _00N90000006vyDW;
	data.reason = reason;
	data.description = description;
	data['00N90000006GMcP'] = _00N90000006GMcP;
	data.email = email;
	data.name = name;
	data.foot_user_type = foot_user_type;
	if (userId){
		data.userId = userId;
	}

	$.ajax({
		type: "GET",
		url: apiPrefix+"/user/postFeedback/",
		data: data,
		dataType: "jsonp",
		success:function(data){
			if(data.status != 0){
				alert(data.error);
				return;
			}
			alert("提交成功");
			redirect("./index.html");
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function postConsult()
{
	if (! propertyId){
		alert("参数错误");
		return;
	}

	var userId = vars.userId;
	var agent_id = sessionStorage.agent_id;
	var property_cat = sessionStorage.property_cat;
	var usd_price = sessionStorage.usd_price;
	var country = sessionStorage.country;
	var region = sessionStorage.region;

	var orgid = '00D90000000lh7N';

	var type = '';
	if (property_cat == 'npd'){
		type='Consumer ND Enquiry HTML5';
	} else if (property_cat == 'luxe') {
		type='Consumer Luxe Enquiry HTML5';
	} else {
		type='Consumer Property Enquiry HTML5';
	}

	var subject = type;

	var phone = $('#phone').val();
	var description = $('#description').val();
	var reg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
	if(! reg.test(phone)){
		alert("请输入正确的电话号码");
		$("#phone").focus();
		return;
	}
	
	ga('send', 'event', 'PropertyEnquiry', 'submit', propertyId, {'nonInteraction': 1});

	var data = {};
	data.orgid = orgid;
	data.type = type;
	data.subject = subject;
	data.cas11 = 'HTML5';
	data['00N90000006vyDW'] = 'Chinese Simplified';
	data['00N90000006GMET'] = agent_id;
	data['00N90000006IK3a'] = propertyId;
	data['00N90000008Mq1X'] = country;
	data['00N90000008Mq1m'] = region;
	data['00N90000008wcHJ'] = usd_price;
	/*data.description = '';
	data.email = '';
	data.name = '';*/
	data.phone = phone;
	if(description){
		data.description = description;
	}
	
	if (userId){
		data.userId = userId;
	}

	$.ajax({
		type: "GET",
		url: apiPrefix+"/user/postConsult/",
		data: data,
		dataType: "jsonp",
		success:function(data){
			if(data.status != 0){
				alert(data.error);
				return;
			}
			alert("提交成功");
			history.go(-1);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function postEnquiry()
{
	var phone = $.trim($('#phone').val());
	if(phone == ""){
		alert("请输入您的电话");
		$("#phone").focus();
		return;
	}
	if(phone.length < 8){
		alert("请输入正确的电话号码");
		$("#phone").focus();
		return;
	}
	
	var description = $('#description').val();
	var orgid = '00D90000000lh7N';
	var subject = 'Mobile Web from WeChat';
	var cas11 = 'WeChat';

	var data = {};
	data.orgid = orgid;
	data.subject = subject;
	data.cas11 = cas11;
	data.description = description;
	data.phone = phone;
	
	ga('send', 'event', 'Wechat', 'submit-enquiry', {'nonInteraction': 1});
	
	$.ajax({
		type: "GET",
		url: apiPrefix+"/user/postEnquiry/",
		data: data,
		dataType: "jsonp",
		success:function(data){
			if(data.status != 0){
				alert(data.error);
				return;
			}
			alert("提交成功");
			redirect('index.html');
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function initGlobalVars()
{
	var vars={};
	vars.userName='';
	vars.userId='';
	vars.userEmail='';
	vars.userPassword='';
	return vars;
}

function getGlobalVars()
{
	var sVars=localStorage.getItem('globalVars');
	if (sVars) {
		return JSON.parse(sVars);
	}
	return initGlobalVars();
}

function saveGlobalVars(vars)
{
	localStorage.setItem('globalVars', JSON.stringify(vars));
}

function getParamByName(name)
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function parseSearchPropertyUrl()
{
	var country=getParamByName('country');
	if (! country){
		alert("参数无效");
		return;
	}

	var params={};

	params['country']=country;

	var region=getParamByName('region');
	if(region){
		params['region']=region;
	}

	var city=getParamByName('city');
	if(city){
		params['city']=city;
	}

	var status=getParamByName('status');
	if(status){
		params['active']=status;
	}

	var type=getParamByName('type');
	if(type){
		if(type=='4'){
			params['active']=4;
		}else{
			params['propertytype']=type;
		}
	}

	var price=getParamByName('price');
	if(price){
		params['pricerange']=price;
	}

	var room=getParamByName('room');
	if(room){
		params['room']=room;
	}

	var indoor=getParamByName('indoor');
	if(indoor){
		params['indoor']=indoor;
	}

	var outdoor=getParamByName('outdoor');
	if(outdoor){
		params['outdoor']=outdoor;
	}

	params['pageno']=currentSearchPropertyPage;

	return params;
}

function buildSearchPropertyParamsForApi(params)
{
	var url=apiPrefix+'/property/searchproperty/?';

	for(var k in params) {
		var v = params[k];
		if(k=='active' && v=='4'){
			k='propertytype';
		}
		if (v != '') {
			url += k+'='+v+'&';
		}
	}
	return url.substring(0, url.length - 1);
}

function buildSearchPropertyParamsForUrl(params)
{
	var url='';
	for(var k in params) {
		var v = params[k];
		if (v == ''){
			continue;
		}
		if (k == 'region' && v == '0'){
			continue;
		}
		if (k == 'city' && v == '0'){
			continue;
		}
		if (k == 'pageno' && v == 1){
			continue;
		}
		if (k == 'active'){
			k = 'status';
		}
		if (k == 'propertytype'){
			k = 'type';
		}
		if (k == 'pricerange'){
			k = 'price';
		}
		if (k == 'pageno'){
			k = 'page';
		}
		url += k+'='+v+'&';
	}
	return url.substring(0, url.length - 1);
}

function getSearchProperties()
{
	var params = parseSearchPropertyUrl();
	var url = buildSearchPropertyParamsForApi(params);
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		contentType:"text/html",
		success:function(data){
			if (data.status != 0){
				alert(data.error);
				return;
			}
			if (!data.data){
				alert('未找到相关的房源');
				goBack();
				return;
			}
			if (data.data.properties.length==0){
				alert('未找到相关的房源');
				goBack();
				return;
			}
			buildSearchProperties(data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}
function getMoreSearchProperties()
{
	currentSearchPropertyPage += 1;
	getSearchProperties();
}

function buildSearchProperties(data)
{
	if(data.status != 0){
		alert(data.error);
		return false;
	}
	if(data.data == null){
		alert('未找到相关的房源');
		goBack();
		return false;
	}

	var params=parseSearchPropertyUrl();
	var html = '';
	var price = '';
	var city = '';
	var size = '';
	var title = '';
	var country = '';
	var region = '';
	for(var i=0; i<data.data.properties.length; i++){
		if (i==0){
			country = data.data.properties[i].country;
			$("#country-title").html(country + "房产");
			document.title = country + "房产_居外网海外房产";
		}
		price=data.data.properties[i].salechangeto == null?"询价":data.data.properties[i].salechangeto;

		city=data.data.properties[i].city == null?"&nbsp;":data.data.properties[i].city;

		size=data.data.properties[i].size == "0"?"&nbsp;":data.data.properties[i].size+"平米";

		title=data.data.properties[i].title == null?"&nbsp;":data.data.properties[i].title;

		region=data.data.properties[i].region == null?"&nbsp;":data.data.properties[i].region;

		if(i == 0 && params.pageno == 1){
			html += '<li class="ui-li ui-btn-up-d ui-li-has-thumb ui-first-child"'
			+' onclick="propertyDetail(' + data.data.properties[i].propertyid + ')">';
		} else{
			html += '<li class="ui-li ui-btn-up-d ui-li-has-thumb"'
			+' onclick="propertyDetail(' + data.data.properties[i].propertyid + ')">';
		}
		html += '<div><img id="imagef" src="'+encodeURI(decodeURI(data.data.properties[i].thumb))+'"></div>'
		+ '<h3 class="tt ui-li-heading">'+title+'</h3>'
		+ '<p class="ui-li-desc">'+region+" "+city+"</p>"
		+ '<p class="ui-listview-inset ui-li-desc">'+size
		+ '<span>'+price+'</span></p></li>';
		if(i == data.data.properties.length-1){
			if(data.data.properties.length == 10){
				html += '<li id="get-more-properties" onclick="getMoreSearchProperties()"'
				+ ' class="more ui-li ui-li-static ui-btn-up-d ui-last-child" style="text-align:center; height:25px;">'
				+ '加载更多</li>';
			}
		}
		$("li").remove("#get-more-properties");
	}

	if(params.pageno == 1){
		$("#list_standard").html(html);
	} else {
		$("#list_standard").append(html);
	}
}

function keyWordSearch(kw)
{
	var vars = getGlobalVars();
	var userId = vars.userId;
	var url=apiPrefix+'/base/keyWordSearch/?kw='+kw;
	if (userId) {
		url += '&userid='+userId;
	}
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		contentType:"text/html",
		success:function(data){
			if(data.data.country!=""){
				buildSearchResult(data.data.country,"country");
			}
			if(data.data.region!=""){
				buildSearchResult(data.data.region,"region");
			}
			if(data.data.city!=""){
				buildSearchResult(data.data.city,"city");
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function clickSearch(countryCode, regionId, cityId, text)
{
	regionId = regionId==0?'':regionId;
	cityId = cityId==0?'':cityId;

	var params={};
	params.country=countryCode;
	params.region=regionId;
	params.city=cityId;

	var url=buildSearchPropertyParamsForUrl(params);

	ga('send', 'event', 'Search', 'select', text, {'hitCallback':function () {
		redirect('listings.html?'+url);
	}});
}

function buildSearchResult(data,type)
{
	var html = '';
	for(var i=0;i<data.length;i++){
		var countryId=0;
		var regionId=0;
		var cityId=0;
		var text=data[i].text;
		//var countryName='';
		if(type == "country"){
			countryId=data[i].code;
			//countryName=data[i].name;
		} else if(type == "region"){
			countryId=data[i].country.code;
			regionId=data[i].id;
			//countryName=data[i].country.name;
		} else if(type == "city"){
			countryId=data[i].country.code;
			cityId=data[i].id;
			//countryName=data[i].country.name;
		} else {
			// nothing
		}
		html += '<ul class="ul1 ui-grid-solo" style="text-align:left">'
		+ '<li class="ui-block-a" style="text-align:left"'
		+ ' onclick="clickSearch(\''+countryId+'\','+regionId+','+cityId+',\''+text+'\');">'
		+ '<a href="#" data-corners="false" data-shadow="false"'
		+ ' data-iconshadow="true" data-wrapperels="span" data-theme="c" data-inline="true"'
		+ ' class="ui-btn ui-btn-up-c ui-btn-inline">'
		+ '<span class="ui-btn-inner" style="text-align:left"><span class="ui-btn-text" style="text-align:left">'
		+ text + '</span></span></a></li></ul>';
	}
	$('#list-'+type).append(html);
	$('#sec-'+type).attr('style','display:block;');
}

function setCondition(code)
{
	var params = parseSearchPropertyUrl();
	var countryId = params.country;
	var k = 'condition-' + countryId + '-' + code;
	var data = JSON.parse(sessionStorage.getItem(k));
	if (! data){
		console.log('No condition data');
		return;
	}

	var htmlPrice = buildFilter(data.data.pricerange, 'price');
	var htmActive = buildFilter(data.data.active, 'active');
	var htmType = buildFilter(data.data.propertytype, 'type');
//    var htmCategory=buildFilter(data.)

	$('#price').html(htmlPrice);
	$('#active').html(htmActive);
	$('#propertytype').html(htmType);
}

function setConditionsLabel(data)
{
	var params = parseSearchPropertyUrl();
	if (params.city){
		var name='';
		for(var i=0;i<data.range.length;i++){
			if(data.range[i].table == 'city'){
				if(params.city==data.range[i].code){
					name = data.range[i].name;
					break;
				}
			}else{
				for(var j=0;j<data.range[i].children.length;j++){
					if(params.city==data.range[i].children[j].code){
						name = data.range[i].children[j].name;
						break;
					}
				}
			}
		}
		if(name){
			$("#label-region").text(formatLength(name,'region'));
		}
	}else{
		if(params.region){
			for(var i=0;i<data.range.length;i++){
				if(params.region==data.range[i].code){
					var name = formatLength(data.range[i].name, 'region');
					$("#label-region").text(name);
					break;
				}
			}
		}
	}

	if(params.active){
		for(var i=0;i<data.active.length;i++){
			if(params.active == data.active[i].code){
				var name=data.active[i].name;
				$("#label-active").text(name);
				break;
			}
		}
	}

	if(params.propertytype){
		for(var i=0;i<data.propertytype.length;i++){
			if(params.propertytype == data.propertytype[i].code){
				var name=data.propertytype[i].name;
				$("#label-type").text(name);
				break;
			}
		}
	}

	if(params.pricerange){
		for(var i=0;i<data.pricerange.length;i++){
			if(params.pricerange == data.pricerange[i].code){
				var name = formatLength(data.pricerange[i].name, 'price');
				$("#label-price").text(name);
				break;
			}
		}
	}
}

function buildConditions()
{
	//var activeCodes={0:'1,3', 1:'2'}; // 1,3->购买, 2->拍卖
	var params = parseSearchPropertyUrl();
	var countryId = params.country;
	var active = params.active?params.active:'1,3';
	var k = 'condition-' + countryId + '-' + active;
	var data = JSON.parse(sessionStorage.getItem(k));
	if (data){
		//console.log('Using cache for building condition:'+k);
		sliceRegionData(data.data);
		setRegion(0);
		setCondition(active);
		setConditionsLabel(data.data);
		return;
	}

	active=active=='4'?'1,3':active;

	var baseUrl=apiPrefix+'/base/getcountry/?country=';
	$.ajax({
		type: "GET",
		url : baseUrl + countryId + '&active=' + active,
		dataType : "jsonp",
		success : function(data) {
			if (data.status == 0) {
				// Move propertytype of 4 from propertytype to active
				// 把拍卖从类型移到状态
				var _active = {};
				for(var i=0; i<data.data.propertytype.length; i++){
					if (data.data.propertytype[i].code=='4'){
						_active = data.data.propertytype.splice(i, 1)[0];
						break;
					}
				}
				data.data.active.push(_active);

				var k = 'condition-' + countryId + '-' + active;

				sessionStorage.setItem(k, JSON.stringify(data));
				//console.log('Set key:'+k);

				// Set regions data
				sliceRegionData(data.data);

				// Build region
				setRegion(0);

				// Build active,propertytype,price
				setCondition(active);

				// Set labels
				setConditionsLabel(data.data);

				// Get data for 租赁
				active=active=='1,3'?'2':'1,3';
				$.ajax({
					type: "GET",
					url : baseUrl + countryId+'&active='+active,
					dataType : "jsonp",
					success : function(_data){
						if (_data.status == 0){
							// Move propertytype of 4 from propertytype to active
							// 把拍卖从类型移到状态
							_active = {};
							for(var i=0; i<_data.data.propertytype.length; i++){
								if (_data.data.propertytype[i].code=='4'){
									_active = _data.data.propertytype.splice(i, 1)[0];
									break;
								}
							}
							_data.data.active.push(_active);

							k='condition-' + countryId + '-' + active;
							sessionStorage.setItem(k, JSON.stringify(_data));
							//console.log('Set key:'+k);

							// Build for 拍卖
							active='4';
							_data.data.propertytype = [];
							_data.data.pricerange = [];
							k='condition-' + countryId + '-' + active;
							sessionStorage.setItem(k, JSON.stringify(_data));
							//console.log('Set key:'+k);
						}else{
							//console.log('Error to get condition data of:' + active);
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						alert(textStatus);
					}
				});
			}else{
				//console.log('Error to get condition data of:' + active);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert(textStatus);
		}
	});
}

function buildFilter(data, section)
{
	if (data == null) {
		return '';
	}
	var html = "";
	for (var i = 0; i < data.length; i++) {
		html+= '<li onclick="clickCondition(\'' + data[i].name + '\',\'' + data[i].code + '\',\'' + section + '\')"'
		+' class="ui-li ui-li-static ui-btn-up-c ui-first-child ui-last-child">'
		+'<font size="-2">' + data[i].name + '</font></li>';
	}
	return html;
}

function clickCondition(name, code, section)
{
	ga('send', 'event', 'Filter', 'select', name, {'nonInteraction': 1});

	var params = parseSearchPropertyUrl();
	name = formatLength(name, section);

	switch (section) {
		case 'price':
			params.pricerange = code;
			break;
		case 'active':
			if (code == '2') {
				// click on '租赁'
				params.active = code;
				params.propertytype = '';
			} else if (code == '4'){
				// click on '拍卖'
				params.active = '';
				params.propertytype = code;
			} else {
				// click on '购买'
				params.active = code;
				params.propertytype = '';
			}
			break;
		case 'type':
			params.propertytype = code;
			break;
	}

	var url = buildSearchPropertyParamsForUrl(params);
	redirect('listings.html?'+url);
}

function formatLength(str, section)
{
	if (str.length > 2) {
		if (section == 'price') {
			str = str.substr(0, 4) + "...";
		} else {
			str = str.substr(0, 3) + "...";
		}
	}
	return str;
}

function buildRegion(data)
{
	var htmls=[];
	var count = data.length;
	for ( var i = 0; i < count; i++) {
		var html = '';
		var hasChildren = 0;
		if (data[i].children && data[i].children.length > 0) {
			hasChildren = 1;
		}

		html += '<div data-role="collapsible" data-theme="a">';
		if (hasChildren == 0) {
			html += '<h3 onclick="selectRegion(\'' + data[i].table + '\',\'' + data[i].code + '\',\'' + data[i].name + '\')">' + data[i].name + '</h3>';
			html += "</div>";
			htmls.push(html);
			continue;
		}

		html += '<h3>' + data[i].name + '</h3>';
		var size = 0;
		if (data[i].children.length % 3 == 0) {
			size = data[i].children.length;
		} else {
			size = (Math.floor(data[i].children.length / 3) + 1) * 3;
		}
		var innerHtml = '';
		var _space = '&nbsp;';
		innerHtml += '<div data-role="navbar" class="listview">';
		for ( var j = 0; j < size; j++) {
			if (j % 3 == 0) {
				innerHtml += '<ul>';
			}
			if (j > data[i].children.length - 1) {
				innerHtml += '<li><a href="#" data-theme="a">' + _space + "</a></li>";
			} else {
				var name = data[i].children[j].name;
				name = name==''?'&nbsp;':name;
				innerHtml += '<li><a onclick="selectSubRegion(\'' + data[i].code + '\',\''
				+ data[i].children[j].code + '\',\''
				+ name + '\')" href="#" data-theme="a">'
				+ name + '</a></li>';
			}
			if ((j + 1) % 3 == 0) {
				innerHtml += '</ul>';
			}
		}
		html += innerHtml;
		html += "</div></div>";
		htmls.push(html);
	}
	return htmls.join('');
}

function sliceRegionData(data)
{
	var regions = data.range;
	var length = regions.length;
	var size = 5;
	var pages = Math.ceil(length / size);
	for(var i=0; i<pages; i++){
		var start = size*i;
		var end = start + size;
		end = end > length ? length : end;
		var _data = regions.slice(start, end);
		regionsData.push(_data);
	}
}
function setRegion(idx)
{
	var length = regionsData.length;
	if (length == 0) {
		return;
	}
	if (idx >= length) {
		$('#select-more-regions').remove();
		return;
	}
	var data = regionsData[idx];
	var html = buildRegion(data);
	$("#region").append(html);
	if (idx <= length - 1) {
		if(idx > 0) {
			$('#select-more-regions').remove();
		}
		if (idx < length - 1){
			var more = '<div id="select-more-regions" data-role="collapsible" data-theme="a"><h3 onclick="moreRegions()">更多地区</h3></div>';
			$("#region").append(more);
		}
	}
	$("#region").trigger("create");
}
function moreRegions()
{
	currentRegionIndex += 1;
	setRegion(currentRegionIndex);
}
function selectRegion(table, code, name)
{
	ga('send', 'event', 'Filter', 'select', name, {'nonInteraction': 1});

	var params = parseSearchPropertyUrl();

	if (table == 'region') {
		params.region = code;
		if(code==''){
			params.city = '';
		}
	} else if (table == 'city') {
		params.city = code;
	}
	params.active='';
	params.propertytype='';
	params.pricerange='';
	params.room='';
	params.indoor='';
	params.outdoor='';
	params.pageno=1;
	var url = buildSearchPropertyParamsForUrl(params);
	redirect('listings.html?'+url);
}
function selectSubRegion(regionCode, cityCode, cityName)
{
	ga('send', 'event', 'Filter', 'select', cityName, {'nonInteraction': 1});

	var params=parseSearchPropertyUrl();
	params.region=regionCode;
	params.city=cityCode;
	params.active='';
	params.propertytype='';
	params.pricerange='';
	params.room='';
	params.indoor='';
	params.outdoor='';
	params.pageno=1;
	var url=buildSearchPropertyParamsForUrl(params);
	redirect('listings.html?'+url);
}

function getProperty(id)
{
	var vars = getGlobalVars();
	var userId = vars.userId;
	var url = apiPrefix+"/property/getproperty/?propertyid="+id;
	if (userId){
		url += "&userid="+userId;
	}
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		success:function(data){
			if (data.status != 0){
				alert(data.error);
				return;
			}

			addRecordProperty(id);

			sessionStorage.agent_id = data.data.agent_id;
			sessionStorage.property_cat = data.data.property_cat;
			sessionStorage.usd_price = data.data.usd_price;
			sessionStorage.country = data.data.country;
			sessionStorage.region = data.data.region;

			var title = data.data.country + data.data.region + '的新建房源';
			if (data.data.sub_title){
				title = data.data.sub_title+"房产,居外海外房产网";
			}
			document.title = title;

			if(data.data.isfavorite == 1){
				$("#collectimg").attr('src','css/images/btn_collected.png');
				$('#btn-add-favourite').attr('id','btn-remove-favourite');
			}

			share_title = '为您推荐居外网的房源：' + data.data.sub_title;
			share_summary = data.data.ch_description;
			share_pic = data.data.thumbimages[0];

			sessionStorage.thumbimages = data.data.thumbimages;
			var images_count=data.data.thumbimages.length;
			if (images_count==1){
				// no auto scroll
				$('#btn_prev').remove();
				$('#btn_next').remove();
			}
			var j = 0;
			for(var i=0; i<20; i++){
				if(i < images_count){
					$("#i"+i).attr('src',data.data.thumbimages[i]);
				}else{
					if(j>images_count-1){
						j = 0;
					}
					$("#i"+i).attr('src',data.data.thumbimages[j]);
					j++;
				}
			}

			//图片高度自适应
			var a = $("#images");
			var width = a.outerWidth();
			var dynamic_height = width * 0.75;
			if(width > 320){
				$(".main_image").attr('style','height: '+dynamic_height+'px;');
				$(".main_image ul").attr('style','height: '+dynamic_height+'px;');
				$(".main_image img").attr('style','height: '+dynamic_height+'px;');
			}

			$("#title").html(data.data.title);
			$("#salechangeto").html(data.data.salechangeto);
			$("#propertynumber").html(data.data.propertynumber);
			$("#indoor").html(data.data.indoor);
			$("#outdoor").html(data.data.outdoor);
			if(data.data.bed == null||data.data.bath == null) {
				$("#fx").html("&nbsp;");
			}else{
				$("#bed").html(data.data.bed+"卧");
				$("#bath").html(data.data.bath+"卫");
			}
			if(data.data.age == "0" || data.data.age == "") {
				$("#fl").html("&nbsp;");
			} else {
				$("#age").html(data.data.age+"年");
			}

			if (data.data.display_address=='0' || data.data.display_address==''){
				var addr_text='<a href="#" data-ajax="false" onclick="ga(\'send\', \'event\', \'PropertyEnquiry\', \'click\', sessionStorage.propertyId, {\'hitCallback\':function () {document.location = \'consult.html\';}});return false;">咨询详细地址</a>';
				$("#address").html(addr_text);
			}else{
				var country=data.data.country==null?"":data.data.country_en;
				var region=data.data.region==null?"":data.data.region_en;
				var city=data.data.city==null?"":data.data.city_en;
				//var area=data.data.area==null?"":data.data.area_en;
				var address=data.data.address==null?"":data.data.address;
				var addr="";
				if(address){
					addr += address;
				}
				//if(area){
				//	addr += ","+area;
				//}
				if(city){
					addr += ","+city;
				}
				if(region){
					addr += ","+region;
				}
				if(country){
					addr += ","+country;
				}
				$("#address").html(addr);
			}

			sessionStorage.facilities = JSON.stringify(data.data.facilities);

			if(data.data.facilities == null ||data.data.facilities == "null"){
				$("#facilities").attr('style','display:none;');
			}

			if(data.data.ch_description == ''){
				if(data.data.en_description == ''){
					$("#description").attr('style','display:none;');
				}else{
					desc_collapse = data.data.en_description+'<div class="view-all">展开全文</div>';
					desc_expand = data.data.en_description+"<br><br>"+data.data.ma_description;
					$("#description-text").html(desc_collapse);
				}
			}else{
				if(data.data.en_description == ''){
					desc_collapse = data.data.ch_description+'<div class="view-all">展开全文</div>';
					desc_expand = data.data.ch_description;
					$("#description-text").html(desc_collapse);
				}else{
					desc_collapse = data.data.ch_description+'<div class="view-all">展开全文</div>';
					desc_expand = data.data.ch_description+"<br><br>"+data.data.en_description;
					$("#description-text").html(desc_collapse);
				}
			}

			if(data.data.companylogo == null){
				$("#company").attr('style','display:none;');
			}else{
				$("#companylogo").attr('src',data.data.companylogo);
				$("#companyname").html(data.data.companyname);
				$("#companyphone").html(data.data.companyphone);
				$("#companyphone").attr('style','color:#f00');
				if (data.data.agent_slug){
					$("#company").bind("click",function(){redirect("agentprofile.html?slug="+data.data.agent_slug);});
				}
			}

			if(data.data.floor_images == ''){
				$("#floor_images").attr('style','display:none;');
				$("#floor").attr('style','display:none;');
			} else {
				var floorHtml = "";
				sessionStorage.floor_images = data.data.floor_images;
				for(var i=0; i<data.data.floor_images.length; i++){
					floorHtml += '<img style="width:80px; height:80px; padding:15px 0 0 15px; text-align:center;" src="'+data.data.floor_images[i]+'" onclick="toBigFloorImage('+i+')" alt="">';
				}
				$("#floor_images").html(floorHtml);
			}

			if (data.data.coordinates.lat && data.data.coordinates.long){
				loadBMap(data.data.coordinates.lat,data.data.coordinates.long);
			}

			//$("#company-tel").attr('href','tel:400-041-7515');
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function buildGallery()
{
	var li='';
	for (var i=0;i<20;i++){
		li += '<li><img id="i'+i+'"></li>';
	}
	return li;
}

function moreFloor()
{
	var expanded = $('#more-floor').data('expanded');
	if(expanded == 0){
		$("#floor").removeAttr("style");
		$('#more-floor').data('expanded', 1);
	}else{
		$("#floor").attr("style","height:130px;");
		$('#more-floor').data('expanded', 0);
	}
}

function toBigFloorImage(num)
{
	sessionStorage.tb = "floor";
	sessionStorage.bigimage = num;
	redirect("bigimage.html");
}

function toFacilities(){
	var propertyId = sessionStorage.propertyId;
	ga('send', 'event', 'Facilities view', 'click', propertyId, {'hitCallback':function () {
		redirect('facilities.html');
	}});
}

function buildFacilities(data)
{
	$("#in").html(data[0].category);
	$("#out").html(data[1].category);
	$("#round").html(data[2].category);
	for(var i=0;i<3;i++){
		if (!data[i].items){
			continue;
		}
		var html = '';
		for(var j=0;j<data[i].items.length;j++){
			html += '<li class="ui-li ui-li-static ui-btn-up-c">';
			html += '<span>'+data[i].items[j].title+'</span><br><br>';
			html += '<p class="ui-li-desc">'+data[i].items[j].value+'</p>';
			html += '</li>';
		}
		switch(i){
			case 0:
				$("#inlist").html(html);
				break;
			case 1:
				$("#outlist").html(html);
				break;
			case 2:
				$("#roundlist").html(html);
				break;
		}
	}
}

function toggleDescription()
{
	var expanded = $('#description').data('expanded');
	if(expanded == 0){
		ga('send', 'event', 'Desc view', 'click', sessionStorage.propertyId, {'nonInteraction': 1});
		$("#description").removeAttr("style");
		$("#description-text").html(desc_expand);
		$('#description').data('expanded', 1);
	}else{
		$("#description").attr("style","height:127px;");
		$("#description-text").html(desc_collapse);
		$('#description').data('expanded', 0);
	}
}

function loadGMap(lat,lng)
{
	var s = document.body.offsetWidth;
	if(s>610){
		s=610;
	} else if(s<290) {
		s=290;
	} else {
		s = s-30;
	}
	var htmlString = "<img src='http://maps.googleapis.com/maps/api/staticmap?";
	htmlString += "center=" + lat + "," + lng + "&";
	htmlString += "zoom=15&size="+s+"x"+290+"&maptype=roadmap&markers=color:red%7Clabel:S%7C" + lat + "," + lng + "&sensor=false'>";
	$("#map_canvas").html(htmlString);
}
function loadBMap(lat,lng)
{
	var width = document.body.offsetWidth;
	if(width > 610){
		width = 610;
	} else if(width < 290) {
		width = 290;
	} else {
		width -= 30;
	}
	var height = 290;
	var zoomLevel = 13;
	var key = 'AsPt1yS6hAZzkKyCZIFQ76ty40FEh6V24we37VYcby29HnV2XmSVM7R1pHFaYaZC';
	var url = 'http://dev.virtualearth.net/REST/v1/Imagery/Map/Road/';
	url += lat+','+lng+'/'+zoomLevel+'/?';
	url += 'ms='+width+','+height+'&pp='+lat+','+lng +';65;&key='+key;
	var img='<img src="'+url+'" alt="Map">';
	$("#map_canvas").html(img);
}

function openShareBox()
{
	var text = '<div class="ui-grid-c">';
	text += '<div class="ui-block-a" onclick="shareProperty('+1+');">';
	text += '<img width="32" height="32" src="css/images/sina.png">';
	text += '<h1>新浪微博</h1>';
	text += '</div>';
	text += '<div class="ui-block-b" onclick="shareProperty('+2+');">';
	text += '<img width="31" height="31" src="css/images/qq.png">';
	text += '<h1>QQ空间</h1>';
	text += '</div>';
	text += '<div class="ui-block-c" onclick="shareProperty('+3+');">';
	text += '<img width="32" height="32" src="css/images/renren.png">';
	text += '<h1>人人网</h1>';
	text += '</div>';
	text += '<div class="ui-block-c" onclick="shareProperty('+5+');">';
	text += '<img width="31" height="31" src="css/images/email.jpg">';
	text += '<h1>邮件分享</h1>';
	text += '</div>';
	text += '</div>';
	tipsWindown('分享到','text:'+text,'290','77','true','','true','text');
}

function shareProperty(num){
	var params = {
		url:share_url,
		appkey:'',
		title:share_title,
		pic:share_pic,
		ralateUid:'',
		rnd:new Date().valueOf()
	};
	var propertyId = sessionStorage.propertyId;
	var temp = [];
	for( var p in params ){
		temp.push(p + '=' + encodeURIComponent( params[p] || '' ) );
	}
	switch (num){
		case 1:
			ga('send', 'event', 'Share-weibo', 'select', propertyId, {'nonInteraction': 1});
			window.open('http://v.t.sina.com.cn/share/share.php?' + temp.join('&'));
			break;
		case 2:
			ga('send', 'event', 'Share-qzone', 'select', propertyId, {'nonInteraction': 1});
			var url = encodeURIComponent(share_url);
			window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+url+"&title="+share_title+"&pics="+share_pic+"&site="+share_from+"&desc=&summary="+share_summary,"newwindow");
			break;
		case 3:
			ga('send', 'event', 'Share-renren', 'select', propertyId, {'nonInteraction': 1});
			window.open('http://widget.renren.com/dialog/share?resourceUrl='+share_url+'&title='+share_title+'&images='+share_pic+'&description='+share_summary,'newwindow');
			break;
		case 4:
			window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&url='+share_url+'&pics='+share_pic+'&title='+share_title+'&site='+share_from+'','newwindow');
			break;
		case 5:
			ga('send', 'event', 'Share-email', 'select', propertyId, {'nonInteraction': 1});
			window.open('http://s.share.baidu.com/sendmail?click=1&url='+share_url+'&uid=0&to=mail&type=text&pic='+share_pic+'&title='+share_title+'&key=&desc=&comment=&relateUid=&searchPic=0&sign=on&l=&linkid=&firstime=1394605619419','newwindow');
			break;
	}
}

function getNewsListFromCache()
{
	var data = JSON.parse( sessionStorage.getItem('news-list') );
	if(! data) {
		return [];
	}
	return data;
}
function saveNewsListToCache(data)
{
	sessionStorage.setItem('news-list', JSON.stringify(data));
}

function newsDetail(id)
{
	redirect("newsdetail.html?newsid="+id);
}

function getNews(id)
{
	$.ajax({
		type: "GET",
		url: apiPrefix+"/news/getnews/?dataid="+id,
		dataType: "jsonp",
		success:function(data){
			if (data.status != 0){
				alert(data.error);
				return;
			}
			newsTitle = data.data.post_title;
			document.title = newsTitle+"_居外海外房产网";
			$("#title").html(newsTitle);
			$("#news-meta").html("来源："+data.data.source_from+"&nbsp;&nbsp;&nbsp;&nbsp;"+data.data.post_date);
			$("#news-content").html(data.data.post_content);
			$(".news-navi").attr('style',' text-align: center; margin: 30px 0;');
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function setNewsPager(newsId)
{
	var newsList = getNewsListFromCache();
	for(var i=0; i<newsList.length; i++){
		if(newsId == newsList[i]){
			if (i < newsList.length - 1) {
				var nextId = newsList[i+1];
				$("#next").attr('style','');
				$('#next').click(function(){
					newsDetail(nextId);
				});
			}
			if (i > 0) {
				var prevId = newsList[i-1];
				$("#prev").attr('style','');
				$('#prev').click(function(){
					newsDetail(prevId);
				});
			}
			break;
		}
	}
}

function openNewsShareBox()
{
	var text = '<div class="ui-grid-c">';
	text += '<div class="ui-block-a" onclick="shareNews('+1+');">';
	text += '<img width="32" height="32" src="css/images/sina.png">';
	text += '<h1>新浪微博</h1>';
	text += '</div>';
	text += '<div class="ui-block-b" onclick="shareNews('+2+');">';
	text += '<img width="31" height="31" src="css/images/qq.png">';
	text += '<h1>QQ空间</h1>';
	text += '</div>';
	text += '<div class="ui-block-c" onclick="shareNews('+3+');">';
	text += '<img width="32" height="32" src="css/images/renren.png">';
	text += '<h1>人人网</h1>';
	text += '</div>';
	text += '<div class="ui-block-c" onclick="shareNews('+5+');">';
	text += '<img width="31" height="31" src="css/images/email.jpg">';
	text += '<h1>邮件分享</h1>';
	text += '</div>';
	text += '</div>';
	tipsWindown('分享到','text:'+text,'290','77','true','','true','text');
}

function shareNews(num)
{
	var news_title = newsTitle;
	var share_url = newsUrl;
	var share_from = '居外－国际房产搜索引擎－全球房源从这里开始';
	var share_title = '居外网环球房讯';
	var share_pic = newsImage;
	var params = {
		url:share_url,
		appkey:'',
		title:news_title,
		pic:share_pic,
		ralateUid:'',
		rnd:new Date().valueOf()
	  };
	  var temp = [];
	  for( var p in params ){
		temp.push(p + '=' + encodeURIComponent( params[p] || '' ) );
	  }
	switch (num){
		case 1:
			ga('send', 'event', 'News share', 'select', 'weibo', {'nonInteraction': 1});
			window.open('http://v.t.sina.com.cn/share/share.php?' + temp.join('&'));
			break;
		case 2:
			ga('send', 'event', 'News share', 'select', 'qzone', {'nonInteraction': 1});
			var url = encodeURIComponent(share_url);
			window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+url+"&title="+share_title+"："+news_title+"&desc=&summary="+news_title+"&site=&pics="+share_pic,"newwindow");
			break;
		case 3:
			ga('send', 'event', 'News share', 'select', 'renren', {'nonInteraction': 1});
			window.open('http://widget.renren.com/dialog/share?resourceUrl='+share_url+'&title='+share_title+'：'+news_title+'&images='+share_pic+'&content='+share_url,'newwindow');
			break;
		case 4:
			window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&url='+share_url+'&pics='+share_pic+'&title='+news_title+'&site='+share_from+'','newwindow');
			break;
		case 5:
			ga('send', 'event', 'News share', 'select', 'email', {'nonInteraction': 1});
			window.open('http://s.share.baidu.com/sendmail?click=1&url='+share_url+'&uid=0&to=mail&type=text&pic='+share_pic+'&title='+news_title+'&key=&desc=&comment=&relateUid=&searchPic=0&sign=on&l=&linkid=&firstime=1394605619419','newwindow');
			break;
	}
}
function getAgentMemberProperties(slug)
{
	var url = apiPrefix+'/agent/getpropertiesbyagent/?accountSlug='+slug+'&pageno='+currentAgentPropertyPage;
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		success:function(data){
			if (data.status != 0){
				alert(data.error);
				return;
			}
			setAgentMemberProperties(data.data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}
function getAgentMemberTeamProperties(unique)
{
	var url = apiPrefix+'/agent/getpropertiesbyagent/?accountUnique='+unique+'&pageno='+currentAgentPropertyPage;
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		success:function(data){
			if (data.status != 0){
				alert(data.error);
				return;
			}
			setAgentMemberProperties(data.data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}
function setAgentMemberProperties(data)
{
	if(currentAgentPropertyPage==1){
		$("#agent-member-count").text(data.count);
	}
	for(var i=0; i<data.data.length; i++){
		var html = "";
		var price = "";
		var title = "";
		var size = "";

		if(data.data[i].price == null){
			price = "询价";
		} else {
			price = data.data[i].price;
		}

		if(!data.data[i].title){
			var title_country=data.data[i].country?data.data[i].country:'';
			var title_region=data.data[i].region?data.data[i].region:'';
			title =  title_country + title_region + '的新建房产';
		} else {
			title = data.data[i].title;
		}
		if(data.data[i].size == 0){
			size = " &nbsp;";
		} else {
			size = data.data[i].size+"平米";
		}

		html += '<li class="indexClass ui-li ui-li-static" onclick="propertyDetail(' + data.data[i].propertyid+');">'
		+ '<div style="float:left;"><img id="image" onerror="this.src=\'css/images/property-default.png\'" src="'+encodeURI(decodeURI(data.data[i].imageurl))+'"></div>'
		+ '<h3 class="tt ui-li-heading">'+title+"</h3>"
		+ '<p class="ui-li-desc">'+(data.data[i].country==null? '':data.data[i].country)+'&nbsp;'+ (data.data[i].region==null? '':data.data[i].region) +'</p>'
		+ '<p class="ui-listview-inset ui-li-desc">'+size+'<span>'+price+'</span></p>'
		+ '</li>';
		if(i == data.data.length-1){
			if(data.data.length==10){
				html += '<li id="get-more-new-properties">'
				+ '加载更多</li>';
			}
		}
		$("li").remove("#get-more-new-properties");
		$("#list-new-properties").append(html);
	}
	$("#get-more-new-properties").bind("click", function(){
		getMoreAgentProperties();
	});
}
function getMoreAgentProperties()
{
	currentAgentPropertyPage++;
	if(typeof(slug) == "undefined"){
		getAgentMemberTeamProperties(unique);
	}else{
		getAgentMemberProperties(slug);
	}
}
function getAgentMember(slug)
{
	var url = apiPrefix+'/agent/getagent/?accountSlug='+slug;
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		success:function(data){
			if (data.status != 0){
				alert(data.error);
				return;
			}
			var desc=data.data.description;
			sessionStorage.setItem('agent-desc',desc);
			setAgentProfile(data.data,slug);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function getAgentTeamMember(unique)
{
	var url = apiPrefix+'/agent/getagentmember/?accountUnique='+unique;
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		success:function(data){
			if (data.status != 0){
				alert(data.error);
				return;
			}
			setAgentTeamMember(data.data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}
function setAgentTeamMember(data)
{
	var team_list_html = '<div class="member">' +
	'<div class="img_con"><span>'+
	'<img src="'+(data.avatar == "" ? "css/images/avatar-default.png" : data.avatar)+'" onerror="this.src=\'css/images/avatar-default.png\'" style="display: block;">'+
	'</span></div>'+
	'<div class="t_info">'+
	(data.name == "" ? "" : '<h3>'+data.name+'</h3>')+
	(data.title == "" ? "" : '<p class="title">'+data.title+'</p>')+
	(data.country == "" ? "" : '<p>'+data.country+'</p>')+
	(!(data.properties_count) > 0 ? "" : '<p>共有 '+data.properties_count+' 套房产</p>')+
	'</div>'+
	'<div class="clear"></div>'+
	'</div>';
	$(".team_list").html(team_list_html);

	var u_caption_html = '<div class="u_caption">';
	if(data.caption!="") {
		u_caption_html += '<div class="u_caption_item">'+
		'<p>'+data.caption+'</p>'+
		'</div>';
	}

	if(data.email != "" || data.mobile != ""){
		agentPhone='<a href="tel:'+data.mobile+'">'+data.mobile+'</a>';
		u_caption_html += '<div class="u_caption_item">'+
		'<p>联系方式：</p>'+'<p>电话：<span id="agent-phone-txt"><a href="#" onclick="ga(\'send\', \'event\', \'Agent_Tel_View\', \'click\', {\'hitCallback\':function () {$(\'#agent-phone-txt\').html(agentPhone);}});">点击查看</a></span></p>'+
		// '<p>邮箱：'+data.email+'</p>'+
		'</div>';
	}

	u_caption_html += '</div>';
	$(".u_caption").html(u_caption_html);
}

function getAgentProfile(slug)
{
	var url = apiPrefix+'/agent/getagent/?accountSlug='+slug;
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		success:function(data){
			if (data.status != 0){
				alert(data.error);
				return;
			}
			if(data.data.identidad != "group"){
				$("#agent-teams-tab a").html("公司团队");
			}
			//var desc=data.data.description;
			//sessionStorage.setItem('agent-desc',desc);
			setAgentProfile(data.data,slug);
			if(data.data.identidad != "group") $("#agent-teams h2").html('共有 <i id="agent-member-count-txt">--</i> 个团队成员');
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function setAgentProfile(data,slug)
{
	$('#agent-banner-img').attr('src',data.banner);
	//$('#agent-banner-img').attr('alt',data.name);
	$('#agent-logo-img').attr('src',data.logo);
	$('#agent-logo-img').attr('alt',data.name);
	$('#agent-country-txt').text(data.country);
	$('#agent-name-txt').text(data.name);
	$('#agent-id-txt').text(data.id);
	var html = "";
	if(data.phone!="") {
		agentPhone='<a href="tel:'+data.phone+'">'+data.phone+'</a>';
		html += '<p>电话：<span id="agent-phone-txt"><a href="#" onclick="ga(\'send\', \'event\', \'Agent_Tel_View\', \'click\', {\'hitCallback\':function () {$(\'#agent-phone-txt\').html(agentPhone);}});">点击查看</a></span></p>';
	}
	if(data.website!="") {
		agentWebsite=data.website;
		html += '<p>网址：<span id="agent-website-txt"><a href="#" onclick="ga(\'send\', \'event\', \'Agent_Website_View\', \'click\', {\'hitCallback\':function () {$(\'#agent-website-txt\').text(agentWebsite);}});">点击查看</a></span></p>';
	}
	//if(data.email!="") {
	//	html += '<p>邮箱：<span id="agent-email-txt">'+data.email+'</span></p>';
	//}
	if(data.address!="") {
		agentAddress=data.address;
		html += '<p>地址：<span id="agent-address-txt"><a href="#" onclick="ga(\'send\', \'event\', \'Agent_Addr_View\', \'click\', {\'hitCallback\':function () {$(\'#agent-address-txt\').text(agentAddress);}});">点击查看</a></span></p>';
	}
	$(".agent_contact").html(html);

	if (!data.description){
		$('#agent-tabs').addClass('two-tabs');
		$('#agent-desc-tab').hide();
		$('#agent-listings-tab').addClass('first');
		setAgentListings(slug);
	} else {
		$('#agent-desc-html').html(data.description);
	}

	$('#enquire-agent').click(function(){
		ga('send', 'event', 'Agent_Enquiry_Open', 'click', {'hitCallback':function () {redirect('agentform.html?slug='+slug);}});
	});

	identidad = data.identidad;
	//document.title = data.country+'中介详情_居外海外房产网';
}

function setAgentDesc()
{
	if ($('#agent-desc-tab > a').hasClass('selected')){
		return;
	}
	$('#agent-desc-tab > a').addClass('selected');
	$('#agent-teams-tab > a').removeClass('selected');
	$('#agent-listings-tab > a').removeClass('selected');

	$('#agent-desc').show();
	$('#agent-teams').hide();
	$('#agent-listings').hide();
	//if($('#agent-desc-html').html() ==""){
	//	var desc = sessionStorage.getItem('agent-desc');
	//	$('#agent-desc-html').html(desc);
	//}
}

function getAgentTeams(slug)
{
	var url = apiPrefix+'/agent/getagentteams/?accountSlug='+slug+'&pageno='+currentAgentTeamPage;
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		success:function(data){
			if (data.status != 0){
				alert(data.error);
				return;
			}
			var html = buildAgentTeams(data.data.data);
			if(data.data.count > currentAgentTeamPage*10){
				if(typeof(showCountagent) != "undefined"){
					html += '<div class="member get-more-team" onclick="agentTeamOrOffice(\''+slug+'\');">查看全部</div>';
				}else{
					html += '<div class="member get-more-team" onclick="getMoreAgentTeams(\''+slug+'\');">加载更多</div>';
				}
			}
			$(".get-more-team").remove();
			$('#agent-teams-html').append(html);
			$('#agent-member-count, #agent-member-count-txt').html(data.data.count);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}

function getMoreAgentTeams(slug)
{
	currentAgentTeamPage += 1;
	getAgentTeams(slug);
}

function agentTeamOrOffice(slug){
	var mark = identidad == "group" ? "agentoffice" : "agentteam";
	redirect(mark+".html?slug="+slug);
}

function buildAgentTeams(data)
{
	var html = '';
	for(var i=0; i<data.length; i++){
		var name = data[i].name?data[i].name:'&nbsp;';
		var title = data[i].title?data[i].title:'&nbsp;';
		var country = data[i].country?data[i].country:'&nbsp;';
		html += '<div class="member"';
		if(data[i].properties_count > 0){
			html += ' onclick="agentTeamDetail(\''+data[i]['identidad']+'\',\''+data[i]['slug']+'\',\''+data[i]['unique']+'\')"';
		}
		html += '>';
		html += '<div class="img_con"><span>';

		if(data[i]['identidad'] == "group"){
			html += '<img src="'+(data[i].avatar == "" ? "css/images/franchise-default.png" : data[i].avatar)+'" onerror="this.src=\'css/images/franchise-default.png\'" style="display: block;">';
		}else{
			html += '<img src="'+(data[i].avatar == "" ? "css/images/avatar-default.png" : data[i].avatar)+'" onerror="this.src=\'css/images/avatar-default.png\'" style="display: block;">';
		}
		html += '</span></div>';
		html += '<div class="t_info">';
		if(name != "") {
			html += '<h3>'+name+'</h3>';
		}
		if(title != "") {
			html += '<p class="title">'+title+'</p>';
		}
		if(country != "") {
			html += '<p>'+country+'</p>';
		}
		if(data[i].properties_count > 0) {
			html += '<p>共有 '+data[i].properties_count+' 套房产</p>';
		}
		html += '</div>';
		html += '<div class="clear"></div>';
		html += '</div>';
	}
	return html;
}
function setAgentTeams(slug)
{
	if ($('#agent-teams-tab > a').hasClass('selected')){
		return;
	}
	$('#agent-desc-tab > a').removeClass('selected');
	$('#agent-teams-tab > a').addClass('selected');
	$('#agent-listings-tab > a').removeClass('selected');

	$('#agent-desc').hide();
	$('#agent-teams').show();
	$('#agent-listings').hide();
	if($('#agent-teams-html').html() == ""){
		getAgentTeams(slug);
	}
}

function agentTeamDetail(identidad, slug, unique)
{
	if(identidad == "group"){
		redirect("agentprofile.html?slug="+slug);
	}else{
		redirect("agentmember.html?unique="+unique);
	}
}

function getAgentListings(slug)
{
	var url = apiPrefix+'/agent/getpropertiesbyagent/?accountSlug='+slug;
	$.ajax({
		type: "GET",
		url: url,
		dataType: "jsonp",
		success:function(data){
			if (data.status != 0){
				alert(data.error);
				return;
			}
			var html = buildAgentListings(data.data.data);
			if(data.data.count > 10){
				html += '<li id="get-more-new-properties" onclick="getAllAgentListings(\''+slug+'\')">查看全部</li>';
			}
			$('#agent-listings-count').html(data.data.count);
			$('#list_standard').html(html);
			$("#agent-listings-count-txt").html(data.data.count);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}
function getAllAgentListings(slug)
{
	redirect("agentlistings.html?slug="+slug);
}

function buildAgentListings(data)
{
	var htmls = [];
	for(var i=0; i<data.length; i++){
		var html = "";
		var price = "";
		var title = "";
		var size = "";

		if(data[i].price == null){
			price = "询价";
		} else {
			price = data[i].price;
		}

		if(!data[i].title){
			var title_country=data[i].country?data[i].country:'';
			var title_region=data[i].region?data[i].region:'';
			title =  title_country + title_region + '的新建房产';
		} else {
			title = data[i].title;
		}

		if(data[i].size == 0){
			size = " &nbsp;";
		} else {
			size = data[i].size+"平米";
		}

		html += '<li class="indexClass ui-li ui-li-static" onclick="propertyDetail(' + data[i].propertyid+');">'
		+ '<div style="float:left;"><img id="image" onerror="this.src=\'css/images/property-default.png\'" src="'+encodeURI(decodeURI(data[i].imageurl))+'" alt="'+title+'"/></div>'
		+ '<h3 class="tt ui-li-heading">'+title+'</h3>'
		+ '<p class="ui-li-desc">'+data[i].country+'&nbsp;'+data[i].region +'</p>'
		+ '<p class="ui-listview-inset ui-li-desc">'+size+'<span>'+price+'</span></p>'
		+ '</li>';

		if(i == data.length-1){
			if(data.length==10){
				//html += '<li id="get-more-new-properties">加载更多</li>';
			}
		}
		htmls.push(html);
	}
	return htmls.join('');
}
function setAgentListings(slug)
{
	if ($('#agent-listings-tab > a').hasClass('selected')){
		return;
	}
	$('#agent-desc-tab > a').removeClass('selected');
	$('#agent-teams-tab > a').removeClass('selected');
	$('#agent-listings-tab > a').addClass('selected');

	$('#agent-desc').hide();
	$('#agent-teams').hide();
	$('#agent-listings').show();
	if($('#list_standard').html()==""){
		getAgentListings(slug);
	}
}
function getNewsCategory()
{
	var newsCategories=localStorage.getItem("newsCategories");
	if (newsCategories) {
		try{
			var categories = JSON.parse(newsCategories);
			buildNewsCategory(categories);
			return;
		}catch(e){
			console.error("Parsing news categories from cache error:", e);
			return null;
		}
	}

	$.ajax({
		type: "GET",
		url: apiPrefix+"/news/getNewsCategory/?callback=?",
		dataType: "jsonp",
		contentType:"text/html",
		success:function(data){
			var categories = data.data;
			var newsCategories = JSON.stringify(categories);
			localStorage.setItem("newsCategories",newsCategories);
			buildNewsCategory(categories);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
}
function buildNewsCategory(data){
	if (data == null) {
		return '';
	}
	var html = "";
	for (var i = 0; i < data.length; i++) {
		html+= '<li onclick="redirect(\'newslist.html?category='+$.trim(data[i].slug)+'\');" '
		+'class="ui-li ui-li-static ui-btn-up-c ui-first-child ui-last-child">'
		+'<a href="#'+data[i].slug+'" id="'+data[i].slug+'" style="font-size:14px;color:#fff">' + data[i].name + '</a></li>';
	}
	$('#category').html(html);
}
