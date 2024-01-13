"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Especie_1 = __importDefault(require("./Especie"));
class Pet extends Orm_1.BaseModel {
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Pet.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Pet.prototype, "foto", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Pet.prototype, "quantidade", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Pet.prototype, "observacao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Pet.prototype, "especie_id", void 0);
__decorate([
    (0, Orm_1.hasOne)(() => Especie_1.default, {
        foreignKey: "id",
        localKey: "especie_id",
    }),
    __metadata("design:type", Object)
], Pet.prototype, "especie", void 0);
exports.default = Pet;
//# sourceMappingURL=Pet.js.map