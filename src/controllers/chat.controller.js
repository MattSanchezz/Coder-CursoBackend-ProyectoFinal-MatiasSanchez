import ChatManager from '../dao/ChatManager.js';

export const enviarMensaje = async (req, res) => {
  const { usuario, mensaje } = req.body;

  try {
    const mensajeGuardado = await ChatManager.guardarMensaje(usuario, mensaje);
    res.status(200).json({
      status: 'success',
      message: 'Mensaje guardado con éxito.',
      data: mensajeGuardado,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al guardar el mensaje.',
      data: error.message,
    });
  }
};

export const renderChatPage = async (req, res) => {
  try {
      const mensajes = await ChatManager.getMensajesRecientes();
      res.render('chat', { mensajes });
  } catch (error) {
      console.error('Error al renderizar la página de chat:', error);
      res.status(500).json({ error: 'Error interno del servidor al renderizar la página de chat' });
  }
};
