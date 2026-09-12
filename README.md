# Smart Disaster Management System (SDMS)

An integrated, connectivity-resilient platform designed to close the **"fragmentation gap"** identified in current disaster-management literature. Rather than isolating IoT, GIS, AI, Drones, and Cloud into disjointed technology silos, SDMS unifies them into a single cohesive pipeline built on an **offline-first, graceful degradation architecture**.

---

## 🏗️ 7-Layer Integrated Pipeline

| Layer | Functional Scope | Full Cloud (100 Mbps) | Degraded Tactical Mesh (2.4 kbps) | Islanded Edge (0 kbps) |
|---|---|---|---|---|
| **1. IoT Sensing** | Hydrological, seismic, atmospheric, and toxic gas telemetry | 1 Hz continuous telemetry streaming | Delta-compressed reporting (>5% variance) | Last-Known-Good (LKG) cache with staleness decay |
| **2. GIS Spatial** | Risk zoning, critical infrastructure mapping, population exposure | Cloud-rendered vector tiles & remote spatial queries | Vector polygon boundary overlays | Client-side AHP/TOPSIS Multi-Criteria Decision Model (MCDM) |
| **3. AI / ML Prediction** | Early warning hazard forecasting, damage assessment, XAI | Transformer hazard regression models | Quantized MobileNet neural networks | Physics-based rate-of-change prediction with feature attribution |
| **4. Misinformation** | Citizen report validation, rumor debunking, emergency queue | Deep NLP semantic analysis | Heuristic keyword & regex parser | Local IoT sensor ground-truth contradiction filter |
| **5. Drone Assessment** | Tactical UAV aerial search & rescue recon | 4K video uplink with cloud object segmentation | 16-byte GPS survivor coordinate packets | On-board YOLO-Nano edge CV (18ms latency) |
| **6. Citizen Assistance** | Conversational assistant, shelter locator, emergency alerts | Cloud AI assistant with cellular push alerts | SMS / low-data emergency guidance | Offline local rulebase & VHF/UHF tactical radio frequencies |
| **7. Cloud-Edge Coordination** | Multi-agency interoperability & distributed event logs | Real-time WebSocket synchronization | LoRa peer-to-peer mesh log replication | Append-only CRDT vector queue with automatic reconciliation |

---

## ⚡ Connectivity Resilience Architecture

### 1. The Fragmentation Gap
Prior disaster systems either assume perpetual broadband connectivity or operate in isolated domain silos (e.g. an AI hazard prediction algorithm that cannot cross-verify against real-time IoT sensors or drone footage). In catastrophic earthquakes and hurricanes, terrestrial cell towers and fiber backhauls are often the first infrastructure to fail.

### 2. The Graceful Degradation Engine
SDMS solves this by architecting every component as a pure state-driven module with three operating states:

- **Online (100 Mbps Broadband / 5G)**: Full bi-directional cloud streaming. Heavy neural networks, multi-agency WebSockets, and high-resolution imagery run at peak precision.
- **Degraded Tactical Mesh (2.4 kbps LoRaWAN)**: Heavy image and video uploads are suppressed. Telemetry is delta-compressed. Drone flights compress survivor detections into 16-byte GPS coordinate packets. Citizen messages run through low-bandwidth gateways.
- **Offline / Islanded Edge (0 kbps)**: Complete disconnection from external networks.
  - IoT nodes serve **Last-Known-Good (LKG)** telemetry with visual staleness counters.
  - GIS calculations and AHP/TOPSIS rankings execute locally in browser memory.
  - Aerial computer vision switches to an on-board **MobileNet/YOLO-Nano** model (18ms latency vs 420ms cloud latency).
  - All local human dispatches and citizen reports are appended to an **Edge Sync Queue**.
  - When connection is restored, the queue **automatically reconciles** without race conditions or data loss.

---

## 🚀 5-Step Guided Demonstration Scenario

1. **Step 1: Normal Operation Baseline**  
   All 7 layers synchronized with 100 Mbps cloud WAN. Sensors within safe baseline thresholds; drone streaming with full cloud vision AI.
2. **Step 2: Simulated Disaster Event**  
   A flash flood and tremors are triggered in the Canal Basin. Hydrological sensor `HYDRO-01` breaches the critical threshold (4.8m). The GIS MCDM ranking automatically elevates Canal Basin to Priority Rank #1. Emergency push broadcast is distributed.
3. **Step 3: Connectivity Loss (Degraded Mesh)**  
   Simulates backhaul tower loss. Bandwidth collapses to 2.4 kbps. The platform automatically activates degraded mode banners, throttles high-bandwidth video, and shifts to LoRa delta packets.
4. **Step 4: Degraded-Mode Fallback (Islanded Edge)**  
   Complete cellular blackout (0 kbps). Sensors transition to Last-Known-Good (LKG) cache. Drone recon switches to local edge inference. Citizen Assistant switches to offline rules & emergency radio frequencies. Offline actions accumulate in the local Edge Sync Queue.
5. **Step 5: Recovery & Auto-Reconciliation**  
   Cloud connectivity is restored. The platform automatically reconciles all queued local packets with the central cloud database and confirms multi-agency synchronization.
