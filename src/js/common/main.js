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
            item.addEventListener('mouseenter', e => {

                //console.log(sliderPage.root.querySelector('.splide__track'))



                //sliderPage.destroy()


                sliderPage.options = {
                    wheel: false,

                }

                sliderPage.refresh()



            })
            item.addEventListener('mouseleave', e => {

                //console.log(sliderPage.root.querySelector('.splide__track'))



                // sliderPageNoWhell.destroy()
                // sliderPage.mount()



            })
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
        var sliderPageAbout = new Splide('[data-slider="about"]', {

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

        sliderPageAbout.mount();
    }



    if (document.querySelector('[data-slider="program"]')) {

        var sliderProgram = new Splide('[data-slider="program"]', {

            type: 'loop',
            perPage: 5,
            focus: 'center',
            //autoplay: true,
            //interval: 8000,
            flickMaxPages: 3,
            updateOnMove: true,
            pagination: false,
            //padding: '20',
            throttle: 300,
            gap: 10,
            start: 1,

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


            // Slide.slide.parentNode.querySelectorAll('.splide__slide').forEach(item => {
            //     if (item.classList.contains('slide---next')) {
            //         item.classList.remove('slide---next')
            //     }
            //     if (item.classList.contains('slide---prev')) {
            //         item.classList.remove('slide---prev')
            //     }
            // })




            // Slide.slide.nextElementSibling.classList.add('slide---next')
            // Slide.slide.previousElementSibling.classList.add('slide---prev')

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
            flickMaxPages: 3,
            start: 1

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



        sliderMedia.mount();


    }


    /* ======================================================
    download more events
    ======================================================*/

    if (document.querySelector('[data-events="load"]')) {

        document.querySelector('[data-events="load"]').addEventListener('click', (e) => {

            window.ajax({
                type: 'GET', //на бою заменить на POST
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
                popup.open('<div class="founder-desc" >' + item.innerHTML + '</div>')
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


});