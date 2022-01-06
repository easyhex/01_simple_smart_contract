const assert = require('assert');
const ganache = require('ganache-cli'); // local eth node
const { linkBytecode } = require('solc');
const Web3 = require('web3'); // this is a constructor, that is why its capitalized v 1.*.*

const web3 = new Web3(ganache.provider());

const { interface , bytecode} = require('../complile');

let accounts;
let inbox;
beforeEach(async ()=>{
    // web3.eth.getAccounts().then(fetchedAccounts => {
    //     console.log(fetchedAccounts);
    // }); // each function is async
    accounts = await web3.eth.getAccounts();

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments : ['Hi there!']})
        .send({from :accounts[0], gas : '1000000'});
});

describe('Inbox',()=>{
    it('deploys a contract', ()=>{
        assert.ok(inbox.options.address);
    });

    it('it has a default message',async ()=>{
        const message = await inbox.methods.message().call();
        assert.strictEqual(message,'Hi there!');
    });

    it('can change the message',async ()=>{
        // assert.ok(await inbox.methods.setMessage('hi').send({ from: accounts[0] }));
        await inbox.methods.setMessage('hi').send({ from: accounts[0] } );
        const message = await inbox.methods.message().call();
        assert.strictEqual(message,'hi');
    });
});