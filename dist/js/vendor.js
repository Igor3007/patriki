class customSelect {

    constructor(option) {
        this.selector = option.selector;
        this.selectAll = document.querySelectorAll(this.selector)
    }

    init() {
        this.renderTemplate()
        this.clickEventOut()
    }

    reinit(elem) {
        const _this = this;
        document.querySelectorAll(elem).forEach(function (item, index) {
            item = item.parentNode

            if (item.querySelector('.select-styled')) {
                item.querySelector('.select-styled').remove()
                item.querySelector('.select-options').remove()
            }

            _this.renderOption(item)

        })

    }

    renderOption(item) {

        var _this = this;
        var select = item.querySelector('select')
        var placeholder = select.getAttribute('placeholder')

        const styledSelect = document.createElement('div')
        styledSelect.classList.add('select-styled');
        styledSelect.innerHTML = '<span>' + placeholder + '</span>';

        const styledOptions = document.createElement('ul')
        styledOptions.classList.add('select-options');

        const styledList = document.createElement('div')
        styledList.classList.add('select-list');
        styledList.appendChild(styledOptions)


        item.appendChild(styledSelect)
        item.appendChild(styledList)

        _this.clickEventOpenSelect(item)

        //====

        item.querySelectorAll('select > option').forEach(function (item, index) {

            // create li elem
            const li = document.createElement('li')
            li.innerHTML = item.innerText
            li.setAttribute('rel', item.value)

            //если не задан placeholder, сделать им первый элемент
            if (index == 0 && !placeholder) {
                styledSelect.innerHTML = '<span>' + item.innerText + '</span>';
            }

            //если есть selected элемент
            if (item.getAttribute('selected')) {
                if (!placeholder) {
                    styledSelect.innerHTML = '<span>' + item.innerText + '</span>';
                    li.classList.add('active')
                } else {
                    styledSelect.innerHTML = '<span class="af-selected-placeholder" data-af-placeholder="' + placeholder + '">' + item.innerText + '</span>';
                    li.classList.add('active')
                }
            }

            styledOptions.appendChild(li)
            _this.clickEventListItem(li)

        })
    }

    renderTemplate() {

        const _this = this;

        this.selectAll.forEach(function (item, index) {

            if (!item.classList.contains('select-hidden')) {
                item.classList.add('select-hidden');
                const wrapper = document.createElement('div');
                wrapper.classList.add('af-select');
                wrapper.innerHTML = item.outerHTML;
                item.parentNode.replaceChild(wrapper, item);
            }

        })

        document.querySelectorAll('.af-select').forEach(function (item, index) {
            _this.renderOption(item)

        })
    }

    openSelect(elem) {
        elem.style.width = (elem.offsetWidth) + 'px'
        elem.querySelector('.select-styled').classList.toggle('active')
        elem.querySelector('.select-options').classList.toggle('active')
        elem.querySelector('.select-list').classList.toggle('active')
        document.querySelector('body').classList.toggle('af-select-open')
    }

    closeSelect() {

        if (!document.querySelector('.select-styled.active')) return false

        document.querySelector('.select-styled.active').classList.remove('active')
        document.querySelector('.select-options.active').classList.remove('active')
        document.querySelector('.select-list.active').classList.remove('active')
        document.querySelector('body').classList.remove('af-select-open')
    }

    clickEventOut() {
        const _this = this;
        document.addEventListener('click', function () {
            _this.closeSelect()
        })
    }

    clickEventListItem(elem) {

        const parentElem = elem.parentNode.parentNode.parentNode
        const _this = this;

        elem.addEventListener('click', function (event) {

            event.stopPropagation()
            event.preventDefault()

            if (parentElem.querySelector('.select-options li.active'))
                parentElem.querySelector('.select-options li.active').classList.remove('active')

            this.classList.add('active')
            parentElem.querySelector('.select-styled span').innerHTML = this.innerHTML
            parentElem.querySelector('select').value = this.getAttribute('rel')

            var event = new Event('change');
            parentElem.querySelector('select').dispatchEvent(event);

            _this.closeSelect()
        })
    }

    clickEventOpenSelect(elem) {
        const _this = this;

        elem.addEventListener('click', function (event) {
            event.stopPropagation()
            event.preventDefault()
            _this.openSelect(this)
        })
    }

}
class customModal {
    constructor(opion) {

        this.selector = '[data-inmap]',
            this.src = null,
            this.instanse = null,
            this.on = {
                afterShow: null
            }
    }

