import { CosmosClient } from '@azure/cosmos';

export async function initialize(dbName, contName) {
	const db_key = process.env.COSMOS_KEY;
	const db_endpoint = process.env.COSMOS_ENDPOINT;

	const cosmosClient = new CosmosClient({
		endpoint: db_endpoint,
		key: db_key,
	});

	const { database } = await cosmosClient.databases.createIfNotExists({
		id: dbName,
	});
	console.log(`${database.id} database ready`);

	const { container } = await database.containers.createIfNotExists({
		id: contName,
	});
	console.log(`${container.id} container ready`);

	return container;
}

export async function storeURL(container, slug, dest) {
	const { resource } = await container.items.create({
		slug: slug,
		dest: dest,
	});
	console.log(`'${resource.slug}' inserted`);
}

export async function queryURL(container, slug) {
	const querySpec = {
		query: 'select * from url_mapping m where m.slug=@slug',
		parameters: [
			{
				name: '@slug',
				value: slug,
			},
		],
	};

	const feed = await container.items.query(querySpec).fetchAll();
	const item = feed.resources[0];

	if (!item || !item.dest) {
		return null;
	}

	return item.dest;
}
