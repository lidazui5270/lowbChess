import Vue from 'vue';
import Vuex from 'vuex';
import event_bus from './event_bus';
import { ethers } from "ethers";
import { chainInfo, LOWB_TOKEN_ADDRESS, MARKET_CONTRACT_ADDRESS, HELPER_CONTRACT_ADDRESS, LOWC_TOKEN_ADDRESS, ADMIN_ADDRESS } from "./const/const.js"

// game_status :
// 0 游戏未开始,处于准备阶段
// 1 游戏进行中

// 11 red   将死       (red   输)
// 12 red   无子可走   (red   输)
// 13 red   中途离场   (red   输)
// 14 red   和棋       (red   输)
// 15 red   认输       (red   输)

// 21 black 将死       (black 输)
// 22 black 无子可走   (black 输)
// 23 black 中途离场   (black 输)
// 24 black 和棋       (black 输)
// 25 black 认输       (black 输)
// 
// 
// info = {
//     x,
//     y,
//     type = 'king',                   // 棋子类型
//     color = 'red',                   // 棋子颜色 red black
//     is_empty = false,                // 这个坐标的棋子是否为空位
//     tip_point_update_in_round:0,     // 在第几回合时更新的数据
//     
//     tip_point_all:[[0,0]],           // 按游戏规则所有能走的点
//     tip_point_right:[[0,0]]          // 所有能走的点,排除掉那些是队友的点
//     tip_point_to_eat:[[0,0]],        // 能走且可以吃对方的棋子
//     tip_point_to_be_eat:[[0,0]]      // 能走但会被对方吃的点
//     class = ['black','car']          // 该棋子的class
// }
// 
window.calc_tip_point_to_be_eat = true; // 是否显示走那个点会被吃
window.show_moved_trace = true;        // 是否显示 棋子移动过后的痕迹

Vue.use(Vuex);
const store = new Vuex.Store({
    state:{
        connecting:true,            // 是否连接中
        disconnect_count:0,         // 失去连接后.重连次数,超过一定次数,就不再重连
        online_user:0,              // 在线人数
        nickname:'',                // 昵称
        rooms_list:{},              // 房间列表
        chat_list:[],               // 聊天记录
        can_leave_room:false,       // 在房间内是否可以离开房间, false 为可以离开 , 其他情况就显示字符串警告
        in_a_room:false,            // 是否在房间内
        roomid:0,                   // 房间ID
        // game
        identity:null,              // 在房间内的身份 'red' 'black' 'guest'
        now_color:null,             // 现在轮到哪方下棋
        round_count: 1,             // 第几回合
        game_status: 0,             // 游戏状态

        chessboard:null,            // 虚拟棋盘,二维数组,vue根据该数组生成dom棋盘
        selecting_piece:false,      // 为 false 则表示当前没有选中的棋子; 或者为当前选中棋子的 info 对象

        black_piece_pos:[],         // 所有黑棋子的pos,二维数组   [ [0,0], [1,1] ]
        red_piece_pos:[],           // 所有红棋子的pos,二维数组   [ [0,0], [1,1] ]

        piece_tip_point:null,       // 棋子的 info 对象, dom棋盘上显示改棋子可行走的点

        moved_piece_trace:[],       // 棋子移动过后的痕迹 [ [0,0], [1,1] ]

        player:null,                // 房间内的player

        can_not_regret:false,
        can_not_stalemate:false,

        test:123,
        
        account: "",
        chainId: 0,
        isWalletInstalled: false,
        eventFilters: [],
    },
    mutations: {
        test(state){
            return state.test;
        },
        roomid(state,roomid){
            state.roomid = roomid;
        },
        reset_data(state){
            state.now_color = 'red';
            state.round_count = 1;
            state.game_status = 1;
            state.piece_tip_point = null;
            state.moved_piece_trace = [];
            state.selecting_piece = false;
            can_not_regret:false;
            state.can_regret_and_stalemate = false;
        },
        connecting(state,data){
            state.connecting = data;
        },
        disconnect_count(state){
            state.disconnect_count ++;
        },
        online_user(state,num){
            state.online_user = num;
        },
        nickname(state,data){
            state.nickname = data;
        },
        rooms_list(state,data){
            state.rooms_list = data;
        },
        chat_list(state,data){
            if (data.type === 'hr' && state.chat_list.length > 0 && state.chat_list[state.chat_list.length-1].type === 'hr') {
                return false;
            }
            state.chat_list.push(data);
        },
        in_a_room(state,data){
            state.in_a_room = data;
        },
        // game
        identity(state,color){
            state.identity = color;
        },
        now_color(state,color){
            state.now_color = color;
        },
        round_count(state,data){
            state.round_count = data;
        },
        round_count_increment(state){
            state.round_count ++;
        },
        game_status(state,data){
            state.game_status = data;
        },
        chessboard(state,data){
            state.chessboard = data;
        },
        selecting_piece(state,data){
            state.selecting_piece = data;
        },
        black_piece_pos(state,data){
            state.black_piece_pos = data;
        },
        red_piece_pos(state,data){
            state.red_piece_pos = data;
        },
        piece_tip_point(state,data){
            state.piece_tip_point = data;
        },
        moved_piece_trace(state,data){
            state.moved_piece_trace = data;
            event_bus.$emit('shwo_trace',data);
        },
        player(state,data){
            state.player = data;
        },
        can_leave_room(state,data){
            state.can_leave_room = data;  
        },
        can_regret_and_stalemate(state){
            state.can_not_stalemate = state.can_not_regret = true;
        },
        can_not_stalemate(state,bool){
            state.can_not_stalemate = bool;
        },
        can_not_regret(state,bool){
            state.can_not_regret = bool;
        },
        setAccount (state, account) {
            state.account = account
            console.log("set account: ", account)
        },
        setChainId (state, id) {
            state.chainId = id
            console.log("set chain id: ", id)
        },
        setWalletInstalled (state) {
          state.isWalletInstalled = true
        },
        setBalance (state, payload) {
          state.bnbBalance = payload.bnbBalance
          state.lowbBalance = payload.lowbBalance
          state.lowbMarketBalance = payload.lowbMarketBalance
          state.approvedBalance = payload.approvedBalance
          console.log("set balance: ", payload)
        },
        addFilter (state, filter) {
          state.eventFilters.push(filter)
          console.log("register new event!")
        },
    },
    actions: {
        switchChain () {
          switchToBinanceSmartChain ()
        },
        updateAccounts () {
            getAccounts ()
        },
        updateChainId () {
          getNetworkAndChainId ()
        },
        approve({}, amout) {
          console.log(" vuex_store.js approve deposit : " + amout);
          approveLowb(amout)
        },
        deposit({}, amout) {
          console.log(" vuex_store.js deposit deposit : " + amout);
          depositLowb(amout)
        }
      }
});


