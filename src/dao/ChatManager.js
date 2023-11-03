import { messagesModel } from "../dao/modelos/message.model.js";

class ChatManager {
  async guardarMensaje(usuario, mensaje) {
    try {
      const nuevoMensaje = new messagesModel({
        user: usuario,
        message: mensaje,
      });

      const mensajeGuardado = await nuevoMensaje.save();

      return mensajeGuardado;
    } catch (error) {
      throw new Error("Error al guardar el mensaje: " + error.message);
    }
  }

}

export default new ChatManager();