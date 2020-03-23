/**
 * 通过把值转换成JSON字符来判断是否相等
 * @param value1 : any
 * @param value2 : any
 * @returns boolean
 *
 *
 * 注意：
 * - 方法能用于判断对象的内容是否相等，相等的条件是：这2个对象拥有相同的属性 和 属性值，且属性及属性的属性 的添加顺序是一致的；即：当两个对象的拥有相同的属性和属性值时，如果属性的定义的顺序不同，该方法会返回 false；
 * - 该方法依赖于 JSON.stringify() 的逻辑；
 */
export function isEqualOfJSON(value1, value2) {
  return JSON.stringify(value1) == JSON.stringify(value2);
}




  //遍历优化：开始


/**
 * multipleLoop(option)=> stopLoop()
 * 多次遍历、分批循环；可以把一个大遍历分成若干个小遍历来完成；
 * @param option : {loopCall,complete,stepComplete,thisValue,total,step,delay}   选项对象
 * @property option.loopCall : (index,stepCount,total)=>stopInfo : any  必选；每次循环的回调函数；入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 total: number 循环的总数； 返回 stopInfo : any 停止循环并返回停止相关的信息；
 * @property option.stepComplete ？ : (index,stepCount,total)=>stopInfo : any  可选；每批循环完成时的回调函数；入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 total: number 循环的总数； 返回 stopInfo : any 停止循环并返回停止相关的信息；
 * @property option.complete ？: (stopInfo,index,stepCount,total)=>Void  可选；循环结束时的回调函数； 入参 stopInfo : any 停止循环遍历时停止信息；入参  index : number  表示最后一次循环的 index，如果值为-1 表示没有进行过循环值终止了；入参 stepCount : number  表示已经遍历的批数、周期数；入参 total: number 循环的总数；
 * @property option.thisValue ? : any   loopCall、complete、stepComplete 回调函数的this的值；
 * @property option.total ? : number   可选；默认值：无穷大 Number.POSITIVE_INFINITY ; 设置总数循环次数；
 * @property option.step ? : number    可选； 默认值： 50 ； 设置每次遍历的循环次数；
 * @property option.delay ? : Timestamp   可选；默认值 ：0 ； 设置再次遍历的间隔时间；
 * @returns stopLoop : (stopInfo)=>Void    停止循环的函数；调用该函数，会终止正在进行的循环； 入参 stopInfo : any 停止循环的相关信息
 */


export function multipleLoop({loopCall,complete,stepComplete,thisValue,total=Number.POSITIVE_INFINITY,step = 50,delay = 0}) {


  let index = 0;
  let stepCount = 0;   //已经完成了多少批遍历


  /**
   * 设置是否要停止循环；
   *
   * 之所以通过函数来设置，而不是直接给stop变量赋值，是因为：
   * - 确定 结束循环时 只调用一次  complete ；
   */
  let stop = false;    //停止循环的开关；表示是否终止循环；
  function setStop(newValue){
    if (newValue){
      stop = newValue;

      if (complete) {
        complete.call(thisValue,stop,index,stepCount,total);
      }
    }
  }


  /**
   * 是否需要循环；
   * @returns boolean
   *
   * 之所以定义成函数形式，而不定义成变量，是因为：
   * - 减少代码冗余；
   * - 确定 结束循环时 只调用一次  complete ；
   */
  function loop(){
    let needLoop = index < total;

    if (!needLoop && complete) {
      complete.call(thisValue,false,index-1,stepCount,total);
    }
    return needLoop
  }


  let timeoutId = null;






  /**
   * 自调用单次循环
   */
  function atuoSingleLoop() {
    stepCount++;

    let singleTotal = Math.min(index + step,total);

    function singleLoop(){return index < singleTotal}

    while (singleLoop() && !stop){
      setStop(loopCall.call(thisValue,index,stepCount,total));
      index++;
    }

    if (stepComplete){
      setStop(stepComplete.call(thisValue,index-1,stepCount,total));
    }


    if (loop() && !stop){
      timeoutId = setTimeout(atuoSingleLoop,delay);
    }
  }


  /**
   * 停止循环
   */
  function stopLoop(stopInfo) {
    if (!stopInfo){
      stopInfo = true;
    }

    clearTimeout(timeoutId);
    setStop(stopInfo);
  }



  if (loop()){ //开始循环
    atuoSingleLoop();
  }


  return stopLoop;
};


