const cartCounter = document.querySelector('.counter');

function updateIndexCartCounter() {
  if (!cartCounter) return;

  fetch('https://dummyjson.com/carts')
    .then(res => res.json())
    .then(res => {
      const products = res.carts[10].products;
      cartCounter.textContent = products.length; // ✅ DISTINCT ITEMS
    })
    .catch(() => {
      cartCounter.textContent = 0;
    });
}
// -------------------------
// Shared helpers
// -------------------------

function isCurrentPage(...filenames) {
    const path = document.location.pathname;

    // Support ".../" (root), ".../index.html", etc.
    if (filenames.includes('/') && (path === '/' || path.endsWith('/'))) return true;

    return filenames.some((name) => path.endsWith(name));
}

function el(tag, classNames = [], text = '') {
    const node = document.createElement(tag);
    if (classNames.length) node.classList.add(...classNames);
    if (text) node.textContent = text;
    return node;
}

// -------------------------
// Index page (Flash Sales)
// -------------------------

function createCountdownBlock() {
    // NOTE: You currently use static values (12:34:52). Keeping the same output.
    const countdownWrapper = el('div', ['countdown-wrapper']);

    const dealOfDaySpan = el('span', [], 'Deal of the Day');

    const timeFlex = el('div', ['flex', 'align-center', 'justify-center']);
    const hoursDiv = el('div', ['hours'], '12');
    const timeDivider = el('span', [], ':');
    const minutesDiv = el('div', ['minutes'], '34');
    const timeDivider2 = el('span', [], ':');
    const secondsDiv = el('div', ['seconds'], '52');

    timeFlex.append(hoursDiv, timeDivider, minutesDiv, timeDivider2, secondsDiv);

    const timeFlex2 = el('div', ['flex', 'align-center', 'justify-center']);
    const hourLabel = el('span', ['hour-label'], 'hour');
    const minLabel = el('span', ['min-label'], 'min');
    const secLabel = el('span', ['sec-label'], 'sec');

    timeFlex2.append(hourLabel, minLabel, secLabel);

    countdownWrapper.append(dealOfDaySpan, timeFlex, timeFlex2);
    return countdownWrapper;
}

function createRatingBlock(rating) {
    const ratingDiv = el('div', ['rating', 'flex', 'align-center']);
    const starsDiv = el('div', ['stars', 'flex', 'align-center']);

    for (let i = 0; i < rating.stars; i++) {
        const starImg = document.createElement('img');
        starImg.src = 'assets/img/icons/star.svg';
        starImg.alt = 'star icon';
        starsDiv.append(starImg);
    }

    const reviewsDiv = el('div', ['reviews'], `(${rating.votes})`);
    ratingDiv.append(starsDiv, reviewsDiv);
    return ratingDiv;
}

function createPriceBlock(price) {
    const priceDiv = el('div', ['price', 'flex', 'align-center']);

    const currentPriceDiv = el('div', ['current'], `$${price.current.toFixed(2)}`);
    const oldPriceDiv = el('div', ['old'], `$${price.original.toFixed(2)}`);
    const discountDiv = el('div', ['discount'], `- ${price.discountPercent}%`);

    priceDiv.append(currentPriceDiv, oldPriceDiv, discountDiv);
    return priceDiv;
}

function createProductCard(product) {
    const productCard = el('article', ['product-card']);

    const countdownWrapper = createCountdownBlock();

    const imageWrapper = el('div', ['image-wrapper']);
    const productImg = document.createElement('img');
    productImg.src = product.img;
    productImg.alt = product.title.toLowerCase();
    imageWrapper.append(productImg);

    const contentWrapper = el('div', ['content-wrapper']);
    const productTitle = el('h3', [], product.title);
    const productDesc = el('p', [], product.desc);

    const ratingDiv = createRatingBlock(product.rating);
    const priceDiv = createPriceBlock(product.price);

    contentWrapper.append(productTitle, productDesc, ratingDiv, priceDiv);
    productCard.append(countdownWrapper, imageWrapper, contentWrapper);

    return productCard;
}

function renderFlashSales() {
    const flashSalesWrapper = document.querySelector('.products-wrapper');
    if (!flashSalesWrapper || !Array.isArray(flashSalesData)) return;

    const fragment = document.createDocumentFragment();
    flashSalesData.forEach((product) => fragment.append(createProductCard(product)));
    flashSalesWrapper.append(fragment);
}

// -------------------------
// Cart page
// -------------------------

// IMPORTANT: cart actions live on this page and must be in outer scope.
let cartItems = [];

function formatMoney(amount) {
    // Matches your existing output style: "$ 12.34"
    return `$ ${Number(amount).toFixed(2)}`;
}

function safeInt(value, fallback = 1) {
    const n = Number.parseInt(String(value), 10);
    if (Number.isNaN(n) || n < 1) return fallback;
    return n;
}

function getCartItem(id) {
    return cartItems.find((p) => p.id === id);
}

