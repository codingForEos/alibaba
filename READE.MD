### 题目一
- 是我理解错了题目么，不会这么简单把，我刚开始玩canvas，不熟。如果是我理解错了题目，麻烦您告诉我，您真正想实现的功能。
- 为了不丢人，我做了第二题，这样第一题理解错了，还有第二个 😄😄😄。
### 题目二
- 还有两点不满意，
    - 第一，当一次滚动未到位的时候，我的做法比较粗暴，直接return，还有更好的方式，但是最近找工作，还是先面试吧，没有工作有点慌呀，以后再改😄，抱抱自己。
    - 第二，最外层slider的宽度设为 100%(自适应)，滚动的时候会有一些误差，设置成绝对单位就没问题啦，如果要做响应方式的话，还得window.onresize的时候，重新设置宽度，有点费劲，嗯,有时间再改吧，
    - 第三，图片指示按钮没有和图片一起动，不美观。
> @王小柳 在boss上看到你的招聘信息，觉得这个题目很有意思，很认真的做了一下哦，我是前端新司机，写的很菜，希望你看到一定要给些意见哦，毕竟拥有及时反馈的刻意练习才是最有效的嘛，期待你的回复～～
ps:我没有前端工作经验啦，如果你对工作经验特别看中的话，就不要叫我去面试啦，哈哈哈哈。

#### 轮播图说明书
- 使用方法
```
//index.html
 <div id="slider" ></div>
// index.js
var imgs = [
    'https://gw.alicdn.com/tfs/TB1EaOddKuSBuNjy1XcXXcYjFXa-500-700.jpg',
    'https://gw.alicdn.com/tfs/TB1EaOddKuSBuNjy1XcXXcYjFXa-500-700.jpg' ,
    'https://gw.alicdn.com/tfs/TB1EaOddKuSBuNjy1XcXXcYjFXa-500-700.jpg'
];
var oDiv = document.getElementById('slider');
var slider = new Slider(document.getElementById('slider'), imgs,4);
slider.init();
```
-Slider构造函数参数
    - 第一个参数是一个空dom节点，最好是个div，轮播图的装载点。
    - 第二个参数是一组图片的url,注意，务必保持图片的尺寸和宽高比是一致的。
    - 第三个参数是速度，取大于等于1的数,越接近1速度越快。

- 功能
    - 轮波图装载点的dom只需要设置宽度，高度是根据图片的宽高比，自适应的。
    - 点前向前播放，点后向后播放
    - 无缝滚动。


