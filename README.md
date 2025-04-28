# Instagram Downloader
A simple web application to download Instagram posts and videos.
## Features:
- **Easy To Use**: Easier gui without any distractions.
- **Fast**: Starts downloading immediatly without redirecting anywhere.
## Installation(With Docker):
1. Clone the repository:
```bash
git clone https://github.com/metharda/instagram-downloader
cd instagram-downloader
```
2. Build the app:
```bash
docker build -t your-app-name .
```
3. Run the app:
```bash
docker run --name your-app-name -p 3000:3000 -d your-app-name
```
## Installation(Without Docker):
1. Clone the repository:
```bash
git clone https://github.com/metharda/instagram-downloader
cd instagram-downloader
```  
2. Install packages and build project:
```bash
pnpm install
pnpm build
```
3. Start python virtual environment and install requirements:
```bash
python3 -m venv your-venv-name && . your-venv-name/bin/activate
pip3 install -r requirements.txt
```
### If you want to start development server, use:
```bash
pnpm install
pnpm dev
```
and start the virtual environment.
## License

This project is licensed under the MIT License.



