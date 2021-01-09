// 注意：每次调用$.get() or $.post() or $.ajax()的时候，
// 会先调用ajaxPrefilter这个函数，
// 在这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){
    // 在发起真正的ajax之前 统一拼接请求的根路径
    options.url = 'http://127.0.0.1:3007' + options.url
    // console.log(options.url);

    // 统一为有权限的接口，设置 headers 请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function(res){
        // console.log('执行了complete回调');
        // console.log(res);
        // 在complete回调函数中可以使用res.responseJSON响应回来的数据
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转回登录页面
            location.href = 'login.html'
        }
    }
})
