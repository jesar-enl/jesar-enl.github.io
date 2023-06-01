let receiptCounter = 1; // Counter variable to track the receipt number

function addItem() {
  let particulars = document.getElementById('itemParticulars').value;
  let quantity = parseInt(document.getElementById('itemQuantity').value);
  let rate = parseInt(document.getElementById('itemRate').value);

  if (quantity && particulars && rate) {
    let itemRow = document.createElement('div');
    itemRow.classList.add('item');

    let quantitySpan = document.createElement('span');
    quantitySpan.classList.add('item-quantity');
    quantitySpan.textContent = quantity;
    itemRow.appendChild(quantitySpan);

    let particularsSpan = document.createElement('span');
    particularsSpan.classList.add('item-particulars');
    particularsSpan.textContent = particulars;
    itemRow.appendChild(particularsSpan);

    let rateSpan = document.createElement('span');
    rateSpan.classList.add('item-rate');
    rateSpan.textContent = rate;
    itemRow.appendChild(rateSpan);

    document.getElementById('itemList').appendChild(itemRow);

    document.getElementById('itemQuantity').value = '';
    document.getElementById('itemParticulars').value = '';
    document.getElementById('itemRate').value = '';
  } else {
    alert('Please fill in all item details.');
  }
}

function printReceipt() {
  let customerName = document.getElementById('customerName').value;
  let itemList = document.getElementById('itemList').innerHTML;
  let totalAmount = getTotalAmount();

  if (customerName && itemList && totalAmount) {
    let receiptContent = `
            <div class="receipt">
                <div class="company-info">
                <h2 class="company-name">KANE Welding Center</h2>
                <p class="company-details">P.O. Box 532, Masaka</p>
                <p class="company-details">Plot 43, Ddiba Street - Masaka Industrial Area</p>
                <p class="company-details">Tel: 0703900790/0772669378</p>
            </div>
            <div class="date">Date: <span id="cuurentDate">${getCurrentDate()}</span></div>
            <div class="receipt-number">Receipt #: <span id="receiptNumber">${generateReceiptNumber()}</span></div>
            <div class="customer-info"><p>Name: <span id="customerName">${customerName}</span></p></div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Qty</th>
                        <th>Particulars</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemList}
                </tbody>
            </table>
            <div class="total">
                <p>Total Amount: shs. <span id="totalAmount">${totalAmount}</span></p>
            </div>
            <div class="stamp-and-signature">
                <p>For: ................</p>
                <p>KANE Welding Center</p>
            </div>
        </div>
      `;

    // Add styles to the HTML page for printing
    let styles = `
        <style>
            .receipt {
                max-width: 500px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                font-family: Arial, sans-serif;
            }

            .receipt h2 {
                text-align: center;
                margin-top: 0;
            }

            .receipt .company-info {
                text-align: center;
                margin-bottom: 20px;
            }

            .receipt .company-info p {
                margin: 0;
            }

            .receipt .company-name {
                font-weight: bold;
                font-size: 20px;
            }

            .receipt .company-details {
                font-size: 14px;
            }

            .receipt .date {
                text-align: right;
                font-size: 14px;
            }

            .receipt .receipt-number {
                font-size: 14px;
            }

            .receipt .customer-info p {
                margin: 0;
            }

            .receipt .items-table {
                width: 100%;
                margin-bottom: 20px;
                border-collapse: collapse;
            }

            .receipt .items-table th {
                padding: 8px;
                background-color: #f5f5f5;
                border-bottom: 1px solid #ddd;
                text-align: center;
            }

            .receipt .items-table td {
                padding: 8px;
                border-bottom: 1px solid #ddd;
            }

            .receipt .total {
                text-align: right;
                font-weight: bold;
                margin-top: 20px;
            }

            .receipt .stamp-and-signature {
                text-align: center;
                margin-top: 20px;
            }

        </style>
      `;

    // Combine the styles and receipt HTML
    let content = styles + receiptContent;

    // Open a new window and write the content
    let printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();

    // Print the receipt
    printWindow.print();
  } else {
    alert('Please fill all required details.');
  }
}

// Get current date
function getCurrentDate() {
  let currentDate = new Date();
  let options = { year: 'numeric', month: 'long', day: 'numeric' };
  return currentDate.toLocaleDateString('en-US', options);
}

// Get the item list
function getItems() {
  let itemListHtml = '';
  let itemRows = document.getElementsByClassName('item');

  for (let i = 0; i < itemRows.length; i++) {
    let item = itemRows[i];
    let quantity = item.getElementsByClassName('item-quantity')[0].value;
    let particulars = item.getElementsByClassName('item-particulars')[0].value;
    let rate = item.getElementsByClassName('item-rate')[0].value;
    let amount = quantity * rate;

    itemListHtml += `
      <tr>
        <td>${quantity}</td>
        <td>${particulars}</td>
        <td>${rate}</td>
        <td>${amount}</td>
      </tr>
    `;
  }

  return itemListHtml;
}

// customer details
function getCustomerName() {
  let customerName = document.getElementById('customerName').value;
  return customerName;
}

// Calculate the total amount
function getTotalAmount() {
  let total = 0;
  let itemRows = document.getElementsByClassName('item');

  for (let i = 0; i < itemRows.length; i++) {
    let item = itemRows[i];
    let quantity = parseInt(
      item.getElementsByClassName('item-quantity')[0].value
    );
    let rate = parseInt(item.querySelector('.item-rate').value);
    let amount = quantity * rate;

    if (!isNaN(amount)) {
      total += amount;
    }
  }

  return total.toString();
}

let receiptNumber = 1;

function generateReceiptNumber() {
  let paddedNumber = receiptNumber.toString().padStart(3, '0');
  receiptNumber++;
  return paddedNumber;
}
