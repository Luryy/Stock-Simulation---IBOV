import React, { useState, ChangeEvent} from 'react';

import api from '../../services/api';

import './styles.css';

interface StockInput {
    symbol: string,
    dateNow: string,
    dateBefore: string
    
}

interface StockResult {
    symbol: string,
    priceBefore: string,
    priceNow: string,
    percent: string,
}


const Home = () => {

    const [stockInput, setStockInput] = useState<StockInput>({
        symbol: '',
        dateNow: (new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + new Date().getDate()), // current date
        dateBefore: ''    
    });

    const [stockResult, setStockResult] = useState<StockResult>();

    function handleStockInput(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setStockInput({...stockInput, [name]:value});
    }

    async function handleStockRequest(){

        const now = await api.get(`query?function=GLOBAL_QUOTE&symbol=${stockInput.symbol}.SAO&apikey=${process.env.APIKEY}`);
        const before = await api.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockInput.symbol}.SAO&apikey=${process.env.APIKEY}`);


        const stockRes: StockResult = {
            symbol: stockInput.symbol,
            priceBefore: parseFloat(String(Object.values(before.data['Time Series (Daily)'][stockInput.dateBefore])[0])).toFixed(2), //to get the price before -- complicate because of api
            priceNow: parseFloat(now.data['Global Quote']['05. price']).toFixed(2),
            percent: ((parseFloat(now.data['Global Quote']['05. price']) / parseFloat(String(Object.values(before.data['Time Series (Daily)'][stockInput.dateBefore])[0])) - 1 ) * 100).toFixed(2),
        }

            setStockResult(stockRes);
    }

    return(
        <div id="page-home">
            <div className="content">            

                
                <div className="container">
                    
                    <div className="middle">
                        <h1>STOCK SIMULATION</h1>
                        <div className="main">
                            <div className="inputStock">
                                <div className="field">
                                    <label htmlFor="stock">Ação</label>
                                    <input type="text" name="symbol" id="stock" onChange={handleStockInput}/>
                                </div>
                                <div className="field">
                                    <label htmlFor="name">Data</label>
                                    <input type="date" 
                                        max={stockInput.dateNow} // to get the current data
                                        name="dateBefore" id="stockDate" onChange={handleStockInput}
                                    />
                                </div>                                
                                <button onClick={handleStockRequest}>Calcular</button>
                            </div>
                            {stockResult?.symbol ?
                                (<div className="results">
                                    <h4>{stockResult.symbol.toLocaleUpperCase()}</h4>
                                    <div className="percent">
                                        <div className="arrowSvg">
                                            {parseFloat(stockResult.percent) > 0 ?
                                                <svg width="60%" height="100%" viewBox="0 0 16 16" className="bi bi-arrow-up-square-fill" fill="#0f0" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 8.354a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 6.207V11a.5.5 0 0 1-1 0V6.207L5.354 8.354z"/>
                                                </svg>
                                                :
                                                <svg width="60%" height="100%" viewBox="0 0 16 16" className="bi bi-arrow-down-square-fill" fill="#f00" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 5a.5.5 0 0 0-1 0v4.793L5.354 7.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.793V5z"/>
                                                </svg>
                                            }
                                        </div>

                                        <p> {parseFloat(stockResult.percent) > 0 ? '+' : ''}{stockResult.percent}%</p>
                                    </div>
                                    <div className="price">
                                        <div className="data">
                                            <p className="title" > Preço <br/> Anterior </p> 
                                            <p className="value">R$ {stockResult.priceBefore} </p>
                                        </div>
                                        <div className="data">
                                            <p className="title"> Preço <br/> Atual </p> 
                                            <p className="value">R$ {stockResult.priceNow}  </p>
                                        </div>
                                    </div>


                                </div>
                            ): ''}
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>
    )

};

export default Home;