/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { StockHandler } from './app/stockHandler';
import { environment } from './environments/environment';


const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost'
  });

  server.method('getStockData', new StockHandler().fetchStock, {        
    cache: {            
      expiresIn: environment.expireTime,            
      generateTimeout: 2000        
    },        
    generateKey: (symbol, timePeriod) => symbol + '_' + timePeriod 
  });


  server.route({
    method: 'GET',        
    path: '/beta/stock/{symbol}/chart/{timePeriod}',        
    handler: async (req, reply) => {            
      const { symbol, timePeriod } = req.params;            
      const token = req.url.searchParams.get('token');            
      const response = await server.methods.getStockData(symbol, timePeriod, token);            
      return response;        
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
