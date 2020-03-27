export as namespace by;



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
export function isEqualOfJSON(value1:any, value2:any):boolean;






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


export function multipleLoop<StopInfo,ThisValue>(mLoopOpts:{
    loopCall:(this:ThisValue,index:number,stepCount:number,total:number)=>StopInfo,
    complete ?: (this:ThisValue,stopInfo:StopInfo,index:number,stepCount:number,total:number)=>void,
    stepComplete ?: (this:ThisValue,index:number,stepCount:number,total:number)=>StopInfo,
    thisValue?:ThisValue,
    total?:number,
    step?:number,
    delay?:number
}):(stopInfo?:StopInfo)=>void; 



declare global {

    interface Array<T> {

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
  multipleLoop<StopInfo,ThisValue>(mLoopOpts:{
    loopCall:(this:ThisValue,index:number,stepCount:number,total:number)=>StopInfo,
    complete ?: (this:ThisValue,stopInfo:StopInfo,index:number,stepCount:number,total:number)=>void,
    stepComplete ?: (this:ThisValue,index:number,stepCount:number,total:number)=>StopInfo,
    thisValue?:ThisValue,
    step?:number,
    delay?:number
}):(stopInfo?:StopInfo)=>void; 

    }

}

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
export function safelyIterate<T,ThisValue>(iterable:Iterable<T>,operation:(this:ThisValue,currentValue:T,currentIndex:number,iterable:Iterable<T>)=>any, thisValue?:ThisValue):T[];










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
export function getTypeOf<T>(inst:T):T;







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
export function getTypeStringOf(inst:any):string;



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


 type ListenablePropOpts<T> = {
    ready ?:string,
    noEvent ?:boolean,
    event ?:string,
    newValueKey ?:string,
    oldValueKey ?:string,
    getDefault ?:(this:T,thisValue:T)=>any
};


export function defineListenableProperty<T extends object>(obj:T,prop:string,options?:ListenablePropOpts<T>):T;








/* 
 * 批量定义可监听的属性
 * 接口1：defineListenableProperties(obj,propArray,options)
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param propArray : [string]   必选；要在其上定义的属性的名字列表。
 * @param options ?: {ready ?:string,noEvent ?:boolean,event ?:string,newValueKey ?:string,oldValueKey ?:string,getDefault ?:(thisValue)=>PropValue}     可选；配置选项；各个选项的说明如下；
 *
 * @returns obj : Object  被传递给函数的对象。
*/
export function defineListenableProperties<T extends object>(obj:T,propArray:string[],options?:ListenablePropOpts<T>):T;




/**
 * 接口2：defineListenableProperties(obj,propsOptions)
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param propsOptions : {propName:options}   必选；要定义的属性的配置对象；以该配置对象的属性属性为 要配置的属性的名字，以其值为 本配置的属性的 配置选项
 * @returns obj : Object  被传递给函数的对象。
 *
 */
export function defineListenableProperties<T extends object>(obj:T,propsOptions:{[prop:string]:ListenablePropOpts<T>}):T;




/**
 * defineListenablePropertyGetter(obj, prop, getDefault, asGetter)
 * 定义可监听属性的 getter ； 该方法一般经常用于：一些可监听属性在被定义时，还不能定义 getDefault 选项，只能在稍后某个时刻定义 getDefault 选项，此时便可用此函数来简化重新定义 getter 的操作；
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param prop : string   必选；要定义的属性的名称。
 * @param  getDefault ?:(thisValue)=>PropValue    可选；在获取 prop 属性的值时，如果 prop 属性的值不存在 ，则会通过 该函数获取默认的值；
 * @param asGetter ?: boolean    可选；是否将 getDefault 作为 getter
 */
export function defineListenablePropertyGetter<T extends object>(obj:T, prop:string, getDefault?:(this:T,thisValue:T)=>any, asGetter?:boolean):void;






/**
 * 生成唯一的标识符
 * @returns {string}
 */
export function createUniqueIdentifier():string;





/**
 * 加载脚本文件
 * @param scriptProps : src | ScriptPropObj   脚本元素的 src 属性值，或脚本元素的属性配置对象
 * @return {HTMLScriptElement}
 */
export function loadScript(scriptProps:string | object):HTMLScriptElement;









/**
 * prohibitWindowHeightChangeWhenInput(cancel)
 * 禁止当弹出键盘时 winodw 窗口改变高度
 * @param cancel ?: boolean    可选；默认值：false；表示是否要 取消 之前禁止
 */
export function prohibitWindowHeightChangeWhenInput(cancel?:boolean):void;