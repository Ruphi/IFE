import './index.less';

(function () {
    const TagCloud = function (options) {
        const defaultOps = {
            data: [],
            selector: 'body',
            containerWidth: 500,
            containerHeight: 300
        };
        this.options = Object.assign(defaultOps, options);
        this.tags = [];
        this.DIFF = 60;
        this.SMALL_DIFF = 10;

        this.init();
    };
    
    TagCloud.prototype = {
        constructor: TagCloud,

        init: function(){
            this.initContainer(this.options.selector);
            this.initTag();
            this.bindTagEvent();
        },

        initTag: function () {
            const tagFragment = document.createDocumentFragment();
            let data = [];
            if (Array.isArray(this.options.data)) data = this.options.data;
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
            this.tagCloudContainer.appendChild(tagFragment);
            for (let i = 0; i < this.tags.length; i++) {
                const temp = {
                    left: Math.round(Math.random() * (this.options.containerWidth*0.618)),
                    top: Math.round(Math.random() * this.options.containerHeight)
                };
                this.tags[i].tag.style.top = temp.top + 'px';
                this.tags[i].tag.style.left = temp.left + 'px';
            }
            this.setTagAnimation();
        },

        tagAnimation: function (index, tag){
            //animation参数：动画名称、动画时长、动画时长分布计算函数、延迟时间、动画次数、是否来回、模式、状态
            //e.g slidein 3s ease-in 1s infinite reverse both running
            let duration = Math.round(Math.abs(this.options.data[index].weight+1) * 10);
            let rpDuration = Math.round(duration * (this.options.containerHeight + this.DIFF * 2) / (this.tags[index].offsetTop + this.DIFF));

            tag.style.zIndex = Math.round(Math.abs(this.options.data[index].weight + 1) * 10000) + '';

            tag.style['animation'] = `tagAnimation${index} ${duration}s linear 0s 1 running`;
            tag.style['-webkit-animation'] = `tagAnimation${index} ${duration}s linear 0s 1 running`;

            this.tags[index].timeOut = setTimeout(function () {
                tag.style['animation'] = `tagAnimationRep${index} ${rpDuration}s linear 0s infinite running`;
                tag.style['-webkit-animation'] = `tagAnimationRep${index} ${rpDuration}s linear 0s infinite running`;
            }, duration * 1000);
        },

        setTagAnimation: function (){
            const tags = this.tags;

            for (let i = 0; i < tags.length; i++) {
                tags[i].offsetTop = tags[i].tag.offsetTop;
                this.initKeyFrames(i, tags);
                this.tagAnimation(i, tags[i].tag);
            }
        },

        initKeyFrames: function (i, tags){
            let fromTop = this.options.containerHeight + this.DIFF;
            tags[i].styleWrap = document.createElement('style');
            tags[i].styleWrap.type = 'text/css';
            let top = tags[i].offsetTop - this.SMALL_DIFF;
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

        bindTagEvent: function () {
            const that = this;
            const tags = this.tags;
            for (let i = 0; i < tags.length; i++) {
                tags[i].tag.addEventListener('mouseenter', function (ev) {
                    ev.stopImmediatePropagation();
                    let temp = this.offsetTop;
                    let index = Number(this.getAttribute('data-index'));
                    clearTimeout(tags[index].timeOut);
                    document.head.removeChild(tags[index].styleWrap);

                    this.style.animation = '';
                    this.style.webkitAnimation = '';
                    this.style.top = temp - that.SMALL_DIFF + 'px';
                });
                tags[i].tag.addEventListener('mouseleave', function (ev) {
                    ev.stopImmediatePropagation();
                    let index = Number(this.getAttribute('data-index'));
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