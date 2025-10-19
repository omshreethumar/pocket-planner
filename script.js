// Data
let transactions = [];
let savingsJars = [
  {name:"Emergency Jar", percent:0},
  {name:"Vacation Jar", percent:0},
  {name:"Goal Jar", percent:0}
];
let balance=0, income=0, expense=0;

// DOM Elements
const balanceEl=document.getElementById('balance');
const incomeEl=document.getElementById('income');
const expenseEl=document.getElementById('expense');
const safeEl=document.getElementById('safe');
const transactionForm=document.getElementById('transaction-form');
const transactionList=document.getElementById('transaction-list');
const tipsList=document.getElementById('tips-list');
const savingsContainer=document.getElementById('savings-container');
const searchInput=document.getElementById('search');
const darkToggle=document.getElementById('darkModeToggle');
const body=document.body;

// Dark Mode
darkToggle.addEventListener('click',()=>{body.classList.toggle('dark');body.classList.toggle('light');});

// Chart.js
const ctx = document.getElementById('cashflowChart').getContext('2d');
const cashflowChart = new Chart(ctx,{
  type:'line',
  data:{ labels:['Week1','Week2','Week3','Week4'], datasets:[{label:'Cash Flow',data:[0,0,0,0],borderColor:'#00c896',backgroundColor:'rgba(0,200,150,0.2)',fill:true,tension:0.3}]},
  options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
});
const expCtx = document.getElementById('expenseChart').getContext('2d');
const expenseChart = new Chart(expCtx,{
  type:'doughnut',
  data:{ labels:['Income','Expense'], datasets:[{data:[0,0],backgroundColor:['#00c896','#FF6B6B']}]},
  options:{responsive:true,plugins:{legend:{position:'bottom'}}}
});

// Functions
function renderSavings(){
  savingsContainer.innerHTML='';
  savingsJars.forEach(j=>{
    const jarDiv=document.createElement('div');
    jarDiv.className='jar';
    jarDiv.innerHTML=`<span>${j.name}</span>
    <div class="progress-bar"><div style="width:${j.percent}%"></div></div>`;
    savingsContainer.appendChild(jarDiv);
  });
}

function renderTransactions(filter=''){
  transactionList.innerHTML='';
  transactions.filter(t=>t.desc.toLowerCase().includes(filter.toLowerCase())).forEach(t=>{
    const tItem=document.createElement('div');
    tItem.className='t-item';
    tItem.innerHTML=`<span>${t.desc} [${t.category}]</span><span>${t.type==='income'?'+':'-'} ₹${t.amount}</span>`;
    transactionList.appendChild(tItem);
  });
}

function updateDashboard(){
  balance=income-expense;
  balanceEl.textContent=`₹${balance}`;
  incomeEl.textContent=`₹${income}`;
  expenseEl.textContent=`₹${expense}`;
  safeEl.textContent=`₹${Math.floor(balance/3)}`;

  // Update charts
  let data=[0,0,0,0];
  transactions.slice(-4).forEach((t,i)=>{data[i]=t.type==='income'?t.amount:-t.amount;});
  cashflowChart.data.datasets[0].data=data; cashflowChart.update();
  expenseChart.data.datasets[0].data=[income,expense]; expenseChart.update();

  // Savings jars animation
  savingsJars[0].percent=Math.min(100,Math.floor(balance/1000)*5);
  savingsJars[1].percent=Math.min(100,Math.floor(balance/2000)*5);
  savingsJars[2].percent=Math.min(100,Math.floor(balance/1500)*5);
  renderSavings();

  // AI Tips
  tipsList.innerHTML='';
  if(balance>0) tipsList.innerHTML+=`<li>✅ Move ₹${Math.floor(balance/4)} to Emergency Jar.</li>`;
  if(expense>5000) tipsList.innerHTML+=`<li>⚠️ Try to reduce expenses this week.</li>`;
  if(transactions.length>5) tipsList.innerHTML+=`<li>💡 You have ${transactions.length} transactions this month, review for savings.</li>`;
}

// Add Transaction
transactionForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const desc=document.getElementById('desc').value;
  const amount=parseInt(document.getElementById('amount').value);
  const type=document.getElementById('type').value;
  const category=document.getElementById('category').value;
  transactions.push({desc,amount,type,category});
  if(type==='income') income+=amount; else expense+=amount;
  renderTransactions();
  updateDashboard();
  transactionForm.reset();
});

// Search Filter
searchInput.addEventListener('input',(e)=>{renderTransactions(e.target.value);});

// Initial Render
renderSavings();
updateDashboard();
