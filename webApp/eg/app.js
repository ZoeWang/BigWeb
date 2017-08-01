function redirect(url){
	window.location.href=url;
}
function goBack(){
	var ref = document.referrer;  //网址来源
	if (ref){
		history.go(-1);
	}else{
		redirect('index.html');
	}
}
