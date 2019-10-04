if ($(docker images -q blog-env:latest) -eq '' ) {
    docker build C:\devel\mattdelsordo.github.io -f C:\devel\mattdelsordo.github.io\_docker\windows.Dockerfile -t blog-env:latest
}
docker run --rm -it -v C:\devel\mattdelsordo.github.io:C:\devel\mattdelsordo.github.io blog-env:latest
