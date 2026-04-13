const BankTransfers="Bank Transfers",
Cards="Cards",
EWallets="E-Wallets",
WorkDays=" work days";
Hour="Within an hour"
Instantly="Instantly"

// SMART
 const Countries="Countries: ",
 TransferCurrency="Transfer currency: ",
 ExecutionTime="Execution Time: ",
 Fee="Fee: ",
 MIN_amount_per_transaction="Min amount per 1 transaction: ",
 MAX_amount_per_transaction="Max amount per 1 transaction: ";



function toUpperCase_1thLetter(string) { // Для section-card
    const addString = string
    const splitted = addString.split('')
    const first = splitted[0].toUpperCase()
    const rest = [...splitted] 
    rest.splice(0, 1)
    const result = [first, ...rest].join("")
    return result;
}



function create_ContentTitle_SMART(title) {
    const linkWrapper = document.createElement('a'),
    linkText = document.createElement('span');
    linkText.innerHTML = title;
    linkWrapper.className = 'nav-link__wr__SMART';
    linkText.className = 'nav-link__text__SMART';

    linkWrapper.appendChild(linkText);
    return linkWrapper;
}

function create_ContentItem_SMART(title, data) {
    const ContentItem = document.createElement('li'),
    ItemTitle = document.createElement('span');

    if (title == '') {
        ContentItem.innerHTML = data;
    } else {
        ItemTitle.innerHTML = title;
        ContentItem.innerHTML = data;
        ContentItem.prepend(ItemTitle);
    }
    
    ContentItem.className = 'col-name__SMART';

    return ContentItem;
}

function create_ContentList_SMART(val, sectionCard_tagbr) {
    const ContentList = document.createElement('ul');

    ContentList.className = "column-group__SMART";
    ContentList.appendChild(create_ContentItem_SMART('', val.name));
    ContentList.appendChild(create_ContentItem_SMART(`<b>${Countries} </b>`, `<b>${val.countries}</b>`));
    if (sectionCard_tagbr) {
        ContentList.appendChild(create_ContentItem_SMART(`${TransferCurrency} <br /><br />`, name_symbol(val.limitations)));
    } else {
        ContentList.appendChild(create_ContentItem_SMART(`${TransferCurrency} `, name_symbol(val.limitations)));
    }
    ContentList.appendChild(create_ContentItem_SMART(`${ExecutionTime} `, Math.floor(val["time-period_min"]/24) + " - " + Math.floor(val["time-period_max"]/24) + WorkDays)); // work days
    ContentList.appendChild(create_ContentItem_SMART(`${Fee} `, val.charges));

    let min = "", max = "", delimeter = "";

    if (Object.getOwnPropertyNames(val.limitations_extended).length > 1) {
        delimeter = "<br/>";
    }
    for (let lim in val.limitations_extended) {
        min += val.limitations_extended[lim].min.toString() + name_symbol(lim) + delimeter;
        max += val.limitations_extended[lim].max.toString() + name_symbol(lim) + delimeter;
    }
    if (sectionCard_tagbr) {
        ContentList.appendChild(create_ContentItem_SMART(`${MIN_amount_per_transaction} <br /><br />`, min));
        ContentList.appendChild(create_ContentItem_SMART(`${MAX_amount_per_transaction} <br /><br />`, max));
    } else {
        ContentList.appendChild(create_ContentItem_SMART(`${MIN_amount_per_transaction} `, min));
        ContentList.appendChild(create_ContentItem_SMART(`${MAX_amount_per_transaction} `, max));
    }
    return ContentList;
}

function name_symbol(name) {
    let nn = name.toString();
    /*nn = nn.replace("USD", "$");
    nn = nn.replace("EUR", "€");
    nn = nn.replace("RUB", "₽");*/
	nn = nn.replace("USD", " USD");
    nn = nn.replace("EUR", " EUR");
    nn = nn.replace("RUB", " RUB");
    nn = nn.replace(",", " <br/>");
    return nn
}

function make_td(data) { 
    let td = document.createElement("div");
    td.className = "col";
    td.innerHTML = data;
    return td
}

function make_td_header_tel(data) { 
    let td = document.createElement("div");
    td.className = "col-name";
    td.innerHTML = data;
    return td
}

