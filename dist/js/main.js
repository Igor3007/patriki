document.addEventListener('DOMContentLoaded', function (event) {
    //more text

    if (document.querySelector('.about-user__biography')) {
        const textContainer = document.querySelector('.about-user__biography');
        const moreBtn = document.querySelector('.about-user__more');

        if (textContainer.innerText.length > 300) {
            textContainer.classList.add('js-crop-text')
            moreBtn.style.display = 'block'

            moreBtn.addEventListener('click', function (e) {

                textContainer.classList.toggle('js-crop-text')
                moreBtn.classList.toggle('open')

                if (textContainer.classList.contains('js-crop-text')) {
                    moreBtn.querySelector('span').innerText = this.querySelector('span').dataset.textShow
                } else {
                    moreBtn.querySelector('span').innerText = this.querySelector('span').dataset.textHide
                }
            })
        }
    }

    //awards

    if (document.querySelector('.awards-user__list')) {
        const listItem = document.querySelectorAll('.awards-user__list ul li')
        const moreButton = document.querySelector('.awards-user__more')

        console.log(listItem.length)

        if (listItem.length > 5) {
            moreButton.style.display = 'block'

            moreButton.addEventListener('click', function (e) {

                document.querySelector('.awards-user__list').classList.toggle('js-all-text')

                if (document.querySelector('.awards-user__list').classList.contains('js-all-text')) {
                    moreButton.querySelector('.btn').innerText = this.querySelector('.btn').dataset.textHide
                } else {
                    moreButton.querySelector('.btn').innerText = this.querySelector('.btn').dataset.textShow
                }
            })
        }
    }

    //hall search

    function findFilm() {

        this.items = document.querySelectorAll('[data-find="film-container"] > div')
        this.input = document.querySelector('[data-find="film-input"]')



        this.init = function () {
            this.addEvents()
        }

        this.render = function (q) {
            this.items.forEach(item => {
                if (item.querySelector('.minicard-film__title')) {
                    if (item.querySelector('.minicard-film__title').innerText.toLowerCase().trim().indexOf(q.toLowerCase().trim()) !== -1) {
                        item.style.display = 'block'
                    } else {
                        item.style.display = 'none'
                    }
                }
            })
        }

        this.addEvents = function () {
            this.input.addEventListener('keyup', (e) => {
                this.render(e.target.value)
            })
        }


    }

    if (document.querySelector('[data-find="film-container"]')) {
        const instanseFindFilm = new findFilm();
        instanseFindFilm.init()
    }




    /* ==================================================
    Редактировать/Удалить комментарий
    ================================================== */

    function comentEdit(elem) {

        this.elem = elem;

        this.paneDefault = elem.querySelector('[data-comment-action="pane-default"]')
        this.paneEdit = elem.querySelector('[data-comment-action="pane-edit"]')
        this.paneRemove = elem.querySelector('[data-comment-action="pane-remove"]')
        this.paneReply = elem.querySelector('[data-comment-action="pane-reply"]')
        this.paneAnswers = elem.querySelector('[data-comment="answers"]')

        //delete
        this.btnDelete = elem.querySelector('[data-comment-action="delete"]')
        this.btnRemove = elem.querySelector('[data-comment-action="remove"]')
        //edit
        this.btnEdit = elem.querySelector('[data-comment-action="edit"]')
        this.btnSave = elem.querySelector('[data-comment-action="save"]')
        //reply
        this.btnReply = elem.querySelector('[data-comment-action="reply"]')
        this.btnSend = elem.querySelector('[data-comment-action="send"]')
        //cancel
        this.btnCancel = elem.querySelectorAll('[data-comment-action="cancel"]')



        this.mianContainer = elem.querySelector('.item-message__main')
        this.textComment = this.mianContainer.innerText;
        this.textareaReply = this.paneReply.querySelector('textarea')
        this.idComment = elem.dataset.commentId


        this.init = function () {
            this.addEvent()
            this.openDefault()
        }

        this.openEdit = function () {
            this.paneEdit.classList.add('open')
            this.closeDefault()
            this.textarea = document.createElement('textarea')
            this.textarea.innerText = this.textComment
            this.mianContainer.querySelector('span').replaceWith(this.textarea)
        }

        this.cancelEdit = function () {
            this.paneEdit.classList.remove('open')
            this.mianContainer.innerHTML = '<span>' + this.textComment + '</span>'
        }

        this.closeEdit = function () {
            this.paneEdit.classList.remove('open')
            this.mianContainer.innerHTML = '<span>' + this.textarea.value + '</span>'
            this.textComment = this.textarea.value
            this.openDefault()
        }

        this.openDefault = function () {
            this.paneDefault.classList.add('open')
        }

        this.closeDefault = function () {
            this.paneDefault.classList.remove('open')
        }
        this.openReply = function () {
            this.paneReply.classList.add('open')
        }

        this.closeReply = function () {
            this.paneReply.classList.remove('open')
        }

        this.openRemove = function () {
            this.paneRemove.classList.add('open')
            this.closeDefault()
        }

        this.closeRemove = function () {
            this.paneRemove.classList.remove('open')
        }

        this.cancel = function () {
            this.cancelEdit()
            this.closeRemove()
            this.openDefault()
        }



        this.addEvent = function () {

            let _this = this

            // this.btnSave.addEventListener('click', function () {
            //     _this.submitData()
            // })
            // this.btnDelete.addEventListener('click', function () {
            //     _this.openRemove()
            // })
            // this.btnEdit.addEventListener('click', function () {
            //     _this.openEdit()
            // })
            // this.btnRemove.addEventListener('click', function () {
            //     _this.submitDeleteComment()
            // })
            this.btnReply.addEventListener('click', function () {
                _this.closeDefault()
                _this.openReply()
            })
            this.btnSend.addEventListener('click', function () {
                _this.closeReply()
                _this.openDefault()
                _this.submitReply()
            })

            this.btnCancel.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    _this.cancel()
                })
            })

            this.textareaReply.addEventListener('blur', (event) => {
                if (event.target.value == '') {
                    this.closeReply()
                    this.openDefault()
                }
            })

        }


        this.submitData = function () {

            //значение из textarea
            console.log(this.textarea.value)
            console.log(this.idComment)

            //ajax true
            this.closeEdit()

        }

        this.submitDeleteComment = function () {

            //id
            console.log(this.idComment)

            //ajax true
            this.elem.classList.add('fade-out-hide')
            setTimeout(() => {
                this.elem.remove()
            }, 600)

        }

        this.submitReply = function () {

            let _this = this;

            //id
            console.log(this.idComment)

            //ajax true

            window.ajax({
                url: '/reply-comment.html',
                type: 'GET',
                data: {
                    id: this.idComment
                }
            }, function (status, response) {

                let div = document.createElement('div')
                div.innerHTML = response;
                _this.paneAnswers.append(div)
                _this.textareaReply.value = '';
            })

        }

    }

    document.querySelectorAll('[data-comment="item"]').forEach(function (elem) {
        const instanseCommentEdit = new comentEdit(elem);
        instanseCommentEdit.init()
    })

    /* =====================================
    load comment
    =====================================*/

    if (document.querySelector('.film-comments__more ')) {
        document.querySelector('.film-comments__more .btn').addEventListener('click', function () {
            this.classList.add('btn-loading')

            setTimeout(() => {
                this.classList.remove('btn-loading')
            }, 3000)
        })
    }


    /* =====================================
    seans slider
    =====================================*/

    function seansSlider(elem) {
        this.elem = elem
        this.container = this.elem.querySelector('.film-seans__list')
        this.items = this.container.querySelectorAll('.seans-list')
        this.nav = {
            next: this.elem.querySelector('[data-se-slider="next"]'),
            prev: this.elem.querySelector('[data-se-slider="prev"]'),
        }
        this.activeSlide = 0

        this.init = function () {
            this.addEvent()
            this.changeSlide()
            this.nav.prev.style.display = 'none'



            if (this.container.scrollWidth <= this.container.offsetWidth) {
                this.nav.next.style.display = 'none'
            }
        }

        this.changeSlide = function () {

            function scrollElement(container, elem, _this) {

                var rect = elem.getBoundingClientRect();
                var rectContainer = container.getBoundingClientRect();

                let elemOffset = {
                    top: rect.top + document.body.scrollTop,
                    left: rect.left + document.body.scrollLeft
                }

                let containerOffset = {
                    top: rectContainer.top + document.body.scrollTop,
                    left: rectContainer.left + document.body.scrollLeft
                }

                let leftPX = ((elem.offsetWidth + 10) * _this.activeSlide)

                container.scrollTo({
                    left: leftPX,
                    behavior: 'smooth'
                });

            }

            this.items.forEach(item => {
                if (item.classList.contains('active'))
                    item.classList.remove('active')
            })

            if (this.items.length) {
                this.items[this.activeSlide].classList.add('active')
                scrollElement(this.container, this.items[this.activeSlide], this)
            }
        }

        this.nextSlide = function () {
            if (this.activeSlide < (this.items.length - 1)) {
                this.activeSlide++
                this.changeSlide()
            }

        }

        this.prevSlide = function () {
            if (this.activeSlide > 0) {
                this.activeSlide--
                this.changeSlide()
            }
        }

        this.addEvent = function () {
            this.nav.next.addEventListener('click', () => {
                this.nextSlide()
            })
            this.nav.prev.addEventListener('click', () => {
                this.prevSlide()
            })

            this.container.addEventListener('scroll', (e) => {
                this.nav.prev.style.display = (e.target.scrollLeft < 10 ? 'none' : 'flex')
                this.nav.next.style.display = ((e.target.scrollWidth - (this.container.offsetWidth) <= e.target.scrollLeft) ? 'none' : 'flex')
            })
        }

    }

    if (document.querySelector('.film-seans')) {

        const instanseSeansSlider = new seansSlider(document.querySelector('.film-seans'))
        instanseSeansSlider.init()

    }

    /* ===============================
    show/hide review
    ===============================*/

    if (document.querySelector('.user-review__head')) {
        document.querySelector('.user-review__head').addEventListener('click', function (e) {
            document.querySelector('.user-review__list').classList.toggle('open')
            document.querySelector('.user-review__arrow').classList.toggle('open')

            setTimeout(() => {
                document.querySelector('.user-review__list').classList.toggle('open-scroll')
            }, 500)

        })
    }


    /* ==========================================
    Карточка режисера popup
    ========================================== */



    if (document.querySelectorAll('[data-modal-hall="open"]').length) {
        document.querySelectorAll('[data-modal-hall="open"]').forEach(function (item) {
            item.addEventListener('click', function (event) {

                // if not data-url
                if (!item.dataset.url) return false;

                let hallPopup = new customModal()
                let url = item.dataset.url


                hallPopup.open('<div><span class="af-spiner" ></span></div>', function (instanse) {

                    window.ajax({
                        type: 'GET',
                        url: url,
                    }, function (status, response) {

                        hallPopup.changeContent(response)





                        //init submit form

                        if (document.querySelector('.af-popup form')) {

                            let form = document.querySelector('.af-popup form')

                            form.addEventListener('submit', function (event) {
                                event.preventDefault()
                                event.target.querySelector('[type="submit"]').classList.add('btn-loading')


                                //ajax send data

                                setTimeout(() => {

                                    if (hallPopup.modal.querySelector('.success-msg')) {
                                        hallPopup.modal.querySelector('[data-popup-html]').style.display = 'none'
                                        hallPopup.modal.querySelector('.success-msg').style.display = 'block'
                                    } else {
                                        hallPopup.close()
                                    }



                                }, 1000)

                            })

                        }

                    })
                })



            })
        })
    }

    /* ==========================================
    Выставить оценку popup
    ========================================== */

    function Grade(modal) {

        this.modal = modal
        this.btnNext = this.modal.querySelector('[data-grade="next"]')
        this.btnBack = this.modal.querySelector('[data-grade="back"]')
        this.btnSend = this.modal.querySelector('[data-grade="send"]')
        this.items = this.modal.querySelectorAll('[data-step]')
        this.activeSlide = 0

        this.init = function () {
            this.btnBack.style.display = (this.activeSlide ? 'flex' : 'none')
            this.addEvent()

        }

        this.changeSlide = function () {

            this.btnBack.style.display = (this.activeSlide ? 'flex' : 'none')

            this.items.forEach(item => {
                if (item.classList.contains('active')) {
                    item.classList.add('slide-hide')

                    setTimeout(() => {
                        item.classList.remove('active')
                        item.classList.remove('slide-hide')

                        if (this.items.length) {
                            this.items[this.activeSlide].classList.add('active')
                        }
                    }, 50)
                }

            })


        }

        this.nextSlide = function () {
            if (this.activeSlide < (this.items.length - 1)) {
                this.activeSlide++
                this.changeSlide()
            }
        }

        this.prevSlide = function () {
            if (this.activeSlide > 0) {
                this.activeSlide--
                this.changeSlide()
            }
        }

        this.addEvent = function () {
            this.btnNext.addEventListener('click', (e) => {
                e.preventDefault()
                this.nextSlide()
            })
            this.btnBack.addEventListener('click', (e) => {
                e.preventDefault()
                this.prevSlide()
            })

            this.btnSend.addEventListener('click', (e) => {
                e.preventDefault()

                if (!this.modal.querySelector('input[name="check-grade"]').checked) {
                    this.modal.querySelector('.checkbox__elem').classList.add('zoom-check')

                    setTimeout(() => {
                        this.modal.querySelector('.checkbox__elem').classList.remove('zoom-check')
                    }, 1000)
                    return false
                }



                //send ajax 

                const form = this.modal.querySelector('form')
                const formData = new FormData(form)

                this.modal.querySelector('[type="submit"]').classList.add('btn-loading')

                var total = 0;

                formData.forEach(item => {
                    if (!isNaN(item)) total += Number(item)
                })

                if (document.querySelector('[data-modal-grade="open"]')) {
                    document.querySelector('[data-modal-grade="open"]').innerHTML = 'Ваша оцкенка ' + ((total / 9) / 10).toFixed(1)
                }

                setTimeout(() => {

                    if (this.modal.querySelector('.success-msg')) {
                        this.modal.querySelector('[data-popup-html]').style.display = 'none'
                        this.modal.querySelector('.success-msg').style.display = 'block'
                    }

                }, 1000)


            })
        }
    }

    if (document.querySelectorAll('[data-modal-grade="open"]').length) {
        document.querySelectorAll('[data-modal-grade="open"]').forEach(function (item) {
            item.addEventListener('click', function (event) {

                // if not data-url
                if (!item.dataset.url) return false;

                let gradePopup = new customModal()
                let url = item.dataset.url


                gradePopup.open('<div><span class="af-spiner" ></span></div>', function (instanse) {

                    window.ajax({
                        type: 'GET',
                        url: url,
                    }, function (status, response) {

                        gradePopup.changeContent(response)

                        //маска для полей
                        gradePopup.modal.querySelectorAll('input[type="text"]').forEach(item => {

                            var mask = Maska.create(item, {
                                mask: '#*',
                                preprocessor: function (value) {
                                    return (value > 100 ? '100' : value)
                                }
                            });
                        })

                        //init

                        const grade = new Grade(gradePopup.modal);

                        grade.init()


                    })
                })



            })
        })
    }

    /* =============================
    description
    =============================*/

    if (document.querySelector('.page-film__more')) {



        if (document.querySelector('.page-film__description').innerText.length < 200) {
            document.querySelector('.page-film__more').remove()
            document.querySelector('.page-film__description').classList.add('js-show-all')
        } else {
            document.querySelector('.page-film__more').addEventListener('click', function () {


                if (document.querySelector('.page-film__description').classList.contains('js-show-all')) {
                    document.querySelector('.page-film__more').innerText = document.querySelector('.page-film__more').dataset.textShow
                } else {
                    document.querySelector('.page-film__more').innerText = document.querySelector('.page-film__more').dataset.textHide
                }

                document.querySelector('.page-film__description').classList.toggle('js-show-all')
            })
        }


    }

    //blur textarea

    document.querySelectorAll('.film-comments__textarea textarea').forEach(textarea => {
        textarea.addEventListener('keyup', function (e) {
            if (e.target.value.length) {
                e.target.style.width = e.target.offsetWidth + 'px'
            } else {
                e.target.style.width = null
            }
        })
    })

    //note for film

    document.querySelectorAll('.film-note__wrapper textarea').forEach(textarea => {
        textarea.addEventListener('focus', e => {
            e.target.closest('.film-note__wrapper').classList.add('film-note--focus')
        })
        textarea.addEventListener('blur', e => {
            if (e.target.closest('.film-note__wrapper').classList.contains('film-note--focus')) {
                e.target.closest('.film-note__wrapper').classList.remove('film-note--focus')
            }
        })
    })

    //click minicard-film

    if (document.querySelectorAll('.minicard-film__image').length) {
        document.querySelectorAll('.minicard-film__image').forEach(item => {
            item.addEventListener('click', function (e) {
                let url = e.target.closest('.minicard-film').querySelector('.minicard-film__title a').getAttribute('href')
                window.location.href = url
            })
        })
    }


    /*======================================================================================================================================
     splide
    ======================================================================================================================================*/

    if (document.querySelector('[data-slider="home"]') && document.body.clientWidth > 992) {
        var sliderPage = new Splide('[data-slider="home"]', {
            pagination: false,
            arrows: false,
            height: 'calc(100vh - 240px)',
            direction: 'ttb',
            wheel: true,
            wheelMinThreshold: 50,
            wheelSleep: 150,

        });

        sliderPage.mount();

        document.querySelectorAll('.main-advice__item').forEach(item => {

            // item.addEventListener('mouseenter', e => {

            //     sliderPage.options = {
            //         wheelMinThreshold: 500,
            //     }

            //     sliderPage.refresh()
            // })

            // item.addEventListener('mouseleave', e => {

            //     sliderPage.options = {
            //         wheelMinThreshold: 50,
            //     }

            //     sliderPage.refresh()
            // })
        })

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
            perPage: 4,
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

        if (document.querySelector('[data-slider-prev="about-history"]')) {

            const prevHistory = document.querySelector('[data-slider-prev="about-history"]')
            const nextHistory = document.querySelector('[data-slider-next="about-history"]')

            prevHistory.addEventListener('click', e => {
                sliderAboutHistory.go('<')
            })

            nextHistory.addEventListener('click', e => {
                sliderAboutHistory.go('>')
            })
        }





        sliderAboutHistory.mount();
    }


    /* ============================================
    slider="about"
    ============================================*/


    if (document.querySelector('[data-slider="about"]') && document.body.clientWidth > 992) {
        var sliderPageAbout = new Splide('[data-slider="about"]', {

            pagination: false,
            arrows: false,
            height: 'calc(100vh - 240px)',

            wheel: true,
            wheelMinThreshold: 50,
            wheelSleep: 500,

            drag: false,

            breakpoints: {
                767: {
                    height: 'auto',
                    wheel: false,
                },
            }

        });


        const prevButtonAbout = document.querySelector('[data-slider-prev="about"]')
        const nextButtonAbout = document.querySelector('[data-slider-next="about"]')

        if (prevButtonAbout) {
            prevButtonAbout.addEventListener('click', e => {
                sliderPageAbout.go('<')
            })
        }

        if (nextButtonAbout) {
            nextButtonAbout.addEventListener('click', e => {
                sliderPageAbout.go('>')
            })
        }

        function splideSlideName() {

            this.elems = document.querySelectorAll('[data-splide-title]')
            this.slideContainer = document.querySelector('.fp-about__nav-slide')
            this.dotsContainer = document.querySelector('.fp-about__nav-dots ul')

            this.create = function () {

                this.slideContainer.innerHTML = ''
                this.dotsContainer.innerHTML = ''

                this.elems.forEach((item, index) => {

                    let slide = document.createElement('div')
                    slide.innerHTML = '' + item.dataset.splideTitle + ''

                    let dot = document.createElement('li')
                    dot.innerHTML = '<span class="dots-slider"></span>'

                    this.addClickEvent(dot, index);

                    if (!index) {
                        dot.classList.add('is-active')
                        slide.classList.add('is-active')
                    }

                    this.slideContainer.append(slide)
                    this.dotsContainer.append(dot)

                })

            }

            this.addClickEvent = function (elem, index) {

                elem.addEventListener('click', (e) => {
                    sliderPageAbout.go(index)
                })

            }

            this.change = function (indexCurrent) {
                this.elems.forEach((item, index) => {

                    if (index == indexCurrent) {

                        this.slideContainer.children[index].classList.add('is-active')
                        this.dotsContainer.children[index].classList.add('is-active')

                    } else {

                        if (this.slideContainer.children[index].classList.contains('is-active')) {
                            this.slideContainer.children[index].classList.remove('is-active')
                        }
                        if (this.dotsContainer.children[index].classList.contains('is-active')) {
                            this.dotsContainer.children[index].classList.remove('is-active')
                        }

                    }

                })
            }

        }

        const splideSlide = new splideSlideName()


        sliderPageAbout.on('mounted', function () {
            splideSlide.create()
        })

        sliderPageAbout.on('move', function (newIndex, prevIndex, destIndex) {
            splideSlide.change(newIndex)
        })

        sliderPageAbout.on('active', function (newIndex) {

            function scrollDirection(e) {

                if (e.wheelDelta > 0) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })

                    setTimeout(() => {
                        sliderPageAbout.options = {
                            wheelMinThreshold: 50,
                        }
                    }, 500)

                } else {
                    window.scrollTo({
                        top: document.querySelector('footer').clientHeight + 100,
                        behavior: 'smooth'
                    })
                }

            }

            if ((sliderPageAbout.length - 1) == newIndex.index) {

                sliderPageAbout.options = {
                    wheelMinThreshold: 500,
                }

                sliderPageAbout.root.onwheel = function (e) {
                    scrollDirection(e)
                }

            } else {
                sliderPageAbout.root.onwheel = false;
            }

        })

        sliderPageAbout.mount();
    }



    if (document.querySelector('[data-slider="program"]')) {

        var sliderProgram = new Splide('[data-slider="program"]', {

            type: 'loop',
            perPage: 5,
            focus: 'center',
            flickMaxPages: 3,
            updateOnMove: true,
            pagination: false,
            throttle: 300,
            gap: 10,
            start: 0,

            breakpoints: {
                767: {
                    perPage: 2,
                    padding: '0%',
                    gap: -15,
                    flickMaxPages: 1,
                },

                992: {
                    perPage: 3,
                    padding: '0%',
                    gap: 0
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

    /* ===================================
    about team
    ===================================*/

    if (document.querySelector('[data-slider="about-team"]')) {
        var aboutTeam = new Splide('[data-slider="about-team"]', {

            perPage: 1,
            autoWidth: true,
            updateOnMove: true,
            pagination: false,
            arrows: false,
            padding: 60,
            focus: 'center',
            flickMaxPages: 1,
            start: 0

        });

        aboutTeam.mount()


        document.querySelectorAll('[data-team="popup"]').forEach(item => {
            item.addEventListener('click', function () {


                const popupTeam = new customModal()
                popupTeam.open('<div class="team-desc" >' + item.innerHTML + '</div>')


            })
        })

    }

    /* =================================================
    about media
    =================================================*/

    if (document.querySelector('[data-slider="about-media"]')) {


        var sliderMedia = new Splide('[data-slider="about-media"]', {

            type: 'loop',
            perPage: 3,
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
                992: {

                    autoWidth: true,
                    padding: '0%',
                    focus: false,
                    padding: 0,

                },


            }
        });



        sliderMedia.mount();


    }


    /* ======================================================
    download more events
    ======================================================*/

    if (document.querySelector('[data-events="load"]')) {

        document.querySelector('[data-events="load"]').addEventListener('click', (e) => {

            window.ajax({
                type: 'GET',
                url: '/_load-events.html',
                data: {
                    page: '10'
                }
            }, function (status, response) {

                if (document.querySelector('[data-events="load-container"]'))
                    document.querySelector('[data-events="load-container"]').innerHTML += response

            })

        })

    }

    /* ====================================================
    slider main-event
    ====================================================*/

    if (document.querySelector('[data-slider="main-event"]')) {

        var sliderMainEvent = new Splide('[data-slider="main-event"]', {
            perPage: 1,
            pagination: false,
            throttle: 300,
            gap: 10,
            updateOnMove: true,
        });

        sliderMainEvent.mount();

    }


    /* ========================================
    card-advice popup
    ========================================*/

    if (document.querySelector('.card-advice')) {
        document.querySelectorAll('.card-advice').forEach(item => {
            item.addEventListener('click', e => {
                const popup = new customModal()
                popup.open('<div class="jury-desc" >' + item.innerHTML + '</div>')
            })
        })
    }

    /* ===========================================
    video
    =========================================== */

    if (document.querySelectorAll('.video').length) {

        function youtube_parser(url) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            return (match && match[7].length == 11) ? match[7] : false;
        }

        document.querySelectorAll('.video').forEach(item => {
            item.addEventListener('click', e => {

                let id = youtube_parser(item.dataset.id)

                let iframe = document.createElement('iframe');
                iframe.setAttribute('src', 'https://www.youtube.com/embed/' + id + '?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1&rel=0&showinfo=0')
                iframe.setAttribute('width', item.clientWidth + 'px')
                iframe.setAttribute('height', (item.clientHeight) + 'px')
                iframe.setAttribute('allowfullscreen', 'true')
                iframe.classList.add('play')
                item.classList.add('play')

                item.innerHTML = '';
                item.append(iframe);

            })
        })
    }


    /* ===========================================
    trailer
    =========================================== */

    if (document.querySelectorAll('[data-trailer-link]').length) {



        document.querySelectorAll('[data-trailer-link]').forEach(item => {
            item.addEventListener('click', e => {
                const popup = new customModal()

                let text = '<div>Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта: синтетическое тестирование способствует подготовке и реализации новых предложений. <strong>Высокий уровень</strong> вовлечения представителей целевой аудитории является четким доказательством простого факта: убеждённость некоторых оппонентов позволяет оценить значение модели развития.<br><br><em>Ясность нашей позиции очевидна: выбранный нами инновационный путь однозначно определяет каждого участника как способного принимать собственные решения касаемо новых принципов формирования материально-технической и кадровой базы. Вот вам яркий пример современных тенденций — понимание сути ресурсосберегающих технологий играет важную роль в формировании распределения внутренних резервов и ресурсов. А ещё реплицированные с зарубежных источников, современные исследования ограничены исключительно образом мышления.</em><br><br>Повседневная практика показывает, что начало повседневной работы по формированию позиции напрямую зависит от экономической целесообразности принимаемых решений. В частности, существующая теория <del>однозначно </del>определяет каждого участника как способного принимать собственные решения касаемо системы массового участия. Задача организации, в особенности же начало повседневной работы по формированию позиции предопределяет высокую востребованность распределения внутренних резервов и ресурсов. Но высокотехнологичная концепция общественного уклада создаёт необходимость включения в производственный план целого ряда внеочередных мероприятий с учётом комплекса кластеризации усилий.<br><br>Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта: консультация с широким активом влечет за собой процесс внедрения и модернизации экономической целесообразности принимаемых решений. А ещё непосредственные участники технического прогресса, превозмогая сложившуюся непростую экономическую ситуацию, разоблачены.<br><br>В частности, разбавленное изрядной долей эмпатии, рациональное мышление представляет собой интересный эксперимент проверки распределения внутренних резервов и ресурсов. Приятно, граждане, наблюдать, как реплицированные с зарубежных источников, современные исследования призывают нас к новым свершениям, которые, в свою очередь, должны быть в равной степени предоставлены сами себе. Разнообразный и богатый опыт говорит нам, что экономическая повестка сегодняшнего дня не даёт нам иного выбора, кроме определения новых предложений. Ясность нашей позиции очевидна: современная методология разработки создаёт необходимость включения в производственный план целого ряда внеочередных мероприятий с учётом комплекса анализа существующих паттернов поведения. Являясь всего лишь частью общей картины, сделанные на базе интернет-аналитики выводы рассмотрены исключительно в разрезе маркетинговых и финансовых предпосылок.</div>';

                popup.open(
                    `<div class="player-trailer" >
                        <div class = "player-trailer__iframe">
                            <iframe allowfullscreen="" src="${item.dataset.trailerLink}"></iframe>
                        </div>
                        ${text.length ? `<div class = "player-trailer__desc  ">${text}</div>` : ''}
                    </div>`
                )
            })
        })
    }

    /* ===========================================
    popup reglament
    =========================================== */

    if (document.querySelectorAll('[data-regulations="open"]').length) {



        document.querySelectorAll('[data-regulations="open"]').forEach(item => {
            item.addEventListener('click', e => {
                const popup = new customModal({
                    mobileInBottom: true
                })
                popup.open('<div class="popup-regulations" >' + document.getElementById('participant').outerHTML + '</div>')
            })
        })
    }

    /* ====================================================
    slider main-advice 
    ====================================================*/

    if (document.querySelector('[data-slider="main-advice"]')) {
        document.querySelectorAll('[data-slider="main-advice"]').forEach(item => {
            let countSlide = item.querySelectorAll('.card-advice');

            if (countSlide.length > 3 || document.body.clientWidth < 992) {

                var sliderMainAdvice = new Splide(item, {
                    //perPage: (countSlide.length < 6 ? countSlide.length : 5),
                    perPage: (countSlide.length < 6 ? 4 : 5),
                    pagination: false,
                    arrows: false,
                    gap: 0,
                    // focus: 'center',

                    breakpoints: {

                        1200: {
                            perPage: 4,
                        },

                        992: {
                            perPage: 3,
                        },

                        760: {
                            perPage: 1,
                            gap: 15,
                        },

                    },
                });


                let wrapper = item.closest('.section-main-advice');

                if (wrapper.querySelector('.main-advice__nav')) {

                    if (countSlide.length < 5 && document.body.clientWidth > 1200) {
                        wrapper.querySelector('.main-advice__nav').style.display = 'none';
                    } else {
                        wrapper.querySelector('.main-advice__nav').style.display = 'flex';
                    }

                }


                if (wrapper.querySelector('[data-slider-prev="main-advice"]')) {

                    let prevButton = wrapper.querySelector('[data-slider-prev="main-advice"]')
                    let nextButton = wrapper.querySelector('[data-slider-next="main-advice"]')

                    prevButton.addEventListener('click', e => {
                        sliderMainAdvice.go('<')
                    })

                    nextButton.addEventListener('click', e => {
                        sliderMainAdvice.go('>')
                    })
                }

                sliderMainAdvice.mount();
            } else {
                if (document.querySelector('[data-slider-prev="main-advice"]')) {
                    document.querySelector('[data-slider-prev="main-advice"]').style.display = 'none'
                    document.querySelector('[data-slider-next="main-advice"]').style.display = 'none'
                }
            }
        });
    }

    /* ===========================================
    data-number-repeat="add"
    ===========================================*/

    if (document.querySelector('[data-number-repeat="add"]')) {
        const button = document.querySelector('[data-number-repeat="add"]')
        const container = document.querySelector('[data-number-repeat="container"]')

        button.addEventListener('click', (e) => {

            const input = container.querySelector('input').cloneNode(true)
            input.value = '';

            container.append(input)

            if (container.querySelectorAll('input').length >= 3) {
                button.remove()
            }


        })


    }

    /* ============================================
    archive film preview 
    ============================================*/

    if (document.querySelector('[data-popup="film"]')) {

        const items = document.querySelectorAll('[data-popup="film"]')

        items.forEach(item => {
            item.addEventListener('click', e => {
                // if not data-url
                if (!item.dataset.url) return false;

                let filmPopup = new customModal()
                let url = item.dataset.url


                filmPopup.open('<div><span class="af-spiner" ></span></div>', function (instanse) {

                    window.ajax({
                        type: 'GET',
                        url: url,
                    }, function (status, response) {
                        filmPopup.changeContent(response)
                    })
                })

            })
        })

    }

    /* ===========================================
    scroll to active
    ===========================================*/

    window.scrollElement = function (container, elem) {

        var rect = elem.getBoundingClientRect();
        var rectContainer = container.getBoundingClientRect();

        let elemOffset = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        }

        let containerOffset = {
            top: rectContainer.top + document.body.scrollTop,
            left: rectContainer.left + document.body.scrollLeft
        }

        let leftPX = elemOffset.left - containerOffset.left + container.scrollLeft - (container.offsetWidth / 2) + (elem.offsetWidth / 2) + 5

        container.scrollTo({
            left: leftPX,
            behavior: 'smooth'
        });

    }

    if (document.querySelector('.page-archive__yaers-list') && document.body.clientWidth <= 992) {

        let container = document.querySelector('.page-archive__yaers')
        let elem = document.querySelector('.page-archive__yaers-list ul li.active')

        window.scrollElement(container, elem);

    }




});