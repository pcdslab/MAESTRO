# MAESTRO
An interconnected set of open source machine-learning models for large-scale mass spectrometry based omics analysis.

## Windows

### Pre-requist:
```
python 3.10
CUDA Toolkit
```

If you have nvidia gpu, download the cuda toolkit from here https://developer.nvidia.com/cuda-downloads

To run on windows, go to https://github.com/pcdslab/MAESTRO/release, download the latest installer.exe

It will download the required packages and run the application.

If you face any bugs/issues please report the issues Thanks.


## Linux

Download installer.bin from release https://github.com/pcdslab/MAESTRO/release

Require Dependencies  >= Ubuntu 20.04 
```
sudo apt install build-essential fuse
```

Now Run the Installer
```
chmod +x installer.bin
./installer.bin
```

If you face any bugs/issues please report the issues Thanks.

## Setup ENV for Electron
```
nvm install 20
cd electron-app
npm install
```