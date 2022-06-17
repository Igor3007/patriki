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

    //add event remove-repeater
    document.querySelectorAll('.remove-repeater').forEach(function (item, index) {

        if (!index) return false;

        item.addEventListener('click', function (event) {
            if (confirm('Удалить?')) {
                event.target.closest('.form__item').remove()
            }

        })
    })

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

                //init datepicker

                let inputDatepicker = fieldRepeeat.querySelector('.input-datepicker')
                inputDatepicker.value = ''
                inputDatepicker.removeAttribute('area-valid')

                fieldRepeeat.querySelector('.datepicker').remove()

                window.initDatepicker(inputDatepicker, {
                    autoShow: false
                })
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

                    instanse.querySelectorAll('[data-copy]').forEach(function (item) {
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
        document.querySelectorAll('[data-add="awards"]').forEach(function (item) {
            item.addEventListener('click', function () {
                addFields('awards')
            })
        })

    }

    /* ==================================================
    добавить Фильмография
    ================================================== */

    if (document.querySelector('[data-add="filmography"]')) {
        document.querySelectorAll('[data-add="filmography"]').forEach(function (item) {
            item.addEventListener('click', function () {
                addFields('filmography')
            })
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

    if (document.querySelector('[data-logline="container"]')) {

        document.querySelectorAll('[data-logline="container"]').forEach(function (container) {
            const instanse = new logline(container)
            instanse.init();
        })


    }

    /* =================================================
    Логлайн в карточке фильма
    ================================================= */

    function logline(elem) {
        this.container = elem;

        this.btnEdit = elem.querySelector('[data-logline="edit"]')
        this.btnSend = elem.querySelector('[data-logline="send"]')
        this.btnCancel = elem.querySelector('[data-logline="cancel"]')
        this.elemNew = elem.querySelector('[data-logline="new"]')
        this.elemCurrent = elem.querySelector('[data-logline="current"]')

        this.init = function () {
            this.addEvent()
        }

        this.openNewTextarea = function () {
            this.elemNew.classList.add('open')
            this.container.classList.add('film-logline--edit')

            this.elemCurrent.style.display = 'none';
            this.btnEdit.style.display = 'none';
            this.btnSend.style.display = 'inline-block';
            this.btnCancel.style.display = 'inline-block';

            let currentText = this.elemCurrent.querySelector('textarea').value
            this.elemNew.querySelector('textarea').value = currentText
            this.elemNew.querySelector('textarea').removeAttribute('disabled')

        }
        this.closeNewTextarea = function () {
            this.elemNew.classList.remove('open')
            this.container.classList.remove('film-logline--edit')
            this.elemCurrent.style.display = 'block';
            this.btnEdit.style.display = 'inline-block';
            this.btnSend.style.display = 'none';
            this.btnCancel.style.display = 'none';
        }

        this.addEvent = function () {
            this.btnEdit.addEventListener('click', () => {
                this.openNewTextarea()
            })
            this.btnCancel.addEventListener('click', () => {
                this.closeNewTextarea()
                this.elemNew.querySelector('textarea').value = ''
            })
            this.btnCancel.addEventListener('click', () => {
                this.closeNewTextarea()
            })
            this.btnSend.addEventListener('click', (event) => {

                let _this = this

                window.ajax({
                    type: 'POST',
                    url: '/index.php',
                    data: {
                        id: 123
                    }
                }, function () {
                    _this.elemCurrent.style.display = 'block';
                    _this.btnEdit.style.display = 'inline-block';
                    _this.btnSend.style.display = 'none';
                    _this.btnCancel.style.display = 'none';
                    _this.elemNew.querySelector('textarea').setAttribute('disabled', true)

                    window.STATUS.msg(event.target.dataset.msg, ' ')
                })

            })
        }
    }

    if (document.querySelector('[data-logline="container"]')) {
        const instanse = new logline(document.querySelector('[data-logline="container"]'))
        instanse.init();
    }


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

    /* ==========================================
    suggest input
    ========================================== */



    function inputSuggest(option) {

        this.option = option
        this.elem = option.elem
        this.list = document.createElement('ul');

        this.init = function () {
            this.createSuggestList()
            this.addEvent()
        }

        this.createSuggestList = function () {


            let _this = this

            this.loadSuggestElem(this.elem.dataset.url, function (arr) {

                _this.list.querySelectorAll('li').forEach((removeItem) => {
                    removeItem.remove()
                })

                arr.forEach((item) => {
                    let li = document.createElement('li')
                    li.innerText = item.text
                    li.setAttribute('rel', item.value)

                    _this.eventListItem(li)
                    _this.list.append(li)
                })
            })

            this.list.classList.add('suggest-list')

            this.mountList()

        }

        this.mountList = function () {
            this.elem.parentNode.append(this.list)
        }

        this.loadSuggestElem = function (url, callback) {
            window.ajax({
                type: 'GET',
                responseType: 'json',
                url: url
            }, function (status, response) {
                callback(response)
            })
        }

        this.changeInput = function (event) {

            let value = event.target.value.toLowerCase()

            if (true) {

                this.list.style.display = 'initial'

                this.list.querySelectorAll('li').forEach(function (li) {

                    if (li.classList.contains('hide')) {
                        li.classList.remove('hide')
                    }

                    if (li.innerText.toLowerCase().indexOf(value) == -1 && value.length) {
                        li.classList.add('hide')
                    }
                })

                //update list
                this.mountList()
            }
        }

        this.closeList = function () {
            this.list.style.display = 'none'

            if (!this.elem.value.length) {
                this.elem.removeAttribute('area-valid')
                this.option.on.change('', false)
            }

        }
        this.openList = function () {
            this.list.style.display = 'block'
            this.elem.setAttribute('area-valid', true)
            this.createSuggestList()
        }

        this.addEvent = function () {
            this.elem.addEventListener('keyup', (event) => {
                this.changeInput(event)
            })
            this.elem.addEventListener('focus', (event) => {
                this.openList()
            })
            document.addEventListener('click', () => {
                this.closeList()
            })
            this.elem.addEventListener('click', (event) => {
                event.stopPropagation()
            })
        }

        this.eventListItem = function (li) {
            li.addEventListener('click', (event) => {
                this.elem.setAttribute('area-valid', true)
                this.elem.value = event.target.innerText
                this.closeList()

                this.option.on.change(event.target.innerText, event.target.getAttribute('rel'))
            })
        }

    }

    if (document.querySelectorAll('.input-suggest')) {
        document.querySelectorAll('.input-suggest').forEach(function (input) {

            let instanse = new inputSuggest({
                elem: input,
                on: {
                    change: function (text, value) {

                        if (document.querySelector('.card-director-edit')) {
                            let elem = document.querySelector('.card-director-edit')
                            let link = elem.dataset.ajax

                            if (text || value) {
                                elem.setAttribute('data-url', link.replace('$id', value))
                            } else {
                                elem.removeAttribute('data-url')
                            }

                        }

                    }
                }
            });
            instanse.init()

        })
    }

    /* ==========================================
    Карточка режисера popup
    ========================================== */



    if (document.querySelectorAll('[data-modal-director="open"]').length) {
        document.querySelectorAll('[data-modal-director="open"]').forEach(function (item) {
            item.addEventListener('click', function (event) {

                // if not data-url
                if (!event.target.dataset.url) return false;

                let directorPopup = new customModal()
                let url = event.target.dataset.url


                directorPopup.open('<div>Loading...</div>', function (instanse) {

                    window.ajax({
                        type: 'GET',
                        url: url,
                    }, function (status, response) {

                        directorPopup.changeContent(response)

                        //init select
                        const select = new customSelect({
                            selector: 'select'
                        })
                        select.init()

                        //init repeat fields
                        document.querySelectorAll('[data-add="awards"]').forEach(function (item) {
                            item.addEventListener('click', function () {
                                addFields('awards')
                            })
                        })
                        document.querySelectorAll('[data-add="filmography"]').forEach(function (item) {
                            item.addEventListener('click', function () {
                                addFields('filmography')
                            })
                        })

                        //init attach photo
                        document.querySelectorAll('[data-attach=photo]').forEach(function (item) {
                            item.addEventListener('change', function () {

                                sendFiles(this.files, this, (dataImage) => {
                                    this.closest('form').querySelector('[data-attach="preview"]').style.backgroundImage = 'url(' + dataImage + ')'
                                });
                            })
                        })

                        //init material input
                        directorPopup.modal.querySelectorAll('input[type=text]').forEach(function (input) {
                            if (MATERIAL_INPUT) MATERIAL_INPUT.addEvent(input)
                            if (input.value) input.setAttribute('area-valid', true)
                        })

                        //add event remove-repeater
                        directorPopup.modal.querySelectorAll('.remove-repeater').forEach(function (item, index) {
                            if (!index) return false;
                            item.addEventListener('click', function (event) {
                                if (confirm('Удалить?')) {
                                    event.target.closest('.form__item').remove()
                                }
                            })
                        })


                        //init submit form

                        let form = document.querySelector('.af-popup form')

                        form.addEventListener('submit', function (event) {
                            event.preventDefault()
                            event.target.querySelector('[type="submit"]').classList.add('btn-loading')


                            //ajax send data

                            setTimeout(() => {
                                directorPopup.close()
                            }, 1000)

                        })

                    })
                })



            })
        })
    }

    /* ==========================================
    связанные селекты
    ========================================== */

    if (document.querySelector('[data-related="state"]')) {

        let selectState = document.querySelector('[data-related="state"]');
        let selectProgram = document.querySelector('[data-related="program"]');

        selectState.addEventListener('change', function () {

            let link = selectProgram.dataset.url
            let id = this.value;
            selectProgram.setAttribute('data-ajax', link.replace('$id', id))

            selectProgram.afSelect.update()
        })
    }

    /* =========================================
    написать модератору
    ========================================= */

    if (document.querySelector('[data-modal="message-on-moder"]')) {
        document.querySelectorAll('[data-modal="message-on-moder"]').forEach(function (button) {
            button.addEventListener('click', function (event) {

                // if not data-src
                if (!event.target.dataset.src) return false;

                let messagePopup = new customModal()
                let url = event.target.dataset.src


                messagePopup.open('<div>Loading...</div>', function (instanse) {

                    window.ajax({
                        type: 'GET',
                        url: url,
                    }, function (status, response) {

                        //append content
                        messagePopup.changeContent(response)

                        //init attach file
                        document.querySelectorAll('[data-attach="attach-on-message"]').forEach(function (item) {
                            item.addEventListener('change', function () {

                                console.log(this.files.item(0))

                                let fileData = this.files.item(0)
                                let mimeType = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'application/pdf', 'text/plain', 'application/msword']
                                let fileContainer = document.querySelector('[data-attach="filelist"] ul')

                                if (mimeType.indexOf(fileData.type) !== -1) {

                                    let form = item.closest('form');

                                    let spanRemove = document.createElement('span')
                                    let listItem = document.createElement('li')
                                    let list = document.createElement('ul')

                                    spanRemove.addEventListener('click', function () {
                                        this.parentNode.remove()
                                        item.value = ""
                                    })

                                    listItem.innerHTML = fileData.name;
                                    listItem.append(spanRemove)
                                    list.append(listItem)
                                    fileContainer.replaceWith(list)


                                } else {
                                    window.STATUS.err('Только JPG, PNG, PDF, DOC, TXT')
                                    item.value = ""
                                }








                            })
                        })

                        //init submit form
                        let form = document.querySelector('.af-popup form')

                        form.addEventListener('submit', function (event) {
                            event.preventDefault()
                            let submitBtn = event.target.querySelector('[type="submit"]')
                            submitBtn.classList.add('btn-loading')


                            //ajax send data


                            setTimeout(() => {
                                messagePopup.close()
                                window.STATUS.msg(submitBtn.dataset.msg, ' ')

                            }, 1000)

                        })

                    })

                })

            })
        })
    }


    /* =========================================
    новый чат
    ========================================= */

    if (document.querySelector('[data-modal="add-chat"]')) {

        function findUser(container, string) {
            container.querySelectorAll('[data-find-user="item"]').forEach(function (item) {
                let name = item.querySelector('.item-user__name').innerText
                let email = item.querySelector('.item-user__email').innerText

                if (email.toLowerCase().indexOf(string.toLowerCase()) == -1 && name.toLowerCase().indexOf(string.toLowerCase()) == -1) {
                    item.style.display = 'none';
                } else {
                    item.style.display = 'flex';
                }


            })
        }

        document.querySelectorAll('[data-modal="add-chat"]').forEach(function (button) {
            button.addEventListener('click', function (event) {

                // if not data-src
                if (!event.target.dataset.src) return false;

                let addChatPopup = new customModal({
                    mobileInBottom: true
                })
                let url = event.target.dataset.src


                addChatPopup.open('<div>Loading...</div>', function (instanse) {

                    window.ajax({
                        type: 'GET',
                        url: url,
                    }, function (status, response) {

                        //append content
                        addChatPopup.changeContent(response)

                        //init findUser
                        let container = addChatPopup.modal.querySelector('[data-find-user="list"]')
                        let input = addChatPopup.modal.querySelector('[data-find-user="input"]')

                        //add event input
                        input.addEventListener('keyup', function (event) {
                            findUser(container, event.target.value)
                        })

                        //add event elem
                        container.querySelectorAll('[data-find-user="item"]').forEach(function (item) {
                            item.addEventListener('click', function (event) {

                                if (addChatPopup.modal.querySelector('[data-find-user="item"].active')) {
                                    addChatPopup.modal.querySelector('[data-find-user="item"].active').classList.remove('active')
                                }

                                item.classList.toggle('active')

                            })
                        })

                        //add event click
                        addChatPopup.modal.querySelector('[data-find-user="begin"]').addEventListener('click', function () {
                            //close
                            addChatPopup.close()
                        })


                    })

                })

            })
        })
    }

    /* =========================================
    attach file for msg
    ========================================= */

    //init attach photo
    document.querySelectorAll('[data-attach=msg]').forEach(function (item) {
        item.addEventListener('change', function () {


            let fileData = this.files.item(0)
            let mimeType = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'application/pdf', 'text/plain', 'application/msword']

            if (mimeType.indexOf(fileData.type) !== -1) {

                let container = document.querySelector('.messenger__filelist')
                let template = `
                    <div class="filelist-item"> 
                        <span class="filelist-name">Файл ${fileData.name} </span>
                        <span class="filelist-remove">+</span>
                    </div>
                    `;

                container.innerHTML = template

                container.querySelectorAll('.filelist-remove').forEach(function (item) {
                    item.addEventListener('click', function (event) {
                        this.closest('.filelist-item').remove()
                        item.value = ""
                    })
                })


            } else {
                window.STATUS.err('Только JPG, PNG, PDF, DOC, TXT')
                item.value = ""
            }












        })
    })

    /* ==============================================
    export datepicker
    ============================================== */

    // document.querySelectorAll('.export-order__drop input').forEach(function (input) {
    //     input.addEventListener('focus', function (event) {
    //         window.initDatepicker(input, {
    //             autoShow: true
    //         })
    //     })
    // })

    const elem = document.querySelector('.export-order__drop');
    const input = elem.querySelector('input')
    const rangepicker = new DateRangePicker(elem, {
        language: (input.dataset.datepickerLang ? input.dataset.datepickerLang : 'ru')
    });

    document.querySelector('.export-order__btn').addEventListener('click', function () {
        this.classList.toggle('open')
        document.querySelector('.export-order__drop').classList.toggle('open')
    })

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.export-order')) {

            if (!document.querySelector('.datepicker.active')) {
                document.querySelector('.export-order__btn').classList.remove('open')
                document.querySelector('.export-order__drop').classList.remove('open')
            }
        }
    })




















});