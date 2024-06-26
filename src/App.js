import { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import CalculatorContract from './cal.json'; // Ensure this file contains the correct ABI

function App() {
  const [sum1, setsum1] = useState('');
  const [sum2, setsum2] = useState('');
  const [result, setResult] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const contractAddress = '0x3c4C9a29cf3B78a0B5077d613557b03A718f52b4'; // Replace with your deployed contract address

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3("http://localhost:7545");
        const accounts = await web3.eth.getAccounts();
        console.log('Accounts:', accounts);

        const contractInstance = new web3.eth.Contract(CalculatorContract.abi, contractAddress);
        console.log('Contract Instance:', CalculatorContract.Abi);

        setWeb3(web3);
        setAccount(accounts[0]);
        setContract(contractInstance);
        console.log("Connected Successfully", web3.currentProvider);
      } catch (error) {
        console.error("Error initializing web3: ", error);
      }
    };
    init();
  }, []);

  const handleOperation = async (operation) => {
    try {
      if (!contract) {
        console.error("Contract is not initialized");
        return;
      }
      console.log(`Calling ${operation} method with params:`, sum1, sum2);
      const receipt = await contract.methods[operation](parseInt(sum1), parseInt(sum2)).send({ from: account });
      console.log("Transaction receipt:", receipt);
      const total = await contract.methods.total().call();
      setResult(total);
      console.log("Result:", total);
    } catch (error) {
      console.error(`Error executing ${operation} method: `, error);
    }
  };

  return (
    <div className="App">
      <h1>Calculator</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        A: <input type="number" className='sum1' value={sum1} onChange={(e) => setsum1(e.target.value)} /><br />
        B: <input type="number" className='sum1' value={sum2} onChange={(e) => setsum2(e.target.value)} /><br />
        <button onClick={() => handleOperation('add')}>Add</button>
        <button onClick={() => handleOperation('sub')}>Subtract</button>
        <button onClick={() => handleOperation('mul')}>Multiply</button>
        <button onClick={() => handleOperation('div')}>Divide</button>
      </form>
      {result !== null && <h2>Result: {result.toString()}</h2>}
    </div>
  );
}

export default App;
