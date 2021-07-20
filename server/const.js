const LOWB_TOKEN_ADDRESS_MAIN = "0x843d4a358471547f51534e3e51fae91cb4dc3f28";
const LOWB_TOKEN_ADDRESS_TEST = "0x5aa1a18432aa60bad7f3057d71d3774f56cd34b8";

const CHESS_CONTRACT_ADDRESS_MAIN = "0";
const CHESS_CONTRACT_ADDRESS_TEST = "0xc635689FD64751598Fd39464c633a9A42e05a13d";

const HELPER_CONTRACT_ADDRESS_MAIN = "0x325d6FEA5F24A8E82438d3B6b6Dd577ff51Eb607";
const HELPER_CONTRACT_ADDRESS_TEST = "0xbA59A603173E5566f182e7d505971A95d9Cf0a92";

const LOWC_TOKEN_ADDRESS_MAIN = "0xe0b78dc64d4385b208016050ecfed986a5e0de0e";
const LOWC_TOKEN_ADDRESS_TEST = "0xe031188b0895afd3f3c32b2bf27fbd1ab9e8c9ea";

const ADMIN_ADDRESS_MAIN = "0x953b71563bB68A1297801C873297cb4a0cB17960";
const ADMIN_ADDRESS_TEST = "0x8BFeeC872061CD2FC05110b1d37764eD216eef69";

const LOWC_CONTRACT_ADDRESS_MAIN = "0x1D23fd056a70634D8eD944377C7625f4773FEA03";
const LOWC_CONTRACT_ADDRESS_TEST = "0x81B91b31C707236e48c18127a72DaE43b910fd9b";

const TEST_USER33_ADDRESS_TEST = "0x897905EF41f4eeBD8A75819533b731599F8e6bB1";
const TEST_USER44_ADDRESS_TEST = "0xD59e3f0F28d1fd621b5De21853629b2D6E313A45";

const TEST11_CHESS_GAME_ID = 101;



const testChainInfo = {
  chainId: '0x61',
  chainName: 'BSC Testnet',
  nativeCurrency: { name: 'BNBT', symbol: 'BNBT', decimals: 18 }, 
  rpcUrls: ['https://data-seed-prebsc-1-s2.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/']
};

const mainChainInfo = {
  chainId: '0x38',
  chainName: 'Binance Smart Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, 
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/']
};

const chainInfo = testChainInfo;
const LOWB_TOKEN_ADDRESS = LOWB_TOKEN_ADDRESS_TEST;
const CHESS_CONTRACT_ADDRESS = CHESS_CONTRACT_ADDRESS_TEST;
const ADMIN_ADDRESS = ADMIN_ADDRESS_TEST;

const TEST_USER3_ADDRESS_TEST = TEST_USER33_ADDRESS_TEST;
const TEST_USER4_ADDRESS_TEST = TEST_USER44_ADDRESS_TEST;
const TEST_CHESS_GAME_ID = TEST11_CHESS_GAME_ID;

module.exports = {chainInfo,LOWB_TOKEN_ADDRESS, CHESS_CONTRACT_ADDRESS, ADMIN_ADDRESS, TEST_USER3_ADDRESS_TEST, TEST_USER4_ADDRESS_TEST, TEST_CHESS_GAME_ID};



// export const chainInfo = mainChainInfo;
// export const LOWB_TOKEN_ADDRESS = LOWB_TOKEN_ADDRESS_MAIN;
// export const MARKET_CONTRACT_ADDRESS = MARKET_CONTRACT_ADDRESS_MAIN;
// export const HELPER_CONTRACT_ADDRESS = HELPER_CONTRACT_ADDRESS_MAIN;
// export const LOWC_TOKEN_ADDRESS = LOWC_TOKEN_ADDRESS_MAIN;
// export const ADMIN_ADDRESS = ADMIN_ADDRESS_MAIN;
// export const LOWC_CONTRACT_ADDRESS = LOWC_CONTRACT_ADDRESS_MAIN;