let arrayPropertyDescriptors = {


  /**
   * multipleLoop(option)=> stopLoop()
   * 多次遍历、分批循环；可以把一个大遍历分成若干个小遍历来完成；
   * @param option : {loopCall,complete,stepComplete,thisValue,step,delay}   选项对象
   * @property option.loopCall : (currentValue,index,stepCount,arr)=>stopInfo : any  必选；每次循环的回调函数；入参 currentValue : Item  当前index对应数组元素； 入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 arr:Array 当前被循环的数组； 返回 stopInfo : any 停止循环并返回停止相关的信息；
   * @property option.stepComplete ？ : (index,stepCount,arr)=>stopInfo : any  可选；每批循环完成时的回调函数；入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 arr: Array 被循环的数组，即当前数组； 返回 stopInfo : any 停止循环并返回停止相关的信息；
   * @property option.complete ？: (stopInfo,index,stepCount,arr)=>Void  可选；循环结束时的回调函数；入参 stopInfo : any 停止循环遍历时停止信息；入参  index : number  表示最后一次循环的 index，如果值为-1 表示没有进行过循环值终止了；入参 stepCount : number  表示已经遍历的批数、周期数；入参 arr: Array 被循环的数组，即当前数组；
   * @property option.thisValue ? : any   可选；默认值：当前数组； loopCall、complete、stepComplete  回调函数的this的值；
   * @property option.step ? : number    可选； 默认值： 50 ； 设置每次遍历的循环次数；
   * @property option.delay ? : Timestamp   可选；默认值 ：0 ； 设置再次遍历的间隔时间；
   * @returns stopLoop : (stopInfo)=>Void    停止循环的函数；调用该函数，会终止正在进行的循环； 入参 stopInfo : any 停止循环的相关信息
   */
  multipleLoop: {
    enumerable: false,
    value: function ({loopCall,complete,stepComplete,thisValue,step,delay}) {

      if (thisValue){
        thisValue = this;
      }

      let loopOpt = {
        loopCall:(index,stepCount,total)=> {
          return loopCall.call(thisValue,this[index],index,stepCount,this);
        },
        total:this.length,
        step:step,
        delay:delay
      };

      if (complete){
        loopOpt.complete = (stopInfo,index,stepCount,total)=>{
          return complete.call(thisValue,stopInfo,index,stepCount,this);
        };
      }

      if (stepComplete){
        loopOpt.stepComplete = (index,stepCount,total)=>{
          return stepComplete.call(thisValue,index,stepCount,this);
        };
      }


      return multipleLoop(loopOpt);
    }
  }

};

  Object.defineProperties(Array.prototype, arrayPropertyDescriptors);



  //遍历优化：结束






/**
 * safelyIterate(iterable,operation, thisValue)
 * 对 iterable  进行安全的迭代；与 for...of 的区别是：safelyIterate 能保证会迭代过程不会受 operation 中的行为的影响从而迭代每一个元素；
 * @param iterable : Iterable   必选； 可迭代的对象；
 * @param operation : (currentValue,currentIndex,iterable)=>boolean | undefined     执行的操作， 该函数的返回值表示是否要过滤出该元素
 * @param thisValue ? : any   可选，默认值是 iterable ；操作 operation 的 this 值
 * @returns [Item]  返回被 operation 过滤出的元素
 *
 *
 * operation(currentValue,currentIndex,iterable)=>boolean | undefined
 * @param currentValue : any   调用 operation 时的元素的值；
 * @param currentIndex : number     currentValue 在原始 iterable 中 对应的迭代索引值；
 * @param iterable : Iterable   被迭代的 iterable ；
 * @returns boolean | undefined  表示是否要过滤出 currentValue ；
 *
 */
export function safelyIterate(iterable,operation, thisValue) {

  if (thisValue == undefined) {
    thisValue = iterable;
  }

  let arrayCopy = [];

  for (let value of iterable){
    arrayCopy.push(value);
  }

  let filterItem = arrayCopy.filter(function (currentValue) {
    let currentIndex = this.indexOf(currentValue);
    operation.call(thisValue, currentValue, currentIndex, iterable);
  },arrayCopy);


  return filterItem;

};






//类型：开始


/**
 * 获取 inst 的类型
 * @param inst : any
 * @returns Type    inst 的类型
 *
 *
 *
 * 注意：
 * 本方法返回的结果如下：
 * undefined ：undefined
 * null ： null
 * 其它任何类型的实例  : 返回该实例的构造函数  或 包装对象的构造函数
 *
 */
export function getTypeOf(inst) {
  var typeInfo = inst;
  if (inst != null){
    typeInfo = inst.constructor;
  }

  return typeInfo;

}





/**
 * 获取 inst 的类型字符串
 * @param inst : any
 * @returns string    inst 的类型字符串
 *
 *
 *
 * 注意：
 * 本方法返回的结果如下：
 * undefined ："undefined"
 * null ： "null"
 * 其它任何类型的实例  : 返回该实例的构造函数  或 包装对象的构造函数 的函数名字
 *
 */
