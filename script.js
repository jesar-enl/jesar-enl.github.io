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
  let totalAmount = 0;
  const tableBody = document.getElementById('tableBody');
  const rows = tableBody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const amountCell = rows[i].cells[3];
    const amountText = amountCell.textContent.trim();

    if (amountText !== '') {
      const amount = parseFloat(amountText);
      totalAmount += amount;
    }
  }

  return totalAmount.toFixed(2);
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
function convertAmountToWords(amount) {
  const units = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const words = [];

  if (amount === 0) {
    return 'Zero';
  }

  if (amount >= 1000000) {
    words.push(`${convertAmountToWords(Math.floor(amount / 1000000))} Million`);
    amount %= 1000000;
  }

  if (amount >= 1000) {
    words.push(`${convertAmountToWords(Math.floor(amount / 1000))} Thousand`);
    amount %= 1000;
  }

  if (amount >= 100) {
    words.push(`${convertAmountToWords(Math.floor(amount / 100))} Hundred`);
    amount %= 100;
  }

  if (amount >= 20) {
    words.push(tens[Math.floor(amount / 10)]);
    amount %= 10;
  }

  if (amount >= 10) {
    words.push(teens[amount - 10]);
  } else if (amount > 0) {
    words.push(units[amount]);
  }

  return words.join(' ');
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
  const totalAmountWords = convertAmountToWords(
    parseFloat(calculateTotalAmount())
  );

  // Update receipt information
  document.getElementById('receiptNumber').innerText = receiptNumber;
  document.getElementById('receiptDate').innerText = receiptDate;
  document.getElementById('customerNamePrint').innerText = customerName;

  receiptNumber.innerText = generateReceiptNumber();
  receiptDate.innerText = getCurrentDate();
  customerNamePrint.innerText = getCustomerName();
  totalAmount.innerText = calculateTotalAmount();

  // Print the total amount in words on the receipt
  document.getElementById('wordAmount').textContent = totalAmountWords;

  // Temporarily show the receiptContainer for printing
  receiptContainer.style.display = 'block';
  
  let printContents = document.getElementById("receiptContainer").innerHTML;
  let originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  // Check if the print dialog is canceled
  let afterPrint = function() {
    document.body.innerHTML = originalContents;
    window.removeEventListener("afterprint", afterPrint);
  };

  // Add event listener for afterprint event
  window.addEventListener("afterprint", afterPrint);

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
