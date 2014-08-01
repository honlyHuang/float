
/**
 * jQuery 鼠标跟随视差插件
 * author: reeqiwu
 * email: reeqi.wu@qq.com / wuliqi#jd.com
 * version: 1.0
 * update : 2014.05.19
 * use_step1 : $('#element').mParallax(options) |  #element为需要视差
 * use_step2 : 在需要视差移动的元素的html结构上添加 data-mparallax-index="1" ，1代表此为前景元素，递增代表由近及远
 * use_step3 : 可对单个视差元素设置移动方向：data-mparallax-direction="h" ，h:只进行水平移动，v:只进行垂直移动
 */


(function ($) {


    function MParallax(element, options) {
        this.ver = 1.0;
        this.$element = $(element);
        this.options = $.extend({}, $.fn.mParallax.defaults,options);
        this.init();
    }

    MParallax.prototype = {
        offset : null,
        elemInfo : null,
        itemsArray : [],

        /**
         * 获取外部元素的宽高，存于 elemInfo 对象
         */        
        _setElemInfo : function(){
            var elemWidth = this.$element.width();
            var halfWidth = elemWidth * 0.5;
            var elemHeight = this.$element.height();
            var halfHeight = elemHeight * 0.5;
            this.elementInfo = {
                width  : elemWidth,
                height : elemHeight,
                halfWidth : halfWidth,
                halfHeight : halfHeight
            };
        },

        /**
         * 获取需要进行视差的元素，存于 itemsArray 数组
         */         
        _setItemsArr : function(){
            var $element = this.$element;
            var $pItems = $element.find('[data-mparallax-index]');
            var indexArray = [];
            $pItems.each(function(index, el) {
                var mIndex = $(el).data('mparallax-index');
                indexArray.push(mIndex);
            });
            indexArray = indexArray.sort();

            for(var i = 0; i < indexArray.length; i++){
                var $pItem =  $element.find('[data-mparallax-index='+ indexArray[i] +']');
                var pos = $pItem.position();
                this.itemsArray.push($pItem);               
            }
        },


        /**
         * 设置偏移量
         */         
        offsetFunc : function(e){
            if(e.pageX < this.elementInfo.width){
                var pX = (this.options.moveScopeX * e.pageX) / this.elementInfo.halfWidth;
                var offsetX =  - ( this.options.moveScopeX  -  pX);
            }else{
                var pX = (this.options.moveScopeX * (e.pageX - this.elementInfo.halfWidth)) / this.elementInfo.halfWidth;
                var offsetX = pX;
            }

            if(e.pageY < this.elementInfo.halfHeight){
                var pY = (this.options.moveScopeY * e.pageY) / this.elementInfo.halfHeight;
                var offsetY =  - ( this.options.moveScopeY  -  pY);
            }else{
                var pY = (this.options.moveScopeY * (e.pageY - this.elementInfo.halfHeight)) / this.elementInfo.halfHeight;
                var offsetY = pY;
            }

            // 相反方向
            var offsetX = - offsetX;
            var offsetY = - offsetY;

            this.offset = {x:offsetX,y:offsetY}
        },


        /**
         * 鼠标进入响应区域触发函数
         */ 
        enterFunc : function(e){
            var that = this;
            this.offsetFunc(e);

            var a = this.offset.x;
            var b = this.offset.y;


            $(this.itemsArray).each(function(index, el) {

                if(index > 0){
                    that.offset.x = a * 0.5;
                    a = that.offset.x;

                    that.offset.y = b * 0.5;
                    b = that.offset.y;
                }

                var direction = that.options.direction;
                if($(el).data('mparallax-direction') !== undefined){
                    direction = $(el).data('mparallax-direction');
                }

                if(direction == 'h'){

                    $(el).animate({
                            marginLeft : that.offset.x + 'px'
                    },100,function(){

                        if(index == that.itemsArray.length - 1){

                            $(that.options.response).mousemove(function(e) {
                                that.moveFunc(e);
                            })
                            
                        }
                    });

                }else if(direction == 'v'){
                    $(el).animate({
                            marginTop : that.offset.y + 'px'
                    },100,function(){

                        if(index == that.itemsArray.length - 1){

                            $(that.options.response).mousemove(function(e) {
                                that.moveFunc(e);
                            })
                            
                        }
                    });

                }else{

                    $(el).animate({
                            marginLeft : that.offset.x + 'px',
                            marginTop : that.offset.y + 'px'
                    },100,function(){

                        if(index == that.itemsArray.length - 1){

                            $(that.options.response).mousemove(function(e) {
                                that.moveFunc(e);
                            })
                            
                        }
                    });

                }



            });

        },


        /**
         * 鼠标在响应区域内移动时触发函数
         */ 
        moveFunc : function(e){
            var that = this;
            this.offsetFunc(e);

            var a = this.offset.x;
            var b = this.offset.y;


            $(this.itemsArray).each(function(index, el) {

                if(index > 0){
                    that.offset.x = a * 0.5;
                    a = that.offset.x;

                    that.offset.y = b * 0.5;
                    b = that.offset.y;
                }

                var direction = that.options.direction;
                if($(el).data('mparallax-direction') !== undefined){
                    direction = $(el).data('mparallax-direction');
                }


                if(direction == 'h'){
                    $(el).css('margin-left', that.offset.x);

                }else if(direction == 'v'){
                    $(el).css('margin-top', that.offset.y);

                }else{
                    $(el).css('margin-left', that.offset.x);
                    $(el).css('margin-top', that.offset.y);

                }


            })



        },

        /**
         * 鼠标进入响应区域事件
         */ 
        _mouseenterEvent : function(){
            var that = this;
            $(this.options.response).mouseenter(function(e) {
                that.enterFunc(e);
            })
        },

        /**
         * 鼠标离开响应区域事件
         */ 
       _mouseleaveEvent : function(){
            
            $(this.options.response).mouseleave(function(e) {

                $(this).unbind('mousemove');

            })
        },


        /**
         * 插件初始化
         */ 
        init : function(){
            this._setElemInfo();
            this._setItemsArr();
            this._mouseenterEvent();
            this._mouseleaveEvent();

        }
    };

    // JQ插件模式
    $.fn.mParallax = function (options) {
        return this.each(function () {
            var $me = $(this),
                instance = $me.data('mParallax');
            if(!instance){
                instance = new MParallax(this, options);
                $me.data('mParallax',instance );
            }else{
            	instance.init();
            }
            if ($.type(options) === 'string') instance[options]();

        });
    };



    /**
     * 插件的默认值
     */
    $.fn.mParallax.defaults = {
        response : 'body', //鼠标响应的区域，默认为body，也可以是元素
        moveScopeX : 30, //前景元素（data-mparallax-index="1"）水平移动的范围，后面元素移动幅度依次递减50%
        moveScopeY : 16, //前景元素（data-mparallax-index="1"）垂直移动的范围，后面元素移动幅度依次递减50%
        direction : 'all' //移动方向，all:水平垂直方向启动；v:垂直移动；h水平移动
    };

})(jQuery);

