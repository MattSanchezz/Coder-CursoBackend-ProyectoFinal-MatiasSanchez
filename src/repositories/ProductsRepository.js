class UserRepository {
    constructor(usersManager) {
      this.usersManager = usersManager;
    }
  
    async findById(id) {
      try {
        const user = await this.usersManager.findById(id);
        return user;
      } catch (error) {
        throw new Error(`Error al obtener el usuario por ID: ${error.message}`);
      }
    }
  
    async findByEmail(email) {
      try {
        const user = await this.usersManager.findByEmail(email);
        return user;
      } catch (error) {
        throw new Error(`Error al obtener el usuario por correo electrónico: ${error.message}`);
      }
    }
  
    async createOne(obj) {
      try {
        const createdUser = await this.usersManager.createOne(obj);
        return createdUser;
      } catch (error) {
        throw new Error(`Error al crear un usuario: ${error.message}`);
      }
    }
  }
  
  export default UserRepository;
  
  