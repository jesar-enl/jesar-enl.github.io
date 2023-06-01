// Global variable to keep track of the receipt number
let receiptCount = 1;

// Function to generate a sequential receipt number
function generateReceiptNumber() {
  let receiptNumber = localStorage.getItem('receiptNumber');
  if (!receiptNumber) {
    receiptNumber = '001';
  } else {
    receiptNumber = String(parseInt(receiptNumber) + 1).padStart(3, '0');
  }
  localStorage.setItem('receiptNumber', receiptNumber);
  return receiptNumber;
}

// Function to retrieve the customer name from the form
function getCustomerName() {
  return document.getElementById('customerName').value;
}

// Get the current date in the format: DD/MM/YYYY
function getCurrentDate() {
  let today = new Date();
  let day = today.getDate().toString().padStart(2, '0');
  let month = today.toLocaleString('default', { month: 'short' });
  let year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

// Render the items in the table
function renderItems() {
  let items = getItems();
  let tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  items.forEach(function (item) {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.rate}</td>
      <td>${item.amount}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to calculate the total amount for the receipt
function calculateTotalAmount() {
  let total = 0;
  const itemRows = document.querySelectorAll('.item-row');
  itemRows.forEach(function (itemRow) {
    const quantity = parseInt(itemRow.querySelector('.item-quantity').value);
    const rate = parseInt(itemRow.querySelector('.item-rate').innerText);
    const amount = quantity * rate;
    itemRow.querySelector('.item-amount').innerText = amount;
    total += amount;
  });
  return total;
}

// Function to get the items from the form
function getItems() {
  const customerName = document.getElementById('customerName').value;
  const itemName = document.getElementById('itemName').value;
  const itemQuantity = parseInt(document.getElementById('itemQuantity').value);
  const itemRate = parseFloat(document.getElementById('itemRate').value);

  const item = {
    name: itemName,
    quantity: itemQuantity,
    rate: itemRate,
  };

  return {
    customerName,
    items: [item],
  };
}

// Function to add the items to the receipt table
function addItemsToReceipt() {
  const tableBody = document.getElementById('tableBody');
  const { customerName, items } = getItems();

  items.forEach(function (item) {
    const row = document.createElement('tr');

    const quantityCell = document.createElement('td');
    quantityCell.innerText = item.quantity;

    const particularsCell = document.createElement('td');
    particularsCell.innerText = item.name;

    const rateCell = document.createElement('td');
    rateCell.innerText = item.rate.toFixed(2);

    const amountCell = document.createElement('td');
    const amount = (item.quantity * item.rate).toFixed(2);
    amountCell.innerText = amount;

    row.appendChild(quantityCell);
    row.appendChild(particularsCell);
    row.appendChild(rateCell);
    row.appendChild(amountCell);

    tableBody.appendChild(row);
  });

  // Update the customer name
  const customerNameElement = document.getElementById('customerNamePrint');
  customerNameElement.innerText = customerName;
}

// function to write the total amount in words
function numberToWords(number) {
  const units = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
  const scales = [
    '',
    'thousand',
    'million',
    'billion',
    'trillion',
    'quadrillion',
  ];

  if (number === 0) {
    return 'zero';
  }

  // Split the number into groups of three digits
  const chunks = [];
  while (number > 0) {
    chunks.push(number % 1000);
    number = Math.floor(number / 1000);
  }

  // Convert each group of three digits to words
  const result = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (chunk === 0) {
      continue; // Skip empty chunks
    }
    const chunkWords = [];

    // Convert the hundreds place
    const hundred = Math.floor(chunk / 100);
    if (hundred > 0) {
      chunkWords.push(units[hundred] + ' hundred');
    }

    // Convert the tens and units places
    const remainder = chunk % 100;
    if (remainder > 0) {
      if (remainder < 20) {
        chunkWords.push(units[remainder]);
      } else {
        const ten = Math.floor(remainder / 10);
        const unit = remainder % 10;
        chunkWords.push(tens[ten] + (unit > 0 ? '-' + units[unit] : ''));
      }
    }

    // Add the scale word if necessary
    const scale = scales[i];
    if (scale && chunkWords.length > 0) {
      chunkWords.push(scale);
    }

    result.unshift(chunkWords.join(' '));
  }

  return result.join(' ');
}

// Print the receipt
function printReceipt() {
  const receiptContainer = document.getElementById('receiptContainer');
  receiptContainer.style.display = 'block';

  const receiptNumber = document.getElementById('receiptNumber');
  const receiptDate = document.getElementById('receiptDate');
  const customerNamePrint = document.getElementById('customerNamePrint');
  const totalAmount = document.getElementById('totalAmount');

  // Get the total amount in words
  let totalAmountInWords = document.getElementById('wordAmount');

  // Update receipt information
  document.getElementById('receiptNumber').innerText = receiptNumber;
  document.getElementById('receiptDate').innerText = receiptDate;
  document.getElementById('customerNamePrint').innerText = customerName;

  receiptNumber.innerText = generateReceiptNumber();
  receiptDate.innerText = getCurrentDate();
  customerNamePrint.innerText = getCustomerName();
  totalAmount.innerText = calculateTotalAmount();
  // Print the total amount in words on the receipt
  totalAmountInWords.innerText = numberToWords(totalAmount);

  // Temporarily show the receiptContainer for printing
  receiptContainer.style.display = 'block';

  // Print only the receiptContainer
  window.print();
}

// Clear the form fields
function clearForm() {
  document.getElementById('customerName').value = '';
  document.getElementById('itemName').value = '';
  document.getElementById('itemQuantity').value = '';
  document.getElementById('itemRate').value = '';
  document.getElementById('itemAmount').value = '';
}

// Reset the receipt section
function resetReceipt() {
  // Clear the form fields
  clearForm();

  // Clear the table
  let tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  // Reset receipt details
  document.getElementById('receiptNumber').innerText = '';
  document.getElementById('receiptDate').innerText = '';
  document.getElementById('customerNamePrint').innerText = '';

  // Reset the total amount
  document.getElementById('totalAmount').innerText = '';

  // Hide the receipt section
  document.getElementById('receiptSection').style.display = 'none';
}

// Add event listener for the "Print Receipt" button
document
  .getElementById('printReceiptBtn')
  .addEventListener('click', function (event) {
    event.preventDefault();
    printReceipt();
  });

// Add event listener for the "Clear" button
document.getElementById('clearBtn').addEventListener('click', function (event) {
  event.preventDefault();
  clearForm();
});

// Add event listener for the "Reset" button
document.getElementById('resetBtn').addEventListener('click', function (event) {
  event.preventDefault();
  resetReceipt();
});
