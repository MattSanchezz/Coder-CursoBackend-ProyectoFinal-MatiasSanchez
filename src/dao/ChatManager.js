import { messagesModel } from "../dao/modelos/message.model.js";

function createMessageModel(data) {
  return new messagesModel(data);
}

class MessageDTO {
  constructor(user, message) {
    this.user = user;
    this.message = message;
  }
}

class ChatManager {
  async guardarMensaje(usuario, mensaje) {
    try {
      const messageDTO = new MessageDTO(usuario, mensaje);
      const nuevoMensaje = createMessageModel(messageDTO); 
      const mensajeGuardado = await nuevoMensaje.save();

      return mensajeGuardado;
    } catch (error) {
      throw new Error("Error al guardar el mensaje: " + error.message);
    }
  }
}

export default new ChatManager();