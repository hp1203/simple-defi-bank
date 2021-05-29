import { Tabs, Tab, Navbar, Button, Nav, Badge, Container, Row, Col, Card, Image, ListGroup, Modal, Form } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component, useEffect, useState } from 'react';
import Token from '../abis/Token.json'
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

const App = () => {
  const [web3, setWeb3] = useState('undefined');
  const [account, setAccount] = useState('');
  const [token, setToken] = useState(null);
  const [dbank, setDbank] = useState(null);
  const [balance, setBalance] = useState(0);
  const [dBankAddress, setDBankAddress] = useState(null);
  const [depositModelShow, setDepositModelShow] = useState(false);
  const [withdrawModelShow, setWithdrawModelShow] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [totalETHDeposit, setTotalETHDeposit] = useState(0);
  const [yourETHDeposit, setYourETHDeposit] = useState(0);
  const [interest, setInterest] = useState(0);

  const ethEnabled = () => {  
    if (window.web3) {    
      window.web3 = new Web3(window.web3.currentProvider);    
      window.ethereum.enable();    
      return true;  
    }  
    return false;
  }

  const getETHBalance = async () => {
    const { contract, address } = this.state;
    const result = await contract.methods.getETHBalance(address).call();
    console.log(result);
    const balance = result;
    this.setState({ balance });
  }

  const loadBlockchainData = async () => {
    //check if MetaMask exists
    if (!ethEnabled()) {  alert("Please install MetaMask to use this dApp!");}
    const web3 = new Web3(window.web3.currentProvider);
    const netId = await web3.eth.net.getId();
    const accounts = await web3.eth.getAccounts();
    if(typeof accounts[0] !== 'undefined'){
      let balance = await web3.eth.getBalance(accounts[0]);
      balance = await web3.utils.fromWei(balance);

      setWeb3(web3);
      setBalance(balance);
      setAccount(accounts[0]);
    }else{
      window.alert('Please login with MetaMask');
    }

    try {
      const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address);
      const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address);
      const dbankAddress = dBank.networks[netId].address;
      setToken(token);
      setDbank(dbank);
      setDBankAddress(dbankAddress);


    } catch(e) {
      console.log("Error", e);
      window.alert("Contracts not deployed to the current network");
    }
  }

  useEffect(() => {

    const getBalance = async () => {
      // console.log(account)
      // console.log(await dbank.methods.balance(account).call())
      const yourEthDeposit = await dbank.methods.balance(account).call()
      setYourETHDeposit(await web3.utils.fromWei(yourEthDeposit))

      const totalEthDeposit = await dbank.methods.depositsBalance().call()
      setTotalETHDeposit(await web3.utils.fromWei(totalEthDeposit))

      const interest = await dbank.methods.estimatedInterest(account).call();
      console.log(interest);
      setInterest(await web3.utils.fromWei(interest));
      
      // setTimeout( async () => {
      //   console.log(account)
      //   console.log(await dbank.methods.estimatedInterest(account).send())
      // }, 10000)
    }
    if(dbank !== null){
      getBalance();
    }
  },[account, dbank]);

  const handleDepositModal = () => {
    setDepositModelShow(!depositModelShow)
  }
  const handleWithdrawModal = () => {
    setWithdrawModelShow(!withdrawModelShow)
  }
  const deposit = async (amount) => {
    if(dbank !== 'undefined'){
      try {
        // let a = await web3.utils.toWei(amount)
        let a = amount * 10**18 //convert to wei
        console.log(a)
        await dbank.methods.deposit().send({
          value: a.toString(),
          from: account
        })
      }catch (e) {
        console.log('Error Deposit: ', e)
      }
    }
    
  }

  const withdraw = async () => {
    window.alert("Withdrad")
    if(dbank !== 'undefined'){
      try {
        await dbank.methods.withdraw().send({
          from: account.toString()
        })
      }catch (e) {
        console.log('Error Withdraw: ', e)
      }
    }
    
  }


  useEffect(() => {

    loadBlockchainData()

  },[]);

  console.log(interest)
  return (
    <div className=''>
        <Navbar bg="primary" variant="dark" expand="lg">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="https://image.flaticon.com/icons/png/512/195/195488.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            DiFi Bank
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Navbar.Text>
            {
              web3 !== 'undefined' ?
              <Nav.Link>  <Badge variant="success" style={{width:10, height:10}}>{' '}</Badge>{' '}Metamask Connected</Nav.Link> : 
              <Nav.Link onClick={ethEnabled}>  <Badge variant="danger" style={{width:10, height:10}}>{' '}</Badge>{' '}Connect Metamask</Nav.Link> 
            }
          </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <div style={{ maxWidth:'900px', margin:'0 auto' }} >
              <div style={{ textAlign:"center",marginBottom:15, marginTop:20 }}>
                <Image src="https://image.flaticon.com/icons/png/512/195/195488.png" style={{ width: 100, marginBottom:10 }} />
                <h2 >Welcome to DeFi Bank</h2>
                <h4>Total {totalETHDeposit} ETH deposited.</h4>
              </div>
          <Container>
          <Row>
            <Col>
              <Card style={{ width: '100%', marginBottom:5 }}>
                <Card.Body>
                  <Row>
                    <Col style={{borderRight:'1px solid #ccc'}}>
                      <Card.Title>Address</Card.Title>
                      <Card.Text>{account}</Card.Text>
                      <Button onClick={handleDepositModal} style={{ marginRight: 10}}>Deposit</Button>
                      <Button onClick={handleWithdrawModal} variant="danger">Withdraw</Button>
                    </Col>
                    <Col>
                      <Card.Title>Your Deposit</Card.Title>
                      <Card.Text style={{}}>{yourETHDeposit} ETH</Card.Text>
                      <Card.Title>Your Estimated APY(10%)</Card.Title>
                      <Card.Text style={{}}>{interest} DFBC</Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
                
              </Card>
            </Col>
            {/* <Col >
              <Card style={{ width: '100%', marginBottom:5 }}>
                <Card.Body>
                  <Card.Title>Your Deposit</Card.Title>
                  <Card.Text style={{fontSize:24}}>{yourETHDeposit} ETH</Card.Text>
                </Card.Body>
              </Card>
            </Col> */}
          </Row>
          <Row>
              <Col>
              <Card style={{ marginBottom:5 }}>
                <Card.Body>
                  <Card.Title>Wallet Balance</Card.Title>
                  <ListGroup horizontal>
                    <ListGroup.Item style={{ textAlign:"center" }}>
                      <Image src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg" style={{ width: 40, marginBottom:10 }}/> 
                      <p style={{fontSize:18,}}>{balance} ETH</p>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
              {/* <Card style={{ width: '50rem', marginBottom:5 }}>
                <Card.Body>
                  <Card.Title>Address</Card.Title>
                  <span>{account}</span>
                </Card.Body>
              </Card> */}
            </Col>
          </Row>
          </Container>
        </div>
        

        <Modal show={depositModelShow} onHide={handleDepositModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Deposit</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    deposit(depositAmount)
                  }}>
                    <Form.Group >
                      <Form.Label>How much you want to deposit?</Form.Label>
                      <Form.Control type="number" placeholder="Enter amount" id="depositAmount" step="0.01" required value={depositAmount} onChange={event => setDepositAmount(event.target.value)}/>
                      <Form.Text className="text-muted">
                        (Min. amount is 0.01 ETH)
                      </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Deposit
                    </Button>
                  </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleDepositModal}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal show={withdrawModelShow} onHide={handleWithdrawModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Deposit</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    withdraw()
                  }}>
                  <Form.Group>
                    <Form.Label>Are you sure, you want to withdraw?</Form.Label>
                  </Form.Group>
                    <Button variant="primary" type="submit">
                      Withdraw
                    </Button>
                  </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleWithdrawModal}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                {/*add Tab deposit*/}
                {/*add Tab withdraw*/}
              </Tabs>
              </div>
            </main>
          </div>
      </div>
  );
}
// class App extends Component {

