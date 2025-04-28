FROM node:20 AS build
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv
RUN python3 -m venv venv
RUN . venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt
CMD ["/bin/bash", "-c", ". venv/bin/activate && pnpm start"]