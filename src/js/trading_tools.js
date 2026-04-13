$(document).ready(function() {
    const elements = set_elements_arr();
    get_currencies(elements);
    let timer = setInterval(function () {
        const elements = set_elements_arr();
        get_currencies(elements);
    }, 10000);
});

function set_elements_arr() {
    let cursElementsArr = [];
    const EURUSD = {
        'BID': $(`div[field=${EURUSD_BID}]`),
        //'BID_s': $(`div[field=${EURUSD_BID_SMALL}]`),
        'ASK': $(`div[field=${EURUSD_ASK}]`),
        //'ASK_s': $(`div[field=${EURUSD_ASK_SMALL}]`)
    };
    const USDCAD = {
        'BID': $(`div[field=${USDCAD_BID}]`),
        //'BID_s': $(`div[field=${USDCAD_BID_SMALL}]`),
        'ASK': $(`div[field=${USDCAD_ASK}]`),
        //'ASK_s': $(`div[field=${USDCAD_ASK_SMALL}]`)
    };
    const GBPUSD = {
        'BID': $(`div[field=${GBPUSD_BID}]`),
        //'BID_s': $(`div[field=${GBPUSD_BID_SMALL}]`),
        'ASK': $(`div[field=${GBPUSD_ASK}]`),
        //'ASK_s': $(`div[field=${GBPUSD_ASK_SMALL}]`)
    };
    const NZDUSD = {
        'BID': $(`div[field=${NZDUSD_BID}]`),
        //'BID_s': $(`div[field=${NZDUSD_BID_SMALL}]`),
        'ASK': $(`div[field=${NZDUSD_ASK}]`),
        //'ASK_s': $(`div[field=${NZDUSD_ASK_SMALL}]`)
    };
    cursElementsArr.push({"EURUSD.ecn": EURUSD});
    cursElementsArr.push({"USDCAD.ecn": USDCAD});
    cursElementsArr.push({"GBPUSD.ecn": GBPUSD});
    cursElementsArr.push({"NZDUSD.ecn": NZDUSD});
    return cursElementsArr;
}

function change_curs_on_site(currency, element) {
    if (currency.symbol_name === Object.keys(element)[0]) {
        const cur_bid = currency.bid;
        const cur_ask = currency.ask;
        const cur_bid_parts = [cur_bid.substring(0, cur_bid.length - 3),
            cur_bid.substring(cur_bid.length - 3/*, cur_bid.length - 1*/)/*,
            cur_bid.substring(cur_bid.length - 1)*/];
        const cur_ask_parts = [cur_ask.substring(0, cur_ask.length - 3),
            cur_ask.substring(cur_ask.length - 3/*, cur_ask.length - 1*/)/*,
            cur_ask.substring(cur_ask.length - 1)*/];
        const valObj = Object.values(element)[0];
        const old_bid = parseFloat(valObj.BID.text()/* + valObj.BID_s.text()*/);
        const old_ask = parseFloat(valObj.ASK.text()/* + valObj.ASK_s.text()*/);
        const style = ['color: rgb(94, 203, 158)', 'color: rgb(255, 96, 75)'];
        let innerHtml = `${cur_bid_parts[0]}<strong style="`;
        let style_s = "line-height: 19px;";
        if (parseFloat(cur_bid) > old_bid) {
            innerHtml += style[0];
            style_s += style[0];
        } else if (parseFloat(cur_bid) < old_bid) {
            innerHtml += style[1];
            style_s += style[1];
        }
        innerHtml += `">${cur_bid_parts[1]}</strong>`;
        valObj.BID.html(innerHtml);
        //valObj.BID_s.attr('style', style_s);
        //valObj.BID_s.text(cur_bid_parts[2]);
        innerHtml = `${cur_ask_parts[0]}<strong style="`;
        style_s = "line-height: 19px;";
        if (parseFloat(cur_ask) > old_ask) {
            innerHtml += style[0];
            style_s += style[0];
        } else if (parseFloat(cur_ask) < old_ask) {
            innerHtml += style[1];
            style_s += style[1];
        }
        innerHtml += `">${cur_ask_parts[1]}</strong>`;
        valObj.ASK.html(innerHtml);
        //valObj.ASK_s.attr('style', style_s);
        //valObj.ASK_s.text(cur_ask_parts[2]);
    }
}

function get_currencies(elements) {
    $.getJSON(TT_API_URL, function (data) {
        const currencies = data.currencies;
        for (let i = 0; i < currencies.length; i++) {
            let currency = currencies[i];
            for (let i = 0; i < elements.length; i++) {
                change_curs_on_site(currency, elements[i]);
            }
        }
    });
}
