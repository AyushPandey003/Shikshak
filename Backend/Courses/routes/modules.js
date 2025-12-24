import { Router } from "express";


import { createModule, editModule, getAllModules, deleteModule, addVideo, addNotes, deleteVideo, deleteNotes } from "../controllers/modules.controllers.js";

const router = Router();

router.post("/create_module", createModule);
router.post("/edit_module", editModule);
router.post("/get_all_module", getAllModules);
router.post("/delete_module", deleteModule);
router.post("/add_video", addVideo);
router.post("/add_notes", addNotes);
router.post("/delete_video", deleteVideo);
router.post("/delete_notes", deleteNotes);

export default router;

