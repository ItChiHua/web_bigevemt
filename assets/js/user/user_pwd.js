$(function(){
    var form = layui.form

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value){
            if(value === $('[name=oldPwd]').val()){
                return '你特么密码一样还改个锤子！'
            }
        },
        rePwd: function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }
    })

    // 监听提交修改密码
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单 转换为DOM元素使用js原生的reset()方法
                $('.layui-form')[0].reset()
            }
        })
    })
})