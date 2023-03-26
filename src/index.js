const main = document.querySelector('.main');
const overlay = document.querySelector('.overlay');
const inputBoard = document.querySelector('.input-board');
const formOverlay = document.querySelector('.form-overlay');
const btnSendOverlay = document.querySelector('.btn-send-overlay');

const navMenu = document.querySelector('.nav-menu');
const btnMenu = document.querySelector('.btn-menu');
const btnMenuCancel = document.querySelector('.btn-cancel');
const formChatbox = document.querySelector('.form-chatbox');

btnMenu.addEventListener('click', showMenu);
btnMenuCancel.addEventListener('click', hideMenu);

let data,
  username,
  present_id,
  numOfServerItems = 10;
//  DEALING WITH THE OVERLAY

formOverlay.addEventListener('submit', async (e) => {
  e.preventDefault();

  username = e.target.elements['form-overlay-input'].value;

  if (!username) return;

  loading(data, renderLoader);
  const dots = document.querySelector('.dots');

  overlay.classList.add('hide');
  inputBoard.classList.add('hide');

  data = await makeCallToAPI('', '', 'POST', username);

  removeLoader(dots);

  renderServerMessage(data);
  data = '';
});

formChatbox.addEventListener('submit', async (e) => {
  e.preventDefault();
  // 1.) run input validation on client input
  let clientMessage = e.target.elements['chatbox-input'].value;

  if (!clientMessage.trim()) return;

  renderMessage(clientMessage);

  loading(data, renderLoader);
  const dots = document.querySelector('.dots');
  const routes = ['99', '98', '97', '0'];

  if (
    Number(clientMessage) > 99 ||
    (clientMessage > numOfServerItems && clientMessage < 97) ||
    isNaN(clientMessage) ||
    (!present_id && clientMessage != 1 && !routes.includes(clientMessage))
  ) {
    setTimeout(async () => {
      removeLoader(dots);
      renderServerMessage({
        message: `Please make a request using bot instructions`,
      });
      renderServerMessage({
        message: `a. Select 1 to Place an order <br/> b. Select 99 to checkout order <br/> c. Select 98 to see order history <br/> d. Select 97 to see current order <br/> e. Select 0 to cancel order. <br/> <br/> or select items using their respective numbers.`,
      });
    }, 1500);
    e.target.elements['chatbox-input'].value = '';
    return;
  }

  e.target.elements['chatbox-input'].value = '';

  if (clientMessage) {
    if (present_id == 1 && clientMessage && !routes.includes(clientMessage)) {
      data = await makeCallToAPI(present_id, clientMessage);
    }

    if (!present_id && clientMessage == '1')
      data = await makeCallToAPI(clientMessage);

    if (routes.includes(clientMessage)) {
      data = await makeCallToAPI(clientMessage);
    }

    removeLoader(dots);

    renderServerMessage(data);

    if (clientMessage == '1') present_id = clientMessage;
  }
  data = '';
});

function showMenu() {
  navMenu.classList.remove('hide-menu');
  navMenu.classList.add('show-menu');
}

function hideMenu() {
  navMenu.classList.remove('show-menu');
  navMenu.classList.add('hide-menu');
}

// DEALING WITH CLIENT INPUTS
function renderMessage(message) {
  // 2.) create markup for client text
  const markup = `
        <div class="msg client-message">
          <p>${message}</p>
        </div>`;

  //  3.) render text to DOM
  main.insertAdjacentHTML('afterbegin', markup);
}

async function makeCallToAPI(id = '', endpoint = '', method = 'GET', username) {
  try {
    const options = {
      method,
      mode: 'cors',
      credentials: 'include',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin':
          '"https://my-chatbot-api.onrender.com"',
      },
    };

    const body = JSON.stringify({ username });

    method == 'POST' ? (options.body = body) : '';

    const res = await fetch(
      `https://my-chatbot-api.onrender.com/api/v1/chatbot${
        id ? '/' : ''
      }${id}${endpoint ? '/' : ''}${endpoint}`,
      options
    );

    return await res.json();
  } catch (error) {
    renderServerMessage({
      message: `The server is down at this time, please try again later`,
    });
  }
}

function renderLoader(markup) {
  main.insertAdjacentHTML('afterbegin', markup);
}

