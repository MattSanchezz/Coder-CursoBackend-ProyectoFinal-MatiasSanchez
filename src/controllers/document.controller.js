import { usersManager } from "../managers/usersManager.js";
import { log } from "../logger.js";
import { uploader } from "../utils.js";

const documentUploader = uploader('documents');

class DocumentController {
  async uploadDocument(userId, files) {
    try {
      const user = await usersManager.findById(userId);
      if (user) {
        user.documents.push({
          name: files.fieldname,
          reference: `/uploads/documents/${files.filename}`,
        });
        await user.save();
      }

      log('INFO', `Documento cargado por el usuario ${userId}`);

      return { message: 'Documento cargado exitosamente.' };
    } catch (error) {
      throw error;
    }
  }
}
async function uploadDocument(req, res, next) {
    try {
      const userId = req.params.uid;
      const user = await usersManager.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      documentUploader.any()(req, res, async function (err) {
        if (err) {
          return res.status(500).json({ error: 'Error al subir documentos' });
        }
  
        user.documentsUploaded = true;
        await user.save();
  
        res.status(200).json({ message: 'Documentos subidos exitosamente' });
      });
    } catch (error) {
      next(error);
    }
  }

export const documentController = new DocumentController();
