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

        let item = elem.parentNode

        if (item.querySelector('.select-styled')) {
            item.querySelector('.select-styled').remove()
            item.querySelector('.select-list').remove()
        }

        _this.renderOption(item)

    }

    ajaxOption(item, callback) {
        let xhr = new XMLHttpRequest();
        let result = null;
        xhr.open('GET', item.dataset.ajax)
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send()
        xhr.onerror = function () {
            console.err('Error: afSelec ajax request failed')
        };

        xhr.onreadystatechange = function () {

            if (xhr.readyState == 3) {
                item.closest('.af-select').querySelector('.select-list').classList.add('select-list--load')
            }

            if (xhr.readyState == 4) {
                item.closest('.af-select').querySelector('.select-list').classList.remove('select-list--load')
            }

        };

        xhr.onload = function () {
            callback(xhr.response)
        };

        return result;
    }

    renderOption(item) {

        var _this = this;
        var select = item.querySelector('select')
        var placeholder = select.getAttribute('placeholder')
        var multiple = select.getAttribute('multiple')

        const styledSelect = document.createElement('div')
        styledSelect.classList.add('select-styled');
        styledSelect.innerHTML = '<span>' + placeholder + '</span>';

        const styledOptions = document.createElement('ul')
        styledOptions.classList.add('select-options');

        const styledList = document.createElement('div')
        styledList.classList.add('select-list');
        styledList.appendChild(styledOptions)

        if (!item.querySelector('.select-styled')) {
            item.appendChild(styledSelect)
        }
        if (!item.querySelector('.select-options')) {
            item.appendChild(styledList)
        }



        function createOptions(item) {
            item.querySelectorAll('select > option').forEach(function (item, index) {

                // create li elem
                const li = document.createElement('li')
                li.innerHTML = item.innerText
                li.setAttribute('rel', item.value)

                if (multiple) {
                    let check = document.createElement('span')
                    check.classList.add('af-check-multiple')
                    li.append(check)
                }

                //если не задан placeholder, сделать им первый элемент
                if (index == 0 && !placeholder) {
                    styledSelect.innerHTML = '<span>' + item.innerText + '</span>';
                }

                //если есть selected элемент
                if (item.getAttribute('selected')) {

                    function selectedText(option) {
                        if (multiple) {

                            let selected_arr = [];

                            option.parentNode.querySelectorAll('option[selected]').forEach(function (item) {
                                selected_arr.push(item.innerText)
                            })

                            return (selected_arr.length ? selected_arr.join(',') : placeholder);
                        } else {
                            return option.innerText
                        }
                    }

                    if (!placeholder) {

                        styledSelect.innerHTML = '<span>' + selectedText(item) + '</span>';
                        li.classList.add('active')
                    } else {
                        styledSelect.innerHTML = '<span class="af-selected-placeholder" data-af-placeholder="' + placeholder + '">' + selectedText(item) + '</span>';
                        li.classList.add('active')
                    }
                }

                if (!item.getAttribute('disabled')) {
                    styledOptions.appendChild(li)
                    _this.clickEventListItem(li, item, index)
                }

            })
        }



        //ajax option
        if (select.dataset.ajax) {

            this.ajaxOption(select, function (arr) {

                select.innerHTML = '';

                let attrSelectedId = select.dataset.selected;
                let arrtPlaceholder = select.getAttribute('placeholder')

                arr.unshift({
                    text: (arrtPlaceholder ? arrtPlaceholder : '-Выберите-'),
                    value: ''
                });

                arr.forEach(function (item) {
                    let option = document.createElement('option')
                    option.value = item.value
                    option.innerText = item.text

                    if (attrSelectedId == item.value) {
                        option.setAttribute('selected', true)
                        select.removeAttribute('data-selected')
                    }

                    select.append(option)
                })

                createOptions(item);
            })

        }

        //default
        if (!select.dataset.ajax) {
            createOptions(item)
        }


        //add public methods

        select['afSelect'] = new Object;
        select.afSelect.open = function () {
            _this.openSelect(item)
        }
        select.afSelect.close = function () {
            _this.closeSelect()
        }
        select.afSelect.update = function () {
            _this.reinit(select)
        }

        //console.log(select)
    }

    renderTemplate() {

        const _this = this;

        this.selectAll.forEach(function (item, index) {



            if (!item.classList.contains('select-hidden')) {
                item.classList.add('select-hidden');
                const wrapper = document.createElement('div');
                wrapper.classList.add('af-select');

                if (item.getAttribute('multiple')) {
                    wrapper.classList.add('af-select--multiple');
                }

                wrapper.innerHTML = item.outerHTML;
                item.parentNode.replaceChild(wrapper, item);

                //add event 
                _this.clickEventOpenSelect(wrapper)
            }

        })

        document.querySelectorAll('.af-select').forEach(function (item, index) {
            _this.renderOption(item)
        })


    }

    openSelect(elem) {
        //close all open select 
        document.querySelectorAll('select').forEach(function (select) {
            if (select.afSelect) select.afSelect.close()
        })

        if (elem.querySelector('select').dataset.ajax && !elem.querySelector('.select-styled').classList.contains('active')) {
            elem.querySelector('.select-list').remove()
            this.renderOption(elem);
        }

        elem.style.maxWidth = (elem.offsetWidth) + 'px'
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

    clickEventListItem(elem, option, index) {

        const parentElem = option.parentNode.parentNode
        const _this = this;
        const placeholder = parentElem.querySelector('select').getAttribute('placeholder')
        const multiple = parentElem.querySelector('select').getAttribute('multiple')
        const styledSelect = parentElem.querySelector('.select-styled')


        elem.addEventListener('click', function (event) {

            event.stopPropagation()
            event.preventDefault()
            //console.log(options)

            if (parentElem.querySelector('.select-options li.active')) {

                // если мульти то не сбрасывать active
                if (!multiple) {
                    parentElem.querySelector('.select-options li.active').classList.remove('active')
                }
            }

            if (this.classList.contains('active')) {
                this.classList.remove('active')
                option.removeAttribute('selected')
            } else {
                this.classList.add('active')
                option.setAttribute('selected', 'selected')
            }

            function selectedText(option) {
                if (multiple) {

                    let selected_arr = [];

                    option.parentNode.querySelectorAll('option[selected]').forEach(function (item) {
                        selected_arr.push(item.innerText)
                    })

                    return (selected_arr.length ? selected_arr.join(',') : placeholder);
                } else {
                    return option.innerText
                }
            }

            //если есть placeholder
            if (placeholder) {
                styledSelect.innerHTML = '<span class="af-selected-placeholder" data-af-placeholder="' + placeholder + '">' + selectedText(option) + '</span>';
            } else {
                parentElem.querySelector('.select-styled span').innerHTML = selectedText(option)
            }

            parentElem.querySelector('select').value = this.getAttribute('rel')
            var dispatchEvent = new Event('change');
            parentElem.querySelector('select').dispatchEvent(dispatchEvent);

            if (!event.target.classList.contains('af-check-multiple')) {
                _this.closeSelect()
            }




        })
    }

    clickEventOpenSelect(elem) {
        const _this = this;

        function addEventOpen(event) {
            event.stopPropagation()
            event.preventDefault()
            _this.openSelect(this)
        }

        elem.removeEventListener('click', addEventOpen)
        elem.addEventListener('click', addEventOpen)
    }

}
class customModal{constructor(opion){this.modal="",opion&&(this.mobileBottom=!!opion.mobileInBottom&&opion.mobileInBottom)}init(){}createTemplate(){let template=document.createElement("div");return template.innerHTML='\n                <div class="af-popup">\n                    <div class="af-popup__bg"></div>\n                    <div class="af-popup__wrp">\n                        <div class="af-popup__container">\n                            <div class="af-popup__close">\n                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"></path></svg>\n                            </div>\n                            <div class="af-popup__content"></div>\n                        </div>\n                    </div>\n                </div>\n                ',document.body.append(template),this.instanse=template,template}open(content,afterShow){let _this=this;this.modal=this.createTemplate(),window.innerWidth<=480&&this.mobileBottom&&this.modal.querySelector(".af-popup").classList.add("af-popup--mobile"),this.modal.querySelector(".af-popup__content").innerHTML=content,this.modal.querySelector(".af-popup__close").addEventListener("click",(function(){_this.close()})),afterShow&&afterShow(this.modal),this.createEvent()}changeContent(content){this.modal.querySelector(".af-popup__content").innerHTML=content}createEvent(){let _this=this;this.instanse.querySelector(".af-popup").addEventListener("click",(function(){_this.close()})),this.instanse.querySelector(".af-popup__container").addEventListener("click",(function(event){event.stopPropagation(!0)}))}close(){this.instanse.remove()}}
!function(){"use strict";function e(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function t(e){return e[e.length-1]}function i(e,...t){return t.forEach((t=>{e.includes(t)||e.push(t)})),e}function s(e,t){return e?e.split(t):[]}function n(e,t,i){return(void 0===t||e>=t)&&(void 0===i||e<=i)}function a(e,t,i){return e<t?t:e>i?i:e}function r(e,t,i={},s=0,n=""){n+=`<${Object.keys(i).reduce(((e,t)=>{let n=i[t];return"function"==typeof n&&(n=n(s)),`${e} ${t}="${n}"`}),e)}></${e}>`;const a=s+1;return a<t?r(e,t,i,a,n):n}function d(e){return e.replace(/>\s+/g,">").replace(/\s+</,"<")}function o(e){return new Date(e).setHours(0,0,0,0)}function c(){return(new Date).setHours(0,0,0,0)}function l(...e){switch(e.length){case 0:return c();case 1:return o(e[0])}const t=new Date(0);return t.setFullYear(...e),t.setHours(0,0,0,0)}function h(e,t){const i=new Date(e);return i.setDate(i.getDate()+t)}function u(e,t){const i=new Date(e),s=i.getMonth()+t;let n=s%12;n<0&&(n+=12);const a=i.setMonth(s);return i.getMonth()!==n?i.setDate(0):a}function f(e,t){const i=new Date(e),s=i.getMonth(),n=i.setFullYear(i.getFullYear()+t);return 1===s&&2===i.getMonth()?i.setDate(0):n}function p(e,t){return(e-t+7)%7}function g(e,t,i=0){const s=new Date(e).getDay();return h(e,p(t,i)-p(s,i))}function m(e,t){const i=new Date(e).getFullYear();return Math.floor(i/t)*t}function w(e,t,i){if(1!==t&&2!==t)return e;const s=new Date(e);return 1===t?i?s.setMonth(s.getMonth()+1,0):s.setDate(1):i?s.setFullYear(s.getFullYear()+1,0,0):s.setMonth(0,1),s.setHours(0,0,0,0)}const D=/dd?|DD?|mm?|MM?|yy?(?:yy)?/,y=/[\s!-/:-@[-`{-~年月日]+/;let k={};const v={y:(e,t)=>new Date(e).setFullYear(parseInt(t,10)),m(e,t,i){const s=new Date(e);let n=parseInt(t,10)-1;if(isNaN(n)){if(!t)return NaN;const e=t.toLowerCase(),s=t=>t.toLowerCase().startsWith(e);if(n=i.monthsShort.findIndex(s),n<0&&(n=i.months.findIndex(s)),n<0)return NaN}return s.setMonth(n),s.getMonth()!==x(n)?s.setDate(0):s.getTime()},d:(e,t)=>new Date(e).setDate(parseInt(t,10))},b={d:e=>e.getDate(),dd:e=>M(e.getDate(),2),D:(e,t)=>t.daysShort[e.getDay()],DD:(e,t)=>t.days[e.getDay()],m:e=>e.getMonth()+1,mm:e=>M(e.getMonth()+1,2),M:(e,t)=>t.monthsShort[e.getMonth()],MM:(e,t)=>t.months[e.getMonth()],y:e=>e.getFullYear(),yy:e=>M(e.getFullYear(),2).slice(-2),yyyy:e=>M(e.getFullYear(),4)};function x(e){return e>-1?e%12:x(e+12)}function M(e,t){return e.toString().padStart(t,"0")}function S(e){if("string"!=typeof e)throw new Error("Invalid date format.");if(e in k)return k[e];const i=e.split(D),s=e.match(new RegExp(D,"g"));if(0===i.length||!s)throw new Error("Invalid date format.");const n=s.map((e=>b[e])),a=Object.keys(v).reduce(((e,t)=>(s.find((e=>"D"!==e[0]&&e[0].toLowerCase()===t))&&e.push(t),e)),[]);return k[e]={parser(e,t){const i=e.split(y).reduce(((e,t,i)=>{if(t.length>0&&s[i]){const n=s[i][0];"M"===n?e.m=t:"D"!==n&&(e[n]=t)}return e}),{});return a.reduce(((e,s)=>{const n=v[s](e,i[s],t);return isNaN(n)?e:n}),c())},formatter:(e,s)=>n.reduce(((t,n,a)=>t+`${i[a]}${n(e,s)}`),"")+t(i)}}function C(e,t,i){if(e instanceof Date||"number"==typeof e){const t=o(e);return isNaN(t)?void 0:t}if(e){if("today"===e)return c();if(t&&t.toValue){const s=t.toValue(e,t,i);return isNaN(s)?void 0:o(s)}return S(t).parser(e,i)}}function O(e,t,i){if(isNaN(e)||!e&&0!==e)return"";const s="number"==typeof e?new Date(e):e;return t.toDisplay?t.toDisplay(s,t,i):S(t).formatter(s,i)}const E=document.createRange();function F(e){return E.createContextualFragment(e)}function V(e){return e.parentElement||(e.parentNode instanceof ShadowRoot?e.parentNode.host:void 0)}function N(e){return e.getRootNode().activeElement===e}function L(e){"none"!==e.style.display&&(e.style.display&&(e.dataset.styleDisplay=e.style.display),e.style.display="none")}function W(e){"none"===e.style.display&&(e.dataset.styleDisplay?(e.style.display=e.dataset.styleDisplay,delete e.dataset.styleDisplay):e.style.display="")}function B(e){e.firstChild&&(e.removeChild(e.firstChild),B(e))}const A=new WeakMap,{addEventListener:Y,removeEventListener:H}=EventTarget.prototype;function j(e,t){let i=A.get(e);i||(i=[],A.set(e,i)),t.forEach((e=>{Y.call(...e),i.push(e)}))}function T(e){let t=A.get(e);t&&(t.forEach((e=>{H.call(...e)})),A.delete(e))}if(!Event.prototype.composedPath){const e=(t,i=[])=>{let s;return i.push(t),t.parentNode?s=t.parentNode:t.host?s=t.host:t.defaultView&&(s=t.defaultView),s?e(s,i):i};Event.prototype.composedPath=function(){return e(this.target)}}function _(e,t,i){const[s,...n]=e;return t(s)?s:s!==i&&"HTML"!==s.tagName&&0!==n.length?_(n,t,i):void 0}function K(e,t){const i="function"==typeof t?t:e=>e instanceof Element&&e.matches(t);return _(e.composedPath(),i,e.currentTarget)}const $={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],today:"Today",clear:"Clear",titleFormat:"MM y"}},R={autohide:!1,beforeShowDay:null,beforeShowDecade:null,beforeShowMonth:null,beforeShowYear:null,calendarWeeks:!1,clearBtn:!1,dateDelimiter:",",datesDisabled:[],daysOfWeekDisabled:[],daysOfWeekHighlighted:[],defaultViewDate:void 0,disableTouchKeyboard:!1,format:"mm/dd/yyyy",getCalendarWeek:null,language:"en",maxDate:null,maxNumberOfDates:1,maxView:3,minDate:null,nextArrow:"»",orientation:"auto",pickLevel:0,prevArrow:"«",showDaysOfWeek:!0,showOnClick:!0,showOnFocus:!0,startView:0,title:"",todayBtn:!1,todayBtnMode:0,todayHighlight:!1,updateOnBlur:!0,weekStart:0},{language:I,format:P,weekStart:q}=R;function J(e,t){return e.length<6&&t>=0&&t<7?i(e,t):e}function U(e){return(e+6)%7}function z(e,t,i,s){const n=C(e,t,i);return void 0!==n?n:s}function X(e,t,i=3){const s=parseInt(e,10);return s>=0&&s<=i?s:t}function G(t,s){const n=Object.assign({},t),a={},r=s.constructor.locales,d=s.rangeSideIndex;let{format:o,getCalendarWeek:c,language:h,locale:u,maxDate:f,maxView:p,minDate:g,pickLevel:m,startView:y,weekStart:k}=s.config||{};if(n.language){let e;if(n.language!==h&&(r[n.language]?e=n.language:(e=n.language.split("-")[0],void 0===r[e]&&(e=!1))),delete n.language,e){h=a.language=e;const t=u||r[I];u=Object.assign({format:P,weekStart:q},r[I]),h!==I&&Object.assign(u,r[h]),a.locale=u,o===t.format&&(o=a.format=u.format),k===t.weekStart&&(k=a.weekStart=u.weekStart,a.weekEnd=U(u.weekStart))}}if(n.format){const e="function"==typeof n.format.toDisplay,t="function"==typeof n.format.toValue,i=D.test(n.format);(e&&t||i)&&(o=a.format=n.format),delete n.format}let v=m;void 0!==n.pickLevel&&(v=X(n.pickLevel,2),delete n.pickLevel),v!==m&&(v>m&&(void 0===n.minDate&&(n.minDate=g),void 0===n.maxDate&&(n.maxDate=f)),n.datesDisabled||(n.datesDisabled=[]),m=a.pickLevel=v);let b=g,x=f;if(void 0!==n.minDate){const e=l(0,0,1);b=null===n.minDate?e:z(n.minDate,o,u,b),b!==e&&(b=w(b,m,!1)),delete n.minDate}if(void 0!==n.maxDate&&(x=null===n.maxDate?void 0:z(n.maxDate,o,u,x),void 0!==x&&(x=w(x,m,!0)),delete n.maxDate),x<b?(g=a.minDate=x,f=a.maxDate=b):(g!==b&&(g=a.minDate=b),f!==x&&(f=a.maxDate=x)),n.datesDisabled&&(a.datesDisabled=n.datesDisabled.reduce(((e,t)=>{const s=C(t,o,u);return void 0!==s?i(e,w(s,m,d)):e}),[]),delete n.datesDisabled),void 0!==n.defaultViewDate){const e=C(n.defaultViewDate,o,u);void 0!==e&&(a.defaultViewDate=e),delete n.defaultViewDate}if(void 0!==n.weekStart){const e=Number(n.weekStart)%7;isNaN(e)||(k=a.weekStart=e,a.weekEnd=U(e)),delete n.weekStart}if(n.daysOfWeekDisabled&&(a.daysOfWeekDisabled=n.daysOfWeekDisabled.reduce(J,[]),delete n.daysOfWeekDisabled),n.daysOfWeekHighlighted&&(a.daysOfWeekHighlighted=n.daysOfWeekHighlighted.reduce(J,[]),delete n.daysOfWeekHighlighted),void 0!==n.maxNumberOfDates){const e=parseInt(n.maxNumberOfDates,10);e>=0&&(a.maxNumberOfDates=e,a.multidate=1!==e),delete n.maxNumberOfDates}n.dateDelimiter&&(a.dateDelimiter=String(n.dateDelimiter),delete n.dateDelimiter);let M=p;void 0!==n.maxView&&(M=X(n.maxView,p),delete n.maxView),M=m>M?m:M,M!==p&&(p=a.maxView=M);let S=y;if(void 0!==n.startView&&(S=X(n.startView,S),delete n.startView),S<m?S=m:S>p&&(S=p),S!==y&&(a.startView=S),n.prevArrow){const e=F(n.prevArrow);e.childNodes.length>0&&(a.prevArrow=e.childNodes),delete n.prevArrow}if(n.nextArrow){const e=F(n.nextArrow);e.childNodes.length>0&&(a.nextArrow=e.childNodes),delete n.nextArrow}if(void 0!==n.disableTouchKeyboard&&(a.disableTouchKeyboard="ontouchstart"in document&&!!n.disableTouchKeyboard,delete n.disableTouchKeyboard),n.orientation){const e=n.orientation.toLowerCase().split(/\s+/g);a.orientation={x:e.find((e=>"left"===e||"right"===e))||"auto",y:e.find((e=>"top"===e||"bottom"===e))||"auto"},delete n.orientation}if(void 0!==n.todayBtnMode){switch(n.todayBtnMode){case 0:case 1:a.todayBtnMode=n.todayBtnMode}delete n.todayBtnMode}return a.getCalendarWeek="function"==typeof n.getCalendarWeek?n.getCalendarWeek:c||null,delete n.getCalendarWeek,Object.keys(n).forEach((t=>{void 0!==n[t]&&e(R,t)&&(a[t]=n[t])})),a}const Q=d('<div class="datepicker">\n  <div class="datepicker-picker">\n    <div class="datepicker-header">\n      <div class="datepicker-title"></div>\n      <div class="datepicker-controls">\n        <button type="button" class="%buttonClass% prev-btn"></button>\n        <button type="button" class="%buttonClass% view-switch"></button>\n        <button type="button" class="%buttonClass% next-btn"></button>\n      </div>\n    </div>\n    <div class="datepicker-main"></div>\n    <div class="datepicker-footer">\n      <div class="datepicker-controls">\n        <button type="button" class="%buttonClass% today-btn"></button>\n        <button type="button" class="%buttonClass% clear-btn"></button>\n      </div>\n    </div>\n  </div>\n</div>'),Z=d(`<div class="days">\n  <div class="days-of-week">${r("span",7,{class:"dow"})}</div>\n  <div class="datepicker-grid">${r("span",42)}</div>\n</div>`),ee=d(`<div class="calendar-weeks">\n  <div class="days-of-week"><span class="dow"></span></div>\n  <div class="weeks">${r("span",6,{class:"week"})}</div>\n</div>`);class te{constructor(e,t){Object.assign(this,t,{picker:e,element:F('<div class="datepicker-view"></div>').firstChild,selected:[]}),this.init(this.picker.datepicker.config)}init(e){void 0!==e.pickLevel&&(this.isMinView=this.id===e.pickLevel),this.setOptions(e),this.updateFocus(),this.updateSelection()}performBeforeHook(e,t,s){let n=this.beforeShow(new Date(s));switch(typeof n){case"boolean":n={enabled:n};break;case"string":n={classes:n}}if(n){if(!1===n.enabled&&(e.classList.add("disabled"),i(this.disabled,t)),n.classes){const s=n.classes.split(/\s+/);e.classList.add(...s),s.includes("disabled")&&i(this.disabled,t)}n.content&&function(e,t){B(e),t instanceof DocumentFragment?e.appendChild(t):"string"==typeof t?e.appendChild(F(t)):"function"==typeof t.forEach&&t.forEach((t=>{e.appendChild(t)}))}(e,n.content)}}}class ie extends te{constructor(e){super(e,{id:0,name:"days",cellClass:"day"})}init(e,t=!0){if(t){const e=F(Z).firstChild;this.dow=e.firstChild,this.grid=e.lastChild,this.element.appendChild(e)}super.init(e)}setOptions(t){let i;if(e(t,"minDate")&&(this.minDate=t.minDate),e(t,"maxDate")&&(this.maxDate=t.maxDate),t.datesDisabled&&(this.datesDisabled=t.datesDisabled),t.daysOfWeekDisabled&&(this.daysOfWeekDisabled=t.daysOfWeekDisabled,i=!0),t.daysOfWeekHighlighted&&(this.daysOfWeekHighlighted=t.daysOfWeekHighlighted),void 0!==t.todayHighlight&&(this.todayHighlight=t.todayHighlight),void 0!==t.weekStart&&(this.weekStart=t.weekStart,this.weekEnd=t.weekEnd,i=!0),t.locale){const e=this.locale=t.locale;this.dayNames=e.daysMin,this.switchLabelFormat=e.titleFormat,i=!0}if(void 0!==t.beforeShowDay&&(this.beforeShow="function"==typeof t.beforeShowDay?t.beforeShowDay:void 0),void 0!==t.calendarWeeks)if(t.calendarWeeks&&!this.calendarWeeks){const e=F(ee).firstChild;this.calendarWeeks={element:e,dow:e.firstChild,weeks:e.lastChild},this.element.insertBefore(e,this.element.firstChild)}else this.calendarWeeks&&!t.calendarWeeks&&(this.element.removeChild(this.calendarWeeks.element),this.calendarWeeks=null);"function"==typeof t.getCalendarWeek&&(this.getCalendarWeek=t.getCalendarWeek),void 0!==t.showDaysOfWeek&&(t.showDaysOfWeek?(W(this.dow),this.calendarWeeks&&W(this.calendarWeeks.dow)):(L(this.dow),this.calendarWeeks&&L(this.calendarWeeks.dow))),i&&Array.from(this.dow.children).forEach(((e,t)=>{const i=(this.weekStart+t)%7;e.textContent=this.dayNames[i],e.className=this.daysOfWeekDisabled.includes(i)?"dow disabled":"dow"}))}updateFocus(){const e=new Date(this.picker.viewDate),t=e.getFullYear(),i=e.getMonth(),s=l(t,i,1),n=g(s,this.weekStart,this.weekStart);this.first=s,this.last=l(t,i+1,0),this.start=n,this.focused=this.picker.viewDate}updateSelection(){const{dates:e,rangepicker:t}=this.picker.datepicker;this.selected=e,t&&(this.range=t.dates)}render(){this.today=this.todayHighlight?c():void 0,this.disabled=[...this.datesDisabled];const e=O(this.focused,this.switchLabelFormat,this.locale);if(this.picker.setViewSwitchLabel(e),this.picker.setPrevBtnDisabled(this.first<=this.minDate),this.picker.setNextBtnDisabled(this.last>=this.maxDate),this.calendarWeeks){const e=g(this.first,1,this.weekStart),t=(e,t)=>this.getCalendarWeek?this.getCalendarWeek(new Date(e),t):function(e){const t=g(e,4,1),i=g(new Date(t).setMonth(0,4),4,1);return Math.round((t-i)/6048e5)+1}(e);Array.from(this.calendarWeeks.weeks.children).forEach(((i,s)=>{i.textContent=t(h(e,7*s),this.weekStart)}))}Array.from(this.grid.children).forEach(((e,t)=>{const s=e.classList,n=h(this.start,t),a=new Date(n),r=a.getDay();if(e.className=`datepicker-cell ${this.cellClass}`,e.dataset.date=n,e.textContent=a.getDate(),n<this.first?s.add("prev"):n>this.last&&s.add("next"),this.today===n&&s.add("today"),(n<this.minDate||n>this.maxDate||this.disabled.includes(n))&&s.add("disabled"),this.daysOfWeekDisabled.includes(r)&&(s.add("disabled"),i(this.disabled,n)),this.daysOfWeekHighlighted.includes(r)&&s.add("highlighted"),this.range){const[e,t]=this.range;n>e&&n<t&&s.add("range"),n===e&&s.add("range-start"),n===t&&s.add("range-end")}this.selected.includes(n)&&s.add("selected"),n===this.focused&&s.add("focused"),this.beforeShow&&this.performBeforeHook(e,n,n)}))}refresh(){const[e,t]=this.range||[];this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((e=>{e.classList.remove("range","range-start","range-end","selected","focused")})),Array.from(this.grid.children).forEach((i=>{const s=Number(i.dataset.date),n=i.classList;s>e&&s<t&&n.add("range"),s===e&&n.add("range-start"),s===t&&n.add("range-end"),this.selected.includes(s)&&n.add("selected"),s===this.focused&&n.add("focused")}))}refreshFocus(){const e=Math.round((this.focused-this.start)/864e5);this.grid.querySelectorAll(".focused").forEach((e=>{e.classList.remove("focused")})),this.grid.children[e].classList.add("focused")}}function se(e,t){if(!e||!e[0]||!e[1])return;const[[i,s],[n,a]]=e;return i>t||n<t?void 0:[i===t?s:-1,n===t?a:12]}class ne extends te{constructor(e){super(e,{id:1,name:"months",cellClass:"month"})}init(e,t=!0){t&&(this.grid=this.element,this.element.classList.add("months","datepicker-grid"),this.grid.appendChild(F(r("span",12,{"data-month":e=>e})))),super.init(e)}setOptions(t){if(t.locale&&(this.monthNames=t.locale.monthsShort),e(t,"minDate"))if(void 0===t.minDate)this.minYear=this.minMonth=this.minDate=void 0;else{const e=new Date(t.minDate);this.minYear=e.getFullYear(),this.minMonth=e.getMonth(),this.minDate=e.setDate(1)}if(e(t,"maxDate"))if(void 0===t.maxDate)this.maxYear=this.maxMonth=this.maxDate=void 0;else{const e=new Date(t.maxDate);this.maxYear=e.getFullYear(),this.maxMonth=e.getMonth(),this.maxDate=l(this.maxYear,this.maxMonth+1,0)}this.isMinView?t.datesDisabled&&(this.datesDisabled=t.datesDisabled):this.datesDisabled=[],void 0!==t.beforeShowMonth&&(this.beforeShow="function"==typeof t.beforeShowMonth?t.beforeShowMonth:void 0)}updateFocus(){const e=new Date(this.picker.viewDate);this.year=e.getFullYear(),this.focused=e.getMonth()}updateSelection(){const{dates:e,rangepicker:t}=this.picker.datepicker;this.selected=e.reduce(((e,t)=>{const s=new Date(t),n=s.getFullYear(),a=s.getMonth();return void 0===e[n]?e[n]=[a]:i(e[n],a),e}),{}),t&&t.dates&&(this.range=t.dates.map((e=>{const t=new Date(e);return isNaN(t)?void 0:[t.getFullYear(),t.getMonth()]})))}render(){this.disabled=this.datesDisabled.reduce(((e,t)=>{const i=new Date(t);return this.year===i.getFullYear()&&e.push(i.getMonth()),e}),[]),this.picker.setViewSwitchLabel(this.year),this.picker.setPrevBtnDisabled(this.year<=this.minYear),this.picker.setNextBtnDisabled(this.year>=this.maxYear);const e=this.selected[this.year]||[],t=this.year<this.minYear||this.year>this.maxYear,i=this.year===this.minYear,s=this.year===this.maxYear,n=se(this.range,this.year);Array.from(this.grid.children).forEach(((a,r)=>{const d=a.classList,o=l(this.year,r,1);if(a.className=`datepicker-cell ${this.cellClass}`,this.isMinView&&(a.dataset.date=o),a.textContent=this.monthNames[r],(t||i&&r<this.minMonth||s&&r>this.maxMonth||this.disabled.includes(r))&&d.add("disabled"),n){const[e,t]=n;r>e&&r<t&&d.add("range"),r===e&&d.add("range-start"),r===t&&d.add("range-end")}e.includes(r)&&d.add("selected"),r===this.focused&&d.add("focused"),this.beforeShow&&this.performBeforeHook(a,r,o)}))}refresh(){const e=this.selected[this.year]||[],[t,i]=se(this.range,this.year)||[];this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((e=>{e.classList.remove("range","range-start","range-end","selected","focused")})),Array.from(this.grid.children).forEach(((s,n)=>{const a=s.classList;n>t&&n<i&&a.add("range"),n===t&&a.add("range-start"),n===i&&a.add("range-end"),e.includes(n)&&a.add("selected"),n===this.focused&&a.add("focused")}))}refreshFocus(){this.grid.querySelectorAll(".focused").forEach((e=>{e.classList.remove("focused")})),this.grid.children[this.focused].classList.add("focused")}}class ae extends te{constructor(e,t){super(e,t)}init(e,t=!0){var i;t&&(this.navStep=10*this.step,this.beforeShowOption=`beforeShow${i=this.cellClass,[...i].reduce(((e,t,i)=>e+(i?t:t.toUpperCase())),"")}`,this.grid=this.element,this.element.classList.add(this.name,"datepicker-grid"),this.grid.appendChild(F(r("span",12)))),super.init(e)}setOptions(t){if(e(t,"minDate")&&(void 0===t.minDate?this.minYear=this.minDate=void 0:(this.minYear=m(t.minDate,this.step),this.minDate=l(this.minYear,0,1))),e(t,"maxDate")&&(void 0===t.maxDate?this.maxYear=this.maxDate=void 0:(this.maxYear=m(t.maxDate,this.step),this.maxDate=l(this.maxYear,11,31))),this.isMinView?t.datesDisabled&&(this.datesDisabled=t.datesDisabled):this.datesDisabled=[],void 0!==t[this.beforeShowOption]){const e=t[this.beforeShowOption];this.beforeShow="function"==typeof e?e:void 0}}updateFocus(){const e=new Date(this.picker.viewDate),t=m(e,this.navStep),i=t+9*this.step;this.first=t,this.last=i,this.start=t-this.step,this.focused=m(e,this.step)}updateSelection(){const{dates:e,rangepicker:t}=this.picker.datepicker;this.selected=e.reduce(((e,t)=>i(e,m(t,this.step))),[]),t&&t.dates&&(this.range=t.dates.map((e=>{if(void 0!==e)return m(e,this.step)})))}render(){this.disabled=this.datesDisabled.map((e=>new Date(e).getFullYear())),this.picker.setViewSwitchLabel(`${this.first}-${this.last}`),this.picker.setPrevBtnDisabled(this.first<=this.minYear),this.picker.setNextBtnDisabled(this.last>=this.maxYear),Array.from(this.grid.children).forEach(((e,t)=>{const i=e.classList,s=this.start+t*this.step,n=l(s,0,1);if(e.className=`datepicker-cell ${this.cellClass}`,this.isMinView&&(e.dataset.date=n),e.textContent=e.dataset.year=s,0===t?i.add("prev"):11===t&&i.add("next"),(s<this.minYear||s>this.maxYear||this.disabled.includes(s))&&i.add("disabled"),this.range){const[e,t]=this.range;s>e&&s<t&&i.add("range"),s===e&&i.add("range-start"),s===t&&i.add("range-end")}this.selected.includes(s)&&i.add("selected"),s===this.focused&&i.add("focused"),this.beforeShow&&this.performBeforeHook(e,s,n)}))}refresh(){const[e,t]=this.range||[];this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((e=>{e.classList.remove("range","range-start","range-end","selected","focused")})),Array.from(this.grid.children).forEach((i=>{const s=Number(i.textContent),n=i.classList;s>e&&s<t&&n.add("range"),s===e&&n.add("range-start"),s===t&&n.add("range-end"),this.selected.includes(s)&&n.add("selected"),s===this.focused&&n.add("focused")}))}refreshFocus(){const e=Math.round((this.focused-this.start)/this.step);this.grid.querySelectorAll(".focused").forEach((e=>{e.classList.remove("focused")})),this.grid.children[e].classList.add("focused")}}function re(e,t){const i={date:e.getDate(),viewDate:new Date(e.picker.viewDate),viewId:e.picker.currentView.id,datepicker:e};e.element.dispatchEvent(new CustomEvent(t,{detail:i}))}function de(e,t){const{minDate:i,maxDate:s}=e.config,{currentView:n,viewDate:r}=e.picker;let d;switch(n.id){case 0:d=u(r,t);break;case 1:d=f(r,t);break;default:d=f(r,t*n.navStep)}d=a(d,i,s),e.picker.changeFocus(d).render()}function oe(e){const t=e.picker.currentView.id;t!==e.config.maxView&&e.picker.changeView(t+1).render()}function ce(e){e.config.updateOnBlur?e.update({revert:!0}):e.refresh("input"),e.hide()}function le(e,t){const i=e.picker,s=new Date(i.viewDate),n=i.currentView.id,a=1===n?u(s,t-s.getMonth()):f(s,t-s.getFullYear());i.changeFocus(a).changeView(n-1).render()}function he(e){const t=e.picker,i=c();if(1===e.config.todayBtnMode){if(e.config.autohide)return void e.setDate(i);e.setDate(i,{render:!1}),t.update()}t.viewDate!==i&&t.changeFocus(i),t.changeView(0).render()}function ue(e){e.setDate({clear:!0})}function fe(e){oe(e)}function pe(e){de(e,-1)}function ge(e){de(e,1)}function me(e,t){const i=K(t,".datepicker-cell");if(!i||i.classList.contains("disabled"))return;const{id:s,isMinView:n}=e.picker.currentView;n?e.setDate(Number(i.dataset.date)):le(e,Number(1===s?i.dataset.month:i.dataset.year))}function we(e){e.preventDefault()}const De=["left","top","right","bottom"].reduce(((e,t)=>(e[t]=`datepicker-orient-${t}`,e)),{}),ye=e=>e?`${e}px`:e;function ke(t,i){if(void 0!==i.title&&(i.title?(t.controls.title.textContent=i.title,W(t.controls.title)):(t.controls.title.textContent="",L(t.controls.title))),i.prevArrow){const e=t.controls.prevBtn;B(e),i.prevArrow.forEach((t=>{e.appendChild(t.cloneNode(!0))}))}if(i.nextArrow){const e=t.controls.nextBtn;B(e),i.nextArrow.forEach((t=>{e.appendChild(t.cloneNode(!0))}))}if(i.locale&&(t.controls.todayBtn.textContent=i.locale.today,t.controls.clearBtn.textContent=i.locale.clear),void 0!==i.todayBtn&&(i.todayBtn?W(t.controls.todayBtn):L(t.controls.todayBtn)),e(i,"minDate")||e(i,"maxDate")){const{minDate:e,maxDate:i}=t.datepicker.config;t.controls.todayBtn.disabled=!n(c(),e,i)}void 0!==i.clearBtn&&(i.clearBtn?W(t.controls.clearBtn):L(t.controls.clearBtn))}function ve(e){const{dates:i,config:s}=e;return a(i.length>0?t(i):s.defaultViewDate,s.minDate,s.maxDate)}function be(e,t){const i=new Date(e.viewDate),s=new Date(t),{id:n,year:a,first:r,last:d}=e.currentView,o=s.getFullYear();switch(e.viewDate=t,o!==i.getFullYear()&&re(e.datepicker,"changeYear"),s.getMonth()!==i.getMonth()&&re(e.datepicker,"changeMonth"),n){case 0:return t<r||t>d;case 1:return o!==a;default:return o<r||o>d}}function xe(e){return window.getComputedStyle(e).direction}function Me(e){const t=V(e);if(t!==document.body&&t)return"visible"!==window.getComputedStyle(t).overflow?t:Me(t)}class Se{constructor(e){const{config:t}=this.datepicker=e,i=Q.replace(/%buttonClass%/g,t.buttonClass),s=this.element=F(i).firstChild,[n,a,r]=s.firstChild.children,d=n.firstElementChild,[o,c,l]=n.lastElementChild.children,[h,u]=r.firstChild.children,f={title:d,prevBtn:o,viewSwitch:c,nextBtn:l,todayBtn:h,clearBtn:u};this.main=a,this.controls=f;const p=e.inline?"inline":"dropdown";s.classList.add(`datepicker-${p}`),ke(this,t),this.viewDate=ve(e),j(e,[[s,"mousedown",we],[a,"click",me.bind(null,e)],[f.viewSwitch,"click",fe.bind(null,e)],[f.prevBtn,"click",pe.bind(null,e)],[f.nextBtn,"click",ge.bind(null,e)],[f.todayBtn,"click",he.bind(null,e)],[f.clearBtn,"click",ue.bind(null,e)]]),this.views=[new ie(this),new ne(this),new ae(this,{id:2,name:"years",cellClass:"year",step:1}),new ae(this,{id:3,name:"decades",cellClass:"decade",step:10})],this.currentView=this.views[t.startView],this.currentView.render(),this.main.appendChild(this.currentView.element),t.container?t.container.appendChild(this.element):e.inputField.after(this.element)}setOptions(e){ke(this,e),this.views.forEach((t=>{t.init(e,!1)})),this.currentView.render()}detach(){this.element.remove()}show(){if(this.active)return;const{datepicker:e,element:t}=this;if(e.inline)t.classList.add("active");else{const i=xe(e.inputField);i!==xe(V(t))?t.dir=i:t.dir&&t.removeAttribute("dir"),t.style.visiblity="hidden",t.classList.add("active"),this.place(),t.style.visiblity="",e.config.disableTouchKeyboard&&e.inputField.blur()}this.active=!0,re(e,"show")}hide(){this.active&&(this.datepicker.exitEditMode(),this.element.classList.remove("active"),this.active=!1,re(this.datepicker,"hide"))}place(){const{classList:e,offsetParent:t,style:i}=this.element,{config:s,inputField:n}=this.datepicker,{width:a,height:r}=this.element.getBoundingClientRect(),{left:d,top:o,right:c,bottom:l,width:h,height:u}=n.getBoundingClientRect();let{x:f,y:p}=s.orientation,g=d,m=o;if(t!==document.body&&t){const e=t.getBoundingClientRect();g-=e.left-t.scrollLeft,m-=e.top-t.scrollTop}else g+=window.scrollX,m+=window.scrollY;const w=Me(n);let D=0,y=0,{clientWidth:k,clientHeight:v}=document.documentElement;if(w){const e=w.getBoundingClientRect();e.top>0&&(y=e.top),e.left>0&&(D=e.left),e.right<k&&(k=e.right),e.bottom<v&&(v=e.bottom)}let b=0;"auto"===f&&(d<D?(f="left",b=D-d):d+a>k?(f="right",k<c&&(b=k-c)):f="rtl"===xe(n)?c-a<D?"left":"right":"left"),"right"===f&&(g+=h-a),g+=b,"auto"===p&&(p=o-r>y&&l+r>v?"top":"bottom"),"top"===p?m-=r:m+=u,e.remove(...Object.values(De)),e.add(De[f],De[p]),i.left=ye(g),i.top=ye(m)}setViewSwitchLabel(e){this.controls.viewSwitch.textContent=e}setPrevBtnDisabled(e){this.controls.prevBtn.disabled=e}setNextBtnDisabled(e){this.controls.nextBtn.disabled=e}changeView(e){const t=this.currentView,i=this.views[e];return i.id!==t.id&&(this.currentView=i,this._renderMethod="render",re(this.datepicker,"changeView"),this.main.replaceChild(i.element,t.element)),this}changeFocus(e){return this._renderMethod=be(this,e)?"render":"refreshFocus",this.views.forEach((e=>{e.updateFocus()})),this}update(){const e=ve(this.datepicker);return this._renderMethod=be(this,e)?"render":"refresh",this.views.forEach((e=>{e.updateFocus(),e.updateSelection()})),this}render(e=!0){const t=e&&this._renderMethod||"render";delete this._renderMethod,this.currentView[t]()}}function Ce(e,t,i,s,a,r){if(n(e,a,r)){if(s(e)){return Ce(t(e,i),t,i,s,a,r)}return e}}function Oe(e,t,i,s){const n=e.picker,a=n.currentView,r=a.step||1;let d,o,c=n.viewDate;switch(a.id){case 0:c=s?h(c,7*i):t.ctrlKey||t.metaKey?f(c,i):h(c,i),d=h,o=e=>a.disabled.includes(e);break;case 1:c=u(c,s?4*i:i),d=u,o=e=>{const t=new Date(e),{year:i,disabled:s}=a;return t.getFullYear()===i&&s.includes(t.getMonth())};break;default:c=f(c,i*(s?4:1)*r),d=f,o=e=>a.disabled.includes(m(e,r))}c=Ce(c,d,i<0?-r:r,o,a.minDate,a.maxDate),void 0!==c&&n.changeFocus(c).render()}function Ee(e,t){const i=t.key;if("Tab"===i)return void ce(e);const s=e.picker,{id:n,isMinView:a}=s.currentView;if(s.active){if(e.editMode)return void("Enter"===i?e.exitEditMode({update:!0,autohide:e.config.autohide}):"Escape"===i&&s.hide());if("ArrowLeft"===i)if(t.ctrlKey||t.metaKey)de(e,-1);else{if(t.shiftKey)return void e.enterEditMode();Oe(e,t,-1,!1)}else if("ArrowRight"===i)if(t.ctrlKey||t.metaKey)de(e,1);else{if(t.shiftKey)return void e.enterEditMode();Oe(e,t,1,!1)}else if("ArrowUp"===i)if(t.ctrlKey||t.metaKey)oe(e);else{if(t.shiftKey)return void e.enterEditMode();Oe(e,t,-1,!0)}else if("ArrowDown"===i){if(t.shiftKey&&!t.ctrlKey&&!t.metaKey)return void e.enterEditMode();Oe(e,t,1,!0)}else{if("Enter"!==i)return void("Escape"===i?s.hide():"Backspace"!==i&&"Delete"!==i&&(1!==i.length||t.ctrlKey||t.metaKey)||e.enterEditMode());if(a)return void e.setDate(s.viewDate);s.changeView(n-1).render()}}else{if("ArrowDown"!==i)return void("Enter"===i?e.update():"Escape"===i&&s.show());s.show()}t.preventDefault()}function Fe(e){e.config.showOnFocus&&!e._showing&&e.show()}function Ve(e,t){const i=t.target;(e.picker.active||e.config.showOnClick)&&(i._active=N(i),i._clicking=setTimeout((()=>{delete i._active,delete i._clicking}),2e3))}function Ne(e,t){const i=t.target;i._clicking&&(clearTimeout(i._clicking),delete i._clicking,i._active&&e.enterEditMode(),delete i._active,e.config.showOnClick&&e.show())}function Le(e,t){t.clipboardData.types.includes("text/plain")&&e.enterEditMode()}function We(e,t){const{element:i,picker:s}=e;if(!s.active&&!N(i))return;const n=s.element;K(t,(e=>e===i||e===n))||ce(e)}function Be(e,t){return e.map((e=>O(e,t.format,t.locale))).join(t.dateDelimiter)}function Ae(e,t,i=!1){const{config:s,dates:a,rangeSideIndex:r}=e;if(0===t.length)return i?[]:void 0;let d=t.reduce(((e,t)=>{let i=C(t,s.format,s.locale);return void 0===i||(i=w(i,s.pickLevel,r),!n(i,s.minDate,s.maxDate)||e.includes(i)||s.datesDisabled.includes(i)||!(s.pickLevel>0)&&s.daysOfWeekDisabled.includes(new Date(i).getDay())||e.push(i)),e}),[]);return 0!==d.length?(s.multidate&&!i&&(d=d.reduce(((e,t)=>(a.includes(t)||e.push(t),e)),a.filter((e=>!d.includes(e))))),s.maxNumberOfDates&&d.length>s.maxNumberOfDates?d.slice(-1*s.maxNumberOfDates):d):void 0}function Ye(e,t=3,i=!0){const{config:s,picker:n,inputField:a}=e;if(2&t){const e=n.active?s.pickLevel:s.startView;n.update().changeView(e).render(i)}1&t&&a&&(a.value=Be(e.dates,s))}function He(e,t,i){let{clear:s,render:n,autohide:a,revert:r}=i;void 0===n&&(n=!0),n?void 0===a&&(a=e.config.autohide):a=!1;const d=Ae(e,t,s);(d||r)&&(d&&d.toString()!==e.dates.toString()?(e.dates=d,Ye(e,n?3:1),re(e,"changeDate")):Ye(e,1),a&&e.hide())}class je{constructor(e,t={},i){e.datepicker=this,this.element=e;const n=this.config=Object.assign({buttonClass:t.buttonClass&&String(t.buttonClass)||"button",container:null,defaultViewDate:c(),maxDate:void 0,minDate:void 0},G(R,this)),a=this.inline="INPUT"!==e.tagName;let r,d;if(a?n.container=e:(t.container&&(n.container=t.container instanceof HTMLElement?t.container:document.querySelector(t.container)),r=this.inputField=e,r.classList.add("datepicker-input")),i){const e=i.inputs.indexOf(r),t=i.datepickers;if(e<0||e>1||!Array.isArray(t))throw Error("Invalid rangepicker object.");t[e]=this,Object.defineProperty(this,"rangepicker",{get:()=>i}),Object.defineProperty(this,"rangeSideIndex",{get:()=>e})}this._options=t,Object.assign(n,G(t,this)),a?(d=s(e.dataset.date,n.dateDelimiter),delete e.dataset.date):d=s(r.value,n.dateDelimiter),this.dates=[];const o=Ae(this,d);o&&o.length>0&&(this.dates=o),r&&(r.value=Be(this.dates,n));const l=this.picker=new Se(this);if(a)this.show();else{const e=We.bind(null,this);j(this,[[r,"keydown",Ee.bind(null,this)],[r,"focus",Fe.bind(null,this)],[r,"mousedown",Ve.bind(null,this)],[r,"click",Ne.bind(null,this)],[r,"paste",Le.bind(null,this)],[document,"mousedown",e],[document,"touchstart",e],[window,"resize",l.place.bind(l)]])}}static formatDate(e,t,i){return O(e,t,i&&$[i]||$.en)}static parseDate(e,t,i){return C(e,t,i&&$[i]||$.en)}static get locales(){return $}get active(){return!(!this.picker||!this.picker.active)}get pickerElement(){return this.picker?this.picker.element:void 0}setOptions(e){const t=this.picker,i=G(e,this);Object.assign(this._options,e),Object.assign(this.config,i),t.setOptions(i),Ye(this,3)}show(){if(this.inputField){if(this.inputField.disabled)return;N(this.inputField)||this.config.disableTouchKeyboard||(this._showing=!0,this.inputField.focus(),delete this._showing)}this.picker.show()}hide(){this.inline||(this.picker.hide(),this.picker.update().changeView(this.config.startView).render())}destroy(){return this.hide(),T(this),this.picker.detach(),this.inline||this.inputField.classList.remove("datepicker-input"),delete this.element.datepicker,this}getDate(e){const t=e?t=>O(t,e,this.config.locale):e=>new Date(e);return this.config.multidate?this.dates.map(t):this.dates.length>0?t(this.dates[0]):void 0}setDate(...e){const i=[...e],s={},n=t(e);"object"!=typeof n||Array.isArray(n)||n instanceof Date||!n||Object.assign(s,i.pop());He(this,Array.isArray(i[0])?i[0]:i,s)}update(e){if(this.inline)return;const t=Object.assign(e||{},{clear:!0,render:!0});He(this,s(this.inputField.value,this.config.dateDelimiter),t)}refresh(e,t=!1){let i;e&&"string"!=typeof e&&(t=e,e=void 0),i="picker"===e?2:"input"===e?1:3,Ye(this,i,!t)}enterEditMode(){this.inline||!this.picker.active||this.editMode||(this.editMode=!0,this.inputField.classList.add("in-edit"))}exitEditMode(e){if(this.inline||!this.editMode)return;const t=Object.assign({update:!1},e);delete this.editMode,this.inputField.classList.remove("in-edit"),t.update&&this.update(t)}}function Te(e){const t=Object.assign({},e);return delete t.inputs,delete t.allowOneSidedRange,delete t.maxNumberOfDates,t}function _e(e,t,i,s){j(e,[[i,"changeDate",t]]),new je(i,s,e)}function Ke(e,t){if(e._updating)return;e._updating=!0;const i=t.target;if(void 0===i.datepicker)return;const s=e.datepickers,n={render:!1},a=e.inputs.indexOf(i),r=0===a?1:0,d=s[a].dates[0],o=s[r].dates[0];void 0!==d&&void 0!==o?0===a&&d>o?(s[0].setDate(o,n),s[1].setDate(d,n)):1===a&&d<o&&(s[0].setDate(d,n),s[1].setDate(o,n)):e.allowOneSidedRange||void 0===d&&void 0===o||(n.clear=!0,s[r].setDate(s[a].dates,n)),s[0].picker.update().render(),s[1].picker.update().render(),delete e._updating}window.Datepicker=je,window.DateRangePicker=class{constructor(e,t={}){const i=Array.isArray(t.inputs)?t.inputs:Array.from(e.querySelectorAll("input"));if(i.length<2)return;e.rangepicker=this,this.element=e,this.inputs=i.slice(0,2),this.allowOneSidedRange=!!t.allowOneSidedRange;const s=Ke.bind(null,this),n=Te(t),a=[];Object.defineProperty(this,"datepickers",{get:()=>a}),_e(this,s,this.inputs[0],n),_e(this,s,this.inputs[1],n),Object.freeze(a),a[0].dates.length>0?Ke(this,{target:this.inputs[0]}):a[1].dates.length>0&&Ke(this,{target:this.inputs[1]})}get dates(){return 2===this.datepickers.length?[this.datepickers[0].dates[0],this.datepickers[1].dates[0]]:void 0}setOptions(e){this.allowOneSidedRange=!!e.allowOneSidedRange;const t=Te(e);this.datepickers[0].setOptions(t),this.datepickers[1].setOptions(t)}destroy(){this.datepickers[0].destroy(),this.datepickers[1].destroy(),T(this),delete this.element.rangepicker}getDates(e){const t=e?t=>O(t,e,this.datepickers[0].config.locale):e=>new Date(e);return this.dates.map((e=>void 0===e?e:t(e)))}setDates(e,t){const[i,s]=this.datepickers,n=this.dates;this._updating=!0,i.setDate(e),s.setDate(t),delete this._updating,s.dates[0]!==n[1]?Ke(this,{target:this.inputs[1]}):i.dates[0]!==n[0]&&Ke(this,{target:this.inputs[0]})}}}();

!function(e){var t=function(u,D,f){"use strict";var k,H;if(function(){var e;var t={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",fastLoadedClass:"ls-is-cached",iframeLoadMode:0,srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:true,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:true,ricTimeout:0,throttleDelay:125};H=u.lazySizesConfig||u.lazysizesConfig||{};for(e in t){if(!(e in H)){H[e]=t[e]}}}(),!D||!D.getElementsByClassName){return{init:function(){},cfg:H,noSupport:true}}var O=D.documentElement,i=u.HTMLPictureElement,P="addEventListener",$="getAttribute",q=u[P].bind(u),I=u.setTimeout,U=u.requestAnimationFrame||I,o=u.requestIdleCallback,j=/^picture$/i,r=["load","error","lazyincluded","_lazyloaded"],a={},G=Array.prototype.forEach,J=function(e,t){if(!a[t]){a[t]=new RegExp("(\\s|^)"+t+"(\\s|$)")}return a[t].test(e[$]("class")||"")&&a[t]},K=function(e,t){if(!J(e,t)){e.setAttribute("class",(e[$]("class")||"").trim()+" "+t)}},Q=function(e,t){var a;if(a=J(e,t)){e.setAttribute("class",(e[$]("class")||"").replace(a," "))}},V=function(t,a,e){var i=e?P:"removeEventListener";if(e){V(t,a)}r.forEach(function(e){t[i](e,a)})},X=function(e,t,a,i,r){var n=D.createEvent("Event");if(!a){a={}}a.instance=k;n.initEvent(t,!i,!r);n.detail=a;e.dispatchEvent(n);return n},Y=function(e,t){var a;if(!i&&(a=u.picturefill||H.pf)){if(t&&t.src&&!e[$]("srcset")){e.setAttribute("srcset",t.src)}a({reevaluate:true,elements:[e]})}else if(t&&t.src){e.src=t.src}},Z=function(e,t){return(getComputedStyle(e,null)||{})[t]},s=function(e,t,a){a=a||e.offsetWidth;while(a<H.minSize&&t&&!e._lazysizesWidth){a=t.offsetWidth;t=t.parentNode}return a},ee=function(){var a,i;var t=[];var r=[];var n=t;var s=function(){var e=n;n=t.length?r:t;a=true;i=false;while(e.length){e.shift()()}a=false};var e=function(e,t){if(a&&!t){e.apply(this,arguments)}else{n.push(e);if(!i){i=true;(D.hidden?I:U)(s)}}};e._lsFlush=s;return e}(),te=function(a,e){return e?function(){ee(a)}:function(){var e=this;var t=arguments;ee(function(){a.apply(e,t)})}},ae=function(e){var a;var i=0;var r=H.throttleDelay;var n=H.ricTimeout;var t=function(){a=false;i=f.now();e()};var s=o&&n>49?function(){o(t,{timeout:n});if(n!==H.ricTimeout){n=H.ricTimeout}}:te(function(){I(t)},true);return function(e){var t;if(e=e===true){n=33}if(a){return}a=true;t=r-(f.now()-i);if(t<0){t=0}if(e||t<9){s()}else{I(s,t)}}},ie=function(e){var t,a;var i=99;var r=function(){t=null;e()};var n=function(){var e=f.now()-a;if(e<i){I(n,i-e)}else{(o||r)(r)}};return function(){a=f.now();if(!t){t=I(n,i)}}},e=function(){var v,m,c,h,e;var y,z,g,p,C,b,A;var n=/^img$/i;var d=/^iframe$/i;var E="onscroll"in u&&!/(gle|ing)bot/.test(navigator.userAgent);var _=0;var w=0;var M=0;var N=-1;var L=function(e){M--;if(!e||M<0||!e.target){M=0}};var x=function(e){if(A==null){A=Z(D.body,"visibility")=="hidden"}return A||!(Z(e.parentNode,"visibility")=="hidden"&&Z(e,"visibility")=="hidden")};var W=function(e,t){var a;var i=e;var r=x(e);g-=t;b+=t;p-=t;C+=t;while(r&&(i=i.offsetParent)&&i!=D.body&&i!=O){r=(Z(i,"opacity")||1)>0;if(r&&Z(i,"overflow")!="visible"){a=i.getBoundingClientRect();r=C>a.left&&p<a.right&&b>a.top-1&&g<a.bottom+1}}return r};var t=function(){var e,t,a,i,r,n,s,o,l,u,f,c;var d=k.elements;if((h=H.loadMode)&&M<8&&(e=d.length)){t=0;N++;for(;t<e;t++){if(!d[t]||d[t]._lazyRace){continue}if(!E||k.prematureUnveil&&k.prematureUnveil(d[t])){R(d[t]);continue}if(!(o=d[t][$]("data-expand"))||!(n=o*1)){n=w}if(!u){u=!H.expand||H.expand<1?O.clientHeight>500&&O.clientWidth>500?500:370:H.expand;k._defEx=u;f=u*H.expFactor;c=H.hFac;A=null;if(w<f&&M<1&&N>2&&h>2&&!D.hidden){w=f;N=0}else if(h>1&&N>1&&M<6){w=u}else{w=_}}if(l!==n){y=innerWidth+n*c;z=innerHeight+n;s=n*-1;l=n}a=d[t].getBoundingClientRect();if((b=a.bottom)>=s&&(g=a.top)<=z&&(C=a.right)>=s*c&&(p=a.left)<=y&&(b||C||p||g)&&(H.loadHidden||x(d[t]))&&(m&&M<3&&!o&&(h<3||N<4)||W(d[t],n))){R(d[t]);r=true;if(M>9){break}}else if(!r&&m&&!i&&M<4&&N<4&&h>2&&(v[0]||H.preloadAfterLoad)&&(v[0]||!o&&(b||C||p||g||d[t][$](H.sizesAttr)!="auto"))){i=v[0]||d[t]}}if(i&&!r){R(i)}}};var a=ae(t);var S=function(e){var t=e.target;if(t._lazyCache){delete t._lazyCache;return}L(e);K(t,H.loadedClass);Q(t,H.loadingClass);V(t,B);X(t,"lazyloaded")};var i=te(S);var B=function(e){i({target:e.target})};var T=function(e,t){var a=e.getAttribute("data-load-mode")||H.iframeLoadMode;if(a==0){e.contentWindow.location.replace(t)}else if(a==1){e.src=t}};var F=function(e){var t;var a=e[$](H.srcsetAttr);if(t=H.customMedia[e[$]("data-media")||e[$]("media")]){e.setAttribute("media",t)}if(a){e.setAttribute("srcset",a)}};var s=te(function(t,e,a,i,r){var n,s,o,l,u,f;if(!(u=X(t,"lazybeforeunveil",e)).defaultPrevented){if(i){if(a){K(t,H.autosizesClass)}else{t.setAttribute("sizes",i)}}s=t[$](H.srcsetAttr);n=t[$](H.srcAttr);if(r){o=t.parentNode;l=o&&j.test(o.nodeName||"")}f=e.firesLoad||"src"in t&&(s||n||l);u={target:t};K(t,H.loadingClass);if(f){clearTimeout(c);c=I(L,2500);V(t,B,true)}if(l){G.call(o.getElementsByTagName("source"),F)}if(s){t.setAttribute("srcset",s)}else if(n&&!l){if(d.test(t.nodeName)){T(t,n)}else{t.src=n}}if(r&&(s||l)){Y(t,{src:n})}}if(t._lazyRace){delete t._lazyRace}Q(t,H.lazyClass);ee(function(){var e=t.complete&&t.naturalWidth>1;if(!f||e){if(e){K(t,H.fastLoadedClass)}S(u);t._lazyCache=true;I(function(){if("_lazyCache"in t){delete t._lazyCache}},9)}if(t.loading=="lazy"){M--}},true)});var R=function(e){if(e._lazyRace){return}var t;var a=n.test(e.nodeName);var i=a&&(e[$](H.sizesAttr)||e[$]("sizes"));var r=i=="auto";if((r||!m)&&a&&(e[$]("src")||e.srcset)&&!e.complete&&!J(e,H.errorClass)&&J(e,H.lazyClass)){return}t=X(e,"lazyunveilread").detail;if(r){re.updateElem(e,true,e.offsetWidth)}e._lazyRace=true;M++;s(e,t,r,i,a)};var r=ie(function(){H.loadMode=3;a()});var o=function(){if(H.loadMode==3){H.loadMode=2}r()};var l=function(){if(m){return}if(f.now()-e<999){I(l,999);return}m=true;H.loadMode=3;a();q("scroll",o,true)};return{_:function(){e=f.now();k.elements=D.getElementsByClassName(H.lazyClass);v=D.getElementsByClassName(H.lazyClass+" "+H.preloadClass);q("scroll",a,true);q("resize",a,true);q("pageshow",function(e){if(e.persisted){var t=D.querySelectorAll("."+H.loadingClass);if(t.length&&t.forEach){U(function(){t.forEach(function(e){if(e.complete){R(e)}})})}}});if(u.MutationObserver){new MutationObserver(a).observe(O,{childList:true,subtree:true,attributes:true})}else{O[P]("DOMNodeInserted",a,true);O[P]("DOMAttrModified",a,true);setInterval(a,999)}q("hashchange",a,true);["focus","mouseover","click","load","transitionend","animationend"].forEach(function(e){D[P](e,a,true)});if(/d$|^c/.test(D.readyState)){l()}else{q("load",l);D[P]("DOMContentLoaded",a);I(l,2e4)}if(k.elements.length){t();ee._lsFlush()}else{a()}},checkElems:a,unveil:R,_aLSL:o}}(),re=function(){var a;var n=te(function(e,t,a,i){var r,n,s;e._lazysizesWidth=i;i+="px";e.setAttribute("sizes",i);if(j.test(t.nodeName||"")){r=t.getElementsByTagName("source");for(n=0,s=r.length;n<s;n++){r[n].setAttribute("sizes",i)}}if(!a.detail.dataAttr){Y(e,a.detail)}});var i=function(e,t,a){var i;var r=e.parentNode;if(r){a=s(e,r,a);i=X(e,"lazybeforesizes",{width:a,dataAttr:!!t});if(!i.defaultPrevented){a=i.detail.width;if(a&&a!==e._lazysizesWidth){n(e,r,i,a)}}}};var e=function(){var e;var t=a.length;if(t){e=0;for(;e<t;e++){i(a[e])}}};var t=ie(e);return{_:function(){a=D.getElementsByClassName(H.autosizesClass);q("resize",t)},checkElems:t,updateElem:i}}(),t=function(){if(!t.i&&D.getElementsByClassName){t.i=true;re._();e._()}};return I(function(){H.init&&t()}),k={cfg:H,autoSizer:re,loader:e,init:t,uP:Y,aC:K,rC:Q,hC:J,fire:X,gW:s,rAF:ee}}(e,e.document,Date);e.lazySizes=t,"object"==typeof module&&module.exports&&(module.exports=t)}("undefined"!=typeof window?window:{});
//add simple support for background images:
document.addEventListener('lazybeforeunveil', function(e){ var bg = e.target.getAttribute('data-bg');
    if(bg){  e.target.style.backgroundImage = 'url(' + bg + ')'; }
});
/*!
 * maska v1.5.0
 * (c) 2019-2021 Alexander Shabunevich
 * Released under the MIT License.
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Maska={})}(this,(function(e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var s={"#":{pattern:/[0-9]/},X:{pattern:/[0-9a-zA-Z]/},S:{pattern:/[a-zA-Z]/},A:{pattern:/[a-zA-Z]/,uppercase:!0},a:{pattern:/[a-zA-Z]/,lowercase:!0},"!":{escape:!0},"*":{repeat:!0}};function i(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:s,r=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];return u(t).length>1?l(t)(e,t,n,r):p(e,t,n,r)}function u(e){try{return JSON.parse(e)}catch(t){return[e]}}function l(e){var t=u(e).sort((function(e,t){return e.length-t.length}));return function(e,r,a){var o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],s=t.map((function(t){return p(e,t,a,!1)})),i=s.pop();for(var u in t)if(n(i,t[u],a))return p(e,t[u],a,o);return""};function n(e,t,n){for(var r in n)n[r].escape&&(t=t.replace(new RegExp(r+".{1}","g"),""));return t.split("").filter((function(e){return n[e]&&n[e].pattern})).length>=e.length}}function p(e,t,n){for(var r=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],a=0,o=0,s="",i="";a<t.length&&o<e.length;){var u=t[a],l=e[o],p=n[u];if(p&&p.pattern)p.pattern.test(l)&&(s+=c(l,p),a++,r&&t[a]&&(n[t[a]]?n[t[a]]&&n[t[a]].escape&&(s+=t[a+1],a+=2):(s+=t[a],a++))),o++;else if(p&&p.repeat){var f=n[t[a-1]];f&&!f.pattern.test(l)?a++:a--}else p&&p.escape&&(u=t[++a]),r&&(s+=u),l===u&&o++,a++}for(;r&&a<t.length;){var v=t[a];if(n[v]){i="";break}i+=v,a++}return s+i}function c(e,t){return t.transform&&(e=t.transform(e)),t.uppercase?e.toLocaleUpperCase():t.lowercase?e.toLocaleLowerCase():e}function f(e){return e instanceof HTMLInputElement?e:e.querySelector("input")||e}function v(e){return"[object String]"===Object.prototype.toString.call(e)}var d=function(){function e(n){var r=this,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(t(this,e),!n)throw new Error("Maska: no element for mask");if(null!=a.preprocessor&&"function"!=typeof a.preprocessor)throw new Error("Maska: preprocessor must be a function");if(a.tokens)for(var i in a.tokens)a.tokens[i]=o({},a.tokens[i]),a.tokens[i].pattern&&v(a.tokens[i].pattern)&&(a.tokens[i].pattern=new RegExp(a.tokens[i].pattern));this._opts={mask:a.mask,tokens:o(o({},s),a.tokens),preprocessor:a.preprocessor},this._el=v(n)?document.querySelectorAll(n):n.length?n:[n],this.inputEvent=function(e){return r.updateValue(e.target,e)},this.init()}var r,a,u;return r=e,(a=[{key:"init",value:function(){for(var e=this,t=function(t){var n=f(e._el[t]);!e._opts.mask||n.dataset.mask&&n.dataset.mask===e._opts.mask||(n.dataset.mask=e._opts.mask),setTimeout((function(){return e.updateValue(n)}),0),n.dataset.maskInited||(n.dataset.maskInited=!0,n.addEventListener("input",e.inputEvent),n.addEventListener("beforeinput",e.beforeInput))},n=0;n<this._el.length;n++)t(n)}},{key:"destroy",value:function(){for(var e=0;e<this._el.length;e++){var t=f(this._el[e]);t.removeEventListener("input",this.inputEvent),t.removeEventListener("beforeinput",this.beforeInput),delete t.dataset.mask,delete t.dataset.maskInited}}},{key:"updateValue",value:function(e,t){if(e&&e.type){var n=e.type.match(/^number$/i)&&e.validity.badInput;if(!e.value&&!n||!e.dataset.mask)return e.dataset.maskRawValue="",void this.dispatch("maska",e,t);var r=e.selectionEnd,a=e.value,o=a[r-1];e.dataset.maskRawValue=i(e.value,e.dataset.mask,this._opts.tokens,!1);var s=e.value;this._opts.preprocessor&&(s=this._opts.preprocessor(s)),e.value=i(s,e.dataset.mask,this._opts.tokens),t&&"insertText"===t.inputType&&r===a.length&&(r=e.value.length),function(e,t,n){for(;t&&t<e.value.length&&e.value.charAt(t-1)!==n;)t++;(e.type?e.type.match(/^(text|search|password|tel|url)$/i):!e.type)&&e===document.activeElement&&(e.setSelectionRange(t,t),setTimeout((function(){e.setSelectionRange(t,t)}),0))}(e,r,o),this.dispatch("maska",e,t),e.value!==a&&this.dispatch("input",e,t)}}},{key:"beforeInput",value:function(e){e&&e.target&&e.target.type&&e.target.type.match(/^number$/i)&&e.data&&isNaN(e.target.value+e.data)&&e.preventDefault()}},{key:"dispatch",value:function(e,t,n){t.dispatchEvent(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=document.createEvent("Event");return n.initEvent(e,!0,!0),t&&(n.inputType=t),n}(e,n&&n.inputType||null))}}])&&n(r.prototype,a),u&&n(r,u),e}();var h,k=(h=new WeakMap,function(e,t){t.value&&(h.has(e)&&!function(e){return!(v(e.value)&&e.value===e.oldValue||Array.isArray(e.value)&&JSON.stringify(e.value)===JSON.stringify(e.oldValue)||e.value&&e.value.mask&&e.oldValue&&e.oldValue.mask&&e.value.mask===e.oldValue.mask)}(t)||h.set(e,new d(e,function(e){var t={};return e.mask?(t.mask=Array.isArray(e.mask)?JSON.stringify(e.mask):e.mask,t.tokens=e.tokens?o({},e.tokens):{},t.preprocessor=e.preprocessor):t.mask=Array.isArray(e)?JSON.stringify(e):e,t}(t.value))))});function m(e){e.directive("maska",k)}"undefined"!=typeof window&&window.Vue&&window.Vue.use&&window.Vue.use(m),e.create=function(e,t){return new d(e,t)},e.default=m,e.install=m,e.mask=i,e.maska=k,e.tokens=s,Object.defineProperty(e,"__esModule",{value:!0})}));
