const MODEL = await window.electron.getEnvVariable('MODEL')
const MODEL_2 = await window.electron.getEnvVariable('MODEL_2')
const CONFIG = await window.electron.getEnvVariable('SPECOLLATE_CONFIG')

const isWindows = await window.electron.isWindows()

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

export const configBuilderV2 = async (data: any) => {
  const config = `
[preprocess]

# For raptor
# in_tensor_dir : ./data/train-ready/pred-full/

# For comet
# in_tensor_dir : /scratch/mtari008/37154933/pred-full-deepnovo/

# For expanse
in_tensor_dir : /lclhome/mtari008/job_2436627/nist_massiv_80k_ch_graymass/

############ INPUT PARAMETERS ############
[input]

# file paths
mgf_dir : /lclhome/mtari008/data/spectra/labeled/fruitfly.PXD004120
prep_dir: sample_data/preprocess_files

; val_dir : /lclhome/mtari008/data/deepatles/train_ready/nist-masive-deepnovo-5k-ch1-3-len7-30-200-mod-mass

# The array size to store a spectrum.
spec_size : 50000

# Max charge value to be used to read spectrum files.
charge : 5

# Whether to use modifications or not.
use_mods : True

# Max mods per peptide
num_mods: 5

# Number of species the training dataset contains.
num_species : 9 

master_port : 12347

rank : 1

############ DATABASE SEARCH PARAMETERS ############
[search]

mgf_dir: ${data.mgf_dir}
prep_path: ${data.mgf_dir}${isWindows ? '\\preprocess' : '/preprocessed'}
pep_dir: ${data.pep_dir}
out_pin_dir : ${data.out_pin_dir}

model_name : ${isWindows ? MODEL_2?.replaceAll('/', '\\') : MODEL_2}
specollate_model_path: ${isWindows ? MODEL?.replaceAll('/', '\\') : MODEL}

# Batch sizes for forward pass through the network
spec_batch_size : ${data.spec_batch_size * 1024}
pep_batch_size : ${data.pep_batch_size * 1024}

# Batch size for database search
search_spec_batch_size : ${data.search_spec_batch_size * 1024}

precursor_tolerance : ${data.precursor_tolerance} # Precursor tolerance to use during database search (Da or ppm)
precursor_tolerance_type : ${data.precursor_tolerance_type} # either ppm or Da

keep_psms : ${data.keep_psms} # Number of top scoring psms to keep

# Number of modified peptides to be generated to search against. 
# Different than the one in input section
num_mods : ${data.num_mods}

# PTM Mods
ptm_mods: ${JSON.stringify(data.ptm_mods)}

charge: ${data.charge} # charge to be used during search

############ FILTERING PARAMETERS ############
[filter]
length_filter: ${data.length_filter ? 'True' : 'False'}
len_tol_neg: ${data.len_tol_neg}
len_tol_pos: ${data.len_tol_pos}
missed_cleavages_filter: ${data.missed_cleavages_filter ? 'True' : 'False'}
modification_filter: ${data.modification_filter ? 'True' : 'False'}

############### OUT OF CORE PARAMETERS ##############
[ooc]
chunk_size: 10000000

############ MACHINE LEARNING PARAMETERS ############
[ml]

batch_size : 1024

test_size : 0.2

max_spec_len : 200
min_pep_len: 7
max_pep_len : 30
# slightly larger than max_pep_len to account for modifications
pep_seq_len : 36
max_clvs : 2
embedding_dim : 1024
encoder_layers : 4
num_heads : 16

train_count : 0

ce_weight_clv : 1
ce_weight_mod : 1
mse_weight : 3

dropout : 0.3

lr : 0.0001

weight_decay : 0.0001

epochs : 5

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
