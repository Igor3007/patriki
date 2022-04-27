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


});