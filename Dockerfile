FROM node:16

#Working Dir
WORKDIR /usr/src/app


# Copy Package Json Files
COPY package*.json ./

# Install Files
RUN npm install
RUN apt-get update || : && apt-get install vim -y

# Copy Source Files
COPY . .

#Install Python & Dependices
RUN apt-get update || : && apt-get install python -y
RUN apt-get update && apt-get install -y python3-pip
RUN pip3 install -r server/idCreator/requirements.txt


# Build
RUN npm run build:css

# Expose API
EXPOSE 3000

CMD ["node", "index.js"]