    init() {
        //this.createTemplate()
    }

    createTemplate() {
        let template = document.createElement('div')
        template.innerHTML = `
                <div class="af-popup">
                    <div class="af-popup__bg"></div>
                    <div class="af-popup__wrp">
                        <div class="af-popup__close">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"></path></svg>
                        </div>
                        <div class="af-popup__content"></div>
                    </div>
                </div>
                `

        document.body.append(template)

        this.instanse = template;

        return template;
    }

    open(content, afterShow) {

        let _this = this;
        let modal = this.createTemplate();
        modal.querySelector('.af-popup__content').innerHTML = content
        modal.querySelector('.af-popup__close').addEventListener('click', function () {
            _this.close()
        })


        if (afterShow) afterShow(modal);

        this.createEvent();

    }

    createEvent() {

        let _this = this

        this.instanse.querySelector('.af-popup__bg').addEventListener('click', function () {
            _this.close()
        })
    }

    close() {
        this.instanse.remove()
    }
}
/*!
 * maska v1.5.0
 * (c) 2019-2021 Alexander Shabunevich
 * Released under the MIT License.
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Maska={})}(this,(function(e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var s={"#":{pattern:/[0-9]/},X:{pattern:/[0-9a-zA-Z]/},S:{pattern:/[a-zA-Z]/},A:{pattern:/[a-zA-Z]/,uppercase:!0},a:{pattern:/[a-zA-Z]/,lowercase:!0},"!":{escape:!0},"*":{repeat:!0}};function i(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:s,r=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];return u(t).length>1?l(t)(e,t,n,r):p(e,t,n,r)}function u(e){try{return JSON.parse(e)}catch(t){return[e]}}function l(e){var t=u(e).sort((function(e,t){return e.length-t.length}));return function(e,r,a){var o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],s=t.map((function(t){return p(e,t,a,!1)})),i=s.pop();for(var u in t)if(n(i,t[u],a))return p(e,t[u],a,o);return""};function n(e,t,n){for(var r in n)n[r].escape&&(t=t.replace(new RegExp(r+".{1}","g"),""));return t.split("").filter((function(e){return n[e]&&n[e].pattern})).length>=e.length}}function p(e,t,n){for(var r=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],a=0,o=0,s="",i="";a<t.length&&o<e.length;){var u=t[a],l=e[o],p=n[u];if(p&&p.pattern)p.pattern.test(l)&&(s+=c(l,p),a++,r&&t[a]&&(n[t[a]]?n[t[a]]&&n[t[a]].escape&&(s+=t[a+1],a+=2):(s+=t[a],a++))),o++;else if(p&&p.repeat){var f=n[t[a-1]];f&&!f.pattern.test(l)?a++:a--}else p&&p.escape&&(u=t[++a]),r&&(s+=u),l===u&&o++,a++}for(;r&&a<t.length;){var v=t[a];if(n[v]){i="";break}i+=v,a++}return s+i}function c(e,t){return t.transform&&(e=t.transform(e)),t.uppercase?e.toLocaleUpperCase():t.lowercase?e.toLocaleLowerCase():e}function f(e){return e instanceof HTMLInputElement?e:e.querySelector("input")||e}function v(e){return"[object String]"===Object.prototype.toString.call(e)}var d=function(){function e(n){var r=this,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(t(this,e),!n)throw new Error("Maska: no element for mask");if(null!=a.preprocessor&&"function"!=typeof a.preprocessor)throw new Error("Maska: preprocessor must be a function");if(a.tokens)for(var i in a.tokens)a.tokens[i]=o({},a.tokens[i]),a.tokens[i].pattern&&v(a.tokens[i].pattern)&&(a.tokens[i].pattern=new RegExp(a.tokens[i].pattern));this._opts={mask:a.mask,tokens:o(o({},s),a.tokens),preprocessor:a.preprocessor},this._el=v(n)?document.querySelectorAll(n):n.length?n:[n],this.inputEvent=function(e){return r.updateValue(e.target,e)},this.init()}var r,a,u;return r=e,(a=[{key:"init",value:function(){for(var e=this,t=function(t){var n=f(e._el[t]);!e._opts.mask||n.dataset.mask&&n.dataset.mask===e._opts.mask||(n.dataset.mask=e._opts.mask),setTimeout((function(){return e.updateValue(n)}),0),n.dataset.maskInited||(n.dataset.maskInited=!0,n.addEventListener("input",e.inputEvent),n.addEventListener("beforeinput",e.beforeInput))},n=0;n<this._el.length;n++)t(n)}},{key:"destroy",value:function(){for(var e=0;e<this._el.length;e++){var t=f(this._el[e]);t.removeEventListener("input",this.inputEvent),t.removeEventListener("beforeinput",this.beforeInput),delete t.dataset.mask,delete t.dataset.maskInited}}},{key:"updateValue",value:function(e,t){if(e&&e.type){var n=e.type.match(/^number$/i)&&e.validity.badInput;if(!e.value&&!n||!e.dataset.mask)return e.dataset.maskRawValue="",void this.dispatch("maska",e,t);var r=e.selectionEnd,a=e.value,o=a[r-1];e.dataset.maskRawValue=i(e.value,e.dataset.mask,this._opts.tokens,!1);var s=e.value;this._opts.preprocessor&&(s=this._opts.preprocessor(s)),e.value=i(s,e.dataset.mask,this._opts.tokens),t&&"insertText"===t.inputType&&r===a.length&&(r=e.value.length),function(e,t,n){for(;t&&t<e.value.length&&e.value.charAt(t-1)!==n;)t++;(e.type?e.type.match(/^(text|search|password|tel|url)$/i):!e.type)&&e===document.activeElement&&(e.setSelectionRange(t,t),setTimeout((function(){e.setSelectionRange(t,t)}),0))}(e,r,o),this.dispatch("maska",e,t),e.value!==a&&this.dispatch("input",e,t)}}},{key:"beforeInput",value:function(e){e&&e.target&&e.target.type&&e.target.type.match(/^number$/i)&&e.data&&isNaN(e.target.value+e.data)&&e.preventDefault()}},{key:"dispatch",value:function(e,t,n){t.dispatchEvent(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=document.createEvent("Event");return n.initEvent(e,!0,!0),t&&(n.inputType=t),n}(e,n&&n.inputType||null))}}])&&n(r.prototype,a),u&&n(r,u),e}();var h,k=(h=new WeakMap,function(e,t){t.value&&(h.has(e)&&!function(e){return!(v(e.value)&&e.value===e.oldValue||Array.isArray(e.value)&&JSON.stringify(e.value)===JSON.stringify(e.oldValue)||e.value&&e.value.mask&&e.oldValue&&e.oldValue.mask&&e.value.mask===e.oldValue.mask)}(t)||h.set(e,new d(e,function(e){var t={};return e.mask?(t.mask=Array.isArray(e.mask)?JSON.stringify(e.mask):e.mask,t.tokens=e.tokens?o({},e.tokens):{},t.preprocessor=e.preprocessor):t.mask=Array.isArray(e)?JSON.stringify(e):e,t}(t.value))))});function m(e){e.directive("maska",k)}"undefined"!=typeof window&&window.Vue&&window.Vue.use&&window.Vue.use(m),e.create=function(e,t){return new d(e,t)},e.default=m,e.install=m,e.mask=i,e.maska=k,e.tokens=s,Object.defineProperty(e,"__esModule",{value:!0})}));