//   constructor(props) {
//     super(props)
//     this.state = {
//       web3: 'undefined',
//       account: '',
//       token: null,
//       dbank: null,
//       balance: 0,
//       dBankAddress: null,
//       depositModelShow: false
//     }
//     this.handleDepositModal = this.handleDepositModal.bind(this)
//   }

//   async componentWillMount() {
//     await this.loadBlockchainData(this.props.dispatch)
//   }

//   ethEnabled() {  
//     if (window.web3) {    
//       window.web3 = new Web3(window.web3.currentProvider);    
//       window.ethereum.enable();    
//       return true;  
//     }  
//     return false;
//   }

//   async loadBlockchainData(dispatch) {
//     //check if MetaMask exists
//     if (!this.ethEnabled()) {  alert("Please install MetaMask to use this dApp!");}
//     const web3 = new Web3(window.web3.currentProvider);
//     const netId = await web3.eth.net.getId();
//     const accounts = await web3.eth.getAccounts();
//     if(typeof accounts[0] !== 'undefined'){
//       let balance = await web3.eth.getBalance(accounts[0]);
//       balance = await web3.utils.fromWei(balance);
//       this.setState({ account: accounts[0], balance: balance, web3: web3});
//     }else{
//       window.alert('Please login with MetaMask');
//     }

