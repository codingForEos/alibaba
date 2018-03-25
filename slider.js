/**
 * @overview 获取属性，兼容
 * @param {*} obj 
 * @param {*} attr 
 */
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    else {
        return getComputedStyle(obj, false)[attr];
    }
}
/**
 * @overview 批量设置属性
 * @param {Object} //obj 需要被设置的对象
 * @param {json} // attrs需要设置的属性，是一个json格式的对象
  */
 function setStyle(obj,attrs){
    for (var attr in attrs){
        obj.style[attr] = attrs[attr];
    }
 }
/**
 * @overview 轮播图对象 请保持您的图片尺寸和宽高比都是一样大的。
 * @param {obj} //container 装轮播图的容器，一般就是一个div 
 * @param {Array} //imgs图片链接数组
 * @param {Number} //speed 轮播速度 选大于1的数，建议给8
 */
function Slider(container, imgs, speed){
    this.container = container;
    this.propor = null; //轮播图宽高比
    this.imgs = imgs.concat(...imgs); //为实际图片数的两倍
    this.imgLength = this.imgs.length; //轮播图图片个数为实际图片数量的两倍
    this.time = this.time //滚动的时间
    this.imgWidth = null //图片宽度
    this.imgHeight = null //图片高度
    this.imgUl = null //轮播组件。
    this.timer = null //轮播图定时器
    this.bannerTip = null //图片指示
    this.leftBtn = null //左边的按钮
    this.rightBtn = null //右边的按钮
    /** 我的无缝滚动方案采用多显示一倍图的方式，默认的第一张图为重复第二次的首张图 */
    this.indexPos = 3; //定位轮播图 默认为第三张
    this.speed = speed //播放速度
    this.sliderWidth = this.container.clientWidth;//轮播图宽度
    this.autoMove = null //自动播放定时器
}
/**
 * @overview 根据图片信息初始化dom
 * 注意！这个init函数里面有异步操作！
 */
Slider.prototype.init = function(){
    var img = new Image();
    img.src = this.imgs[0];
    self = this;
    img.onload = function(){
        self.imgWidth = img.width;
        self.imgHeight = img.height;
        self.propor = (self.imgHeight / self.imgWidth)*100 + '%';
        // console.log('宽高比',self.propor);
        var frageSlider = document.createDocumentFragment();
        /**
         * 创建一个轮播图的内wrap，作用是1.保持图片宽高比例，2，盖住多余不需要显示的
         */
        var sliderWrap = document.createElement('div');
        /* 设置样式，应该有更好的方式，目前没想到 */
        setStyle(sliderWrap,
            {
                'width':'100%',
                'height':'0px',
                'paddingBottom':self.propor,
                'position':'relative',
                'overflow':'hidden'
            });
        // sliderWrap.style.overflow ='hidden';
        /**
         * 创建一个轮播图片列表
          */
        var imgUl = document.createElement('ul');
        setStyle(imgUl,{
            'position':'absolute',
            'left': (-self.indexPos) * self.sliderWidth + 'px',
            'top':'0px',
            'zIndex':'0',
            'width': (self.imgLength * 100) + '%',
            'height':'100%',
            'padding':'0px',
            'margin':'0px'
        });
        for(var n = 0;n < self.imgLength;n++){
            var imgLi = document.createElement('li'); 
            setStyle(imgLi,{
                'height':'100%',
                'width': (1 / self.imgLength) * 100 + '%',
                'float':'left',
                'listStyleType':'none'
            });
            var imgIndex = document.createElement('img');
            imgIndex.src = self.imgs[n];
            setStyle(imgIndex,{
                'display':'block',
                'width':'100%',
                'height':'100%'
            });
            imgLi.appendChild(imgIndex);
            imgUl.appendChild(imgLi);
        }
        /* 创建右导航按钮 */
        var leftBtn = document.createElement('div');
        setStyle(leftBtn,{
            'width':'20%',
            'height':'0px',
            'paddingBottom':'20%',
            'borderRadius':'50%',
            'backgroundColor': 'rgba(200,200,200,.6)',
            'position': 'absolute',
            'left':'0px',
            'top':'50%',
            'transform':'translate(-50%,-50%)',
            'zIndex':'1',
            'display':'none'
        });
        leftBtn.className = 'leftBtn';
        self.leftBtn = leftBtn;
        sliderWrap.appendChild(leftBtn);
        /* 创建左导航按钮 */
        var rightBtn = document.createElement('div');
        setStyle(rightBtn, {
            'width': '20%',
            'height': '0px',
            'paddingBottom': '20%',
            'borderRadius': '50%',
            'backgroundColor': 'rgba(200,200,200,.6)',
            'position': 'absolute',
            'right': '0px',
            'top': '50%',
            'transform': 'translate(50%,-50%)',
            'zIndex': '1',
            'display': 'none'
        });
        rightBtn.className = 'rightBtn';
        self.rightBtn = rightBtn;
        sliderWrap.appendChild(rightBtn);
        /** 创建引导图片的bar */
        var bannerTip = document.createElement('ul');
        setStyle(bannerTip,{
            'position':'absolute',
            'bottom':'5px',
            'left':'50%',
            'transform':'translate(-50%,0)',
            'zIndex': '1',
            'padding':'0px',
            'paddingLeft':'16px',
            'margin':'0px',
        });
        for(var i=0;i<self.imgLength/2;i++){
            var bannerli = document.createElement('li');
            setStyle(bannerli, {
                'float':'left',
                'width':'10px',
                'height':'10px',
                'borderRadius':'50%',
                'transform': 'translate(-50%,0)',
                'backgroundColor':'rgba(255,255,255,0.5)',
                'listStyleType':'none',
                'margin':'8px'
            });
            bannerTip.appendChild(bannerli);
        }
        self.bannerTip = bannerTip.querySelectorAll('li');
        self.bannerTip[0].style.backgroundColor = 'rgba(0,0,0,.3)';
        sliderWrap.appendChild(bannerTip);
        self.imgUl = imgUl;
        sliderWrap.appendChild(imgUl);
        frageSlider.appendChild(sliderWrap);
        self.container.appendChild(frageSlider);
        self.bindEvent();
        self.autoMoveFun();
    }
}
/**
 * @图片移动函数
 * @param{Number} //des想要去到的坐标。针对imgUl
 * @param{String} //速度
 * @param{fun} //callback函数,运动结束后，调用
 * @param{String} //运动的方向，可选 ‘right’,'left'
 *  */ 
