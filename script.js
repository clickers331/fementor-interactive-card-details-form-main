import {
  updateCardElement,
  formatCardNumber,
  checkInput,
  inputFormattingRules,
  htmlElements,
} from "./utils.js";

const confirmBtn = document.getElementById("confirm-btn");
let continueBtn;
//Cards themselves
const cardFront = document.getElementById("card-front");
const cardBack = document.getElementById("card-back");

const form = document.getElementById("form");

console.log(document.querySelector(".form-element::after"));

//Card Inputs
const cardInputAndOutputs = {
  cardholderName: {
    input: document.getElementById("card-name-i"),
    display: document.getElementById("cardholder-name-display"),
    cardItsOn: cardFront,
    name: "Cardholder Name",
  },
  cardNumber: {
    input: document.getElementById("card-number-i"),
    display: document.getElementById("card-number"),
    cardItsOn: cardFront,
    name: "Card Number",
    extraFunctionKeyup(e) {
      if (e.key !== "Backspace") {
        this.input.value = formatCardNumber(this.input.value);
      }
    },
  },
  expiryDateMonth: {
    input: document.getElementById("expiry-date-month-i"),
    display: document.getElementById("expiry-date-month"),
    cardItsOn: cardFront,
    name: "Expiry Date Month",
  },
  expiryDateYear: {
    input: document.getElementById("expiry-date-year-i"),
    display: document.getElementById("expiry-date-year"),
    cardItsOn: cardFront,
    name: "Expiry Date Year",
  },
  cvc: {
    input: document.getElementById("cvc-i"),
    display: document.getElementById("cvc"),
    cardItsOn: cardBack,
    name: "CVC",
  },
};

//Create the "checkAllInputs" function
function checkAllInputs() {
  let allCorrect = true;
  Object.keys(cardInputAndOutputs).forEach((key) => {
    const formattingRules = inputFormattingRules[key];
    const { input, cardItsOn, name } = cardInputAndOutputs[key];
    const warningText = input.nextElementSibling;
    const message = checkInput(input, formattingRules.regex, name, cardItsOn);
    if (message) {
      allCorrect = false;
      warningText.textContent = message;
      warningText.classList.add("show-warning-text");
      return;
    }
    setTimeout(() => {
      warningText.textContent = message;
    }, 500);
    warningText.classList.remove("show-warning-text");
  });
  return allCorrect;
}

Object.keys(cardInputAndOutputs).forEach((key) => {
  const cardItem = cardInputAndOutputs[key];
  const { input, display } = cardItem;
  if (input.value) updateCardElement(display, input.value);
});

Object.keys(cardInputAndOutputs).forEach((key) => {
  const cardItem = cardInputAndOutputs[key];
  const { input, display } = cardItem;

  input.addEventListener("keyup", (e) => {
    updateCardElement(display, input.value);
    if (typeof cardItem.extraFunctionKeyup === "function")
      cardItem.extraFunctionKeyup(e);
  });
  input.addEventListener("blur", () => {
    updateCardElement(display, input.value);
    if (typeof cardItem.extraFunctionBlur === "function")
      cardItem.extraFunctionBlur(e);
  });
});

confirmBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (checkAllInputs()) {
    form.classList.add("loading");
    setTimeout(() => {
      form.classList.remove("loading");
      form.innerHTML = `
      <div class="flex flex-column end-screen">
        <img src="images/icon-complete.svg" alt="" />
        <div class="flex flex-column">
          <h1>THANK YOU!</h1>
          <p class="text-light">We've added your card details</p>
        </div>
        <button
          type="submit"
          class="font-main bg-darker text-white"
          style="grid-area: btn"
          id="continue-btn"
        >
          Continue
        </button>
      </div>
      `;
      document.getElementById("continue-btn").addEventListener("click", () => {
        location.reload();
      });
    }, 2000);
  }
});
