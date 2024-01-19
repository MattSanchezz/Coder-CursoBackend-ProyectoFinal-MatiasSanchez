import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Productos API', () => {
  it('Debería obtener todos los productos', async () => {
    const res = await chai.request(app).get('/api/productos');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').equal('Lista de productos obtenida exitosamente.');
    expect(res.body).to.have.property('products').that.is.an('array');
  });

  it('Debería obtener un producto por ID', async () => {
    const res = await chai.request(app).get('/api/productos/1');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status').equal('success');
    expect(res.body).to.have.property('message').equal('Product found.');
    expect(res.body).to.have.property('data').that.is.an('object');
  });

});
