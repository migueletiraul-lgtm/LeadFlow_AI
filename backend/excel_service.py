from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Font

from backend.database import get_best_leads


EXPORT_FOLDER = Path("exports")
EXPORT_FOLDER.mkdir(exist_ok=True)


def export_best_leads_to_excel(limit: int = 100) -> str:
    leads = get_best_leads(limit=limit)

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Leads"

    headers = [
        "ID",
        "Empresa",
        "Nicho",
        "Cidade",
        "Estado",
        "Instagram",
        "Website",
        "WhatsApp",
        "Seguidores",
        "Nota Google",
        "Avaliações",
        "Lead Score",
        "Status",
    ]

    for column, header in enumerate(headers, start=1):
        cell = sheet.cell(row=1, column=column, value=header)
        cell.font = Font(bold=True)

    for row, lead in enumerate(leads, start=2):
        sheet.cell(row=row, column=1, value=lead.get("id"))
        sheet.cell(row=row, column=2, value=lead.get("name"))
        sheet.cell(row=row, column=3, value=lead.get("niche"))
        sheet.cell(row=row, column=4, value=lead.get("city"))
        sheet.cell(row=row, column=5, value=lead.get("state"))
        sheet.cell(row=row, column=6, value=lead.get("instagram"))
        sheet.cell(row=row, column=7, value=lead.get("website"))
        sheet.cell(row=row, column=8, value=lead.get("whatsapp"))
        sheet.cell(row=row, column=9, value=lead.get("followers"))
        sheet.cell(row=row, column=10, value=lead.get("google_rating"))
        sheet.cell(row=row, column=11, value=lead.get("google_reviews"))
        sheet.cell(row=row, column=12, value=lead.get("lead_score"))
        sheet.cell(row=row, column=13, value=lead.get("status"))

    sheet.freeze_panes = "A2"
    sheet.auto_filter.ref = sheet.dimensions

    file_path = EXPORT_FOLDER / "best_leads.xlsx"
    workbook.save(file_path)

    return str(file_path)