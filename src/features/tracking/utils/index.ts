export function getTimelineStatusKey(value: string | undefined | null): string {
  if (!value) return "submitted";
  
  const val = value.trim();
  switch (val) {
    case "Report submitted by citizen.":
    case "Issue submitted":
    case "submitted":
    case "Pending":
    case "pending":
      return "submitted";
      
    case "Assigned to the corresponding municipal department.":
    case "Assigned to department":
    case "Assigned":
    case "assigned":
      return "assigned";
      
    case "Inspection completed, field work started.":
    case "Inspection completed, field work started":
    case "Work started":
    case "inspectionStarted":
    case "inspection":
      return "inspectionStarted";
      
    case "In Progress":
    case "inProgress":
    case "in_progress":
      return "inProgress";
      
    case "Verified":
    case "AI verification completed":
    case "verified":
      return "verified";
      
    case "Resolved":
    case "Issue resolved":
    case "resolved":
      return "resolved";
      
    case "Closed":
    case "closed":
      return "closed";
      
    default:
      // If there are other formats, normalize or keep them
      return val;
  }
}
