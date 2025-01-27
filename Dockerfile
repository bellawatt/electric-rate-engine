FROM node:22-slim

RUN useradd --user-group --system --create-home --home-dir /home/bellawatt --shell /bin/bash --no-log-init --uid 1001 bellawatt

USER bellawatt

WORKDIR /home/bellawatt/electric-rate-engine

COPY --chown=bellawatt package.json ./
COPY --chown=bellawatt package-lock.json ./

RUN npm install

COPY ./ ./

ENTRYPOINT ["npm", "run", "test"]