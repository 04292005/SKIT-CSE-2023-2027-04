import argparse
import datetime
import html
import io
import json
import os
import subprocess
from collections import defaultdict
from pathlib import Path

import matplotlib.pyplot as plt

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

# -------------------------------------------------------------
# CONFIGURATION: Institution & Department Details
# -------------------------------------------------------------
COLLEGE_NAME = "Swami Keshvanand Institute of Technology,Management & Gramothan, Jaipur"
DEPARTMENT_NAME = "Department of Computer Science & Engineering"
TEAM_DATA_DIR = Path("team_data")
DEFAULT_OUTPUT_DIR = Path("weekly_reports")

# These visual constants intentionally mirror the supplied Form-3 format.
# Do not change unless the reference design itself is being changed.


# -------------------------------------------------------------
# Repository information
# -------------------------------------------------------------
def get_repo_info():
    """Extract the repository name and current branch."""
    repo_name = "Project-Repository"
    branch_name = "main"

    try:
        root_path = subprocess.check_output(
            ["git", "rev-parse", "--show-toplevel"], encoding="utf-8"
        ).strip()
        repo_name = os.path.basename(root_path)
    except Exception:
        try:
            remote_url = subprocess.check_output(
                ["git", "config", "--get", "remote.origin.url"], encoding="utf-8"
            ).strip()
            repo_name = remote_url.rstrip("/").split("/")[-1].replace(".git", "")
        except Exception:
            repo_name = os.path.basename(os.getcwd())

    try:
        branch_name = subprocess.check_output(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"], encoding="utf-8"
        ).strip()
    except Exception:
        pass

    return repo_name, branch_name


# -------------------------------------------------------------
# Weekly data loading
# -------------------------------------------------------------
def current_week_id(report_date):
    return f"{report_date.isocalendar().year}-W{report_date.isocalendar().week:02d}"


def load_team_data(week_id):
    """
    Reads one JSON file per team member from team_data/.

    Expected shape:
    {
      "student_name": "Aaditya Bansal",
      "weeks": {
        "2026-W38": {
          "lines_added": 520,
          "lines_deleted": 35,
          "commit_logs": [
            {"date": "2026-09-15", "hash": "abc1234", "message": "..."}
          ]
        }
      }
    }
    """
    if not TEAM_DATA_DIR.exists():
        raise FileNotFoundError(
            f"Missing {TEAM_DATA_DIR}/ directory. Create it and add one JSON file per team member."
        )

    json_files = sorted(TEAM_DATA_DIR.glob("*.json"))
    if not json_files:
        raise FileNotFoundError(
            f"No JSON files found inside {TEAM_DATA_DIR}/."
        )

    students = {}
    timeline_activity = defaultdict(lambda: defaultdict(int))
    student_logs = defaultdict(list)
    report_metadata = {}

    for json_file in json_files:
        try:
            with json_file.open("r", encoding="utf-8") as f:
                payload = json.load(f)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON in {json_file}: {exc}") from exc

        student_name = str(payload.get("student_name", json_file.stem)).strip()
        weeks = payload.get("weeks", {})
        week_data = weeks.get(week_id, {}) if isinstance(weeks, dict) else {}
        if student_name == "Aaditya Bansal":
            report_metadata = {
                "form_number": int(week_data.get("form_number", 3) or 3),
                "evaluation_start": week_data.get("evaluation_start"),
                "evaluation_end": week_data.get("evaluation_end"),
                "generated_on": week_data.get("generated_on"),
            }

        form_number = int(week_data.get("form_number", 3) or 3)
        lines_added = int(week_data.get("lines_added", 0) or 0)
        lines_deleted = int(week_data.get("lines_deleted", 0) or 0)
        raw_logs = week_data.get("commit_logs", []) or []

        if not isinstance(raw_logs, list):
            raise ValueError(
                f"commit_logs must be a list in {json_file} for {week_id}."
            )

        logs = []
        active_days = set()

        for item in raw_logs:
            if not isinstance(item, dict):
                continue
            date_str = str(item.get("date", "")).strip()
            sha = str(item.get("hash", "")).strip()
            message = str(item.get("message", "")).strip()
            if not date_str or not message:
                continue

            logs.append((date_str, sha or "—", message))
            active_days.add(date_str)

            try:
                dt = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
                period_key = dt.strftime("%a (%b %d)")
                timeline_activity[period_key][student_name] += 1
            except ValueError:
                # Preserve the row in the report, but simply omit it from the graph timeline.
                pass

        if logs:
            students[student_name] = {
                "commits": len(logs),
                "added": lines_added,
                "deleted": lines_deleted,
                "active_days": active_days,
            }
            student_logs[student_name] = logs

    return students, timeline_activity, student_logs, report_metadata


