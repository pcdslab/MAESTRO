# MAESTRO
An interconnected set of open source machine-learning models for large-scale mass spectrometry based omics analysis.

## Setup ENV for SpeCollate
```
conda create -n specollate python=3.10 anaconda
conda activate specollate
python -m pip install -r SpeCollate/requirements.txt
```

## Setup ENV for Electron
```
nvm install 20
cd electron-app
npm install
```

## To Run We can just run installer.sh
chmod 600 installer.sh
./installer.sh