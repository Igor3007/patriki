document.addEventListener('DOMContentLoaded', function (event) {
    /* ===========================================
    load message
    =========================================== */



    if (document.querySelector('.messenger')) {

        const chat = document.querySelector('[data-pane="chat"]')
        const contacts = document.querySelector('[data-pane="contacts"]')

        document.querySelectorAll('[data-user]').forEach(function (item) {
            item.addEventListener('click', function () {

                if (document.body.clientWidth <= 766) {
                    chat.style.display = 'block'
                    contacts.style.display = 'none'
                }

                let user_id = this.dataset.user;
                console.log(user_id)

                //ajax request



            })
        })

        //back to contacts
        document.querySelector('.messenger__back').addEventListener('click', function () {
            contacts.style.display = 'block'
            chat.style.display = 'none'
        })
    }


});