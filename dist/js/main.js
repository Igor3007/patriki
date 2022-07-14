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



});