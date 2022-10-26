//==============================================================Pedir convite=====================================//
import express from "express";
import mongoose from "mongoose";
import Busboy from "busboy";
import bcrypt from "bcrypt";
import moment from "moment";

import aws from "../services/aws";

const router = express.Router();

router.post("/", asyncreq, (req, res) => {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on("finish", async () => {
    try {
      const userId = mongoose.Types.ObjectId();
      let photo = "";

      //Upload da imagem
      if (req.files) {
        const file = req.files.photo;

        const nameParts = file.name.split(".");
        const fileName = `${userId}_${nameParts[nameParts.lenght - 1]}`;

        photo = `user/${fileName}`;

        const response = await aws.uploadToS3(file, photo);

        if (response.error) {
          res.json({
            error: true,
            message: response.message,
          });
          return false;
        }
      }

      //Criação do Usuário
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  req.pipe(busboy);
});

export default router;
