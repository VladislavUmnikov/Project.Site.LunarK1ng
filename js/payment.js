// Форматирование номера карты
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');
    const cardholderInput = document.getElementById('cardholder');

    // Форматирование номера карты с отображением звездочек
    const cardNumberDisplay = document.getElementById('card-number-display');
    
    if (cardNumberInput && cardNumberDisplay) {
        // Инициализация - показываем звездочки
        const updateCardDisplay = () => {
            let value = cardNumberInput.value.replace(/\s/g, '');
            let displayHTML = '';
            
            if (value.length === 0) {
                displayHTML = '<span style="opacity: 0.5;">**** **** **** ****</span>';
            } else {
                // Заменяем звездочки на введенные цифры
                let formatted = '';
                for (let i = 0; i < 16; i++) {
                    if (i < value.length) {
                        formatted += value[i];
                    } else {
                        formatted += '*';
                    }
                    // Добавляем пробел после каждых 4 символов
                    if ((i + 1) % 4 === 0 && i < 15) {
                        formatted += ' ';
                    }
                }
                
                // Создаем HTML с разными стилями для цифр и звездочек
                displayHTML = formatted.split('').map(char => {
                    if (char === '*') {
                        return '<span style="opacity: 0.5;">*</span>';
                    } else if (char === ' ') {
                        return ' ';
                    } else {
                        return char;
                    }
                }).join('');
            }
            
            cardNumberDisplay.innerHTML = displayHTML;
        };
        
        cardNumberInput.addEventListener('input', function(e) {
            // Только цифры
            let value = e.target.value.replace(/\D/g, '').substring(0, 16);
            e.target.value = value;
            
            // Форматируем для сохранения (с пробелами)
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            
            // Обновляем визуальное отображение
            updateCardDisplay();
        });
        
        cardNumberInput.addEventListener('focus', function() {
            cardNumberDisplay.style.opacity = '1';
        });
        
        cardNumberInput.addEventListener('blur', function() {
            if (cardNumberInput.value.length === 0) {
                cardNumberDisplay.textContent = '**** **** **** ****';
            }
        });
        
        // Инициализация при загрузке
        updateCardDisplay();
    }

    // Форматирование срока действия (MM/YY)
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Только цифры для CVV
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Только буквы для имени держателя карты
    if (cardholderInput) {
        cardholderInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-ZА-Я\s]/g, '');
        });
    }

    // Получение параметров из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product') || 'Премиум подписка';
    const productPrice = urlParams.get('price') || '299₽';

    // Обновление информации о заказе
    const productNameElement = document.getElementById('product-name');
    const productPriceElement = document.getElementById('product-price');
    const totalPriceElement = document.getElementById('total-price');

    if (productNameElement) productNameElement.textContent = productName;
    if (productPriceElement) productPriceElement.textContent = productPrice;
    if (totalPriceElement) totalPriceElement.textContent = productPrice;

    // Обработка формы оплаты
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы
            const cardholder = document.getElementById('cardholder').value.trim();
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;
            const email = document.getElementById('email').value.trim();

            // Простая валидация
            if (cardNumber.length < 16) {
                alert('Пожалуйста, введите корректный номер карты');
                return;
            }

            if (expiry.length < 5) {
                alert('Пожалуйста, введите корректный срок действия карты');
                return;
            }

            if (cvv.length < 3) {
                alert('Пожалуйста, введите корректный CVV код');
                return;
            }

            // Здесь должна быть интеграция с платежной системой
            // Пока просто показываем сообщение
            alert('Оплата обрабатывается...\n\nВ реальном проекте здесь будет интеграция с платежным шлюзом (например, Stripe, PayPal, ЮKassa и т.д.)');
            
            // Можно добавить редирект на страницу успеха
            // window.location.href = 'success.html';
        });
    }
});

