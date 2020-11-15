let sngolib =  (function(){
    let ruledata = {
        checktype:{
            email(str){
                return /([\w]+)@[\w]+(\.[\w]+)+$/.test(str);
            },
            mobile(str){
                return /^(130|131|132|133|134|135|136|137|138|139|150|151|152|153|155|156|157|158|159|180|186|187|188|189)\d{8}$/.test(str);
            },
            tel(str){
                return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
            },
            number(str){
                return /^[0-9]$/.test(str);
            },
            chara(str){
                return /^[a-zA-Z]$/.tset(str);
            },
            text(str){
                return /^\w+$/.test(str);
            },
            chinese(str){
                return /^[\u4E00-\u9FA5]+$/.test(str);
            },
            lower(str){
                return /^[a-z]+$/.test(str);
            },
            upper(str){
                return /^[A-Z]+$/.test(str);
            }

        }
    }

    function checkValue(val,vals){
        let _val = val;
        if (Number,isNaN(val)){
            _val = 'NaN'; 
        }
        return (vals.indexOf(_val) !== -1); 
    }

    return {
        /**
         * @description 扩展函数配置
         */
        extend:{
            checkType(type, fn){
                ruledata.checktype[type] = fn;
            },
            filterStr(type, fn){

            }
        },
        /**
         * @description 批处理函数
         */
        handle(){
            let result = [],
                _arguments = [...arguments];
            let fnName = _arguments.shift();
            let arr = _arguments.shift();
            for (item of arr){
                _arguments.unshift(item);
                result.push(this[fnName].apply(this, _arguments));
                _arguments.shift();
            }
            return result;
        },
        //****************字符串处理模块****************/
        
        /**
         * !@description 清除左右空格
         */
        trim(str){
            return str.replace(/(^\s*)|(\s*$)/g,"");
        },
        /**
         * @description 清除所有空格
         */
        trimAll(str){
            return str.replace(/\s+/g,"");
        },
        /**
         * @description 清除左空格
         */
        trimLeft(str){
            return str.replace(/^\s+/g,"");
        },
        /**
         * @description 清除右边空格
         */
        trimRight(str){
            return str.replace(/\w+$/g,"")
        },
        /**
         * @description 大小写切换
         */
        toggleCase(str){
            let itemtext = "";
            str.split("").forEach(item => {
                if (/^[a-z]+/.test(str)){
                    itemtext += item.toUpperCase();
                }else if(/^[A-Z]+/.test(str)){
                    itemtext += item.toLowerCase();
                }else {
                    itemtext += item;
                }
            });
        },

        /**
         * @description 首字母大写
         */
        firstWordUpper(str){
            return str.replace(/\b\w+\b/g,word => word.substring(0,1).tpUpperCase() + word.substring(1));
        },
        /**
         * @description 首字母小写
         */
        firstWordLower(str){
            return str.replace(/\b\w+\b/g, word => word.substring(0,1).toLowerCase() + word.substring(1));
        },
        /**
         * @description 加密字符串（任意格式适配）
         */
        encrypt(str,reg,repText = "*"){
            let result = [...str];
            let _regIndex = '';
            let regIndex = reg.constructor === Array?reg:[reg];
            for (let item of regIndex){
                _regIndex = item.indexOf(',') === -1?'0,'+item:item;
                _regIndex = _regIndex.split(',');
                _regIndex[1] = _regIndex[1]||result.length-1;
                result=item.indexOf('-')===-1?result:result.reverse();
                _regIndex = _regIndex.map(item => Math.abs(+item));
                for (let i=0;i<result.length;i++){
                    if (i>=_regIndex[0] && i<=_regIndex[1]){
                        result[i] = repText;
                    }
                }
                result = _regIndex.indexOf('-')?result:result.reverse();

            }
            return result.join('');
        },

        /**
         * @description 加密字符串（加密中间部分）
         * @param {*} str 
         */
        encryptStr(str,regIndex,repText = '*'){
            let regText = '',
                Reg = null,
                _regIndex = regIndex.split(',');
                replaceText = repText;
            _regIndex = _regIndex.map(item => +item);
            regText = '(\\w{' + _regIndex[0] + '})\\w{' + (1 + _regIndex[1] - _regIndex[0]) + '}';
            Reg = new RegExp(regText);
            let replaceCount = replaceText.repeat((1 + _regIndex[1] - _regIndex[0]));
            return str.replace(Reg, '$1' + replaceCount);
        },


        /**
         * @description 反向加密字符串（从两边加密）
         */
        encryptUnstr(str,regIndex,repText = '*'){
            let regText = '',
                Reg = null,
                _regIndex = regIndex.split(',');
                replaceText = repText;
            _regIndex = _regIndex.map(item => +item);
             regText = '(\\w{' + _regIndex[0] + '})(\\w{' + (1 + _regIndex[1] - _regIndex[0]) + '})(\\w{' + (str.length - 1 - _regIndex[1]) + '})';
            replaceCount1 = replaceText.repeat(_regIndex[0]);
            replaceCount2 = replaceText.repeat(str.length - 1 - _regIndex[1]);
            regText = new RegExp(regText);
            return str.replace(regText , replaceCount1 + '$2' + replaceCount2);
        },

        /**
         * @description 字符串开始位置加密
         */
        encryptStartStr(str,regIndex,repText = '*'){
            return this.encrypt(str ,'0,'+regIndex ,repText);
        },

        /**
         * @description 字符串结束位置开始加密
         */
        encryptEndStr(str ,regIndex ,repText){
            return this.encryptStartStr(str.split('').reverse().join('') ,'0,'+regIndex ,repText).split('').reverse().join('');
        },
        /**
         * @description 检测格式
         */
        checkType(){
            return !!ruledata.checktype[type](str);
        },

        /**
         * @description 检测密码强度
         */
        checkPwdLevel(str,rules = [/[A-Z]+/ ,/[a-z]+/ ,/[0-9]+/ ,/\.|-|_/]){
            let level = 0;
            for (let item of rules){
                if (item.test(str)){
                    level++;
                }
            }
            return level;
        },
        /**
         * @description 生成随机码
         * @param {*} count 
         */
        randomStr(count = 36){
            return Math.random().toString(count).substring(2);
        },
        /**
         * @description 统计指定字符串出现的频率
         * @param {*} str 
         * @param {*} strIndex 
         */
        countStr(str,strIndex){
            return str.split(strIndex).length - 1;
        },

        /**
         * @description 过滤字符串中指定字符串
         */
        filterStr(str ,type ,replaceStr = ''){
            let arr = [].slice.call(arguments);
            let fnName = 'filter' + this.firstWordUpper(type);
            arr.splice(1,1);
            return this[fnName] ? this[fnName].method.apply(null, arr) : false;
        },

        /**
         * @description 保留源字符串中的数字，字母及空格，且保留指定特殊字符串，其余过滤
         * @param {*} str 
         * @param {*} replaceStr 
         * @param {*} repText 
         */
        unfilterSpecialStr(str ,replaceStr = '', repText){
            let regText = '$()[]{}\|^*+./\"\'+',
                pattern,
                _regText = "[^A-Za-z0-9\\s",
                nowStr;
            if (repText){
                for (let item of repText){
                    nowStr = '';
                    if (regText.indexOf(item) == -1){
                        nowStr = '\\'
                    }
                    _regText += nowStr + item;
                }
                 _regText += ']';
            }
            else {
                _regText += ']';
            }
            pattern = new RegExp(_regText, 'g' );
            return str = str.replace(pattern, replaceStr);
        },

        /**
         * @description 过滤字符串中的特殊字符串
         */
        filterSpecialStr(str, replaceStr = '', repText){
            let _regText = '',
                pattern;
            if (repText){
                _regText += '['
                for (let item of repText){
                    _regText += ('\\' + item + '|');
                }
                _regText.substring(0, _regText.length - 1);
                _regText += ']'
            }
            pattern = new RegExp(_regText, 'g');
            return str = str.replace(pattern, replaceStr);
        },
        /**
         * @description 过滤HTML标签
         * @param {*} str 
         * @param {*} replaceStr 
         */
        filterHtml(str, replaceStr = ''){
            return str.replace(/<\?[^>]*>/g, replaceStr);
        },

        /**
         * @description 过滤表情
         * @param {*} str 
         * @param {*} replaceStr 
         */
        filterEmjoy(str, replaceStr = ''){
             return str.replace(/[^\u4e00-\u9fa5|\u0000-\u00ff|\u3002|\uFF1F|\uFF01|\uff0c|\u3001|\uff1b|\uff1a|\u3008-\u300f|\u2018|\u2019|\u201c|\u201d|\uff08|\uff09|\u2014|\u2026|\u2013|\uff0e]/ig, replaceStr);
        },

        /**
         * @description 过滤大写字母
         */
        filterWordUpper(str, replaceStr = ''){
            return str.replace(/[A-Z]+/g, replaceStr);
        },


        /**
         * @description 过滤小写字母
         * @param {*} str 
         * @param {*} replaceStr 
         */
        filterWordLower(str, replaceStr = ''){
            return str.replace(/[a-z]+/g, replaceStr);
        },

        /**
         * @description 过滤数字
         * @param {*} str 
         * @param {*} replaceStr 
         */
        filterNumber(str, replaceStr = ''){
            return str.replace(/[0-9]+/g, replaceStr);
        },

        /**
         * @description 过滤汉字
         * @param {*} str 
         * @param {*} replaceStr 
         */
        filterChinese(str, replaceStr = ''){
            return str.replace(/[\u4E00-\u9FA5]+/g, replaceStr);
        },

        /**
         * @description 格式化字符串
         * @param {*} str 
         * @param {*} size 
         * @param {*} delimiter 
         */
        formatText(str, size = 3, delimiter = ','){
            let regText = '\B(?=(\\w{' + size + '})+(?!\\w))';
            let pattern = new RegExp(regText, 'g');
            return str.replace( pattern, delimiter);
        },

        /**
         * @description 句中单词首字母大写
         * @param {*} str 
         * @param {*} splitType 
         */
        longestWord(str, splitType = /\s+/g){
            let _max = 0,
                _item = null;
            let arr = str.split(splitType);
            for (let item of arr){
                if (item.length > _max){
                    _max = item.length;
                    _item = item;               
                }
            }
            return {el: _item, max: _max};
        },

        /**
         * @description 句中首字母大写
         * @param {*} str 
         * @param {*} splitType 
         */
        titleCaseUp(str, splitType = /\s+/){
            let arr = str.split(splitType),
                result = "";
            for (let item of arr){
                result += this.firstWordUpper(item) + ' ';
            }
            return this.trimRight(result);
        },

        /******************数组模块********************/
        /**
         * @description 数组去重
         * @param {*} arr 
         */
        unique(arr){
            return [...new Set(arr)];
        },

        /**
         * @description 数组顺序打乱 
         */
        upset(arr){
            for (let i=0; i<arr.length; i++ ){
                let a = Math.random()*arr.length;
                let b = Math.random()*arr.length;
                let _item = arr[a];
                arr[a] = arr[b];
                arr[b] = _item;
            }
            return arr;
        },


        /**
         * @description 求数组最大值
         * @param {*} arr 
         */
        max(arr){
            return Math.max(...arr);
        },

        /**
         * @description 求数组最小值
         * @param {*} arr 
         */
        min(arr){
            return Math.min(...arr);
        },

        /**
         * @description 数组求和
         * @param {*} arr 
         */
        sum(arr){
            return arr.reduce((sum, cur) => sum + cur);
        },

        /**
         * @description 数组求平均数
         * @param {*} arr 
         */
        average(arr){
            return this.sum(arr) / arr.length;
        },

        /**
         * @description 深拷贝
         * @param {*} obj 
         */
        clone(obj){
            const root = {};

            const loopList = [{
                parent: root,
                key: undefined,
                data: obj,

            }];

            while (loopList.length){
                let node = loopList.pop();
                let par = node.parent;
                let k = node.key;
                let dat = node.data;

                res = par;
                if (typeof k !== 'undefined'){
                    res = par[k] = {};
                }

                for (let _item in dat){
                    if (dat.hasOwnProperty(_item)){
                        if (typeof dat[_item] === 'object'){
                            loopList.push({
                                parent: res,
                                key: _item,
                                dat: dat[_item]
                            });
                        }
                        else res[_item] = dat[_item];
                    }
                }
            }
            return root;

        },

        /**
         * @description 输出对象
         * @param {*} obj 
         */
        alertObj(obj, str=""){
            for (var item in obj){
                if (typeof obj[item] === 'object'){
                    str += item+":" + "{ " +this.alertObj(obj[item])+" }";;
                } 
                else str += item+":"+obj[item]+" ";
            }
            return (str);
        },


        /**
         * 
         * @description 随机取数
         * @param {*} arr 
         * @param {*} num 
         * @returns {arr|number}
         */
        getRandom(arr, num = 1, repeatable = 0){
            let ranArr = [], _arr = arr;
            for (let i=0; i<num; i++){
                ranArr.push(arr[(Math.random() * _arr.length).toFixed]);
                if (repeatable == 0) {
                    let key = this.getKey(_arr, ranArr[i]);
                    if (typeof key !== "number" && key != -1){
                        for (item of key){
                            _arr.splice(item, 1);
                        }
                    }
                }  
            } 
            return num > 1 ? ranArr:ranArr[0]; 
        },

        /**
         * @description 获取数组中指定键值的索引号,没有则返回-1
         * @param {*} arr 
         * @param {*} data 
         */
        getKey(arr, data){
            let _arr = arr, result = [];
            for (let i=0; i<_arr.length; i++){
                if (_arr[i] == data){
                    result.push(i);
                }
            }
            return result.length>0 ? result : -1;
        },

        /**
         * @description 获取数组中每（某）一个元素的重复度
         * @param {*} arr 
         * @param {*} number 
         */
        getCount(arr, number){
            let _arr = arr, 
                result = [],
                obj;
            for (_item of _arr){
                if (obj[_item]){
                    obj[_item]++;
                }
                else opj[_item] = 1;
            }
            for (o in obj){
                result.push({el:o, count: obj[o]});
            }
            return number ? result[number] : result;

        },

        /**
         * @description 返回删除了指定键值之后的数组
         * @param {*} arr 
         * @param {*} value 
         */
        removeArrayByValue(arr, value){
            return arr.filter(item => item !== value);
        },

        /**
         * @description 返回删除包含指定值的元素之后的数组
         * @param {*} arr 
         * @param {*} value 
         */
        removeArrayByLike(arr, value){
            return arr.filter(item => item.indexOf(value) === -1);
        },


        /**
         * @todo 以递归形式尝试重写
         * @description 排除对象某些项
         */
        filterKey(obj, keys){
            let _obj = {};
            let _keys = keys.split(',');
            for (let key in obj){
                if (_keys.indexOf(key) === -1){
                    _obj[key] = obj[key];
                }
            }
            return _obj;
        },


        /**
         * @description 数组扁平化
         * @param {*} arr 
         */
        steamroller(arr){
            let flattened = [].concat(...arr);
            return flattened.some(item => Array.isArray(item)) ? this.steamroller(flattened) : flattened;
        },

        /**
         * @description 切割数组
         */
        cut(arr, num){
             let result = [];
             for (let i=0; i<arr.length; i+=num){
                result.push(arr.slice(i, i + num));
            }
            return result;
        },



        /**
         * @description 快速排序
         * @param {*} arr 
         */
        qsort(arr){
            if(arr.length <= 1){
                return arr;
            }

            let right = [],
                left = [];
            let index = arr[(arr.length / 2).toFixed];

            for (let i=0; i<arr.length; i++){
                if (arr[i] < index){
                    right.push(arr[i]);
                }
                else{
                    left.push(arr[i]);
                }
            }
            return qsort(right).concat(index, qsort(left));
        },



        /*****************************对象模块********************************* */

        /**
         * @description 时间倒计时折算，单位ms
         * 
         */
        getTime(endTime){
            let t = +new Date(endTime) - +new Date();
            let d = 0,
                h = 0,
                m = 0,
                s = 0;
            if (t >= 0){
                d = Math.floor(t / 1000 / 3600 / 24);
                h = Math.floor(t / 1000 / 3600 % 24);
                m = Math.floor(t / 1000 / 60 % 60);
                s = Math.floor(t / 1000 % 60);
            }
            return {d, h, m, s};
        },

        /**
         * @description 时间格式化
         * @param {*} date 
         * @param {*} fmt 
         */
        formatDate(date, fmt = "yyyy-MM-DD hh:mm:ss"){
            let _date = new Date(date),
                _fmt = fmt;
            let o = {
                "M+": _date.getMonth() + 1,
                "d+": _date.getDate(),
                "h+": _date.getHours(),
                "m+": _date.getMinutes(),
                "s+": _date.getSeconds()
            }
       
            if (/(y+)/.test(_fmt)){
                _fmt = _fmt.replace(RegExp.$1, (_date.getFullYear(_date) + "").substr(4 - RegExp.$1.length));
            }
            for (let obj in o){
                if (new RegExp("(" + obj + ")").test(_fmt)){
                    _fmt = _fmt.replace(RegExp.$1, ((RegExp.$1.length === 1) ? o[k] : ("00" + o[obj]).substr(("" + o[obj].length))))
                }
            }
            return _fmt;
         },
    };

})();