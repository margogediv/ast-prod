const date = new Date();

export default {
    namespaced: true,

    state: () => ({

        factories: [
            {name: "Завод нефтепродуктов г. Мозырь", factoryid: "20"},
            {name: "Завод нефтепродуктов г. Гомель", factoryid: "10"},
            {name: "Завод нефтепродуктов г. Полоцк", factoryid: "30"},
        ],

        selectedfactory: {},

        shops: [
            {name: "Цех ковки тяжелых конструкций и древесины г. Гомель", shopid: "2", factoryid: "10"},
            {name: "Цех ковки тяжелых конструкций и древесины г. Мозырь", shopid: "4", factoryid: "20"},
            {name: "Цех ковки тяжелых конструкций и древесины г. Полоцк", shopid: "6", factoryid: "30"},
            {name: "Цех отлива тяжелых конструкций и древесины г. Гомель", shopid: "8", factoryid: "10"},
            {name: "Цех отлива тяжелых конструкций и древесины г. Мозырь", shopid: "3", factoryid: "20"},
            {name: "Цех отлива тяжелых конструкций и древесины г. Полоцк", shopid: "5", factoryid: "30"},

        ],
        selectedshops: [],

        activeshop: {name: "Цех ковки тяжелых конструкций и древесины г. Гомель", shopid: "2", factoryid: "10"},

        showCharts: [],

        selectChart: 0,

        arrPoint: [],

        basicData: [],

        basicOptions: {},

        reason: [],

        timeStatus: {
            all: 0,
            idle: 0,
            crash: 0,
            off: 0,
            working: 0,
        },

        loader: false,
        chartTime: {
            start: ((date.getTime() - (3600 * 24 * 30 * 1000)) / 1000).toFixed(),
            end: (date.getTime() / 1000).toFixed(),
        }

    }),

    getters: {
        getChartTime(state) {
            return state.chartTime;
        },

        loader(state) {
            return state.loader;
        },
        factories(state) {
            return state.factories;
        },

        selectedfactory(state) {
            return state.selectedfactory;
        },

        shops(state) {
            return state.shops;
        },

        selectedshops(state) {
            return state.selectedshops;
        },
        activeshop(state) {
            return state.activeshop;
        },

        showCharts(state) {
            return state.showCharts;
        },

        selectChart(state) {
            return state.selectChart;
        },

        arrPoint(state) {
            return state.arrPoint;
        },

        currentArrPoint(state) {
            let arr = state.arrPoint.filter(item => item.machineid === state.selectChart);
            return arr;
        },
        lengthArrPoint(state, idx) {
            let arr = state.arrPoint.filter(item => item.machineid === state.selectChart);
            return arr.length;
        },

        basicData(state) {
            let arrayData = [];

            if (!state.basicData.length)
                return arrayData;

            arrayData = state.basicData.map((x) => x);
            arrayData.push(state.basicData[4].filter((item) => item[1] === "работает").map(function (item){
                return [item[0][0], item[0][1], 1, item[1], item[2]];
            }));
            arrayData.push(state.basicData[4].filter((item) => item[1] === "простой").map(function (item){
                return [item[0][0], item[0][1], 1, item[1], item[2]];
            }));

            arrayData.push(state.basicData[4].filter((item) => item[1] === "выключен").map(function (item){
                return [item[0][0], item[0][1], 1, item[1], item[2]];
            }));

            arrayData.push(state.basicData[4].filter((item) => item[1] === "авария").map(function (item){
                return [item[0][0], item[0][1], 1, item[1], item[2]];
            }));

            return arrayData;
        },

        basicOptions(state) {
            return state.basicOptions;
        },

        reason(state) {
            return state.reason;
        },

        timeStatus(state) {
            return state.timeStatus;
        },
    },
    mutations: {

        setLoader(state, loader) {
            state.loader = loader;
        },

        setChart(state, idx) {
            state.selectChart = idx;
        },

        nextChart(state) {

            if (state.selectChart < state.basicData.length - 1) {
                state.selectChart++
            } else {
                state.selectChart = 0
            }
        },
        prevChart(state) {

            if (state.selectChart > 0) {
                state.selectChart--
            } else {
                state.selectChart = state.basicData.length - 1
            }
        },

        setshowCharts(state, arr) {
            state.showCharts = arr.slice();
        },

        setSelectedfactory(state, factory) {
            state.selectedfactory = factory;
            // store.commit('setSelectedshops', idx);
        },

        setActiveshop(state, shop) {
            state.activeshop = shop;
        },

        setSelectedshops(state, idx) {
            let filterShops = state.shops.filter(function (item) {
                return item.factoryid == idx;
            });
            state.selectedshops = filterShops;
            state.activeshop = filterShops[0];
        },
        removePoint(state, point) {
            let indexPoint = state.arrPoint.findIndex(state => state.id == point.id);
            if (indexPoint !== -1) {
                state.arrPoint.splice(indexPoint, 1);
            }
        },
        addPoint(state, point) {

            let indexPoint = state.arrPoint.findIndex(state => state.id == point.id);
            if (indexPoint == -1) {
                state.arrPoint.push(point);
            }
        },
        clearData(state) {
            state.basicData = [];
        },
        loadData(state, data) {
            data.map((el,index) => {
                if(index < 4) {
                    el.map((item) => {
                        item[0] *= 1000;
                        return item;
                    })
                } else if(index === 4) {
                    el.map((item) => {
                        item[0][0] *= 1000;
                        item[0][1] *= 1000;
                        return item;
                    })
                }
                return el;
            });
            state.basicData = data;
        },
        loadBasicOptions(state, data) {
            state.basicOptions = data;
        },

        updateTimeStatus(state, payload) {
            state.timeStatus = payload;
        },

        updateReason(state, payload) {
            state.reason = payload;
        },

    },
    actions: {

        setLoader(store, loader) {
            store.commit('setLoader', loader);
        },

        setChart(store, idx) {
            store.commit('setChart', idx);
        },

        setshowCharts(store, arr) {
            store.commit('setshowCharts', arr);
        },

        setActiveshop(store, shop) {
            store.commit('setActiveshop', shop);
        },

        setSelectedshops(store, idx) {
            store.commit('setSelectedshops', idx);
        },

        setSelectedfactory(store, factory) {
            store.commit('setSelectedfactory', factory);
            store.commit('setSelectedshops', factory.factoryid);
        },
        nextChart(store) {
            store.commit('nextChart');
        },
        prevChart(store) {
            store.commit('prevChart');
        },
        addPoint(store, point) {
            store.commit('addPoint', point);
        },
        removePoint(store, point) {
            store.commit('removePoint', point);
        },
        loadBasicOptions(store) {
            let data = getBasicOptions();
            store.commit('loadBasicOptions', data);
        },
        async getTimeStatus(store, opt) {
            let data = await this.$axios.$get(`/api/time_status/${opt.id}/${opt.start}/${opt.end}`);
            store.commit('updateTimeStatus', data.timeStatus);
        },
        async getReason(store, opt) {
            let data = await this.$axios.$get(`/api/top_stop_line/${opt.id}/${opt.start}/${opt.end}`);
            store.commit('updateReason', data.reason);
        },
        async loadData(store, opt) {
            store.commit('setLoader', true);
            let data = await this.$axios.$get(`/api/basic_data/${opt.id}/${opt.start}/${opt.end}`);
            store.commit('loadData', data.basicData);
            store.commit('setLoader', false);
        },
    },
    strict: process.env.NODE_ENV !== 'production'
};

