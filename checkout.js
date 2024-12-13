document.addEventListener('DOMContentLoaded', () => {
  const cartItemsElement = document.getElementById('summary-items'); 
  const totalPriceElement = document.getElementById('total-price'); 
  let medicinePrices = {}; 
  const cart = JSON.parse(localStorage.getItem('cart')) || []; 
  
  fetch('./prices.json')
      .then(response => response.json())
      .then(data => {
          Object.keys(data).forEach(category => {
              const medicines = data[category];
              Object.keys(medicines).forEach(medicine => {
                  medicinePrices[medicine] = medicines[medicine];
              });
          });

          
          populateOrderSummary(cart, medicinePrices);
      })
      .catch(error => {
          console.error('Error loading price data:', error);
      });

  
  function populateOrderSummary(cart, prices) {
      let totalPrice = 0; 

      cart.forEach(item => {
          const pricePerUnit = prices[item.name] || 0; 
          const itemTotalPrice = pricePerUnit * item.quantity; 
          totalPrice += itemTotalPrice; 
          
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>RS.${pricePerUnit.toFixed(2)}</td>
              <td>RS.${itemTotalPrice.toFixed(2)}</td>
          `;
          cartItemsElement.appendChild(row);
      });

      
      totalPriceElement.textContent = `RS.${totalPrice.toFixed(2)}`;
  }
  document.getElementById('checkout').addEventListener('submit', (e) => {
      e.preventDefault(); 

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();
      const zip = document.getElementById('zip').value.trim();
      const cardNumber = document.getElementById('card-number').value.trim();
      const expiry = document.getElementById('expiry').value.trim();
      const cvv = document.getElementById('cvv').value.trim();

      
      if (!validateForm(name, email, phone, address, zip, cardNumber, expiry, cvv)) {
          return;
      }

      alert('Payment successful! Your order will be handed over in 4 days .');
      localStorage.removeItem('cart');
      window.location.href = './home.html'; 
  });

  function validateForm(name, email, phone, address, zip, cardNumber, expiry, cvv) {
      if (!name || !email || !phone || !address || !zip || !cardNumber || !expiry || !cvv) {
          alert('Please fill in all the fields.');
          return false;
      }
      
      const today = new Date();
      const [year, month] = expiry.split('-').map(num => parseInt(num, 10));
      if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth() + 1)) {
          alert('Card has expired.');
          return false;
      }

      return true; 
  }
});
