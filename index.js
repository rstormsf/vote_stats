const Web3 = require("web3");

const web3 = new Web3("https://core.poa.network");

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
      filter: { id: 56 },
      fromBlock: 0,
      toBlock: "latest",
    })
    .then(async (events) => {
      // console.log(events);
      let validators = getValidators("core");
      for (let event of events) {
        let validator =
          validators[event.returnValues.voterMiningKey] ||
          event.returnValues.voterMiningKey;
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
