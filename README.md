# MAESTRO
An interconnected set of open source machine-learning models for large-scale mass spectrometry based omics analysis.

## Windows

### Pre-requist:
```
python 3.10
CUDA Toolkit
```

If you have nvidia gpu, download the cuda toolkit from here https://developer.nvidia.com/cuda-downloads

If you don't have python 3.10 you can download it from here, https://github.com/adang1345/PythonWindows/blob/master/3.10.14/python-3.10.14-amd64-full.exe

To run on windows,
1. Go to https://github.com/pcdslab/MAESTRO/releases, download the latest installer-win.zip
2. Extact the installer-win.zip.
3. Run installer.exe from the extracted folder
4. It will download the required packages and run the application.

If you face any bugs/issues please report the issues Thanks.


## Linux

Download installer.bin from release https://github.com/pcdslab/MAESTRO/releases

### Pre-requist:

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