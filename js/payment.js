document.addEventListener('DOMContentLoaded', function () {
    const cardNumberInput = document.getElementById('card-number');
    const cardholderInput = document.getElementById('cardholder');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');

    const cardNumberDisplay = document.getElementById('card-number-display');
    const cardHolderDisplay = document.getElementById('card-holder-display');
    const cardExpiryDisplay = document.getElementById('card-expiry-display');

    // Номер карты: только цифры, живое отображение на визуальной карте
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            const digits = e.target.value.replace(/\D/g, '').substring(0, 16);
            e.target.value = digits.match(/.{1,4}/g)?.join(' ') || digits;

            const padded = digits.padEnd(16, '•');
            cardNumberDisplay.textContent = padded.match(/.{1,4}/g).join(' ');
        });
    }

    // Держатель: только буквы, верхний регистр, отражается на карте
    if (cardholderInput) {
        cardholderInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-ZА-Я\s]/g, '');
            cardHolderDisplay.textContent = e.target.value || 'IVAN IVANOV';
        });
    }

    // Срок действия MM/YY
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (value.length >= 3) value = value.substring(0, 2) + '/' + value.substring(2);
            e.target.value = value;
            cardExpiryDisplay.textContent = value || 'MM/YY';
        });
    }

    // CVV: только цифры
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }

    // Параметры товара из URL
    const params = new URLSearchParams(window.location.search);
    const productName = params.get('product') || 'Премиум подписка';
    const productPrice = params.get('price') || '299₽';

    const nameEl = document.getElementById('product-name');
    const priceEl = document.getElementById('product-price');
    const totalEl = document.getElementById('total-price');
    if (nameEl) nameEl.textContent = productName;
    if (priceEl) priceEl.textContent = productPrice;
    if (totalEl) totalEl.textContent = productPrice;

    // Отправка формы — демо-режим, никакие данные никуда не уходят
    const form = document.getElementById('payment-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const cardNumber = cardNumberInput.value.replace(/\s/g, '');
            const expiry = expiryInput.value;
            const cvv = cvvInput.value;

            if (cardNumber.length < 16) { alert('Введите корректный номер карты'); return; }
            if (expiry.length < 5) { alert('Введите корректный срок действия карты'); return; }
            if (cvv.length < 3) { alert('Введите корректный CVV-код'); return; }

            // Здесь должна быть интеграция с реальным платёжным шлюзом
            // (например, ЮKassa, CloudPayments, Stripe и т.д.)
            alert('Это демо-форма оплаты.\nВ рабочем проекте здесь будет интеграция с платёжным шлюзом.');
        });
    }
});
