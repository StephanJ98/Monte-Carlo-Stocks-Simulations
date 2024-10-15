export interface StockOptions {
  initialPrice: number;
  drift: number;
  volatility: number;
  timeHorizon: number;
  numberOfPaths: number;
  timeSteps: number;
}

export interface StockData {
  date: string;
  price: number;
}

class Utils {
  generateBrownianMotion(timeStep: number): number {
    return Math.sqrt(timeStep) * Math.random();
  }

  simulateStockPrice(options: StockOptions): number[][] {
    const {
      initialPrice,
      drift,
      volatility,
      timeHorizon,
      numberOfPaths,
      timeSteps,
    } = options;
    const dt = timeHorizon / timeSteps;
    const paths: number[][] = [];

    for (let i = 0; i < numberOfPaths; i++) {
      const path: number[] = [initialPrice];
      for (let j = 1; j <= timeSteps; j++) {
        const Wt = this.generateBrownianMotion(dt);
        const St =
          path[j - 1] *
          Math.exp(
            (drift - 0.5 * volatility * volatility) * dt + volatility * Wt
          );
        path.push(St);
      }
      paths.push(path);
    }

    return paths;
  }

  calculateDriftAndVolatility(data: StockData[]): [number, number] {
    const logReturns = data.map((item, index) => {
      if (index === 0) return 0;
      return Math.log(item.price / data[index - 1].price);
    });

    const drift =
      logReturns.reduce((acc, curr) => acc + curr, 0) / logReturns.length;

    const volatility = Math.sqrt(
      logReturns.reduce((acc, curr) => acc + (curr - drift) ** 2, 0) /
        (logReturns.length - 1)
    );

    return [drift, volatility];
  }
}

export default new Utils();
