import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Sessions API', () => {
  describe('GET /api/sessions/current', () => {
    it('Debería devolver el usuario actual si está autenticado', async () => {
      const authenticatedUser = {  };

      const response = await chai.request(app)
        .get('/api/sessions/current')
        .set('Cookie', ['user=' + encodeURIComponent(JSON.stringify(authenticatedUser))]);

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('status').equal('success');
      expect(response.body.data).to.have.property('user').deep.equal(authenticatedUser);
    });

    it('Debería devolver un error si el usuario no está autenticado', async () => {
      const response = await chai.request(app)
        .get('/api/sessions/current');

      expect(response).to.have.status(401);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('status').equal('error');
      expect(response.body).to.have.property('message').equal('Usuario no autenticado');
    });
  });

});
