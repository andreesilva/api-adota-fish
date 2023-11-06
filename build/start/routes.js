"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/', async () => {
    return { hello: 'world' };
});
Route_1.default.post("/login", "AuthController.login");
Route_1.default.post("/logout", "AuthController.logout");
Route_1.default.post("/forgot-password", "AuthController.forgotPassword");
Route_1.default.get("/verificacao-codigo/:id", "AuthController.verificationCode");
Route_1.default.put("/reset-password", "ClienteController.resetPassword");
Route_1.default.get("/estados", "EstadoController.index");
Route_1.default.get("/cidades", "CidadeController.index");
Route_1.default.get("/cidades/:id", "CidadeController.show");
Route_1.default.post("/cliente/cadastro", "ClienteController.store");
Route_1.default.put("/cliente/editar", "ClienteController.update");
Route_1.default.put("/cliente/foto", "ClienteController.updatePhoto");
Route_1.default.get("/doacoes-pet/:id", "DoacaoPetController.all");
Route_1.default.get("/doacoes-aquario/:id", "DoacaoAquarioController.all");
Route_1.default.post("/endereco", "EnderecosController.store");
Route_1.default.group(() => {
    Route_1.default.get("auth/me", "AuthController.me");
    Route_1.default.put("/cliente/senha", "ClienteController.updatePassword");
    Route_1.default.delete("/cliente/excluir", "ClienteController.delete");
    Route_1.default.resource("/endereco", "EnderecosController").only([
        "index",
        "update"
    ]);
    Route_1.default.post("/doacao/cadastro-aquario", "DoacaoAquarioController.store");
    Route_1.default.post("/doacao/cadastro-pet", "DoacaoPetController.store");
    Route_1.default.get("/doacao/lista-aquario", "DoacaoAquarioController.index");
    Route_1.default.get("/doacao/lista-pet", "DoacaoPetController.index");
    Route_1.default.get("/doacao/aquario/:id", "DoacaoAquarioController.show");
    Route_1.default.get("/doacao/pet/:id", "DoacaoPetController.show");
    Route_1.default.put("/doacao/inativacao/aquario/:id", "DoacaoAquarioController.inactivate");
    Route_1.default.put("/doacao/ativacao/aquario/:id", "DoacaoAquarioController.activate");
    Route_1.default.put("/doacao/excluir/aquario/:id", "DoacaoAquarioController.delete");
    Route_1.default.put("/doacao/inativacao/pet/:id", "DoacaoPetController.inactivate");
    Route_1.default.put("/doacao/ativacao/pet/:id", "DoacaoPetController.activate");
    Route_1.default.put("/doacao/excluir/pet/:id", "DoacaoPetController.delete");
    Route_1.default.put("/doacao/pet/foto/:id", "DoacaoPetController.updatePhoto");
    Route_1.default.put("/doacao/pet/editar/:id", "DoacaoPetController.update");
    Route_1.default.put("/doacao/aquario/foto/:id", "DoacaoAquarioController.updatePhoto");
    Route_1.default.put("/doacao/aquario/editar/:id", "DoacaoAquarioController.update");
    Route_1.default.get("/cliente/:id", "ClienteController.show");
    Route_1.default.get("/especie/:id", "EspecieController.show");
    Route_1.default.post("/especie/especieId", "EspecieController.especieId");
}).middleware("auth");
//# sourceMappingURL=routes.js.map