document.addEventListener("DOMContentLoaded", function (event) {
    /* ========================================
    validate fields
    ======================================== */

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function passValidateRules(pass) {
        this.value;

        //не менее 6 символов (латинские буквы и цифры)
        this.validatePasswordEnNum = function (pass) {
            let regexp = '(?=^.{6,}$)((?=.*\d)|(?=.*\W+)|).*';
            return (this.value.match(regexp) ? true : false);
        }

        this.validatePasswordRus = function (pass) {
            let regexp = '(?=.*[А-яЁё])';
            return (this.value.match(regexp) ? true : false);
        }

        //должен содержать не менее одной цифры
        this.validatePasswordOneNum = function (pass) {
            let regexp = '(?=.*[0-9])';
            return (this.value.match(regexp) ? true : false);
        }

        //должен содержать не менее одной заглавной буквы
        this.validatePasswordCap = function (pass) {
            // debugger
            let regexp = '(?=.*[A-Z]).*';
            return (this.value.match(regexp) ? true : false);
        }
    }

    //password

    function checkPassword(value) {

        console.log(value)

        PASSVALID.value = value
        let errorList = [];

        if (!PASSVALID.validatePasswordEnNum()) {
            errorList.push('- не менее 6 символов (латинские буквы и цифры)')
        }

        if (!PASSVALID.validatePasswordOneNum()) {
            errorList.push('- не менее одной цифры')
        }
        if (!PASSVALID.validatePasswordCap()) {
            errorList.push('- не менее одной заглавной буквы')
        }

        if (PASSVALID.validatePasswordRus()) {
            errorList.push('- русские символы не допустимы ')
        }

        //print list
        if (errorList.length && this.value != '') {
            window.STATUS.autoHide = false;
            window.STATUS.wrn(errorList.join('\n'), 'Пароль должен содержать')
        } else {
            window.STATUS.timeOut = 300;
            window.STATUS.onHide()
        }

        return (errorList.length ? false : true)
    }

    const PASSVALID = new passValidateRules()

    document.querySelectorAll('input[type=password]').forEach(function (item) {
        item.addEventListener('keyup', function () {


            if (checkPassword(this.value)) {
                this.setAttribute('aria-valid', 'true')
            } else {
                this.setAttribute('aria-valid', 'false')
            }


        })
    })

    //email

    document.querySelectorAll('input[type=email]').forEach(function (item) {
        item.addEventListener('keyup', function () {


            if (validateEmail(this.value)) {
                this.setAttribute('aria-valid', 'true')
            } else {
                this.setAttribute('aria-valid', 'false')
            }


        })
    })

    // password repeat

    document.querySelectorAll('input[data-password-repeat]').forEach(function (item) {
        item.addEventListener('change', function () {


            let dataType = this.dataset.passwordRepeat
            let allFields = document.querySelectorAll(('input[data-password-repeat="' + dataType + '"]'))

            if (allFields[0].value != '' && allFields[1].value != '') {
                if (allFields[0].value !== allFields[1].value) {
                    allFields[0].setAttribute('aria-valid', 'false')
                    allFields[1].setAttribute('aria-valid', 'false')

                    window.STATUS.autoHide = false;
                    window.STATUS.wrn('Пароли не совпадают')
                } else {
                    allFields[0].setAttribute('aria-valid', 'true')
                    allFields[1].setAttribute('aria-valid', 'true')
                    window.STATUS.timeOut = 300;
                    window.STATUS.onHide()
                }
            }


        })
    })

    // required

    document.querySelectorAll('form').forEach(function (form) {
        form.addEventListener('submit', function (event) {

            event.preventDefault()

            let errorList = []

            //for input
            this.querySelectorAll('input[required]').forEach(function (input) {
                if (input.value == '') {
                    input.setAttribute('aria-valid', 'false')
                    errorList.push(input.name)
                } else {
                    input.setAttribute('aria-valid', 'true')
                }
            })

            //for select
            this.querySelectorAll('select[required]').forEach(function (select) {
                if (select.value == '' || select.value == 0) {
                    select.parentNode.setAttribute('aria-valid', 'false')
                    errorList.push(select.name)
                } else {
                    select.parentNode.setAttribute('aria-valid', 'true')
                }
            })

            console.log(errorList)

            if (errorList.length) {
                window.STATUS.autoHide = true;
                window.STATUS.timeOut = 10000;
                window.STATUS.err('Заполните все путые поля')
            } else {
                form.submit()
            }

        })
    })




    /* ========================================
    upload photo
    ======================================== */

    document.querySelector('[data-attach=photo]').addEventListener('change', function () {

        let files = this.files;
        let elem = this;

        sendFiles(files, elem, function (dataImage) {

            elem.closest('form').querySelector('[data-attach="preview"]').style.backgroundImage = 'url(' + dataImage + ')'

        });

    })

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
})