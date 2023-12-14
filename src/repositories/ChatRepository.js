class ChatRepository {
    constructor(chatManager) {
      this.chatManager = chatManager;
    }
  
    async guardarMensaje(usuario, mensaje) {
      try {
        const nuevoMensaje = await this.chatManager.guardarMensaje(usuario, mensaje);
        return nuevoMensaje;
      } catch (error) {
        throw new Error(`Error al guardar el mensaje: ${error.message}`);
      }
    }
  }
  
  export default ChatRepository;
  