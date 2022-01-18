# NotionDB

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/andrewvo89/notiondb)
[![GitHub Issues](https://img.shields.io/github/issues/andrewvo89/notiondb)](https://github.com/andrewvo89/notiondb/issues)
[![GitHub Stars](https://img.shields.io/github/stars/andrewvo89/notiondb)](https://github.com/andrewvo89/notiondb/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/andrewvo89/notiondb/blob/main/LICENSE)

</div>

## 📝 Table of Contents

- [🧐 About](#-about)
- [⭐️ Features](#-features)
- [🏁 Getting Started](#-getting-started)
- [🎈 Usage](#-usage)
- [⛏️ Built Using](#️-built-using)
- [✍️ Authors](#️-authors)
- [🎉 Acknowledgments](#-acknowledgements)

## 🧐 About

NotionDB is an object modelling tool designed to interface with [Notion](https://www.notion.so/). It is a tool to allow developers to easily spin up a cloud based database using [Notion Databases](https://www.notion.so/Intro-to-databases-fd8cd2d212f74c50954c11086d85997e). Notion Databases consist of a series of Notion Pages (database rows) with various Properties (database columns).

NotionDB leverages off the official [Notion API](https://developers.notion.com/) and provides developers with easy to use classes and helper functions to easily retrieve, write, update and delete data.

**Why use Notion as a Database?**

- On top of the standard primitive types, Notion provides advanced types such as Dates with Time (start and end), People, URLs, Emails, Phone Numbers, Formulas, Relations, Rollups and more.
- Notion provides great facilities for Filtering (compound and/or filtering and nested filtering) and multi level Sorting. This makes querying and sorting through data seamless for developers.
- To visualize the data, the Notion user interface can display the database data in various views such as Table, Board, Timeline, Calendar, List and Gallery views.
- Being able to access and write data to a Notion Database from a server side environment opens up endless opportunities to interface Notion with other databases, services and APIs.

For any enquiries, email hello@andrewvo.co.

If you would like to donate to the project, you can buy me a coffee.

<a href="https://www.buymeacoffee.com/andrewvo" target="_blank"><img src="https://firebasestorage.googleapis.com/v0/b/tempnote-io.appspot.com/o/assets%2Fbmc-button.png?alt=media&token=284ab195-54bd-4d4f-b1ab-27e968c579fa" alt="Buy Me A Coffee" width=200px></a>

## ⭐️ Features

### Databases

- Get all Databases associated with an integration key.
- Get a single Database by Database ID or Database Notion URL.
- Create a Database using a Schema of Properties (column definitions).

### Pages

- Get all Pages from a Database.
- Get a single Page by Page ID or Page Notion URL.
- Filter down and Sort Pages from a Database using Notion's powerful Filter and Sort tools.
- Create a Page (a database row) inside a Database.
- Delete a Page from a Database.
- Restore a deleted Page from a Database.

### Blocks

- Get all supported children Blocks from a Page.

### Users

- Get all Users from a Database.
- Get a single User by User ID.

## 🏁 Getting Started

### Prerequisites

1. A Notion account. A free personal account will give you access to unlimited pages.
2. Create an integration key through My intgerations: https://www.notion.so/my-integrations.

<p align="center">
<img src="https://firebasestorage.googleapis.com/v0/b/andrewvo-co.appspot.com/o/notiondb%2F2ec137d-093ad49-create-integration.gif?alt=media&token=f950f2ba-0672-49d7-93b2-3bedbe7a5afa" alt="Integration Key">
</p>

3. Share a Databae with your integration.

<p align="center">
<img src="https://firebasestorage.googleapis.com/v0/b/andrewvo-co.appspot.com/o/notiondb%2F0a267dd-share-database-with-integration.gif?alt=media&token=7336cf03-de4e-4e7d-b38f-c9a5d75201cc" alt="Integration Key">
</p>

For more information on integrations, visit: https://developers.notion.com/docs.

### Installing

Install the package using npm:

```
npm install notiondb
```

Or with yarn:

```
yarn add notiondb
```

## 🎈 Usage

### Initialization

```javascript
const { NotionDB } = require('notiondb');

const integrationKey = process.env.NOTION_INTEGRATION_KEY;
const notionDB = new NotionDB(integrationKey);
```

### Databases

#### Get all Database references available from the integration.

```javascript
const databases = await notionDB.databases.getAll();
console.log(databases.map((d) => d.object));
```

#### Get a single Database reference using a Database ID or Database URL.

```javascript
const { NotionUrl, NotionUrlTypes, NotionId } = require('notiondb/models');

// Method 1 of Database lookup
const url = new NotionUrl(
  'https://www.notion.so/notion-user/9dbfa923a10242b8bdcb3158fa2fc54b?v=3caf278e48064aea87b9e0c849a5a6d9',
  NotionUrlTypes.DATABASE,
);
const database = await notionDB.databases.get(url);
console.log(database.object);

// Method 2 of Database lookup
const id = new NotionId('9dbfa923a10242b8bdcb3158fa2fc54b');
const database = await notionDB.databases.get(id);
console.log(database.object);
```

#### Create a new Database using a Schema. Databases must be created inside a Parent Page.

```javascript
const { PropertySchema, SchemaObject } = require('notiondb/schema');
const { NotionId } = require('notiondb/models');

const parentPageId = new NotionId('6dbfa957f10282b8cdcb3458fa2c54f');
const title = 'Orders';
const schemaObjects = [
  new SchemaObject('Order ID', 'title'),
  new SchemaObject('Date', 'date'),
  new SchemaObject('Product', 'select'),
  new SchemaObject('Price', 'number'),
  new SchemaObject('Quantity', 'select'),
];
// A schema takes an array of schema objects
const schema = new PropertySchema(schemaObjects);
const database = await notionDB.databases.create(parentPageId, title, schema);
console.log(database.object);
```

### Pages

#### Get all Pages from a Database.

```javascript
// Get an existing Database reference first
const pages = await database.pages.getAll();
console.log(pages.map((p) => p.object));
```

#### Get many Pages using Filters and Sorts from a Database.

```javascript
const {
  CompoundFilter,
  NumberFilter,
  SelectFilter,
} = require('notiondb/models/filter');
const { PropertySort, TimestampSort } = require('notiondb/models/sort');
const { PropertySchema, SchemaObject } = require('notiondb/schema');

/**
 * Filter by Price > 5
 * Sort by Price from highest to lowest
 */
const options = {
  filter: new NumberFilter('Price', 'greater_than', 5),
  sort: new PropertySort('Price', 'descending'),
};
const pages = await database.pages.getMany(options);
console.log(pages.map((p) => p.object));

/**
 * Filter by Price > 5 AND Product is Sunglasses
 * Sort by Last Edited Time, newest to oldest
 */
const priceFilter = new NumberFilter('Price', 'greater_than', 5);
const productFilter = new SelectFilter('Product', 'equals', 'Sunglasses');
const compoundFilter = new CompoundFilter([priceFilter, productFilter], 'and');

const options = {
  filter: compoundFilter,
  sort: new TimestampSort('last_edited_time', 'descending'),
};
const pages = await database.pages.getMany(options);
console.log(pages.map((p) => p.object));

/**
 * Filter by Price > 5 AND Product is Sunglasses
 * OR
 * Product is Reading Glasses
 * Sort by Last Edited Time, newest to oldest
 */
const priceFilter = new NumberFilter('Price', 'greater_than', 5);
const productFilter = new SelectFilter('Product', 'equals', 'Sunglasses');
const compoundFilter = new CompoundFilter([priceFilter, productFilter], 'and');
const readingGlassesFilter = new SelectFilter(
  'Product',
  'equals',
  'Reading Glasses',
);
const topLevelCompoundFilter = new CompoundFilter(
  [compoundFilter, readingGlassesFilter],
  'or',
);

const options = {
  filter: topLevelCompoundFilter,
};
const pages = await database.pages.getMany(options);
console.log(pages.map((p) => p.object));
```

#### Get a single Page using a Page ID or Page URL.

```javascript
// Method 1 of Page lookup
const { NotionId, NotionUrl, NotionUrlTypes } = require('notiondb/models');

const url = new NotionUrl(
  'https://www.notion.so/notion-user/My-First-Page-ec51a30420fe800db023d48671466f29',
  NotionUrlTypes.PAGE,
);
const page = await database.pages.get(url);
console.log(page.object);

// Method 2 of Page lookup (with excluded properties on result)
const id = new NotionId('ec51a30420fe800db023d48671466f29');
const excludeProperties = ['Price', 'Quantity'];
const page = await database.pages.get(id, excludeProperties);
console.log(page.object);
```

#### Create a new Page in an existing Database.

```javascript
// Get an existing Database reference first
const page = await database.pages.create({
  'Order ID': uuidv4(),
  Date: new Date(),
  Product: '3D Glasses',
  Price: 12.99,
  Quantity: 15,
});
console.log(page.object);
```

#### Create a new Page in an existing Database with additional options for Date.

```javascript
const startDate = new Date();
const endDate = new Date();
endDate.setDate(startDate.getDate() + 2);

// Get an existing Database reference first
const page = await database.pages.create({
  'Order ID': uuidv4(),
  Date: {
    value: startDate,
    options: {
      includeTime: true,
      timezone: 'Australia/Sydney',
      end: endDate,
    },
  },
  Product: '3D Glasses',
  Price: 12.99,
  Quantity: 15,
});
console.log(page.object);
```

#### Update an existing Page.

```javascript
const { NotionId } = require('notiondb/models');

// Update existing Page object retrieved from a previous Page get()
const updatedPage = await page.update({
  Price: 9.99,
  Product: 'Sunglasses',
});

// Use static update method to update blindly using a Notion ID or Notion URL
const id = new NotionId('ec51a30420fe800db023d48671466f29');
const updatedPage = await database.pages.update(id, {
  Price: 9.99,
  Product: 'Sunglasses',
});
```

#### Delete an existing Page.

```javascript
const { NotionId } = require('notiondb/models');

// Delete existing Page object retrieved from a previous Page get()
const deletedPage = await page.delete();

// Use static delete method to delete (archive) blindly using a Notion ID or Notion URL
const id = new NotionId('ec51a30420fe800db023d48671466f29');
const deletedPage = await database.pages.delete(id);
```

#### Restore a deleted Page.

```javascript
const { NotionId } = require('notiondb/models');

// Restore existing Page object retrieved from a previous Page get()
const restoredPage = await page.restore();

// Use static restore method to restore (unarchive) blindly using a Notion ID or Notion URL
const id = new NotionId('ec51a30420fe800db023d48671466f29');
const restoredPage = await database.pages.restore(id);
```

### Blocks

#### Get all children Blocks of a Page.

```javascript
// Get an existing Page reference first
const blocks = await page.blocks.getAll();
console.log(blocks.map((b) => b.object));
```

### Users

#### List all users from a Database.

```javascript
// Get an existing Database reference first
const users = await database.users.getAll();
console.log(users.map((u) => u.object));
```

#### Get a single User using a User ID.

```javascript
const { NotionId } = require('notiondb/models');

const id = new NotionId('193ead88-13c7-46ef-a6a2-62fa58234e7d');
const user = await database.users.get(id);
console.log(user.object);
```

## ⛏️ Built Using

- [Notion API](https://developers.notion.com/) - API Requests
- [Node.js](https://nodejs.org/en/) - Server Environment
- [TypeScript](https://www.typescriptlang.org/) - Language

## ✍️ Authors

- [@andrewvo89](https://github.com/andrewvo89) - Founder and creator

## 🎉 Acknowledgements

- [Notion](https://www.notion.so/) for their amazing product.
- [Mongoose](https://mongoosejs.com/) for concept inspiration.
