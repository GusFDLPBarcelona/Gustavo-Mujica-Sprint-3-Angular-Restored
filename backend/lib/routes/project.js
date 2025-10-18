"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_1 = require("../controllers/project");
const router = (0, express_1.Router)();
router.get('/', project_1.getAllProjects);
router.get('/:id', project_1.getOneProject);
router.post('/', project_1.createProjectController);
router.put('/:id', project_1.updateProjectController);
router.delete('/:id', project_1.deleteProjectController);
exports.default = router;
//# sourceMappingURL=project.js.map