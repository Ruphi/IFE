/*
 *Created on 2018/5/5.
 *by fxp  
 */

import './css/index.css'
const san = require('san');

const MyApp = san.defineComponent({
    template:'<p>Hello {{name}}, Hello world!</p>',

    initData:function () {
        return {
            name: 'San'
        };
    }
});

const myApp = new MyApp();
myApp.attach(document.getElementById('root'));