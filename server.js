const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Pour parser les données JSON dans les requêtes

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/gestion-objets", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((error) => console.error("Erreur de connexion MongoDB:", error));

// Définition du modèle Mongoose pour un objet
const itemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const Item = mongoose.model("Item", itemSchema);

// Routes pour l'API

// Récupérer tous les objets
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des objets" });
  }
});

// Ajouter un nouvel objet
app.post("/api/items", async (req, res) => {
  const { name, email } = req.body;
  const id = Math.floor(Math.random() * 10000); // Générer un ID aléatoire

  const newItem = new Item({ id, name, email });

  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de l'ajout de l'objet" });
  }
});

// Modifier un objet
app.put("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const updatedItem = await Item.findOneAndUpdate(
      { id: parseInt(id) },
      { name, email },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Objet non trouvé" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la modification de l'objet" });
  }
});

// Supprimer un objet
app.delete("/api/items/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Item.findOneAndDelete({ id: parseInt(id) });
    if (!deletedItem) {
      return res.status(404).json({ message: "Objet non trouvé" });
    }
    res.json({ message: "Objet supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'objet" });
  }
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
