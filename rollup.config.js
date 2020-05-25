import "es-expand"
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';


// 配置 ---------------------------------


/*
注意：
- rollup 默认翻用的不是 node 的模块解析算法，所以，rollup 找不到由 npm 安装的依赖（模块），所以 由 npm 安装的依赖也不被被要想构建进最终的输出包中；这样也起到了排除 node_modules 中模块的效果；排除模块的功能 由 external 选项指定
- @rollup/plugin-node-resolve 插件可让 rollup 用 node 的模块解析算法来查找模块；
*/

/*
共用的配置
*/

// 共用的 rollup 配置
const shareConf = {
	input: 'src/index.ts',
	external: getDependencieNames(pkg),  //移除 package.json 中所有的依赖包
	plugins: [
		// 使用node解析算法查找模块
		resolve({
			/*
			browser   类型: Boolean   默认值: false
			是否优先使用 `package.json` 中的 browser 字段来解析依赖包的入口文件；
			- 构建专门用于浏览器环境的包时，建义设置为 `browser:true`；
			- 构建专门用于node环境的包时，建义设置为 `browser:false` 或者 删除此选项；
			*/
			browser:true,
			/*
			extensions   类型: Array[...String]    默认值: ['.mjs', '.js', '.json', '.node']
			扩展文件名
			*/
			extensions:['.ts', '.mjs', '.js', '.json', '.node']
		}),
		commonjs(), // 将依赖的模块从 CommonJS 模块规范转换成 ES2015 模块规范
		typescript() // 将 TypeScript 转换为 JavaScript
	]
};



// 导出的 rollup 配置
export default [
	/*
	模块友好的构建
	特点：
	   - 仅只能以 js模块 的方式被引入
	   - 移除了 node_modules 中的所有依赖
	*/
	{
		...shareConf,
		output: [
			{ file: pkg.module || `dist/${removeScope(pkg.name)}.esm.js`, format: 'es' },  // ES module
			{ file: pkg.main || `dist/${removeScope(pkg.name)}.cjs.js`, format: 'cjs' }, // CommonJS
		]
	},


	/*
	兼容各种引入方式的构建
	特点：
	   - 可用 <script> 标签直接引入
	   - 也可用 AMD、CommonJS 的模块化方案引入；
	   - 将所有依赖都构建在了一起
	*/
	{
		...shareConf,
		external:undefined,   //不移除任何依赖
		output: {
			// 如果 pkg.browser 是字符串类型，则 file 为 pkg.browser，否则为 `<包名>.umd.js`
			file: typeof pkg.browser === "string" ? pkg.browser : `dist/${removeScope(pkg.name)}.umd.js`,
			format: 'umd',
			name: toHumpFormat(pkg.name)  //驼峰格式的 pkg.name
		}  // umd
	}
];











// 工具 ---------------------------------


/**
 * Remove the scope prefix for the package name
 * 去除包名的 scope 前缀
 *
 * @param  pkgName : string    name of the package 包的名字
 * @returns string  Return the name after removing the scope prefix  返回去除 scope 前缀后的名字
 */
function removeScope(pkgName) {return pkgName.replace(/@[^/]+\//,"")}


/**
 * convert the name of the package from a divider format to a hump format, and the scope prefix is automatically removed
 * 把包的名字从分隔线格式转换成驼峰格式，并且会自动去除 scope 前缀
 *
 * @param  pkgName : string    name of the package 包的名字
 * @param separators ?: string | Array<string>   optional; default: ["-","_"] ; separator or separator good array ["-","_"]； 可选；默认值：["-","_"] ；分隔符，或 包含多个分隔符的数组
 * @returns string  return hump format string  返回驼峰格式的字符串
 */
function toHumpFormat(pkgName, separators) {return removeScope(pkgName).toHumpFormat(separators)}


/**
 * 获取 package.json 中配置的指定依赖类型中的所有依赖的名字列表
 * Get a list of names for all dependencies in the specified dependency type configured in package.json
 * @param package:object  必选；package.json 中的配置对象； Configuration objects in package.json
 * @param depTypes?: string | string[]    可选；默认值：["dependencies","optionalDependencies","peerDependencies"]；依赖类型的名字 或者 名字数组；     Optional; default: ["dependencies","optionalDependencies","peerDependencies"];
 * @returns Array<string>  返回包含指定依赖类型中的所有依赖名字的数组； Returns an array of all dependent names in the specified dependency type
 */
function getDependencieNames(packageConf,depTypes){
	depTypes = depTypes ? (typeof depTypes === "string" ? [depTypes] : depTypes) : ["dependencies","optionalDependencies","peerDependencies"];
	return Object.keys(Object.assign({},...depTypes.map(depType=>packageConf[depType])));
}
