const MODEL = import.meta.env.VITE_MODEL
const CONFIG = import.meta.env.VITE_CONFIG

export const configBuilder = async (data: any) => {
  const config = `
[input]

spec_size : 80000 # The array size to store a spectrum.

charge : 8 # Max charge value to be used for training.

use_mods : False # Whether to use modifications or not (both training and database search).

num_mods: 5 # Max mods per peptide

num_species : 9 # Number of species the training dataset contains. Deprecated. will not have any effect.

master_port : 12345 # if you get an error that port is already in use change this value to anothe number.

############ DATABASE SEARCH PARAMETERS ############
[search]

# This is model will be loaded during search. It will be loaded from the models directory.
# 22 at the end is the epoch number. That's how the models are saved.
model_name : ${MODEL}

# absolute directory path with mgf file to be searched. files must have .mgf extension.
mgf_dir : ${data.mgf_dir}

# path where preprocessed mgf spectra from the above directory will be placed.
prep_dir : ${data.prep_dir}

# directory path containing peptide file obtained from OpenMS Digestor tool.
pep_dir : ${data.pep_dir}

# directory path where percolator input files will be placed.
# Use crux percolator tool to analyze these files.
out_pin_dir : ${data.out_pin_dir}

# Batch sizes for forward pass through the network. 
# These sizes have been tested for 12 GBs of GPU memory. 16384
spec_batch_size : ${data.spec_batch_size}
pep_batch_size : ${data.pep_batch_size}

# Batch size for database search. 1024 seems to work better.
search_spec_batch_size : ${data.search_spec_batch_size}

precursor_tolerance : ${data.precursor_tolerance} # Precursor tolerance to use during database search (Da or ppm)
precursor_tolerance_type : ${data.precursor_tolerance_type} # either ppm or Da

keep_psms : ${data.keep_psms} # Number of top scoring psms to keep

# Number of modified peptides to be generated to search against. 
# Different than the one in input section
num_mods : ${data.num_mods}

# charge filter for input spectra.
# Note that spectra with all charges will be searched against charge independent peptide embeddings.
charge: ${data.charge}

############ MACHINE LEARNING PARAMETERS ############
[ml]

# model will be stored by the this name in the /models directory.
model_name : training_model

batch_size : 1024

test_size : 0.2

pep_seq_len : 64

train_count : 0

snp_weight : 1

ce_weight : 0.001

mse_weight : 0.00001

dropout : 0.3

lr : 0.0001

weight_decay : 0.0001

epochs : 200

margin : 0.2

read_split_listing : False

############ DEFAULT VALUES ############
# DO NOT CHANGE
[default]
msp_file : /data/human_consensus_final_true_lib.msp
mgf_files : /data/
spec_size : 8000
charge : 2
use_mods : False
batch_size : 1024
`
  await window.electron.ipcRenderer.invoke('write-file', CONFIG, config)
}