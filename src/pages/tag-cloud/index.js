import './index.less';

(function () {
    const TagCloud = function (options) {
        //默认配置项
        const defaultOps = {
            data: [],
            selector: 'body',
            containerWidth: 500,
            containerHeight: 300,
        };
        //合并用户配置
        this.options = Object.assign(defaultOps, options);
        //存储标签对象
        this.tags = [];
        //容器外差
        this.DIFF = 60;
        //鼠标悬停误差调整
        this.SMALL_DIFF = 10;
        //初始化
        this.init();
    };

    function randomNumBoth(min, max){
        let range = max - min,
            random = Math.random();
         //四舍五入
        return min + Math.round(random * range);
    }
    
    TagCloud.prototype = {
        constructor: TagCloud,

        /*
        * 入口方法
        * */
        init: function(){
            this.initContainer(this.options.selector);
            this.initTag();
            this.bindTagEvent();
        },

        /*
        * 创建标签节点并渲染到DOM中
        * */
        initTag: function () {
            //创建标签容器
            const tagFragment = document.createDocumentFragment();
            //初始话数据源
            let data = [];
            if (Array.isArray(this.options.data)) data = this.options.data;
            //遍历数据源生成标签
            for (let i = 0; i < data.length; i++) {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.innerHTML = `
                    <a href="#">${data[i]['text']}</a>
                `;
                tag.setAttribute('data-index', i);
                tagFragment.appendChild(tag);
                this.tags.push({index: i, tag: tag});
            }
            //渲染
            this.tagCloudContainer.appendChild(tagFragment);
            //设置标签的随机位置
            for (let i = 0; i < this.tags.length; i++) {
                const temp = {
                    left: Math.round(Math.random() * (this.options.containerWidth*0.618)),
                    top: Math.round(Math.random() * this.options.containerHeight)
                };
                this.tags[i].tag.style.top = temp.top + 'px';
                this.tags[i].tag.style.left = temp.left + 'px';
            }
            //初始化动画
            this.setTagAnimation();
        },

        /*
        * 标签动画创建方法
        * @param index 索引
        * @param tag 标签节点
        * */
        tagAnimation: function (index, tag){
            //根据权重，生成首次动画的持续时间
            let duration = randomNumBoth(3, 12);
            //根据首次动画标签的开始位置与重复动画标签的总路径比例， 生成重复动画的持续时间
            let rpDuration = Math.round(duration * (this.options.containerHeight + this.DIFF * 2) / (this.tags[index].offsetTop + this.DIFF - this.SMALL_DIFF));
            //根据权重生成标签的z-index值
            tag.style.zIndex = Math.round(Math.abs(this.options.data[index].weight + 1) * 10000) + '';
            //animation参数：动画名称、动画时长、动画时长分布计算函数、延迟时间、动画次数、是否来回、模式、状态
            //e.g slidein 3s ease-in 1s infinite reverse both running
            tag.style['animation'] = `tagAnimation${index} ${duration}s linear 0s 1 running`;
            tag.style['-webkit-animation'] = `tagAnimation${index} ${duration}s linear 0s 1 running`;
            //重复动画将在首次动画完成后开始执行，设置延时时间为首次动画的持续时间
            this.tags[index].timeOut = setTimeout(function () {
                tag.style['animation'] = `tagAnimationRep${index} ${rpDuration}s linear 0s infinite running`;
                tag.style['-webkit-animation'] = `tagAnimationRep${index} ${rpDuration}s linear 0s infinite running`;
            }, duration * 1000);
        },

        /*
        * 初始化标签动画
        * */
        setTagAnimation: function (){
            const tags = this.tags;

            for (let i = 0; i < tags.length; i++) {
                tags[i].offsetTop = tags[i].tag.offsetTop;
                //创建动画关键帧
                this.initKeyFrames(i, tags);
                //创建动画
                this.tagAnimation(i, tags[i].tag);
            }
        },

        /*
        * 创建动画关键帧的方法
        * @param i 索引
        * @param tags 标签对象数组
        * */
        initKeyFrames: function (i, tags){
            //定义重复动画的标签初始位置
            let fromTop = this.options.containerHeight + this.DIFF;
            //创建style节点
            tags[i].styleWrap = document.createElement('style');
            tags[i].styleWrap.type = 'text/css';
            //定义鼠标悬停离开后动画的初始位置
            let top = tags[i].offsetTop - this.SMALL_DIFF;
            //节点赋值
            tags[i].styleWrap.innerHTML = `
                    @keyframes tagAnimationRep${i} {
                        from {
                            top: ${fromTop}px;
                        }
                        to {
                            top: -${this.DIFF}px;
                        }
                    }
                    @keyframes tagAnimation${i} {
                            from {
                                top: ${top}px;
                            }
                            to {
                                top: -${this.DIFF}px
                            }
                    }
                `;
            document.head.appendChild(tags[i].styleWrap);
        },

        /*
        * 创建标签云容器
        * @param selector 选择器
        * ! 如果根据选择器没有找到对应的DOM节点，会默认追加到body中
        * */
        initContainer: function (selector) {
            let wrap = null;
            if (typeof selector !== "string") {
                selector = 'body';
            }

            if (selector.indexOf('.') === 0) {//class
                wrap = document.querySelectorAll(selector);
            }else if (selector.indexOf('#') === 0) {//is id
                wrap = document.querySelector(selector);
            }else {
                wrap = document.querySelectorAll(selector);
            }

            const container = document.createElement('div');
            container.style.width = this.options.containerWidth + 'px';
            container.style.height = this.options.containerHeight + 'px';
            container.className = 'tag-cloud-container';
            this.tagCloudContainer  = container;

            if (wrap.length) {
                for (let i = 0; i < wrap.length; i++) {
                    wrap[i].appendChild(this.tagCloudContainer);
                }
            }else {
                wrap.appendChild(this.tagCloudContainer);
            }
        },

        /*
        * 标签绑定鼠标进入、离开事件，控制动画的暂停和恢复，并置顶、恢复z-index
        * */
        bindTagEvent: function () {
            const that = this;
            const tags = this.tags;
            for (let i = 0; i < tags.length; i++) {
                tags[i].tag.addEventListener('mouseenter', function (ev) {
                    ev.stopImmediatePropagation();
                    let temp = this.offsetTop;
                    let index = Number(this.getAttribute('data-index'));
                    tags[index].zIndex = this.style.zIndex;
                    clearTimeout(tags[index].timeOut);
                    document.head.removeChild(tags[index].styleWrap);

                    this.style.animation = '';
                    this.style.webkitAnimation = '';
                    this.style.top = temp - that.SMALL_DIFF + 'px';
                    this.style.zIndex = '999999';
                });
                tags[i].tag.addEventListener('mouseleave', function (ev) {
                    ev.stopImmediatePropagation();
                    let index = Number(this.getAttribute('data-index'));
                    this.style.zIndex = tags[index].zIndex;
                    tags[i].offsetTop = this.offsetTop;
                    that.initKeyFrames(index, tags);
                    that.tagAnimation(index, this);
                })
            }
        }
    };

    window.TagCloud = TagCloud;
})();

const mockData = [];
for (let i = 0; i < 20; i+=2) {
    mockData.push({
        text: '标签'+i,
        weight: Math.random()
    });
}

new TagCloud({
    data: mockData
});