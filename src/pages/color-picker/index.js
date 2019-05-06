import './index.less'

(function () {
    const ColorPicker = function (options) {
        var that = this;
        this.Hue = 0;
        this.Saturation = 50;
        this.Lightness = 50;
        this.optionsDefault = {
            el:document.body
        };
        this.options = Object.assign(that.optionsDefault, options);
        this.init();
    };

    ColorPicker.prototype.init = function () {
        this.createElem();
    };

    ColorPicker.prototype.createElem = function () {
        const that = this;

        const wrap = document.createElement('div');
        wrap.classList.add('color-picker-container');

        this.pickerArea = document.createElement('div');
        this.pickerArea.classList.add('color-picker-area');
        this.pickerArea.addEventListener('click', function (ev) {
            let s = that.Saturation = ev.offsetX / ev.target.clientWidth * 100;
            let l = that.Lightness = 100 - ev.offsetY / ev.target.clientHeight * 100;
            const res = that.HSL2RGB(that.Hue, that.Saturation, that.Lightness);
        });

        this.pickerBar = document.createElement('div');
        this.pickerBar.classList.add('color-picker-bar');
        this.pickerBar.addEventListener('click', function (ev) {
            let h = that.Hue = ev.offsetY / ev.target.clientHeight * 359;
            let {r, g, b} = that.getColorAreaBackground(h);
            that.setPickerBarRGBA(r, g, b);
        });

        wrap.appendChild(this.pickerArea);
        wrap.appendChild(this.pickerBar);

        this.options.el.appendChild(wrap);
    };

    ColorPicker.prototype.isValidRGBValue = function (value) {
        return (typeof value === "number" && isNaN(value) === false && value>=0 && value <=255);
    };

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

    ColorPicker.prototype.setPickerBarRGBA = function (r=0, g=0, b=0, alpha=1) {
        if (!this.isValidRGBValue(r) || !this.isValidRGBValue(g) || !this.isValidRGBValue(b)) {

        }
        this.pickerArea.style['background-color'] = `rgba(${r},${g},${b},${alpha})`
    };

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

    ColorPicker.prototype.getColorAreaBackground = function(h){
        return this.HSL2RGB(h, 100);
    };

    window.ColorPicker = ColorPicker;
})();

new ColorPicker();