import os
import subprocess
import urllib.request
import tarfile
from pathlib import Path

MODEL_URL = "https://github.com/pcdslab/ProteoRift/releases/download/V1.0.0/specollate_model_weights.pt"

def run_command(command, cwd=None):
    process = subprocess.Popen(command, shell=True, cwd=cwd)
    process.communicate()

def download_file(url, directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
    filename = os.path.join(directory, os.path.basename(url))
    if os.path.exists(filename):
        print(f"File {os.path.basename(url)} already exists in {directory}.")
    else:
        print(f"Downloading {os.path.basename(url)} to {directory}...")
        urllib.request.urlretrieve(url, filename)
    return filename

def extract_tar_gz(tar_gz_path, extract_to):
    with tarfile.open(tar_gz_path, "r:gz") as tar:
        tar.extractall(path=extract_to)

def main():
    print("Installer Running")
    path = os.getcwd()
    print(path)

    # Create directories
    models_dir = Path(path) / "models"
    python_dir = Path(path) / ".python"
    models_dir.mkdir(exist_ok=True)
    python_dir.mkdir(exist_ok=True)

    # Copy SpeCollate to electron-app
    electron_app_dir = Path(path) / "electron-app"
    spe_collate_dest = Path(path) / "SpeCollate"
    
    if spe_collate_dest.exists():
        print("SpeCollate Exist")
    else:
        print("Specollate Doesn'g Exist")

    # Download the model file
    model_filepath = download_file(MODEL_URL, models_dir)

    # Install Python if not installed
    python_bin = python_dir / "bin/python3"
    if python_bin.exists():
        print("Python Installed")
    else:
        python_tar = download_file("https://www.python.org/ftp/python/3.10.14/Python-3.10.14.tgz", python_dir)
        extract_tar_gz(python_tar, python_dir)
        python_src_dir = python_dir / "Python-3.10.14"
        os.chdir(python_src_dir)
        run_command(f"./configure --prefix={python_dir}")
        run_command(f"make -j{os.cpu_count()}")
        run_command("make install")

    # Install dependencies
    run_command(f"{python_bin} -m pip install -r {spe_collate_dest}/requirements.txt")

    # Set up .env file
    env_file = electron_app_dir / ".env"
    if env_file.exists():
        env_file.write_text('')
        print(f"{env_file} has been emptied.")
    else:
        print("No .env file to empty.")

    with env_file.open("a") as f:
        f.write(f'VITE_SPECOLLATE="{python_bin} {spe_collate_dest}/run_search.py"\n')
        f.write(f'VITE_MODEL="{model_filepath}"\n')
        f.write(f'VITE_CONFIG="{Path(path)}/config.ini"\n')

    print(f"Environment variables written to {env_file}")

    # Install npm dependencies and start the Electron app
    os.chdir(electron_app_dir)
    run_command("/home/syntist/Documents/MAESTRO/electron-app/dist/electron-app-1.0.0.AppImage")

if __name__ == "__main__":
    main()