function make_tr_tel(val) {
    let tr = document.createElement("div");
    tr.className = "row-group-mob";
	tr.appendChild(make_td_header_tel("Payment system"));
    tr.appendChild(make_td(val.name));
	let tbl = document.createElement("div");
	tbl.className = "two-cols";
	tr.appendChild(tbl);
	let el = document.createElement("div");
	el.className = "group";
	el.appendChild(make_td_header_tel("Countries"));
    el.appendChild(make_td(val.countries));
	tbl.appendChild(el);
	el = document.createElement("div");
	el.className = "group";
	el.appendChild(make_td_header_tel("Execution Time"));
    //el.appendChild(make_td(Number((val["time-period_min"]/24).toFixed(2)) + " - " + Number((val["time-period_max"]/24).toFixed(2)) + WorkDays)); // work days
	if (val.name.includes("SEPA")) {
		el.appendChild(make_td(Hour))
	} else {
		el.appendChild(make_td(Instantly))
	}
	tbl.appendChild(el);
	el = document.createElement("div");
	el.className = "group";
	el.appendChild(make_td_header_tel("Transfer currency"));
    el.appendChild(make_td(name_symbol(val.limitations)));
	tbl.appendChild(el);
	el = document.createElement("div");
	el.className = "group";
	el.appendChild(make_td_header_tel("Fee"));
    el.appendChild(make_td(val.charges));
	tbl.appendChild(el);

    let min = "", max = "", delimeter = "";

    if (Object.getOwnPropertyNames(val.limitations_extended).length > 1) {
        delimeter = "<br/>";
    }
    for (let lim in val.limitations_extended) {
        min += val.limitations_extended[lim].min.toString() + name_symbol(lim) + delimeter;
        max += val.limitations_extended[lim].max.toString() + name_symbol(lim) + delimeter;
    }
	el = document.createElement("div");
	el.className = "group";
	el.appendChild(make_td_header_tel("Max amount per 1 transaction <span>*</span>"));
    el.appendChild(make_td(max));
	tbl.appendChild(el);
	el = document.createElement("div");
	el.className = "group";
	el.appendChild(make_td_header_tel("Min amount per 1 transaction <span>*</span>"));
    el.appendChild(make_td(min));
	tbl.appendChild(el);
    return tr
}

function make_tr_line(name, class_name) {
    let tr = document.createElement("div");
    tr.className = class_name;
    tr.appendChild(make_td(name));
    return tr
}

    // tr - горизонтальная группа ячеек (строка)
function make_tr(val) {
    let tr = document.createElement("div");
    let time_period_min = Number((val["time-period_min"]/24).toFixed(2));
    let time_period_max = Number((val["time-period_max"]/24).toFixed(2));

    tr.className = "row-group";
    tr.appendChild(make_td(val.name));
    tr.appendChild(make_td(val.countries));
    tr.appendChild(make_td(name_symbol(val.limitations)));
    //tr.appendChild(make_td(time_period_min + " - " + time_period_max + WorkDays)); // work days
	if (val.name.includes("SEPA")) {
		tr.appendChild(make_td(Hour))
	} else {
		tr.appendChild(make_td(Instantly))
	}
    tr.appendChild(make_td(val.charges));

    let min = "", max = "", delimeter = "";

    if (Object.getOwnPropertyNames(val.limitations_extended).length > 1) {
        delimeter = "<br/>";
    }
    for (let lim in val.limitations_extended) {
        min += val.limitations_extended[lim].min.toString() + name_symbol(lim) + delimeter;
        max += val.limitations_extended[lim].max.toString() + name_symbol(lim) + delimeter;
    }
    tr.appendChild(make_td(min));
    tr.appendChild(make_td(max));
    return tr
}