function removeLoader(element) {
  main.removeChild(element);
}

function renderServerMessage(data) {
  const messageHTML = displayData(data);
  const messages = ['Order cancelled😓.', 'Order Placed👍.'];
  if (messages.includes(data.message)) present_id = '';
  const markup = `
    <div class="msg server-message">
      <p>${data.message}</p>
      ${messageHTML ? '<br/>' : ''}
        ${messageHTML}
        <br/>
        ${
          messages.includes(data.message)
            ? `<br/> Select 1 to place new order`
            : ''
        }
    </div>
  `;
  main.insertAdjacentHTML('afterbegin', markup);
}

function displayData(data) {
  const dataObj = data.data;

  if (!dataObj) return '';

  // constructs order instructions from server
  if (dataObj.instructions) {
    const p = document.createElement('p');
    dataObj.instructions.forEach((el) => {
      p.insertAdjacentHTML(
        'beforeend',
        `<strong>${el.option}</strong>. ${el.instruction} <br/>`
      );
    });
    return p.innerHTML;
  }

  // constructs list of items from server
  if (dataObj.Items) {
    const p = document.createElement('p');
    dataObj.Items.forEach((el) => {
      p.insertAdjacentHTML(
        'beforeend',
        `<strong>${el.id}</strong>. ${el.item} <br/>`
      );
    });
    return p.innerHTML;
  }

  // constructs order history from server
  if (dataObj.orders) {
    const div = document.createElement('div');
    let count = 0;
    dataObj.orders.forEach((el) => {
      const markup = `
        <div class="orders"> 
        <strong>ORDER ${++count}:</strong>
          <div class="order-items"> <strong>Date -</strong> <p>${
            el.dateCreated
          }</p></div>
          <p> <strong>count -</strong> You Bought ${el.itemsCount} item(s)</p>
          <div class="order-items">
            <strong class="order-label">Items - </strong>
            <p> ${el.items.map((elem) => ` ${elem.item}`)}</p>
          </div>
          <p> <strong>Total Amount -</strong> $${el.amount}</p>
        </div>
        <br/>
      `;
      div.insertAdjacentHTML('beforeend', markup);
    });

    return div.innerHTML;
  }

  // select an item
  if (dataObj.order) {
    const div = document.createElement('div');
    let count = 0;

    const { itemsCount, items, amount } = dataObj.order;

    const markup = `
        <div> 
          <p>${itemsCount} item(s) selected</p>
          <span>Total Amount: $${amount}</span>
        </div>
      `;
    div.insertAdjacentHTML('beforeend', markup);

    return div.innerHTML;
  }

  // select an item
  if (dataObj.currentOrder) {
    const div = document.createElement('div');
    let count = 0;

    const { itemsCount, items, amount } = dataObj.currentOrder;

    const markup = `
        <div> 
          <p>${itemsCount} item(s) selected</p>
           <p>${items.map(
             (elem) =>
               `<strong>${++count}</strong>. ${elem.item} - $${
                 elem.amount
               }<br/>`
           )}</p>
          <span>Total Amount: $${amount}</span>
        </div>
        <br/>
      `;
    div.insertAdjacentHTML('beforeend', markup);

    return div.innerHTML;
  }
}

// STRICTLY CLIENT SIDE

const themeIcon = document.querySelector('.nav-theme-icon');

themeIcon.addEventListener('click', toggletheme);

function toggletheme() {
  themeIcon.children[1].textContent =
    themeIcon.children[1].textContent == 'Light mode'
      ? 'Dark mode'
      : 'Light mode';
  if (themeIcon.children[1].textContent == 'Dark mode') {
    themeIcon.children[0].classList.remove('fa-sun');
    themeIcon.children[0].classList.add('fa-moon');
    document.documentElement.classList.add('dark');
  } else {
    themeIcon.children[0].classList.remove('fa-moon');
    themeIcon.children[0].classList.add('fa-sun');
    document.documentElement.classList.remove('dark');
  }
}

function loading(data, func) {
  const markup = `
    <div class="dots">
        <span class="dot dot-1"></span>
        <span class="dot dot-2"></span>
        <span class="dot dot-3"></span>
    </div>
    `;
  if (!data) func(markup);
}
