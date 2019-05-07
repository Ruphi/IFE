import './index.less'

(function () {
    const ColorPicker = function (options) {
        this.h = 0;
        this.s = 50;
        this.l = 50;
        this.optionsDefault = {
            el:document.body
        };
        this.options = Object.assign(this.optionsDefault, options);
        this.init();
    };

    /*
    * 初始化
    * */
    ColorPicker.prototype.init = function () {
        this.createElem();
        this.createInput();
        this.initValue();
    };

    /*
    * 创建H选择器和SL选择器
    * 绑定两个选择区块的事件
    * 将选择区块渲染到DOM中
    * */
    ColorPicker.prototype.createElem = function () {
        const that = this;
        //创建选择器容器
        const wrap = document.createElement('div');
        wrap.classList.add('color-picker-container');
        this.pickerWrap = wrap;
        //创建SL选择区块并绑定事件
        this.pickerArea = document.createElement('div');
        this.pickerArea.classList.add('color-picker-area');
        this.pickerArea.addEventListener('click', function (ev) {
            let s = that.s = ev.offsetX / ev.target.clientWidth * 100;
            let l = that.l = 100 - ev.offsetY / ev.target.clientHeight * 100;
            const res = that.HSL2RGB(that.h, that.s, that.l);
            //更新HSL和RGB的值
            that.s = s;
            that.l = l;
            that.setHSLValue();
            that.r = res.r;
            that.g = res.g;
            that.b = res.b;
            that.setRGBValue();
        });
        //创建H选择区块并绑定事件
        this.pickerBar = document.createElement('div');
        this.pickerBar.classList.add('color-picker-bar');
        this.pickerBar.addEventListener('click', function (ev) {
            let h = that.h = ev.offsetY / ev.target.clientHeight * 359;
            let {r, g, b} = that.getColorAreaBackground(h);
            that.setPickerBarRGBA(r, g, b);
            //更新HSL和RGB的值
            that.setHSLValue();
            const temp = that.HSL2RGB(that.h, that.s, that.l);
            that.r = temp.r;
            that.g = temp.g;
            that.b = temp.b;
            that.setRGBValue();
        });
        //渲染DOM
        wrap.appendChild(this.pickerArea);
        wrap.appendChild(this.pickerBar);
        this.options.el.appendChild(this.pickerWrap);
    };

    /*
    * 创建RGB、HSL输入控件，并添加到DOM中
    * */
    ColorPicker.prototype.createInput = function () {
        const that = this;
        let inputWrap = document.createElement('div');
        inputWrap.classList.add('color-picker-input-container');
        
        function updateHSL() {
            const temp = that.RGB2HSL(that.r,that.g, that.b);
            that.h = temp.hue;
            that.s = temp.saturation;
            that.l = temp.lightness;
            that.setHSLValue();
        }
        
        function updateRGB() {
            const temp = that.HSL2RGB(that.h, that.s, that.l);
            that.r = temp.r;
            that.g = temp.g;
            that.b = temp.b;
            that.setRGBValue();
        }

        const RGBInputCallback = function (input) {
            let colorAttr = input.getAttribute('data-color-attr').toLowerCase();
            that[colorAttr] = input.value;
            if (input.value === '' || input.value < 0) {
                input.value = 0;
            }else if (input.value > 255) {
                input.value = 255;
            }
            updateHSL();
        };

        const HSLInputCallback = function (input) {
            let colorAttr = input.getAttribute('data-color-attr').toLowerCase();
            that[colorAttr] = input.value;
            if (input.value === '' || input.value < 0) {
                input.value = 0;
            }else {
                switch (colorAttr) {
                    case 'h':
                        if (input.value >= 360) input.value = 359;
                        break;
                    case 's':
                    case 'l':
                        if (input.value > 100) input.value = 100;
                        break;
                }
            }
            updateRGB();
        };

        this.inputFactory('inputR', inputWrap, RGBInputCallback);
        this.inputFactory('inputG', inputWrap, RGBInputCallback);
        this.inputFactory('inputB', inputWrap, RGBInputCallback);
        this.inputFactory('inputH', inputWrap, HSLInputCallback);
        this.inputFactory('inputS', inputWrap, HSLInputCallback);
        this.inputFactory('inputL', inputWrap, HSLInputCallback);
        this.pickerWrap.appendChild(inputWrap);
    };

    /*
    * 初始化输入框的值
    * */
    ColorPicker.prototype.initValue = function () {
        let {r, g, b} = this.HSL2RGB(this.h, this.s, this.l);
        this.r = r;
        this.g = g;
        this.b = b;
        this.setHSLValue();
        this.setRGBValue();
    };

    /*
    * 更新RGB的值到输入框
    * */
    ColorPicker.prototype.setRGBValue = function () {
        this['inputR'].value = this.r;
        this['inputG'].value = this.g;
        this['inputB'].value = this.b;
    };

    /*
    * 更新HSL的值到输入框
    * */
    ColorPicker.prototype.setHSLValue = function () {
        this['inputH'].value = this.h;
        this['inputS'].value = this.s;
        this['inputL'].value = this.l;
    };

    /*
    * 创建输入框的工厂方法
    * 包含输入框的事件绑定
    * */
    ColorPicker.prototype.inputFactory = function (inputName, container, callback) {
        //创建输入控件相关DOM
        let div = document.createElement('div');
        let label = document.createElement('label');
        //操作相关属性
        label.innerText = inputName.substr(inputName.length-1, 1)+'：';
        div.appendChild(label);
        this[inputName] = document.createElement('input');
        this[inputName].setAttribute('data-color-attr', inputName.substr(inputName.length-1, 1));
        this[inputName].type = 'number';
        this[inputName].min = 0;
        switch (inputName) {//设置number输入框的最大值
            case 'inputR':
            case 'inputG':
            case 'inputB':
                this[inputName].max = 255;//RGB最大值均为255
                break;
            case 'inputH':
                this[inputName].max = 359;//S最大值为359
                break;
            case 'inputS':
            case 'inputL':
                this[inputName].max = 100;//HL最大值为100
        }
        //输入框绑定事件，通过回调方法执行不同的操作
        this[inputName].addEventListener('blur', function (ev) {
            const that = this;
            callback.call(null, that);
        });
        this[inputName].addEventListener('change', function (ev) {
            const that = this;
            callback.call(null, that);
        });
        //添加到DOM中
        div.appendChild(this[inputName]);
        container.appendChild(div);
    };

    /*
    * 判断RGB的值是否合法
    * */
    ColorPicker.prototype.isValidRGBValue = function (value) {
        return (typeof value === "number" && isNaN(value) === false && value>=0 && value <=255);
    };

    /*
    * 通过RGB获取HEX色彩空间的值
    * */
    ColorPicker.prototype.getHexa = function (r = 0, g = 0, b = 0) {
        //转换为16进制字符串
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);
        //补齐0
        if (r < 16) r = '0' + r;
        if (g < 16) g = '0' + g;
        if (b < 16) b = '0' + b;
        let value = '#' + r + g + b;
        //转大写并返回
        return value.toUpperCase();
    };

    /*
    * 通过色相选择条，更新SL选择区域的背景颜色
    * */
    ColorPicker.prototype.setPickerBarRGBA = function (r=0, g=0, b=0, alpha=1) {
        if (!this.isValidRGBValue(r) || !this.isValidRGBValue(g) || !this.isValidRGBValue(b)) {
            return false;
        }
        this.pickerArea.style['background-color'] = `rgba(${r},${g},${b},${alpha})`;
    };

    /*
    * 将RGB色彩空间值转换为HSL色彩空间值
    * */
    ColorPicker.prototype.RGB2HSL = function (r, g, b) {
        let red	= r / 255,
            green = g / 255,
            blue = b / 255;

        let cmax = Math.max(red, green, blue),
            cmin = Math.min(red, green, blue),
            delta = cmax - cmin,
            hue = 0,
            saturation = 0,
            lightness = (cmax + cmin) / 2,
            X = (1 - Math.abs(2 * lightness - 1));

        if (delta) {
            if (cmax === red ) { hue = ((green - blue) / delta); }
            if (cmax === green ) { hue = 2 + (blue - red) / delta; }
            if (cmax === blue ) { hue = 4 + (red - green) / delta; }
            if (cmax) saturation = delta / X;
        }

        hue = 60 * hue | 0;
        if (hue < 0) {
            hue += 360;
        }
        saturation = (saturation * 100) | 0;
        lightness = (lightness * 100) | 0;
        return {hue, saturation, lightness};
    };

    /*
    * 将HSL色彩空间值转换为RGB色彩空间值
    * */
    ColorPicker.prototype.HSL2RGB = function (h = 0, s = 50, l = 50) {
        let sat = s / 100;
        let light = l / 100;
        let C = sat * (1 - Math.abs(2 * light - 1));
        let H = h / 60;
        let X = C * (1 - Math.abs(H % 2 - 1));
        let m = light - C/2;
        let precision = 255;

        C = (C + m) * precision | 0;
        X = (X + m) * precision | 0;
        m = m * precision | 0;

        if (H >= 0 && H < 1) {return {r:C, g:X, b:m};}
        if (H >= 1 && H < 2) {return {r:X, g:C, b:m};}
        if (H >= 2 && H < 3) {return {r:m, g:C, b:X};}
        if (H >= 3 && H < 4) {return {r:m, g:X, b:C};}
        if (H >= 4 && H < 5) {return {r:X, g:m, b:C};}
        if (H >= 5 && H < 6) {return {r:C, g:m, b:X};}
    };

    /*
    * 更具色相值获取SL选择区域应该设置的背景RGB值
    * */
    ColorPicker.prototype.getColorAreaBackground = function(h){
        return this.HSL2RGB(h, 100);
    };

    window.ColorPicker = ColorPicker;
})();

new ColorPicker();