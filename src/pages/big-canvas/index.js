import './index.less';

(function () {
    const BigCanvas = function (options) {
        const defaultOptions = {
            selector: 'body',
            canvasWidth: 1920 * 10,
            canvasHeight: 1080 * 10,
            imgSrc: './static/imgs/ancient-tomb.jpg'
        };
        this.options = Object.assign(defaultOptions, options);

        this.init();
    };

    BigCanvas.prototype = {
        constructor: BigCanvas,

        init: function () {
            this.initContainer(this.options.selector);
            this.initCanvas();
            this.getImage();
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

            this.bigCanvasContainer = document.createElement('div');
            this.bigCanvasContainer.className = 'big-canvas-container';

            if (wrap.length) {
                for (let i = 0; i < wrap.length; i++) {
                    wrap[i].appendChild(this.bigCanvasContainer);
                }
            }else {
                wrap.appendChild(this.bigCanvasContainer);
            }
        },

        initCanvas: function () {
            const canvas = document.createElement('canvas');
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            canvas.innerText = '对不起，您使用的浏览器不支持canvas！请更换浏览器，再重新进入当前页面！';
            canvas.width = this.options.canvasWidth;
            canvas.height = this.options.canvasHeight;
            this.bigCanvasContainer.appendChild(canvas);
        },

        initContent: function () {
            const ctx = this.ctx;
            ctx.drawImage(this.image, 0, 0/*, this.options.canvasWidth, this.options.canvasHeight*/);
        },

        getImage: function () {
            const that = this;
            const img = new Image();
            this.image = img;
            img.src = this.options.imgSrc;
            img.onload = function () {
                that.initContent();
            }
        }
    };

    window.BigCanvas = BigCanvas;
})();

new BigCanvas();