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

Route.post("/cliente/cadastro", "ClienteController.store");
Route.put("/cliente/editar", "ClienteController.update");
Route.put("/cliente/foto", "ClienteController.updatePhoto");

Route.get("/doacoes-pet", "DoacaoPetController.all");
Route.get("/doacoes-aquario", "DoacaoAquarioController.all");

Route.group(() => {
  Route.get("auth/me", "AuthController.me");

  Route.resource("/endereco", "EnderecosController").only([
    "store",
    "index",
    "update"
  ]);

  Route.post("/doacao/cadastro-aquario", "DoacaoAquarioController.store");
  Route.post("/doacao/cadastro-pet", "DoacaoPetController.store");
  Route.get("/doacao/lista-aquario", "DoacaoAquarioController.index");
  Route.get("/doacao/lista-pet", "DoacaoPetController.index");
  //Route.get("/pedidos", "PedidosController.index");
  //Route.get("/pedidos/:hash_id", "PedidosController.show");

 //Route.get("/estabelecimento/pedidos", "EstabelecimentosController.pedidos");
}).middleware("auth");