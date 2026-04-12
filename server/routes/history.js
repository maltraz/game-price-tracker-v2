const router = require("express").Router();
const tokenVerification = require("../middleware/tokenVerification");
const SearchHistory = require("../models/SearchHistory");

router.get("/", tokenVerification, async (req, res) => {
  try {
    const history = await SearchHistory.find({ userId: req.user._id }).sort({ searchedAt: -1 });
    res.status(200).send({ data: history });
  } catch (err) {
    res.status(500).send({ message: "Błąd serwera przy pobieraniu historii" });
  }
});

router.delete("/", tokenVerification, async (req, res) => {
  try {
    await SearchHistory.deleteMany({ userId: req.user._id });
    res.status(200).send({ message: "Historia została usunięta" });
  } catch (err) {
    res.status(500).send({ message: "Błąd serwera przy usuwaniu historii" });
  }
});

router.delete("/:id", tokenVerification, async (req, res) => {
  try {
    const entry = await SearchHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).send({ message: "Wpis nie znaleziony" });
    }

    res.status(200).send({ message: "Wpis został usunięty" });
  } catch (err) {
    res.status(500).send({ message: "Błąd przy usuwaniu wpisu" });
  }
});


module.exports = router;
