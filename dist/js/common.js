document.addEventListener("DOMContentLoaded", function (event) {


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
            this.el.classList.add('open')
            this.button.classList.add('open')
            document.body.classList.add('hidden')
            this.state = 'open';
        }

        this.close = function () {

            this.el.classList.add('close-animate')
            this.button.classList.remove('open')

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

    const menuInstanse = new mobileMenu({
        elButton,
        elContainer
    })

    elButton.addEventListener('click', function () {
        menuInstanse.toggle()
    })





    /* ==============================================
    select
    ============================================== */

    const selectCustom = new customSelect({
        selector: 'select'
    })

    selectCustom.init()

});