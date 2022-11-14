function updateCardElement(element, value) {
  element.textContent = value;
}

function animateCardDecline({ card, offset = 40 }) {
  const cardKeyframes = [
    {
      transform: `translateX(${offset}px)`,
    },
    {
      transform: `translateX(${offset - 15}px)`,
    },
    {
      transform: `translateX(${offset + 15}px)`,
    },
    {
      transform: `translateX(${offset}px)`,
    },
  ];

  const cardTiming = {
    duration: 500,
    easing: "ease-out",
  };
  card.animate(cardKeyframes, cardTiming);
}

function checkInput(
  input,
  regex,
  inputName,
  cardToBeAnimated,
  minimumLength = 1
) {
  // Since .transform returns a matrix, you can turn it
  //into an object by using WebKitCSSMatrix()
  const value = input.value;
  const matrix = new WebKitCSSMatrix(
    getComputedStyle(cardToBeAnimated).transform
  );
  const offset = Math.ceil(matrix.m41);
  const options = {
    card: cardToBeAnimated,
    offset,
  };
  let message = "";
  if (!value) {
    message = `Can't be blank.`;
  } else if (value.length < minimumLength) {
    message = `Should be ${minimumLength} characters.`;
  } else if (regex.test(value) === false) {
    message = `Invalid format`;
  } else {
    input.classList.remove("border-red-error");
    return message;
  }
  animateCardDecline(options);
  input.classList.add("border-red-error");
  return message;
}

function formatCardNumber(cardNumber) {
  let formattedCardNumber = cardNumber.replace(/ /g, "");
  const blockCount = Math.floor(formattedCardNumber.length / 4);
  for (let i = 0; i < blockCount; i++) {
    const spaceLoc = (i + 1) * 4 + i;
    formattedCardNumber = `${formattedCardNumber.slice(
      0,
      spaceLoc
    )} ${formattedCardNumber.slice(spaceLoc)}`;
  }
  return formattedCardNumber.trim();
}

const inputFormattingRules = {
  cardholderName: {
    regex: /^[\p{Letter}\p{Mark} ]+$/u,
    maxLength: 30,
    minLength: 5,
  },
  cardNumber: {
    regex: /^[0-9 ]{19}$/,
    maxLength: 18,
    minLength: 0,
  },
  expiryDateMonth: {
    regex: /^(0?[1-9]|1[0-2])$/,
  },
  expiryDateYear: {
    regex: /^((20)?[2-9][1-9])$/,
  },

  cvc: {
    regex: /^[1-9][0-9]{2}$/,
  },
};

const htmlElements = {
  form: `
  <form class="form">
        <div class="form-element text-darker" style="grid-area: name">
          <label for="card-name-i">Cardholder Name</label>
          <input
            type="text"
            name="card-name"
            id="card-name-i"
            placeholder="e.g. Jane Appleseed"
          />
          <p class="form-warning-text">Yessir</p>
        </div>
        <div class="form-element text-darker" style="grid-area: number">
          <label for="card-number">Card Number</label>
          <input
            type="text"
            id="card-number-i"
            name="card-number"
            class="card-number"
            maxlength="19"
            placeholder="e.g. 1234 5678 9123 0000"
          />
          <p class="form-warning-text">Yessir</p>
        </div>
        <div class="form-element text-darker" style="grid-area: expiry-date">
          <label for="expiration-date">exp. date (mm/yy)</label>
          <div
            id="expiry-date"
            class="flex flex-row flex-align-center margin"
            style="gap: 0.5em"
          >
            <div>
              <input
                type="number"
                name="month"
                id="expiry-date-month-i"
                placeholder="MM"
              />
              <p class="form-warning-text" style="right: 50%"></p>
            </div>

            <div>
              <input
                type="number"
                name="year"
                id="expiry-date-year-i"
                placeholder="YY"
              />
              <p class="form-warning-text" style="left: 55%">Yessir</p>
            </div>
          </div>
        </div>
        <div class="form-element text-darker" style="grid-area: cvc">
          <label for="cvc-i">CVC</label>
          <input
            type="number"
            id="cvc-i"
            name="CVC"
            maxlength="3"
            placeholder="e.g. 123"
          />
          <p class="form-warning-text">Yessir</p>
        </div>

        <button
          type="submit"
          class="font-main bg-darker text-white"
          style="grid-area: btn"
          id="confirm-btn"
        >
          Confirm
        </button>
      </form>
  `,
  confirmation: `
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
  `,
};

export {
  inputFormattingRules,
  formatCardNumber,
  checkInput,
  updateCardElement,
  htmlElements,
};