Slider.prototype.move = function (des, speed,direction,fun){
    if(this.timer  !== null){
        return;
    }
    self = this;
    this.timer = setInterval(
        function(){
            var moveStop = true; //运动结束标识位
            // 获取滚动组件当前的left;
            var objLeft = parseInt( getStyle(self.imgUl,'left'));
            var iSpeed = (des - objLeft)/speed;
            // console.log(iSpeed);
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if (objLeft !== des){ //还没滚动到位
                moveStop = false;
            }
            self.imgUl.style.left = objLeft + iSpeed + 'px'; //接着运动
            if(moveStop){
                clearInterval(self.timer);
                self.timer=null;
                /* 判断*/
                console.log('当前位置',self.indexPos);
                if(direction == 'left'){
                    self.indexPos = self.indexPos + 1;
                }else if(direction == 'right'){
                    self.indexPos = self.indexPos - 1;
                }
                if(self.indexPos == 0){
                    self.indexPos = 3;
                    setStyle(self.imgUl,{
                        'left':(-self.indexPos) * self.sliderWidth + 'px',
                    });
                } else if (self.indexPos == 5){
                    console.log('等于2啦');
                    self.indexPos = 2;
                    setStyle(self.imgUl, {
                        'left': (-self.indexPos) * self.sliderWidth + 'px',
                    });
                }
                if(self.indexPos == 3 || self.indexPos == 0){
                    self.bannerTip[0].style.backgroundColor = 'rgba(255,255,255,.5)';
                    self.bannerTip[1].style.backgroundColor = 'rgba(255,255,255,.5)';
                    self.bannerTip[2].style.backgroundColor = 'rgba(255,255,255,.5)';
                    self.bannerTip[0].style.backgroundColor = 'rgba(0,0,0,0.3)';
                } else if(self.indexPos == 4 || self.indexPos == 1){
                    self.bannerTip[0].style.backgroundColor = 'rgba(255,255,255,.5)';
                    self.bannerTip[1].style.backgroundColor = 'rgba(255,255,255,.5)';
                    self.bannerTip[2].style.backgroundColor = 'rgba(255,255,255,.5)';
                    self.bannerTip[1].style.backgroundColor = 'rgba(0,0,0,0.3)';
                } else if(self.indexPos == 5 || self.indexPos == 2){
                    self.bannerTip[0].style.backgroundColor = 'rgba(255,255,255,.5)';
                    self.bannerTip[1].style.backgroundColor = 'rgba(255,255,255,.5)';
                    self.bannerTip[2].style.backgroundColor = 'rgba(255,255,255,.5)';
                    self.bannerTip[2].style.backgroundColor = 'rgba(0,0,0,0.3)';
                }
                if(fun){
                    fun();
                }
            }
        },30);
}
/**
 * @overview 自动播放函数
 * 
 */
Slider.prototype.autoMoveFun = function(){
    self = this;
    if(this.autoMove === null){
        this.autoMove = setInterval(()=>{
            console.log('张涛');
            var des = parseInt(getStyle(self.imgUl, 'left')) - self.container.querySelector('img').clientWidth;
            self.move(des, self.speed, 'left', () => { console.log('停了') });
        },1800);
    }
}
/**
 * @overview 停止自动播放
 * 
 */
Slider.prototype.stopAutoMoveFun = function () {
    clearInterval(this.autoMove);
    this.autoMove = null;
}
/**
 * @overview 绑定事件
 */
Slider.prototype.bindEvent = function () {
    self = this;
    this.container.addEventListener('click',function(ev){
        switch (ev.target.className) {
            case 'rightBtn':
                {
                    console.log('左边');
                    var des = parseInt(getStyle(self.imgUl, 'left')) - self.container.querySelector('img').clientWidth;
                    self.move(des,self.speed,'left',()=>{ console.log('停了') });
                    break;
                }
            case 'leftBtn':
                {
                    console.log('右边')
                    var des = parseInt(getStyle(self.imgUl, 'left')) + self.container.querySelector('img').clientWidth;
                    self.move(des,self.speed,'right', () => { console.log('停了') });
                    break;
                }
            default:
                break;
        }
    });
    this.container.addEventListener('mouseover',function(){
        console.log('进来');
        self.rightBtn.style.display = 'block';
        self.leftBtn.style.display = 'block';
        self.stopAutoMoveFun();
    })
    this.container.addEventListener('mouseout',function () {
        console.log('出来');
        self.autoMoveFun();
        self.rightBtn.style.display = 'none';
        self.leftBtn.style.display = 'none';
    })
}


var imgs = [
    './img/1.jpg',
    './img/2.jpg' ,
    './img/3.jpg'
];
var oDiv = document.getElementById('slider');
var slider = new Slider(document.getElementById('slider'), imgs,2);
slider.init();
