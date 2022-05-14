document.addEventListener('DOMContentLoaded', function (event) {
    /* ========================================
    dot menu
    ========================================*/

    if (document.querySelector('[data-menu=dots]')) {

        //click menu
        document.querySelectorAll('[data-menu=dots]').forEach(function (item) {
            item.addEventListener('click', function (event) {
                item.classList.toggle('open')
            })

        });

        //out click
        document.addEventListener('click', function (event) {

            if (!event.target.closest('.ob-menu')) {
                if (document.querySelector('.ob-menu.open')) {
                    document.querySelector('.ob-menu.open').classList.remove('open')
                }
            }

        })

    }


    /* ========================================
    статусы заявок
    ========================================*/

    document.querySelectorAll('[data-ob=status]').forEach(function (item) {
        item.addEventListener('click', function () {

            if (item.classList.contains('btn-line--success')) {

                window.ajax({
                    url: '/index.html',
                    data: {
                        id: '10'
                    }
                }, function (response) {
                    //response true
                    item.classList.toggle('active')

                })
            }

            if (item.classList.contains('btn-line--reject')) {

                window.ajax({
                    url: '/index.html',
                    data: {
                        id: '10'
                    }
                }, function (response) {
                    //response true
                    item.classList.toggle('active')

                })
            }

        })
    })

    /* =====================================
    sendFiles
    =====================================*/

    function sendFiles(files, elem, callback) {


        for (var i = 0; i < files.length; i++) {
            var file = files.item(i);

            // проверяем размер файла
            if (file.size > 1200000) {
                alert('Размер файла не должен превышать 1 мб')
                return false;
            }

            if (file.type === 'image/jpeg') {

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    callback(e.target.result)
                }

            } else {
                alert('Допустимы только JPEG изображения ');
            }

        }
    }

    if (document.querySelector('[data-attach=poster]')) {
        document.querySelectorAll('[data-attach=poster]').forEach(function (poster) {
            poster.addEventListener('change', function () {

                let files = this.files;
                let elem = this;

                sendFiles(files, elem, function (dataImage) {

                    elem.closest('.film-poster__cover').classList.add('cover--loaded')
                    elem.closest('.film-poster__cover').querySelector('[data-attach="preview-poster"]').src = dataImage

                });

            })
        })
    }

    /* ========================================
    upload photo
    ======================================== */

    if (document.querySelector('[data-attach=photo]')) {

        document.querySelector('[data-attach=photo]').addEventListener('change', function () {

            let files = this.files;
            let elem = this;

            sendFiles(files, elem, function (dataImage) {
                elem.closest('form').querySelector('[data-attach="preview"]').style.backgroundImage = 'url(' + dataImage + ')'
            });

        })
    }





    /* =============================================
    repeater
    ============================================= */

    if (document.querySelector('[data-repeat="add"]')) {
        document.querySelector('[data-repeat="add"]').addEventListener('click', function (event) {
            const container = document.querySelector('[data-repeat="container"]')
            const fieldRepeeat = container.children[0].cloneNode(true)
            const lastElem = fieldRepeeat.children[(fieldRepeeat.children.length - 1)]

            //max 10 fields
            if (container.querySelectorAll('.remove-repeater').length > 9) {
                window.STATUS.err('Допустимо не более 10 элементов')
                return false;
            }

            //remove disabled attr
            lastElem.querySelector('input').removeAttribute('disabled')
            lastElem.querySelector('input').setAttribute('placeholder', 'Должность')
            lastElem.querySelector('input').setAttribute('value', '')
            fieldRepeeat.querySelector('input').value = ''
            fieldRepeeat.querySelector('input').removeAttribute('area-valid')

            //create remove button
            const removeElem = document.createElement('span')
            removeElem.classList.add('remove-repeater')

            //remove string
            removeElem.addEventListener('click', function (event) {

                if (confirm('Удалить?')) {
                    event.target.closest('.form__item').remove()
                }

            })


            if (MATERIAL_INPUT) {
                MATERIAL_INPUT.addEvent(fieldRepeeat.querySelector('input'))
            }

            //append elem
            lastElem.append(removeElem)
            container.append(fieldRepeeat)


        })




    }

    /* =================================================
    timepicker
    =================================================*/

    if (document.querySelector('[data-timepicker]')) {

        document.querySelectorAll('[data-timepicker]').forEach(function (item) {

            initTimepicker(item)

        })

        function addEventRemoveTime(collection) {
            collection.forEach(function (item) {
                item.removeEventListener('click', function () {}, false)
                item.addEventListener('click', function () {
                    if (confirm('Вы действительно хотите удалить?')) {
                        this.remove()
                    }
                })
            })
        }

        function sortableElem(parent) {

            let nodeList = parent.querySelectorAll('.lineup__list li')
            let arr = Array.prototype.slice.call(nodeList, 0).sort((a, b) => {

                if (a.innerText > b.innerText) {
                    return 1;
                } else {
                    return -1;
                }

            });

            arr.forEach(function (item) {
                parent.querySelector('.lineup__list ul').append(item)
            })

        }

        function initTimepicker(item) {

            //add event
            item.addEventListener('click', function (event) {

                var timepickerPopup = new customModal()

                var template = `
                    <div id="af-timepicker" class="af-timepicker">
                        <div class="af-timepicker__title" >Добавить время</div>
                        <div class="af-timepicker__fields" >
                            <input type="text" value="" placeholder="Часы" data-timepicker="hour">
                            <span>:</span>
                            <input type="text" value="" placeholder="Минуты" data-timepicker="min">
                        </div>
                        <div class="af-timepicker__btn" >
                            <button class="btn" >Добавить</button>
                        </div>
                    </div>
                `

                let parent = item.closest('.lineup__timeline')

                timepickerPopup.open(template, function (instanse) {

                    //mask init 

                    let inputHour = document.querySelector('[data-timepicker="hour"]')
                    var mask = Maska.create(inputHour, {
                        mask: '#*',
                        preprocessor: function (value) {
                            if (value > 23) {
                                return '23'
                            } else {
                                return value
                            }
                        }
                    });
                    let inputMin = document.querySelector('[data-timepicker="min"]')
                    var mask = Maska.create(inputMin, {
                        mask: '#*',
                        preprocessor: function (value) {
                            if (value > 59) {
                                return '59'
                            } else {
                                return value
                            }
                        }
                    });


                    //click add time
                    document.querySelector('.af-timepicker__btn').addEventListener('click', function () {

                        if (!inputHour.value.length || !inputMin.value.length) {
                            return false
                        }

                        let li = document.createElement('li')
                        let inputTime = inputHour.value + ':' + inputMin.value

                        li.innerHTML = `
                            <span>${inputTime}</span>
                            <input type="checkbox" name="time[]" value="${inputTime}" checked="checked">
                        `
                        parent.querySelector('.lineup__list ul').append(li)

                        //remove add elem
                        li.addEventListener('click', function () {
                            if (confirm('Вы действительно хотите удалить?')) {
                                this.remove()
                            }
                        })

                        // close popup
                        timepickerPopup.close()

                        // sortable add elems
                        sortableElem(parent)



                    })
                })
            })

        }



        //remove item lineup

        function addEventremoveLineup(item) {
            item.querySelector('.remove-repeater').addEventListener('click', function (event) {
                if (confirm('Вы действительно хотите удалить?')) {
                    event.target.closest('.lineup').remove()
                }

            })
        }


        addEventRemoveTime(document.querySelectorAll('.lineup__list li'))


    }

    /* ===========================================
    load message
    =========================================== */

    if (document.querySelector('.messenger')) {

        let loadMessageFlag = false;
        let stopScrollFlag = false;

        const chat = document.querySelector('[data-pane="chat"]')
        const contacts = document.querySelector('[data-pane="contacts"]')
        const instanseContacts = OverlayScrollbars(document.querySelector(".messenger__list"), {});
        const instanseMessages = OverlayScrollbars(document.querySelector(".scroll-min"), {
            scrollbars: {
                autoHide: "scroll",
                autoHideDelay: 300,
            },
            callbacks: {
                onScroll: function (event) {

                    if (stopScrollFlag) return false;

                    if (event.target.scrollTop < 100) {

                        instanseMessages.scroll([0, 2], 100);


                        if (!loadMessageFlag) {

                            loadMessageFlag = true;


                            setTimeout(function () {
                                loadMessages(function () {

                                    loadMessageFlag = false;
                                })
                            }, 500)
                        }



                    }
                }
            }
        });

        // load messages

        function loadMessages(callback) {
            window.ajax({
                url: '/_messages.html',
                type: 'get',
                data: {
                    id: 'user_id'
                }
            }, function (status, response) {
                let div = document.createElement('div')
                div.innerHTML = response
                document.querySelector('.scroll-min .os-content').prepend(div)

                //callback
                callback()
            })
        }



        document.querySelectorAll('[data-user]').forEach(function (item) {
            item.addEventListener('click', function () {

                if (document.querySelector('.messenger-contact.active')) {
                    document.querySelector('.messenger-contact.active').classList.remove('active')
                }

                this.classList.add('active')

                document.querySelector('.messenger__user').innerText = item.querySelector('.messenger-contact__name').innerText
                stopScrollFlag = true;

                if (document.body.clientWidth <= 766) {
                    chat.style.display = 'block'
                    contacts.style.display = 'none'
                }

                let user_id = this.dataset.user;
                console.log(user_id)

                //load messages
                window.ajax({
                    url: '/_messages.html',
                    type: 'get',
                    data: {
                        id: user_id
                    }
                }, function (status, response) {

                    document.querySelector('.scroll-min .os-content').innerHTML = response
                    instanseMessages.scroll([0, "100%"], 100);
                    setTimeout(function () {
                        stopScrollFlag = false;
                    }, 300)

                })


            })
        })

        //back to contacts
        document.querySelector('.messenger__back').addEventListener('click', function () {
            contacts.style.display = 'block'
            chat.style.display = 'none'
        })
    }

    /* ===========================================
        repeater lineup
    =========================================== */

    if (document.querySelector('[data-lineup="container"]')) {


        document.querySelectorAll('[data-lineup="repeat"]').forEach(function (item) {


            item.addEventListener('click', function () {
                const container = document.querySelector('[data-lineup="container"]')
                const fieldRepeeat = container.children[0].cloneNode(true)
                const lastElem = fieldRepeeat.children[(fieldRepeeat.children.length - 1)]

                //max 10 fields
                if (container.querySelectorAll('.remove-repeater').length > 9) {
                    window.STATUS.err('Допустимо не более 10 элементов')
                    return false;
                }

                fieldRepeeat.querySelectorAll('li').forEach(function (item, index) {
                    if (index) item.remove()
                })

                initTimepicker(fieldRepeeat.querySelector('[data-timepicker=""]'))
                addEventremoveLineup(fieldRepeeat)

                container.append(fieldRepeeat)

                addEventRemoveTime(fieldRepeeat.querySelectorAll('.lineup__list li'))
            })
        })

    }

    /* ===========================================
    tabs
    =========================================== */

    document.querySelectorAll('[data-tab-nav] a').forEach(function (item) {

        item.addEventListener('click', function () {

            if (document.querySelector('[data-tab-nav] li.active')) {
                document.querySelector('[data-tab-nav] li.active').classList.remove('active')
            }

            item.parentNode.classList.add('active')

            document.querySelectorAll('[data-tab-item]').forEach(function (tab) {
                if (item.getAttribute('href') == '#' + tab.dataset.tabItem) {
                    tab.classList.add('active')
                } else {
                    tab.classList.remove('active')
                }
            })

            document.querySelectorAll('[data-lang]').forEach(function (lang) {

                let href = item.getAttribute('href').replace('#', '')

                if (lang.dataset.lang.indexOf(href) !== -1) {
                    lang.classList.add('active')

                } else {
                    lang.classList.remove('active')

                    console.log(lang)
                }
            })



            if (!document.querySelectorAll('[data-lang].active').length) {
                document.querySelector('[data-lang]').classList.add('active')
            }


        })
    })

    /* ===========================================
    input material
    =========================================== */

    function materialInput() {
        this.init = function () {

            let _this = this

            document.querySelectorAll('.input-material input').forEach(function (input) {

                if (input.value.length) {
                    input.setAttribute('area-valid', '')
                }

                _this.addEvent(input)
            })
        }

        this.addEvent = function (input) {
            input.addEventListener('keyup', function (event) {
                if (event.target.value.length) {
                    event.target.setAttribute('area-valid', 'true')
                } else {
                    event.target.removeAttribute('area-valid')
                }
            })
        }


    }

    const MATERIAL_INPUT = new materialInput()
    MATERIAL_INPUT.init()


    /* =================================================
    show more review 
    =================================================*/

    if (document.querySelector('.item-review')) {
        document.querySelectorAll('.item-review').forEach(function (item) {
            item.querySelector('.item-review__read span').addEventListener('click', function () {
                item.classList.toggle('item-review--open')

                if (item.classList.contains('item-review--open')) {
                    item.querySelector('.item-review__read span').innerText = 'Скрыть'
                } else {
                    item.querySelector('.item-review__read span').innerText = 'Читать всю рецензию'
                }
            })
        })
    }

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

    /* ========================================
    invite form
    ======================================== */

    if (document.querySelectorAll('[data-modal="invite"]').length) {

        // init modal
        var invitePopup = new customModal()

        function submitInviteForm(elem) {
            //elem - dom element

            elem.querySelector('[data-form="invite-member"]').addEventListener('submit', function (event) {
                event.preventDefault()

                //ajax true

                this.reset()
                invitePopup.close()
                window.STATUS.msg('Сообщение успешно отправлено!')

            })
        }

        document.querySelectorAll('[data-modal="invite"]').forEach(function (item) {
            item.addEventListener('click', function () {

                if (document.body.clientWidth <= 480) {

                    let elem = document.querySelector('.moderator-aside__form');
                    elem.classList.toggle('open')

                    //init submit
                    submitInviteForm(elem)

                    return false
                }

                //desctop

                let template = document.querySelector(item.dataset.src).outerHTML
                invitePopup.open(template, function (instanse) {

                    instanse.querySelectorAll('input').forEach(function (input) {
                        if (MATERIAL_INPUT) {
                            MATERIAL_INPUT.addEvent(input)
                        }

                        //init submit
                        submitInviteForm(instanse)
                    })


                })
            })
        })

        //back to menu

        document.querySelector('[data-invete-form="close"]').addEventListener('click', function () {
            if (document.querySelector('.moderator-aside__form')) {
                document.querySelector('.moderator-aside__form').classList.remove('open')
            }
        })

    }

    /* ==================================================
    добавить Награды и премии
    ================================================== */

    function addFields(elem) {
        const container = document.querySelector('[data-add-container="' + elem + '"]')
        const fieldRepeeat = container.children[0].cloneNode(true)

        //max 10 fields
        if (container.querySelectorAll('.remove-repeater').length > 9) {
            window.STATUS.err('Допустимо не более 10 элементов')
            return false;
        }

        //remove attr
        fieldRepeeat.querySelector('input').value = ''
        fieldRepeeat.querySelector('input').removeAttribute('area-valid')

        //remove button
        const removeElem = fieldRepeeat.querySelector('.remove-repeater')

        //remove string
        removeElem.addEventListener('click', function (event) {

            if (confirm('Удалить?')) {
                event.target.closest('.form__item').remove()
            }

        })

        if (MATERIAL_INPUT) {
            fieldRepeeat.querySelectorAll('input').forEach(function (item) {
                MATERIAL_INPUT.addEvent(item)
            })
        }

        //append elem
        container.append(fieldRepeeat)
    }

    if (document.querySelector('[data-add="awards"]')) {

        document.querySelector('[data-add="awards"]').addEventListener('click', function () {
            addFields('awards')
        })

    }

    /* ==================================================
    добавить Фильмография
    ================================================== */

    if (document.querySelector('[data-add="filmography"]')) {
        document.querySelector('[data-add="filmography"]').addEventListener('click', function () {
            addFields('filmography')
        })

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

            this.btnSave.addEventListener('click', function () {
                _this.submitData()
            })
            this.btnDelete.addEventListener('click', function () {
                _this.openRemove()
            })
            this.btnEdit.addEventListener('click', function () {
                _this.openEdit()
            })
            this.btnRemove.addEventListener('click', function () {
                _this.submitDeleteComment()
            })
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
        let instanse = new comentEdit(elem);
        instanse.init()
    })


    /* ==========================================
    ссылка редатировать режисера
    ========================================== */

    if (document.querySelector('[data-select-edit]')) {
        document.querySelector('[data-select-edit]').addEventListener('change', function () {
            let link = this.dataset.selectEdit
            let id = this.value;
            document.querySelector('.card-director-edit').setAttribute('href', link.replace('$id', id))
        })
    }




















});