import re
from pathlib import Path

INDEX = Path(r"C:\Users\yiyub\Documents\Bruceliu.info\index.html")
text = INDEX.read_text(encoding="utf-8")

# 1) Typed strings (spinning titles)
new_typed = """<div id=\"typed-strings\">\n\t\t\t\t\t\t\t\t\t<p>Senior Business Analyst</p>\n\t\t\t\t\t\t\t\t\t<p>AI / NLP Engineer (Text Mining)</p>\n\t\t\t\t\t\t\t\t\t<p>Product & Innovation Strategist</p>\n\t\t\t\t\t\t\t\t\t<p>AI Product Lead</p>\n\t\t\t\t\t\t\t\t\t<p>UX Strategy & Digital Experience</p>\n\t\t\t\t\t\t\t\t\t<p>Data Science Lecturer</p>\n\t\t\t\t\t\t\t\t\t<p>Full‑Stack Developer (C# / Python / React)</p>\n\t\t\t\t\t\t\t\t</div>"""

text, n = re.subn(r"<div id=\"typed-strings\">.*?</div>", new_typed, text, flags=re.S)
assert n == 1, f"typed-strings replacement count={n}"

# 2) Skills list (subjective confidence, derived from doc matrix levels)
# Keep it concise: 12 skills.
skills = [
    ("UI / UX Design", 90),
    ("SQL", 85),
    ("C# / ASP.NET MVC", 90),
    ("Python", 90),
    ("JavaScript (React)", 85),
    ("HTML / CSS / Bootstrap", 90),
    ("NLP / Text Mining", 90),
    ("AI / ML (OpenAI / LM Studio)", 85),
    ("UML / BPMN / Visio", 90),
    ("MongoDB", 80),
    ("Flask", 80),
    ("Next.js", 75),
]

def skill_item(name: str, pct: int) -> str:
    return f"""\
\t\t\t\t\t<!-- Skill Item -->
\t\t\t\t\t<div class=\"skill-item\">
\t\t\t\t\t\t<div class=\"d-flex justify-content-between\">
\t\t\t\t\t\t\t<h5>{name}</h5>
\t\t\t\t\t\t\t<h5>{pct}%</h5>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"progress\" data-percent=\"{pct}%\">
\t\t\t\t\t\t\t<div class=\"progress-bar bar-null\" role=\"progressbar\" aria-valuenow=\"{pct}\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<!-- End Skill Item -->\n"""

new_skill_block = "".join(skill_item(nm, pct) for nm, pct in skills)

# Replace the entire skills items column content by anchoring between the opening of col-lg-6 (data-aos fade-left)
# and the closing </div> that ends that column. This is a bit heuristic; keep it tight.
pattern = r"(<div class=\"col-lg-6\" data-aos=\"fade-left\">)\s*.*?(\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</section>)"
# Too wide; instead replace between the comment markers inside that column.

# Find the first skill-item block and the last end marker before the column closes.
col_start = text.find('<div class="col-lg-6" data-aos="fade-left">')
assert col_start != -1
col_end = text.find('</div>', col_start)
# Not reliable; do a regex specifically within the Skill Area section.

skill_section = re.search(r"<!-- Start Skill Area -->.*?<!-- End Skill Area -->", text, flags=re.S)
assert skill_section, "Skill section not found"
sec = skill_section.group(0)

# Within skill section, replace only the right column's repeated skill-item blocks.
# Within skill section, replace the entire right column content (all skill-item blocks)
sec2, n2 = re.subn(
    r"(<div class=\"col-lg-6\" data-aos=\"fade-left\">)\s*[\s\S]*?(</div>\s*</div>\s*</div>\s*</section>)",
    lambda m: m.group(1) + "\n" + new_skill_block + "\n\t\t\t\t" + m.group(2),
    sec,
    flags=re.S,
)
assert n2 == 1, f"skill block replacement count={n2}"
text = text.replace(sec, sec2)

# 3) Role-based history section (replace existing four cards)
history_cards = [
    ("Developer & Business Analyst", "{type}Dev", "Jan 2020 – Current", "End-to-end SDLC across BA + development + delivery. Strong focus on systems analysis, workflow/process engineering, and building production software."),
    ("Senior Business Analyst (Serviced)", "Discovery", "May 2021 – Dec 2023", "Led complex enterprise initiatives (e.g., eBoarding) with heavy integration analysis, user journeys, user stories, and stakeholder alignment."),
    ("Data Science Lecturer", "Modul University of Vienna", "Sept 2023 – Current", "Teaching programming + knowledge extraction/modelling/visualisation; dashboarding with Power BI; web/app dev + AI integrations."),
    ("Co‑Founder & CTO", "PerspectiveMind AI", "Nov 2024 – Current", "Building proctored oral assessment platform using React/Flask, speech + vision models, Faster Whisper, ElevenLabs, WebRTC, Socket.IO."),
    ("Senior Business Analyst (Serviced)", "Discovery", "Jan 2024 – Oct 2025", "Authored deep functional specs and process maps (e.g., ILSA migration, Questionnaire Platform, Supplier Onboarding, Security SOPs)."),
    ("Business & Data Analyst", "Modul University of Vienna", "Jul 2025 – Current", "Built and operated PUMA: NextJS + IIS + OData + LM Studio (Gemma) document identifier + role-based permissions + CI/CD."),
]

def job_card(title, org, period, desc, icon="fa-briefcase"):
    return f"""\
\t\t\t\t<div class=\"col-lg-6\">\n\t\t\t\t\t<div class=\"single-job\">\n\t\t\t\t\t\t<div class=\"top-sec d-flex justify-content-between\">\n\t\t\t\t\t\t\t<div class=\"top-left\">\n\t\t\t\t\t\t\t\t<h4>{title}</h4>\n\t\t\t\t\t\t\t\t<p>{org} • {period}</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"top-right\"> <i class=\"fa {icon} fa-2x\"></i> </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"bottom-sec wow fadeIn\" data-wow-duration=\"2s\">{desc}</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"""

cards_html = "".join(
    job_card(t, o, p, d, icon=("fa-university" if "University" in o else "fa-briefcase"))
    for t, o, p, d in history_cards
)

hist = re.search(r"<!-- Start History Area -->.*?<!-- End History Area -->", text, flags=re.S)
assert hist, "History area not found"
hsec = hist.group(0)

# Replace inner <div class="row"> ... </div> containing job cards.
hsec2, n3 = re.subn(
    r"(<section class=\"job-area[\s\S]*?<div class=\"row\">)\s*(?:<div class=\"col-lg-6\">[\s\S]*?</div>\s*)+(</div>\s*</div>\s*</section>)",
    lambda m: m.group(1) + "\n" + cards_html + "\t\t\t</div>\n\t\t</div>\n\t</section>",
    hsec,
    flags=re.S,
)
assert n3 == 1, f"history cards replacement count={n3}"
text = text.replace(hsec, hsec2)

INDEX.write_text(text, encoding="utf-8")
print("OK: updated typed strings, skills, and history")