document.addEventListener("DOMContentLoaded", () => { 
fetch("/api/payment/depositdata", {method: "GET"}).then((response) => {
    return response.json()
}).then((data) => {
    
        //section-bank_transfers

            const banktransfersContainer = document.getElementById("banktransfers-container");
            //banktransfersContainer.appendChild(make_tr_line(BankTransfers, "category-name"));

            const banktransfersContainer_SMART = document.getElementById("banktransfers-container-smart");
            banktransfersContainer_SMART.appendChild(create_ContentTitle_SMART(BankTransfers));
            
            const BankTransfers_Data = data.banktransfers;

            for (let data of BankTransfers_Data) {
                banktransfersContainer.appendChild(make_tr(data));
                banktransfersContainer_SMART.appendChild(create_ContentList_SMART(data));
            };
			for (let data of BankTransfers_Data) {
                banktransfersContainer.appendChild(make_tr_tel(data));
                banktransfersContainer_SMART.appendChild(create_ContentList_SMART(data));
            };

        // section-cards

            const cardsContainer = document.getElementById("cards-container"),
            cardsContainer_SMART = document.getElementById("cards-container-smart");
            cardsContainer_SMART.appendChild(create_ContentTitle_SMART(Cards));
            
            cardsContainer.style.display = "none";
            for (let val in data.cards) {
                    switch (val) {
                        case "mastercard": 
                            let mastercard_wrapper = document.createElement("div");
                            mastercard_wrapper.className ="content-container";
                            mastercard_wrapper.appendChild(make_tr_line(toUpperCase_1thLetter(val), "category-name"));
                            
                            let mastercard_wrapper__SMART = document.createElement("div");
                            mastercard_wrapper__SMART.className ="content-container_SMART";
                            mastercard_wrapper__SMART.appendChild(create_ContentTitle_SMART(toUpperCase_1thLetter(val)));

                            for (let mastercard_values of data.cards.mastercard) {
                                mastercard_wrapper.appendChild(make_tr(mastercard_values));
                                mastercard_wrapper__SMART.appendChild(create_ContentList_SMART(mastercard_values, true));
                            };
							for (let mastercard_values of data.cards.mastercard) {
                                mastercard_wrapper.appendChild(make_tr_tel(mastercard_values));
                                mastercard_wrapper__SMART.appendChild(create_ContentList_SMART(mastercard_values, true));
                            };
                            cardsContainer.appendChild(mastercard_wrapper);
                            cardsContainer_SMART.appendChild(mastercard_wrapper__SMART);
                        continue;
                        case "visa":
                            let visa_wrapper = document.createElement("div");
                            visa_wrapper.className ="content-container";
                            visa_wrapper.appendChild(make_tr_line(toUpperCase_1thLetter(val), "category-name"));

                            let visa_wrapper__SMART = document.createElement("div");
                            visa_wrapper__SMART.className ="content-container_SMART";
                            visa_wrapper__SMART.appendChild(create_ContentTitle_SMART(toUpperCase_1thLetter(val)));
    
                            for (let visa_values of data.cards.visa) {
                                visa_wrapper.appendChild(make_tr(visa_values));
                                visa_wrapper__SMART.appendChild(create_ContentList_SMART(visa_values, true));
                            };
							for (let visa_values of data.cards.visa) {
                                visa_wrapper.appendChild(make_tr_tel(visa_values));
                                visa_wrapper__SMART.appendChild(create_ContentList_SMART(visa_values, true));
                            };
                            cardsContainer.appendChild(visa_wrapper);
                            cardsContainer_SMART.appendChild(visa_wrapper__SMART);
                        break;
                    }
            }
			// section-eWallet 

			const eWalletContainer = document.getElementById('eWallet-container');
			eWalletContainer.style.display = "none";
			eWalletContainer.className ="content-container";
			eWalletContainer.appendChild(make_tr_line(EWallets, "category-name"));
			
			const eWalletContainer_SMART = document.getElementById("eWallet-container-smart");
			eWalletContainer_SMART.appendChild(create_ContentTitle_SMART(EWallets));

			const eWallets_Data = data.ewallets;
			for (let data of eWallets_Data) {
				if (data.name !== "Broker Transfer" ) {
					eWalletContainer.appendChild(make_tr(data));
					eWalletContainer_SMART.appendChild(create_ContentList_SMART(data));
				}
			}
			for (let data of eWallets_Data) {
				if (data.name !== "Broker Transfer" ) {
					eWalletContainer.appendChild(make_tr_tel(data));
					eWalletContainer_SMART.appendChild(create_ContentList_SMART(data));
				}
			}
    })
})