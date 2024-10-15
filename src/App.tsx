import Plot from "react-plotly.js";
import utils, { StockData, StockOptions } from "./utils";

const oldPrices: StockData[] = [
  { date: "2024-10-07", price: 58000 },
  { date: "2024-10-08", price: 57300 },
  { date: "2024-10-09", price: 55900 },
  { date: "2024-10-10", price: 54900 },
  { date: "2024-10-11", price: 57800 },
  { date: "2024-10-12", price: 57900 },
  { date: "2024-10-13", price: 57700 },
];

const App = () => {
  const [drift, volatility] = utils.calculateDriftAndVolatility(oldPrices);

  const options: StockOptions = {
    initialPrice: 60254,
    drift: drift,
    volatility: volatility,
    timeHorizon: 1, // 1 an
    numberOfPaths: 100000,
    timeSteps: 365, // 252 jours de trading par an
  };

  const simulatedPaths = utils.simulateStockPrice(options);
  const finalValues = simulatedPaths.map((path) => path[path.length - 1]);

  return (
    <>
      {options.numberOfPaths * options.timeHorizon >= 1000000 && (
        <div className="bg-yellow-200 p-4 text-center">
          Caution, the number of simulations is high, this may take a while to
          load the plots !
        </div>
      )}
      <div className="mt-4">
        <h1 className="text-2xl font-bold text-center">
          Monte Carlo simulation of stock prices
        </h1>
        <p className="text-center">
          Initial price: {options.initialPrice}, Drift: {drift}, Volatility:{" "}
          {volatility}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 size-full [&>*]:mx-auto">
        <Plot
          data={[
            {
              x: Array.from(
                { length: options.timeSteps + 1 },
                (_, i) => (i * options.timeHorizon) / options.timeSteps
              ),
              y: simulatedPaths[0],
              type: "scatter",
              mode: "lines",
            },
          ]}
          layout={{
            title: "Monte Carlo simulation of stock prices",
            xaxis: { title: "Years" },
            yaxis: { title: "Prices" },
          }}
        />
        <Plot
          data={[
            {
              x: finalValues,
              type: "histogram",
            },
          ]}
          layout={{
            title: "Distribution of final values",
          }}
        />
      </div>
    </>
  );
};

export default App;
