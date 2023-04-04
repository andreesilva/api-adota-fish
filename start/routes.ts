/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post("/login", "AuthController.login");
Route.post("/logout", "AuthController.logout");
Route.post("/forgot-password", "AuthController.forgotPassword");
Route.get("/verificacao-codigo/:id", "AuthController.verificationCode");
Route.put("/reset-password", "ClienteController.resetPassword");

Route.get("/estados", "EstadoController.index");
Route.get("/cidades", "CidadeController.index");
Route.get("/cidades/:id", "CidadeController.show");

Route.post("/cliente/cadastro", "ClienteController.store");
Route.put("/cliente/editar", "ClienteController.update");
Route.put("/cliente/foto", "ClienteController.updatePhoto");

Route.get("/doacoes-pet/:id", "DoacaoPetController.all");
Route.get("/doacoes-aquario/:id", "DoacaoAquarioController.all");

Route.post("/endereco", "EnderecosController.store");

Route.group(() => {
  Route.get("auth/me", "AuthController.me");
  Route.put("/cliente/senha", "ClienteController.updatePassword");

  Route.resource("/endereco", "EnderecosController").only([
    "index",
    "update"
  ]);

  Route.post("/doacao/cadastro-aquario", "DoacaoAquarioController.store");
  Route.post("/doacao/cadastro-pet", "DoacaoPetController.store");
  Route.get("/doacao/lista-aquario", "DoacaoAquarioController.index");
  Route.get("/doacao/lista-pet", "DoacaoPetController.index");
  Route.get("/doacao/aquario/:id", "DoacaoAquarioController.show");
  Route.get("/doacao/pet/:id", "DoacaoPetController.show");
  Route.put("/doacao/inativacao/aquario/:id", "DoacaoAquarioController.inactivate");
  Route.put("/doacao/ativacao/aquario/:id", "DoacaoAquarioController.activate");
  Route.put("/doacao/excluir/aquario/:id", "DoacaoAquarioController.delete");
  Route.put("/doacao/inativacao/pet/:id", "DoacaoPetController.inactivate");
  Route.put("/doacao/ativacao/pet/:id", "DoacaoPetController.activate");
  Route.put("/doacao/excluir/pet/:id", "DoacaoPetController.delete");

  Route.get("/cliente/:id", "ClienteController.show");

  Route.get("/especie/:id", "EspecieController.show");
  Route.post("/especie/especieId", "EspecieController.especieId");

}).middleware("auth");