//质押lowb
async function depositLowb(amount) {
  if (amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.deposit(amount_in_wei);
  }

  const filter = global.lowbContract.filters.Transfer(store.state.account, null)
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("deposit Lowb event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.lowbContract.on(filter, async (from, to, value, event) => {
      console.log(`I sent ${ value/1e18 } lowb to ${ to}`);
      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
      try {
        const bnbBalance = await global.provider.getBalance(store.state.account)
        const lowbBalance = Number(store.state.lowbBalance) - Number(value)
        const lowbMarketBalance = Number(store.state.lowbMarketBalance) + Number(value)
        const approvedBalance = Number(store.state.approvedBalance) - Number(value)
        store.commit('setBalance', {
          bnbBalance: bnbBalance,
          lowbBalance: lowbBalance,
          lowbMarketBalance: lowbMarketBalance,
          approvedBalance: approvedBalance
        })
        } catch (err) {
          console.error(err)
        }
    });
  }
}

//授权lowb
async function approveLowb(amount) {
  console.log(" vuex_store.js appapproveLowbrove deposit : " + amount);
  if (amount > 0) {
    const lowbWithSigner = global.lowbContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await lowbWithSigner.approve(MARKET_CONTRACT_ADDRESS, amount_in_wei);
  }

  const filter = global.lowbContract.filters.Approval(store.state.account, null)
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("approve Lowb event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.lowbContract.on(filter, async (owner, spender, value, event) => {
      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
      console.log(`lowbContract I approved ${ value/1e18 } lowb to ${ spender}`);
      if (value > 0) {
        console.log(`I approved ${ value/1e18 } lowb to ${ spender}`);
        try {
          const bnbBalance = await global.provider.getBalance(store.state.account)
          const lowbBalance = store.state.lowbBalance
          const lowbMarketBalance = store.state.lowbMarketBalance
          const approvedBalance = value
          store.commit('setBalance', {
            bnbBalance: bnbBalance,
            lowbBalance: lowbBalance,
            lowbMarketBalance: lowbMarketBalance,
            approvedBalance: approvedBalance
          })
        } 
        catch (err) {
          console.error(err)
        }
      }
    });
  }
  
}

async function getNetworkAndChainId () {
  try {
    const chainId = await ethereum.request({
      method: 'eth_chainId',
    })
    handleNewChain(chainId)

    const networkId = await ethereum.request({
      method: 'net_version',
    })
    console.log("network id", networkId)
  } catch (err) {
    console.error(err)
  }
}

function handleNewChain (chainId) {
  store.commit('setChainId', chainId)
  if(chainId == chainInfo.chainId) {
    if (store.state.account != '') {
      getBalance(store.state.account)
      // store.dispatch('updateMyNfts')
    }
    // store.dispatch('updateTotalGroup')
    addLowbToken ()
  }
}

