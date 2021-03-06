$(function(){

    var layer = layui.layer
    var form = layui.form
    layui.use('layedit', function(){
        var layedit = layui.layedit;
        layedit.build('demo'); //建立编辑器
    });

    initCate()
    // 初始化富文本编辑器
    // 定义加载文章类别的方法
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎 渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id').html(htmlStr)
                console.log(res.data);            
                // 一定要调用 form.render()方法
                form.render()
            }
        })
    }


    //封面裁剪效果
    // 初始化图片裁剪器
    var $image = $('#image')

    // 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 初始化裁剪区域
    $image.cropper(options)


    // 未选择封面的按钮绑定点击事件函数
    $('#btnChooseImage').on('click',function(){
        $('#coverFile').click()
    })

    // 监听 coverFile 的change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function(e){
        // 获取文件的列表数据
        var files = e.target.files
        // 判断用户是否选择了文件
        if(files.length === 0) {
            return 
        }
        // 根据文件创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
          .cropper('destroy') //销毁旧的裁剪区域
          .attr('src', newImgURL) //重新设置图片路径
          .cropper(options) //重新初始化裁剪区域
    })

    // 定义文章的状态
    var art_state = '已发布'

    // 为存为草稿按钮绑定点击事件处理函数
    $('#btnSave2').on('click',function(){
        art_state = '草稿' 
    })

    // fd.append('cate_name', )

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e){
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 基于form表单快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存到fd中
        fd.append('state', art_state)
        
        var cateId = fd.get('cate_id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + cateId,
            async : false,
            success: function(res){
                // console.log(typeof res.data.name);
                // console.log(typeof art_state);
                var nm = res.data.name
                window.nm = nm
            }
        })
        // 将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
              // 创建一个Canvas画布
              width: 400,
              height: 280
            })
            .toBlob(function (blob){
              //将Canvas画布上的内容 转换为文件对象 并进行后续操作
              // 将文件对象存储到fd中
              fd.append('cover_img', blob)
              // 发起ajax数据请

              publishArticle(fd) 
        })

        fd.append("cate_name", nm)

        fd.forEach(function(v, k) {
            console.log(k, v);
        })
    })
    // 定义一个发布文章的方法
    function publishArticle(fd){
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是FormData格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res){
                console.log(res);
                if(res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后 跳转到文章列表的页面  警告
                location.href = './art_list.html'
            }
        })
    }
})