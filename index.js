const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// add cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());

app.post('/update-json', (req, res) => {
    const { filename, updates } = req.body;
    if (!filename || !updates) {
        return res.status(400).json({ message: 'Filename and updates are required' });
    }
    if (!fs.existsSync(filename)) {
        return res.status(404).json({ message: `File not found: ${filename} at ${__dirname}` });
    }
    if (filename.includes('/')) {
        filename = path.basename(filename);
    }

    let rawdata = fs.readFileSync(filename);
    let data = JSON.parse(rawdata);

    data.forEach(entry => {
        updates.forEach(update => {
            const { key, value } = update;
            if (typeof entry[key] === 'number') {
                entry[key] = parseInt(value);
            } else if (typeof entry[key] === 'boolean') {
                entry[key] = (value === 'true');
            } else if (Array.isArray(entry[key])) {
                if (typeof entry[key][0] === 'object') {
                    entry[key].forEach((item, index) => {
                        Object.keys(item).forEach(itemKey => {
                            if (itemKey === key) {
                                item[itemKey] = value;
                            }
                        });
                    });
                } else {
                    entry[key] = entry[key].map(_ => {
                        return parseInt(value);
                    });
                }
            } else {
                entry[key] = value;
            }
        });
    });

    let updatedData = JSON.stringify(data, null, 2);
    const fields = updates.map(update => update.key);
    const newFile = `${filename.split('.')[0]}_${fields.join('_')}_Updated.json`;
    fs.writeFileSync(newFile, updatedData);

    res.json({ message: `Updated file: ${newFile} ` });
});

app.listen(3000, () => console.log('Server running on port 3000'));
