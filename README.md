# CrisisMMD dataset integration

This project is prepared to use **CrisisMMD v2.0**, a multimodal disaster dataset containing annotated tweets and images from seven major natural disasters.

Official source: https://crisisnlp.qcri.org/crisismmd

The official v2.0 archive is approximately 1.8 GB, so the full binary dataset is intentionally not bundled into this project ZIP. Run `python datasets/CrisisMMD/download_crisismmd.py` to download it from the official source.

Tasks available in CrisisMMD include:
- Informative vs. not informative
- Humanitarian categories
- Image damage severity: little/no damage, mild damage, severe damage

Citation:
Ferda Ofli, Firoj Alam, Muhammad Imran, "CrisisMMD: Multimodal Twitter Datasets from Natural Disasters," ICWSM 2018.

For the project's current prototype, this dataset is an external training/evaluation resource. The existing mock sensor data in `src/data/mockData.ts` remains separate from CrisisMMD.
