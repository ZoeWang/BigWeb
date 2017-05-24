(function(app) {

  app.AppForm = ng.core
    .Component({
        selector:'app-form',
        templateUrl:'app/html/app.AppForm.html',
    })
    .Class({
        constructor:function(){

      },
        subMsg:function(){
            // 计数
            var num = $("#num").text();

            var username = $("#username"),
                tel = $("#tel");
            if($.trim(username.val()) == ''){
                username.next('.err').text('请输入您的姓名');
            }else if($.trim(tel.val()) == ''){
                tel.next('.err').text('请输入您的手机号');
            }else if(this.isMobile($.trim(tel.val())) == false){
                tel.next('.err').text('请输入正确的手机号');
            }else{
                var url = "/newtrain/collectinfo";
                $.ajax({
                    type:"post",
                    url:url,
                    data:{
                        'uname':$.trim(username.val()),
                        'tel':$.trim(tel.val()),
                        'class_id':$("#class_id").val() ,
                        'class_name':$("#class_name").val(),
                        'slug':$("#slug").val(),
                    },
                    dataType:"json",
                    success:function(res){
                        if(res.status == 1){    //成功
                            // 设置按钮
                            $("#btnSub")
                                .removeClass('btn-red')
                                .addClass('btn-grey')
                                .css('cursor','default')
                                .text(res.msg);
                                $("#num").text(Number(num)+1);
                                $('#btnSub').off('click',this.subMsg);
                        }else if(res.status == 0){  // 失败
                            $("#btnSub")
                                .removeClass('btn-grey')
                                .addClass('btn-red')
                                .css('cursor','pointer')
                                .text(res.msg);
                        }else if(res.status == 2){  // 失败
                            $("#btnSub")
                                .addClass('btn-grey')
                                .css('cursor','default')
                                .text(res.msg);
                                $('#btnSub').off('click',this.subMsg);
                        }
                    },
                    error:function(){
                        console.log('异常！');
                    }
                })
            }
        },
        isMobile:function(tel){
            return /^((\(\d{2,3}\))|(\d{3}\-))?(1[34578]\d{9})$/.test(tel);
        },
        errTipNone:function(){
            $('#form input').focus(function(){
                $(this).next('.err').text('');
            })
        }
    });

})(window.app || (window.app = {}));