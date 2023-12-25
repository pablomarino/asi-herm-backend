FROM denoland/deno:alpine

WORKDIR /app

COPY . ./
COPY init-mongo.sh /etc/init.d/init-script.sh


EXPOSE 4000

CMD ["deno", "task", "start"]
