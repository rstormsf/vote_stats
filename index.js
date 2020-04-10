require("dotenv").config();
const Web3 = require("web3");
const { NETWORK, VOTE_ID } = process.env;
const web3 = new Web3(`https://${NETWORK}.poa.network`);

const ABI = require("./abi.json");
const metaABI = require("./meta.json");
const contrAddr = "0xA4508af18F1005943678769dB3D95223C062258D";
const metaAddr = "0x0bc0EB3a1Ddc4ACC2515b72B7eB8A2F276EDa00F";
const contract = new web3.eth.Contract(ABI, contrAddr);
const { hexToString } = require("web3-utils");
const metaContract = new web3.eth.Contract(metaABI, metaAddr);

async function main() {
  contract
    .getPastEvents("Vote", {
      filter: { id: VOTE_ID },
      fromBlock: 0,
      toBlock: "latest",
    })
    .then(async (events) => {
      // console.log(events);
      for (let event of events) {
        const name = await metaContract.methods
          .validators(event.returnValues.voterMiningKey)
          .call();
        const decisions = {
          "1": "Yes",
          "2": "No",
        };
        let decision = decisions[event.returnValues.decision];
        console.log(
          "decision",
          decision,
          "Name",
          hexToString(name.firstName),
          hexToString(name.lastName)
        );
      }
    });
}

main();
