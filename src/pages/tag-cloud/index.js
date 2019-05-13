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
            for (let i = 0; i < tags.length; i++) {
                const temp = {
                    left: Math.round(Math.random() * this.options.containerWidth),
                    top: Math.round(Math.random() * this.options.containerHeight)
                };
                tags[i].style.top = temp.top + 'px';
                tags[i].style.left = temp.left + 'px';
                console.log(tags[i].offsetLeft);
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
            container.style.width = this.options.width + 'px';
            container.style.height = this.options.height + 'px';
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