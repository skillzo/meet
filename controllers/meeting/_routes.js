const express = require("express");
const meeting = require("./meeting");
const auth = require("../../middelwares/auth");

const router = express.Router();

router.post("/add", auth, meeting.add);
router.get("/", auth, meeting.index);
router.get("/:id", auth, meeting.view);
router.delete("/delete/:id", auth, meeting.deleteData);
router.put("/delete-many", auth, meeting.deleteMany);

module.exports = router;
