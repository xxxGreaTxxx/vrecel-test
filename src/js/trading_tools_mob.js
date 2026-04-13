document.addEventListener('DOMContentLoaded', () => {

  const types = {
    ecn: {
      name: 'ECN',
      market: [
        {
          name: 'Forex',
          securities: ['Forex ECN'],
          comission: '$4',
          tableData: []
        },
        {
          name: 'Metals',
          securities: ['Metals ECN', 'Metals ECN 2'],
          comission: '$4',
          tableData: []
        },
        {
          name: 'Indices',
          securities: ['Indices CFD', 'Index HK50'],
          comission: '$5',
          tableData: []
        },
        {
          name: 'Commodities',
          securities: ['Commodities CFD'],
          comission: '$5',
          tableData: []
        },
        {
          name: 'Shares US',
          securities: ['CFD Shares US'],
          comission: '0,05%',
          tableData: []
        },
        /*{
          name: 'Shares UK',
          securities: ['CFD Shares UK'],
          comission: '0,10%',
          tableData: []
        },*/
        {
          name: 'Shares DE',
          securities: ['CFD Shares DE'],
          comission: '0,05%',
          tableData: []
        },
        {
          name: 'Shares Asia',
          securities: ['CFD Shares Asia'],
          comission: '0,05%',
          tableData: []
        },
        {
          name: 'Shares RU',
          securities: ['CFD Shares RU'],
          comission: '0,05%',
          tableData: []
        }
      ]
    },
    ecnFix: {
      name: 'FIX',
      market: [
        {
          name: 'Forex',
          securities: ['Fix Forex', 'Fix Exotics'],
          comission: '$0',
          tableData: []
        },
        {
          name: 'Metals',
          securities: ['Fix Metals', 'Fix Metals'],
          comission: '$0',
          tableData: []
        },
        {
          name: 'Indices',
          securities: ['Indices CFD', 'Index HK50'],
          comission: '$5',
          tableData: []
        },
        {
          name: 'Commodities',
          securities: ['Commodities CFD'],
          comission: '$5',
          tableData: []
        },
        {
          name: 'Shares US',
          securities: ['CFD Shares US'],
          comission: '0,05%',
          tableData: []
        },
        /*{
          name: 'Shares UK',
          securities: ['CFD Shares UK'],
          comission: '0,10%',
          tableData: []
        },*/
        {
          name: 'Shares DE',
          securities: ['CFD Shares DE'],
          comission: '0,05%',
          tableData: []
        },
        {
          name: 'Shares Asia',
          securities: ['CFD Shares Asia'],
          comission: '0,05%',
          tableData: []
        },
        {
          name: 'Shares RU',
          securities: ['CFD Shares RU'],
          comission: '0,05%',
          tableData: []
        }
      ]
    },
    ecnMini: {
      name: 'Mini',
      market: [
        {
          name: 'Forex',
          securities: ['Forex Mini'],
          comission: '$0',
          tableData: []
        },
        {
          name: 'Metals',
          securities: ['Metals Mini'],
          comission: '$0',
          tableData: []
        }
      ]
    }
  }

  const app = Vue.createApp({
    template: `
      <div class="trading-tools_mob">
        <div class="trading-tools__tabs">
          <span
            v-for="(type, key) in types"
            :key="type.name"
            :class="{ 'trading-tools__tab--active' : activeType === key }"
            class="trading-tools__tab"
            @click.prevent="changeActiveType(key)"
          >
            {{ type.name }}
          </span>
        </div>
        <ul class="trading-tools__markets">
          <li
            v-for="market in types[activeType].market"
            :key="market.name"
          >
            <span
              class="trading-tools__market"
              :class="{ 'active' : activeTool === market.name }"
              @click.prevent="activeTool = market.name"
            >
              <span class="trading-tools__market-name">{{ market.name }}</span>
              <sub class="trading-tools__markets-count">{{ market.tableData.length }}</sub>
            </span>
          </li>
        </ul>
		<div class="trading-tools__table">
          <table id="tab-fix-2" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                  <th>Instrument</th>
                  <th>Bid</th>
                  <th>Ask</th>
              </tr>
            </thead>
            <tbody
				v-for="(data, i) in activeMarket.tableData"
                :key="i"
				class="tbody-mob"
			>
              <tr class="tr-mob">
                  <td>
                    <strong 
					  class="trading-tools__symbol-name mob"
					  @click.prevent="showMore(data.symbol_name)"
					>
						{{ data.symbol_name }}
					</strong>
                  </td>
                  <td>{{ cutNumber(data.bid, data.digits) }}</td>
                  <td>{{ cutNumber(data.ask, data.digits) }}</td>
              </tr>
<tr
  :class=repl(data.symbol_name)
  class="inner-table"
><td colspan="3">
			  <table>
				<tbody>
					<tr>
						<td>Spread</td>
						<td>{{ calcSpread(data) }}</td>
					</tr>
					<tr>
						<td>Comission*</td>
						<td>{{ activeMarket.comission }}</td>
					</tr>
					<tr>
						<td>Contract size</td>
						<td>{{ toFix(data.contract_size) }}</td>
					</tr>
					<tr>
						<td>Point</td>
						<td>{{ data.point }}</td>
					</tr>
					<tr>
						<td>{{ activeMarket.name === 'Shares AR' || activeTool === 'Crypto Currency' ? 'Swap long (%)' : 'Swap long (pips)' }}</td>
						<td>{{ data.swap_long }}</td>
					</tr>
					<tr>
						<td>{{ activeMarket.name === 'Shares AR' || activeTool === 'Crypto Currency' ? 'Swap short (%)' : 'Swap short (pips)' }}</td>
						<td>{{ data.swap_short }}</td>
					</tr>
				</tbody>
			  </table>
</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    data() {
      return {
        types,
        activeType: 'ecn',
        activeTool: 'Forex'
      }
    },
    computed: {
      activeMarket() {
        return this.types[this.activeType].market.find((m) => m.name === this.activeTool)
      }
    },
    methods: {
      fetchData() {
        fetch(TT_API_URL)
        .then((response) => response.json())
        .then(({ currencies }) => {
          this.groupCurrencies(currencies)
        })
      },
      groupCurrencies(currencies) {
        for (const type in this.types) {
          this.types[type].market.forEach((marketItem) => {
            const data = []
            marketItem.securities.forEach((security) => {
              const securities = currencies.filter((currency) => currency.security === security)
              data.push(...securities)
            })

            marketItem.tableData = data
          })
        }
      },
      calcSpread(data) {
        return Math.round((data.ask - data.bid) / +data.point)
      },
      cutNumber(num, digits) {
        return Number(num).toFixed(digits)
      },
      toFix(num) {
        const n = +num
        if (typeof n === 'number') {
          return n.toFixed(0)
        }
        return '-'
      },
      changeActiveType(type) {
        this.activeType = type
        const [firstTool] = this.types[type].market
        this.activeTool = firstTool.name
      },
	  showMore(tool) {
		  const tbl = $("tr." + tool.replace('.', '-').replace('!', ''))
		  tbl.toggle(500)
	  },
	  repl(str) {
		  return str.replace(".", "-").replace("!", "")
	  }
    },
    created() {
      if (TT_SHOW_STD) {
        const std = {
          name: 'STD',
          market: [
            {
              name: 'Forex',
              securities: ['Forex.'],
              comission: '$0',
              tableData: []
            },
            {
              name: 'Metals',
              securities: ['Metals.'],
              comission: '$0',
              tableData: []
            },
            {
              name: 'Indices',
              securities: ['Indices CFD', 'Index HK50'],
              comission: '$5',
              tableData: []
            },
            {
              name: 'Commodities',
              securities: ['Commodities CFD'],
              comission: '$5',
              tableData: []
            },
            {
              name: 'Shares US',
              securities: ['CFD Shares US'],
              comission: '0,05%',
              tableData: []
            },
            /*{
              name: 'Shares UK',
              securities: ['CFD Shares UK'],
              comission: '0,10%',
              tableData: []
            },*/
            {
              name: 'Shares DE',
              securities: ['CFD Shares DE'],
              comission: '0,05%',
              tableData: []
            },
            {
              name: 'Shares Asia',
              securities: ['CFD Shares Asia'],
              comission: '0,05%',
              tableData: []
            },
            {
              name: 'Shares RU',
              securities: ['CFD Shares RU'],
              comission: '0,05%',
              tableData: []
            }
          ]
        }

        this.types.std = std

        if (TT_SHOW_CRYPTO) {
          const cryptoCurrency = {
            name: 'Crypto Currency',
            securities: ['Crypto Currency'],
            comission: '$0',
            tableData: []
          }
  
          this.types.std.market.push(cryptoCurrency)
        }
      }

      if (TT_SHOW_CRYPTO) {
        const cryptoCurrency = {
          name: 'Crypto Currency',
          securities: ['Crypto Currency'],
          comission: '0,05%',
          tableData: []
        }
		
		const cfdSharesAR = {
          name: 'Shares AR',
          securities: ['CFD Shares AR'],
          comission: '0,05%',
          tableData: []
        }
		
		this.types.ecn.market.push(cryptoCurrency, cfdSharesAR)
        this.types.ecnFix.market.push(cryptoCurrency,cfdSharesAR)
        // this.types.ecn.market.push(cryptoCurrency)
        // this.types.ecnFix.market.push(cryptoCurrency)
      }

      this.fetchData()
    },
    mounted() {
      setInterval(() => {
        this.fetchData()
      }, 10000)
    }
  })
  app.mount('#trading-tools-mob')
})
