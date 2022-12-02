 document.addEventListener("DOMContentLoaded", function (event) {




     /* ==============================================
     mobile menu
     ============================================== */

     function Status() {

         this.containerElem = '#status'
         this.headerElem = '#status_header'
         this.msgElem = '#status_msg'
         this.btnElem = '#status_btn'
         this.timeOut = 10000,
             this.autoHide = true

         this.init = function () {
             let elem = document.createElement('div')
             elem.setAttribute('id', 'status')
             elem.innerHTML = '<div id="status_header"></div> <div id="status_msg"></div><div id="status_btn"></div>'
             document.body.append(elem)

             document.querySelector(this.btnElem).addEventListener('click', function () {
                 this.parentNode.setAttribute('class', '')
                 console.log(this.parentNode)
             })
         }

         this.msg = function (_msg, _header) {
             _header = (_header ? _header : 'Успешно')
             this.onShow('complete', _header, _msg)
             if (this.autoHide) {
                 this.onHide();
             }
         }
         this.err = function (_msg, _header) {
             _header = (_header ? _header : 'Ошибка')
             this.onShow('error', _header, _msg)
             if (this.autoHide) {
                 this.onHide();
             }
         }
         this.wrn = function (_msg, _header) {
             _header = (_header ? _header : 'Внимание')
             this.onShow('warning', _header, _msg)
             if (this.autoHide) {
                 this.onHide();
             }
         }

         this.onShow = function (_type, _header, _msg) {
             document.querySelector(this.headerElem).innerText = _header
             document.querySelector(this.msgElem).innerText = _msg
             document.querySelector(this.containerElem).classList.add(_type)
         }

         this.onHide = function () {
             setTimeout(() => {
                 document.querySelector(this.containerElem).setAttribute('class', '')
             }, this.timeOut);
         }

     }

     window.STATUS = new Status();
     const STATUS = window.STATUS;
     STATUS.init();



     /******************************************** 
      * ajax request
      ********************************************/

     window.ajax = function (params, response) {

         //params Object
         //dom element
         //collback function

         let xhr = new XMLHttpRequest();
         xhr.open((params.type ? params.type : 'POST'), params.url)

         if (params.responseType == 'json') {
             xhr.responseType = 'json';
             xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
         }

         xhr.send(JSON.stringify(params.data))

         xhr.onload = function () {
             response(xhr.status, xhr.response)
         };

         xhr.onerror = function () {
             window.STATUS.err('Error: ajax request failed')
         };

         xhr.onreadystatechange = function () {

             if (xhr.readyState == 3 && params.btn) {
                 params.btn.classList.add('btn-loading')
             }

             if (xhr.readyState == 4 && params.btn) {
                 setTimeout(function () {
                     params.btn.classList.remove('btn-loading')
                 }, 300)
             }

         };
     }




     /* ==============================================
     mobile menu
     ============================================== */

     const elContainer = document.querySelector('[data-menu="container"]')
     const elButton = document.querySelector('[data-menu="btn"]')

     function mobileMenu(params) {
         this.el = params.elContainer;
         this.button = params.elButton;
         this.state = 'close';

         this.open = function () {

             if (window.userMenuInstance) {
                 window.userMenuInstance.close()
             }

             if (document.querySelector('.banner-header')) {
                 document.querySelector('.banner-header').style.display = 'none'
                 document.querySelector('.banner-header-mobile').style.display = 'none'
             }

             this.el.classList.add('open')
             this.button.classList.add('open')
             document.body.classList.add('hidden')
             this.state = 'open';

         }

         this.close = function () {

             this.el.classList.add('close-animate')
             this.button.classList.remove('open')

             if (document.querySelector('.banner-header')) {
                 document.querySelector('.banner-header').style.display = 'block'
                 document.querySelector('.banner-header-mobile').style.display = 'block'
             }

             setTimeout(() => {
                 this.el.classList.remove('open')
                 this.el.classList.remove('close-animate')
                 document.body.classList.remove('hidden')
                 this.state = 'close'
             }, 200)


         }

         this.toggle = function () {
             if (this.state == 'close') this.open()
             else this.close()
         }
     }

     window.menuInstanse = new mobileMenu({
         elButton,
         elContainer
     })

     elButton.addEventListener('click', function () {
         window.menuInstanse.toggle()
     })

     /* ==============================================
     select
     ============================================== */

     // public methods
     // select.afSelect.open()
     // select.afSelect.close()
     // select.afSelect.update()

     const selectCustom = new customSelect({
         selector: 'select'
     })

     selectCustom.init()

     /* ================================================
     user-menu data-user-menu="open"
     ================================================*/

     if (document.querySelector('[data-user-menu="open"]')) {



         function userMenu() {

             this.btn = document.querySelector('[data-user-menu="open"]')
             this.container = document.querySelector('.moderator-aside')

             this.open = function () {

                 if (!document.querySelector('.moderator-aside')) {
                     window.location = this.btn.dataset.link;
                     return false
                 }

                 this.container.classList.add('open')
                 this.btn.classList.add('open')

                 if (window.menuInstanse) {
                     window.menuInstanse.close()
                 }

                 document.body.classList.add('hidden-profile')

             }

             this.close = function () {

                 if (!this.container) {
                     return false
                 }

                 this.container.classList.remove('open')
                 this.btn.classList.remove('open')
                 document.body.classList.remove('hidden-profile')

                 //close invite form
                 if (document.querySelector('.moderator-aside__form')) {
                     document.querySelector('.moderator-aside__form').classList.remove('open')
                 }
             }

             this.toggle = function () {
                 if (!this.btn.classList.contains('open')) this.open()
                 else this.close()

             }

             this.init = function () {
                 this.btn.addEventListener('click', () => {
                     this.toggle()
                 })
             }
         }

         window.userMenuInstance = new userMenu()
         window.userMenuInstance.init()



     }

     /* =========================================
     datepicker
     ========================================= */

     window.initDatepicker = function (input, option) {

         // input - input DOM elem

         if (!input.datepicker) {
             let datepicker = new Datepicker(input, {
                 autohide: true,
                 language: (input.dataset.datepickerLang ? input.dataset.datepickerLang : 'ru')
             });

             if (option.autoShow) datepicker.show()

             input.addEventListener('changeDate', function (event) {
                 if (event.target.value) {
                     input.setAttribute('area-valid', 'true')
                 } else {
                     input.removeAttribute('area-valid')
                 }
             })

             input.datepicker.picker.element.classList.add('picker-custom-offset');
         }
     }

     if (document.querySelector('[data-datepicker-lang]')) {
         (function () {
             Datepicker.locales.ru = {
                 days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
                 daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
                 daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                 months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                 monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                 today: "Сегодня",
                 clear: "Очистить",
                 format: "dd.mm.yyyy",
                 weekStart: 1,
                 monthsTitle: 'Месяцы'
             }
         })();
     }

     if (document.querySelector('.input-datepicker')) {

         document.querySelectorAll('.input-datepicker').forEach(function (input) {
             input.addEventListener('focus', function (event) {

                 window.initDatepicker(input, {
                     autoShow: true
                 })

             })

             // click on icons
             input.parentNode.addEventListener('click', function (event) {
                 input.focus()
             })
         })
     }

     //clear datepicker

     function initClearDatepicker() {
         if (document.querySelectorAll('.clear-calendar').length) {

             document.querySelectorAll('.clear-calendar').forEach(function (item) {

                 console.log(item.parentNode.querySelector('input'))

                 item.parentNode.querySelector('input').addEventListener('changeDate', function () {
                     item.style.display = 'block'
                 })

                 // asasas

                 item.addEventListener('click', function (e) {
                     e.stopPropagation(true)

                     let container = e.target.closest('.lineup__date')

                     container.querySelector('input').value = ''
                     container.querySelector('input').removeAttribute('area-valid')

                     item.style.display = 'none'



                 })
             })
         }
     }

     initClearDatepicker()

     /* =========================================
     копировать в буфер
     ========================================= */

     document.querySelectorAll('[data-copy]').forEach(function (item) {
         item.addEventListener('click', function (event) {
             navigator.clipboard.writeText(event.target.dataset.copy)
                 .then(() => {
                     window.STATUS.msg('Ссылка скопирована в буфер обмена')
                 })
                 .catch(err => {
                     console.log('Error', err);
                 });
         })
     })

     /* =================================================
     scroll
     ================================================= */
     window.scrollToTargetAdjusted = function (elem) {

         //elem string selector

         if (!document.querySelector(elem)) return false;

         var element = document.querySelector(elem);
         var headerOffset = -120;
         var elementPosition = element.offsetTop
         var offsetPosition = elementPosition - headerOffset;

         window.scrollTo({
             top: offsetPosition - 100
         });

         window.scrollTo({
             top: offsetPosition,
             behavior: "smooth"
         });
     }



     /* ======================================================
     scroll
     ======================================================*/

     //  if (document.body.clientWidth > 480 && document.querySelector('#fullpage')) {
     //      new fullpage('#fullpage', {
     //          //options here
     //          autoScrolling: true,
     //          scrollHorizontally: true,
     //          fitToSectionDelay: 100,
     //          fitToSection: true,
     //          fitToSectionDelay: 100,
     //          scrollingSpeed: 550,
     //      });
     //  }

     //  if (document.body.clientWidth > 480 && document.querySelector('#fullpageAbout')) {
     //      new fullpage('#fullpageAbout', {
     //          //options here
     //          sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', 'whitesmoke', '#ccddff']

     //      });
     //  }

     /*==================================================
     splide
     ==================================================*/

     if (document.querySelector('[data-slider="home"]') && document.body.clientWidth > 992) {
         var sliderPage = new Splide('[data-slider="home"]', {

             //type: 'loop',
             //perPage: 1,
             //autoplay: true,
             //interval: 8000,
             //updateOnMove: true,
             pagination: false,
             arrows: false,


             height: 'calc(100vh - 240px)',

             direction: 'ttb',

             wheel: true,
             wheelMinThreshold: 50,
             //wheelMinThreshold: '',
             wheelSleep: 150,

             breakpoints: {

                 767: {
                     height: 'auto',
                     wheel: false,
                 },


             }


         });

         sliderPage.mount();
     }

     /* =============================================
     about history
     =============================================*/

     if (document.querySelector('[data-slider="about-history"]')) {
         var sliderAboutHistory = new Splide('[data-slider="about-history"]', {

             arrows: false,
             pagination: false,
             gap: 30,
             autoWidth: true,
             start: 0,
             perPage: 1,
             flickMaxPages: 3,
             updateOnMove: true,
             throttle: 300,


             breakpoints: {
                 760: {
                     perPage: 1,
                     gap: 15,
                 },
             },



         });


         const prevHistory = document.querySelector('[data-slider-prev="about-history"]')
         const nextHistory = document.querySelector('[data-slider-next="about-history"]')

         prevHistory.addEventListener('click', e => {
             sliderAboutHistory.go('<')
         })

         nextHistory.addEventListener('click', e => {
             sliderAboutHistory.go('>')
         })

         sliderAboutHistory.mount();
     }

     /* ============================================
     slider="about"
     ============================================*/


     if (document.querySelector('[data-slider="about"]')) {
         var sliderPage = new Splide('[data-slider="about"]', {

             pagination: false,
             arrows: false,
             height: 'calc(100vh - 240px)',

             wheel: true,
             wheelMinThreshold: 50,
             wheelSleep: 150,

             drag: false,

             breakpoints: {
                 767: {
                     height: 'auto',
                     wheel: false,
                 },
             }

         });

         sliderPage.mount();
     }



     if (document.querySelector('[data-slider="program"]')) {

         var sliderProgram = new Splide('[data-slider="program"]', {

             type: 'loop',
             perPage: 2,
             focus: 'center',
             //autoplay: true,
             //interval: 8000,
             flickMaxPages: 3,
             updateOnMove: true,
             pagination: false,
             padding: '13%',
             throttle: 300,
             gap: 10,

             breakpoints: {
                 767: {
                     perPage: 1,
                     padding: '0%'
                 },

                 992: {
                     perPage: 1.5,
                     padding: '0%'
                 },
             }
         });

         const prevButton = document.querySelector('[data-slider-prev="program"]')
         const nextButton = document.querySelector('[data-slider-next="program"]')

         prevButton.addEventListener('click', e => {
             sliderProgram.go('<')
         })

         nextButton.addEventListener('click', e => {
             sliderProgram.go('>')
         })

         sliderProgram.on('active', (Slide) => {

             const textContainer = document.querySelector('.main-program__name span')

             textContainer.classList.add('change-transition-right')


             setTimeout(() => {
                 textContainer.innerHTML = Slide.slide.getAttribute('data-program')
                 textContainer.classList.remove('change-transition-right')
             }, 300)
         })


         sliderProgram.mount();

     }


     /*==================================================
     events
     ==================================================*/

     if (document.querySelector('[data-slider="events"]')) {

         var sliderEvents = new Splide('[data-slider="events"]', {

             type: 'loop',
             perPage: 3,
             focus: 'center',
             //autoplay: true,
             //interval: 8000,
             flickMaxPages: 3,
             updateOnMove: true,
             pagination: false,
             arrows: false,
             throttle: 300,
             gap: 30,
             breakpoints: {

                 767: {
                     perPage: 1,

                 },

                 992: {
                     perPage: 2,

                 },
             }

         });

         const prevButton = document.querySelector('[data-slider-prev="events"]')
         const nextButton = document.querySelector('[data-slider-next="events"]')

         prevButton.addEventListener('click', e => {
             sliderEvents.go('<')
         })

         nextButton.addEventListener('click', e => {
             sliderEvents.go('>')
         })



         sliderEvents.mount();

     }

     /* ===================================================
     main
     ===================================================*/

     if (document.querySelector('[data-slider="banner"]')) {

         var sliderBanner = new Splide('[data-slider="banner"]', {

             type: 'loop',
             perPage: 1,
             focus: 'center',
             autoplay: true,
             interval: 8000,
             flickMaxPages: 3,
             updateOnMove: true,
             pagination: true,
             throttle: 300,
             arrows: false
         });

         sliderBanner.on('mounted', (Slide) => {

             const play = document.createElement('li')

             play.classList.add('button-play')
             play.classList.add('play')

             play.addEventListener('click', function (e) {
                 e.target.classList.toggle('pause')
             })

             const pagination = sliderBanner.root.querySelector('.splide__pagination')

             pagination.insertBefore(play, pagination.firstElementChild);

         })

         sliderBanner.mount();

     }


     /* popup founder details*/

     if (document.querySelectorAll('.card-founder__more').length) {

         document.querySelectorAll('.card-founder__more').forEach(item => {
             item.addEventListener('click', function (e) {

                 const popup = new customModal()
                 popup.open('<div class="founder-desc" >' + e.target.closest('.card-founder').innerHTML + '</div>')

             })
         })

     }






 });