//     try {
//       const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address);
//       const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address);
//       const dbankAddress = dBank.networks[netId].address;
//       this.setState({
//         token: token,
//         dbank: dbank,
//         dBankAddress: dbankAddress
//       });
//     } catch(e) {
//       console.log("Error", e);
//       window.alert("Contracts not deployed to the current network");
//     }
//   }

//   handleDepositModal() {
//     this.setState({ depositModelShow: !this.state.depositModelShow })
//   }

//   async deposit(amount) {
//     //check if this.state.dbank is ok
//       //in try block call dBank deposit();
//   }

//   async withdraw(e) {
//     //prevent button from default click
//     //check if this.state.dbank is ok
//     //in try block call dBank withdraw();
//   }


//   render() {
//     return (
//       <div className=''>
//         <Navbar bg="primary" variant="dark" expand="lg">
//           <Navbar.Brand href="#home">
//             <img
//               alt=""
//               src="https://image.flaticon.com/icons/png/512/195/195488.png"
//               width="30"
//               height="30"
//               className="d-inline-block align-top"
//             />{' '}
//             DiFi Bank
//           </Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
//           <Navbar.Text>
//             {
//               this.state.web3 !== 'undefined' ?
//               <Nav.Link href="#home">  <Badge variant="success" style={{width:10, height:10}}>{' '}</Badge>{' '}Metamask Connected</Nav.Link> : 
//               <Nav.Link href="#home">  <Badge variant="danger" style={{width:10, height:10}}>{' '}</Badge>{' '}Connect Metamask</Nav.Link> 
//             }
//           </Navbar.Text>
//           </Navbar.Collapse>
//         </Navbar>
//         <div style={{ padding:40 }} >
//           <Container>
//               <div style={{ textAlign:"center",marginBottom:15}}>
//                 <Image src="https://image.flaticon.com/icons/png/512/195/195488.png" style={{ width: 100, marginBottom:10 }} />
//                 <h2 >Welcome to DeFi Bank</h2>
//               </div>
//           <Row className="justify-content-md-center">
//             <Col md="auto">
//               <Card style={{ width: '50rem', marginBottom:5 }}>
//                 <Card.Body>
//                   <Card.Title>Address</Card.Title>
//                   <Card.Text>{this.state.account}</Card.Text>
//                   <Card.Link href="#">Upload</Card.Link>
//                   <Card.Link href="#">Withdraw</Card.Link>
//                 </Card.Body>

//               </Card>
//               <Card style={{ width: '50rem', marginBottom:5 }}>
//                 <Card.Body>
//                   <Card.Title>Wallet Balance</Card.Title>
//                   <ListGroup horizontal>
//                     <ListGroup.Item style={{ textAlign:"center" }}>
//                       <Image src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg" style={{ width: 40, marginBottom:10 }}/> 
//                       <p style={{fontSize:18,}}>{this.state.balance} ETH</p>
//                     </ListGroup.Item>
//                   </ListGroup>
//                 </Card.Body>
//               </Card>
//               <Card style={{ width: '50rem', marginBottom:5 }}>
//                 <Card.Body>
//                   <Card.Title>Address</Card.Title>
//                   <span>{this.state.account}</span>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//           </Container>
//         </div>
          
//         <Modal show={this.state.depositModelShow} onHide={() => this.handleDepositModal()}>
//           <Modal.Header closeButton>
//             <Modal.Title>Modal heading</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => this.handleDepositModal()}>
//               Close
//             </Button>
//             <Button variant="primary" onClick={() => this.handleDepositModal()}>
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Modal>
//           <br></br>
//           <div className="row">
//             <main role="main" className="col-lg-12 d-flex text-center">
//               <div className="content mr-auto ml-auto">
//               <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
//                 {/*add Tab deposit*/}
//                 {/*add Tab withdraw*/}
//               </Tabs>
//               </div>
//             </main>
//           </div>
//       </div>
//     );
//   }
// }

export default App;