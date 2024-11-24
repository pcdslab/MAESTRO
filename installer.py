import os
import subprocess
import tarfile
from pathlib import Path
import requests
import glob
from zipfile import ZipFile
import argparse
import platform
import venv
from tqdm import tqdm

MODEL_URL = "https://github.com/pcdslab/ProteoRift/releases/download/V1.0.0/specollate_model_weights.pt"
MODEL_2_URL = "https://github.com/pcdslab/ProteoRift/releases/download/V1.0.0/proteorift_model_weights.pt"

url = f'https://api.github.com/repos/pcdslab/MAESTRO/releases/latest'
response = requests.get(url)
tag_name = response.json()["tag_name"]

def check_for_electron_app():
    files = glob.glob("maestro*")
    return files

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
        
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()  # Check if the request was successful
            
            # Get the total file size from headers
            total_size = int(response.headers.get('content-length', 0))
            
            with open(filename, 'wb') as file, tqdm(
                desc=os.path.basename(url),
                total=total_size,
                unit='B',
                unit_scale=True,
                unit_divisor=1024,
            ) as bar:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
                    bar.update(len(chunk))  # Update the progress bar
            
            print(f"Download completed: {filename}")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
    
    return filename

def extract_tar_gz(tar_gz_path, extract_to):
    with tarfile.open(tar_gz_path, "r:gz") as tar:
        tar.extractall(path=extract_to)
        
def extract_zip(zip_path, extract_to):
    with ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)

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
    electron_app_dir = Path(path)
    spe_collate_dest = Path(path) / "SpeCollate"
    proteo_dest = Path(path) / "ProteoRift-GUI-version"
    app_name = ""

    if spe_collate_dest.exists():
        print("SpeCollate Exist")
    else:
        print("Specollate Doesn't Exist, Downloading")
        file = download_file(response.json()["zipball_url"], electron_app_dir)
        extract_zip(file, electron_app_dir)

        if(platform.system() == "Windows"):
            spec_dir = [d for d in os.listdir() if "-MAESTRO" in d][0]
            run_command(f"mkdir SpeCollate")

            os.chdir(spec_dir)
            
            run_command(f"xcopy /s /e SpeCollate {electron_app_dir}\SpeCollate")
            os.chdir("..")  # Go back to the parent directory
            run_command(f"del {file}")
            run_command(f"rmdir /S /Q {spec_dir}")
        else:
            run_command(f"cd *-MAESTRO* && cp -r SpeCollate {electron_app_dir}")
            run_command(f"rm -rf {file}")
            run_command(f"rm -rf *-MAESTRO*")

    if proteo_dest.exists():
        print("ProteoRift Exist")
    else:
        print("ProteoRift Doesn't Exist, Downloading")
        file = download_file("https://codeload.github.com/pcdslab/ProteoRift/zip/refs/heads/GUI-version", electron_app_dir)
        extract_zip(file, electron_app_dir)

        if(platform.system() == "Windows"):
            run_command(f"del {file}")
        else:
            run_command(f"rm -rf {file}")

    if(platform.system() == "Windows"):
        if(check_for_electron_app() and check_for_electron_app()[0] == "maestro-electron"):
            app_name = f"{check_for_electron_app()[0]}/maestro.exe"
        else:
            download_file(response.json()["assets"][3]["browser_download_url"], electron_app_dir)
            extract_zip(check_for_electron_app()[0], 'maestro-electron')
            run_command(f"del {check_for_electron_app()[0]}")
            app_name = f"{check_for_electron_app()[0]}/maestro.exe"

    else:
        if check_for_electron_app():
            app_name = check_for_electron_app()[0]
        else:
            download_file(response.json()["assets"][2]["browser_download_url"], electron_app_dir)
            app_name = check_for_electron_app()[0]
        
    # Download the model file
    model_filepath = download_file(MODEL_URL, models_dir)
    model_2_filepath = download_file(MODEL_2_URL, models_dir)


    # Define the directory where Python should be installed
    venv_path = Path(path) / ".venv"
    python_bin = python_dir / "bin/python3" if platform.system() != "Windows" else Path("py -3.10")

    # Check if Python is installed
    if platform.system() == "Windows":
        python_check_command = "py -3.10 --version"
    else:
        python_check_command = f"{python_bin} --version"

    try:
        if os.system(python_check_command) == 0:
            print("Python 3.10 Installed")
            if not venv_path.exists():
                venv.create(venv_path, with_pip=True)
            else:
                print("Virtual environment already exists.")
            python_bin = venv_path / "Scripts/python.exe"

        else:
            raise Exception("Python not found")
    except Exception:
        if platform.system() == "Windows":
            print("Python 3.10 not found. Please install it from https://www.python.org/downloads/")
        else:
            # Linux/macOS installation steps
            python_tar = download_file("https://www.python.org/ftp/python/3.10.14/Python-3.10.14.tgz", python_dir)
            extract_tar_gz(python_tar, python_dir)
            python_src_dir = python_dir / "Python-3.10.14"
            os.chdir(python_src_dir)
            run_command(f"./configure --prefix={python_dir}")
            run_command(f"make -j{os.cpu_count()}")
            run_command("make install")

    print("Installing PyTorch")
    run_command(f"{python_bin} -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121")

    # Install dependencies
    run_command(f"{python_bin} -m pip install -r {spe_collate_dest}/requirements.txt")

    # Set up .env file
    env_file = electron_app_dir / "env.json"
    if env_file.exists():
        env_file.write_text('')
        print(f"{env_file} has been emptied.")
    else:
        print("No .env file to empty.")

    with env_file.open("a") as f:
        f.write("{\n")
        f.write(f'"SPECOLLATE":"{Path(python_bin).as_posix()} {(Path(spe_collate_dest) / "run_search.py").as_posix()}",\n')
        f.write(f'"PROTEORIFT":"{Path(python_bin).as_posix()} {(Path(proteo_dest) / "run_search.py").as_posix()}",\n')
        f.write(f'"MODEL":"{Path(model_filepath).as_posix()}",\n')
        f.write(f'"MODEL_2":"{Path(model_2_filepath).as_posix()}",\n')
        f.write(f'"SPECOLLATE_CONFIG":"{(Path(path) / "config.ini").as_posix()}"\n')
        f.write("}")

    print(f"Environment variables written to {env_file}")

    # Install npm dependencies and start the Electron app
    os.chdir(electron_app_dir)

    parser = argparse.ArgumentParser(description="Script with --dev flag")
    parser.add_argument(
        '--dev', 
        action='store_true', 
        help='Run the script in development mode'
    )

    args = parser.parse_args()

    if args.dev:
        os.chdir(f"{electron_app_dir}/electron-app")
        run_command(f"npm run dev" )
    else:
        if(platform.system() != "Windows"):
            run_command(f"chmod +x {electron_app_dir}/{app_name}" )
        run_command(f"{electron_app_dir}/{app_name}")

if __name__ == "__main__":
    main()
