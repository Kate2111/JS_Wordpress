window.addEventListener('DOMContentLoaded', () => {

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]');
    //const modalCloseBtn = document.querySelector('[data-close]');
    const modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('show');
            modal.classList.remove('hide');
        });
    });
    
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
    }

    //modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '' ) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });


    //Forms 

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так'
    };

    
    forms.forEach(item => {
        bindPostData(item);
    });

    /*  
    //FormData (старый метод)

    //способ передачи FormData = формирует данные ключ 

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            //заголовок не нужен
            const formData = new FormData(form)

            request.send(formData);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response)
                    statusMessage.textContent = message.success;
                    form.reset(); //сбрасываем input, очищаем форму
                    setTimeout(() => {
                        statusMessage.remove();
                    }), 2000;
                } else {
                    statusMessage.textContent = message.failure;
                }
            });

        });
    } */

    //JSON формат

    const postData = async (url, data) => {
        const res = await fetch(url, { 
            method: "POST",
            headers: {
                'Content-type': 'application/json'
                }, 
            body: data
        });

        return res.json();
    };  //отвечает за постинг данных, отправку данных на сервер

    function bindPostData(form) { // отвечает за привязку постинга
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });

            postData('http://localhost:3000/requests', JSON.stringify(object))
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();   
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset(); //сбрасываем input, очищаем форму
            });
        });
    }
    // Создаем окно-оповещение пользователя
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal_dialog');

        prevModalDialog.classList.add('hide');
        //openModal(); // Эта функция отвечает за открытие модальных окон

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal_dialog');
        thanksModal.innerHTML = `
            <div class="modal_content">                  
                <div data-close class="modal_close">&times;</div>
                <div class="modal_title">${message}</div>
            </div> 
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    /* 
    fetch('http://localhost:3000/wait')
        .then(data => data.json())
        .then(res => console.log(res)); */
        

});