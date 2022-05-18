class customModal {
    constructor(opion) {

        this.selector = '[data-inmap]',
            this.src = null,
            this.instanse = null,
            this.on = {
                afterShow: null
            }
    }

    init() {
        //this.createTemplate()
    }

    createTemplate() {
        let template = document.createElement('div')
        template.innerHTML = `
                <div class="af-popup">
                    <div class="af-popup__bg"></div>
                    <div class="af-popup__wrp">
                        <div class="af-popup__container">
                            <div class="af-popup__close">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"></path></svg>
                            </div>
                            <div class="af-popup__content"></div>
                        </div>
                    </div>
                </div>
                `

        document.body.append(template)

        this.instanse = template;

        return template;
    }

    open(content, afterShow) {

        let _this = this;
        let modal = this.createTemplate();
        modal.querySelector('.af-popup__content').innerHTML = content
        modal.querySelector('.af-popup__close').addEventListener('click', function () {
            _this.close()
        })


        if (afterShow) afterShow(modal);

        this.createEvent();

    }

    createEvent() {

        let _this = this

        this.instanse.querySelector('.af-popup').addEventListener('click', function () {
            _this.close()
        })
        this.instanse.querySelector('.af-popup__container').addEventListener('click', function (event) {
            event.stopPropagation(true)
        })
    }

    close() {
        this.instanse.remove()
    }
}