#!/bin/bash

MODEL_URL="https://github.com/pcdslab/ProteoRift/releases/download/V1.0.0/specollate_model_weights.pt"

echo "Installer Running"
path=$(pwd)

echo $path

mkdir models
mkdir .python

FILENAME=$(basename "$MODEL_URL")
DIRECTORY="./models"
FILEPATH="$DIRECTORY/$FILENAME"

# Check if the file already exists
if [ -f "$FILEPATH" ]; then
    echo "File $FILENAME already exists in $DIRECTORY."
else
    # Download the file
    echo "Downloading $FILENAME to $DIRECTORY..."
    wget "$MODEL_URL" -P "$DIRECTORY" 
fi

if [ -f $path/.python/bin/python3 ]; then 
    echo "Python Installed"
else
    wget https://www.python.org/ftp/python/3.10.14/Python-3.10.14.tgz -P ./.python

    cd $path/.python
    tar -xzf Python-3.10.14.tgz
    cd $path/.python/Python-3.10.14

    ./configure --prefix=$path/.python

    make -j$(nproc)
    make install
fi

PY_FILE=$path/.python/bin/python3

$PY_FILE -m pip install -r $path/SpeCollate/requirements.txt


ENV_DIR="$path/electron-app"

# Path to the .env file
ENV_FILE="$ENV_DIR/.env"

# Empty the .env file
if [ -f "$ENV_FILE" ]; then
    > "$ENV_FILE"
    echo "$ENV_FILE has been emptied."
else
    echo "No .env file to empty."
fi


echo "VITE_SPECOLLATE=\"$PY_FILE $path/SpeCollate/run_search.py\"" > "$ENV_FILE"
echo "VITE_MODEL=\"$path/models/specollate_model.pt\"" >> "$ENV_FILE"
echo "VITE_CONFIG=\"$path/electron-app/config.ini\"" >> "$ENV_FILE"

echo "Environment variables written to $ENV_FILE"

cd $path/electron-app
npm install
npm start