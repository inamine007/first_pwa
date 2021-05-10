export const state = () => ({
  order: [],
})

export const mutations = {
  // オーダーをとる処理
  insert(state, obj) {
    const orderItem = state.order.find(item => item.table === obj.table);
    let d_total = 0;
    let f_total = 0;
    let f_menu = [];
    let d_menu = [];
    // テーブルのオーダーがすでに存在する場合
    if (orderItem) {
      // 選択した商品がすでに存在していないか確認し、存在していない場合はstateに追加する関数
      const setMenu = function(menus, menu, kbn, app) { 
        const item = menus.find(item => item.id === obj.id && item.name === obj.name && item.send_flg === '0');
        if (!item) {
          menu.push({
            name: obj.name,
            price: obj.price,
            id: obj.id,
            kbn: obj.kbn,
            amount: 1,
            send_flg: '0'
          });
          kbn === 'd' ? d_total += app.$taxCalc(obj.price) : f_total += app.$taxCalc(obj.price);
        }
      }
      d_menu = orderItem.d_menu;
      d_total = orderItem.d_total;
      f_menu = orderItem.f_menu;
      f_total = orderItem.f_total;
      if (obj.kbn === '8') {
        setMenu(orderItem.d_menu, d_menu, 'd', this);
      } else {
        setMenu(orderItem.f_menu, f_menu, 'f', this);
      }
      orderItem.f_menu = f_menu;
      orderItem.f_total = f_total;
      orderItem.d_menu = d_menu;
      orderItem.d_total = d_total;
      orderItem.total = f_total + d_total;
    // テーブルのオーダーが存在しない場合
    } else {
      // stateに商品を追加する関数
      const setMenu = function(menu, kbn, app) {
        kbn === 'd' ? d_total += app.$taxCalc(obj.price) : f_total += app.$taxCalc(obj.price); 
        menu.push({
          name: obj.name,
          price: obj.price,
          id: obj.id,
          kbn: obj.kbn,
          amount: 1,
          send_flg: '0'
        });
      }
      obj.kbn === '8' ? setMenu(d_menu, 'd', this) : setMenu(f_menu, 'f', this);
      state.order.push({
        table: obj.table,
        f_total: f_total,
        f_menu: f_menu,
        d_total: d_total,
        d_menu: d_menu,
        total: f_total + d_total
      });
    }
  },
  // 選んだ商品の個数を上げる
  countUp(state, obj) {
    const orderItem = state.order.find(item => item.table === obj.table);
    const upMenu = function(menus, kbn, app) {
      const item = menus.find(item => item.id === obj.id && item.name === obj.name && item.send_flg === '0');
      item.amount ++;
      kbn === 'd' ? orderItem.d_total += app.$taxCalc(item.price) : orderItem.f_total += app.$taxCalc(item.price);
      orderItem.total += app.$taxCalc(item.price);
    }
    obj.kbn === '8' ? upMenu(orderItem.d_menu, 'd', this) : upMenu(orderItem.f_menu, 'f', this);
  },
  // 選んだ商品の個数を下げる
  countDown(state, obj) {
    const orderItem = state.order.find(item => item.table === obj.table);
    const downMenu = function(menus, kbn, app) {
      const item = menus.find(item => item.id === obj.id && item.name === obj.name && item.send_flg === '0');
      if (item.amount > 1) {
        item.amount --;
        kbn === 'd' ? orderItem.d_total += app.$taxCalc(item.price) : orderItem.f_total += app.$taxCalc(item.price);
        orderItem.total -= app.$taxCalc(item.price);
      } else {
        return false;
      }
    }
    obj.kbn === '8' ? downMenu(orderItem.d_menu, 'd', this) : downMenu(orderItem.f_menu, 'f', this);
  },
  // 選んだ商品をカートからはずす
  chancelItem(state, obj) {
    const orderItem = state.order.find(item => item.table === obj.table);
    const chancelMenu = function(menus, kbn, app) {
      const itemIndex = menus.findIndex(elm => elm.id === obj.id && elm.name === obj.name && elm.send_flg === '0');
      kbn === 'd' ? orderItem.d_total -= app.$taxCalc(menus[itemIndex].price) * Number(menus[itemIndex].amount) : orderItem.f_total -= app.$taxCalc(menus[itemIndex].price) * Number(menus[itemIndex].amount);
      orderItem.total -= app.$taxCalc(menus[itemIndex].price) * Number(menus[itemIndex].amount);
      menus.splice(itemIndex, 1);
    }
    obj.kbn === '8' ? chancelMenu(orderItem.d_menu, 'd', this) : chancelMenu(orderItem.f_menu, 'f', this);
  },
  // 伝票を作成した料理にフラグを立てる
  sended(state, obj) {
    const d = new Date();
    const time = this.$getTime(d);
    const orderItem = state.order.find(item => item.table === obj.table);
    const flgOn = function(menus) {
      const item = menus.find(item => item.id === obj.id && item.name === obj.name && item.send_flg === '0');
      item.send_flg = '1';
      item.send_time = time;
    }
    obj.kbn === 'D' ? flgOn(orderItem.d_menu) : flgOn(orderItem.f_menu);
  },
  // 会計したオーダー内容をstateから削除
  checkTable(state, obj) {
    const itemIndex = state.order.findIndex(elm => elm.table === obj.table && elm.stat === '1');
    state.order.splice(itemIndex, 1);
  }
}

export const getters = {
  // 料理の合計金額を取得する
  getTotal: state => (table, kbn, app) => {
    const orderItem = state.order.find(item => item.table === table);
    let total = 0;
    const menuTotal = function(menus) {
      for(let i=0; i < menus.length; i++) {
        if (menus[i].send_flg === '0') {
          total += app.$taxCalc(menus[i].price);
        }
      }
    }
    kbn === 'D' ? menuTotal(orderItem.d_menu) : menuTotal(orderItem.f_menu);
    return total;
  }
}