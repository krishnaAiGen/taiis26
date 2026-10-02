"""Add SS10–SS13 to specialSessions.json from prepared content."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
config_path = ROOT / "src" / "config" / "specialSessions.json"
data = json.loads(config_path.read_text(encoding="utf-8"))


def chair(name: str, aff: str) -> dict:
    return {"name": name, "affiliation": aff}


ccet = (
    "Department of Computer Science and Engineering, CCET, "
    "Panjab University, Sector 26, Chandigarh"
)
singh_kumar = [
    chair("Dr. Sunil K. Singh", ccet),
    chair("Dr. Sudhakar Kumar", ccet),
]

new_sessions = [
    {
        "code": "SS10",
        "title": "Special Session on Human-Centric AI for Cyber-Security, Digital Trust, and Online Safety",
        "aimAndScope": [
            "With the increasing use of artificial intelligence (AI) in digital platforms, social media, connected systems, and online services, there are emerging opportunities and challenges in the areas of cybersecurity, digital trust, privacy, misinformation, and user safety. A human-centric approach to artificial intelligence can serve as a vital path for the development of intelligent security systems that would consider the needs, values, behavior, privacy, transparency, and wellbeing of humans.",
            "This special session invites researchers, academicians, professionals, and practitioners to investigate the latest advancements in human-centric AI for cybersecurity, digital trust, and online safety. The focus is on AI methods to understand human behavior, detect social engineering and other types of online attacks, defend digital identity, increase privacy, counteract misinformation and harmful content, and enhance human–AI interactions. The session accepts theoretical investigations, intelligent models, frameworks, datasets, experiments, and practical applications related to secure and responsible AI-based digital environments, with special emphasis on explainability, fairness, privacy, accountability, user awareness, and responsible AI practices.",
        ],
        "topics": [
            "Human-Centric AI for Cybersecurity and Digital Trust",
            "AI for Online Safety, Harmful Content, and Cyber Abuse Detection",
            "AI-Based Detection of Phishing, Social Engineering, and Human-Centric Cyber Threats",
            "AI for Misinformation, Disinformation, Deepfake, and Synthetic Content Detection",
            "Explainable, Fair, Transparent, and Responsible AI for Digital Security",
            "AI for Digital Identity, Authentication, Privacy, and Trust Management",
            "Human–AI Interaction, User Behavior Analytics, and Cybersecurity Awareness",
            "Generative and Agentic AI for Safe, Secure, and Trustworthy Digital Environments",
        ],
        "chairs": singh_kumar,
    },
    {
        "code": "SS11",
        "title": "Special Session on AI for Threat Intelligence, Intrusion Detection, and Autonomous Cyber Defense",
        "aimAndScope": [
            "Cyber threats are becoming increasingly complex, sophisticated, and large in number, requiring intelligent security tools that can detect, analyze, and respond to such threats in real time. AI, ML, DL, and recent developments in agentic and generative AI technologies open avenues to create intelligent and autonomous cybersecurity systems.",
            "This special session convenes researchers, academicians, cybersecurity experts, and practitioners to showcase advances in AI-based threat intelligence, attack detection and prediction, automated response, and autonomous cyber defense, with focus on intelligent security methods that analyze heterogeneous security data continuously, identify new and evolving cyber threats, perform cyber risk assessment, and facilitate security decisions. Contributions on theory, new AI/ML models, security architecture designs, datasets, experimental evaluations, frameworks, and case studies are welcome, including work on trustworthiness, interpretability, privacy, robustness, scalability, and deployment of AI-based cybersecurity solutions across application domains.",
        ],
        "topics": [
            "AI and Machine Learning for Cybersecurity, Threat Intelligence, and Cyber Defense",
            "Intelligent Intrusion, Anomaly, and Zero-Day Threat Detection",
            "Deep Learning and Ensemble Learning for Malware, Ransomware, Botnet, and Phishing Detection",
            "Generative AI and Large Language Models for Cybersecurity and Threat Analysis",
            "Agentic and Multi-Agent AI for Autonomous Cyber Defense and Incident Response",
            "Explainable, Trustworthy, Privacy-Preserving, and Adversarial AI for Cybersecurity",
            "AI-Enabled Zero Trust Security and Continuous Trust Assessment",
            "AI-Driven Security for IoT, Edge–Cloud, Cyber-Physical, 5G/6G, and Critical Infrastructure Systems",
        ],
        "chairs": singh_kumar,
    },
    {
        "code": "SS12",
        "title": "Special Session on Secure Edge AI for Next-Generation IoT Devices and Intelligent Networks",
        "aimAndScope": [
            "Due to the increased proliferation of Internet of Things (IoT) devices, edge computing, and intelligent networks, there is growing need for secure, reliable, and low-latency artificial intelligence (AI) at the edge. Conventional cloud-centric approaches face communication delay, limited bandwidth, security and privacy issues, and scalability limits, motivating Edge AI for timely, trustworthy decision making in connected environments.",
            "This special session provides a platform for academicians, researchers, industry professionals, and practitioners to share developments in Secure Edge AI for next-generation IoT devices and intelligent networks, emphasizing AI, ML, DL, and edge computing to create intelligent, adaptive, and trustworthy IoT ecosystems. Topics include secure AI on the edge, resource-aware intelligence, privacy-aware learning, federated AI, autonomous security mechanisms, and efficient edge–cloud collaboration. The session invites original research, architectures, algorithms, frameworks, datasets, experimental evaluations, and real-world applications that enhance security, reliability, energy efficiency, scalability, and trustworthiness across IoT, cyber-physical systems, smart cities, industrial automation, healthcare, and intelligent networks.",
        ],
        "topics": [
            "Secure Edge AI Architectures for Next-Generation IoT Devices and Intelligent Networks",
            "Lightweight AI, TinyML, and Resource-Efficient Machine Learning for IoT Edge Devices",
            "AI-Based Security Monitoring, Intrusion Detection, and Anomaly Detection at the Edge",
            "Federated Learning, Privacy-Preserving AI, and Distributed Intelligence for Edge IoT",
            "Secure Edge Computing for Industrial IoT, Smart Cities, Healthcare, and Cyber-Physical Systems",
            "Trustworthy, Explainable, and Robust AI for Edge Intelligence Applications",
            "AI-Driven Resource Management, Computation Offloading, and Energy Optimization in Edge Networks",
            "Zero Trust Security, Adversarial Resilience, and Secure Communication for Edge-IoT Systems",
        ],
        "chairs": singh_kumar,
    },
    {
        "code": "SS13",
        "title": "Special Session on Human-Centered and Explainable AI for Personalized Adaptive Systems",
        "aimAndScope": [
            "Human-centered and explainable AI for personalized adaptive systems emphasizes intelligent personalization where systems dynamically respond to individual users by detecting needs, context, and preferences through understanding human behavior. The session spans XAI, generative AI, multimodal intelligence, AI agents, federated learning, edge computing, and digital twins to enable rights-aware, transparent, trustworthy, and responsible adaptive systems, with cross-domain applications in healthcare, education, smart cities, cybersecurity, autonomous systems, IoT, and Industry 5.0.",
            "This session is a forum for researchers, academicians, and industry practitioners to present advanced methodologies, intelligent architectures, and real-world applications of human-centered and explainable AI for personalized adaptive systems. It advocates interdisciplinary research combining XAI, generative AI, multimodal learning, AI agents, federated learning, edge intelligence, and digital twins with human–AI collaboration, investigating theoretical, methodological, and applied aspects of personalized, adaptive, explainable systems that learn with transparency, privacy, fairness, safety, and human control.",
        ],
        "topics": [
            "Adaptive Edge AI for Smart Healthcare, Autonomous Systems, and IoT",
            "Neuro-Symbolic and Responsible AI for Multidomain Decision Support",
            "Human-AI Collaboration for Personalized Smart Cities and Industry 5.0",
            "Digital Twins and Explainable AI for Personalized Adaptive Systems",
            "Explainable AI Agents for Cybersecurity and Smart Environments",
            "Explainable AI for Precision Agriculture and Environmental Sustainability",
            "Emotion-Aware and Explainable AI for Education and Mental-Wellness Applications",
            "Human-Centered AI for Autonomous Vehicles",
            "AI Agents for Personalized Healthcare, Education, and Smart-City Services",
            "Quantum-Assisted Explainable AI for Smart Healthcare and IoT",
        ],
        "chairs": [
            chair(
                "Dr. Prithi Samuel",
                "Associate Professor, Department of Computational Intelligence, School of Computing, SRM Institute of Science and Technology, Kattankulathur Campus, Chennai, India",
            ),
            chair(
                "Dr. Balamurugan Balusamy",
                "Professor and Chairperson, School of Engineering and IT, Manipal Academy of Higher Education, Dubai Campus, Dubai, UAE",
            ),
            chair(
                "Archana Pattabhi",
                "Enterprise Data, AI, Technology Executive, New York, USA",
            ),
        ],
    },
]

by_code = {s["code"]: s for s in data["sessions"]}
for session in new_sessions:
    by_code[session["code"]] = session

data["sessions"] = sorted(
    by_code.values(),
    key=lambda s: int(re.search(r"SS(\d+)", s["code"]).group(1)),
)

config_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("Updated:", [s["code"] for s in data["sessions"]])
