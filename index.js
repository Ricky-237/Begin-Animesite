const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Définir l'URL et le script en dur
const url = "https://animesite.fr/";
const script = `
    return new Promise((resolve) => {
        setTimeout(function() {
            var div = document.querySelector('.flex.justify-center.items-center.w-auto.px-2'); // Sélectionne le premier div avec cette classe
            if (div) {
                div.click(); // Simule un clic
                setTimeout(function() {
                    console.log('div trouvée');
                    // Retourner une partie spécifique du DOM
                    var di = document.querySelector("body > div.grid.tablet\\:grid-cols-[auto,1fr] > main > div.-mt-[100px].tablet\\:-mt-[400px].laptop\\:-mt-[650px].desktop\\:-mt-[800px].transition-smooth.space-y-6.px-2.overflow-x-hidden.tablet\\:space-y-12.tablet\\:px-0.undefined > div");
                    resolve(di ? di.outerHTML : 'Div non trouvée.');
                }, 2000);
            } else {
                console.log('Div non trouvée.');
                resolve('Div non trouvée.');
            }
        }, 3000);
    });
`;

app.post('/execute-js', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(url);

        // Exécuter le script JavaScript sur la page
        const modifiedHTML = await page.evaluate(script);

        await browser.close();

        // Définir le type de contenu comme texte brut
        res.set('Content-Type', 'text/plain');
        // Retourner le HTML modifié en tant que texte brut
        res.send(modifiedHTML);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request');
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
