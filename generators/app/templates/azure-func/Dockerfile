
# Docker file to create an image for Azure functions runtime.
FROM mcr.microsoft.com/azure-functions/node:2.0

# Establish root of the app.
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

# Copy the files to the www root.
COPY [ "dist", \
    "host.json", \
    "package.json", \
    "package-lock.json", \
    "/home/site/wwwroot/" ]

# Start the host.
RUN cd /home/site/wwwroot && npm install