export function getTypeStringOf(inst) {

  switch (inst){
    case undefined:{
      var typeStr = "undefined";
      break;
    }

    case null:{
      typeStr = "null";
      break;
    }

    default:{
      typeStr = inst.constructor.name;
    }
  }

  return typeStr;

};



//类型：结束































/**
 * 定义可监听的属性
 *
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param prop : string   必选；要定义的属性的名称。
 * @param options ?: {ready ?:string,noEvent ?:boolean,event ?:string,newValueKey ?:string,oldValueKey ?:string,getDefault ?:(thisValue)=>PropValue}     可选；配置选项；各个选项的说明如下；
 * @property  ready ?:string    可选；默认值：prop + "Ready" ；ready属性的属性名字；
 * @property  noEvent ?:boolean    可选；默认值：false ；是否要给 prop 属性增加值变更事件；
 * @property  event ?:string    可选；默认值：prop +  "Change" ；prop变更事件的名字；
 * @property  newValueKey ?:string    可选；默认值："value" ；prop变更事件的事件对象中保存新值的属性名字；
 * @property  oldValueKey ?:string    可选；默认值："oldValue" ；prop变更事件的事件对象中保存旧值的属性名字；
 * @property  getDefault ?:(thisValue)=>PropValue    可选；在获取 prop 属性的值时，如果 prop 属性的值不存在 ，则会通过 该函数获取默认的值；
 *
 *
 * @returns obj : Object  被传递给函数的对象。
 */
export function defineListenableProperty(obj,prop,options){
  let {ready:readyName = prop + "Ready",noEvent,event:eventName = prop +  "Change",newValueKey = "value",oldValueKey = "oldValue",getDefault} = options || {};
  let priReadyName = "_" + readyName;
  let priProp = "_" + prop;



  /**
   * 给 obj 定义 ready 计算属性 ，用于获取客户端的准备状态的promise ，当访问 ready 时，如果 ready 不存在，则会自动创建
   */
  Object.defineProperty(obj, readyName, {
    configurable:true,
    enumerable:true,
    get: function () {
      let _this = this || window;
      if (!_this[priReadyName]) {
        let propValue = _this[priProp];
        if (propValue){
          _this[priReadyName] = Promise.resolve(propValue);
        }else {
          _this[priReadyName] = createControllablePromise();
        }

      }
      return _this[priReadyName];
    },
    set:function (newValue) {
      let _this = this || window;
      _this[priReadyName] = newValue;
    }
  });



  //创建 prop 的 get 方法
  if (getDefault){

    var propGetter = function () {
      let _this = this || window;
      if (!_this[priProp] && getDefault) {
        _this[prop] = getDefault.call(_this,_this);
      }
      return _this[priProp];
    }

  }else {

    propGetter = function () {
      let _this = this || window;
      return _this[priProp];
    }

  }


  //创建 prop 的 set 方法

  if (noEvent){


    var propSetter =  function (newValue) {
      let _this = this || window;
      if (newValue && newValue !== _this[priProp]) {


        let oldValue = _this[priProp];
        _this[priProp] = newValue;

        let httpReady = _this[readyName];
        if (httpReady.resolve) {
          httpReady.resolve(newValue);
        }else {
          _this[readyName] = Promise.resolve(newValue);
        }

      }
    }

  }else {


    propSetter =  function (newValue) {
      let _this = this || window;
      if (newValue && newValue !== _this[priProp]) {


        let oldValue = _this[priProp];
        _this[priProp] = newValue;

        let httpReady = _this[readyName];
        if (httpReady.resolve) {
          httpReady.resolve(newValue);
        }else {
          _this[readyName] = Promise.resolve(newValue);
        }

        //派发 change 事件
        let change = new Event(eventName, {"bubbles": true});
        change[newValueKey] = newValue;
        change[oldValueKey] = oldValue;
        window.dispatchEvent(change);


      }
    }

  }





  /**
   * 给 obj 对象 添加计算属性 prop ，用以获取 prop
   *
   * 注意：
   * 当 prop 的值变更时，会在 window 上触发该属性的 change 事件
   * 通过事件的 event[newValueKey] 可能获取改变后的新值
   * 通过事件的 event[oldValueKey] 可能获取改变前的旧值
   */
  Object.defineProperty(obj, prop, {
    configurable:true,
    enumerable:true,
    get: propGetter,
    set: propSetter
  });


  return obj;
}





/**
 * 批量定义可监听的属性
 *
 * 接口1：defineListenableProperties(obj,propOptions)
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param propOptions : {propName:options}   必选；要定义的属性的配置对象；以该配置对象的属性属性为 要配置的属性的名字，以其值为 本配置的属性的 配置选项
 * @returns obj : Object  被传递给函数的对象。
 *
 *
 * 接口2：defineListenableProperties(obj,propArray,options)
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param propArray : [string]   必选；要在其上定义的属性的名字列表。
 * @param options ?: {ready ?:string,noEvent ?:boolean,event ?:string,newValueKey ?:string,oldValueKey ?:string,getDefault ?:(thisValue)=>PropValue}     可选；配置选项；各个选项的说明如下；
 *
 * @returns obj : Object  被传递给函数的对象。
 */
