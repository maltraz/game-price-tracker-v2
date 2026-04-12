const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const tokenVerification = require("../middleware/tokenVerification");
const passwordComplexity = require("joi-password-complexity");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(409).send({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    await new User({ ...req.body, password: hashPassword }).save();

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/me", tokenVerification, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).send({ message: "Nie znaleziono użytkownika" });
    res.status(200).send({ user });
  } catch (err) {
    res.status(500).send({ message: "Błąd serwera przy pobieraniu danych użytkownika" });
  }
});

router.delete("/me", tokenVerification, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).send({ message: "Konto zostało usunięte" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/", tokenVerification, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).send({ data: users, message: "Lista użytkowników" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.put("/me", tokenVerification, async (req, res) => {
  try {
    const { firstName, lastName, email, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).send({ message: "Nie znaleziono użytkownika" });

    if (newPassword) {
      if (!oldPassword)
        return res.status(400).send({ message: "Podaj aktualne hasło" });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.status(401).send({ message: "Stare hasło jest nieprawidłowe" });

      const { error } = passwordComplexity().validate(newPassword);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      user.password = await bcrypt.hash(newPassword, salt);
    }

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.email = email ?? user.email;

    await user.save();
    res.status(200).send({ user: { firstName: user.firstName, lastName: user.lastName, email: user.email }, message: "Dane zaktualizowane" });
  } catch (err) {
    res.status(500).send({ message: "Błąd podczas aktualizacji danych" });
  }
});

router.delete("/:id", tokenVerification, async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user._id) {
      return res.status(400).send({ message: "Nie możesz usunąć samego siebie." });
    }

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).send({ message: "Nie znaleziono użytkownika" });
    }

    res.status(200).send({ message: "Użytkownik został usunięty" });
  } catch (error) {
    res.status(500).send({ message: "Błąd serwera przy usuwaniu użytkownika" });
  }
});

module.exports = router;