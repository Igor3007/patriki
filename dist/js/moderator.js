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
                }, false, function (response) {
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
                }, false, function (response) {
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
        document.querySelector('[data-attach=poster]').addEventListener('change', function () {

            let files = this.files;
            let elem = this;

            sendFiles(files, elem, function (dataImage) {

                elem.closest('.film-poster__cover').classList.add('cover--loaded')
                elem.closest('.film-poster__cover').querySelector('[data-attach="preview-poster"]').src = dataImage

            });

        })
    }



    /* =============================================
    repeater
    ============================================= */

    if (document.querySelector('[data-repeeat="add"]')) {
        document.querySelector('[data-repeeat="add"]').addEventListener('click', function (event) {
            const container = document.querySelector('[data-repeeat="container"]')
            const fieldRepeeat = container.children[0].cloneNode(true)
            const lastElem = fieldRepeeat.children[(fieldRepeeat.children.length - 1)]

            //max 10 fields
            if (container.querySelectorAll('.remove-repeeatter').length > 9) {
                window.STATUS.err('Допустимо не более 10 элементов')

                return false;
            }

            //remove disabled attr
            lastElem.querySelector('input').removeAttribute('disabled')
            lastElem.querySelector('input').setAttribute('placeholder', 'Должность')
            lastElem.querySelector('input').setAttribute('value', '')

            //create remove button
            const removeElem = document.createElement('span')
            removeElem.classList.add('remove-repeeatter')

            //remove string
            removeElem.addEventListener('click', function (event) {

                if (confirm('Удалить?')) {
                    event.target.closest('.form__item').remove()
                }

            })


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


            item.addEventListener('click', function (event) {
                console.log(item)
            })

            //add event
            // item.addEventListener('click', function () {

            //     console.log('inMapPopup')

            //     var inMapPopup = new customModal()

            //     console.log(inMapPopup)


            //     inMapPopup.open('<div id="af-timepicker">timepicker</div>', function (instanse) {

            //     })
            // })

        })

    }

    /* ===========================================
    load message
    =========================================== */

    if (document.querySelector('.messenger')) {

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
                    if (event.target.scrollTop < 100) {
                        instanseMessages.scroll([0, 2], 100);
                        loadMessages()
                    }
                }
            }
        });

        // load messages

        function loadMessages() {
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
            })
        }



        document.querySelectorAll('[data-user]').forEach(function (item) {
            item.addEventListener('click', function () {

                document.querySelector('.messenger__user').innerText = item.querySelector('.messenger-contact__name').innerText

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
                    console.log(document.querySelector('.messenger__messages'))
                    instanseMessages.scroll([0, "100%"], 100);
                })

            })
        })

        //back to contacts
        document.querySelector('.messenger__back').addEventListener('click', function () {
            contacts.style.display = 'block'
            chat.style.display = 'none'
        })
    }










});