function getBasicOptions() {
    let basicOptions = {


        title: {
            text: "APQ"
        },
        titleOEE: {
            text: "OEE"
        },
        chart: {
            zoomType: 'x'
        },

        legend: {
            enabled: true,
            align: 'left',
            layout: 'proximate'
        },
        legendAll: {
            enabled: true,
            verticalAlign: 'top',

        },

        scrollbar: {
            enabled: false
        },
        yAxis: [
            {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 1,
                top: '20%',
                height: '18%',
                offset: 0,

                resize: {
                    enabled: true
                }

            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 1,
                top: '40%',
                height: '18%',
                offset: 0,

                resize: {
                    enabled: true
                }

            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 1,
                top: '60%',
                height: '18%',
                offset: 0,

                resize: {
                    enabled: true
                }

            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 2,
                top: '80%',
                height: '20%',
                offset: 0,

                resize: {
                    enabled: true
                }

            }],

        yAxisOne: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: ''
            },

            lineWidth: 1,
            max: 1,

            height: '78%',
            offset: 0,

            resize: {
                enabled: true
            }

        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: ''
            },

            lineWidth: 1,
            max: 2,
            top: '80%',
            height: '20%',
            offset: 0,

            resize: {
                enabled: true
            }

        }],

        yAxisAll: [
            {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 1,

                height: '78%',
                offset: 0,

                resize: {
                    enabled: true
                }

            },
            {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 1,

                height: '78%',
                offset: 0,

                resize: {
                    enabled: true
                }

            },
            {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 1,

                height: '78%',
                offset: 0,

                resize: {
                    enabled: true
                }

            },
            {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 1,

                height: '78%',
                offset: 0,

                resize: {
                    enabled: true
                }

            },
            {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },


                lineWidth: 1,
                max: 2,
                top: '80%',
                height: '20%',
                offset: 0,

                resize: {
                    enabled: true
                }
            },
            {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 2,
                top: '80%',
                height: '20%',
                offset: 0,

                resize: {
                    enabled: true
                }
            },
            {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 2,
                top: '80%',
                height: '20%',
                offset: 0,

                resize: {
                    enabled: true
                }
            },
            {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },

                lineWidth: 1,
                max: 2,
                top: '80%',
                height: '20%',
                offset: 0,

                resize: {
                    enabled: true
                }
            },
        ],

        navigator: {
            enabled: true
        },


        tooltip: {

            formatter: function () {

                return this.points.reduce(function (s, point) {
                    if (point.x2 === undefined) {
                        return s + '<br/>' + point.series.name + ': ' +
                            point.y;
                    } else {
                        return s + '<br/>' + point.series.name;
                    }
                }, '<b>' + this.x + '</b>');
            },

            shared: true,

        },

        xAxis: {
            type: 'datetime',
            minRange: 30000
        }
    };
    return basicOptions;

}