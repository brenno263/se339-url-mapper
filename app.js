import express from 'express';
import { CosmosClient } from '@azure/cosmos';
import * as dotenv from 'dotenv';
dotenv.config();

import * as db from './db.js';

const container = await db.initialize('url_mapping', 'url_mapping_container');

let app = express();
app.use(express.json());

app.use(express.static('public'));

app.use('/store', async (req, res) => {
	console.log(req.body);
	if (!req.body || !req.body.slug || !req.body.dest) {
		res.end(JSON.stringify({ success: false }));
		return;
	}

	db.storeURL(container, req.body.slug, req.body.dest);

	res.end(JSON.stringify({ success: true }));
});

app.use('/resolve/:slug', async (req, res) => {
	console.log(`resolving: ${req.params.slug}`);
	const dest = await db.queryURL(container, req.params.slug);
	if (!dest) {
		res.status(404).end('Not Found.');
		return;
	}

	res.redirect(dest);
});

app.listen(process.env.PORT | '3000');
