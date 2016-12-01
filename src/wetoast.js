/**
 * WeToast by kiinlam
 * WeApp Toast add-ons
 * 微信小程序toast增强插件
 * Github: https://github.com/kiinlam/wetoast
 * LICENSE: MIT
 */

//构造函数
function WeToast () {
    let pages = getCurrentPages()
    this.__page = pages[pages.length - 1]
    this.__timeout = null
    return this
}

//切换显示/隐藏
WeToast.prototype.toast = function(data) {
    try {
        if (!data) {
            this.hide()
        } else {
            this.show(data)
        }
    } catch (err) {
        console.error(err)
        
        // fail callback
        typeof data.fail === 'function' && data.fail(data)
    }
}

//显示
WeToast.prototype.show = function(data) {
    let page = this.__page

    clearTimeout(this.__timeout)

    //display需要先设置为block之后，才能执行动画
    page.setData({
        'wetoast.reveal': true
    })

    // complete callback
    typeof data.complete === 'function' && data.complete(data)

    setTimeout(()=>{
        let animation = wx.createAnimation()
        animation.opacity(1).step()
        data.animationData = animation.export()
        data.reveal = true
        page.setData({
            wetoast: data
        })
    },30)

    this.__timeout = setTimeout(() => {
        this.toast()

        // success callback
        typeof data.success === 'function' && data.success(data)
    }, (data.duration || 2000) + 400)
}

//隐藏
WeToast.prototype.hide = function() {
    let page = this.__page
    
    clearTimeout(this.__timeout)

    if (!page.data.wetoast.reveal) {
        return
    }
    
    let animation = wx.createAnimation()
    animation.opacity(0).step()
    page.setData({
        wetoast: {
            reveal: true,
            animationData: animation.export()
        }
    })
    
    setTimeout(() => {
        page.setData({
            wetoast: {}
        })
    }, 400)
}

module.exports = {
    WeToast
}