const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    try {
        const installFolderInput = await askQuestion('What is the folder name?\n');
        fs.mkdirSync(installFolderInput.trim(), { recursive: true });
        process.chdir(installFolderInput);
        console.log(`Folder created. Trying to install into: ${process.cwd()}\n`);

        execSync('npm init -y', { stdio: 'inherit' });
        console.log('npm init completed successfully.\n');

        await handleChoice();

        updatePackageJson();

        execSync('npm run make', { stdio: 'inherit' });

        console.log("\nYour shiny new app has been built. Let's test it");
        startApp();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            const file = fs.createWriteStream(filename); // Create a write stream
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
                console.log(`${filename} downloaded.`);
            });
        }).on('error', (error) => {
            console.error(`Error downloading ${filename}: ${error.message}`);
            fs.unlink(filename, () => {
                reject(error);
            });
        });
    });
}

async function handleChoice() {
    console.log("");

    const filesForChoice = [
        'index.html',
        'style.css',
        'index.js',
        'app.ico',
        'loading.gif',
        'flag.txt'
    ];

    const folderName = 'ElectronIC';
    const userLink = 'NA'; 

    await replaceLinkAndDownload(folderName, userLink, filesForChoice);
}

async function downloadFiles(folder, files) {
    const baseURLChoice3 = 'https://collectingflags.com/ElectronIC/';

    let baseURL;
    if (folder === 'ElectronIC') {
        baseURL = baseURLChoice3;
    } else {
        throw new Error('Invalid folder provided.');
    }

    try {
        await Promise.all(
            files.map(async (file) => {
                const url = `${baseURL}${file}`;
                await downloadFile(url, file);
            })
        );
    } catch (error) {
        throw new Error(`Error downloading files: ${error.message}`);
    }
}

async function replaceLinkAndDownload(folder, userLink, files) {
    try {
        await downloadFiles(folder, files);

        const htmlFilePath = `./${files[0]}`;
        const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf-8');
        const replacedContent = htmlContent.replace('http://127.0.0.1', userLink);
        await fs.promises.writeFile(htmlFilePath, replacedContent, 'utf-8');

        console.log('Link replaced in index.html. Continuing...');
        updatePackageJson();
    } catch (error) {
        console.error('Error replacing link and downloading files:', error);
    }
}

function updatePackageJson() {
    try {
        const packageJsonPath = 'package.json';
        let packageJson = {};

        if (fs.existsSync(packageJsonPath)) {
            const content = fs.readFileSync(packageJsonPath, 'utf8').trim();
            packageJson = content ? JSON.parse(content) : {};
        }

        packageJson.name = packageJson.name || "your-app-name";
        packageJson.version = "1.0.0";
        packageJson.main = "index.js";
        packageJson.scripts = {
            "start": "electron .",
            "test": "echo \"Error: no test specified\" && exit 1",
            "package": "electron-forge package",
            "make": "electron-forge make"
        };

        packageJson.author = "ItsSixtyN3in"; // Set author to 'ItsSixtyN3in'
        packageJson.description = "Electron Training Modules"; // Set description to 'Electron Training Modules'

        packageJson.license = "MIT";
        packageJson.devDependencies = {
            "@electron-forge/cli": "^7.0.0",
            "@electron-forge/maker-deb": "^7.0.0",
            "@electron-forge/maker-rpm": "^7.0.0",
            "@electron-forge/maker-squirrel": "^7.0.0",
            "@electron-forge/maker-zip": "^7.0.0",
            "@electron-forge/plugin-auto-unpack-natives": "^7.0.0",
            "electron": "^27.1.0"
        };
        packageJson.dependencies = {
            "electron-squirrel-startup": "^1.0.0"
        };

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('package.json updated successfully.\n');
        console.log('Attempting Electron install..\n');
        installElectron();
    } catch (error) {
        console.error('Error reading/writing package.json:', error);
    }
}

function installElectron() {
    try {
        execSync('npm install electron --save-dev', { stdio: 'inherit' });
        execSync('npm install --save-dev @electron-forge/cli', { stdio: 'inherit' });
        execSync('npx electron-forge import', { stdio: 'inherit' });
        //execSync('npm run make', { stdio: 'inherit' });
        
    } catch (error) {
        console.error('Error installing/running Electron:', error);
    }
}

function startApp() {
    console.log("\nExecutable Created!\nLaunching app test");
    execSync('npm run start', { stdio: 'inherit' });
}

main();
