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
  Route.delete("/cliente/excluir", "ClienteController.delete");


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

  Route.put("/doacao/pet/foto/:id", "DoacaoPetController.updatePhoto");
  Route.put("/doacao/pet/editar/:id", "DoacaoPetController.update");

  Route.put("/doacao/aquario/foto/:id", "DoacaoAquarioController.updatePhoto");
  Route.put("/doacao/aquario/editar/:id", "DoacaoAquarioController.update");

  Route.get("/cliente/:id", "ClienteController.show");

  Route.get("/especie/:id", "EspecieController.show");
  Route.post("/especie/especieId", "EspecieController.especieId");

}).middleware("auth");