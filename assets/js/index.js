$(function(){
    // 调用getUserInfo() 获取用户的基本信息
    getUserInfo()

    var layer = layui.layer

    // 点击按钮实现退出功能
    $('#btnLogout').on('click',function(){
        // 提示用户是否确认退出
        layer.confirm('确认退出登录吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 清空本地存储的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/login.html'
            // 关闭confirm弹出层
            layer.close(index);
          });
    })
})

// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url: '/my/userinfo',
        // 以/api/开头的请求路径，不需要访问权限
        // 以/my/开头的请求路径，必须要在请求头中携带Authorization身份认证字段，才能正常访问成功
        // headers就是请求头配置对象
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success: function(res){
           if(res.status !== 0){
               return layui.layer.msg('获取用户信息失败！')
           }
           // 调用renderAvadar 渲染用户的头像
           renderAvatar(res.data)
        },
        // 不论成功还是失败都会调用complete函数
        // complete: function(res){
        //     // console.log('执行了complete回调');
        //     // console.log(res);
        //     // 在complete回调函数中可以使用res.responseJSON响应回来的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 强制清空token
        //         localStorage.removeItem('token')
        //         // 强制跳转回登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}


// 渲染用户的头像
function renderAvatar(user){
    // 获取用户的名称 昵称优先级 用户名次之
    var name =user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户的头像
    if(user.user_pic !== null){
        // 渲染图片图像
        $('.layui-nav-img')
          .attr('src', user.user_pic)
          .show()
        $('.text-avatar').hide()
    }else{
        // 渲染文本图像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
          .html(first)
          .show()
    }
}