async function switchToBinanceSmartChain () {
    console.log('switchToBinanceSmartChain' + chainInfo.chainId)
    store.commit('setChainId', chainInfo.chainId)
    try {
      await ethereum.request({ 
        method: 'wallet_addEthereumChain', 
        params: [{ 
          chainId: chainInfo.chainId, //'0x38', 
          chainName: 'BSC Testnet', //'Binance Smart Chain', 
          nativeCurrency: { name: 'BNBT', symbol: 'BNBT', decimals: 18 }, 
          rpcUrls: ['https://data-seed-prebsc-1-s2.binance.org:8545/'], //['https://bsc-dataseed.binance.org/'], 
          blockExplorerUrls: ['https://testnet.bscscan.com'] //['https://bscscan.com/'] 
        }] 
      })
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
}

async function getAccounts () {
    try {
      await ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      const newAccounts = await ethereum.request({
        method: 'eth_accounts',
      })
      handleNewAccounts(newAccounts)
    } catch (err) {
      console.error('Error on init when getting accounts', err)
    }
}

function handleNewAccounts (accounts) {
    store.commit('setAccount', accounts[0])
    console.log("store.state.chainId : " + store.state.chainId)
    console.log("chainInfo.chainId : " + chainInfo.chainId)
    if(store.state.chainId == chainInfo.chainId) {
      getBalance(accounts[0])
    //   store.dispatch('updateMyNfts')
      addLowbToken ()
    }
}

async function getBalance (account) {
  try {
    const bnbBalance = await global.provider.getBalance(account)
    const lowbBalance = await global.lowbContract.balanceOf(account)
    const lowbMarketBalance = await global.marketContract.pendingWithdrawals(account)
    const approvedBalance = await global.lowbContract.allowance(account, MARKET_CONTRACT_ADDRESS)
    console.log(' bnbBalance : ' + bnbBalance * 1e-18 + ' lowbBalance : ' + lowbBalance * 1e-18 + ' lowbMarketBalance : ' + lowbMarketBalance  + ' approvedBalance : ' + approvedBalance)
    store.commit('setBalance', {
      bnbBalance: bnbBalance,
      lowbBalance: lowbBalance,
      lowbMarketBalance: lowbMarketBalance,
      approvedBalance: approvedBalance
    })
  } catch (err) {
    console.error(err)
  }
}

async function addLowbToken () {
    if (localStorage.getItem('setLowb') == "true") {
      return
    }
    const tokenAddress = LOWB_TOKEN_ADDRESS
    const tokenSymbol = 'LOWB'
    const tokenDecimals = 18
    const tokenImage = 'https://bscscan.com/token/images/losercoin_32.png'
  
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });
  
      if (wasAdded) {
        console.log('Thanks for your interest!');
        localStorage.setItem("setLowb", "true")
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
    
}

const isWalletInstalled = () => {
  const { ethereum } = window
  //console.log('MetaMask', ethereum.isMetaMask)
  return Boolean(ethereum)
}

async function getContracts (firstTime = true) {
  const lowbFile = () => import("./assets/ERC20Template.json")
  const lowbAbi = (await lowbFile())['abi']
  global.lowbContract = new ethers.Contract(LOWB_TOKEN_ADDRESS, lowbAbi, global.provider)

  const marketFile = () => import("./assets/LowbMarket.json")
  const marketAbi = (await marketFile())['abi']
  global.marketContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketAbi, global.provider)

  const helperFile = () => import("./assets/LowbMarketHelper.json")
  const helperAbi = (await helperFile())['abi']
  global.helperContract = new ethers.Contract(HELPER_CONTRACT_ADDRESS, helperAbi, global.provider)

  const lowcFile = () => import("./assets/MyCollectible.json")
  const lowcAbi = (await lowcFile())['abi']
  global.lowcContract = new ethers.Contract(LOWC_TOKEN_ADDRESS, lowcAbi, global.provider)

  const testFile = () => import("./assets/loserpunk.json")
  global.loserpunk = (await testFile())

  if (firstTime && store.state.isWalletInstalled) {
    // update infomation after get contract!!!

    ethereum.autoRefreshOnNetworkChange = false
    store.dispatch('updateChainId')
    store.dispatch('updateAccounts')

    //ethereum注册事件
    ethereum.on('chainChanged', handleNewChain)
    ethereum.on('accountsChanged', handleNewAccounts)
  }
  else {
    handleNewChain(chainInfo.chainId)
  }

}
if (isWalletInstalled()) {

  global.provider = new ethers.providers.Web3Provider(window.ethereum)
  global.signer = global.provider.getSigner()
  console.log('Access the decentralized web!')
  store.commit('setWalletInstalled')
  
}
else {
  global.provider = new ethers.providers.JsonRpcProvider(chainInfo.rpcUrls[0]);
  //const block = await provider.getBlockNumber()
  console.log('block', provider.getBlockNumber())
}
getContracts()
export default store;