# -------------------------------------------------------------
# Charts — same size/placement/style as the original format
# -------------------------------------------------------------
def create_charts(students, timeline_activity):
    """Generates the same two-panel visual workload/trend charts."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 3.8))
    authors = list(students.keys())
    periods = sorted(timeline_activity.keys())

    # 1. Timeline Line Chart
    if periods and authors:
        for author in authors:
            counts = [timeline_activity[p].get(author, 0) for p in periods]
            ax1.plot(periods, counts, marker="o", linewidth=2, label=author)
        ax1.set_title("Commit Timeline (Weekly)", fontsize=10, fontweight="bold")
        ax1.set_ylabel("Commits")
        ax1.tick_params(axis="x", rotation=30)
        ax1.grid(True, linestyle="--", alpha=0.5)
        ax1.legend(fontsize=8)
    else:
        ax1.text(0.5, 0.5, "No commits found in this interval", ha="center", va="center")

    # 2. Net LOC Bar Chart
    if authors:
        net_loc = [students[a]["added"] - students[a]["deleted"] for a in authors]
        colors_list = ["#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F"]
        bar_colors = [colors_list[i % len(colors_list)] for i in range(len(authors))]
        ax2.bar(authors, net_loc, color=bar_colors, width=0.45)
        ax2.set_title("Net Lines of Code Written", fontsize=10, fontweight="bold")
        ax2.set_ylabel("LOC (Added - Deleted)")
        ax2.grid(axis="y", linestyle="--", alpha=0.5)
    else:
        ax2.text(0.5, 0.5, "No LOC changes recorded", ha="center", va="center")

    plt.tight_layout()
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format="png", dpi=200)
    plt.close()
    img_buffer.seek(0)

    return Image(img_buffer, width=500, height=170)


# -------------------------------------------------------------
# PDF generation — design preserved from supplied code
# -------------------------------------------------------------
def generate_pdf(interval="weekly", week_id=None, report_date=None, output_dir=DEFAULT_OUTPUT_DIR):
    if interval != "weekly":
        raise ValueError("This version is designed for weekly reports.")

    report_date = report_date or datetime.date.today()
    week_id = week_id or current_week_id(report_date)

    repo_name, branch_name = get_repo_info()
    students, timeline_activity, student_logs, report_metadata = load_team_data(week_id)

    required_metadata = (
        "evaluation_start",
        "evaluation_end",
        "generated_on",
    )
    missing_metadata = [
        key for key in required_metadata
        if not report_metadata.get(key)
    ]
    if missing_metadata:
        raise ValueError(
            "Missing report metadata in team_data/Aaditya-Bansal.json "
            f"for {week_id}: {', '.join(missing_metadata)}"
        )

    evaluation_start = datetime.datetime.strptime(
        report_metadata["evaluation_start"], "%Y-%m-%d"
    ).date()

    evaluation_end = datetime.datetime.strptime(
        report_metadata["evaluation_end"], "%Y-%m-%d"
    ).date()

    generated_on = datetime.datetime.strptime(
        report_metadata["generated_on"], "%Y-%m-%d"
    ).date()

    form_number = int(report_metadata.get("form_number", 3) or 3)

    scope_title = (
        f"{evaluation_start.strftime('%d %b %Y')} – "
        f"{evaluation_end.strftime('%d %b %Y')}"
    )

    report_title = f"Weekly Progress Report (Form-{form_number})"

    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    date_stamp = generated_on.strftime("%Y-%m-%d")

    doc_name = output_dir / (
        f"{repo_name}_Weekly_Progress_Report_Form-{form_number}_{date_stamp}.pdf"
    )

    doc = SimpleDocTemplate(
        str(doc_name),
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=30,
        bottomMargin=30,
    )

    styles = getSampleStyleSheet()

    college_style = ParagraphStyle(
        "CollegeStyle", parent=styles["Heading1"],
        fontSize=13.5, leading=17, textColor=colors.HexColor("#0F172A"), alignment=1,
        spaceAfter=2
    )
    dept_style = ParagraphStyle(
        "DeptStyle", parent=styles["Normal"],
        fontSize=9.5, leading=13, textColor=colors.HexColor("#475569"), alignment=1, spaceAfter=6
    )
    title_style = ParagraphStyle(
        "TitleStyle", parent=styles["Heading2"],
        fontSize=13, leading=17, textColor=colors.HexColor("#1A365D"), alignment=1, spaceAfter=5
    )
    repo_style = ParagraphStyle(
        "RepoStyle", parent=styles["Normal"],
        fontSize=9.5, leading=14, textColor=colors.HexColor("#0F172A"), spaceAfter=3
    )
    meta_style = ParagraphStyle(
        "MetaStyle", parent=styles["Normal"],
        fontSize=8.5, textColor=colors.HexColor("#64748B"), spaceAfter=8
    )
    section_style = ParagraphStyle(
        "SectionStyle", parent=styles["Heading2"],
        fontSize=10.5, leading=14, textColor=colors.HexColor("#0F172A"), spaceBefore=7,
        spaceAfter=4
    )
    sub_section_style = ParagraphStyle(
        "SubSectionStyle", parent=styles["Heading3"],
        fontSize=9, leading=12, textColor=colors.HexColor("#2563EB"), spaceBefore=5,
        spaceAfter=2
    )
    msg_style = ParagraphStyle(
        "MsgStyle", parent=styles["Normal"],
        fontSize=8, leading=10, textColor=colors.HexColor("#1E293B")
    )
    meta_cell_style = ParagraphStyle(
        "MetaCellStyle", parent=styles["Normal"],
        fontSize=8, leading=10, textColor=colors.HexColor("#475569"), alignment=1
    )
    marks_style = ParagraphStyle(
        "MarksStyle", parent=styles["Normal"],
        fontSize=9, leading=12, textColor=colors.HexColor("#0F172A"), alignment=1
    )
    sig_block_style = ParagraphStyle(
        "SigBlockStyle", parent=styles["Normal"],
        fontSize=9, leading=15, textColor=colors.HexColor("#0F172A"), alignment=0
    )

    story = []

    # 1. Header with College & Department Name and Form-3 Title
    story.append(Paragraph(f"<b>{html.escape(COLLEGE_NAME)}</b>", college_style))
    story.append(Paragraph(f"<b>{html.escape(DEPARTMENT_NAME)}</b>", dept_style))
    story.append(Paragraph(f"<u><b>{report_title}</b></u>", title_style))
    story.append(Spacer(1, 3))

    # 2. Metadata (Repo, Branch, Scope, Date)
    story.append(
        Paragraph(
            f"<b>Project Repository:</b> <font color='#2563EB'><b>{html.escape(repo_name)}</b></font> "
            f"&nbsp;|&nbsp; <b>Branch:</b> <code>{html.escape(branch_name)}</code>",
            repo_style,
        )
    )
    story.append(
        Paragraph(
            f"<b>Evaluation Window:</b> {scope_title} &nbsp;|&nbsp; "
            f"<b>Generated On:</b> {generated_on.strftime('%B %d, %Y')}",
            meta_style,
        )
    )

    # 3. Individual Summary Table
    story.append(Paragraph("1. Individual Contribution Breakdown", section_style))
    total_commits = sum(data["commits"] for data in students.values())
    table_data = [["Student Name", "Commits (%)", "Lines Added", "Lines Deleted", "Net LOC", "Active Days"]]

    if students:
        for name, data in students.items():
            pct = (data["commits"] / total_commits * 100) if total_commits > 0 else 0
            net = data["added"] - data["deleted"]
            table_data.append([
                html.escape(name),
                f"{data['commits']} ({pct:.1f}%)",
                f"+{data['added']:,}",
                f"-{data['deleted']:,}",
                f"{net:,}",
                f"{len(data['active_days'])} days",
            ])
    else:
        table_data.append(["No team member JSON data found.", "-", "-", "-", "-", "-"])

    table = Table(table_data, colWidths=[120, 80, 80, 80, 80, 100])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E293B")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("ALIGN", (0, 1), (0, -1), "LEFT"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(table)
    story.append(Spacer(1, 6))

    # 4. Visual Charts
    story.append(Paragraph("2. Visual Trends & Volume", section_style))
    chart_image = create_charts(students, timeline_activity)
    story.append(chart_image)
    story.append(Spacer(1, 6))

    # 5. Detailed Commit Logs per Student WITH Vertically Merged Mentor Marks
    story.append(Paragraph("3. Detailed Commit Logs & Mentor Evaluation (Weekly)", section_style))

    for student_name, logs in student_logs.items():
        student_section = []
        student_section.append(
            Paragraph(
                f"<b>Student:</b> {html.escape(student_name)} — <i>{len(logs)} commit(s)</i>",
                sub_section_style,
            )
        )

        log_table_data = [["Date", "Hash", "Commit Message", "Mentor Marks (/10)"]]

        if logs:
            first_date, first_sha, first_msg = logs[0]
            safe_msg = html.escape(first_msg) if first_msg else "(No commit message)"
            log_table_data.append([
                Paragraph(first_date, meta_cell_style),
                Paragraph(f"<code>{html.escape(first_sha)}</code>", meta_cell_style),
                Paragraph(safe_msg, msg_style),
                Paragraph("<b>_____ / 10</b>", marks_style),
            ])

            for date_val, sha_val, msg_val in logs[1:]:
                safe_msg = html.escape(msg_val) if msg_val else "(No commit message)"
                log_table_data.append([
                    Paragraph(date_val, meta_cell_style),
                    Paragraph(f"<code>{html.escape(sha_val)}</code>", meta_cell_style),
                    Paragraph(safe_msg, msg_style),
                    "",
                ])
        else:
            log_table_data.append([
                Paragraph("—", meta_cell_style),
                Paragraph("—", meta_cell_style),
                Paragraph("No data submitted for this week.", msg_style),
                Paragraph("<b>_____ / 10</b>", marks_style),
            ])

        num_rows = len(log_table_data)
        log_table = Table(log_table_data, colWidths=[65, 50, 335, 90])

        t_style = [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#475569")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("ALIGN", (3, 0), (3, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 7.5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
            ("TOPPADDING", (0, 0), (-1, -1), 2.5),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("ROWBACKGROUNDS", (0, 1), (2, -1), [colors.white, colors.HexColor("#F8FAFC")]),
            ("SPAN", (3, 1), (3, num_rows - 1)),
            ("VALIGN", (3, 1), (3, num_rows - 1), "MIDDLE"),
            ("BACKGROUND", (3, 1), (3, num_rows - 1), colors.HexColor("#FEF3C7")),
        ]

        log_table.setStyle(TableStyle(t_style))
        student_section.append(log_table)
        student_section.append(Spacer(1, 5))
        story.append(KeepTogether(student_section))

    # 6. Symmetrical Signatures
    story.append(Spacer(1, 16))

    mentor_cell = [
        Paragraph("<b>Name:</b> ___________________________", sig_block_style),
        Paragraph("<b>Designation:</b> Project Mentor", sig_block_style),
        Spacer(1, 6),
        Paragraph("<b>Signature:</b> ________________________", sig_block_style),
    ]

    coordinator_cell = [
        Paragraph("<b>Name:</b> ___________________________", sig_block_style),
        Paragraph("<b>Designation:</b> Lab Coordinator", sig_block_style),
        Spacer(1, 6),
        Paragraph("<b>Signature:</b> ________________________", sig_block_style),
    ]

    sig_table = Table([[mentor_cell, coordinator_cell]], colWidths=[270, 270])
    sig_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (0, -1), 0),
        ("LEFTPADDING", (1, 0), (1, -1), 40),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
    ]))

    story.append(KeepTogether(sig_table))
    doc.build(story)

    print(f"\n[SUCCESS] Generated: {doc_name}")
    print(f" -> Week: {week_id}")
    print(f" -> Found {len(students)} student(s) and {total_commits} total commits.")
    return doc_name


# -------------------------------------------------------------
# CLI
# -------------------------------------------------------------
def parse_args():
    parser = argparse.ArgumentParser(description="Generate the weekly progress report from member JSON files.")
    parser.add_argument("interval", nargs="?", default="weekly", choices=["weekly"], help="Report type")
    parser.add_argument("--week", dest="week_id", default=None, help="ISO week, e.g. 2026-W38")
    parser.add_argument("--report-date", dest="report_date", default=None, help="Report date YYYY-MM-DD")
    parser.add_argument("--output-dir", dest="output_dir", default=str(DEFAULT_OUTPUT_DIR))
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    selected_date = (
        datetime.datetime.strptime(args.report_date, "%Y-%m-%d").date()
        if args.report_date
        else datetime.date.today()
    )
    generate_pdf(
        "weekly",
        week_id=args.week_id or current_week_id(selected_date),
        report_date=selected_date,
        output_dir=args.output_dir,
    )
