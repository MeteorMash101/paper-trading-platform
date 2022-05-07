FROM node:alpine

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install application dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i
# add app
COPY . ./

#replacing urls to the cloud environment one
#https://stackoverflow.com/questions/11392478/how-to-replace-a-string-in-multiple-files-in-linux-command-line
WORKDIR /app/src
RUN grep -rli 'http://127.0.0.1:8000' * | xargs -i@ sed -i 's/http:\/\/127.0.0.1:8000/https:\/\/server-wulfngp7fq-uw.a.run.app/g' @
WORKDIR /app

# start app
CMD ["npm", "start"]
