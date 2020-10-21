(function() {
    const DatiProtezioneCivile = function () {
        this.urlNazionale = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json';
        this.urlProvince = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json';
        this.urlRegioni = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json';
        this.urlIss = 'https://raw.githubusercontent.com/lukezona/covid-19/master/json/iss-range-eta.json';
        this.urlTerapieIntensive = 'https://raw.githubusercontent.com/lukezona/covid-19/master/json/capienza-terapie-intensive.json';
        this.dati = {
            incrementali: {
                nazione: [],
                regioni: [],
                iss: [],
            },
            giornalieri: {
                nazione: [],
            },
            variazioni: {
                icu: [],
                ricoverati_con_sintomi: [],
            },
            capienza_terapie_intensive: {}
        };
        this.datasetOptions = {
            fill: false,
            pointHitRadius: 10,
            pointHoverRadius: 4,
            pointRadius: 0,
            tension: 0,
        };
        this.colors = {
            totali: '',
            positivi: '',
            guariti: '',
            deceduti: '',
            rianimazione: '',
            ricoverati: '',
            isolamento: '',
        };
    };

    /**
     * Initialize the component:
     * - get the color values
     * - get the data from the API
     */
    DatiProtezioneCivile.prototype.init = function () {
        try {
            this.getColors();
            this.updateDatiNazione();
            this.updateDatiRegioni();
            this.updateDatiIss();
            this.updateDatiTerapieIntensive();
        }
        catch (e) {
            console.error('Errore: ', e);
        }
    };

    /**
     * Get the color values from the CSS variables set in the style files
     */
    DatiProtezioneCivile.prototype.getColors = function () {
        const style = getComputedStyle(document.body);
        this.colors.totali = style.getPropertyValue('--color-totali');
        this.colors.positivi = style.getPropertyValue('--color-positivi');
        this.colors.deceduti = style.getPropertyValue('--color-deceduti');
        this.colors.guariti = style.getPropertyValue('--color-guariti');
        this.colors.rianimazione = style.getPropertyValue('--color-rianimazione');
        this.colors.isolamento = style.getPropertyValue('--color-isolamento');
        this.colors.ricoverati = style.getPropertyValue('--color-ricoverati');
    };

    /**
     * Get the national data from the API, then calls the functions
     * @todo: maybe create a callback function or something better to handle the post data received tasks
     */
    DatiProtezioneCivile.prototype.updateDatiNazione = function () {
        XHR.createAndSend('GET', this.urlNazionale, json => {
            this.dati.incrementali.nazione = JSON.parse(json.response);
            this.dati.incrementali.nazione.forEach( (el, i) => {
                this.dati.giornalieri.nazione[i] = {};
                this.dati.giornalieri.nazione[i].data = el.data;
                this.dati.giornalieri.nazione[i].stato = el.stato;
                this.dati.giornalieri.nazione[i].ricoverati_con_sintomi = el.ricoverati_con_sintomi - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].ricoverati_con_sintomi : 0);
                this.dati.giornalieri.nazione[i].terapia_intensiva = el.terapia_intensiva - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].terapia_intensiva : 0);
                this.dati.giornalieri.nazione[i].totale_ospedalizzati = el.totale_ospedalizzati - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].totale_ospedalizzati : 0);
                this.dati.giornalieri.nazione[i].isolamento_domiciliare = el.isolamento_domiciliare - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].isolamento_domiciliare : 0);
                this.dati.giornalieri.nazione[i].totale_positivi = el.totale_positivi - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].totale_positivi : 0);
                this.dati.giornalieri.nazione[i].variazione_totale_positivi = el.variazione_totale_positivi - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].variazione_totale_positivi : 0);
                this.dati.giornalieri.nazione[i].nuovi_positivi = el.nuovi_positivi - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].nuovi_positivi : 0);
                this.dati.giornalieri.nazione[i].dimessi_guariti = el.dimessi_guariti - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].dimessi_guariti : 0);
                this.dati.giornalieri.nazione[i].deceduti = el.deceduti - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].deceduti : 0);
                this.dati.giornalieri.nazione[i].totale_casi = el.totale_casi - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].totale_casi : 0);
                this.dati.giornalieri.nazione[i].casi_testati = el.casi_testati - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].casi_testati : 0);
                this.dati.giornalieri.nazione[i].casi_testati = this.dati.giornalieri.nazione[i].casi_testati > 900000 ? 0 : this.dati.giornalieri.nazione[i].casi_testati;
                this.dati.giornalieri.nazione[i].tamponi = el.tamponi - (this.dati.incrementali.nazione[i - 1] ? this.dati.incrementali.nazione[i - 1].tamponi : 0);
                this.dati.giornalieri.nazione[i].perc_positivi_su_tamponi = (this.dati.giornalieri.nazione[i].totale_casi / this.dati.giornalieri.nazione[i].tamponi * 100).toFixed(1);
                this.dati.giornalieri.nazione[i].perc_positivi_su_casi_testati = this.dati.giornalieri.nazione[i].casi_testati > 0 ? (this.dati.giornalieri.nazione[i].totale_casi / this.dati.giornalieri.nazione[i].casi_testati * 100).toFixed(1) : 0;
            });

            this.updateCards();
            this.renderIncrementali();
            this.renderIncrementaliTamponi();
            this.renderGiornalieri();
            this.renderTassoOspedalizzazione();
        });
    };
    
    /**
     * Get the regional data from the API, then calls the functions
     * @todo: maybe create a callback function or something better to handle the post data received tasks
     */
    DatiProtezioneCivile.prototype.updateDatiTerapieIntensive = function () {
        XHR.createAndSend('GET', this.urlTerapieIntensive, json => {
            this.dati.incrementali.capienza_terapie_intensive = JSON.parse(json.response);
            this.renderCaricoTerapiaIntensiva();
        });
    };

    /**
     * Get the national data from the API, then calls the functions
     * @todo: maybe create a callback function or something better to handle the post data received tasks
     */
    DatiProtezioneCivile.prototype.updateDatiIss = function () {
        XHR.createAndSend('GET', this.urlIss, json => {
            this.dati.incrementali.iss = JSON.parse(json.response);
            this.renderDecessiEta();
            this.renderLetalitaEta();
        });
    };

    /**
     * Get the national data from the API, then calls the functions
     * @todo: maybe create a callback function or something better to handle the post data received tasks
     */
    DatiProtezioneCivile.prototype.updateDatiRegioni = function () {
        XHR.createAndSend('GET', this.urlRegioni, json => {
            this.dati.capienza_terapie_intensive = JSON.parse(json.response);
            this.updateTableData();
        });
    };

    /**
     * Takes the raw data from the API and calculate the daily values from the cumulative ones
     * @todo
     */
    DatiProtezioneCivile.prototype.setLatestData = function () {
      // this.dati.nazione
    };

    /**
     * Updates the card values when the data is received
     */
    DatiProtezioneCivile.prototype.updateCards = function () {
        const totale = document.getElementById('totaleContagiati');
        const attuali = document.getElementById('attualiContagiati');
        const deceduti = document.getElementById('totaleDeceduti');
        const guariti = document.getElementById('totaleGuariti');
        const rianimazione = document.getElementById('attualiRianimazione');
        const ospedalizzati = document.getElementById('attualiOspedalizzati');
        const ricoverati_con_sintomi = document.getElementById('attualiRicoveratiSintomatici');


        // totale.innerText = this.dati.incrementali.nazione[this.dati.incrementali.nazione.length - 1]['totale_casi'];
        attuali.innerText = this.dati.incrementali.nazione[this.dati.incrementali.nazione.length - 1]['totale_positivi'];
        deceduti.innerText = this.dati.incrementali.nazione[this.dati.incrementali.nazione.length - 1]['deceduti'];
        // guariti.innerText = this.dati.incrementali.nazione[this.dati.incrementali.nazione.length - 1]['dimessi_guariti'];
        rianimazione.innerText = this.dati.incrementali.nazione[this.dati.incrementali.nazione.length - 1]['terapia_intensiva'];
        ricoverati_con_sintomi.innerText = this.dati.incrementali.nazione[this.dati.incrementali.nazione.length - 1]['ricoverati_con_sintomi'];

    };

    /**
     * Takes the raw data and format it for the ChartJS datasets
     * @param data: {Object} - the data object
     * @param field - the field key
     * @returns {{v: [], l: []}} - an object with the values (v) and labels (l)
     */
    DatiProtezioneCivile.prototype.formatData = function (data, value_field, label_field) {
        let labels = [];
        let values = [];
        const label = label_field ? label_field : 'data';
        data.forEach(e => {
            let l = label === 'data' ? moment(e[label]).format('DD MMM') : label;
            labels.push(l);
            values.push(e[value_field]);
        });
        return { l: labels, v: values };
    };

    /**
     * Takes the raw data and format it for the ChartJS datasets
     * @param data: {Object} - the data object
     * @returns {{v: [], l: []}} - an object with the values (v) and labels (l)
     */
    DatiProtezioneCivile.prototype.formatDataEta = function (data, field) {
        let labels = [];
        let values = [];
        data.forEach(e => {
            if ( e.label !== 'Totali') {
                labels.push(e.label);
                values.push(e[field]);
            }
        });
        return { l: labels, v: values };
    };

    /**
     * Render the line chart in the associated canvas using ChartJS
     * @param id: {String} - canvas ID
     * @param datasets: {Object} - array of dataset objects
     */
    DatiProtezioneCivile.prototype.renderBarChart = function (id, datasets, labels, scales) {
        const ctx = document.getElementById(id).getContext('2d');
        const default_scales = {
            xAxes: [{
                ticks: {
                    fontFamily: 'Roboto Condensed',
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontFamily: 'Roboto Condensed',
                }
            }],
        };
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                legend: {
                    display: false,
                },
                tooltips: {
                    custom: function ( tooltip ) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip');

                        if ( !tooltipEl ) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.classList.add('chartjs-tooltip');
                            tooltipEl.innerHTML = '<div id="chartjs-tooltip__table" class="flex flex-column"></div>';
                            this._chart.canvas.parentNode.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        if ( tooltip.opacity === 0 ) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        // Set caret Position
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if ( tooltip.yAlign ) {
                            tooltipEl.classList.add(tooltip.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }

                        function getBody( bodyItem ) {
                            return bodyItem.lines;
                        }

                        // Set Text
                        if ( tooltip.body ) {
                            var titleLines = tooltip.title || [];
                            var bodyLines = tooltip.body.map(getBody);

                            var innerHtml = '<div class="flex flex-row">';

                            titleLines.forEach(function ( title ) {
                                innerHtml += '<h4 class="chartjs-tooltip__title">' + title + '</h4>';
                            });
                            innerHtml += '</div><div class="flex flex-column">';

                            bodyLines.forEach(function ( body, i ) {
                                var colors = tooltip.labelColors[ i ];
                                var style = 'background:' + colors.backgroundColor;
                                var span = '<span class="chartjs-tooltip__color" style="' + style + '"></span>';
                                innerHtml += '<div class="chartjs-tooltip__item">' + span + '<span>' + body + '</span></div>';
                            });
                            innerHtml += '</div>';

                            var tableRoot = document.getElementById('chartjs-tooltip__table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        var positionY = this._chart.canvas.offsetTop;
                        var positionX = this._chart.canvas.offsetLeft;

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                    },
                    enabled: false,
                    mode: 'index',
                },
                scales: scales || default_scales,
            },
        });
        const myLegendContainer = document.getElementById(id + 'Legend');
        myLegendContainer.innerHTML = DatiProtezioneCivile.generateLegend(myChart);
        DatiProtezioneCivile.bindLegendItem(myChart, myLegendContainer)
    };

    /**
     * Render the line chart in the associated canvas using ChartJS
     * @param id: {String} - canvas ID
     * @param datasets: {Object} - array of dataset objects
     */
    DatiProtezioneCivile.prototype.renderLineChart = function (id, datasets, labels, scales) {
        const ctx = document.getElementById(id).getContext('2d');
        const default_scales = {
            xAxes: [{
                ticks: {
                    fontFamily: 'Roboto Condensed',
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontFamily: 'Roboto Condensed',
                }
            }],
        };
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                legend: {
                    display: false,
                },
                tooltips: {
                    custom: function ( tooltip ) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip');
    
                        if ( !tooltipEl ) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.classList.add('chartjs-tooltip');
                            tooltipEl.innerHTML = '<div id="chartjs-tooltip__table" class="flex flex-column"></div>';
                            this._chart.canvas.parentNode.appendChild(tooltipEl);
                        }
    
                        // Hide if no tooltip
                        if ( tooltip.opacity === 0 ) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }
    
                        // Set caret Position
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if ( tooltip.yAlign ) {
                            tooltipEl.classList.add(tooltip.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }
    
                        function getBody( bodyItem ) {
                            return bodyItem.lines;
                        }
    
                        // Set Text
                        if ( tooltip.body ) {
                            var titleLines = tooltip.title || [];
                            var bodyLines = tooltip.body.map(getBody);
    
                            var innerHtml = '<div class="flex flex-row">';
    
                            titleLines.forEach(function ( title ) {
                                innerHtml += '<h4 class="chartjs-tooltip__title">' + title + '</h4>';
                            });
                            innerHtml += '</div><div class="flex flex-column">';
    
                            bodyLines.forEach(function ( body, i ) {
                                var colors = tooltip.labelColors[ i ];
                                var style = 'background:' + colors.backgroundColor;
                                var span = '<span class="chartjs-tooltip__color" style="' + style + '"></span>';
                                innerHtml += '<div class="chartjs-tooltip__item">' + span + '<span>' + body + '</span></div>';
                            });
                            innerHtml += '</div>';
    
                            var tableRoot = document.getElementById('chartjs-tooltip__table');
                            tableRoot.innerHTML = innerHtml;
                        }
    
                        var positionY = this._chart.canvas.offsetTop;
                        var positionX = this._chart.canvas.offsetLeft;
    
                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                    },
                    enabled: false,
                    mode: 'index',
                },
                scales: scales || default_scales,
            },
        });
        const myLegendContainer = document.getElementById(id + 'Legend');
        myLegendContainer.innerHTML = DatiProtezioneCivile.generateLegend(myChart);
        DatiProtezioneCivile.bindLegendItem(myChart, myLegendContainer)
    };

    /**
     * Call the function to render the chart with the daily data
     * @param id: {String} - container ID
     */
    DatiProtezioneCivile.prototype.renderGiornalieri = function (id) {
        const containerId = id || 'giornalieriNazionali';
        const positivi = this.formatData(this.dati.giornalieri.nazione, 'totale_casi');
        const deceduti = this.formatData(this.dati.giornalieri.nazione, 'deceduti');
        const guariti = this.formatData(this.dati.giornalieri.nazione, 'dimessi_guariti');
        const terapia_intensiva = this.formatData(this.dati.giornalieri.nazione, 'terapia_intensiva');
        const ricoverati_con_sintomi = this.formatData(this.dati.giornalieri.nazione, 'ricoverati_con_sintomi');
        const datasets = [
            {
                backgroundColor: this.colors.ricoverati,
                data: ricoverati_con_sintomi.v,
                label: 'Ricoverati con sintomi',
            },
            {
                backgroundColor: this.colors.rianimazione,
                data: terapia_intensiva.v,
                label: 'Terapia intensiva',
            },
            {
                backgroundColor: this.colors.deceduti,
                data: deceduti.v,
                label: 'Deceduti',
            },
            {
                backgroundColor: this.colors.positivi,
                data: positivi.v,
                label: 'Nuovi positivi',
            },
        ];
        
        this.renderBarChart(containerId, datasets, positivi.l);
    };

    /**
     * Call the function to render the chart with the cumulative data
     * @param id: {String} - container ID
     */
    DatiProtezioneCivile.prototype.renderIncrementali = function (id) {
        const containerId = id || 'incrementaliNazionali';

        const totali = this.formatData(this.dati.incrementali.nazione, 'totale_casi');
        const positivi = this.formatData(this.dati.incrementali.nazione, 'totale_positivi');
        const deceduti = this.formatData(this.dati.incrementali.nazione, 'deceduti');
        const guariti = this.formatData(this.dati.incrementali.nazione, 'dimessi_guariti');
        const ricoverati_con_sintomi = this.formatData(this.dati.incrementali.nazione, 'ricoverati_con_sintomi');
        const terapia_intensiva = this.formatData(this.dati.incrementali.nazione, 'terapia_intensiva');

        const datasets = [
            Tools.mergeObject(this.datasetOptions, {
                label: 'Attualmente positivi',
                data: positivi.v,
                hidden: false,
                borderColor: this.colors.positivi,
                pointBackgroundColor: this.colors.positivi,
            }),
            Tools.mergeObject(this.datasetOptions, {
                label: 'Ricoverati con sintomi',
                data: ricoverati_con_sintomi.v,
                hidden: false,
                borderColor: this.colors.ricoverati,
                pointBackgroundColor: this.colors.ricoverati,
            }),
            Tools.mergeObject(this.datasetOptions, {
                label: 'Terapia intensiva',
                data: terapia_intensiva.v,
                hidden: false,
                borderColor: this.colors.rianimazione,
                pointBackgroundColor: this.colors.rianimazione,
            }),
            Tools.mergeObject(this.datasetOptions, {
                label: 'Deceduti',
                data: deceduti.v,
                hidden: true,
                borderColor: this.colors.deceduti,
                pointBackgroundColor: this.colors.deceduti,
            }),
        ];

        this.renderLineChart(containerId, datasets, positivi.l);
    };

    /**
     * Call the function to render the chart with the cumulative data relative to tests
     * @param id: {String} - container ID
     */
    DatiProtezioneCivile.prototype.renderIncrementaliTamponi = function (id) {
        const containerId = id || 'incrementaliTamponi';

        const tamponi = this.formatData(this.dati.giornalieri.nazione, 'tamponi');
        const casi_testati = this.formatData(this.dati.giornalieri.nazione, 'casi_testati');
        const totale_casi = this.formatData(this.dati.giornalieri.nazione, 'totale_casi');
        const perc_positivi_su_casi_testati = this.formatData(this.dati.giornalieri.nazione, 'perc_positivi_su_casi_testati');
        const perc_positivi_su_tamponi = this.formatData(this.dati.giornalieri.nazione, 'perc_positivi_su_tamponi');

        const scales = {
            xAxes: [{
                ticks: {
                    fontFamily: 'Roboto Condensed',
                }
            }],
            yAxes: [{
                id: 'A',
                type: 'linear',
                position: 'left',
                ticks: {
                    beginAtZero: true,
                    fontFamily: 'Roboto Condensed',
                }
              }, {
                id: 'B',
                type: 'linear',
                position: 'right',
                ticks: {
                    beginAtZero: true,
                    fontFamily: 'Roboto Condensed',
                }
              }]
        };

        const datasets = [
            Tools.mergeObject(this.datasetOptions, {
                label: 'Nuovi positivi su casi testati',
                data: perc_positivi_su_casi_testati.v,
                borderColor: this.colors.rianimazione,
                pointBackgroundColor: this.colors.rianimazione,
            }),
            Tools.mergeObject(this.datasetOptions, {
                label: 'Nuovi positivi su tamponi',
                data: perc_positivi_su_tamponi.v,
                borderColor: this.colors.positivi,
                pointBackgroundColor: this.colors.positivi,
            }),
        ];

        this.renderLineChart(containerId, datasets, tamponi.l);
    };

    /**
     * Call the function to render the chart with the regional pressure on the ICUs
     * @param id: {String} - container ID
     */
    DatiProtezioneCivile.prototype.renderCaricoTerapiaIntensiva = function (id) {
        const containerId = id || 'caricoTerapieIntensive';
        const capienza_massima = this.dati.capienza_terapie_intensive.nazionali;
        const capienza_terapie_intensive = this.formatData(this.dati.capienza_terapie_intensive.regioni, 'capienza', 'denominazione_regione');
        const datasets = [
            {
                backgroundColor: this.colors.positivi,
                data: capienza_terapie_intensive.v,
                label: 'Capienza terapie intensive',
            },
        ];
        
        this.renderBarChart(containerId, datasets, capienza_terapie_intensive.l);
    };

    /**
     * Call the function to render the chart with the cumulative data
     * @param id: {String} - container ID
     */
    DatiProtezioneCivile.prototype.renderIncrementaliTermine = function (id) {
        const containerId = id || 'incrementaliTerminali';

        const deceduti = this.formatData(this.dati.incrementali.nazione, 'deceduti');
        const guariti = this.formatData(this.dati.incrementali.nazione, 'dimessi_guariti');

        const datasets = [
            Tools.mergeObject(this.datasetOptions, {
                label: 'Guariti',
                data: guariti.v,
                borderColor: this.colors.guariti,
                pointBackgroundColor: this.colors.guariti,
            }),
            Tools.mergeObject(this.datasetOptions, {
                label: 'Deceduti',
                data: deceduti.v,
                borderColor: this.colors.deceduti,
                pointBackgroundColor: this.colors.deceduti,
            }),
        ];

        this.renderLineChart(containerId, datasets, deceduti.l);
    };

    /**
     * Call the function to render the chart with the cumulative hospitalization data
     * @param id: {String} - container ID
     * @todo: Move the doughnut chart generator function
     */
    DatiProtezioneCivile.prototype.renderTassoOspedalizzazione = function (id) {
        const containerId = id || 'tassoOspedalizzazione';
        const ctx = document.getElementById(containerId).getContext('2d');

        const ricoverati_con_sintomi = this.formatData(this.dati.incrementali.nazione, 'ricoverati_con_sintomi');
        const terapia_intensiva = this.formatData(this.dati.incrementali.nazione, 'terapia_intensiva');
        const deceduti = this.formatData(this.dati.incrementali.nazione, 'deceduti');
        const dimessi_guariti = this.formatData(this.dati.incrementali.nazione, 'dimessi_guariti');
        const isolamento_domiciliare = this.formatData(this.dati.incrementali.nazione, 'isolamento_domiciliare');

        const datasets = [
            {
                backgroundColor: [
                    this.colors.guariti,
                    this.colors.deceduti,
                    this.colors.rianimazione,
                    this.colors.ricoverati,
                    this.colors.isolamento,
                ],
                borderColor: [
                    this.colors.guariti,
                    this.colors.deceduti,
                    this.colors.rianimazione,
                    this.colors.ricoverati,
                    this.colors.isolamento,
                ],
                borderAlign: 'inner',
                borderWidth: 3,
                hoverBorderWidth: 999,
                hoverBorderColor: 'rgba(0,0,0,.25)',
                data: [
                    dimessi_guariti.v[dimessi_guariti.v.length - 1],
                    deceduti.v[deceduti.v.length - 1],
                    terapia_intensiva.v[terapia_intensiva.v.length - 1],
                    ricoverati_con_sintomi.v[ricoverati_con_sintomi.v.length - 1],
                    isolamento_domiciliare.v[isolamento_domiciliare.v.length - 1],
                ],
            },
        ];

        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    'Guariti',
                    'Deceduti',
                    'Terapia intensiva',
                    'Ricoverati con sintomi',
                    'Isolamento domiciliare',
                ],
                datasets: datasets,
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                            var total = meta.total;
                            var currentValue = dataset.data[tooltipItem.index];
                            var percentage = parseFloat((currentValue/total*100).toFixed(1));
                            return currentValue + ' (' + percentage + '%)';
                        },
                        title: function(tooltipItem, data) {
                            return data.labels[tooltipItem[0].index];
                        }
                    },
                    custom: function ( tooltip ) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip');

                        if ( !tooltipEl ) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.classList.add('chartjs-tooltip');
                            tooltipEl.innerHTML = '<div id="chartjs-tooltip__table" class="flex flex-column"></div>';
                            this._chart.canvas.parentNode.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        if ( tooltip.opacity === 0 ) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        // Set caret Position
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if ( tooltip.yAlign ) {
                            tooltipEl.classList.add(tooltip.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }

                        function getBody( bodyItem ) {
                            return bodyItem.lines;
                        }

                        // Set Text
                        if ( tooltip.body ) {
                            var titleLines = tooltip.title || [];
                            var bodyLines = tooltip.body.map(getBody);

                            var innerHtml = '<div class="flex flex-row">';

                            titleLines.forEach(function ( title ) {
                                innerHtml += '<h4 class="chartjs-tooltip__title">' + title + '</h4>';
                            });
                            innerHtml += '</div><div class="flex flex-column">';

                            bodyLines.forEach(function ( body, i ) {
                                var colors = tooltip.labelColors[ i ];
                                var style = 'background:' + colors.backgroundColor;
                                var span = '<span class="chartjs-tooltip__color" style="' + style + '"></span>';
                                innerHtml += '<div class="chartjs-tooltip__item">' + span + '<span>' + body + '</span></div>';
                            });
                            innerHtml += '</div>';

                            var tableRoot = document.getElementById('chartjs-tooltip__table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        var positionY = this._chart.canvas.offsetTop;
                        var positionX = this._chart.canvas.offsetLeft;

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                    },
                    enabled: false,
                },
                legend: {
                    display: false,
                },
            },
        });
        const myLegendContainer = document.getElementById(containerId + 'Legend');
        myLegendContainer.innerHTML = DatiProtezioneCivile.generateLegend(myChart);
        DatiProtezioneCivile.bindLegendItem(myChart, myLegendContainer)
    };

    /**
     * Call the function to render the chart with the daily data
     * @param id: {String} - container ID
     */
    DatiProtezioneCivile.prototype.renderDecessiEta = function (id) {
        const containerId = id || 'etaDescessi';
        const positivi = this.formatDataEta(this.dati.incrementali.iss[this.dati.incrementali.iss.length - 1].fasce, 'casi');
        const deceduti = this.formatDataEta(this.dati.incrementali.iss[this.dati.incrementali.iss.length - 1].fasce, 'deceduti');
        const datasets = [
            {
                backgroundColor: this.colors.positivi,
                data: positivi.v,
                label: 'Positivi',
            },
            {
                backgroundColor: this.colors.deceduti,
                data: deceduti.v,
                label: 'Decessi',
            },
        ];

        this.renderBarChart(containerId, datasets, deceduti.l);
    };

    /**
     * Call the function to render the chart with the daily data
     * @param id: {String} - container ID
     */
    DatiProtezioneCivile.prototype.renderLetalitaEta = function (id) {
        const containerId = id || 'etaLetalita';
        const letalita = this.formatDataEta(this.dati.incrementali.iss[this.dati.incrementali.iss.length - 1].fasce, 'letalita');
        const datasets = [
            {
                backgroundColor: this.colors.rianimazione,
                data: letalita.v,
                label: 'Letalità (%)',
            },
        ];

        this.renderBarChart(containerId, datasets, letalita.l);
    };

    /**
     * Call the function to render the chart with the gender data for the deaths
     * @param id: {String} - container ID
     * @todo: Move the doughnut chart generator function
     */
    DatiProtezioneCivile.prototype.renderDecessiGenere = function (id) {
        const containerId = id || 'genereDescessi';
        const ctx = document.getElementById(containerId).getContext('2d');

        const genere = this.formatData(this.dati.incrementali.iss, 'genere');

        const datasets = [
            {
                backgroundColor: [
                    this.colors.isolamento,
                    this.colors.deceduti,
                ],
                borderColor: [
                    this.colors.isolamento,
                    this.colors.deceduti,
                ],
                borderAlign: 'inner',
                borderWidth: 3,
                hoverBorderWidth: 999,
                hoverBorderColor: 'rgba(0,0,0,.25)',
                data: genere,
            },
        ];

        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    'Maschi',
                    'Femmine',
                ],
                datasets: datasets,
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                            var total = meta.total;
                            var currentValue = dataset.data[tooltipItem.index];
                            var percentage = parseFloat((currentValue/total*100).toFixed(1));
                            return currentValue + ' (' + percentage + '%)';
                        },
                        title: function(tooltipItem, data) {
                            return data.labels[tooltipItem[0].index];
                        }
                    },
                    custom: function ( tooltip ) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip');

                        if ( !tooltipEl ) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.classList.add('chartjs-tooltip');
                            tooltipEl.innerHTML = '<div id="chartjs-tooltip__table" class="flex flex-column"></div>';
                            this._chart.canvas.parentNode.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        if ( tooltip.opacity === 0 ) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        // Set caret Position
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if ( tooltip.yAlign ) {
                            tooltipEl.classList.add(tooltip.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }

                        function getBody( bodyItem ) {
                            return bodyItem.lines;
                        }

                        // Set Text
                        if ( tooltip.body ) {
                            var titleLines = tooltip.title || [];
                            var bodyLines = tooltip.body.map(getBody);

                            var innerHtml = '<div class="flex flex-row">';

                            titleLines.forEach(function ( title ) {
                                innerHtml += '<h4 class="chartjs-tooltip__title">' + title + '</h4>';
                            });
                            innerHtml += '</div><div class="flex flex-column">';

                            bodyLines.forEach(function ( body, i ) {
                                var colors = tooltip.labelColors[ i ];
                                var style = 'background:' + colors.backgroundColor;
                                var span = '<span class="chartjs-tooltip__color" style="' + style + '"></span>';
                                innerHtml += '<div class="chartjs-tooltip__item">' + span + '<span>' + body + '</span></div>';
                            });
                            innerHtml += '</div>';

                            var tableRoot = document.getElementById('chartjs-tooltip__table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        var positionY = this._chart.canvas.offsetTop;
                        var positionX = this._chart.canvas.offsetLeft;

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                    },
                    enabled: false,
                },
                legend: {
                    display: false,
                },
            },
        });
        const myLegendContainer = document.getElementById(containerId + 'Legend');
        myLegendContainer.innerHTML = DatiProtezioneCivile.generateLegend(myChart);
        DatiProtezioneCivile.bindLegendItem(myChart, myLegendContainer)
    };

    /**
     * Updates the data in the table
     * @param id: {String} - container ID
     * @todo: Move the doughnut chart generator function
     */
    DatiProtezioneCivile.prototype.updateTableData = function (id) {
        const containerId = id || 'tabellaRegioni';
        const table = document.getElementById(containerId);
        const rows = [...table.getElementsByClassName('int-table__row')];

        this.dati.incrementali.regioni.forEach( r => {
            if (r.data === this.dati.incrementali.regioni[this.dati.incrementali.regioni.length - 1].data) {
                let row = rows.filter( el => { return parseInt(el.dataset.regione) === parseInt(r.codice_regione) })[0];
                if (row) {
                    let cells = [...row.getElementsByClassName('int-table__cell')];
                    cells.forEach(c => {
                       c.innerText = r[c.dataset.field];
                    });
                }
            }
        });
        [...document.getElementsByClassName('int-table__cell--sort')].forEach(el => { if(el.dataset.defaultSort) { el.click(); el.click(); } });
    };

    /**
     * Generate a custom legend for the associated chart
     * @param chart: {Object} - a Chart object created with ChartJS
     * @returns {string} - the HTML to insert in the page
     */
    DatiProtezioneCivile.generateLegend = function (chart) {
        let html = '<ul class="chartjs-legend">';
        if (chart.config.type === 'doughnut' || chart.config.type === 'pie') {
            chart.data.labels.forEach((label, i) => {
                html = `${html}<li class="chartjs-legend__item" data-index="${i}"><span class="chartjs-legend__color" style="background-color: ${chart.data.datasets[0].backgroundColor[i]}"></span><span>${label}</span></li>`;
            });
        } else {
            chart.data.datasets.forEach((dataset, i) => {
                html = `${html}<li class="chartjs-legend__item ${dataset.hidden ? 'chartjs-legend__item--disabled' : null}" data-index="${i}"><span class="chartjs-legend__color" style="background-color: ${dataset.pointBackgroundColor || dataset.backgroundColor}"></span><span>${dataset.label}</span></li>`;
            });
        }

        html = `${html}</ul>`;
        return html;
    };

    /**
     * Binds each legend item to a function that enable/disable the data in the chart
     * @param chart: {Object} - a Chart object created with ChartJS
     * @param container: {DOM Element} - the container, needed to contain the action to the single chart
     */
    DatiProtezioneCivile.bindLegendItem = function (chart, container) {
        const items = [...container.getElementsByClassName(`chartjs-legend__item`)];
        items.forEach(i => {
            let field = (chart.config.type === 'doughnut' || chart.config.type === 'pie') ? chart.getDatasetMeta(0).data[i.dataset.index] : chart.getDatasetMeta(i.dataset.index);
            i.addEventListener('click', () => {
                Util.toggleClass(i, 'chartjs-legend__item--disabled', !field.hidden);
                field.hidden = !field.hidden;
                chart.update();
            });
        });

    };

    window.DatiProtezioneCivile = new DatiProtezioneCivile();
}());
