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

    const instanseSeansSlider = new seansSlider(document.querySelector('.film-seans'))
    instanseSeansSlider.init()

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

      if(document.querySelectorAll('.minicard-film__image').length){
        document.querySelectorAll('.minicard-film__image').forEach(item => {
            item.addEventListener('click', function(e){
                let url = e.target.closest('.minicard-film').querySelector('.minicard-film__title a').getAttribute('href')
                window.location.href = url
            })
        })
    }



});