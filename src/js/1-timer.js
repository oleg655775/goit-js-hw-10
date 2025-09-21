import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let timerInterval = null;
const button = document.querySelector('button[data-start]');
const selectedInput = document.querySelector('#datetime-picker');
const timerResult = document.querySelector('.timer');

button.disabled = true;
button.addEventListener('click', timerStart);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (Date.now() < Date.parse(selectedDates[0])) {
      userSelectedDate = selectedDates[0];
      button.disabled = false;
    } else {
      button.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future.',
        position: 'topRight',
      });
    }
  },
};

flatpickr(selectedInput, options);

function timerStart() {
  if (timerInterval !== null) return;
  triggersDisable();
  timerInterval = setInterval(() => {
    const resultTime = userSelectedDate - Date.now();

    if (resultTime < 0) {
      stopTimer();
      return;
    }

    updateTimer(convertMs(resultTime));
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer({ days, hours, minutes, seconds }) {
  timerResult.querySelector('[data-days]').textContent = addLeadingZero(days);
  timerResult.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  timerResult.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
  timerResult.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  triggersEnable();
  updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
}

function triggersDisable() {
  button.disabled = true;
  selectedInput.disabled = true;
}

function triggersEnable() {
  selectedInput.disabled = false;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
