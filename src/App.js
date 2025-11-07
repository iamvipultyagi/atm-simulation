import React, { useState } from 'react';
import './App.css';

// Base Account class (OOP: Encapsulation)
class Account {
  constructor(accountNumber, pin, balance = 0.0) {
    this.accountNumber = accountNumber;
    this._pinHash = this._hashPin(pin); // Private-like attribute
    this.balance = balance;
    this.transactions = [];
  }

  _hashPin(pin) {
    // Simple hash simulation (not secure, for demo)
    return btoa(pin); // Base64 encode as simple hash
  }

  verifyPin(pin) {
    return this._pinHash === this._hashPin(pin);
  }

  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
      this.transactions.push(`${new Date().toLocaleString()}: Deposit $${amount.toFixed(2)}`);
      return true;
    }
    return false;
  }

  withdraw(amount) {
    if (0 < amount <= this.balance) {
      this.balance -= amount;
      this.transactions.push(`${new Date().toLocaleString()}: Withdrawal $${amount.toFixed(2)}`);
      return true;
    }
    return false;
  }

  getBalance() {
    return this.balance;
  }

  getMiniStatement() {
    return this.transactions.slice(-5);
  }
}

// SavingsAccount inherits from Account (OOP: Inheritance)
class SavingsAccount extends Account {
  constructor(accountNumber, pin, balance = 0.0, interestRate = 0.01) {
    super(accountNumber, pin, balance);
    this.interestRate = interestRate;
  }

  applyInterest() {
    const interest = this.balance * this.interestRate;
    this.balance += interest;
    this.transactions.push(`${new Date().toLocaleString()}: Interest added $${interest.toFixed(2)}`);
  }
}

// CheckingAccount inherits from Account (OOP: Inheritance and Polymorphism)
class CheckingAccount extends Account {
  constructor(accountNumber, pin, balance = 0.0, overdraftLimit = 100.0) {
    super(accountNumber, pin, balance);
    this.overdraftLimit = overdraftLimit;
  }

  withdraw(amount) { // Polymorphism: Overridden method
    if (0 < amount <= this.balance + this.overdraftLimit) {
      this.balance -= amount;
      this.transactions.push(`${new Date().toLocaleString()}: Withdrawal $${amount.toFixed(2)}`);
      return true;
    }
    return false;
  }
}

function App() {
  const [accounts, setAccounts] = useState({
    "123456": new SavingsAccount("123456", "1234", 1000.0),
    "654321": new CheckingAccount("654321", "5678", 500.0)
  });
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [view, setView] = useState('login'); // login, signup, menu, balance, withdraw, deposit, statement

  const handleSignup = () => {
    if (!accountNumber || !pin || !confirmPin) {
      setMessage('Please fill all fields.');
      return;
    }
    if (pin !== confirmPin) {
      setMessage('PINs do not match.');
      return;
    }
    if (accounts[accountNumber]) {
      setMessage('Account number already exists.');
      return;
    }
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setMessage('PIN must be 4 digits.');
      return;
    }

    const newAccount = accountType === 'savings' 
      ? new SavingsAccount(accountNumber, pin, 0.0)
      : new CheckingAccount(accountNumber, pin, 0.0);
    
    setAccounts(prev => ({...prev, [accountNumber]: newAccount}));
    setMessage('Account created successfully! Please login.');
    setView('login');
    setAccountNumber('');
    setPin('');
    setConfirmPin('');
  };

  const handleLogin = () => {
    const account = accounts[accountNumber];
    if (account && account.verifyPin(pin)) {
      setCurrentAccount(account);
      setIsLoggedIn(true);
      setView('menu');
      setMessage('Login successful.');
    } else {
      setMessage('Invalid credentials.');
    }
  };

  const handleLogout = () => {
    setCurrentAccount(null);
    setIsLoggedIn(false);
    setView('login');
    setAccountNumber('');
    setPin('');
    setConfirmPin('');
    setAmount('');
    setMessage('');
  };

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (currentAccount.withdraw(amt)) {
      setMessage(`Withdrawal of $${amt.toFixed(2)} successful.`);
    } else {
      setMessage('Insufficient funds.');
    }
    setAmount('');
    setView('menu');
  };

  const handleDeposit = () => {
    const amt = parseFloat(amount);
    if (currentAccount.deposit(amt)) {
      setMessage(`Deposit of $${amt.toFixed(2)} successful.`);
    } else {
      setMessage('Invalid amount.');
    }
    setAmount('');
    setView('menu');
  };

  return (
    <div className="app">
      <h1>ATM Simulation</h1>
      {message && <p className="message">{message}</p>}
      {!isLoggedIn ? (
        <div className="auth">
          {view === 'login' && (
            <div className="login">
              <h2>Login</h2>
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <input
                type="password"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
              <p>Don't have an account? <button className="link-btn" onClick={() => setView('signup')}>Sign Up</button></p>
            </div>
          )}
          {view === 'signup' && (
            <div className="signup">
              <h2>Create Account</h2>
              <input
                type="text"
                placeholder="Account Number (6 digits)"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <input
                type="password"
                placeholder="PIN (4 digits)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
              />
              <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="savings">Savings Account</option>
                <option value="checking">Checking Account</option>
              </select>
              <button onClick={handleSignup}>Create Account</button>
              <p>Already have an account? <button className="link-btn" onClick={() => setView('login')}>Login</button></p>
            </div>
          )}
        </div>
      ) : (
        <div className="atm">
          {view === 'menu' && (
            <div className="menu">
              <button onClick={() => setView('balance')}>Balance Inquiry</button>
              <button onClick={() => setView('withdraw')}>Withdraw</button>
              <button onClick={() => setView('deposit')}>Deposit</button>
              <button onClick={() => setView('statement')}>Mini-Statement</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
          {view === 'balance' && (
            <div className="balance">
              <h2>Balance: ${currentAccount.getBalance().toFixed(2)}</h2>
              <button onClick={() => setView('menu')}>Back</button>
            </div>
          )}
          {view === 'withdraw' && (
            <div className="withdraw">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button onClick={handleWithdraw}>Withdraw</button>
              <button onClick={() => setView('menu')}>Back</button>
            </div>
          )}
          {view === 'deposit' && (
            <div className="deposit">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button onClick={handleDeposit}>Deposit</button>
              <button onClick={() => setView('menu')}>Back</button>
            </div>
          )}
          {view === 'statement' && (
            <div className="statement">
              <h2>Mini-Statement</h2>
              <ul>
                {currentAccount.getMiniStatement().map((trans, index) => (
                  <li key={index}>{trans}</li>
                ))}
              </ul>
              <button onClick={() => setView('menu')}>Back</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;