export function defineListenableProperties(obj,props,options){

  var propsObj = props;
  if (Array.isArray(props)) {
    propsObj = props.reduce(function (total,propName) {
      total[propName] = options;
      return total;
    },{});
  }


  Object.keys(propsObj).forEach(function (propName) {
    let propOpts = propsObj[propName];
    defineListenableProperty(obj,propName,propOpts);
  });

  return obj;
}


/**
 * defineListenablePropertyGetter(obj, prop, getDefault, asGetter)
 * 定义可监听属性的 getter ； 该方法一般经常用于：一些可监听属性在被定义时，还不能定义 getDefault 选项，只能在稍后某个时刻定义 getDefault 选项，此时便可用此函数来简化重新定义 getter 的操作；
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param prop : string   必选；要定义的属性的名称。
 * @param  getDefault ?:(thisValue)=>PropValue    可选；在获取 prop 属性的值时，如果 prop 属性的值不存在 ，则会通过 该函数获取默认的值；
 * @param asGetter ?: boolean    可选；是否将 getDefault 作为 getter
 */
export function defineListenablePropertyGetter(obj, prop, getDefault, asGetter) {

  let priProp = "_" + prop;

  if (asGetter) {
    var propGetter = getDefault;
  } else if (getDefault) {

    propGetter = function () {
      let _this = this || window;
      if (!_this[priProp] && getDefault) {
        _this[prop] = getDefault.call(_this, _this);
      }
      return _this[priProp];
    }

  } else {

    propGetter = function () {
      let _this = this || window;
      return _this[priProp];
    }

  }


  Object.defineProperty(obj, prop, {
    configurable:true,
    enumerable:true,
    get: propGetter
  });
}


/**
 * 生成唯一的标识符
 * @returns {string}
 */
export function createUniqueIdentifier() {
  var currentDate = new Date();
  return currentDate.getTime().toString() + Math.random();
}


/**
 * 加载脚本文件
 * @param scriptProps : src | ScriptPropObj   脚本元素的 src 属性值，或脚本元素的属性配置对象
 * @return {HTMLScriptElement}
 */
export function loadScript(scriptProps) {
  if (typeof scriptProps != "object"){
    scriptProps = {src:scriptProps};
  }

  var {src,...otherPross} = scriptProps;
  var scriptEle = document.createElement("script");
  Object.assign(scriptEle,otherPross);
  scriptEle.src = src;
  document.body.appendChild(scriptEle);
  return scriptEle;
}






/**
 * prohibitWindowHeightChangeWhenInput(cancel)
 * 禁止当弹出键盘时 winodw 窗口改变高度
 * @param cancel ?: boolean    可选；默认值：false；表示是否要 取消 之前禁止
 */
export function prohibitWindowHeightChangeWhenInput(cancel) {

  if (cancel){

    var focusinHandler = prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__;
    if (focusinHandler){
      document.removeEventListener("focusin",focusinHandler);
      prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = null;
    }


    var focusoutHandler = prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__;
    if (focusoutHandler){
      document.removeEventListener("focusin",focusoutHandler);
      prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = null;
    }

    return;
  }

  // focusin 事件处理器
  prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = function __prohibitWindowHeightChangeWhenInput_Focusin_Handler__(event) {
    var htmlDom = document.documentElement;
    var htmlStyle = htmlDom.style;
    var bodyDom = document.body;
    var bodyStyle = bodyDom.style;

    //保存原始样式；
    prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ = {
      html:htmlStyle.height,
      body:bodyStyle.height
    };

    //设置html和body的高度为窗口变化前的空度
    var compStyleOfHtml = window.getComputedStyle(htmlDom);
    htmlStyle.height = compStyleOfHtml.height;
    var compStyleOfBody = window.getComputedStyle(bodyDom);
    bodyStyle.height = compStyleOfBody.height;
  };

  //把事件加到 document 是为加快事件的处理速度
  //添加 focusin 事件处理器
  document.addEventListener("focusin",prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__);





  // focusout 事件处理器
  prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__ = function __prohibitWindowHeightChangeWhenInput_Focusout_Handler__(event) {
    //还原html 和 body 的原始高度
    var oriHeightStyle = prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ || {html: null,body: null} ;

    document.documentElement.style.height = oriHeightStyle.html;
    document.body.style.height = oriHeightStyle.body;

    prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ = null;
  };

  //添加 focusout 事件处理器
  document.addEventListener("focusout",prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__);


}
