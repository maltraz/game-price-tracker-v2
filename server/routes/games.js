const express = require("express");
const axios = require("axios");
const Game = require("../models/Game");
const tokenVerification = require("../middleware/tokenVerification");
const SearchHistory = require("../models/SearchHistory");

const router = express.Router();

router.get("/search", tokenVerification, async (req, res) => {
    const title = req.query.title;
    if (!title) return res.status(400).send({ message: "Brak tytułu gry" });

    await SearchHistory.create({ userId: req.user._id, title });

    try {
        const existing = await Game.find({ title: { $regex: title, $options: "i" } });
        if (existing.length > 0) return res.status(200).send(existing);

        const rawgRes = await axios.get(`https://api.rawg.io/api/games`, {
            params: {
                search: title,
                key: process.env.RAWG_KEY
            }
        });

        const result = rawgRes.data.results?.[0];
        if (!result) return res.status(404).send({ message: "Nie znaleziono gry" });

        const game = {
            rawgId: result.id,
            title: result.name,
            rating: result.rating,
            releaseDate: new Date(result.released),
            platforms: result.platforms?.map(p => p.platform.name).join(", "),
            backgroundImage: result.background_image,
            offers: []
        };

        const csRes = await axios.get(`https://www.cheapshark.com/api/1.0/deals`, {
            params: {
                title,
                pageSize: 15
            }
        });

        const offers = await Promise.all(csRes.data.map(async offer => {
            let backgroundImage = "";
            let rating = 0;

            try {
                const rawgOffer = await axios.get(`https://api.rawg.io/api/games`, {
                    params: {
                        search: offer.title || title,
                        key: process.env.RAWG_KEY
                    }
                });
                const matched = rawgOffer.data.results?.[0];
                backgroundImage = matched?.background_image || "";
                rating = matched?.rating || 0;
            } catch (err) {
                console.warn("Nie udało się pobrać danych RAWG dla oferty:", offer.title);
            }

            return {
                store: offer.storeID,
                price: parseFloat(offer.salePrice),
                discount: parseFloat(offer.savings),
                link: `https://www.cheapshark.com/redirect?dealID=${offer.dealID}`,
                internalName: offer.internalName,
                title: offer.title,
                normalPrice: parseFloat(offer.normalPrice),
                rating,
                backgroundImage
            };
        }));

        game.offers = offers;

        const saved = await Game.create(game);
        res.status(200).send([saved]);

    } catch (err) {
        console.error("Błąd serwera:", err.message);
        res.status(500).send({ message: "Błąd serwera podczas wyszukiwania gry" });
    }
});

module.exports = router;
