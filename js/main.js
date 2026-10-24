// =========================================================
// ТехноЛавка — минимальный JavaScript для КР №1.
// 1. Открытие и закрытие модального окна заявки.
// 2. Базовая проверка форм перед «отправкой» (backend пока не подключён).
// Автор: Куксов Денис Сергеевич, ЭФБО-14-25
// =========================================================

// ---------- 1. Модальное окно ----------

// Получаем модальное окно по id. На страницах без модального окна будет null.
const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
  // Все кнопки «Заказать», у которых есть data-атрибут с названием товара.
  const orderButtons = document.querySelectorAll('[data-product]');

  // Кнопка «Закрыть» внутри модального окна.
  const closeDialogButton = document.getElementById('close-order-dialog');

  // Скрытое поле, в которое записывается выбранный товар.
  const selectedProductInput = document.getElementById('selected-product');

  // Строка под заголовком окна, где показываем выбранный товар.
  const dialogProduct = document.getElementById('order-dialog-product');

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Получаем название товара из data-атрибута.
      const productName = button.dataset.product;

      // Записываем название товара в скрытое поле формы.
      selectedProductInput.value = productName;

      // Показываем пользователю, какой товар он заказывает.
      dialogProduct.textContent = `Товар: ${productName}`;
      dialogProduct.hidden = false;

      // Открываем модальное окно.
      orderDialog.showModal();
    });
  });

  // Закрываем модальное окно по кнопке «Закрыть».
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });

  // Закрываем окно кликом по затемнённому фону вокруг него.
  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });
}

// ---------- 2. Проверка форм ----------

// Обрабатываем все формы с атрибутом data-validate:
// форму в модальном окне, форму заявки (order.html) и форму обратной связи (contacts.html).
const forms = document.querySelectorAll('form[data-validate]');

forms.forEach((form) => {
  // id сообщения об успехе хранится в атрибуте data-success.
  const successMessage = document.getElementById(form.dataset.success);

  // Модальное окно, если форма находится внутри него.
  const parentDialog = form.closest('dialog');

  // Поля, которые участвуют в проверке.
  const fields = Array.from(form.elements).filter((element) => element.willValidate);

  // Как только пользователь исправил поле, убираем подсветку ошибки.
  fields.forEach((field) => {
    field.addEventListener('input', () => {
      if (field.hasAttribute('aria-invalid') && field.checkValidity()) {
        field.removeAttribute('aria-invalid');
      }
    });
  });

  form.addEventListener('submit', (event) => {
    // Отменяем стандартную отправку формы, потому что backend пока не подключён.
    event.preventDefault();

    // Сбрасываем предыдущие признаки ошибок.
    fields.forEach((field) => field.removeAttribute('aria-invalid'));

    // Проверяем встроенные HTML-ограничения формы (required, type, pattern, minlength).
    if (!form.checkValidity()) {
      fields.forEach((field) => {
        if (!field.checkValidity()) {
          field.setAttribute('aria-invalid', 'true');
        }
      });

      // Показываем стандартные сообщения браузера.
      form.reportValidity();
      return;
    }

    // Очищаем форму.
    form.reset();

    // Закрываем модальное окно, если форма была в нём.
    if (parentDialog) {
      parentDialog.close();
    }

    // Показываем сообщение об успешной отправке и прокручиваем к нему.
    if (successMessage) {
      successMessage.hidden = false;
      successMessage.scrollIntoView({ block: 'center' });
    }
  });

  // При очистке формы (кнопка type="reset" или form.reset()) убираем подсветку ошибок.
  form.addEventListener('reset', () => {
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
  });
});
