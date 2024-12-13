document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.menu-button');
    const sidebar = document.querySelector('.sidebar');

    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
});

let medicinePrices = {}; 
let cart = [];

// Load medicines from JSON
const loadMedicines = () => {
    fetch('./prices.json')
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(category => {
                const medicines = data[category];
                Object.keys(medicines).forEach(medicine => {
                    medicinePrices[medicine] = medicines[medicine];
                });
            });
        })
        .catch(error => console.error('Error loading medicine data:', error));
};

// Add medicine to the cart
const addToCart = (medicine, quantityInput) => {
    const quantity = parseInt(quantityInput.value); 
    if (!isNaN(quantity) && quantity > 0) {
        const existingItem = cart.find(item => item.name === medicine);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name: medicine, quantity });
        }
        quantityInput.value = existingItem ? existingItem.quantity : quantity; 
    } else {
        alert('Please enter a valid quantity.');
    }
    updateCartTable(); 
};

// Update cart table and total price
const updateCartTable = () => {
    const cartItems = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    cartItems.innerHTML = ''; 
    let totalPrice = 0; 

    cart.forEach(item => {
        const price = medicinePrices[item.name] * item.quantity;
        totalPrice += price; 
        cartItems.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>RS.${price.toFixed(2)}</td>
            </tr>
        `;
    });

    totalPriceElement.textContent = `Rs.${totalPrice.toFixed(2)}`; 
};

// ** New logic to check total price before saving favourites **
const saveFavourites = () => {
    const totalPrice = parseFloat(document.getElementById('totalPrice').textContent);
    if (totalPrice <= 0) {
        alert('Click on the items to add them to your favourites for easy access later!');
    } else {
        localStorage.setItem('favouriteOrder', JSON.stringify(cart));
        alert('Favourites saved successfully!');
    }
};

// Apply saved favourites to the cart
const applyFavourites = () => {
    const favouriteOrder = JSON.parse(localStorage.getItem('favouriteOrder'));
    if (favouriteOrder) {
        cart = favouriteOrder;
        updateCartTable();
        alert('Favourites applied successfully!');
    } else {
        alert('No favourite order saved.');
    }
};

// Handle "Buy Now" click
const handleBuyNow = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
};

// Attach event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadMedicines(); 

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const medicine = e.target.getAttribute('data-medicine');
            const quantityInput = e.target.previousElementSibling;
            addToCart(medicine, quantityInput);
        });
    });

    document.getElementById('saveFav').addEventListener('click', saveFavourites);
    document.getElementById('applyFav').addEventListener('click', applyFavourites);
    document.getElementById('buyNow').addEventListener('click', handleBuyNow);
});

