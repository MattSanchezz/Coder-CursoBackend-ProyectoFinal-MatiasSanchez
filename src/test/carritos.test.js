import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Carritos API', () => {
  describe('GET /api/carritos/:id', () => {
    it('Debería obtener un carrito por su ID', async () => {
      const response = await chai.request(app).get('/api/carritos/1');
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('status').equal('success');
    });

    it('Debería devolver un error si el carrito no existe', async () => {
      const response = await chai.request(app).get('/api/carritos/999');
      expect(response).to.have.status(404);
    });
  });
});
