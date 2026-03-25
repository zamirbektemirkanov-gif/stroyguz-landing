// === Фиксированная шапка при скролле ===
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > 50);
});

// === Калькулятор ===
const cargoType = document.getElementById('cargo-type');
const distanceInput = document.getElementById('distance');
const distanceValue = document.getElementById('distance-value');
const calcPrice = document.getElementById('calc-price');

const BASE_PRICE = 150; // ₽ за км

function updateCalc() {
  const multiplier = parseFloat(cargoType.value);
  const km = parseInt(distanceInput.value);
  const price = Math.round(BASE_PRICE * km * multiplier / 100) * 100;
  distanceValue.textContent = km;
  calcPrice.textContent = price.toLocaleString('ru-RU') + ' ₽';
}

distanceInput.addEventListener('input', updateCalc);
cargoType.addEventListener('change', updateCalc);
updateCalc();

// === Валидация формы ===
const form = document.getElementById('orderForm');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  document.getElementById('nameError').textContent = '';
  document.getElementById('phoneError').textContent = '';

  if (nameInput.value.trim().length < 2) {
    document.getElementById('nameError').textContent = 'Введите ваше имя';
    valid = false;
  }

  const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
  if (!phoneRegex.test(phoneInput.value.trim())) {
    document.getElementById('phoneError').textContent = 'Введите корректный номер телефона';
    valid = false;
  }

  if (valid) {
    form.reset();
    document.getElementById('formSuccess').style.display = 'block';
    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'none';
    }, 4000);
  }
});

// === Анимация при скролле ===
const animatedEls = document.querySelectorAll(
  '.advantages__item, .services__card, .steps__item, .reviews__card'
);

animatedEls.forEach(el => el.classList.add('animate'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

animatedEls.forEach(el => observer.observe(el));