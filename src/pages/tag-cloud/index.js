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

        this.init();
    };
    
    TagCloud.prototype = {
        constructor: TagCloud,

        init: function(){
            this.initContainer(this.options.selector);
            this.initTag();
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
                tagFragment.appendChild(tag);
            }
            this.tagCloudContainer.appendChild(tagFragment);
            const tags = this.tagCloudContainer.querySelectorAll('.tag');
            this.tags = tags;
            for (let i = 0; i < tags.length; i++) {
                const temp = {
                    left: Math.round(Math.random() * (this.options.containerWidth*0.618)),
                    top: Math.round(Math.random() * this.options.containerHeight)
                };
                tags[i].style.top = temp.top + 'px';
                tags[i].style.left = temp.left + 'px';
            }
            this.setTagAnimation();
        },

        setTagAnimation: function (){
            const data = this.options.data;
            function tagAnimation(index,tag) {
                //animation参数：动画名称、动画时长、动画时长分布计算函数、延迟时间、动画次数、是否来回、模式、状态
                //e.g slidein 3s ease-in 1s infinite reverse both running
                let duration = Math.abs(data[index].weight+1) * 2;
                let delay = Math.random();
                tag.style['animation'] = `tagAnimation ${duration}s linear ${delay}s infinite running`;
                tag.style['-webkit-animation'] = `tagAnimation ${duration}s linear ${delay}s infinite running`;
            }
            const tags = this.tags;
            for (let i = 0; i < tags.length; i++) {
                tagAnimation(i, tags[i]);
            }
        },

        initKeyFrames: function (){
            for (let i = 0; i < this.options.data.length; i++) {
                const style = `
                    <style type="text/css">
                        @keyframes tagAnimation${i} {
                            0% {
                                top: ;
                            }
                        }
                    </style>
                `
            }
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
        }
    };

    window.TagCloud = TagCloud;
})();

const mockData = [];
for (let i = 0; i < 20; i+=2) {
    mockData.push({
        text: '标签'+i,
        weight: i
    });
}

new TagCloud({
    data: mockData
});