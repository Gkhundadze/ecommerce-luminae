
const flashSalesData = [
    {
        img: 'assets/img/flash-sales/tonny-black.png',
        title: 'Tonny Black',
        desc: 'Shoulder bag-White-Plain',
        dealOfDay: true,
        deadline: '2024-12-31T23:59:59',
        rating: {
            stars: 5,
            votes: 105
        },
        price: {
            current: 69.99,
            original: 129.99,
            discountPercent: 40
        }
    },
    {
        img: 'assets/img/flash-sales/reebok.png',
        title: 'Reebok',
        desc: 'Women’s Powder sneakers',
        dealOfDay: true,
        deadline: '2024-12-31T23:59:59',
        rating: {
            stars: 3,
            votes: 54
        },
        price: {
            current: 112.02,
            original: 129.99,
            discountPercent: 40
        }
    },
    {
        img: 'assets/img/flash-sales/patso.png',
        title: 'Patso',
        desc: 'Shoulder',
        dealOfDay: true,
        deadline: '2024-12-31T23:59:59',
        rating: {
            stars: 4,
            votes: 42
        },
        price: {
            current: 69.99,
            original: 129.99,
            discountPercent: 40
        }
    },
    {
        img: 'assets/img/flash-sales/sketchers.png',
        title: 'Sketchers',
        desc: 'Sport-shoe 2102',
        dealOfDay: true,
        deadline: '2024-12-31T23:59:59',
        rating: {
            stars: 2,
            votes: 33
        },
        price: {
            current: 80,
            original: 129.99,
            discountPercent: 40
        }
    },
]

const flashSalesWrapper = document.querySelector('.products-wrapper');


flashSalesData.forEach(product => {
    const productCard = document.createElement('article');
    productCard.classList.add('product-card');

    const countdownWrapper = document.createElement('div');
    countdownWrapper.classList.add('countdown-wrapper');

    const dealOfDaySpan = document.createElement('span');
    
    dealOfDaySpan.textContent = 'Deal of the Day';

    const timeFlex = document.createElement('div');
    timeFlex.classList.add('flex');
    timeFlex.classList.add('align-center');
    timeFlex.classList.add('justify-center');
    const hoursDiv = document.createElement('div');
    hoursDiv.classList.add('hours');
    hoursDiv.textContent = '12';

    const timeDivider = document.createElement('span');
    timeDivider.textContent = ':';
    const minutesDiv = document.createElement('div');
    minutesDiv.classList.add('minutes');
    minutesDiv.textContent = '34';

    const timeDivider2 = document.createElement('span');
    timeDivider2.textContent = ':';

    const secondsDiv = document.createElement('div');
    secondsDiv.classList.add('seconds');
    secondsDiv.textContent = '52';


    timeFlex.append(hoursDiv, timeDivider, minutesDiv, timeDivider2, secondsDiv);


    const timeFlex2 = document.createElement('div');
    timeFlex2.classList.add('flex');
    timeFlex2.classList.add('align-center');
    timeFlex2.classList.add('justify-center');

    const hourLabel = document.createElement('span');
    hourLabel.classList.add('hour-label');
    hourLabel.textContent = 'hour';
    const minLabel = document.createElement('span');
    minLabel.classList.add('min-label');
    minLabel.textContent = 'min';
    const secLabel = document.createElement('span');
    secLabel.classList.add('sec-label');
    secLabel.textContent = 'sec';

    timeFlex2.append(hourLabel, minLabel, secLabel);

    countdownWrapper.append(dealOfDaySpan, timeFlex, timeFlex2);


    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');
    const productImg = document.createElement('img');
    productImg.src = product.img;
    productImg.alt = product.title.toLowerCase();
    imageWrapper.append(productImg);

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');
    const productTitle = document.createElement('h3');
    productTitle.textContent = product.title;
    const productDesc = document.createElement('p');
    productDesc.textContent = product.desc;


    const ratingDiv = document.createElement('div');
    ratingDiv.classList.add('rating');
    ratingDiv.classList.add('flex');
    ratingDiv.classList.add('align-center');

    const starsDiv = document.createElement('div');
    starsDiv.classList.add('stars', 'flex', 'align-center');

    for (let i = 0; i < product.rating.stars; i++) {
        const starImg = document.createElement('img');
        starImg.src = 'assets/img/icons/star.svg';
        starImg.alt = 'star icon';
        starsDiv.append(starImg);
    }
    const reviewsDiv = document.createElement('div');
    reviewsDiv.classList.add('reviews');
    reviewsDiv.textContent = `(${product.rating.votes})`;

    ratingDiv.append(starsDiv, reviewsDiv);

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('price', 'flex', 'align-center');
    const currentPriceDiv = document.createElement('div');
    currentPriceDiv.classList.add('current');
    currentPriceDiv.textContent = `$${product.price.current.toFixed(2)}`;
    const oldPriceDiv = document.createElement('div');
    oldPriceDiv.classList.add('old');
    oldPriceDiv.textContent = `$${product.price.original.toFixed(2)}`;
    const discountDiv = document.createElement('div');
    discountDiv.classList.add('discount');
    discountDiv.textContent = `- ${product.price.discountPercent}%`;
    priceDiv.append(currentPriceDiv, oldPriceDiv, discountDiv);

    contentWrapper.append(productTitle, productDesc, ratingDiv, priceDiv);



    productCard.append(countdownWrapper, imageWrapper, contentWrapper);
    console.log(productCard);
    flashSalesWrapper.append(productCard);
});




fetch('https://dummyjson.com/products/1')
.then(res => res.json())
.then(data => console.log(data));

