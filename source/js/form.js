import * as Pristine from '../pristine/pristine.min.js';

import { OfferTypeToPrice, ROOMS_CAPACITYS } from './form-data.js';
import { sliderInit, sliderReset } from './slider.js';
import { mapReset, closeMapPopup } from './map.js';
import { sendData } from './ajax.js';
import { mapFiltersReset } from './form-filter.js';
import { setAvatarOnDefault, setImagesOnDefault } from './form-images.js';

const mainForm = document.querySelector('.ad-form');
const mainFormFieldsets = mainForm.querySelectorAll('fieldset');
const mainFormSlider = mainForm.querySelector('.ad-form__slider');
const priceField = mainForm.querySelector('[name="price"]');
const typeOfHousesField = mainForm.querySelector('[name="type"]');
const timeIn = mainForm.querySelector('[name="timein"]');
const timeOut = mainForm.querySelector('[name="timeout"]');
const timeInOutParent = mainForm.querySelector('.ad-form__element--time');
const rooms = mainForm.querySelector('[name="rooms"]');
const capacity = mainForm.querySelector('[name="capacity"]');

const resetButton = mainForm.querySelector('[type="reset"]');
const submitButton = mainForm.querySelector('[type="submit"]');

//Pristine default messages set on Ru
Pristine.addMessages('ru', {
  required: 'Пожалуйста, заполните это поле!',
  email: 'Пожалуйста, введите корректный адрес электронной почты!',
  number: 'Пожалуйста, введите числовое значение!',
  integer: 'Пожалуйста, введите целое числовое значение!',
  url: 'Пожалуйста, введите корректный URL веб-сайта!',
  tel: 'Пож default:алуйста, введите корректный номер телефона!',
  maxlength: `Значение поля должно быть не более \${${1}} символов`,
  minlength: `Значение поля должно быть не менее \${${1}} символов`,
  min: `Минимальное значение - \${${1}}!`,
  max: `Максимальное значение - \${${1}}!`,
  pattern: 'Пожалуйста, введите значения в необходимом формате!',
  equals: 'Ой! Значения не совпадают!',
  default: 'Пожалуйста, введите корректное значение!'
});
Pristine.setLocale('ru');

//Pristine make classes
const pristine = new Pristine(mainForm, {
  classTo: 'ad-form__element--validating',
  errorClass: 'ad-form__element--validating-danger',
  successClass: 'ad-form__element--validating-success',
  errorTextParent: 'ad-form__element--validating',
  errorTextTag: 'span',
  errorTextClass: 'ad-form__element--validating-error'
});


/**
 * form disabling-activating
 * @param {*} value - boolean
 */
const toggleFormToUnactive = (value) => {
  mainForm.classList.toggle('ad-form--disabled', value);
  mainFormFieldsets.forEach((element) => {
    element.disabled = value;
    element.children.disabled = value;
  });
  mainFormSlider.classList.toggle('ad-form--disabled', value);
  priceField.placeholder = OfferTypeToPrice[typeOfHousesField.value];
  priceField.min = OfferTypeToPrice[typeOfHousesField.value];
  if (value) {
    const validate = () => pristine.validate(priceField);
    sliderInit(validate);
  }
};

/**
 * form validating
 */
const formValidating = () => {

  //on change house type
  typeOfHousesField.addEventListener('input', () => {
    priceField.placeholder = OfferTypeToPrice[typeOfHousesField.value];
    priceField.min = OfferTypeToPrice[typeOfHousesField.value];
    if (priceField.value) {
      pristine.validate(priceField);
    }
  });

  //price for living validation
  const validatePrice = (value) => value >= OfferTypeToPrice[typeOfHousesField.value] && value <= 100000;
  const getPriceErrorMessage = () => `Не менее ${OfferTypeToPrice[typeOfHousesField.value]} и не более 100 000`;
  pristine.addValidator(priceField, validatePrice, getPriceErrorMessage, 1, false);

  //handler. synchronize checkin and checkout
  timeInOutParent.addEventListener('change', (evt) => {
    timeIn.value = timeOut.value = evt.target.value;
  });

  //synchronize rooms and capacity
  const validateCapacity = () => ROOMS_CAPACITYS[rooms.value].includes(capacity.value);
  pristine.addValidator(capacity, validateCapacity, 'Пожалуйста, выберите верное количество гостей или комнат', 1, false);

  rooms.addEventListener('change', () => {
    pristine.validate(capacity);
  });
};


/**
 * form toggle active/unactive
 * @param {*} isActive - boolean
 */
const initForm = (isActive) => {
  toggleFormToUnactive(isActive);
  if (!isActive) {
    formValidating();
  }
};


/**
 * reset form to default
 */
const resetFormToDefault = () => {
  mainForm.reset();
  priceField.placeholder = OfferTypeToPrice[typeOfHousesField.value];
  mapReset();
  sliderReset();
  pristine.reset();
  closeMapPopup();
  mapFiltersReset();
  setAvatarOnDefault();
  setImagesOnDefault();
};

//main form button blocking
const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

//main form button unblocking
const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

/**
 * handler. form validating on submit
 * @param {*} cb - to make render default map markers @see renderMarkers
 */
const checkSubmitButton = (cb) => {
  mainForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (pristine.validate()) {
      blockSubmitButton();
      const formData = new FormData(evt.target);
      sendData(formData, unblockSubmitButton, cb);
    }
  });
};

/**
 * handler. Reset button on click
 * @param {*} cb -to make render default map markers @see renderMarkers
 */
const checkResetButton = (cb) => {
  resetButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    resetFormToDefault();
    cb();
  });
};

export { initForm, resetFormToDefault, toggleFormToUnactive, formValidating, checkResetButton, checkSubmitButton };