// Counter in your header is expected to represent "items in cart" as
// the number of distinct products (not the sum of quantities).
// Example: 5 different products with quantities totaling 14 => counter shows 5.
function calcCartItemsCount() {
    return cartItems.length;
}

function calcCartTotal() {
    return cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);
}

function updateSummaryUI() {
    const cartCounter = document.querySelector('.counter');
    const totalSumEl = document.querySelector('#total-sum');

    if (cartCounter) cartCounter.textContent = String(calcCartItemsCount());
    if (totalSumEl) totalSumEl.textContent = formatMoney(calcCartTotal());
}

function updateRowUI(id) {
    const item = getCartItem(id);
    if (!item) return;

    const qtyInput = document.getElementById(`qty-${id}`);
    if (qtyInput) qtyInput.value = String(item.quantity);

    const row = document.getElementById(String(id));
    if (!row) return;

    const totalEl = row.querySelector('.total');
    if (totalEl) totalEl.textContent = formatMoney(item.price * item.quantity);
}

function setQuantity(id, nextQty) {
    const item = getCartItem(id);
    if (!item) return;

    item.quantity = safeInt(nextQty, item.quantity || 1);
    updateRowUI(id);
    updateSummaryUI();
}

function removeItem(id) {
    cartItems = cartItems.filter((p) => p.id !== id);
    const row = document.getElementById(String(id));
    if (row) row.remove();
    updateSummaryUI();
}

function createCartRow(product) {
    const li = el('li', ['flex']);
    li.id = String(product.id);

    const left = el('div', ['left', 'flex', 'align-center']);
    const leftInner = el('div', ['flex', 'align-center']);
    const img = document.createElement('img');
    img.src = product.thumbnail;
    img.alt = product.title;
    const title = el('h2', ['title'], product.title);
    leftInner.append(img, title);

    const price = el('span', ['price'], `$ ${product.price}`);
    left.append(leftInner, price);

    const right = el('div', ['right', 'flex', 'align-center']);

    const qtyWrap = el('div', ['quantity']);
    const decBtn = document.createElement('button');
    decBtn.type = 'button';
    decBtn.textContent = '-';
    decBtn.dataset.action = 'dec';
    decBtn.dataset.id = String(product.id);

    const qtyInput = document.createElement('input');
    qtyInput.id = `qty-${product.id}`;
    qtyInput.type = 'text';
    qtyInput.inputMode = 'numeric';
    qtyInput.value = String(product.quantity);
    qtyInput.dataset.role = 'qty';
    qtyInput.dataset.id = String(product.id);

    const incBtn = document.createElement('button');
    incBtn.type = 'button';
    incBtn.textContent = '+';
    incBtn.dataset.action = 'inc';
    incBtn.dataset.id = String(product.id);

    qtyWrap.append(decBtn, qtyInput, incBtn);

    const total = el('div', ['total'], formatMoney(product.price * product.quantity));

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add('remove');
    removeBtn.dataset.action = 'remove';
    removeBtn.dataset.id = String(product.id);

    const trashImg = document.createElement('img');
    trashImg.src = '../img/icons/trash.svg';
    trashImg.alt = 'trash icon';
    removeBtn.append(trashImg);

    right.append(qtyWrap, total, removeBtn);
    li.append(left, right);
    return li;
}

function wireCartEvents(listEl) {
    // Buttons: +/-/remove
    listEl.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.dataset.action;
        const id = safeInt(btn.dataset.id, NaN);
        if (!action || Number.isNaN(id)) return;

        const item = getCartItem(id);
        if (!item) return;

        if (action === 'inc') setQuantity(id, item.quantity + 1);
        if (action === 'dec') setQuantity(id, Math.max(1, item.quantity - 1));
        if (action === 'remove') removeItem(id);
    });

    // Manual qty edit
    listEl.addEventListener('change', (e) => {
        const input = e.target;
        if (!(input instanceof HTMLInputElement)) return;
        if (input.dataset.role !== 'qty') return;
        const id = safeInt(input.dataset.id, NaN);
        if (Number.isNaN(id)) return;
        setQuantity(id, input.value);
    });
}

async function loadCart() {
    const cartItemsList = document.querySelector('.cart-items-list');
    if (!cartItemsList) return;

    try {
        const res = await fetch('https://dummyjson.com/carts');
        const data = await res.json();

        const cart = data?.carts?.[10];
        if (!cart) return;

        cartItems = (cart.products || []).map((p) => ({
            ...p,
            quantity: safeInt(p.quantity, 1),
        }));

        cartItemsList.innerHTML = '';
        const frag = document.createDocumentFragment();
        cartItems.forEach((p) => frag.append(createCartRow(p)));
        cartItemsList.append(frag);

        wireCartEvents(cartItemsList);
        updateSummaryUI();
    } catch (_err) {
        // No UI error state yet
    }
}

// -------------------------
// Boot
// -------------------------

if (isCurrentPage('index.html', '/')) {
    renderFlashSales();
    updateIndexCartCounter()
}

if (isCurrentPage('cart.html')) {
    loadCart();
}
