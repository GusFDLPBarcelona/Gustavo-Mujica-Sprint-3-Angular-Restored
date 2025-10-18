"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
router.get('/', product_controller_1.getAllProducts);
router.get('/:id', product_controller_1.getOneProduct);
router.post('/', product_controller_1.addProduct);
router.put('/:id', product_controller_1.modifyProduct);
router.delete('/:id', product_controller_1.deleteOneProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map