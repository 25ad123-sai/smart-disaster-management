"""Download the official CrisisMMD v2.0 dataset.

The archive is large (~1.8 GB). It is downloaded only when this script is run.
"""
from pathlib import Path
from urllib.request import urlretrieve

URL = "https://crisisnlp.qcri.org/data/crisismmd/CrisisMMD_v2.0.tar.gz"
OUT = Path(__file__).resolve().parent / "CrisisMMD_v2.0.tar.gz"

print("Downloading CrisisMMD v2.0 (~1.8 GB)...")
print(f"Destination: {OUT}")
urlretrieve(URL, OUT)
print("Download complete.")
print("Extract with: tar -xzf CrisisMMD_v2.0.tar.gz")
