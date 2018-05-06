/*
 *Created on 2018/5/5.
 *by fxp  
 */

/*
* 引用样式，导入san
* */
import './css/index.css';
import san, {DataTypes} from 'san';


/*
* 创建和初始化helloSan组件
* */
let HelloSan = san.defineComponent({
    //模板
    template:'<p>Hello {{name}}, Hello world!</p>',

    //初始化数据
    initData:function () {
        return {
            name: 'San'
        };
    }
});
//初始化helloSan
let helloSan = new HelloSan();
helloSan.attach(document.getElementById('hello-san'));


/*
* 创建和初始化dataControl组件
* */
let DataControl = san.defineComponent({
    //定义模板
    template:''+
        '<div>'+
        '<div class="input-group">' +
        '   <input type="text" value="{=name=}" placeholder="姓名（string）"/>'+
        '   <input type="text" value="{=age=}" placeholder="年龄（number）"/>'+
        '   <input type="text" value="{=introduction=}" placeholder="简介（string）"/>'+
        '</div>'+
        '<div class="message">' +
        '   <div><span>信息：</span><button type="button" on-click="removeMsg">移除信息</button></div>'+
        '   <ul>' +
        '       <li><span>姓名：</span><span class="msg-specific">{{name}}</span></li>'+
        '       <li><span>年龄：</span><span class="msg-specific">{{age}}</span></li>'+
        '       <li><span>简介：</span><span class="msg-specific">{{introduction}}</span></li>'+
        '   </ul>'+
        '</div>'+
        '</div>',
    //数据校验
    dataTypes:{
        name: DataTypes.string,
        age:DataTypes.number,
        introduction:DataTypes.string
    },
    //初始化数据（信息）
    initData:function () {
        return {
            name:'',
            age:null,
            introduction:''
        }
    },
    //移除信息
    removeMsg:function () {
        this.data.set('name', '');
        this.data.set('age',null);
        this.data.set('introduction', '');
    }
});
//初始化dataControl
let dataControl = new DataControl();
dataControl.attach(document.getElementById('data-control'));