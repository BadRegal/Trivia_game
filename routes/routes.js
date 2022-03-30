const express = require('express')
const fs = require('fs').promises
const { create_question, get_questions, shuffle } = require('../db.js')


const router = express.Router()

function protected_route (req, res, next) {
  if (!req.session.user) {
    // si quiere trabajar sin rutas prptegidas, comente la siguiente línea
    return res.redirect('/login')
  }
  next()
}

// RUTAS
router.get('/', protected_route, (req, res) => {
  res.render('index.html')
})

router.get('/agregar_preguntas', protected_route, async (req, res) => {
   res.render('agregar_preguntas.html')
})

router.post("/agregar_preguntas", async(req, res) => {
  let user_id = req.session.user.id;
  console.log(req.session.user.id);
  let pregunta = req.body.pregunta;
  let correcta = req.body.correcta;
  let incorrectaUno = req.body.incorrecta1;
  console.log(incorrectaUno)
  let incorrectaDos = req.body.incorrecta2;

  const create =  await create_question(user_id, pregunta, correcta, incorrectaUno, incorrectaDos);
 
  console.log(create);
  res.redirect("/agregar_preguntas");
});


router.get("/jugar", protected_route, async(req, res) => {
  let preguntas = await get_questions();
  console.log(preguntas);
  let nuevoObjeto = [];
  for (let pregunta of preguntas) {
      let array1 = [];
      let obj1 = {};
      // user_id, question, respCorrecta, respIncorrecta01, respIncorrecta02;
      array1.push(pregunta.resp01);
      array1.push(pregunta.resp02);
      array1.push(pregunta.resp03);
      shuffle(array1);
      obj1 = {
          id: pregunta.id,
          question: pregunta.question,
          p1: array1[0],
          p2: array1[1],
          p3: array1[2],
      };
      nuevoObjeto.push(obj1);
  }
  console.log(nuevoObjeto)
  res.render("jugar.html", { nuevoObjeto });
});

module.exports = router
